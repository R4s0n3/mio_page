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
