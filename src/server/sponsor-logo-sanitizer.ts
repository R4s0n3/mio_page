import "server-only";

import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { SponsorUploadError } from "./sponsor-upload-errors";

export const MAX_SPONSOR_LOGO_BYTES = 2 * 1024 * 1024;
const MAX_TOTAL_PIXELS = 16 * 1024 * 1024;
const MAX_DIMENSION = 4096;
const MAX_FRAMES = 100;
let activeSanitizations = 0;

function rasterFormat(file: File, buffer: Buffer): string | undefined {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (
    file.type === "image/png" &&
    ext === "png" &&
    buffer.subarray(0, 8).toString("hex") === "89504e470d0a1a0a"
  )
    return "png";
  if (
    file.type === "image/jpeg" &&
    (ext === "jpg" || ext === "jpeg") &&
    buffer.subarray(0, 3).toString("hex") === "ffd8ff"
  )
    return "jpeg";
  if (
    file.type === "image/gif" &&
    ext === "gif" &&
    ["GIF87a", "GIF89a"].includes(buffer.subarray(0, 6).toString("ascii"))
  )
    return "gif";
  if (
    file.type === "image/webp" &&
    ext === "webp" &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  )
    return "webp";
  return undefined;
}

/** Decode bounded raster input and rebuild a fresh image; never store original visitor bytes. */
export async function sanitizeSponsorLogo(file: File): Promise<File> {
  if (file.size === 0 || file.size > MAX_SPONSOR_LOGO_BYTES)
    throw new SponsorUploadError(
      "Logo files must be between 1 byte and 2 MB.",
      413,
    );
  if (activeSanitizations >= 2)
    throw new SponsorUploadError(
      "Logo processing is busy. Please try again shortly.",
      503,
    );
  activeSanitizations += 1;
  try {
    const input = Buffer.from(await file.arrayBuffer());
    const format = rasterFormat(file, input);
    if (!format)
      throw new SponsorUploadError(
        "Upload a PNG, JPEG, GIF, or WebP image. SVG and other file types are not accepted.",
        415,
      );
    const image = sharp(input, {
      animated: true,
      failOn: "warning",
      limitInputPixels: MAX_TOTAL_PIXELS,
    });
    const metadata = await image.metadata();
    const frames = metadata.pages ?? 1;
    const width = metadata.width ?? 0;
    const height = metadata.pageHeight ?? metadata.height ?? 0;
    if (
      metadata.format !== format ||
      !width ||
      !height ||
      width > MAX_DIMENSION ||
      height > MAX_DIMENSION ||
      frames > MAX_FRAMES ||
      width * height * frames > MAX_TOTAL_PIXELS
    ) {
      throw new SponsorUploadError(
        "Logo must be at most 4096 × 4096 pixels, 100 frames, and 16 million total pixels.",
        413,
      );
    }
    // Sharp strips metadata by default. Animated inputs are rebuilt as GIF, others as PNG.
    const animated = frames > 1;
    const pipeline = image
      .resize({
        width: 1024,
        height: 1024,
        fit: "inside",
        withoutEnlargement: true,
      })
      .timeout({ seconds: 5 });
    if (!animated) pipeline.rotate();
    const output = await (
      animated ? pipeline.gif({ effort: 3 }) : pipeline.png()
    ).toBuffer();
    if (output.length > MAX_SPONSOR_LOGO_BYTES)
      throw new SponsorUploadError(
        "The processed logo is too large. Please use a smaller image.",
        413,
      );
    return new File(
      [new Uint8Array(output)],
      `sponsor-${randomUUID()}.${animated ? "gif" : "png"}`,
      { type: animated ? "image/gif" : "image/png" },
    );
  } catch (error) {
    if (error instanceof SponsorUploadError) throw error;
    throw new SponsorUploadError(
      "That image could not be decoded safely. Please export a new PNG, JPEG, GIF, or WebP image.",
      415,
    );
  } finally {
    activeSanitizations -= 1;
  }
}
