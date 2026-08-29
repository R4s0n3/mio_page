import "server-only";

import { env } from "@/env";

const MAX_LOGO_BYTES = 2 * 1024 * 1024;
const PNG_SIGNATURE = "89504e470d0a1a0a";
const GIF_SIGNATURES = new Set(["GIF87a", "GIF89a"]);

type UploadResponse = {
  files:
    | { url: string }
    | Array<{
        url: string;
      }>;
};

function isSafeSvg(buffer: Buffer) {
  const source = buffer.toString("utf8").trim();
  const normalized = source.toLowerCase();

  return (
    (normalized.startsWith("<svg") || normalized.startsWith("<?xml")) &&
    normalized.includes("<svg") &&
    !normalized.includes("<script") &&
    !normalized.includes("javascript:") &&
    !normalized.includes("<foreignobject") &&
    !/\son[a-z]+\s*=/.test(normalized)
  );
}

function validateLogo(file: File, buffer: Buffer) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (file.size === 0 || file.size > MAX_LOGO_BYTES) {
    throw new Error("Logo files must be smaller than 2 MB.");
  }

  if (file.type === "image/png" && extension === "png") {
    if (!buffer.subarray(0, 8).toString("hex").startsWith(PNG_SIGNATURE)) {
      throw new Error("That file is not a valid PNG image.");
    }
    return;
  }

  if (file.type === "image/gif" && extension === "gif") {
    if (!GIF_SIGNATURES.has(buffer.subarray(0, 6).toString("ascii"))) {
      throw new Error("That file is not a valid GIF image.");
    }
    return;
  }

  if (
    file.type === "image/svg+xml" &&
    extension === "svg" &&
    isSafeSvg(buffer)
  ) {
    return;
  }

  throw new Error("Please upload a valid .png, .gif, or safe .svg logo.");
}

export async function uploadSponsorLogo(file: File) {
  if (!env.UPLOAD_URL || !env.UPLOAD_KEY) {
    throw new Error("Sponsor logo uploads are not configured yet.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  validateLogo(file, buffer);

  const formData = new FormData();
  formData.append("file", new File([buffer], file.name, { type: file.type }));

  const endpoint = `${env.UPLOAD_URL.replace(/\/?$/, "/")}single`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "X-API-KEY": env.UPLOAD_KEY },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("The logo upload failed. Please try again.");
  }

  const payload = (await response.json()) as UploadResponse;
  const uploadedFile = Array.isArray(payload.files)
    ? payload.files[0]
    : payload.files;

  if (!uploadedFile?.url) {
    throw new Error("The upload service did not return a logo URL.");
  }

  return uploadedFile.url;
}
