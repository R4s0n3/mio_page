// Soft-delete helpers for Prisma
export const NOT_DELETED = { deletedAt: null } as const;
export const notDeleted = NOT_DELETED;
