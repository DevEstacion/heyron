#!/bin/bash
# Local script to run the Medium export pipeline
# Usage: ./scripts/export-to-medium.sh

set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
SCRIPTS_DIR="$ROOT_DIR/.github/scripts"

echo "🚀 Exporting Hugo posts to Medium..."

# Install dependencies once
if [ ! -d "$SCRIPTS_DIR/node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    (cd "$SCRIPTS_DIR" && npm install --silent)
    echo ""
fi

echo "🔄 Converting posts to Medium HTML (embeds images as data URIs)..."
(cd "$SCRIPTS_DIR" && npm run export)
echo ""

echo "✅ Export complete!"
echo "📁 Files saved to: $ROOT_DIR/.github/medium-html/"
ls -1 "$ROOT_DIR/.github/medium-html"/*.html 2>/dev/null || echo "No HTML files generated"
echo ""
echo "📋 To use: open an HTML in a browser, select all, copy, and paste into Medium"
