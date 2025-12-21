#!/bin/bash
# Local script to test Medium export
# Usage: ./scripts/export-to-medium.sh

set -e  # Exit on error

echo "🚀 Exporting Hugo posts to Medium..."
echo ""

# Create directories
mkdir -p .github/medium-exports .github/medium-html

# Step 1: Strip frontmatter
echo "📝 Step 1: Stripping frontmatter..."
python .github/scripts/strip-frontmatter.py
echo ""

# Step 2: Install dependencies (if needed)
if [ ! -d ".github/scripts/node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    cd .github/scripts
    npm install --silent
    cd ../..
    echo ""
fi

# Step 3: Convert to Medium HTML
echo "🔄 Step 2: Converting to Medium HTML..."
cd .github/scripts
npm run convert
cd ../..
echo ""

# Display results
echo "✅ Export complete!"
echo ""
echo "📁 Files saved to: .github/medium-html/"
echo ""
ls -1 .github/medium-html/*.html 2>/dev/null || echo "No HTML files generated"
echo ""
echo "🌐 To preview: open .github/medium-html/welcome.html"
echo "📋 To use: Open HTML in browser, copy all content (Ctrl/Cmd+A), paste into Medium"
