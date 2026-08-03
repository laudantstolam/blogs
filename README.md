# Obsidian Blogger

Publish an Obsidian vault as a static Astro blog.

Forked from [Beingpax/Obsidian-Blogger](https://github.com/Beingpax/Obsidian-Blogger) with a flexoki
theme and a bilingual-post system layered on top.

## Quick start

```bash
pnpm install
pnpm dev      # syncs vault -> src/content/blog, then starts dev server
pnpm build    # syncs, then builds static site to dist/
```

Any `.md` file under the repo root gets scanned; only ones with
`publish: true` in property are
copied into `src/content/blog/`. See `scripts/sync-obsidian.js`.

## Writing a post

```md
---
title: My Post
subtitle: optional subtitle
description: optional, used for SEO + card preview
publish: true
created_date: 2026-01-01
tags: [example]
---

Your content here.
```

Full schema: `src/content.config.ts`.

## Multi-language posts

One post can have translations as sibling files, all under the same slug
family. No per-post config needed — the pairing is derived from the
filename.

```
my-post.md         <- default language (no suffix)
my-post.en.md      <- English translation
my-post.ja.md      <- Japanese translation
```

Each version is written and published independently — a post with no
translations works exactly as before, and partially-translated posts just
show fewer languages in the switcher.

**Adding a language:** edit `src/i18n.ts`, nothing else.

```ts
export const DEFAULT_LANG = 'zh-tw';

export const LANGS: LangDef[] = [
	{ code: 'zh-tw', label: '中文' },
	{ code: 'en', label: 'EN' },
	// { code: 'ja', label: '日本語' },
];
```


## Project posts

`/projects` lists any post tagged `project` — no separate config, the cards
pull straight from that post's own frontmatter.

```md
---
title: My Project
description: required — shown on the card         # mandatory if tagged project
featured_image: https://example.com/preview.png    # mandatory if tagged project
tech: [python, flask]                               # optional, iconify simple-icons slugs
tags: [project]
---
```

`description` and `featured_image` are enforced at build time (schema
`superRefine` in `src/content.config.ts`) — a project-tagged post missing
either fails the build with the post title in the error. `tech` entries must
match an [iconify simple-icons](https://icon-sets.iconify.design/simple-icons/)
slug or the badge renders with no icon.

## Deployment

See `DEPLOYMENT.md` for GitHub Pages / custom domain setup
(`SITE_URL`/`BASE_URL` env vars, GitHub Actions workflow).

## Styling

See `DESIGN.md` for the current visual language and rationale (Flexoki
hairline-editorial, paper-sheet post layout, CJK font handling).