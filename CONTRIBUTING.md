# Contributing to Prosopo Docs

Contributions of any size are welcome — a typo fix, a clearer example, a missing page or a translation.

## Raising an issue

[Open an issue](https://github.com/prosopo/docs/issues/new) if something is missing, confusing or wrong. Say which page, what you expected, and what you found.

## Making a change

Small fixes: use the **Edit this page** link at the bottom of any page on [docs.prosopo.io](https://docs.prosopo.io/). GitHub will fork the repo and open a pull request for you.

Larger changes: work locally.

```sh
git clone git@github.com:prosopo/docs.git
cd docs
npm ci
npm run dev
```

Then open a pull request against `main`. Describe what changed and why, and link any related issue.

## Writing guidelines

- Write in plain English and sentence case.
- Keep examples copy-pasteable and use the [test keys](https://docs.prosopo.io/en/basics/test-keys/) rather than real site keys.
- Put images in `src/assets/` and import them with `astro:assets`.

## Translations

Pages live in `src/content/docs/<lang>/`, mirroring the English paths in `src/content/docs/en/`. A translated page must use the same file path as its English original; `npm run lint:slugcheck` checks this. Sidebar labels are translated in `src/i18n/<lang>/nav.ts`.

## Getting help

Ask in our [Discord](https://discord.gg/dwQx2w9Tgm).
