import { z } from "zod";

const optionalTextSchema = z.string().min(1).optional();

export const cartItemSchema = z.object({
  id: z.string().min(1),
  productId: z.string().min(1),
  name: z.string().min(1),
  price: z.number().int().nonnegative(),
  image: optionalTextSchema,
  typeName: optionalTextSchema,
  size: z.string().min(1).max(32).optional(),
  quantity: z.number().int().min(1).max(99),
  addedAt: z.string().min(1),
});

export const cartSchema = z.object({
  items: z.array(cartItemSchema).default([]),
});

export const checkoutCartItemSchema = z.object({
  productId: z.string().min(1),
  size: z.string().min(1).max(32).optional(),
  quantity: z.number().int().min(1).max(99),
});

export const checkoutRequestSchema = z.object({
  cartItems: z.array(checkoutCartItemSchema).min(1).max(50),
});

export const checkoutResponseSchema = z.object({
  checkoutUrl: z.string().url(),
});

export const checkoutErrorResponseSchema = z.object({
  error: z.string().min(1),
});

export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = z.infer<typeof cartSchema>;
export type CheckoutCartItem = z.infer<typeof checkoutCartItemSchema>;
