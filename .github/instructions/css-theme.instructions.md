applyTo: '**'
---

# HeyRon Color System (Condensed)
- Single source: static/css/theme-colors.css only; never hardcode hex/OKLCH elsewhere.
- Palette families (100-900): shadow_grey, slate_grey, parchment, bone, khaki_beige. Light mapping: base=parchment-100/bone-200/khaki-beige-300, base-content=shadow-grey-800, primary=slate-grey-600 with parchment-100 text. Dark mapping: base=shadow-grey-900/800 + slate-grey-800, base-content=parchment-100, primary=slate-grey-400 with shadow-grey-900 text.
- Preserve semantic colors success/warning/error/info and Giscus prettylights tokens in static/css/giscus-{light,dark}.css.
- Always use var() in CSS; read via getComputedStyle in JS; theme-colors.css must be first in customCSS.
- For full project rules see .github/instructions/heyron-merged.instructions.md.
