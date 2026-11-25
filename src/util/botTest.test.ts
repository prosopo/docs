import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { botTestEventClasses, botTestHref, showsBotTestCta } from './botTest';
import { linkIntent } from './intent';
import { showsSiteKeyCta } from './signup';

describe('showsBotTestCta', () => {
	it('is shown on Protect pages in every locale', () => {
		for (const path of [
			'/en/portal/protect/',
			'/en/portal/protect-traffic/',
			'/de/portal/verdicts/',
			'/en/protect-edge/',
			'/en/protect-edge/cloudflare-worker/',
			'/fr/protect-edge/lambda-edge/',
		]) {
			assert.equal(showsBotTestCta(path), true, path);
		}
	});

	it('is not shown on troubleshooting, other portal or integration pages', () => {
		for (const path of [
			'/en/protect-edge/troubleshooting/',
			'/en/portal/sites/',
			'/en/portal/traffic/',
			'/en/basics/',
			'/en/welcome/',
		]) {
			assert.equal(showsBotTestCta(path), false, path);
		}
	});

	it('never shares a page with the site key sidebar', () => {
		for (const path of ['/en/portal/protect/', '/en/protect-edge/', '/en/basics/']) {
			assert.equal(showsBotTestCta(path) && showsSiteKeyCta(path), false, path);
		}
	});
});

describe('botTestHref', () => {
	it('carries the source, page and placement', () => {
		const url = new URL(botTestHref('/de/protect-edge/cloudflare-worker/', 'inline'));
		assert.equal(
			`${url.origin}${url.pathname}`,
			'https://prosopo.io/tools/bot-vulnerability-test/'
		);
		assert.equal(url.searchParams.get('source'), 'docs');
		assert.equal(url.searchParams.get('cta'), 'docs-inline-protect-edge-cloudflare-worker');
	});

	it('names the sidebar placement', () => {
		const url = new URL(botTestHref('/en/portal/verdicts/', 'sidebar'));
		assert.equal(url.searchParams.get('cta'), 'docs-sidebar-portal-verdicts');
	});

	it('never carries UTM tags, which would replace the visit source', () => {
		const url = new URL(botTestHref('/en/portal/protect/', 'inline'));
		assert.deepEqual(
			[...url.searchParams.keys()].filter((key: string): boolean => key.startsWith('utm_')),
			[]
		);
	});

	it('is tagged as a Protect link', () => {
		assert.match(linkIntent(botTestHref('/en/protect-edge/', 'inline')), /^protect:1, /);
	});
});

describe('botTestEventClasses', () => {
	it('names its own Plausible event and records the placement as a property', () => {
		assert.equal(
			botTestEventClasses('sidebar'),
			'plausible-event-name=Docs+Bot+Test plausible-event-placement=sidebar'
		);
	});
});
