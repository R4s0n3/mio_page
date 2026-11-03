import "server-only";

import { env } from "@/env";
import { sanitizeSponsorLogo } from "./sponsor-logo-sanitizer";
import { resolveUploadedLogoUrl } from "@/utils/cdn-logo-url";

const MAX_LOGO_URL_LENGTH = 191;

type UploadResponse = {
  files?:
    | { url?: string }
    | Array<{
        url?: string;
      }>;
};

function uploadTarget() {
  if (env.CDN_URL && env.CDN_API_KEY) {
    const origin = new URL(env.CDN_URL).origin;
    return {
      endpoint: `${origin}/api/upload/single`,
      apiKey: env.CDN_API_KEY,
      origin,
      strictOrigin: true,
    };
  }

  if (env.UPLOAD_URL && env.UPLOAD_KEY) {
    return {
      endpoint: `${env.UPLOAD_URL.replace(/\/?$/, "/")}single`,
      apiKey: env.UPLOAD_KEY,
      origin: new URL(env.UPLOAD_URL).origin,
      strictOrigin: false,
    };
  }

  throw new Error(
    "Sponsor logo uploads are not configured yet. Set CDN_URL and CDN_API_KEY.",
  );
}

function uploadedFileUrl(payload: UploadResponse) {
  const uploadedFile = Array.isArray(payload.files)
    ? payload.files[0]
    : payload.files;
  return uploadedFile?.url ?? "";
}

export async function uploadSponsorLogo(file: File) {
  const target = uploadTarget();
  const sanitized = await sanitizeSponsorLogo(file);

  const formData = new FormData();
  formData.append("file", sanitized);

  const response = await fetch(target.endpoint, {
    method: "POST",
    headers: { "X-API-Key": target.apiKey },
    body: formData,
  });

  if (!response.ok) {
    console.error("Sponsor logo upload failed:", response.status);
    throw new Error("The logo upload failed. Please try again.");
  }

  let payload: UploadResponse;
  try {
    payload = (await response.json()) as UploadResponse;
  } catch (error) {
    console.error("Sponsor logo upload returned invalid JSON:", error);
    throw new Error("The logo upload failed. Please try again.");
  }

  const logoUrl = resolveUploadedLogoUrl(
    uploadedFileUrl(payload),
    target.origin,
    {
      strictOrigin: target.strictOrigin,
    },
  );

  if (logoUrl.length > MAX_LOGO_URL_LENGTH) {
    throw new Error("The upload service returned a logo URL that is too long.");
  }

  return logoUrl;
}
