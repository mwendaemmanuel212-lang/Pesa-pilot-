# Admin dashboard setup

The starter includes `/admin`, a read-only queue for pending withdrawal requests.

1. Create a test user and sign in.
2. Copy that user's UUID from Supabase Authentication → Users.
3. Add `ADMIN_USER_IDS=that-user-uuid` to `.env.local` locally, or to your Vercel project environment variables.
4. Redeploy/restart. Visit `/admin` while signed in as that user.

You can list multiple administrator UUIDs separated by commas. This is intentionally server-side and must not be changed to a `NEXT_PUBLIC_` variable.

The page does not send payouts, approve withdrawals, or alter balances. Before enabling real withdrawals, implement proper admin MFA, audit logs, atomic funds reservation, approval separation-of-duties, B2C integration, idempotent provider result processing, and reconciliation.
