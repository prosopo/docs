# Prosopo Docs

[![ci](https://github.com/prosopo/docs/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/prosopo/docs/actions/workflows/ci.yml)
[![release](https://github.com/prosopo/docs/actions/workflows/release.yml/badge.svg?branch=main)](https://github.com/prosopo/docs/actions/workflows/release.yml)
[![auto-update-pr](https://github.com/prosopo/docs/actions/workflows/auto-update-pr.yml/badge.svg?branch=main)](https://github.com/prosopo/docs/actions/workflows/auto-update-pr.yml)
[![update_staging](https://github.com/prosopo/docs/actions/workflows/update_staging.yml/badge.svg?branch=main)](https://github.com/prosopo/docs/actions/workflows/update_staging.yml)
[![stale-pr-to-draft](https://github.com/prosopo/docs/actions/workflows/stale-pr-to-draft.yml/badge.svg?branch=main)](https://github.com/prosopo/docs/actions/workflows/stale-pr-to-draft.yml)
[![license](https://img.shields.io/github/license/prosopo/docs)](./LICENSE)

The source for [docs.prosopo.io](https://docs.prosopo.io/): how to add Procaptcha to a site, verify it on your server, and set up Prosopo Protect.

## Run it locally

Use the Node version in `.nvmrc` (`nvm use`) and the pnpm version in `package.json`'s `packageManager` (`corepack enable`).

```sh
pnpm install
pnpm run dev
```

The site is built with [Starlight](https://starlight.astro.build/). `pnpm run build` produces the static site in `dist/`.

## Where things live

- `src/content/docs/<lang>/` — the pages, one folder per language (`en` is the source; `de`, `es`, `fr`, `it` and `pt-br` are translations).
- `src/i18n/en/nav.ts` — the sidebar.
- `src/assets/` — screenshots and images used in pages.

## CI and deploys

- `.github/workflows/ci.yml` runs on every PR: it builds the site, checks every internal link in the build, lints the code (only when code or `package.json` changed) and lints the workflows. The build, lint and PR checks come from the shared stage workflows in [prosopo/github_actions](https://github.com/prosopo/github_actions).
- Netlify deploys the site from its git integration (`netlify.toml`); no workflow deploys it.
- `release.yml` cuts a GitHub release on a push to `main` or `staging`.

## Help out

- Found a mistake? [Open an issue](https://github.com/prosopo/docs/issues/new) or send a pull request.
- Want to talk it through first? Join us on [Discord](https://discord.gg/dwQx2w9Tgm).

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to make a change.
