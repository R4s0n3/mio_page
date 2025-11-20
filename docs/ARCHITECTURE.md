# Architecture Overview

- Tech stack: Next.js 15 app with the app router, TRPC, Prisma (MySQL), Tailwind for styling.
- Data model: Prisma models include Product, ProductType, Order, Post, User, and more. A soft-delete pattern is implemented via a `deletedAt` timestamp on several models.
- API layer: TRPC routers expose data to the client (e.g., `productRouter.getMerch`, `postRouter.getLatest`, `projectRouter.getLatest`). The TRPC context exposes `db` (Prisma client).
- Frontend: Pages under `src/app` compose UI using components in `src/app/_components` and global layout in `src/app/layout.tsx`.
- Data access patterns: Queries generally fetch from Prisma with filters to exclude soft-deleted records (where `deletedAt` is null) and may include related data via `include` or selective `select` when appropriate.
- Observed gaps: inconsistent soft-delete filtering across models, and some queries fetch entire rows where projection would be preferable.

## Soft-delete Strategy

- Default to returning non-deleted records by using `where: { deletedAt: null }`.
- Centralize the pattern via a small helper (e.g., `notDeleted`) to avoid drift.

## How to Extend

- Add new TRPC routers following existing structure, wire them to `ctx.db`.
- Prefer field projection (`select`) when UI only needs a subset of fields.
- Add Zod schemas for inputs and a lightweight error wrapper for consistent API responses.

## Development and Testing

- Add unit tests for core routers (product, post, project) with mocked Prisma client.
- Document architecture decisions in this file and in a README/ARCHITECTURE.md alternative if needed.
