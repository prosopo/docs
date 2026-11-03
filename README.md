# Prosopo Docs

The source for [docs.prosopo.io](https://docs.prosopo.io/): how to add Procaptcha to a site, verify it on your server, and set up Prosopo Protect.

## Run it locally

```sh
npm ci
npm run dev
```

The site is built with [Starlight](https://starlight.astro.build/). `npm run build` produces the static site in `dist/`.

## Where things live

- `src/content/docs/<lang>/` — the pages, one folder per language (`en` is the source; `de`, `es`, `fr`, `it` and `pt-br` are translations).
- `src/i18n/en/nav.ts` — the sidebar.
- `src/assets/` — screenshots and images used in pages.

## Help out

- Found a mistake? [Open an issue](https://github.com/prosopo/docs/issues/new) or send a pull request.
- Want to talk it through first? Join us on [Discord](https://discord.gg/dwQx2w9Tgm).

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to make a change.
