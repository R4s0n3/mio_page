import "server-only";

import { db } from "@/server/db";
import { readOrderStatusToken } from "@/server/order-status-token";

export async function getOrderStatusFromToken(token: string) {
  const payload = readOrderStatusToken(token);
  if (!payload) return null;

  const order = await db.order.findFirst({
    where: {
      id: payload.orderId,
      customerEmail: payload.email,
      deletedAt: null,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      shipping: true,
    },
  });

  if (!order) return null;

  return order;
}
