import { normalizeLangTag } from '../src/i18n/bcp-normalize';
import AstroSitemap from '@astrojs/sitemap';
import languages from '../src/i18n/languages';
import type { AstroIntegration } from 'astro';

const langTags = Object.keys(languages);

/** Matches the `/[lang]/` redirect routes. */
const blocklist = new Set(langTags.map((lang) => `/${lang}/`));

/** Match a pathname starting with one of our language tags. */
const ValidRouteRE = new RegExp(`^/(${langTags.join('|')})/`);

/** Test a pathname is not in our blocklist and starts with a valid prefix. */
const isValidPath = (path: string) => !blocklist.has(path) && ValidRouteRE.test(path);

/** Get a preconfigured instance of the `@astrojs/sitemap` integration. */
export function sitemap(): AstroIntegration {
	return AstroSitemap({
		filter: (page) => isValidPath(new URL(page).pathname),
		i18n: {
			defaultLocale: 'en',
			locales: Object.fromEntries(langTags.map((lang) => [lang, normalizeLangTag(lang)])),
		},
	});
}
