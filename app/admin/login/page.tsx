"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return email.trim().length > 3 && password.length >= 6 && !busy;
  }, [email, password, busy]);

  useEffect(() => {
    // If already logged in, go to dashboard
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/admin");
    });
  }, [router]);

  async function signIn() {
    if (!canSubmit) return;
    setBusy(true);
    setMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;

      const userEmail = data.user?.email;
      if (!userEmail) throw new Error("No email on this user.");

      // Ensure this user is in admins table
      const { data: adminRow, error: adminErr } = await supabase
        .from("admins")
        .select("email")
        .eq("email", userEmail)
        .maybeSingle();

      if (adminErr) throw adminErr;

      if (!adminRow) {
        await supabase.auth.signOut();
        throw new Error("This account is not an admin.");
      }

      router.replace("/admin");
    } catch (e: any) {
      console.error(e);
      setMsg(e?.message || "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md bg-white border rounded-2xl p-6 shadow-sm">
        <h1 className="text-3xl font-bold">Admin login</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Sign in with your Supabase Auth admin email + password.
        </p>

        {msg && (
          <div className="mt-4 text-sm rounded-xl border border-red-200 bg-red-50 text-red-800 px-4 py-3">
            {msg}
          </div>
        )}

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-3 rounded-xl border bg-white"
              placeholder="admin@example.com"
              type="email"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-3 rounded-xl border bg-white"
              placeholder="••••••••"
              type="password"
              autoComplete="current-password"
            />
            <div className="mt-2 text-xs text-zinc-500">
              If you don’t have a password yet, create the admin user in Supabase Auth first.
            </div>
          </div>

          <button
            onClick={signIn}
            disabled={!canSubmit}
            className="w-full px-5 py-3 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </div>
    </main>
  );
}
