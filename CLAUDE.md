# QLight Kuwait (qlightkw.com)

## Branches
- `master` is the default branch and the only one that deploys (Dokploy builds it on every push).
- `main` is the old Lovable copy with no shared history. Never branch from it or open PRs against it.
- Site work (`src/`, `supabase/`, `nginx.conf`, `Dockerfile`): branch from `origin/master`, PR base `master`.
- After a PR is merged, put follow-up commits on a new branch and PR; pushes to a merged branch never reach the site.

## Supabase
- Edge functions and the database are shared by every branch. Compare with the deployed source before redeploying a function.
- Migrations in this repo are applied by hand. Never run `supabase db push`: the migration history is out of sync.
- `product_images` and the catalog exceed 1000 rows: paginate with `.range()`.
- Functions run with `verify_jwt = false`, so each one must check its caller itself.

## Safety
- The repository is public. Never commit tokens, keys or purchase costs.
