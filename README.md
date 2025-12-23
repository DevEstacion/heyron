# Medium Export HTML Files

This branch contains Medium-ready HTML exports of blog posts.

## Structure

Each post has its own folder:
```
post-name/
├── index.html      # Medium-ready HTML
└── images/         # Image files (PNG, JPEG, SVG)
    ├── diagram-1.svg
    └── cover.jpg
```

## Usage

### Method 1: Browser Copy-Paste
1. Browse to a post folder (e.g., `ai-spend-control-horizon/`)
2. Click on `index.html` → Click "Raw" or "Download"
3. Open downloaded file in browser
4. Select all (Ctrl/Cmd+A) → Copy (Ctrl/Cmd+C)
5. Paste into Medium's editor

### Method 2: Direct Image Upload
1. Download the post folder
2. Open `index.html` in a browser to preview
3. Manually upload images from `images/` folder to Medium
4. Update image URLs in Medium editor

## Files

Generated automatically by GitHub Actions workflow.
Last updated: $(date -u +"%Y-%m-%d %H:%M UTC")
