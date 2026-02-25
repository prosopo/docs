export const allLanguages = {
	en: 'English',
	es: 'Español',
	'pt-br': 'Português do Brasil',
	it: 'Italiano',
	fr: 'Français',
	de: 'Deutsch',
	// 'zh-cn': '简体中文',
	// 'zh-tw': '正體中文',
	// hi: 'हिन्दी',
	// ar: 'العربية',
	// ja: '日本語',
	// ko: '한국어',
	// pl: 'Polski',
	// ru: 'Русский',
} as const;

// Build for two languages only to speed up Astro's smoke tests
const twoLanguages = {
	en: 'English',
	ko: '한국어',
} as const;

/**
 * Map of language codes to a written out language name.
 * Used to populate the language switcher in the navbar.
 */
export default import.meta.env?.PUBLIC_TWO_LANG ? twoLanguages : allLanguages;

export const rtlLanguages = new Set(['ar']);
