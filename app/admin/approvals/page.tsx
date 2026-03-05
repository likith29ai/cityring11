"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

type Profile = {
  id: string;
  name: string;
  email: string | null;
  instagram: string | null;
  whatsapp: string | null;
  telegram: string | null;
  upi_txn_id: string | null;
  payment_status: string;
  plan_id?: string | null;
  plan_price?: number | null;
};

export default function AdminApprovalsPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // ✅ NEW: show load errors on UI
  const [loadError, setLoadError] = useState<string | null>(null);

  async function loadPending() {
    setLoading(true);
    setLoadError(null);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("payment_status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      // ✅ Better logging (won’t show as {} )
      console.error("loadPending failed:", {
        message: error.message,
        details: (error as any)?.details,
        hint: (error as any)?.hint,
        code: (error as any)?.code,
        raw: error,
      });

      setUsers([]);
      setLoadError(error.message || "Failed to load pending approvals.");
      setLoading(false);
      return;
    }

    setUsers((data as Profile[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    loadPending();
  }, []);

  async function approve(profileId: string) {
    if (processingId) return;
    setProcessingId(profileId);

    try {
      // ✅ 1) Approve profile
      const { error: profErr } = await supabase
        .from("profiles")
        .update({
          payment_status: "verified",
          is_member: true,
        })
        .eq("id", profileId);

      if (profErr) {
        console.error("Approve profile failed:", {
          message: profErr.message,
          details: (profErr as any)?.details,
          hint: (profErr as any)?.hint,
          code: (profErr as any)?.code,
          raw: profErr,
        });
        alert(`Approve failed: ${profErr.message}`);
        return;
      }

      // ✅ 2) Activate subscription (very important for join-limit system)
      const { error: subErr } = await supabase
        .from("subscriptions")
        .update({
          status: "active",
          groups_used: 0,
          updated_at: new Date().toISOString(),
        })
        .eq("profile_id", profileId);

      if (subErr) {
        console.error("Activate subscription failed:", {
          message: subErr.message,
          details: (subErr as any)?.details,
          hint: (subErr as any)?.hint,
          code: (subErr as any)?.code,
          raw: subErr,
        });
        alert(
          `Approved profile, but subscription activation failed: ${subErr.message}\n\nMake sure payment page is creating subscriptions.`
        );
        return;
      }

      // ✅ remove from list
      setUsers((prev) => prev.filter((u) => u.id !== profileId));
    } finally {
      setProcessingId(null);
    }
  }

  async function reject(profileId: string) {
    if (processingId) return;
    setProcessingId(profileId);

    try {
      // ✅ 1) Reject profile
      const { error: profErr } = await supabase
        .from("profiles")
        .update({
          payment_status: "rejected",
          is_member: false,
        })
        .eq("id", profileId);

      if (profErr) {
        console.error("Reject profile failed:", {
          message: profErr.message,
          details: (profErr as any)?.details,
          hint: (profErr as any)?.hint,
          code: (profErr as any)?.code,
          raw: profErr,
        });
        alert(`Reject failed: ${profErr.message}`);
        return;
      }

      // ✅ 2) Mark subscription rejected (if exists)
      const { error: subErr } = await supabase
        .from("subscriptions")
        .update({
          status: "rejected",
          updated_at: new Date().toISOString(),
        })
        .eq("profile_id", profileId);

      // If no subscription exists, we can ignore, but log it
      if (subErr) {
        console.error("Mark subscription rejected failed (ignored):", {
          message: subErr.message,
          details: (subErr as any)?.details,
          hint: (subErr as any)?.hint,
          code: (subErr as any)?.code,
          raw: subErr,
        });
      }

      // ✅ remove from list
      setUsers((prev) => prev.filter((u) => u.id !== profileId));
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <main>
      <h1 className="text-4xl font-bold">Membership approvals</h1>
      <p className="mt-2 text-zinc-600">Approve or reject users after payment verification.</p>

      <div className="mt-6 flex gap-3">
        <button
          onClick={loadPending}
          className="px-4 py-2 rounded-xl border bg-white hover:bg-zinc-50 text-sm"
        >
          Refresh
        </button>
      </div>

      {/* ✅ NEW: show load error */}
      {loadError && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      )}

      {loading && <p className="mt-6 text-zinc-500">Loading...</p>}

      {!loading && !loadError && users.length === 0 && (
        <p className="mt-6 text-zinc-500">No pending approvals 🎉</p>
      )}

      <div className="mt-8 space-y-4">
        {users.map((u) => (
          <div
            key={u.id}
            className="bg-white border rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h3 className="text-lg font-semibold">{u.name}</h3>

              <div className="text-sm text-zinc-600 space-y-1 mt-1">
                {u.email && <div>Email: {u.email}</div>}
                {u.instagram && <div>Instagram: {u.instagram}</div>}
                {u.whatsapp && <div>WhatsApp: {u.whatsapp}</div>}
                {u.telegram && <div>Telegram: {u.telegram}</div>}
                {u.upi_txn_id && <div>Txn ID: {u.upi_txn_id}</div>}
                {u.plan_id && <div>Plan: {u.plan_id}</div>}
                {typeof u.plan_price === "number" && <div>Amount: ₹{u.plan_price}</div>}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => approve(u.id)}
                disabled={processingId === u.id}
                className="px-5 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
              >
                {processingId === u.id ? "Approving..." : "Approve"}
              </button>

              <button
                onClick={() => reject(u.id)}
                disabled={processingId === u.id}
                className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
              >
                {processingId === u.id ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
