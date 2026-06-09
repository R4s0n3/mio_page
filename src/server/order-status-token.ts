import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

import { env } from "@/env";

const tokenVersion = "v1";
const tokenTtlMs = 1000 * 60 * 60 * 24 * 30;

type OrderStatusTokenPayload = {
  orderId: string;
  email: string;
  expiresAt: number;
};

function getEncryptionKey() {
  const secret = env.ORDER_STATUS_LINK_SECRET;
  if (!secret) return null;

  return createHash("sha256").update(secret).digest();
}

export function createOrderStatusToken({
  orderId,
  email,
}: {
  orderId: string;
  email: string;
}) {
  const key = getEncryptionKey();
  if (!key) return null;

  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const payload: OrderStatusTokenPayload = {
    orderId,
    email,
    expiresAt: Date.now() + tokenTtlMs,
  };
  const plaintext = JSON.stringify(payload);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [
    tokenVersion,
    iv.toString("base64url"),
    authTag.toString("base64url"),
    encrypted.toString("base64url"),
  ].join(".");
}

export function readOrderStatusToken(token: string) {
  const key = getEncryptionKey();
  if (!key) return null;

  const [version, iv, authTag, encrypted] = token.split(".");
  if (version !== tokenVersion || !iv || !authTag || !encrypted) return null;

  try {
    const decipher = createDecipheriv(
      "aes-256-gcm",
      key,
      Buffer.from(iv, "base64url"),
    );
    decipher.setAuthTag(Buffer.from(authTag, "base64url"));

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encrypted, "base64url")),
      decipher.final(),
    ]);
    const payload: unknown = JSON.parse(decrypted.toString("utf8"));

    if (!isOrderStatusTokenPayload(payload)) return null;
    if (payload.expiresAt < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

function isOrderStatusTokenPayload(
  payload: unknown,
): payload is OrderStatusTokenPayload {
  if (!payload || typeof payload !== "object") return false;

  const candidate = payload as Partial<OrderStatusTokenPayload>;

  return (
    typeof candidate.orderId === "string" &&
    candidate.orderId.length > 0 &&
    typeof candidate.email === "string" &&
    candidate.email.length > 0 &&
    typeof candidate.expiresAt === "number"
  );
}
