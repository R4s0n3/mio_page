import sharp from "sharp";
import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("@/env", () => ({
  env: { CDN_URL: "https://cdn.example.com", CDN_API_KEY: "server-secret" },
}));
import { sanitizeSponsorLogo } from "../sponsor-logo-sanitizer";
import { readSponsorFormData } from "../sponsor-form-data";
import { uploadSponsorLogo } from "../sponsor-upload";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
async function png() {
  return sharp({
    create: { width: 8, height: 8, channels: 4, background: "red" },
  })
    .png()
    .toBuffer();
}
function image(bytes: Uint8Array, name = "logo.png", type = "image/png") {
  return new File([new Uint8Array(bytes)], name, { type });
}
async function animation(frames: number) {
  const pixels = Buffer.alloc(2 * 2 * 4 * frames);
  for (let frame = 0; frame < frames; frame++) {
    for (let pixel = frame * 16; pixel < (frame + 1) * 16; pixel += 4) {
      pixels[pixel] = (frame * 37) % 256;
      pixels[pixel + 1] = (frame * 79) % 256;
      pixels[pixel + 2] = (frame * 131) % 256;
      pixels[pixel + 3] = 255;
    }
  }
  return sharp(pixels, {
    raw: { width: 2, height: 2 * frames, channels: 4, pageHeight: 2 },
  })
    .gif({ delay: Array(frames).fill(100) as number[], loop: 0 })
    .toBuffer();
}

describe("public sponsor image sanitization", () => {
  it.each([
    [
      "image/svg+xml",
      "logo.svg",
      '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>',
    ],
    [
      "image/png",
      "logo.png",
      '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"/>',
    ],
    ["application/zip", "logo.zip", "PK\u0003\u0004malware"],
  ])(
    "rejects active or unsupported input declared as %s",
    async (type, name, bytes) => {
      await expect(
        sanitizeSponsorLogo(image(Buffer.from(bytes), name, type)),
      ).rejects.toMatchObject({ status: 415 });
    },
  );
  it("rejects signature-only and truncated PNGs", async () => {
    await expect(
      sanitizeSponsorLogo(image(Buffer.from("89504e470d0a1a0a", "hex"))),
    ).rejects.toMatchObject({ status: 415 });
    const valid = await png();
    await expect(
      sanitizeSponsorLogo(image(valid.subarray(0, 35))),
    ).rejects.toMatchObject({ status: 415 });
  });
  it("re-encodes valid pixels and removes appended payloads and metadata", async () => {
    const valid = await sharp(await png())
      .withExif({ IFD0: { ImageDescription: "hidden-metadata" } })
      .png()
      .toBuffer();
    const source = Buffer.concat([
      valid,
      Buffer.from("<?php malicious_trailing_payload(); ?>"),
    ]);
    const safe = await sanitizeSponsorLogo(
      image(source, "untrusted-original.png"),
    );
    const output = Buffer.from(await safe.arrayBuffer());
    expect(safe.name).toMatch(/^sponsor-[a-f0-9-]+\.png$/);
    expect(output.includes(Buffer.from("malicious_trailing_payload"))).toBe(
      false,
    );
    expect(output.includes(Buffer.from("hidden-metadata"))).toBe(false);
    const metadata = await sharp(output).metadata();
    expect(metadata.format).toBe("png");
    expect(metadata.width).toBe(8);
    expect(metadata.exif).toBeUndefined();
  });
  it("rejects large dimensions even when compressed bytes are tiny", async () => {
    const bytes = await sharp({
      create: { width: 4097, height: 1, channels: 3, background: "red" },
    })
      .png()
      .toBuffer();
    await expect(sanitizeSponsorLogo(image(bytes))).rejects.toMatchObject({
      status: 413,
    });
  });
  it("checks size before reading the entire file", async () => {
    const file = image(new Uint8Array(2 * 1024 * 1024 + 1));
    const read = vi.spyOn(file, "arrayBuffer");
    await expect(sanitizeSponsorLogo(file)).rejects.toMatchObject({
      status: 413,
    });
    expect(read).not.toHaveBeenCalled();
  });
  it("preserves bounded GIF animation while rebuilding its frames", async () => {
    const source = await animation(2);
    expect((await sharp(source, { animated: true }).metadata()).pages).toBe(2);
    const safe = await sanitizeSponsorLogo(
      image(source, "logo.gif", "image/gif"),
    );
    expect(safe.type).toBe("image/gif");
    expect(
      (
        await sharp(Buffer.from(await safe.arrayBuffer()), {
          animated: true,
        }).metadata()
      ).pages,
    ).toBe(2);
  });
  it("rejects excessive frame counts", async () => {
    const source = await animation(101);
    expect((await sharp(source, { animated: true }).metadata()).pages).toBe(
      101,
    );
    await expect(
      sanitizeSponsorLogo(image(source, "logo.gif", "image/gif")),
    ).rejects.toMatchObject({ status: 413 });
  });
  it("rejects mismatched image types rather than trusting the name or MIME", async () => {
    await expect(
      sanitizeSponsorLogo(image(await png(), "logo.jpg", "image/jpeg")),
    ).rejects.toMatchObject({ status: 415 });
  });
  it.each(["jpeg", "webp"] as const)(
    "rebuilds supported %s images as PNG",
    async (format) => {
      const bytes = await sharp(await png())
        .toFormat(format)
        .toBuffer();
      const safe = await sanitizeSponsorLogo(
        image(bytes, `logo.${format}`, `image/${format}`),
      );
      expect(safe.type).toBe("image/png");
      expect(
        (await sharp(Buffer.from(await safe.arrayBuffer())).metadata()).format,
      ).toBe("png");
    },
  );
  it("bounds concurrent decoder work and recovers after processing finishes", async () => {
    const bytes = new Uint8Array(await png()).buffer;
    const first = image(new Uint8Array(bytes));
    const second = image(new Uint8Array(bytes));
    let releaseFirst!: (bytes: ArrayBuffer) => void;
    let releaseSecond!: (bytes: ArrayBuffer) => void;
    vi.spyOn(first, "arrayBuffer").mockImplementation(
      () =>
        new Promise((resolve) => {
          releaseFirst = resolve;
        }),
    );
    vi.spyOn(second, "arrayBuffer").mockImplementation(
      () =>
        new Promise((resolve) => {
          releaseSecond = resolve;
        }),
    );
    const runningFirst = sanitizeSponsorLogo(first);
    const runningSecond = sanitizeSponsorLogo(second);
    await expect(
      sanitizeSponsorLogo(image(new Uint8Array(bytes))),
    ).rejects.toMatchObject({ status: 503 });
    releaseFirst(bytes);
    releaseSecond(bytes);
    await Promise.all([runningFirst, runningSecond]);
    await expect(
      sanitizeSponsorLogo(image(new Uint8Array(bytes))),
    ).resolves.toBeInstanceOf(File);
  });
  it("never sends rejected visitor bytes to the CDN", async () => {
    const fetch = vi.fn<typeof globalThis.fetch>();
    vi.stubGlobal("fetch", fetch);
    await expect(
      uploadSponsorLogo(image(Buffer.from("malware"))),
    ).rejects.toMatchObject({ status: 415 });
    expect(fetch).not.toHaveBeenCalled();
  });
  it("uploads only the rebuilt file with its generated name", async () => {
    const fetch = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(
        new Response(
          JSON.stringify({ files: [{ url: "/storage/sanitized.png" }] }),
        ),
      );
    vi.stubGlobal("fetch", fetch);
    expect(
      await uploadSponsorLogo(image(await png(), "original-name.png")),
    ).toBe("https://cdn.example.com/storage/sanitized.png");
    const form = fetch.mock.calls[0]?.[1]?.body as FormData;
    const sent = form.get("file") as File;
    expect(sent.name).toMatch(/^sponsor-[a-f0-9-]+\.png$/);
    expect(sent.type).toBe("image/png");
  });
});

describe("bounded public multipart uploads", () => {
  it("parses a valid small sponsor form", async () => {
    const form = new FormData();
    form.set("logo", image(await png()));
    form.set("slotId", "test-slot");
    const parsed = await readSponsorFormData(
      new Request("https://example.com", { method: "POST", body: form }),
    );
    expect(parsed.get("slotId")).toBe("test-slot");
    expect(parsed.get("logo")).toBeInstanceOf(File);
  });
  it("rejects oversized bodies even without a Content-Length header", async () => {
    const request = new Request("https://example.com", {
      method: "POST",
      headers: { "content-type": "multipart/form-data; boundary=test" },
      body: new Uint8Array(3 * 1024 * 1024 + 1),
    });
    await expect(readSponsorFormData(request)).rejects.toMatchObject({
      status: 413,
    });
  });
  it("rejects non-multipart input", async () => {
    await expect(
      readSponsorFormData(
        new Request("https://example.com", { method: "POST", body: "{}" }),
      ),
    ).rejects.toMatchObject({ status: 400 });
  });
});
