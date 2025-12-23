#!/usr/bin/env node
/**
 * Render Mermaid code fences to SVG files inside a Hugo page bundle and
 * replace the code fences with SVG image references that enable pan/zoom.
 *
 * Usage:
 *   node mermaid-to-svg.mjs --file ../../content/posts/<slug>/index.md
 */

import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getPostSlug(filePath) {
  const parsed = path.parse(filePath);
  if (parsed.name === 'index') {
    return path.basename(path.dirname(filePath));
  }
  return parsed.name;
}

function buildOutputName(slug, index) {
  return `${slug}-diagram-${index + 1}.svg`;
}

function replacementHtml(filename, altText) {
  const safeAlt = altText.replace(/"/g, "'");
  return `<div class="diagram" data-panzoom="svg">\n  <img src="images/${filename}" alt="${safeAlt}" loading="lazy" data-panzoom="svg">\n</div>`;
}

async function renderMermaid(code, outputPath) {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'mermaid-svg-'));
  const inputPath = path.join(tmpDir, 'diagram.mmd');
  const configPath = path.join(tmpDir, 'puppeteer-config.json');
  const puppeteerConfig = { args: ['--no-sandbox', '--disable-setuid-sandbox'] };

  await fs.writeFile(inputPath, code, 'utf-8');
  await fs.writeFile(configPath, JSON.stringify(puppeteerConfig), 'utf-8');

  const command = `npx -y @mermaid-js/mermaid-cli@10.9.1 -i "${inputPath}" -o "${outputPath}" -b transparent -w 1100 -p "${configPath}"`;
  await execAsync(command, { cwd: __dirname, windowsHide: true });
  await fs.rm(tmpDir, { recursive: true, force: true });
}

function padViewBox(svgText, padding = 8) {
  const match = svgText.match(/viewBox="([^"]+)"/);
  if (!match) return svgText;
  const parts = match[1].trim().split(/\s+/).map(Number);
  if (parts.length !== 4 || parts.some(n => Number.isNaN(n))) return svgText;
  const [x, y, w, h] = parts;
  const padded = [x - padding, y - padding, w + padding * 2, h + padding * 2];
  return svgText.replace(/viewBox="[^"]+"/, `viewBox="${padded.join(' ')}"`);
}

async function addPaddingToSvg(filePath) {
  const svg = await fs.readFile(filePath, 'utf-8');
  const padded = padViewBox(svg, 8);
  if (padded !== svg) {
    await fs.writeFile(filePath, padded, 'utf-8');
  }
}

async function processFile(filePath) {
  const raw = await fs.readFile(filePath, 'utf-8');
  const slug = getPostSlug(filePath);
  const imagesDir = path.join(path.dirname(filePath), 'images');
  await fs.mkdir(imagesDir, { recursive: true });

  const regex = /```mermaid\s+([\s\S]*?)```/g;
  let match;
  let cursor = 0;
  let output = '';
  let index = 0;
  const replacements = [];

  while ((match = regex.exec(raw)) !== null) {
    const code = match[1].trim();
    const fileName = buildOutputName(slug, index);
    const outputPath = path.join(imagesDir, fileName);
    const altText = `Mermaid diagram ${index + 1}`;

    await renderMermaid(code, outputPath);
    await addPaddingToSvg(outputPath);
    replacements.push({ fileName, altText });

    output += raw.slice(cursor, match.index);
    output += replacementHtml(fileName, altText);
    cursor = regex.lastIndex;
    index += 1;
  }

  if (index === 0) {
    console.log(`ℹ️ No mermaid blocks found in ${filePath}`);
    return;
  }

  output += raw.slice(cursor);
  await fs.writeFile(filePath, output);

  console.log(`✅ Rendered ${index} diagram(s) for ${filePath}`);
  replacements.forEach((r, i) => {
    console.log(`  - images/${r.fileName} (Diagram ${i + 1})`);
  });
}

function parseArgs() {
  const args = process.argv.slice(2);
  const fileFlagIndex = args.findIndex(arg => arg === '--file');
  if (fileFlagIndex === -1 || !args[fileFlagIndex + 1]) {
    throw new Error('Please pass --file <path-to-markdown>');
  }
  return path.resolve(args[fileFlagIndex + 1]);
}

async function main() {
  const targetFile = parseArgs();
  await processFile(targetFile);
}

main().catch(err => {
  console.error('❌ Mermaid to SVG failed:', err.message);
  process.exit(1);
});
