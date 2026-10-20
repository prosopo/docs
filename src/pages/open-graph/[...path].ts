import { type OGImageOptions, OGImageRoute } from 'astro-og-canvas';
import { allPages } from '~/content';
import { fetchBrandFont } from './_fetchFont';
import { getLangFromSlug } from '~/util';
import { rtlLanguages } from '~/i18n/languages';

const brandFont = await fetchBrandFont();

/** Paths for all of our Markdown content we want to generate OG images for. */
const paths = process.env.SKIP_OG ? [] : allPages;

/** An object mapping entry IDs to entry metadata. */
const pages = Object.fromEntries(paths.map(({ id, data }) => [id, data]));

export const { getStaticPaths, GET } = await OGImageRoute({
	pages,

	getSlug: (id) => `${id}.webp`,

	getImageOptions: async (id, data: (typeof pages)[string]): Promise<OGImageOptions> => {
		const isRtl = rtlLanguages.has(getLangFromSlug(id));
		return {
			format: 'WEBP',
			quality: 90,
			title: data.title,
			description: data.description,
			dir: isRtl ? 'rtl' : 'ltr',
			logo: {
				path: './src/pages/open-graph/_images/docs-logo.png',
				size: [300],
			},
			border: { width: 32, side: 'inline-start' },
			padding: 80,
			bgImage: {
				path: `./src/pages/open-graph/_images/background-${isRtl ? 'rtl' : 'ltr'}.png`,
			},
			font: {
				title: {
					size: 72,
					lineHeight: 1.2,
					families: [
						'Obviously',
						'Inter',
						'Noto Sans',
						'Noto Sans Arabic',
						'Noto Sans SC',
						'Noto Sans TC',
						'Noto Sans JP',
						'Noto Sans KR',
					],
					weight: 'Medium',
					color: [255, 255, 255],
				},
				description: {
					size: 42,
					lineHeight: 1.2,
					families: [
						'Inter',
						'Noto Sans',
						'Noto Sans Arabic',
						'Noto Sans SC',
						'Noto Sans TC',
						'Noto Sans JP',
						'Noto Sans KR',
					],
					weight: 'Normal',
					color: [191, 193, 201],
				},
			},
			fonts: [
				brandFont,

				'./src/pages/open-graph/_fonts/inter/inter-400-normal.ttf',
				'./src/pages/open-graph/_fonts/inter/inter-500-normal.ttf',

				'./src/pages/open-graph/_fonts/noto-sans/noto-400-normal.ttf',
				'./src/pages/open-graph/_fonts/noto-sans/noto-500-normal.ttf',

				'./src/pages/open-graph/_fonts/noto-sans/chinese-simplified-400-normal.otf',
				'./src/pages/open-graph/_fonts/noto-sans/chinese-simplified-500-normal.ttf',

				'./src/pages/open-graph/_fonts/noto-sans/chinese-traditional-400-normal.otf',
				'./src/pages/open-graph/_fonts/noto-sans/chinese-traditional-500-normal.ttf',

				'./src/pages/open-graph/_fonts/noto-sans/japanese-400-normal.ttf',
				'./src/pages/open-graph/_fonts/noto-sans/japanese-500-normal.ttf',

				'./src/pages/open-graph/_fonts/noto-sans/arabic-400-normal.ttf',
				'./src/pages/open-graph/_fonts/noto-sans/arabic-500-normal.ttf',

				'./src/pages/open-graph/_fonts/noto-sans/korean-400-normal.otf',
				'./src/pages/open-graph/_fonts/noto-sans/korean-500-normal.ttf',
			].filter((val): val is string => typeof val === 'string'),
		};
	},
});
