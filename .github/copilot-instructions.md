# HeyRon Blog - AI Agent Instructions

## Project Overview
Hugo static blog using Dream theme (v3.x) with Zen mode, deployed to GitHub Pages at https://heyron.dev/ via Cloudflare proxy. Automated CI/CD with custom Giscus comments system.

## Architecture & Key Decisions

### Theme Customization Pattern
- Dream theme is a **git submodule** (`themes/dream`) - never edit directly
- Custom overrides go in root `layouts/` directory
- Current overrides:
  - `layouts/partials/commentSystems.html` - adds Giscus support to theme's comment system
  - `layouts/partials/comments.html` - Giscus widget with dynamic theme switching

### Hugo Configuration Critical Details
```toml
baseURL = 'https://heyron.dev/'        # Must match actual domain for asset paths
defaultContentLanguage = 'en'          # Required for proper asset generation
theme = 'dream'
zenMode = true                         # Single-column layout (vs masonry)
lightTheme = "emerald"                 # daisyUI theme - REQUIRED
darkTheme = "forest"                   # daisyUI theme - REQUIRED
giscus = true                          # Enables custom comment integration
```

**Critical**: `lightTheme` and `darkTheme` are **required** by Dream v3.x for dark mode toggle to work.

### Custom Giscus Integration
- Giscus uses custom CSS themes in `static/css/giscus-{light,dark}.css`
- Colors match daisyUI emerald (light) and forest (dark) themes
- Alpine.js reactive theme switching: watches `Alpine.store('darkMode').isDark()`
- Theme URLs: `https://heyron.dev/css/giscus-{light,dark}.css`
- Configured in `layouts/partials/comments.html` with repo ID and category ID

## Development Workflows

### Local Development
```bash
hugo server -D          # Runs on http://localhost:1313/heyron/ (NOT root path)
```

### Creating Content
```bash
hugo new content posts/my-post.md
```
Default template: `archetypes/default.md` (YAML frontmatter with tags/categories)

### Deployment Flow
1. Push to `main` branch
2. GitHub Actions builds with Hugo 0.153.0 extended
3. Deploys to GitHub Pages
4. Cloudflare proxies traffic (DNS records must be "Proxied" not "DNS only")

**Important**: GitHub workflow uses `--baseURL "${{ steps.pages.outputs.base_url }}/"` to dynamically set URL during build.

## Project-Specific Conventions

### File Organization
- Content: `content/posts/*.md` for blog posts, `content/about.md` for about page
- Static assets: `static/img/` for images, `static/css/` for custom CSS
- Never put assets in `assets/` unless Hugo needs to process them
- Theme assets: `themes/dream/assets/` (read-only, submodule)

### Hugo Extended vs Standard
- **Must use Hugo Extended** (for Sass/SCSS support in Dream theme)
- GitHub workflow explicitly installs `hugo_extended_*_linux-amd64.deb`

### Avatar Configuration
- Place avatar in `static/img/avatar.jpg` (or .png)
- Set in hugo.toml: `avatar = 'img/avatar.jpg'`
- Path is relative to `static/` folder

## Common Pitfalls

1. **Dark mode not working**: Missing `lightTheme`/`darkTheme` params in hugo.toml
2. **CSS not loading on deployed site**: `defaultContentLanguage` missing or wrong baseURL
3. **Comments not appearing**: Check `giscus = true` in params AND Giscus repo ID/category ID configured
4. **Submodule issues**: Always clone with `--recursive` or run `git submodule update --init --recursive`

## External Dependencies

- **GitHub Actions**: peaceiris actions for Hugo Pages deployment
- **Cloudflare**: Proxies traffic, provides SSL (must be "Proxied" status)
- **Giscus**: Comments via GitHub Discussions API
- **Dream Theme**: https://github.com/g1eny0ung/hugo-theme-dream (v3.x)
- **daisyUI**: CSS framework used by Dream theme (emerald/forest themes)
- **Alpine.js**: JavaScript framework used by Dream theme (for reactive dark mode)

## Key Files Reference
- `hugo.toml` - Main config (25 params, all critical)
- `.github/workflows/hugo.yml` - Deployment pipeline
- `layouts/partials/commentSystems.html` - Integrates Giscus into theme
- `layouts/partials/comments.html` - Giscus widget implementation
- `static/css/giscus-{light,dark}.css` - Custom comment themes
- `themes/dream/hugo.example.toml` - Reference for all available Dream theme params
