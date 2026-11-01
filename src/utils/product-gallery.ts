/**
 * Product.images is a JSON array of extra photo URLs.
 * The gallery is the cover `image`, then those URLs, with duplicates removed.
 * Null, invalid, empty, or cover-only `images` keeps today's detail-image list
 * so products without extra photos render unchanged.
 */

export function parseProductImageUrls(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  const urls: string[] = [];
  for (const entry of value) {
    if (typeof entry !== "string") continue;
    const trimmed = entry.trim();
    if (!trimmed) continue;
    urls.push(trimmed);
  }

  return urls;
}

export function dedupeImageUrls(
  urls: Array<string | null | undefined>,
): string[] {
  const seen = new Set<string>();
  const gallery: string[] = [];

  for (const url of urls) {
    const trimmed = url?.trim() ?? "";
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    gallery.push(trimmed);
  }

  return gallery;
}

/** Extra URLs with the cover removed. A cover-only list counts as no gallery. */
export function productGalleryExtras(
  image: string | null | undefined,
  images: unknown,
): string[] {
  const cover = image?.trim() ?? "";
  return dedupeImageUrls(parseProductImageUrls(images)).filter(
    (url) => url !== cover,
  );
}

export function productGallery(
  image: string | null | undefined,
  images: unknown,
  legacyUrls: Array<string | null | undefined> = [],
): string[] {
  const extras = productGalleryExtras(image, images);
  const rest = extras.length > 0 ? extras : legacyUrls;
  return dedupeImageUrls([image, ...rest]);
}
