const BLOG_IMAGE_BASE =
  'https://raw.githubusercontent.com/mahtamun-hoque-fahim/blog-image/main/covers'

/**
 * Derives the cover image URL for a blog post.
 *
 * Convention:
 *   - Image lives at: blog-image repo → /covers/{slug}.{ext}
 *   - `coverImageField` stores just the extension (e.g. "png", "jpg", "webp")
 *   - If null/empty, defaults to ".png"
 *   - If a full URL is stored (legacy/custom), it passes through unchanged.
 */
export function getCoverUrl(slug: string, coverImageField?: string | null): string {
  if (!coverImageField) {
    return `${BLOG_IMAGE_BASE}/${slug}.png`
  }

  // Legacy: full URL stored directly → pass through
  if (coverImageField.startsWith('http')) {
    return coverImageField
  }

  // Extension only (e.g. "jpg", "webp", "png")
  const ext = coverImageField.replace(/^\./, '') // strip leading dot if present
  return `${BLOG_IMAGE_BASE}/${slug}.${ext}`
}
