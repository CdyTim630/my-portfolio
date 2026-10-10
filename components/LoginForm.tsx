"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { authErrorMessage } from "@/lib/auth-errors";
import PersonalThemeSwitcher from "@/components/personal/PersonalThemeSwitcher";
import styles from "./LoginForm.module.css";

export default function LoginForm({ configured, initialMessage, localAvailable = false }: { configured: boolean; initialMessage: string; localAvailable?: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  const [message, setMessage] = useState(initialMessage);
  const localOnly = localAvailable && !configured;
  const normalizedEmail = email.trim();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

  async function signIn(event: FormEvent) {
    event.preventDefault();
    if (!configured || inFlight.current || !validEmail || !password) return;
    inFlight.current = true;
    setBusy(true);
    setMessage("");
    try {
      const { error } = await createClient().auth.signInWithPassword({ email: normalizedEmail, password });
      if (error) setMessage(authErrorMessage(error, "password"));
      else { router.push("/admin"); router.refresh(); }
    } catch (error) { setMessage(authErrorMessage(error, "password")); }
    finally { inFlight.current = false; setBusy(false); }
  }

  async function sendMagicLink() {
    if (!configured || inFlight.current || !validEmail) return;
    inFlight.current = true;
    setBusy(true);
    setMessage("");
    try {
      const { error } = await createClient().auth.signInWithOtp({ email: normalizedEmail, options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/auth/callback` } });
      setMessage(error ? authErrorMessage(error, "magic-link") : "If this is an existing account, check your email for a sign-in link. Open it in this browser to complete sign-in.");
    } catch (error) { setMessage(authErrorMessage(error, "magic-link")); }
    finally { inFlight.current = false; setBusy(false); }
  }

  return <PersonalThemeSwitcher><main id="main-content" className="min-h-screen flex items-center justify-center p-6 text-[var(--home-text)]">
    <section className={`${styles.card} w-full max-w-md rounded-2xl border border-[var(--home-border)] bg-[var(--home-surface)] p-8`}>
      <Link href="/" className="text-sm text-[var(--home-primary)]">← Back to personal website</Link>
      <h1 className="mt-8 text-3xl font-bold text-[var(--home-text-strong)]">{localOnly ? "本機後台" : "Administrator sign in"}</h1>
      <p className="mt-3 text-sm leading-7">{localOnly ? "免填 Email 與密碼，直接開始編輯專案。修改儲存在這台電腦，發布只更新本機作品集。" : "Access for the portfolio owner. Accounts are provisioned privately."}</p>
      {!configured && !localAvailable && <p role="status" className="mt-5 rounded-lg border border-[var(--home-border)] p-4 text-sm">Sign-in is unavailable in this preview. The public portfolio is still available.</p>}
      {message && <p role="status" className="mt-5 rounded-lg border border-[var(--home-border)] p-4 text-sm">{message}</p>}
      {localAvailable && <form action="/api/local-admin/session" method="post" className="mt-6">
        <button type="submit" className={`${styles.primaryButton} w-full rounded-lg bg-[var(--home-primary)] p-3 font-semibold text-white`}>進入本機後台</button>
      </form>}
      {!localOnly && <><form onSubmit={signIn} className="mt-6 space-y-5">
        <div><label htmlFor="login-email" className="block text-sm font-medium mb-2">Email</label><input id="login-email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={254} className="w-full rounded-lg border border-[var(--home-border)] bg-[var(--home-surface-muted)] p-3" /></div>
        <div><label htmlFor="login-password" className="block text-sm font-medium mb-2">Password</label><input id="login-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required className="w-full rounded-lg border border-[var(--home-border)] bg-[var(--home-surface-muted)] p-3" /></div>
        <button disabled={!configured || busy} className={`${styles.primaryButton} w-full rounded-lg bg-[#2563EB] p-3 font-semibold text-white disabled:opacity-50`}>{busy ? "Please wait…" : "Sign in"}</button>
      </form>
      <button type="button" onClick={sendMagicLink} disabled={!configured || busy || !validEmail} className="mt-4 w-full rounded-lg border border-[var(--home-border)] p-3 text-sm font-medium disabled:opacity-50">Email a sign-in link</button>
      </>}
    </section>
  </main></PersonalThemeSwitcher>;
}
