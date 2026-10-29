# PesaPilot Wallet — starter project

This is a starter website, not a production-ready financial service.

## What is included
- Next.js website interface
- Supabase email/password sign-up and login
- Environment variable template

## Not included
- M-PESA Daraja integration or payment verification
- Automatic wallet balance crediting
- Withdrawal payouts
- Production financial security, compliance, monitoring, or audit review

Do not accept real customer deposits using this starter.

## Configure Supabase
1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_SUPABASE_URL` to your Supabase Project URL.
3. Set `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the Supabase **publishable key** (it may start with `sb_publishable_`). Do not use a secret or service-role key in a browser.
4. In Supabase Authentication settings, configure the allowed site URL and redirect URLs for your deployed website.
5. Confirm Row Level Security is enabled on public tables and that policies are reviewed.

## Run locally (requires a computer with Node.js)
```bash
npm install
npm run dev
```

## Deploy
Import this project into a supported host such as Vercel, then add the two environment variables in the host's project settings and deploy.

For mobile-only setup, you may need a GitHub account to upload the ZIP contents and then import the repository into Vercel. The ZIP itself does not publish a live website.

## Database notes
The existing `wallets` and `transactions` tables are only a starting point. The current SQL schema does not create a wallet automatically for each new user. Do not allow clients to update balances directly. A secure server-side payment verification flow and reviewed database functions/policies are required before handling money.
