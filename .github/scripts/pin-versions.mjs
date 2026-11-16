#!/usr/bin/env node
// One-shot helper used to introduce exact pinning: rewrites every floating
// (^, ~, range, *, latest) specifier in dependencies/devDependencies/
// optionalDependencies to the exact version pnpm-lock.yaml already resolved it
// to. Because the lockfile is the source of truth for
// `pnpm install --frozen-lockfile`, this does NOT change what gets installed —
// it only makes package.json declare the version explicitly. peerDependencies
// are left untouched.
//
// Resolution: installed versions come from `pnpm list --recursive --json`, which
// reports each workspace project's direct dependencies as pnpm resolved them.
// Run `pnpm install` before this script, and again afterwards so the lockfile's
// recorded specifiers match the rewritten package.json files.

import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const ROOT = process.cwd();

// Skip git submodule working trees (separate repos, pinned in their own PRs).
function loadSubmodulePaths() {
	const paths = new Set();
	try {
		const txt = readFileSync(join(ROOT, ".gitmodules"), "utf8");
		for (const m of txt.matchAll(/^\s*path\s*=\s*(.+)\s*$/gm))
			paths.add(resolve(ROOT, m[1].trim()));
	} catch {}
	return paths;
}
const SUBMODULE_PATHS = loadSubmodulePaths();
const ENFORCED_SECTIONS = new Set([
	"dependencies",
	"devDependencies",
	"optionalDependencies",
]);
const IGNORE_DIRS = new Set([
	"node_modules",
	".git",
	"dist",
	"build",
	".next",
	".astro",
	".turbo",
	".nx",
	"coverage",
	".cache",
]);
const EXACT_SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

function isPinned(v) {
	v = v.trim();
	if (EXACT_SEMVER.test(v)) return true;
	if (v.startsWith("file:") || v.startsWith("link:")) return true;
	if (v.startsWith("workspace:")) return EXACT_SEMVER.test(v.slice(10));
	if (v.startsWith("npm:")) {
		const at = v.lastIndexOf("@");
		return at > 4 && EXACT_SEMVER.test(v.slice(at + 1));
	}
	if (/^(git\+|git:|github:|https?:)/.test(v)) return /#[0-9a-f]{40}$/.test(v);
	return false;
}

function findPackageJsons(dir, out = []) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) {
			if (IGNORE_DIRS.has(entry.name)) continue;
			if (SUBMODULE_PATHS.has(resolve(full))) continue;
			findPackageJsons(full, out);
		} else if (entry.name === "package.json") out.push(full);
	}
	return out;
}

// Map each workspace project's directory to section -> dep name -> version.
function loadInstalledVersions() {
	const out = execFileSync(
		"pnpm",
		["list", "--recursive", "--depth", "0", "--json"],
		{ cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
	);
	const projects = new Map();
	for (const project of JSON.parse(out)) {
		const sections = {};
		for (const section of ENFORCED_SECTIONS) {
			sections[section] = {};
			for (const [name, info] of Object.entries(project[section] || {})) {
				if (info?.version) sections[section][name] = info.version;
			}
		}
		projects.set(resolve(project.path), sections);
	}
	return projects;
}
const installed = loadInstalledVersions();

const pkgFiles = findPackageJsons(ROOT);
let totalChanged = 0;
const unresolved = [];

for (const file of pkgFiles) {
	const pkg = JSON.parse(readFileSync(file, "utf8"));
	// Standalone dirs that are not workspace projects have no resolved versions
	// here, so their ranges are floor-stripped below instead.
	const resolved = installed.get(resolve(dirname(file)));

	// Collect replacements: section -> name -> newVersion
	const targets = {};
	for (const section of ENFORCED_SECTIONS) {
		const deps = pkg[section];
		if (!deps) continue;
		for (const [name, spec] of Object.entries(deps)) {
			if (isPinned(String(spec))) continue;
			let v = resolved?.[section]?.[name] ?? null;
			// Fallback for packages not resolvable from the lockfile (standalone
			// dirs, or unlisted deps): pin a simple ^/~ range to its floor version,
			// which is an exact pin that stays within the declared major.
			if (!v) {
				const floor = /^[\^~](\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)$/.exec(
					String(spec).trim(),
				);
				if (floor) v = floor[1];
			}
			if (!v) {
				unresolved.push(
					`${relative(ROOT, file)}  ${section} > ${name} (${spec})`,
				);
				continue;
			}
			targets[section] ||= {};
			targets[section][name] = v;
		}
	}
	if (Object.keys(targets).length === 0) continue;

	// Rewrite via line walking to preserve formatting & key order.
	const lines = readFileSync(file, "utf8").split("\n");
	let curSection = null;
	let changed = 0;
	const sectionRe = /^(\s*)"([^"]+)"\s*:\s*\{/;
	const depRe = /^(\s*)"([^"]+)"\s*:\s*"([^"]*)"(,?)\s*$/;
	for (let i = 0; i < lines.length; i++) {
		const s = sectionRe.exec(lines[i]);
		if (s) {
			curSection = ENFORCED_SECTIONS.has(s[2]) ? s[2] : null;
			continue;
		}
		if (!curSection) continue;
		if (/^\s*\}/.test(lines[i])) {
			curSection = null;
			continue;
		}
		const m = depRe.exec(lines[i]);
		if (!m) continue;
		const [, indent, name, , comma] = m;
		const nv = targets[curSection]?.[name];
		if (nv) {
			lines[i] = `${indent}"${name}": "${nv}"${comma}`;
			changed++;
		}
	}
	if (changed > 0) {
		writeFileSync(file, lines.join("\n"));
		totalChanged += changed;
		console.log(`  ${relative(ROOT, file)}: pinned ${changed}`);
	}
}

console.log(
	`\nPinned ${totalChanged} specifier(s) across ${pkgFiles.length} package.json file(s).`,
);
if (unresolved.length) {
	console.log(`\nCould NOT resolve ${unresolved.length} (left unchanged):`);
	for (const u of unresolved) console.log(`  ${u}`);
}

if (totalChanged > 0) {
	console.log(
		"\nRun `pnpm install` to record the pinned specifiers in pnpm-lock.yaml.",
	);
}
