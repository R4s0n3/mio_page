import { type NextRequest } from "next/server";

import { handleStripeWebhook } from "@/server/stripe-webhook";

// Backwards-compatible alias for the original sponsor-only webhook URL.
export function POST(request: NextRequest) {
  return handleStripeWebhook(request);
}
