"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleAuth(event: FormEvent, mode: "signup" | "login") {
    event.preventDefault();
    if (!supabase) {
      setMessage("Supabase is not configured yet. Add the environment variables before deploying.");
      return;
    }
    setBusy(true);
    setMessage("");
    const result = mode === "signup"
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (result.error) setMessage(result.error.message);
    else if (mode === "signup" && !result.data.session) {
      setMessage("Account created. Check your email to confirm your account, then log in.");
    } else setMessage(mode === "signup" ? "Account created." : "You are logged in.");
  }

  async function logout() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    setMessage(error ? error.message : "You have logged out.");
  }

  return (
    <main className="wrap">
      <section className="hero">
        <div className="brand">P</div>
        <p className="eyebrow">KES WALLET • STARTER</p>
        <h1>PesaPilot Wallet</h1>
        <p className="lead">A starter interface for account access. Payment processing is not enabled.</p>
      </section>

      {!supabaseConfigured && (
        <section className="notice">
          <strong>Setup required</strong>
          <p>Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in your hosting environment before using this app.</p>
        </section>
      )}

      <section className="panel">
        {user ? (
          <>
            <h2>Welcome</h2>
            <p className="muted">Signed in as <strong>{user.email}</strong></p>
            <div className="notice">
              Your account is connected. Wallet balance and transactions should only be shown after secure server-side rules and wallet creation are configured.
            </div>
            <button onClick={logout} className="secondary">Log out</button>
          </>
        ) : (
          <>
            <h2>Get started</h2>
            <p className="muted">Create an account or log in.</p>
            <form onSubmit={(e) => handleAuth(e, "login")}>
              <label htmlFor="email">Email</label>
              <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <label htmlFor="password">Password</label>
              <input id="password" type="password" autoComplete="current-password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button disabled={busy} type="submit">{busy ? "Please wait..." : "Log in"}</button>
              <button disabled={busy} type="button" className="secondary" onClick={(e) => handleAuth(e as unknown as FormEvent, "signup")}>Create account</button>
            </form>
          </>
        )}
        {message && <p className="message" role="status">{message}</p>}
      </section>

      <footer>
        <p>Demo only. No deposits, withdrawals, or balance changes are processed.</p>
      </footer>
    </main>
  );
}
