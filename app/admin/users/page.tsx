"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

type Row = {
  profile_id: string;
  name: string;
  email: string | null;
  instagram: string | null;
  whatsapp: string | null;
  telegram: string | null;

  payment_status: string;
  is_member: boolean;
  upi_txn_id: string | null;

  plan_id: string | null;
  group_limit: number | null;
  groups_used: number | null;
  subscription_status: "pending_approval" | "active" | "expired" | "rejected" | null;
  updated_at: string | null;
};

export default function AdminUsersPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Row | null>(null);

  const [saving, setSaving] = useState(false);

  // editable fields
  const [editLimit, setEditLimit] = useState<string>("");
  const [editUsed, setEditUsed] = useState<string>("");
  const [editStatus, setEditStatus] = useState<Row["subscription_status"]>(null);

  async function load() {
    setLoading(true);

    // Prefer the view (best)
    const { data, error } = await supabase
      .from("v_memberships")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) console.error(error);
    setRows((data as any) || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rows;

    return rows.filter((r) => {
      return (
        (r.name || "").toLowerCase().includes(term) ||
        (r.email || "").toLowerCase().includes(term) ||
        (r.instagram || "").toLowerCase().includes(term) ||
        (r.whatsapp || "").toLowerCase().includes(term) ||
        (r.telegram || "").toLowerCase().includes(term) ||
        r.profile_id.toLowerCase().includes(term)
      );
    });
  }, [rows, q]);

  function openRow(r: Row) {
    setSelected(r);
    setEditLimit(String(r.group_limit ?? ""));
    setEditUsed(String(r.groups_used ?? 0));
    setEditStatus(r.subscription_status ?? null);
  }

  function groupsLeftPreview(limit: number | null, used: number | null) {
    const l = Number(limit ?? 0);
    const u = Number(used ?? 0);
    return Math.max(l - u, 0);
  }

  async function save() {
    if (!selected) return;
    if (saving) return;

    const group_limit = Number(editLimit);
    const groups_used = Number(editUsed);

    if (!Number.isFinite(group_limit) || group_limit <= 0) {
      alert("group_limit must be a number > 0");
      return;
    }
    if (!Number.isFinite(groups_used) || groups_used < 0) {
      alert("groups_used must be a number >= 0");
      return;
    }

    // Auto-expire if used >= limit
    let nextStatus: Row["subscription_status"] = editStatus;
    if (groups_used >= group_limit) nextStatus = "expired";
    if (!nextStatus) nextStatus = "active";

    setSaving(true);

    try {
      // ensure subscription exists: if missing, insert one
      const { data: existing, error: checkErr } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("profile_id", selected.profile_id)
        .maybeSingle();

      if (checkErr) {
        console.error(checkErr);
        alert(`Error checking subscription: ${checkErr.message}`);
        setSaving(false);
        return;
      }

      if (!existing) {
        // Create a subscription row if not present
        const { error: insErr } = await supabase.from("subscriptions").insert({
          profile_id: selected.profile_id,
          plan_id: selected.plan_id ?? "manual",
          group_limit,
          groups_used,
          status: nextStatus,
        });

        if (insErr) {
          console.error(insErr);
          alert(`Failed to create subscription: ${insErr.message}`);
          setSaving(false);
          return;
        }
      } else {
        const { error: updErr } = await supabase
          .from("subscriptions")
          .update({
            group_limit,
            groups_used,
            status: nextStatus,
            updated_at: new Date().toISOString(),
          })
          .eq("profile_id", selected.profile_id);

        if (updErr) {
          console.error(updErr);
          alert(`Failed to update subscription: ${updErr.message}`);
          setSaving(false);
          return;
        }
      }

      // Optional: keep profile flags consistent
      // If subscription is active => member true + verified (you can customize)
      if (nextStatus === "active") {
        await supabase
          .from("profiles")
          .update({ is_member: true, payment_status: "verified" })
          .eq("id", selected.profile_id);
      }
      if (nextStatus === "expired") {
        await supabase.from("profiles").update({ is_member: false }).eq("id", selected.profile_id);
      }

      alert("✅ Updated successfully");
      setSelected(null);
      await load();
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-bold">Admin — Manage Users</h1>
        <p className="mt-2 text-zinc-600">Search users and manually edit group limits/usage.</p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full sm:w-[420px] rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Search by name, email, insta, whatsapp, telegram..."
          />
          <button
            onClick={load}
            className="px-4 py-3 rounded-xl border bg-white hover:bg-zinc-50 text-sm"
          >
            Refresh
          </button>
        </div>

        {loading && <p className="mt-6 text-zinc-500">Loading...</p>}

        {!loading && filtered.length === 0 && (
          <p className="mt-6 text-zinc-500">No users found.</p>
        )}

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.slice(0, 60).map((r) => (
            <button
              key={r.profile_id}
              onClick={() => openRow(r)}
              className="text-left bg-white border rounded-2xl p-5 shadow-sm hover:bg-zinc-50 transition"
              type="button"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold">{r.name}</div>
                  <div className="text-sm text-zinc-600">
                    {r.email || r.instagram || r.whatsapp || r.telegram || r.profile_id}
                  </div>
                  <div className="mt-2 text-xs text-zinc-500">
                    Plan: <b>{r.plan_id ?? "-"}</b> • Status:{" "}
                    <b>{r.subscription_status ?? "-"}</b>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-zinc-600">Groups left</div>
                  <div className="text-xl font-bold">
                    {groupsLeftPreview(r.group_limit, r.groups_used)}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Editor Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white rounded-2xl border shadow-lg p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">{selected.name}</h2>
                  <p className="text-sm text-zinc-600">
                    {selected.email || selected.instagram || selected.whatsapp || selected.telegram || selected.profile_id}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Profile ID: {selected.profile_id}
                  </p>
                </div>

                <button
                  onClick={() => setSelected(null)}
                  className="px-3 py-1 rounded-lg border bg-white hover:bg-zinc-50 text-sm"
                >
                  Close
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-zinc-700">Group limit</label>
                  <input
                    value={editLimit}
                    onChange={(e) => setEditLimit(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="eg: 30"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-700">Groups used</label>
                  <input
                    value={editUsed}
                    onChange={(e) => setEditUsed(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="eg: 12"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-700">Status</label>
                  <select
                    value={editStatus ?? ""}
                    onChange={(e) => setEditStatus((e.target.value as any) || null)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">(auto)</option>
                    <option value="pending_approval">pending_approval</option>
                    <option value="active">active</option>
                    <option value="expired">expired</option>
                    <option value="rejected">rejected</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 text-sm text-zinc-700">
                Groups left (preview):{" "}
                <b>{groupsLeftPreview(Number(editLimit || 0), Number(editUsed || 0))}</b>
                {Number(editUsed) >= Number(editLimit) && (
                  <span className="ml-2 text-orange-700">(Will auto-expire)</span>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={save}
                  disabled={saving}
                  className="px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
                <button
                  onClick={() => setSelected(null)}
                  disabled={saving}
                  className="px-5 py-3 rounded-xl border bg-white hover:bg-zinc-50 disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>

              <p className="mt-4 text-xs text-zinc-500">
                Tip: If groups_used ≥ group_limit, status will automatically become <b>expired</b>.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
