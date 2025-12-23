# HeyRon AI Agent Notes (Condensed)
- Project: Hugo + Dream v3 with Zen mode; deploy via GitHub Actions → gh-pages → Cloudflare. Dream is a submodule—never edit themes/dream; overrides live in layouts/.
- Required config: baseURL=https://heyron.dev/, defaultContentLanguage='en', theme='dream', zenMode=true, lightTheme='emerald', darkTheme='forest', giscus=true; Hugo Extended only.
- Custom CSS/JS: static/ assets, register via params.Advanced (theme-colors.css first). Giscus partials in layouts/partials/commentSystems.html + comments.html with static/css/giscus-{light,dark}.css.
- Local: hugo server -D served at /heyron/. Deployment workflow sets baseURL dynamically.
- Colors: single source static/css/theme-colors.css; no new hex/OKLCH elsewhere.
- See .github/instructions/heyron-merged.instructions.md for full merged rules.
