# PesaPilot setup guide

## What you need

- A computer with Node.js 20+ and Git. You can read this file on a phone, but initial setup is easier on a computer.
- A Supabase account/project: https://supabase.com
- A Safaricom Daraja developer account: https://developer.safaricom.co.ke/
- A Vercel account: https://vercel.com

## 1. Run locally

1. Extract the ZIP.
2. Copy `.env.example` to `.env.local`.
3. Fill in Supabase values after completing step 2.
4. In the project folder run:

   ```bash
   npm install
   npm run dev
   ```

5. Open http://localhost:3000.

## 2. Configure Supabase

1. Create a new Supabase project.
2. Open Project Settings / API and copy the project URL and publishable (or anon) key into:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Copy the service-role key into `SUPABASE_SERVICE_ROLE_KEY`. **This key is a server secret. Never add `NEXT_PUBLIC_` to it, commit it, or put it in browser code.**
4. Open SQL Editor, paste all of `supabase/schema.sql`, and run it.
5. In Authentication settings, configure your site URL and email confirmation / redirect URLs for local development and production.
6. Test account signup/login.

## 3. Configure Daraja sandbox

1. Sign in at https://developer.safaricom.co.ke/ and create a sandbox app with the M-PESA Express / STK Push product.
2. Copy the sandbox consumer key and secret to `.env.local` as `DARAJA_CONSUMER_KEY` and `DARAJA_CONSUMER_SECRET`.
3. Use the shortcode and passkey shown by the Daraja sandbox/test credentials in `DARAJA_SHORTCODE` and `DARAJA_PASSKEY`. Do not use a real passkey for sandbox.
4. Keep `DARAJA_ENV=sandbox` and `ENABLE_LIVE_MONEY=false`.
5. Set `DARAJA_CALLBACK_URL` to a publicly reachable HTTPS URL ending with `/api/mpesa/callback`. For local callback testing, use a temporary HTTPS tunnel only for development; never use a tunnel as the permanent production URL.
6. Set `DARAJA_CALLBACK_TOKEN` to a long random string (for example, generate one with a password manager). This token is only an extra guard, not proof that a callback is genuine.
7. Restart the development server after changing environment variables.
8. Use Daraja's sandbox simulator/test data. Sandbox callbacks may need a public HTTPS URL. A sandbox success is not real money.

## 4. Deploy to Vercel

1. Create a private GitHub repository and upload the project. Do not upload `.env.local`.
2. In Vercel choose **Add New → Project**, import the repository, and deploy.
3. In Vercel Project Settings → Environment Variables, add the variables from `.env.example` using your actual Supabase and Daraja sandbox values.
4. Set `DARAJA_CALLBACK_URL` to `https://YOUR-VERCEL-DOMAIN/api/mpesa/callback`.
5. Redeploy after adding environment variables.
6. In Supabase Authentication settings, add the deployed domain as the site URL / allowed redirect URL.
7. Verify signup, login, wallet view, and the sandbox payment flow.

Official deployment guide: https://vercel.com/docs/frameworks/full-stack/nextjs

## 5. Before any real-money launch (mandatory)

**Do not switch `ENABLE_LIVE_MONEY=true` until the application has been professionally reviewed and the necessary business/provider approvals are in place.** The current project intentionally does not credit balances from callbacks or send live withdrawals.

Required production work:
- Safaricom approval and production Daraja credentials, a live shortcode/paybill/till and STK Push passkey.
- If you intend to pay users through M-PESA, Safaricom says B2C requires an approved B2C / bulk disbursement account or eligible one-account setup. See https://developer.safaricom.co.ke/apis/BusinessToCustomer.
- Verify each successful STK payment against Daraja transaction status or authoritative provider records before crediting.
- Use an append-only double-entry ledger and atomic PostgreSQL functions for every credit, reserve, debit, refund, and reversal; enforce unique provider receipt / checkout IDs for idempotency.
- Add withdrawal holds and an authenticated admin approval process, audit logs, daily reconciliation, transaction limits, fraud monitoring, and alerts.
- Add server-side rate limiting, CSRF protections where applicable, request validation, admin MFA/RBAC, monitoring, backups, and incident response.
- Review Kenyan legal/regulatory requirements for operating a wallet or holding/transmitting customer funds. Obtain appropriate legal and compliance advice.
- Do not ask customers to share their M-PESA PIN or OTP with your website or support team.

## Current functionality

- Email signup/login via Supabase Auth.
- Wallet balance and recent transaction list.
- Server-side STK Push request scaffold.
- Callback receiver stores callback for reconciliation but does not credit balances.
- Withdrawal request submission for review; no money is sent.
- Real-money operations are intentionally fail-closed by default.

## Troubleshooting

- `Supabase is not configured`: check environment variables in `.env.local` and restart.
- Signup succeeds but login does not: check email confirmation and Supabase Auth URL settings.
- STK Push says not configured: check sandbox shortcode, passkey, consumer credentials, callback URL and callback token.
- Daraja callback never arrives: callback must be publicly reachable over HTTPS.
- Never paste credentials, passkeys, service-role keys, or customer data into public issues or chats.

## 6. Admin dashboard

See `ADMIN.md` to configure the read-only withdrawal review queue at `/admin`. It is restricted to UUIDs listed in the server-only `ADMIN_USER_IDS` environment variable. It does not execute payouts.
