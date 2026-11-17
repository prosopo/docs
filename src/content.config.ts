import { type CollectionEntry, defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const isEnglishEntry = (entry: CollectionEntry<'docs'>): boolean =>
	entry.id.startsWith('en/');

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
};
