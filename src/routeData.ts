import { defineRouteMiddleware, type StarlightRouteData } from '@astrojs/starlight/route-data';
import { getCollection } from 'astro:content';
import { isSubPage } from '~/util/isSubPage';
import { stripLangFromSlug } from '~/util';

type SidebarEntry = StarlightRouteData['sidebar'][number];

const stripLeadingAndTrailingSlashes = (path: string): string => path.replace(/^\/+|\/+$/g, '');

let docIds: Promise<Set<string>> | undefined;
const getDocIds = (): Promise<Set<string>> =>
	(docIds ??= getCollection('docs').then((entries) => new Set(entries.map(({ id }) => id))));

/** Mark sub-pages as current and flag links whose page has no translation in this locale. */
function remapSidebarEntry(entry: SidebarEntry, currentSlug: string, ids: Set<string>): void {
	if (entry.type === 'group') {
		entry.entries.forEach((child) => remapSidebarEntry(child, currentSlug, ids));
		return;
	}

	const itemSlug = stripLeadingAndTrailingSlashes(entry.href);
	entry.isCurrent = isSubPage(currentSlug, stripLangFromSlug(itemSlug));
	entry.attrs.class = ids.has(itemSlug) ? undefined : 'fallback';
}

export const onRequest = defineRouteMiddleware(async (context) => {
	const route = context.locals.starlightRoute;
	const ids = await getDocIds();
	route.sidebar.forEach((entry) => remapSidebarEntry(entry, route.id, ids));
});
