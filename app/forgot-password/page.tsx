"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Mode = "instagram" | "whatsapp" | "telegram";

export default function ForgotPasswordPage() {
  const [mode, setMode] = useState<Mode>("instagram");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function sendLink() {
    setStatus(null);
    const clean = value.trim();
    if (!clean) {
      setStatus("Please enter your details.");
      return;
    }

    setLoading(true);
    try {
      // 1) Find email from your profiles table using the handle/number
      const { data, error } = await supabase.rpc("get_email_for_identifier", {
        _identifier_type: mode,
        _identifier_value: clean,
      });

      if (error) throw error;

      const email = Array.isArray(data) ? data[0]?.email : (data as any)?.email;

      // Security-friendly: do not reveal if user exists
      if (!email) {
        setStatus("If your account exists, a reset link will be sent to your email.");
        setLoading(false);
        return;
      }

      // 2) Ask Supabase Auth to send the reset link to that email (FREE)
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetErr) throw resetErr;

      setStatus("✅ Reset link sent to your email. Please check inbox/spam.");
      setValue("");
    } catch (e: any) {
      setStatus(e?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold">Forgot Password</h1>
        <p className="mt-2 text-zinc-600">
          Enter your Instagram/WhatsApp/Telegram and we’ll email you a reset link.
        </p>

        <div className="mt-8 bg-white border rounded-2xl shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setMode("instagram")}
              className={`rounded-xl border px-4 py-3 text-sm ${
                mode === "instagram" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-zinc-200"
              }`}
            >
              Instagram
            </button>
            <button
              type="button"
              onClick={() => setMode("whatsapp")}
              className={`rounded-xl border px-4 py-3 text-sm ${
                mode === "whatsapp" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-zinc-200"
              }`}
            >
              WhatsApp
            </button>
            <button
              type="button"
              onClick={() => setMode("telegram")}
              className={`rounded-xl border px-4 py-3 text-sm ${
                mode === "telegram" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-zinc-200"
              }`}
            >
              Telegram
            </button>
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">
              {mode === "instagram"
                ? "Instagram username"
                : mode === "whatsapp"
                ? "WhatsApp number"
                : "Telegram username/number"}{" "}
              *
            </label>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={mode === "instagram" ? "eg: yourhandle" : mode === "whatsapp" ? "eg: 9876543210" : "eg: @username"}
            />
          </div>

          <button
            type="button"
            onClick={sendLink}
            disabled={loading}
            className={`w-full px-4 sm:px-6 py-3 rounded-xl text-white shadow-md ${
              loading ? "bg-zinc-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>

          {status && <p className="text-sm text-zinc-700">{status}</p>}

          <p className="text-xs text-zinc-500">
            The reset link will be sent to the email you used during registration.
          </p>
        </div>
      </div>
    </main>
  );
}
