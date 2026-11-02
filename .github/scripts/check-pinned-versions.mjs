#!/usr/bin/env node
// Supply-chain guard: fail CI if any package.json declares a non-exact (floating)
// version for a runtime dependency, or if pnpm-lock.yaml is missing integrity
// hashes for resolved registry packages.
//
// Floating ranges (^, ~, *, >=, "latest", ...) let `pnpm install` silently pull a
// newer release than the one that was reviewed. When that newer release is
// malicious, every fresh install / CI run is compromised before anyone notices.
// Recent npm supply-chain attacks that worked exactly this way:
//   - Sep 2025  "Shai-Hulud" self-replicating worm — trojanised 500+ packages
//                (incl. @ctrl/tinycolor, ~2.2M weekly downloads) to steal npm/cloud
//                tokens and auto-publish from any maintainer it infected.
//   - Sep 2025  chalk / debug / ansi-styles et al. — 18 packages with ~2.6B weekly
//                downloads hijacked via a maintainer phish to inject a crypto-wallet
//                drainer.
//   - Aug 2025  nx (and @nx/* plugins) — malicious postinstall harvested SSH keys,
//                npm tokens and wallets, exfiltrating via attacker-created repos.
//   - Oct 2021  ua-parser-js — popular parser hijacked to drop a crypto-miner and
//                password stealer on install.
//   - Nov 2018  event-stream / flatmap-stream — transitive dep backdoored to steal
//                bitcoin-wallet credentials.
// Pinning exact versions + committing the lockfile + `pnpm install --frozen-lockfile`
// means a new malicious release is NOT pulled until the version is explicitly
// bumped and reviewed.
//
// peerDependencies are intentionally exempt: they express a compatibility *range*
// against whatever the consumer installs, so pinning them would wrongly constrain
// downstream projects. The actually-installed peer is still pinned by the lockfile.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const ROOT = process.cwd();

// Git submodules are separate repositories with their own copy of this check;
// skip their working trees so each repo only validates the files it owns.
function loadSubmodulePaths() {
	const paths = new Set();
	try {
		const txt = readFileSync(join(ROOT, ".gitmodules"), "utf8");
		for (const m of txt.matchAll(/^\s*path\s*=\s*(.+)\s*$/gm)) {
			paths.add(resolve(ROOT, m[1].trim()));
		}
	} catch {
		/* no submodules */
	}
	return paths;
}
const SUBMODULE_PATHS = loadSubmodulePaths();

// Sections whose versions MUST be an exact, single version.
const ENFORCED_SECTIONS = [
	"dependencies",
	"devDependencies",
	"optionalDependencies",
];
// peerDependencies are allowed to use ranges (see header).

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

const errors = [];

/** Recursively collect package.json paths, skipping vendored/build dirs. */
function findPackageJsons(dir, out = []) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) {
			if (IGNORE_DIRS.has(entry.name)) continue;
			if (SUBMODULE_PATHS.has(resolve(full))) continue;
			findPackageJsons(full, out);
		} else if (entry.name === "package.json") {
			out.push(full);
		}
	}
	return out;
}

/**
 * Is `spec` an acceptable, non-floating dependency specifier?
 * Accepts: an exact semver (1.2.3, 1.2.3-rc.1+build), or a non-registry
 * specifier that is inherently pinned (file:, link:, exact npm: alias).
 * Rejects: ^, ~, *, x, latest, >=, <, ||, " - " ranges and bare/empty values.
 */
const EXACT_SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

function isPinned(spec) {
	const v = String(spec).trim();
	if (EXACT_SEMVER.test(v)) return true;

	// Local sources are pinned by definition.
	if (v.startsWith("file:") || v.startsWith("link:")) return true;

	// Workspace protocol with an explicit version (workspace:1.2.3). Reject
	// floating workspace ranges (workspace:*, workspace:^).
	if (v.startsWith("workspace:")) {
		const rest = v.slice("workspace:".length);
		return EXACT_SEMVER.test(rest);
	}

	// npm alias: must point at an exact version (npm:pkg@1.2.3).
	if (v.startsWith("npm:")) {
		const at = v.lastIndexOf("@");
		return at > "npm:".length && EXACT_SEMVER.test(v.slice(at + 1));
	}

	// git/github/url specifiers are only pinned if they carry a commit SHA.
	if (/^(git\+|git:|github:|https?:)/.test(v)) {
		return /#[0-9a-f]{40}$/.test(v);
	}

	return false;
}

function checkPackageJson(file) {
	let pkg;
	try {
		pkg = JSON.parse(readFileSync(file, "utf8"));
	} catch (e) {
		errors.push(`${relative(ROOT, file)}: invalid JSON (${e.message})`);
		return;
	}
	for (const section of ENFORCED_SECTIONS) {
		const deps = pkg[section];
		if (!deps || typeof deps !== "object") continue;
		for (const [name, spec] of Object.entries(deps)) {
			if (!isPinned(spec)) {
				errors.push(
					`${relative(ROOT, file)}  ${section} > "${name}": "${spec}" is not an exact version`,
				);
			}
		}
	}
}

/**
 * Every resolved registry package in the lockfile must carry an integrity hash,
 * so a tampered tarball cannot be substituted for the reviewed one.
 *
 * pnpm-lock.yaml is parsed line by line so this check runs without installing
 * a YAML parser. pnpm writes each `packages:` entry as a two-space-indented key
 * followed by a four-space-indented flow-style `resolution: {...}` line.
 */
function checkLockfile(file) {
	const rel = relative(ROOT, file);
	const lines = readFileSync(file, "utf8").split("\n");

	const rawVersion =
		lines
			.find((l) => l.startsWith("lockfileVersion:"))
			?.replace(/^lockfileVersion:\s*/, "")
			.replace(/['"]/g, "") ?? "(missing)";
	if (!(Number.parseFloat(rawVersion) >= 9)) {
		errors.push(
			`${rel}: lockfileVersion ${rawVersion} is not supported; needs pnpm lockfile v9+`,
		);
		return;
	}

	let inPackages = false;
	let current = null;
	const unresolved = new Set();
	for (const line of lines) {
		if (/^\S/.test(line)) {
			inPackages = line === "packages:";
			current = null;
			continue;
		}
		if (!inPackages) continue;
		const key = /^ {2}(\S.*):$/.exec(line);
		if (key) {
			current = key[1].replace(/^'(.*)'$/, "$1");
			unresolved.add(current);
			continue;
		}
		const res = /^ {4}resolution:\s*\{(.*)\}\s*$/.exec(line);
		if (!res || current === null) continue;
		unresolved.delete(current);
		const fields = res[1];
		// git and local directory deps are pinned by commit / path instead.
		if (/\btype:\s*(git|directory)\b/.test(fields)) continue;
		// A bare tarball URL outside the registry is pinned by the URL itself.
		const tarball = /\btarball:\s*([^,\s}]+)/.exec(fields)?.[1] ?? "";
		const isRegistry =
			tarball === "" || /^https?:\/\/[^/]*registry\./.test(tarball);
		if (isRegistry && !/\bintegrity:\s*\S/.test(fields)) {
			errors.push(`${rel}  ${current}: missing integrity hash`);
		}
	}
	for (const name of unresolved) {
		errors.push(`${rel}  ${name}: no resolution entry`);
	}
}

const pkgFiles = findPackageJsons(ROOT);
for (const f of pkgFiles) checkPackageJson(f);

// Lockfiles live next to each package.json that owns one.
const seenLocks = new Set();
for (const f of pkgFiles) {
	const lock = join(dirname(f), "pnpm-lock.yaml");
	if (seenLocks.has(lock)) continue;
	try {
		statSync(lock);
		seenLocks.add(lock);
		checkLockfile(lock);
	} catch {
		/* no lockfile here */
	}
}

if (errors.length > 0) {
	console.error(
		`✖ Found ${errors.length} unpinned dependency / lockfile issue(s):\n`,
	);
	for (const e of errors) console.error(`  ${e}`);
	console.error(
		"\nDependencies in dependencies/devDependencies/optionalDependencies must use an" +
			'\nexact version (e.g. "1.2.3", not "^1.2.3"). peerDependencies may use ranges.' +
			"\nThis prevents `pnpm install` from silently pulling a malicious newer release." +
			"\nRun `node .github/scripts/check-pinned-versions.mjs` locally to reproduce.",
	);
	process.exit(1);
}

console.log(
	`✔ ${pkgFiles.length} package.json file(s) and ${seenLocks.size} lockfile(s) use exact, pinned versions.`,
);
