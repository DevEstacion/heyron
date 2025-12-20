# HeyRon Blog

A Hugo-powered blog with automated deployment to GitHub Pages and Giscus comments integration.

## Features

- 🎨 **Dream Theme** - Beautiful and responsive Hugo theme
- 🚀 **Automated Deployment** - GitHub Actions automatically builds and deploys on push
- 💬 **Comments System** - Giscus integration using GitHub Discussions
- 🌙 **Dark Mode** - Dark mode enabled by default
- 🔍 **Search** - Built-in search functionality

## Local Development

### Prerequisites

- Hugo v0.153.0+ (extended version)
- Git

### Setup

1. Clone the repository with submodules:
```bash
git clone --recursive https://github.com/DevEstacion/heyron.git
cd heyron
```

2. If you already cloned without submodules:
```bash
git submodule update --init --recursive
```

3. Run the development server:
```bash
hugo server -D
```

4. Visit `http://localhost:1313/heyron/` in your browser

### Creating New Posts

```bash
hugo new content posts/my-post.md
```

## Deployment

The site automatically deploys to GitHub Pages when you push to the `main` branch.

### Initial Setup

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Set Source to "GitHub Actions"

2. **Enable GitHub Discussions**:
   - Go to repository Settings → General
   - Check "Discussions" under Features

3. **Configure Giscus**:
   - Visit [giscus.app](https://giscus.app/)
   - Enter repository: `DevEstacion/heyron`
   - Enable Discussions and create a "General" category
   - Copy the `data-repo-id` and `data-category-id`
   - Update `layouts/partials/comments.html` with these values

## Configuration

Main configuration is in [`hugo.toml`](hugo.toml). Key settings:

- `baseURL` - Your GitHub Pages URL
- `theme` - Set to "dream"
- `[params]` - Theme customization (dark mode, search, social links)

## Workflow

1. Write your post in Markdown in `content/posts/`
2. Commit and push to `main` branch
3. GitHub Actions builds and deploys automatically
4. Site updates at `https://devestacion.github.io/heyron/`

## Tech Stack

- **[Hugo](https://gohugo.io/)** - Static site generator
- **[Dream Theme](https://github.com/g1eny0ung/hugo-theme-dream)** - Hugo theme
- **[GitHub Pages](https://pages.github.com/)** - Hosting
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD
- **[Giscus](https://giscus.app/)** - Comments via GitHub Discussions

## License

Content: Your choice
Theme: MIT License (hugo-theme-dream)
