import "server-only";
import { SponsorUploadError } from "./sponsor-upload-errors";

const MAX_REQUEST_BYTES = 3 * 1024 * 1024;

/** Bound multipart input, including chunked bodies, before invoking the form-data parser. */
export async function readSponsorFormData(request: Request): Promise<FormData> {
  const type = request.headers.get("content-type");
  if (!type || !/^multipart\/form-data(?:;|$)/i.test(type) || !request.body)
    throw new SponsorUploadError("Invalid sponsor upload form.");
  const advertisedSize = Number(request.headers.get("content-length"));
  if (advertisedSize > MAX_REQUEST_BYTES)
    throw new SponsorUploadError("Sponsor upload request is too large.", 413);
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(
      () =>
        reject(
          new SponsorUploadError(
            "Sponsor upload timed out. Please try again.",
            408,
          ),
        ),
      10000,
    );
    timer.unref();
  });
  try {
    while (true) {
      const chunk = await Promise.race([reader.read(), deadline]);
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > MAX_REQUEST_BYTES)
        throw new SponsorUploadError(
          "Sponsor upload request is too large.",
          413,
        );
      chunks.push(chunk.value);
    }
    return await new Response(new Blob(chunks as BlobPart[]), {
      headers: { "content-type": type },
    }).formData();
  } catch (error) {
    void reader.cancel().catch(() => undefined);
    if (error instanceof SponsorUploadError) throw error;
    throw new SponsorUploadError("Invalid sponsor upload form.");
  } finally {
    if (timer) clearTimeout(timer);
    reader.releaseLock();
  }
}
