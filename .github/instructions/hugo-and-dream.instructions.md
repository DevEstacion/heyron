applyTo: '**'
---

# Hugo & Dream (Condensed)
- Dream theme is a submodule; never edit themes/dream. Overrides go in layouts/ matching paths. Custom CSS/JS lives in static/ and is registered via params.Advanced (theme-colors.css first).
- Required config: baseURL=https://heyron.dev/, defaultContentLanguage='en', theme='dream', zenMode=true, lightTheme='emerald', darkTheme='forest', giscus=true; use Hugo Extended. Local: hugo server -D (served at /heyron/). Deploy: push main → GH Actions (Hugo extended 0.153.0, dynamic baseURL) → gh-pages → Cloudflare.
- Assets: keep in static/ (img/css/js). Page bundles for posts/about (content/posts/slug/index.md). Cover + images co-located; prefer JPG (<200KB) and convert large PNG if WebP errors. Avatar: static/img/avatar.jpg.
- Giscus overrides: layouts/partials/commentSystems.html + comments.html; themes in static/css/giscus-{light,dark}.css.
- Troubleshooting: dark mode depends on lightTheme/darkTheme; CSS issues often baseURL/defaultContentLanguage/customCSS path; WebP errors → convert PNG→JPG; comments missing → ensure giscus=true.
- For complete merged rules see .github/instructions/heyron-merged.instructions.md.
