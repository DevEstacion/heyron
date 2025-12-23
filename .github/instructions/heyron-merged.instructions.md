---
applyTo: '**'
---

# HeyRon Merged Instructions (Concise)

## Process & Safety
- Do the confidence loop: understand ask, gather context, rate confidence; proceed only if \>=95% (very easy tasks are exempt). If <95%, ask clarifying questions and list assumptions.
- Provide a step-by-step plan; for hard/very hard tasks create backups under /.backup/{path}/{filename}.bak and validate at phase end.
- Preserve existing style/APIs; prefer concrete edits; keep responses concise and actionable.

## Project Boundaries
- Dream theme is a submodule; never edit themes/dream. Put overrides in layouts/ with matching paths.
- Static assets live in static/ (css, img, js). Avoid assets/ unless Hugo processing is required. Avatar: static/img/avatar.jpg (set via avatar param).
- Custom CSS/JS: register via params.Advanced.customCSS/ customJS with theme-colors.css first.
- Giscus lives in layouts/partials/commentSystems.html + comments.html and uses static/css/giscus-{light,dark}.css.

## Hugo/Dream Configuration
- Required params: baseURL=https://heyron.dev/, defaultContentLanguage='en', theme='dream', zenMode=true, lightTheme='emerald', darkTheme='forest', giscus=true. Use Hugo Extended.
- Local: hugo server -D (served at /heyron/). Deploy: push main → GH Actions (Hugo extended 0.153.0) → gh-pages → Cloudflare proxied; workflow sets baseURL dynamically.
- Build hints: [build].writeStats=true; caching/image defaults from hugo.toml; use JPG over large PNG to avoid WebP errors.

## Color System (Single Source)
- Only define hex/OKLCH in static/css/theme-colors.css. Palette families (shades 100-900): shadow_grey, slate_grey, parchment, bone, khaki_beige.
- Light mapping: base-100 parchment-100, base-200 bone-200, base-300 khaki-beige-300, base-content shadow-grey-800, primary slate-grey-600 + primary-content parchment-100.
- Dark mapping: base-100 shadow-grey-900, base-200 shadow-grey-800, base-300 slate-grey-800, base-content parchment-100, primary slate-grey-400 + primary-content shadow-grey-900.
- Preserve semantic colors success/warning/error/info and Giscus prettylights tokens. Use var() in CSS; read via getComputedStyle in JS; never hardcode new hex or palette values elsewhere.
- Test color changes with hugo server -D: check backgrounds, text contrast, Mermaid, Giscus, and theme toggle.

## Content & Assets
- Use page bundles: content/posts/slug/index.md with cover + images/. Cover frontmatter uses bundled filename; keep images ~640px, <200KB, prefer JPG; convert PNG if WebP errors.
- Navigation/content defaults: page bundles for posts/about; co-locate resources; descriptive kebab-case names; consistent tags/categories.

## Troubleshooting Quick Hits
- Dark mode issues: ensure lightTheme/darkTheme set. CSS missing: confirm baseURL and defaultContentLanguage. WebP errors: convert PNG→JPG. Comments missing: giscus=true and correct partials/CSS.
