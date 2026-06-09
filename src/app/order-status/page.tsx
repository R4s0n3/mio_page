import Link from "next/link";

import { getOrderStatusFromToken } from "@/server/order-status-access";

export const dynamic = "force-dynamic";

type OrderStatusPageProps = {
  searchParams: Promise<{
    token?: string | string[];
  }>;
};

function getToken(token: string | string[] | undefined) {
  if (Array.isArray(token)) return token[0];
  return token;
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  }).format(amount / 100);
}

export default async function OrderStatusPage({
  searchParams,
}: OrderStatusPageProps) {
  const params = await searchParams;
  const token = getToken(params.token);
  const order = token ? await getOrderStatusFromToken(token) : null;

  if (!order) {
    return (
      <main className="flex size-full min-h-screen items-center justify-center bg-primary-900 px-4">
        <section className="max-w-xl rounded-lg border border-secondary-800/20 bg-surface-100 p-8 text-center">
          <h1 className="gradient-text mb-4 font-headline text-4xl">
            Order link invalid
          </h1>
          <p className="mb-6 text-body">
            This order status link is missing, expired, or could not be
            verified.
          </p>
          <Link
            href="/#merch"
            className="inline-flex rounded-lg bg-accent px-6 py-3 font-subhead text-primary-900 transition-colors duration-200 hover:bg-accent/80"
          >
            Continue Shopping
          </Link>
        </section>
      </main>
    );
  }

  const total = order.items.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0,
  );

  return (
    <main className="flex size-full min-h-screen items-center justify-center bg-primary-900 px-4 py-16">
      <section className="w-full max-w-3xl rounded-lg border border-secondary-800/20 bg-surface-100 p-6">
        <div className="mb-8">
          <h1 className="gradient-text mb-3 font-headline text-4xl">
            Order Status
          </h1>
          <p className="text-sm text-body/70">Order {order.id.slice(0, 8)}</p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="font-subhead text-xs uppercase text-headings/60">
              Status
            </p>
            <p className="font-subhead text-2xl text-headings">
              {order.status}
            </p>
          </div>
          <div>
            <p className="font-subhead text-xs uppercase text-headings/60">
              Updated
            </p>
            <p className="text-body">{order.updatedAt.toLocaleString()}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 font-subhead text-xl text-headings">Items</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-4 border-b border-secondary-800/20 pb-3"
              >
                <div>
                  <p className="font-subhead text-headings">
                    {item.product.name}
                  </p>
                  <p className="text-sm text-body/70">
                    Qty {item.qty}
                    {item.size ? ` - Size ${item.size}` : ""}
                  </p>
                </div>
                <p className="text-right font-subhead text-headings">
                  {formatMoney(item.product.price * item.qty)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-secondary-800/20 pt-4">
          <span className="font-subhead text-headings">Total</span>
          <span className="font-subhead text-xl text-headings">
            {formatMoney(total)}
          </span>
        </div>
      </section>
    </main>
  );
}
