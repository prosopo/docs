import { spawnSync, type SpawnSyncReturns } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const docsRoot = path.resolve(import.meta.dirname, '..');
const tsm = path.join(docsRoot, 'node_modules', '.bin', 'tsm');
const linkcheckScript = path.join(docsRoot, 'scripts', 'lint-linkcheck.ts');
const filterWarnings = path.join(docsRoot, 'scripts', 'lib', 'filter-warnings.cjs');

const page = (body: string): string =>
	`<!doctype html><html lang="en"><head><title>t</title>` +
	`<link rel="canonical" href="https://docs.prosopo.io/en/getting-started/"></head>` +
	`<body><main>${body}</main></body></html>`;

// A build output shaped like `astro build` produces for docs.prosopo.io.
const writeFixtureSite = (siteDir: string, sitemapOrigin: string): void => {
	mkdirSync(path.join(siteDir, 'dist', 'en', 'getting-started'), { recursive: true });
	mkdirSync(path.join(siteDir, 'src', 'content', 'docs', 'en'), { recursive: true });
	writeFileSync(
		path.join(siteDir, 'dist', 'sitemap-0.xml'),
		`<?xml version="1.0" encoding="UTF-8"?><urlset>` +
			`<url><loc>${sitemapOrigin}/en/getting-started/</loc></url></urlset>`
	);
	writeFileSync(
		path.join(siteDir, 'dist', 'en', 'getting-started', 'index.html'),
		page('<a href="/en/does-not-exist/">A page that was never written</a>')
	);
	writeFileSync(
		path.join(siteDir, 'src', 'content', 'docs', 'en', 'getting-started.mdx'),
		'[A page that was never written](/en/does-not-exist/)\n'
	);
};

const runLinkcheck = (cwd: string): SpawnSyncReturns<string> =>
	spawnSync(tsm, ['--require', filterWarnings, linkcheckScript], {
		cwd,
		encoding: 'utf8',
		env: { ...process.env, CI: '' },
		timeout: 60_000,
	});

describe('lint-linkcheck', () => {
	let siteDir: string;

	beforeEach(() => {
		siteDir = mkdtempSync(path.join(tmpdir(), 'linkcheck-'));
	});

	afterEach(() => {
		rmSync(siteDir, { recursive: true, force: true });
	});

	it('checks the pages of a docs.prosopo.io build and reports their broken links', () => {
		writeFixtureSite(siteDir, 'https://docs.prosopo.io');

		const result = runLinkcheck(siteDir);

		expect(result.stdout + result.stderr).toContain('/en/does-not-exist/');
		expect(result.status).toBe(1);
	});

	it('fails instead of passing when the sitemap lists no docs.prosopo.io pages', () => {
		writeFixtureSite(siteDir, 'https://preview.example.com');

		const result = runLinkcheck(siteDir);

		expect(result.stdout + result.stderr).toContain('Found no pages');
		expect(result.status).not.toBe(0);
	});
});
