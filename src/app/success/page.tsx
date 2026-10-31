import { validateCheckoutSession } from "@/server/checkout-validation";
import type { CheckoutValidationResult } from "@/utils/checkout-validation";
import { pageMetadata } from "@/utils/site-metadata";
import SuccessView from "./success-view";

export const metadata = pageMetadata({
  title: "Order confirmation",
  description: "Payment status for your Mio Mideal order.",
  path: "/success",
  index: false,
});

export const dynamic = "force-dynamic";

type SuccessPageProps = {
  searchParams: Promise<{
    session_id?: string | string[];
  }>;
};

function getSessionId(sessionId: string | string[] | undefined) {
  if (Array.isArray(sessionId)) return sessionId[0];
  return sessionId;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const sessionId = getSessionId(params.session_id);

  const validation: CheckoutValidationResult = sessionId
    ? await validateCheckoutSession(sessionId)
    : {
        status: "invalid",
        message: "No checkout session was provided.",
      };

  return <SuccessView validation={validation} />;
}
