---
applyTo: '**.md'
---

# heyron Blog - Post Writing Guidelines

This guide helps AI (and future you) write posts that sound authentically like Ron—a mind dump of real thoughts, not corporate polish.

## Core Principles

### Tone & Voice
- **Conversational & Raw** - Write like you're explaining something to a peer over coffee, not presenting to executives
- **Authentic > Consistent** - Your personality should shine through; embrace quirks and tangents
- **No Corporate Speak** - Avoid: "let's explore," "deep dive," "synergy," "game-changer," "leverage." These scream AI-generated.
- **Real Examples > Theory** - Ground posts in actual work (Nordstrom projects, observability wins, cost cuts) rather than abstract concepts

### Structure
- **Short Paragraphs** - Max 2-3 sentences. White space is your friend.
- **Lead with Why** - Hook readers with the problem or outcome first (e.g., "Cut credit decision time 52%," not "Let me tell you about optimization")
- **Use Headers** - Break content into scannable sections
- **Bullet Lists** - Great for lessons learned, gotchas, or multi-part ideas

### Style Details
- **Emojis** - Use sparingly but genuinely (🤖 for AI, ⛰️ for mountains, 🚀 for shipping, ✅ for wins). Only add if it feels natural.
- **Humor** - Self-deprecating jokes and PNW references are fair game; avoid forced memes
- **Technical Depth** - Assume readers are mid-level engineers; explain *why* something matters, not just *how*

### Good Post Example
**Title:** "52% Faster Credit Decisions: How We Optimized the Bottleneck"

*Lead:* "We cut credit adjudication time from 170s to 81s. Here's what actually worked (and what didn't)." ← Problem + outcome upfront

*Body:* Real changes (caching strategy, service split, monitoring), with specific wins and costs.

*Close:* Lessons for readers, not a sales pitch.

### Bad Post Example (Avoid)
**Title:** "Exploring Cloud Optimization Strategies"

*Lead:* "Let's dive deep into how companies can leverage cloud technologies..." ← Corporate jargon, no hook

*Body:* Generic advice, no real examples, theoretical frameworks.

*Close:* Vague call to action.

## Topics You Care About
- **.NET & AWS** - Your primary stack; posts should reflect real patterns you use
- **Reliability & Observability** - What you've built at Nordstrom (e.g., auto-recovery, SLA wins)
- **Cost Optimization** - Cloud economics, infrastructure decisions
- **AI Tools & Adoption** - Your current enthusiasm (Claude, AI agents, MCP servers, prompt engineering)
- **Shipping Fast** - CI/CD, tooling, team productivity
- **Lessons from Regulated Domains** - PCI/HIPAA insights without oversharing secrets

## Don't Overthink It
If it reads like you and has a real takeaway, it's good. Ship it.

## Optional Features

### TL;DR Section
Add a concise summary at the top of long posts using the `tldr` frontmatter field:

```yaml
tldr: "Quick 1-2 sentence summary of the entire post. Supports **Markdown** formatting."
```

**When to use:**
- Posts longer than 5 minutes reading time
- Technical deep-dives with multiple sections
- Posts with actionable takeaways that benefit from upfront summary

**Keep it short:** 1-3 sentences max. This is the elevator pitch, not a full summary.

## Post Images & Covers

Store cover images in `post-images/` folder at the project root. When publishing a post:

1. Copy the desired image to a post folder using Hugo's page bundle structure:
   `
   content/posts/my-post/
     ├── index.md
     └── cover.jpg
   `

2. Add to frontmatter:
   `yaml
   cover: cover.jpg
   `

3. The theme will automatically:
   - Optimize to WebP format
   - Display in summary cards (96px width in Zen mode)
   - Show at full width on the post page if `showSummaryCoverInPost: true`

**Image specs:** ~640px wide, 3:2 to 16:9 aspect ratio, under 200KB.
Sources: Unsplash (small size), Pexels, or your own photos.

### Image Placeholders

When drafting posts with AI-generated images in mind, use placeholder markers in this format:

```
IMAGE_PLACEHOLDER_N_DESCRIPTIVE_NAME: Detailed prompt for image generation
```

**Example:**
```
IMAGE_PLACEHOLDER_1_SERVER_ARCHITECTURE: A technical diagram showing microservices communicating via message queue with AWS Lambda functions processing events
```

**Rules:**
- Keep placeholders on their own line
- Use SCREAMING_SNAKE_CASE for the descriptive name
- Write detailed prompts that specify composition, style, and key elements
- Number sequentially (1, 2, 3, etc.)
- Don't remove these when publishing—they're markers for manual image insertion
