tldr: "Quick 1-2 sentence summary of the entire post. Supports **Markdown** formatting."
applyTo: '**.md'
---

# HeyRon Post Guidelines (Concise)
- Voice: conversational, raw, no corporate jargon. Use real examples from your work (.NET/AWS, reliability/observability, cost wins, AI tooling). Mid-level depth: explain why, not just how.
- Form: short paragraphs (2–3 sentences), lead with the outcome/why, use headers and bullets. Emojis sparingly and genuine; humor ok if natural.
- TL;DR: for long/deep posts add `tldr:` frontmatter (1–3 sentences, markdown ok).
- Images: page bundle covers (content/posts/slug/cover.jpg); ~640px, <200KB, prefer JPG; keep inline images in images/ inside the bundle. Convert PNG if WebP errors.
- Mermaid: render fences to SVGs in `images/` (run from .github/scripts: `npm run render:mermaid -- --file ../../content/posts/<slug>/index.md`). Replace the fence with `<img ... data-panzoom="svg">` output; no runtime Mermaid.
- Placeholders: IMAGE_PLACEHOLDER_N_NAME: prompt text (one per line, SCREAMING_SNAKE_CASE, numbered).
