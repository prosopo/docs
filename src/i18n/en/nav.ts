/**
 * This configures the navigation sidebar.
 * All other languages follow this ordering/structure and will fall back to
 * English for any entries they haven’t translated.
 *
 * - All entries MUST include `text` and `key`
 * - The first entry MUST be a heading
 * - Heading entries MUST include `header: true` and `type`
 * - Heading entries MAY include `nested: true` to move that heading and following links under the previous unnested heading
 * - Heading entries MAY include `collapsed: true` to mark it and its children as collapsed by default
 * - Link entries MUST include `slug` (which excludes the language code)
 *
 * For translators:
 *
 * Copy the English `key` value unchanged and translate only the `text` into your language:
 *
 * `src/i18n/en/nav.ts`: `{ text: 'Getting Started', slug: 'getting-started', key: 'getting-started' },`
 * `src/i18n/ja/nav.ts`: `'getting-started': 'はじめに',`
 */
export default [
	{ text: 'Learn the Basics', header: true, type: 'learn', key: 'basics' },
	{
		text: 'Get Started',
		slug: 'basics/',
		key: 'basics/',
	},
	{
		text: 'Client Side Rendering',
		slug: 'basics/client-side-rendering',
		key: 'basics/client-side-rendering',
	},
	{
		text: 'Server Side Verification',
		slug: 'basics/server-side-verification',
		key: 'basics/server-side-verification',
	},
	{
		text: 'CAPTCHA Types',
		slug: 'basics/captcha-types',
		key: 'basics/captcha-types',
	},
	{
		text: 'Timeouts',
		slug: 'basics/timeouts',
		key: 'basics/timeouts',
	},
	{
		text: 'Frequently Asked Questions',
		slug: 'basics/faq',
		key: 'basics/faq',
	},
	{ text: 'Demos', header: true, type: 'learn', key: 'demos' },
	{
		text: 'React Frontend Client Example',
		slug: 'demos/client-example',
		key: 'demos/client-example',
	},
	{
		text: 'NodeJS Server Example',
		slug: 'demos/client-example-server',
		key: 'demos/client-example-server',
	},
	{
		text: 'HTML Frontend Client Example',
		slug: 'demos/client-example-bundle',
		key: 'demos/client-example-bundle',
	},
	{ text: 'Wordpress Plugin', header: true, type: 'learn', key: 'wordpress-plugin' },
	{
		text: 'Get Started With Wordpress',
		slug: 'wordpress-plugin/',
		key: 'wordpress-plugin/',
	},
	{
		text: 'Hooks',
		slug: 'wordpress-plugin/hooks',
		key: 'wordpress-plugin/hooks',
	},
	{
		text: 'Contact Form 7',
		slug: 'wordpress-plugin/contact-form-7',
		key: 'wordpress-plugin/contact-form-7',
	},
	{
		text: 'Fluent Forms',
		slug: 'wordpress-plugin/fluent-forms',
		key: 'wordpress-plugin/fluent-forms',
	},
	{
		text: 'Ninja Forms',
		slug: 'wordpress-plugin/ninja-forms',
		key: 'wordpress-plugin/ninja-forms',
	},
] satisfies NavEntry[];

type NavEntry = {
	/** The visible label for this link or heading. */
	text: string;
	/**
	 * A unique key for this entry. Used in translation files to provide a translation for this entry’s label.
	 * Often the same as `slug` for links (but doesn’t have to be).
	 */
	key: string;
} & (
	| {
			/** The content collection slug for this page *without* the language code. */
			slug: string;
	  }
	| {
			/** Marks this entry as a group heading and starts a new group. */
			header: true;
			/** Whether this group is in the learn or API category (currently unused). */
			type: 'learn' | 'api';
			/** Whether this group should be nested inside the preceding group. */
			nested?: boolean;
			/** Whether this group should be collapsed by default. */
			collapsed?: boolean;
	  }
);
