import { OGImageRoute } from 'astro-og-canvas';
import { allPages } from '~/content';

type OGImageOptions = Awaited<ReturnType<Parameters<typeof OGImageRoute>[0]['getImageOptions']>>;

/** Paths for all of our Markdown content we want to generate OG images for. */
const paths = process.env.SKIP_OG ? [] : allPages;

/** An object mapping file paths to file metadata. */
const pages = Object.fromEntries(paths.map(({ id, slug, data }) => [id, { data, slug }]));

export const { getStaticPaths, GET } = OGImageRoute({
	param: 'path',

	pages,

	getSlug(path) {
		path = path.replace(/^\/src\/pages\//, '');
		path = path.replace(/\.[^.]*$/, '') + '.webp';
		path = path.replace(/\/index\.webp$/, '.webp');
		return path;
	},

	getImageOptions: async (_, { data }: (typeof pages)[string]): Promise<OGImageOptions> => {
		return {
			format: 'WEBP',
			quality: 90,
			title: data.title,
			description: data.description,
			logo: {
				path: './src/pages/open-graph/_images/docs-logo.png',
				size: [300],
			},
			border: { width: 32, side: 'inline-start' },
			padding: 80,
			bgImage: {
				path: './src/pages/open-graph/_images/background.png',
			},
			font: {
				title: {
					size: 72,
					lineHeight: 1.2,
					families: [
						'Inter',
						'Noto Sans',
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
					],
					weight: 'Normal',
					color: [191, 193, 201],
				},
			},
			fonts: [
				'./src/pages/open-graph/_fonts/inter/inter-400-normal.ttf',
				'./src/pages/open-graph/_fonts/inter/inter-500-normal.ttf',
				'./src/pages/open-graph/_fonts/noto-sans/noto-400-normal.ttf',
				'./src/pages/open-graph/_fonts/noto-sans/noto-500-normal.ttf',
			],
		};
	},
});
