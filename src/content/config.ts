import { type CollectionEntry, defineCollection } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';

export const isEnglishEntry = (entry: CollectionEntry<'docs'>): boolean =>
	entry.slug.startsWith('en/');

export const collections = {
	docs: defineCollection({ schema: docsSchema() }),
};
