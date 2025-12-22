---
applyTo: '**'
---

# Hugo & Dream Theme Configuration Guide

## Quick Reference
- **Hugo Documentation**: https://gohugo.io/documentation/
- **Dream Theme Docs**: https://hugo-theme-dream.g1en.site/
- **Dream Theme GitHub**: https://github.com/g1eny0ung/hugo-theme-dream
- **DaisyUI Themes**: https://daisyui.com/docs/themes/

## Project Architecture

### Theme Setup
- Dream theme is a **git submodule** at `themes/dream`
- **NEVER edit theme files directly** - they will be overwritten on submodule updates
- Custom overrides go in root `layouts/` directory maintaining same structure

### Current Overrides
- `layouts/_default/single.html` - Custom post template with TLDR section, metadata icons
- `layouts/partials/comments.html` - Giscus comment widget
- `layouts/partials/commentSystems.html` - Integrates Giscus into theme's comment system

### Custom CSS
- Location: `static/css/custom.css`
- Loaded via: `params.Advanced.customCSS = ['css/custom.css']`
- Current styles: Uniform cover sizing, TLDR section styling

---

## Hugo Core Configuration

### Essential Settings

```toml
baseURL = 'https://heyron.dev/'        # MUST match actual domain for asset paths
title = 'HeyRon'
copyright = 'Ron'
defaultContentLanguage = 'en'          # REQUIRED for proper asset generation
theme = 'dream'                         # References themes/dream submodule
enableRobotsTXT = true
hasCJKLanguage = false
paginate = 10
```

**Critical Notes:**
- `baseURL`: Must match deployed URL or assets won't load correctly
- `defaultContentLanguage`: Required by Dream theme for proper CSS/JS generation
- `theme`: Must match submodule directory name in themes/

### Build Settings

```toml
[build]
writeStats = true                      # Generates hugo_stats.json for Tailwind purging
```

### Caches Configuration

```toml
[caches]
[caches.getjson]
dir = ":cacheDir/:project"
maxAge = "1h"

[caches.getcsv]
dir = ":cacheDir/:project"
maxAge = "1h"

[caches.getresource]
dir = ":cacheDir/:project"
maxAge = "1h"

[caches.images]
dir = ":resourceDir/_gen"
maxAge = -1                            # -1 means never expire

[caches.assets]
dir = ":resourceDir/_gen"
maxAge = -1

[caches.modules]
dir = ":cacheDir/modules"
maxAge = -1
```

**Cache Directories:**
- `:cacheDir` - Temporary cache (safe to delete)
- `:resourceDir` - Generated resources (committed to git)
- `:project` - Project-specific subdirectory

### Image Processing

```toml
[imaging]
anchor = 'Smart'                       # Smart crop focusing on interesting areas
bgColor = '#ffffff'
hint = 'photo'                         # Optimize for photos (vs drawings)
quality = 75                           # JPEG quality (1-100)
resampleFilter = 'Box'                 # Fast resampling

[imaging.exif]
disableDate = false
disableLatLong = true                  # Privacy: strip GPS data
excludeFields = 'ColorSpace|Lens|Orientation'
includeFields = ''
```

**Image Notes:**
- Hugo automatically creates WebP versions
- Large PNGs can cause WebP encoding errors - use JPG instead
- Quality 75 balances size and visual quality

### Minification

```toml
[minify]
disableCSS = false
disableHTML = false
disableJS = false
disableJSON = false
disableSVG = false
disableXML = false
minifyOutput = true

[minify.tdewolff.html]
keepWhitespace = false

[minify.tdewolff.css]
keepCSS2 = true
precision = 0

[minify.tdewolff.js]
keepVarNames = false
precision = 0
version = 2022
```

---

## Dream Theme Parameters

### Required Parameters

```toml
[params]
zenMode = true                         # REQUIRED for single-column layout
lightTheme = "emerald"                 # REQUIRED for dark mode toggle
darkTheme = "forest"                   # REQUIRED for dark mode toggle
```

**Critical:** `lightTheme` and `darkTheme` are REQUIRED by Dream v3.x for the dark mode toggle to function.

### Available DaisyUI Themes

**Light Themes:**
light, cupcake, bumblebee, emerald, corporate, synthwave, retro, cyberpunk, valentine, garden, aqua, lofi, pastel, fantasy, wireframe, cmyk, autumn, acid, lemonade, winter, nord, dim

**Dark Themes:**
dark, black, luxury, dracula, business, night, coffee, sunset, forest

### Visual Customization

```toml
[params]
backgroundImage = ''                   # Background image URL
darkBackgroundImage = ''               # Dark mode background
avatar = 'img/avatar.jpg'              # Path relative to static/
description = 'Site description'
author = 'Ron'
motto = ''
```

### Social Links

```toml
[params.social]
[[params.social]]
name = "github"
url = "https://github.com/username"

[[params.social]]
name = "twitter"
url = "https://twitter.com/username"
```

**Supported Icons:** All Font Awesome brands icons

### Navigation

```toml
[[params.nav]]
name = "About"
url = "/about/"

[[params.nav]]
name = "Tags"
url = "/tags/"
```

### Advanced Options

```toml
[params.Advanced]
customCSS = ['css/custom.css']         # Array of custom CSS files
customJS = []                          # Array of custom JS files
```

### Experimental Features

```toml
[params.Experimental]
jsDate = false                         # Client-side date rendering
jsDateFormat = 'yyyy-MM-dd'
```

### Comment Systems

```toml
[params]
giscus = true                          # Enable Giscus integration

utterances = false                     # Mutually exclusive comment systems
disqus = false
remark42 = false
```

**Note:** Only one comment system should be enabled at a time.

---

## Content Frontmatter Guide

### Standard Frontmatter

```yaml
---
title: "Post Title"
date: 2025-12-21
draft: false
tags: ["tag1", "tag2"]
categories: ["category"]
cover: "cover.jpg"                     # Relative to page bundle or static/
covercaption: "Image caption"
nolastmod: false                       # Hide "Updated" date
---
```

### Custom Frontmatter (HeyRon Specific)

```yaml
---
tldr: |                                # Optional TLDR section
  - Key point 1
  - Key point 2
  - Key point 3
---
```

**TLDR Notes:**
- Multiline YAML format using `|`
- Bullet points render as styled list
- Displayed at top of post after cover image
- Styled with neutral gray background matching theme

### Archetype Template

Default template: `archetypes/default.md`

```yaml
---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ .Date }}
draft: true
tags: []
categories: []
tldr: ""
---
```

---

## File Organization Best Practices

### Content Structure

```
content/
├── about/
│   └── index.md                       # About page
├── posts/
│   ├── post-slug/
│   │   ├── index.md                   # Post content
│   │   ├── cover.jpg                  # Cover image
│   │   └── images/                    # Inline images
│   │       ├── image-1.jpg
│   │       └── image-2.jpg
```

**Page Bundle Benefits:**
- Co-located content and resources
- Portable (move folder = move everything)
- Hugo processes images automatically
- Clean URLs

### Static Assets

```
static/
├── css/
│   ├── custom.css                     # Custom styles
│   ├── giscus-light.css               # Giscus light theme
│   └── giscus-dark.css                # Giscus dark theme
├── img/
│   └── avatar.jpg                     # Site avatar
```

**Static vs Assets:**
- `static/`: Files copied as-is (CSS, favicon, robots.txt)
- `assets/`: Files processed by Hugo (Sass, JS bundling)
- Dream theme uses `assets/` for Tailwind CSS generation

### Layout Overrides

```
layouts/
├── _default/
│   └── single.html                    # Override theme's post template
├── partials/
│   ├── comments.html                  # Custom partials
│   └── commentSystems.html
```

**Override Pattern:**
1. Copy theme file from `themes/dream/layouts/`
2. Paste to root `layouts/` with same directory structure
3. Modify copy (theme file remains untouched)

---

## Common Configuration Patterns

### Adding Custom CSS

**Step 1:** Create CSS file
```bash
# Create file: static/css/custom.css
```

**Step 2:** Register in hugo.toml
```toml
[params.Advanced]
customCSS = ['css/custom.css']
```

**Step 3:** Use theme-aware styling
```css
/* Light mode */
#dream-single-post-content .custom {
  background: rgba(0,0,0,0.03);
}

/* Dark mode */
html[class~="dark"] #dream-single-post-content .custom {
  background: rgba(255,255,255,0.05);
}
```

### Enabling Giscus Comments

**Step 1:** Enable in hugo.toml
```toml
[params]
giscus = true
```

**Step 2:** Create `layouts/partials/commentSystems.html`
```html
{{- if .Site.Params.giscus }}
  {{- partial "comments.html" . }}
{{- end }}
```

**Step 3:** Create `layouts/partials/comments.html`
```html
<script src="https://giscus.app/client.js"
        data-repo="owner/repo"
        data-repo-id="REPO_ID"
        data-category="Announcements"
        data-category-id="CATEGORY_ID"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="https://heyron.dev/css/giscus-light.css"
        data-lang="en"
        crossorigin="anonymous"
        async>
</script>
```

### Overriding Post Template

**Step 1:** Copy theme template
```bash
cp themes/dream/layouts/_default/single.html layouts/_default/single.html
```

**Step 2:** Modify copy for custom features
```html
<!-- Add custom TLDR section -->
{{ with .Params.tldr }}
<div class="tldr-section">
  <h2>TL;DR</h2>
  <div>{{ . | markdownify }}</div>
</div>
{{ end }}
```

**Step 3:** Test changes
```bash
hugo server -D
```

---

## Troubleshooting

### Dark Mode Not Working

**Symptoms:** Toggle doesn't appear or doesn't switch themes

**Fixes:**
1. Ensure `lightTheme` and `darkTheme` are set in hugo.toml
2. Clear browser cache and Hugo cache
3. Verify both themes exist in daisyUI theme list
4. Check browser console for JavaScript errors

### Custom CSS Not Loading

**Symptoms:** Styles not applied on deployed site

**Fixes:**
1. Verify `defaultContentLanguage = 'en'` is set
2. Check `baseURL` matches deployed URL exactly
3. Ensure file path in `customCSS` is relative to `static/`
4. Clear Hugo caches: `hugo mod clean --all`
5. Check browser network tab for 404s

### Images Not Displaying

**Symptoms:** Broken image links on deployed site

**Fixes:**
1. Verify image paths are relative to page bundle
2. Check file extensions match exactly (`.jpg` vs `.png`)
3. Ensure images are in `static/` or page bundle, not `assets/`
4. For large images, convert PNG to JPG to avoid WebP encoding errors
5. Rebuild: `hugo --gc --minify`

### Hugo WebP Encoding Error

**Symptoms:** `ERROR failed to encode image: webp: encoding error`

**Fixes:**
1. Convert PNG to JPG: `magick convert cover.png -quality 85 cover.jpg`
2. Reduce image size: `magick convert cover.jpg -resize 50% cover-small.jpg`
3. Use PowerShell System.Drawing for reliable conversion

### Build Performance Issues

**Symptoms:** Slow build times, high memory usage

**Fixes:**
1. Enable caching in hugo.toml (already configured)
2. Use `--gc` flag to clean up old resources
3. Reduce image quality in `[imaging]` section
4. Set `maxAge` on caches appropriately
5. Consider using `hugo server --disableFastRender` for debugging

---

## Development Workflow

### Local Development

```bash
# Start Hugo server with drafts
hugo server -D

# Access at http://localhost:1313/heyron/ (NOT root path)
```

### Creating New Posts

```bash
# Create new post with archetype template
hugo new content posts/my-post/index.md

# Edit with VS Code
code content/posts/my-post/index.md
```

### Adding Images to Posts

```bash
# Create images directory in page bundle
mkdir content/posts/my-post/images

# Copy images
cp ~/Downloads/image.jpg content/posts/my-post/images/

# Reference in markdown
![Description](images/image.jpg)
```

### Building for Production

```bash
# Build with minification and cleanup
hugo --gc --minify

# Output in public/ directory
```

### Deployment

Push to `main` branch → GitHub Actions workflow builds → Deploys to GitHub Pages → Cloudflare proxies traffic

**GitHub Workflow:**
- Uses Hugo 0.153.0-extended
- Sets baseURL dynamically: `--baseURL "${{ steps.pages.outputs.base_url }}/"`
- Deploys to `gh-pages` branch

---

## Project-Specific Conventions

### Hugo Extended Required

- **Must use Hugo Extended** for Sass/SCSS support
- GitHub workflow installs `hugo_extended_*_linux-amd64.deb`
- Dream theme requires extended version

### Theme Update Process

```bash
# Update Dream theme submodule
git submodule update --remote themes/dream

# Test locally
hugo server -D

# Commit if working
git add themes/dream
git commit -m "Update Dream theme to vX.Y.Z"
```

### Image Optimization Standards

- Cover images: Max 200KB, recommend JPG at 85% quality
- Inline images: Max 100KB each
- Preferred format: JPG for photos, PNG for screenshots/diagrams
- Avoid large PNGs (Hugo WebP encoder may fail)

### Custom Styling Philosophy

- Use theme-aware colors (rgba with light/dark variants)
- Prefer Tailwind utility classes when possible
- Custom CSS only for theme overrides
- Match daisyUI theme colors (emerald/forest)

### Content Organization

- Use page bundles for posts (posts/slug/index.md + resources)
- Keep images with content (portable)
- Use descriptive file names (kebab-case)
- Tag consistently, categorize broadly

---

## Resource Links

- **Hugo Documentation**: https://gohugo.io/documentation/
- **Hugo Image Processing**: https://gohugo.io/content-management/image-processing/
- **Dream Theme Docs**: https://hugo-theme-dream.g1en.site/
- **Dream GitHub**: https://github.com/g1eny0ung/hugo-theme-dream
- **DaisyUI Themes**: https://daisyui.com/docs/themes/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Alpine.js**: https://alpinejs.dev/start-here
- **Giscus**: https://giscus.app/
