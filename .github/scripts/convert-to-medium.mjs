#!/usr/bin/env node
/**
 * Convert Hugo posts to Medium-compatible HTML
 * 1. Strips Hugo frontmatter
 * 2. Converts relative image paths to absolute URLs
 * 3. Converts markdown to HTML with Medium CSS classes
 */

import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { globby } from 'globby';
import matter from 'gray-matter';
import { promisify } from 'util';
import { execFile } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = "https://heyron.dev";

const execFileAsync = promisify(execFile);

// Convert relative image paths to absolute URLs
function convertImagePaths(content, postSlug) {
  const imagePattern = /!\[(.*?)\]\(((?!https?:\/\/)[^)]+)\)/g;
  return content.replace(imagePattern, (match, altText, imagePath) => {
    // Remove leading './' if present
    imagePath = imagePath.replace(/^\.\//, '');
    // Construct absolute URL
    const absoluteUrl = `${BASE_URL}/posts/${postSlug}/${imagePath}`;
    return `![${altText}](${absoluteUrl})`;
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function getMmdcBinary() {
  const base = path.join(__dirname, 'node_modules', '.bin', 'mmdc');
  return process.platform === 'win32' ? `${base}.cmd` : base;
}

async function renderMermaidToDataUri(code) {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'mmdc-'));
  const inputPath = path.join(tmpDir, 'diagram.mmd');
  const outputPath = path.join(tmpDir, 'diagram.svg');
  const configPath = path.join(tmpDir, 'puppeteer-config.json');
  const mmdcBin = getMmdcBinary();

  // GitHub-hosted Linux runners need --no-sandbox flags for Chromium
  const puppeteerConfig = { args: ['--no-sandbox', '--disable-setuid-sandbox'] };

  await fs.writeFile(inputPath, code, 'utf-8');
  await fs.writeFile(configPath, JSON.stringify(puppeteerConfig), 'utf-8');

  try {
    const args = ['-i', inputPath, '-o', outputPath, '-b', 'transparent', '-w', '900', '-p', configPath];
    if (process.platform === 'win32') {
      const cmd = `"${mmdcBin}" ${args.map(a => (a.includes(' ') ? `"${a}"` : a)).join(' ')}`;
      await execFileAsync(cmd, { shell: true });
    } else {
      await execFileAsync(mmdcBin, args);
    }
    const svg = await fs.readFile(outputPath, 'utf-8');
    const base64 = Buffer.from(svg, 'utf-8').toString('base64');
    return `<img class="graf graf--image" alt="Mermaid diagram" src="data:image/svg+xml;base64,${base64}">`;
  } catch (error) {
    console.error('Mermaid render failed, keeping code block:', error.message);
    return null;
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}

async function replaceMermaidBlocks(content) {
  const regex = /```mermaid\s+([\s\S]*?)```/g;
  let result = '';
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const [block, code] = match;
    result += content.slice(lastIndex, match.index);
    const rendered = await renderMermaidToDataUri(code.trim());
    result += rendered || block;
    lastIndex = regex.lastIndex;
  }

  result += content.slice(lastIndex);
  return result;
}

// Extract post slug from file path
function getPostSlug(filePath) {
  const parsedPath = path.parse(filePath);
  // If file is index.md, use parent directory name; otherwise use filename
  if (parsedPath.name === 'index') {
    return path.basename(path.dirname(filePath));
  }
  return parsedPath.name;
}

// Medium CSS classes mapping (from MarkdownToMediumConverter.tsx:344-356)
function addMediumClasses(html) {
  return html
    .replace(/<h1/g, '<h1 class="graf graf--h1"')
    .replace(/<h2/g, '<h2 class="graf graf--h2"')
    .replace(/<h3/g, '<h3 class="graf graf--h3"')
    .replace(/<h4/g, '<h4 class="graf graf--h4"')
    .replace(/<p>/g, '<p class="graf graf--p">')
    .replace(/<blockquote>/g, '<blockquote class="graf graf--blockquote graf--pullquote">')
    .replace(/<pre>/g, '<pre class="graf graf--pre">')
    .replace(/<code/g, '<code class="markup--code markup--pre-code"')
    .replace(/<ul>/g, '<ul class="postList graf graf--ul">')
    .replace(/<ol>/g, '<ol class="postList graf graf--ol">')
    .replace(/<li>/g, '<li class="graf graf--li">')
    .replace(/<strong>/g, '<strong class="markup--strong markup--p-strong">')
    .replace(/<em>/g, '<em class="markup--em markup--p-em">')
    .replace(/<a /g, '<a class="markup--anchor markup--p-anchor" ')
    .replace(/<img/g, '<img class="graf graf--image"');
}

async function convertMarkdown(content) {
  const withMermaid = await replaceMermaidBlocks(content);
  const rawHtml = await marked.parse(withMermaid);
  const mediumHtml = addMediumClasses(rawHtml);
  return DOMPurify.sanitize(mediumHtml, { ALLOWED_URI_REGEXP: /^data:image\/svg\+xml;base64,|^https?:/i });
}

async function processFile(inputPath, outputDir) {
  let rawContent = await fs.readFile(inputPath, 'utf-8');
  const postSlug = getPostSlug(inputPath);

  const { data: frontmatter, content } = matter(rawContent);
  const title = frontmatter.title || postSlug;
  const tldr = frontmatter.tldr;

  // Convert image paths to absolute URLs
  const contentWithImages = convertImagePaths(content, postSlug);

  const preface = [];
  if (title) preface.push(`# ${title}`);
  if (tldr) preface.push(`**TL;DR:** ${tldr}`);

  const mergedContent = [...preface, contentWithImages].join('\n\n');

  const html = await convertMarkdown(mergedContent);

  // Create output filename (use post slug)
  const outputPath = path.join(outputDir, `${postSlug}.html`);

  // Wrap in Medium-style document
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
      max-width: 700px;
      margin: 0 auto;
      padding: 2rem;
      line-height: 1.7;
      color: rgba(41, 41, 41, 1);
    }

    /* Medium-like styling */
    .graf--h1 {
      font-size: 2.5rem;
      line-height: 1.2;
      margin: 2rem 0 1rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .graf--h2 {
      font-size: 2rem;
      line-height: 1.25;
      margin: 1.8rem 0 0.8rem;
      font-weight: 600;
      letter-spacing: -0.015em;
    }

    .graf--h3 {
      font-size: 1.5rem;
      line-height: 1.3;
      margin: 1.5rem 0 0.6rem;
      font-weight: 600;
    }

    .graf--h4 {
      font-size: 1.25rem;
      line-height: 1.4;
      margin: 1.2rem 0 0.5rem;
      font-weight: 600;
    }

    .graf--p {
      font-size: 1.1rem;
      line-height: 1.7;
      margin: 1.5rem 0;
      color: rgba(41, 41, 41, 1);
    }

    .graf--blockquote {
      border-left: 4px solid rgba(0, 0, 0, 0.68);
      padding-left: 1.5rem;
      margin: 2rem 0;
      color: rgba(41, 41, 41, 0.8);
      font-style: italic;
      font-size: 1.2rem;
    }

    .graf--pre {
      background: #f8f8f8;
      padding: 1.5rem;
      border-radius: 4px;
      overflow: auto;
      margin: 1.5rem 0;
      border: 1px solid #e6e6e6;
    }

    .markup--code {
      background: rgba(0, 0, 0, 0.05);
      padding: 0.2rem 0.4rem;
      border-radius: 3px;
      font-family: Menlo, Monaco, "Courier New", monospace;
      font-size: 0.9em;
    }

    .markup--pre-code {
      background: transparent;
      padding: 0;
      font-family: Menlo, Monaco, "Courier New", monospace;
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .graf--image {
      max-width: 100%;
      height: auto;
      margin: 2rem 0;
      border-radius: 4px;
      display: block;
    }

    .postList {
      padding-left: 2rem;
      margin: 1.5rem 0;
    }

    .graf--li {
      font-size: 1.1rem;
      line-height: 1.7;
      margin: 0.5rem 0;
    }

    .markup--strong {
      font-weight: 700;
    }

    .markup--em {
      font-style: italic;
    }

    .markup--anchor {
      color: inherit;
      text-decoration: underline;
      text-decoration-color: rgba(0, 0, 0, 0.68);
    }

    .markup--anchor:hover {
      text-decoration-color: rgba(0, 0, 0, 1);
    }

    /* Table styling */
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 2rem 0;
      font-size: 1rem;
    }

    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }

    th {
      background-color: #f8f8f8;
      font-weight: 600;
    }

    tr:nth-child(even) {
      background-color: #f9f9f9;
    }

    /* Code blocks */
    pre code {
      display: block;
      padding: 0;
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;

  await fs.writeFile(outputPath, fullHtml);
  console.log(`✓ Converted: ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
  return outputPath;
}

async function main() {
  const contentDir = path.join(__dirname, '../../content/posts');
  const outputDir = path.join(__dirname, '../medium-html');

  // Create output directory
  await fs.mkdir(outputDir, { recursive: true });

  // Check if specific files were passed via command line
  const args = process.argv.slice(2);
  const filesArg = args.find(arg => arg.startsWith('--files'));

  let markdownFiles;

  if (filesArg && process.env.CHANGED_FILES) {
    // Process only specified files from environment variable
    const filesStr = process.env.CHANGED_FILES;
    const changedPaths = filesStr.split('\n').filter(Boolean);
    // Resolve paths relative to repo root (two levels up from scripts directory)
    const repoRoot = path.join(__dirname, '../..');
    markdownFiles = changedPaths.map(f => path.join(repoRoot, f));
    console.log(`📝 Processing ${markdownFiles.length} changed file(s)\n`);
  } else {
    // Find all markdown files in content/posts (including subdirectories)
    markdownFiles = await globby('**/*.md', {
      cwd: contentDir,
      absolute: true
    });
    console.log(`📝 Processing ALL ${markdownFiles.length} markdown file(s)\n`);
  }

  if (markdownFiles.length === 0) {
    console.error(`❌ No markdown files to process`);
    process.exit(1);
  }

  // Process each file
  const processed = [];
  for (const file of markdownFiles) {
    try {
      await processFile(file, outputDir);
      processed.push(path.basename(file));
    } catch (error) {
      console.error(`❌ Error processing ${path.basename(file)}:`, error.message);
    }
  }

  console.log(`\n✅ Converted ${processed.length} file(s)`);
  console.log(`📁 Output directory: ${path.resolve(outputDir)}`);
}

main().catch(console.error);
