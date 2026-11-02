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
 * `src/i18n/en/nav.ts`: `{ text: 'Getting started', slug: 'getting-started', key: 'getting-started' },`
 * `src/i18n/ja/nav.ts`: `'getting-started': 'はじめに',`
 */
export default [
    {text: 'Learn the basics', header: true, type: 'learn', key: 'basics'},
    {
        text: 'Get started',
        slug: 'basics/',
        key: 'basics/',
    },
    {
        text: 'Client-side rendering',
        slug: 'basics/client-side-rendering',
        key: 'basics/client-side-rendering',
    },
    {
        text: 'Server-side verification',
        slug: 'basics/server-side-verification',
        key: 'basics/server-side-verification',
    },
    {
        text: 'CAPTCHA types',
        slug: 'basics/captcha-types',
        key: 'basics/captcha-types',
    },
    {
        text: 'Invisible CAPTCHA (Beta)',
        slug: 'basics/invisible-captcha',
        key: 'basics/invisible-captcha',
    },
    {
        text: 'Safety threshold',
        slug: 'basics/safety-threshold',
        key: 'basics/safety-threshold',
    },

    {
        text: 'Test site keys',
        slug: 'basics/test-keys',
        key: 'basics/test-keys',
    },

    {
        text: 'Frequently asked questions',
        slug: 'basics/faq',
        key: 'basics/faq',
    },
    {
        text: 'Error reference',
        slug: 'basics/error-reference',
        key: 'basics/error-reference',
    },
    {
        text: 'Demo keys',
        slug: 'basics/demo-keys',
        key: 'basics/demo-keys',
    },
    {text: 'Advanced usage', header: true, type: 'learn', key: 'advanced'},
    {
        text: 'Context awareness',
        slug: 'advanced/context-awareness',
        key: 'advanced/context-awareness',
    },
    {
        text: 'IP validation rules',
        slug: 'advanced/ip-validation-rules',
        key: 'advanced/ip-validation-rules',
    },
    {
        text: 'Access control rules',
        slug: 'advanced/access-control-rules',
        key: 'advanced/access-control-rules',
    },
    {
        text: 'Traffic filter',
        slug: 'advanced/traffic-filter',
        key: 'advanced/traffic-filter',
    },
    {
        text: 'Email filter',
        slug: 'advanced/spam-filter',
        key: 'advanced/spam-filter',
    },
    {
        text: 'Geo blocking',
        slug: 'advanced/geo-blocking',
        key: 'advanced/geo-blocking',
    },
    {
        text: 'Honeypot',
        slug: 'advanced/honeypot',
        key: 'advanced/honeypot',
    },
    {
        text: 'CAPTCHA timeouts',
        slug: 'advanced/captcha-timeouts',
        key: 'advanced/captcha-timeouts',
    },
    {
        text: 'Image accuracy threshold',
        slug: 'advanced/image-threshold',
        key: 'advanced/image-threshold',
    },
    {
        text: 'API keys',
        slug: 'advanced/api-keys',
        key: 'advanced/api-keys',
    },
    {
        text: 'API',
        slug: 'advanced/api',
        key: 'advanced/api',
    },
    {
        text: 'Audit',
        slug: 'advanced/audit',
        key: 'advanced/audit',
    },
    {text: 'Self-hosting', header: true, type: 'learn', key: 'self-hosting'},
    {
        text: 'Run your own provider',
        slug: 'self-hosting/',
        key: 'self-hosting/',
    },
    {
        text: 'Run it on Cloudflare (free)',
        slug: 'self-hosting/cloudflare/',
        key: 'self-hosting/cloudflare/',
    },
    {text: 'Prosopo Protect (Edge)', header: true, type: 'learn', key: 'protect-edge'},
    {
        text: 'Overview',
        slug: 'protect-edge/',
        key: 'protect-edge/',
    },
    {
        text: 'Cloudflare Worker',
        slug: 'protect-edge/cloudflare-worker',
        key: 'protect-edge/cloudflare-worker',
    },
    {
        text: 'AWS Lambda@Edge',
        slug: 'protect-edge/lambda-edge',
        key: 'protect-edge/lambda-edge',
    },
    {
        text: 'Troubleshooting',
        slug: 'protect-edge/troubleshooting',
        key: 'protect-edge/troubleshooting',
    },
    {text: 'Framework integrations', header: true, type: 'learn', key: 'framework-integrations'},
    {
        text: 'Angular',
        slug: 'framework-integrations/angular-integration',
        key: 'framework-integrations/angular-integration',
    },
    {
        text: 'React',
        slug: 'framework-integrations/react-integration',
        key: 'framework-integrations/react-integration',
    },
    {
        text: 'Svelte',
        slug: 'framework-integrations/svelte-integration',
        key: 'framework-integrations/svelte-integration',
    },
    {
        text: 'Vue',
        slug: 'framework-integrations/vue-integration',
        key: 'framework-integrations/vue-integration',
    },
    {text: 'Platform integrations', header: true, type: 'learn', key: 'integrations'},
    {
        text: 'Qualtrics',
        slug: 'integrations/qualtrics',
        key: 'integrations/qualtrics',
    },
    {text: 'Demos', header: true, type: 'learn', key: 'demos'},
    {
        text: 'HTML front-end client example',
        slug: 'demos/client-example-bundle',
        key: 'demos/client-example-bundle',
    },
    {
        text: 'Node.js server example',
        slug: 'demos/client-example-server',
        key: 'demos/client-example-server',
    },
    {text: 'WordPress plugin', header: true, type: 'learn', key: 'wordpress-plugin'},
    {
        text: 'Get started with WordPress',
        slug: 'wordpress-plugin/',
        key: 'wordpress-plugin/',
    },
    {
        text: 'Hooks',
        slug: 'wordpress-plugin/hooks',
        key: 'wordpress-plugin/hooks',
    },
    {
        text: 'Form integration guides',
        header: true,
        type: 'learn',
        key: 'form-integration-guides',
        nested: true,
    },
    {
        text: 'Contact Form 7',
        slug: 'wordpress-plugin/contact-form-7',
        key: 'wordpress-plugin/contact-form-7',
    },
    {
        text: 'Everest Forms',
        slug: 'wordpress-plugin/everest-forms',
        key: 'wordpress-plugin/everest-forms',
    },
    {
        text: 'Fluent Forms',
        slug: 'wordpress-plugin/fluent-forms',
        key: 'wordpress-plugin/fluent-forms',
    },
    {
        text: 'Formidable',
        slug: 'wordpress-plugin/formidable',
        key: 'wordpress-plugin/formidable',
    },
    {
        text: 'Gravity Forms',
        slug: 'wordpress-plugin/gravity-forms',
        key: 'wordpress-plugin/gravity-forms',
    },
    {
        text: 'JetFormBuilder',
        slug: 'wordpress-plugin/jetformbuilder',
        key: 'wordpress-plugin/jetformbuilder',
    },
    {
        text: 'Ninja Forms',
        slug: 'wordpress-plugin/ninja-forms',
        key: 'wordpress-plugin/ninja-forms',
    },
    {
        text: 'User Registration',
        slug: 'wordpress-plugin/user-registration',
        key: 'wordpress-plugin/user-registration',
    },
    {
        text: 'WPForms',
        slug: 'wordpress-plugin/wpforms',
        key: 'wordpress-plugin/wpforms',
    },
    {
        text: 'Other integration guides',
        header: true,
        type: 'learn',
        key: 'other-integration-guides',
        nested: true,
    },
    {
        text: 'Beaver Builder',
        slug: 'wordpress-plugin/beaver-builder',
        key: 'wordpress-plugin/beaver-builder',
    },
    {
        text: 'Blocksy',
        slug: 'wordpress-plugin/blocksy',
        key: 'wordpress-plugin/blocksy',
    },
    {
        text: 'Bricks',
        slug: 'wordpress-plugin/bricks',
        key: 'wordpress-plugin/bricks',
    },
    {
        text: 'Divi',
        slug: 'wordpress-plugin/divi',
        key: 'wordpress-plugin/divi',
    },
    {
        text: 'LearnDash LMS',
        slug: 'wordpress-plugin/learndash',
        key: 'wordpress-plugin/learndash',
    },
    {
        text: 'MemberPress',
        slug: 'wordpress-plugin/memberpress',
        key: 'wordpress-plugin/memberpress',
    },
    {
        text: 'bbPress',
        slug: 'wordpress-plugin/bbpress',
        key: 'wordpress-plugin/bbpress',
    },
    {
        text: 'Elementor Pro',
        slug: 'wordpress-plugin/elementor-pro',
        key: 'wordpress-plugin/elementor-pro',
    },
    {
        text: 'Jetpack',
        slug: 'wordpress-plugin/jetpack',
        key: 'wordpress-plugin/jetpack',
    },
    {
        text: 'WooCommerce',
        slug: 'wordpress-plugin/woocommerce',
        key: 'wordpress-plugin/woocommerce',
    },
    {
        text: 'Spectra',
        slug: 'wordpress-plugin/spectra',
        key: 'wordpress-plugin/spectra',
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
