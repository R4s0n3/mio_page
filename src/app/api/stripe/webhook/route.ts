import { type NextRequest } from "next/server";

import { handleStripeWebhook } from "@/server/stripe-webhook";

export function POST(request: NextRequest) {
  return handleStripeWebhook(request);
}
