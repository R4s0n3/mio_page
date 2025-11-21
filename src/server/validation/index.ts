// Lightweight validation utilities for TRPC endpoints
import { z } from "zod";

export const idSchema = z.string().min(1);
export const paginationSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
});

export const safeParse = <T>(schema: z.ZodType<T>, data: unknown): T => {
  return schema.parse(data);
};

// Simple wrapper to catch and surface validation errors in TRPC endpoints
export const validateOrThrow = <T>(schema: z.ZodType<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (e) {
    // rethrow; TRPC will serialize ZodError via the configured formatter
    throw e;
  }
};
