"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function ResetPasswordPage() {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Important: when user opens the link, Supabase creates a recovery session.
  useEffect(() => {
    // Nothing required here; session appears automatically after redirect.
  }, []);

  async function save() {
    setStatus(null);
    if (pw.length < 6) {
      setStatus("Password must be at least 6 characters.");
      return;
    }
    if (pw !== pw2) {
      setStatus("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // 1) Update Supabase Auth password (this makes link flow complete)
      const { error: authErr } = await supabase.auth.updateUser({ password: pw });
      if (authErr) throw authErr;

      // 2) Get the user email from the recovery session
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;

      const email = userData.user?.email;
      if (!email) {
        throw new Error("Could not read email from session. Please use the reset link again.");
      }

      // 3) Update your custom password hash in profiles (so Join works with new password)
      const { error: rpcErr } = await supabase.rpc("set_profile_password_by_email", {
        _email: email,
        _new_password: pw,
      });
      if (rpcErr) throw rpcErr;

      setStatus("✅ Password updated successfully. You can now join using the new password.");
      setPw("");
      setPw2("");
    } catch (e: any) {
      setStatus(e?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold">Reset Password</h1>
        <p className="mt-2 text-zinc-600">Enter a new password.</p>

        <div className="mt-8 bg-white border rounded-2xl shadow-sm p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-zinc-700">New password *</label>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="New password"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">Confirm password *</label>
            <input
              type="password"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Confirm password"
            />
          </div>

          <button
            type="button"
            onClick={save}
            disabled={loading}
            className={`w-full px-4 sm:px-6 py-3 rounded-xl text-white shadow-md ${
              loading ? "bg-zinc-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : "Save new password"}
          </button>

          {status && <p className="text-sm text-zinc-700">{status}</p>}
        </div>
      </div>
    </main>
  );
}
