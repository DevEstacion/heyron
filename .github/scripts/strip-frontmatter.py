#!/usr/bin/env python3
"""
Strip Hugo frontmatter and convert relative image paths to absolute URLs.
Usage: python strip-frontmatter.py <post-file> <post-slug> <base-url>
"""
import re
import sys

def strip_frontmatter(content):
    """Remove YAML frontmatter between --- markers."""
    pattern = r'^---\s*\n.*?\n---\s*\n'
    return re.sub(pattern, '', content, flags=re.DOTALL)

def convert_image_paths(content, post_slug, base_url):
    """Convert relative image paths to absolute URLs."""
    def replace_image(match):
        alt_text = match.group(1)
        path = match.group(2)

        # Skip if already absolute URL
        if path.startswith(('http://', 'https://', '//')):
            return match.group(0)

        # Convert relative to absolute
        absolute_url = f"{base_url}/posts/{post_slug}/{path}"
        return f"![{alt_text}]({absolute_url})"

    return re.sub(r'!\[(.*?)\]\((.*?)\)', replace_image, content)

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python strip-frontmatter.py <post-file> <post-slug> <base-url>")
        sys.exit(1)

    post_file = sys.argv[1]
    post_slug = sys.argv[2]
    base_url = sys.argv[3].rstrip('/')

    with open(post_file, 'r', encoding='utf-8') as f:
        content = f.read()

    content = strip_frontmatter(content)
    content = convert_image_paths(content, post_slug, base_url)

    print(content)
