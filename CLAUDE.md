# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static marketing site (in French) for a 3D spatial-scanning / 3D valorisation studio, built with **Astro 5 + React 18 + Puck** (visual page editor) and **Tailwind 4** (via `@tailwindcss/vite`). Deployed to GitHub Pages at `https://immersive.nlab.fr`. All user-facing text, editor field labels and code comments are in French; keep it that way.

## Commands

```bash
npm run dev            # dev server; also enables the Puck editor at /edit and its save endpoint
npm run build          # production build to dist/
npm run build:strict   # runs scripts/check-drafts.mjs first, fails if placeholder content remains
npm run build:draft    # same as build (explicit "draft" build)
npm run preview        # serve dist/
```

There are no tests and no linter. Type-checking with `npx astro check` requires installing `@astrojs/check` first (not in the dependencies); tsconfig extends `astro/tsconfigs/strict`.

Deployment: `.github/workflows/deploy.yml` runs `withastro/action` on every push to `main`, which runs the plain `build` (not `build:strict`), so placeholder content does not block deployment.

## Architecture

**Content lives in JSON, not in pages.** Every page is a Puck `Data` document (`{ root: { props }, content: [...], zones }`) in `src/data/`:
- `src/data/pages/*.json` → one route per file via `src/pages/[slug].astro` (`accueil.json` is excluded there and rendered by `src/pages/index.astro` as `/`).
- `src/data/projets/*.json` → `/projets/<slug>` via `src/pages/projets/[slug].astro`.
- `src/data/site.json` → global header/footer settings, nav links, and the colour palette. It is imported directly by `Layout.astro` and `src/puck/config.tsx`, not routed.

Adding a page = adding a JSON file; routes are generated with `import.meta.glob`.

**Rendering:** pages render `<PageView data client:load />` (`src/puck/PageView.tsx`), which is Puck's `<Render>` with the shared `config` from `src/puck/config.tsx`. The root render wraps everything in `.site` and injects `SiteNav`/`SiteFooter` from `site.json`.

**Editor (dev only):** `/edit` lists every JSON under `src/data`; `/edit/<path>` mounts the Puck `<Editor>` (`client:only`). Publishing POSTs to `/__save?file=<path>`, a Vite middleware defined in `astro.config.mjs` that writes `src/data/<path>.json` (path whitelisted by regex: `pages/<slug>`, `projets/<slug>`, or `site`). In production builds the edit pages redirect to `/`. `site` uses a separate `siteConfig` (root fields only + a colour preview), everything else uses `config`.

**Blocks:** each file in `src/components/blocks/` exports a Puck `ComponentConfig` (label, fields, defaultProps, render). To add a block, create it there and register it in the `components` map in `src/puck/config.tsx`. `config.tsx` then automatically adds a `hidden` field to every block (kept in the JSON but not rendered on the public site; shown dimmed in the editor via `puck.isEditing`) and to every item of every `array` field (filtered out before render, prefixed "Masqué ·" in the editor list). Public pages also pass their data through `stripHidden()` (`src/lib/visibility.ts`) so hidden content isn't serialized into the HTML for hydration. It also adds `titleSize`/`textSize` fields to every block and wraps its render in `<div className="blk" data-tt data-ts>`; the CSS in `global.css` maps those attributes to `--tt`/`--ts` scale variables (the page root has equivalent `pageTitleSize`/`pageTextSize`). Shared helpers are in `blocks/shared.tsx`:
- `T`: renders text, highlighting `[[...]]` passages as `.todo` (invented / to-be-replaced copy).
- `Roll`, `Arrow`: hover animations for links/buttons.
- `Slot` + `mediaFields`: media placeholder that becomes an `<img>` (if the URL looks like an image) or an `<iframe>` (interactive 3D demo) when `src` is set.

**Placeholder-content convention:** `[[double brackets]]` mark invented copy; `"status": "attente"` marks pending projects/proofs (shown with an "En attente" badge). `scripts/check-drafts.mjs` counts `[[`, example values (`VOTRE_CLE`, `example.com`, `contact@votre-domaine`, `votre-profil`) and pending statuses across `src/data`; `build:strict` fails on the first two. Strip `[[`/`]]` when text is used outside `T` (see `Layout.astro`, `Roll`).

**Theming:** `src/lib/theme.ts` defines `PALETTE` (keys → `--c-<key>` CSS variables). `site.json` `palette` / `gradientAngle` are validated by `themeVars()` and set inline on `<html>` in `Layout.astro` (and on `.site` in the site editor). `global.css` defines the defaults and derives every surface/gradient from those variables, so colours should be changed through the palette, not hard-coded. Sections opt into surfaces with classes like `.dark`, `.grad`, `.band`.

**CSS gotcha:** in `global.css`, a comment containing a quoted single letter like `« V »` caused the Tailwind/Vite pipeline to silently drop the following rules. If a new rule doesn't show up in the browser, check the served CSS (`curl localhost:4321/src/styles/global.css`) and simplify the comments around it.

**Motion:** `src/scripts/motion.ts` (GSAP + ScrollTrigger + SplitText, Lenis smooth scroll) handles the first-visit loader, page-transition veil and scroll animations. It is only loaded on public pages (`Layout` with `noindex` = editor disables it), respects `prefers-reduced-motion`, and waits for Astro islands to hydrate before touching the DOM, because page content is React-rendered. `?intro` in the URL forces the loader.
