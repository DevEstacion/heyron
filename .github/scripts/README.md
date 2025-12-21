# Medium Export Automation

This directory contains scripts to automatically export Hugo blog posts to Medium-compatible HTML.

## 📁 Directory Structure

```
.github/
├── scripts/
│   ├── strip-frontmatter.py    # Removes Hugo frontmatter
│   ├── convert-to-medium.mjs   # Converts markdown to Medium HTML
│   ├── package.json            # Node.js dependencies
│   └── README.md               # This file
├── medium-exports/             # Stripped markdown (temporary)
├── medium-html/                # Generated HTML files (ready for Medium)
└── workflows/
    └── export-to-medium.yml    # GitHub Actions workflow
```

## 🚀 Usage

### Option 1: GitHub Actions (Recommended)

1. Go to **Actions** tab in your repository
2. Select **"Export Posts to Medium"** workflow
3. Click **"Run workflow"**
4. Wait for completion (~30 seconds)
5. Download the `medium-exports-{run-number}` artifact
6. Open HTML file in browser → Select all (Ctrl/Cmd+A) → Copy (Ctrl/Cmd+C)
7. Paste into Medium's editor

### Option 2: Local Testing

```bash
# From repository root
./scripts/export-to-medium.sh

# View output
open .github/medium-html/welcome.html  # macOS
start .github/medium-html/welcome.html # Windows
xdg-open .github/medium-html/welcome.html # Linux
```

## 🔧 How It Works

### Step 1: Strip Frontmatter (`strip-frontmatter.py`)

- Removes Hugo YAML frontmatter (`---...---`)
- Converts relative image paths to absolute URLs:
  - `![alt](image.jpg)` → `![alt](https://heyron.dev/posts/welcome/image.jpg)`
- Handles page bundles (`welcome/index.md` → `welcome.md`)
- Output: `.github/medium-exports/*.md`

### Step 2: Convert to Medium HTML (`convert-to-medium.mjs`)

- Uses `marked` library to parse markdown
- Adds Medium-specific CSS classes:
  - `<h1 class="graf graf--h1">`
  - `<p class="graf graf--p">`
  - `<blockquote class="graf graf--blockquote">`
  - etc.
- Wraps in styled HTML document
- Output: `.github/medium-html/*.html`

## 📝 Supported Markdown Features

✅ **Fully Supported:**
- Headers (H1-H4)
- Paragraphs
- Bold/Italic
- Links
- Lists (ordered/unordered)
- Blockquotes
- Code blocks & inline code
- Images (converted to absolute URLs)
- Tables (basic HTML styling)

⚠️ **Limitations:**
- Tables render as HTML (not images or Gists like the web app)
- Complex HTML/CSS may need manual adjustment
- Embeds (YouTube, Twitter, etc.) need Medium's native tools

## 🔄 Adding New Posts

When you create a new post in `content/posts/`:

1. **Option A (Automated):** Run GitHub Actions workflow
2. **Option B (Local):** Run `./scripts/export-to-medium.sh`

The scripts automatically find all `.md` files in `content/posts/` (including subdirectories).

## 🛠️ Customization

### Change Base URL

Edit `BASE_URL` in [strip-frontmatter.py](strip-frontmatter.py):

```python
BASE_URL = "https://heyron.dev"  # Change to your domain
```

### Modify Styling

Edit CSS in [convert-to-medium.mjs](convert-to-medium.mjs) (lines 60-155).

### Add Table-to-Image Conversion

Requires Puppeteer (complex setup). See original [markdown2medium](https://github.com/DevEstacion/markdown2medium) for reference.

## 📦 Dependencies

- **Python 3.11+** (standard library only)
- **Node.js 20+**
- **npm packages:**
  - `marked@^14.1.3` - Markdown parser
  - `isomorphic-dompurify@^2.18.0` - HTML sanitizer

## 🐛 Troubleshooting

### No files found

```bash
# Check if posts exist
ls content/posts/**/*.md
```

### Windows path errors

The scripts handle Windows paths automatically using `Path.cwd()` checks.

### Module not found (Node.js)

```bash
cd .github/scripts
npm install
```

## 📄 License

MIT - Same as heyron blog repository.

## 🔗 Related

- Original tool: [markdown2medium](https://github.com/DevEstacion/markdown2medium)
- Hugo theme: [Dream](https://github.com/g1eny0ung/hugo-theme-dream)
