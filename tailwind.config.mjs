import starlightPlugin from '@astrojs/starlight-tailwind';

// Mirrors captcha-private packages/tailwind-preset/colors.js — keep in sync.
const accent = { 200: '#f7b3cb', 600: '#eb427e', 900: '#5e1a32', 950: '#2f0d19' };
const gray = {
	100: '#f2f0fb',
	200: '#e6e3f5',
	300: '#b7b2d0',
	400: '#8d87ad',
	500: '#5a5280',
	700: '#322c4a',
	800: '#1c1930',
	900: '#100d20',
};

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: { accent, gray },
			fontFamily: {
				sans: ['"Open Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
			},
		},
	},
	plugins: [starlightPlugin()],
};
