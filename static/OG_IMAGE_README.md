# Open Graph Image Setup

## Required Image

To ensure proper social media sharing with large preview cards, you need to create an Open Graph image:

**File:** `static/og-image.png`  
**Dimensions:** 1200x630 pixels (recommended)  
**Format:** PNG or JPG  
**Size:** Under 1MB (recommended)

## What This Image Is Used For

This image appears when sharing links on:
- Twitter/X (large card preview)
- Facebook
- LinkedIn
- Slack
- Discord
- Other social platforms

## Image Guidelines

- **Dimensions:** 1200x630px (1.91:1 aspect ratio)
- **Content:** Should include MagicAF branding, logo, and key messaging
- **Text:** Keep text minimal and readable at small sizes
- **Colors:** Use high contrast for visibility
- **File size:** Optimize to under 1MB for fast loading

## Current Configuration

The site is configured to:
- Always use `summary_large_image` for Twitter cards
- Set proper Open Graph image dimensions (1200x630)
- Fall back to `/og-image.png` if no page-specific image is set
- Support page-specific images via `cover.image` or `image` frontmatter

## Testing

After adding the image, test sharing with:
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
