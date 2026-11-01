const PUBLIC_LOGO_PREFIXES = ["/storage/", "/assets/"];

export function resolveUploadedLogoUrl(
  rawUrl: string,
  origin: string,
  options?: { strictOrigin?: boolean },
) {
  let base: URL;
  try {
    base = new URL(origin);
  } catch {
    throw new Error("The upload service URL is invalid.");
  }

  if (base.protocol !== "https:" && base.protocol !== "http:") {
    throw new Error("The upload service URL is invalid.");
  }

  const trimmed = rawUrl.trim();
  let url: URL;

  if (trimmed.startsWith("/")) {
    if (!PUBLIC_LOGO_PREFIXES.some((prefix) => trimmed.startsWith(prefix))) {
      throw new Error("The upload service returned an unexpected logo path.");
    }
    url = new URL(trimmed, base.origin);
  } else {
    try {
      url = new URL(trimmed);
    } catch {
      throw new Error("The upload service did not return a logo URL.");
    }
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("The upload service returned an invalid logo URL.");
  }

  if (url.username || url.password) {
    throw new Error("The upload service returned an invalid logo URL.");
  }

  if (options?.strictOrigin && url.origin !== base.origin) {
    throw new Error(
      "The upload service returned a logo URL on an unexpected host.",
    );
  }

  return url.toString();
}
