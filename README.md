# Mio Mideal Homepage

This is the [Mio Mideal](https://www.miomideal.com/) Homepage codebase.
Feel free to visit our page.

## Local sponsor fixtures

For a blank local test database, create the current schema and then load the fixtures:

```bash
npm run db:push
npm run db:seed
```

Use `db:migrate` for an already-baselined environment. The repository's checked-in migrations are
incremental and cannot bootstrap a completely empty database by themselves.

The seed is idempotent and creates four occupied sponsor spots, two empty spots, and representative
pending, outbid, and cancelled bid history. It only upserts records with the fixed sponsor fixture
IDs and does not clear unrelated shop data.

## Stripe payment setup

Shop and sponsor checkouts use Stripe Checkout post-payment invoices. Before accepting live
payments, configure the Stripe business and invoice settings with the legal provider name, address,
support details, invoice prefix, and the applicable German tax number. The Checkout integration adds
the Kleinunternehmer notice under § 19 UStG; Stripe supplies the sequential invoice number, hosted
invoice, and PDF.

Create one Stripe webhook endpoint pointing to:

```text
https://YOUR_DOMAIN/api/stripe/webhook
```

Subscribe it to these events:

```text
checkout.session.completed
checkout.session.async_payment_succeeded
checkout.session.expired
```

Store that endpoint's `whsec_...` value as `STRIPE_WEBHOOK_SECRET`. For local testing with the
Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

The success pages use the same idempotent reconciliation as a browser fallback, but the webhook is
required in production so closing the browser cannot leave a paid order unprocessed. The database
schema for this release was synchronized with production using `npm run db:push`, so there is no
migration to deploy for this release.

Starting with the next schema change, create a migration locally and deploy it before the
corresponding application version:

```bash
npm run db:generate -- --name <migration-name>
npm run db:migrate
```
