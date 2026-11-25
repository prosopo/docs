import { matchesPrefix } from './intent';
import { ctaTag, docsPath } from './signup';

export const BOT_TEST_URL = 'https://prosopo.io/tools/bot-vulnerability-test/';

export type BotTestPlacement = 'inline' | 'sidebar';

const PROTECT_PAGES: ReadonlyArray<string> = [
	'/portal/protect',
	'/portal/protect-traffic',
	'/portal/verdicts',
	'/protect-edge/index',
	'/protect-edge/cloudflare-worker',
	'/protect-edge/lambda-edge',
];

const protectPath = (pathname: string): string => {
	const path = docsPath(pathname);
	return path === '/protect-edge' ? '/protect-edge/index' : path;
};

export const showsBotTestCta = (pathname: string): boolean => {
	const path = protectPath(pathname);
	return PROTECT_PAGES.some((prefix: string): boolean => matchesPrefix(path, prefix));
};

/** Same `source`/`cta` attribution as the sign-up links, and likewise no UTM tags. */
export const botTestHref = (pathname: string, placement: BotTestPlacement): string => {
	const url = new URL(BOT_TEST_URL);
	url.searchParams.set('source', 'docs');
	url.searchParams.set('cta', ctaTag(pathname, placement));
	return url.toString();
};

export const BOT_TEST_EVENT_CLASS = 'plausible-event-name=Docs+Bot+Test';

export const botTestEventClasses = (placement: BotTestPlacement): string =>
	`${BOT_TEST_EVENT_CLASS} plausible-event-placement=${placement}`;
