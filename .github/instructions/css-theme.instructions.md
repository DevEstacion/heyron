---
applyTo: '**'
---

# HeyRon Color System Architecture

## Single Source of Truth

**File:** [static/css/theme-colors.css](../../static/css/theme-colors.css)

All site colors are centrally defined in this file. This is the ONLY place where color hex codes or OKLCH values should be defined.

## Custom Color Palette

The site uses a 5-color palette with 9 shades each (100-900) defined in OKLCH format for consistent perceptual brightness:

### Palette Colors

- **shadow_grey** (`--shadow-grey-100` through `--shadow-grey-900`)
  - Deep charcoal tones for text and dark backgrounds
  - Base color: `#252323` (approximately `--shadow-grey-500`)

- **slate_grey** (`--slate-grey-100` through `--slate-grey-900`)
  - Cool blue-grey tones for primary actions and interactive elements
  - Base color: `#70798c` (approximately `--slate-grey-500`)

- **parchment** (`--parchment-100` through `--parchment-900`)
  - Warm off-white tones for light backgrounds
  - Base color: `#f5f1ed` (approximately `--parchment-100`)

- **bone** (`--bone-100` through `--bone-900`)
  - Neutral tan tones for secondary backgrounds
  - Base color: `#dad2bc` (approximately `--bone-200`)

- **khaki_beige** (`--khaki-beige-100` through `--khaki-beige-900`)
  - Warm mid-tones for accents and tertiary elements
  - Base color: `#a99985` (approximately `--khaki-beige-300`)

### Theme Mappings

**Light Mode (Emerald Override):**
- `--color-base-100`: `var(--parchment-100)` - Main background
- `--color-base-200`: `var(--bone-200)` - Secondary background
- `--color-base-300`: `var(--khaki-beige-300)` - Tertiary background
- `--color-base-content`: `var(--shadow-grey-800)` - Main text
- `--color-primary`: `var(--slate-grey-600)` - Primary actions
- `--color-primary-content`: `var(--parchment-100)` - Text on primary

**Dark Mode (Forest Override):**
- `--color-base-100`: `var(--shadow-grey-900)` - Main background
- `--color-base-200`: `var(--shadow-grey-800)` - Secondary background
- `--color-base-300`: `var(--slate-grey-800)` - Tertiary background
- `--color-base-content`: `var(--parchment-100)` - Main text
- `--color-primary`: `var(--slate-grey-400)` - Primary actions
- `--color-primary-content`: `var(--shadow-grey-900)` - Text on primary

## Usage Rules

### ✅ DO

**In CSS:** Always reference colors using `var()` syntax:
```css
.element {
  background-color: var(--color-base-100);
  color: var(--color-base-content);
  border-color: var(--color-primary);
}
```

**In JavaScript:** Dynamically read CSS variables using `getComputedStyle()`:
```javascript
const style = getComputedStyle(document.documentElement);
const primaryColor = style.getPropertyValue('--color-primary').trim();
const bgColor = style.getPropertyValue('--color-base-100').trim();
```

**Direct Palette Access:** Use palette variables when semantic colors don't fit:
```css
.custom-element {
  background: var(--slate-grey-300);
  border: 1px solid var(--bone-400);
}
```

### ❌ DON'T

**Never duplicate hex codes or OKLCH values:**
```css
/* WRONG - hardcoded color */
.element {
  background: #f5f1ed;
  color: oklch(16% 0.014 0);
}
```

**Never define new colors outside theme-colors.css:**
```css
/* WRONG - new color definition */
:root {
  --my-custom-blue: #3b82f6;
}
```

## Exceptions

### Semantic Colors (Preserved for Accessibility)

The following semantic colors are preserved from daisyUI and should NOT be overridden:

- `--color-success`: Green for success states
- `--color-warning`: Yellow for warning states
- `--color-error`: Red for error states
- `--color-info`: Blue for informational states

These colors provide universally recognizable visual feedback and meet accessibility standards.

### Syntax Highlighting (Preserved for Familiarity)

Giscus comment widget syntax highlighting uses GitHub's Prettylights color tokens (32 variables starting with `--color-prettylights-syntax-*`). These are preserved in [static/css/giscus-light.css](../../static/css/giscus-light.css) and [static/css/giscus-dark.css](../../static/css/giscus-dark.css) for code readability and user familiarity.

## Files Using Color System

### Core Theme Files
- [static/css/theme-colors.css](../../static/css/theme-colors.css) - **Single source of truth**
- [hugo.toml](../../hugo.toml) - Loads theme-colors.css first in `customCSS` array

### Files Referencing CSS Variables
- [layouts/_default/baseof.html](../../layouts/_default/baseof.html) - Mermaid diagram theming via `getComputedStyle()`
- [static/css/custom.css](../../static/css/custom.css) - Custom style overrides (uses rgba with opacity, safe)
- [static/css/giscus-light.css](../../static/css/giscus-light.css) - Comment widget light mode
- [static/css/giscus-dark.css](../../static/css/giscus-dark.css) - Comment widget dark mode

### Theme Infrastructure (Read-Only)
- [themes/dream/assets/css/output.css](../../themes/dream/assets/css/output.css) - daisyUI emerald/forest themes (git submodule, DO NOT EDIT)
- [themes/dream/layouts/partials/scripts.html](../../themes/dream/layouts/partials/scripts.html) - Sets `window.lightTheme`/`window.darkTheme` for Alpine.js

## Testing Color Changes

After modifying colors in theme-colors.css:

1. **Local Testing:** Run `hugo server -D` and verify:
   - Background colors change correctly
   - Text remains readable (sufficient contrast)
   - Mermaid diagrams render with correct colors
   - Giscus comments match theme

2. **Dark Mode Toggle:** Click theme toggle and verify:
   - All components switch simultaneously (page, diagrams, comments)
   - No flashing or color mismatch
   - Browser console shows no errors

3. **Production Deployment:** After pushing to main:
   - Wait for GitHub Actions build completion
   - Visit https://heyron.dev/ and verify colors load (check browser network tab for 404s)
   - Test theme toggle on deployed site
   - Verify Cloudflare proxy serves updated CSS (clear cache if needed)

## Color System Benefits

- **Consistency:** All colors derive from single source
- **Maintainability:** Change palette in one place, updates everywhere
- **Dark Mode:** Automatic theme switching via CSS cascade
- **Performance:** CSS variables resolve at paint time (no JavaScript overhead)
- **Type Safety:** Descriptive variable names prevent errors
- **Accessibility:** Semantic colors preserved, perceptual brightness via OKLCH
