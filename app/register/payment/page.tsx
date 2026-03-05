"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

type SelectedPlanLS = {
  plan_id: string;
  plan_price: number;
  plan_group_limit: number;
  is_renewal?: boolean;
};

export default function PaymentPage() {
  const [txnId, setTxnId] = useState("");
  const [draft, setDraft] = useState<any>(null);
  const [profileId, setProfileId] = useState<string | null>(null);

  const [selectedPlan, setSelectedPlan] = useState<SelectedPlanLS | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const rawDraft = localStorage.getItem("cityring_register_draft");
    if (rawDraft) setDraft(JSON.parse(rawDraft));

    const pid = localStorage.getItem("cityring_profile_id");
    if (pid) setProfileId(pid);

    const rawSelected = localStorage.getItem("selectedPlan");
    if (rawSelected) setSelectedPlan(JSON.parse(rawSelected));
  }, []);

  const amount = useMemo(() => {
    const n = Number(selectedPlan?.plan_price ?? draft?.plan_price);
    return Number.isFinite(n) && n > 0 ? n : 99;
  }, [draft, selectedPlan]);

  const canSubmit = useMemo(() => {
    return !!profileId && !!selectedPlan && txnId.trim().length >= 6 && !submitting;
  }, [profileId, selectedPlan, txnId, submitting]);

  async function submit() {
    if (!profileId) {
      alert("Profile not found. Please register again.");
      window.location.href = "/register";
      return;
    }

    if (!selectedPlan) {
      alert("Plan not found. Please select a plan again.");
      window.location.href = "/register";
      return;
    }

    const cleanTxn = txnId.trim();
    if (cleanTxn.length < 6) return;

    setSubmitting(true);

    try {
      const { error: profileErr } = await supabase
        .from("profiles")
        .update({
          upi_txn_id: cleanTxn,
          payment_status: "pending",
          plan_id: selectedPlan.plan_id || null,
          plan_price: Number(selectedPlan.plan_price) || null,
        })
        .eq("id", profileId);

      if (profileErr) {
        console.error("Payment update failed:", profileErr);
        alert(`Payment submit failed: ${profileErr.message}`);
        setSubmitting(false);
        return;
      }

      const { error: subErr } = await supabase.from("subscriptions").upsert(
        {
          profile_id: profileId,
          plan_id: selectedPlan.plan_id,
          group_limit: Number(selectedPlan.plan_group_limit) || 0,
          groups_used: 0,
          status: "pending_approval",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "profile_id" }
      );

      if (subErr) {
        console.error("Subscription upsert failed:", subErr);
        alert(`Subscription update failed: ${subErr.message}`);
        setSubmitting(false);
        return;
      }

      const payload = {
        ...draft,
        selectedPlan,
        upi_txn_id: cleanTxn,
        submittedAt: new Date().toISOString(),
        profile_id: profileId,
      };
      localStorage.setItem("cityring_register_submitted", JSON.stringify(payload));

      alert("✅ Payment submitted! Admin will verify and activate your membership.");

      const returnTo = localStorage.getItem("renew_return_to");
      if (selectedPlan?.is_renewal && returnTo) {
        localStorage.removeItem("renew_return_to");
        window.location.href = returnTo;
      } else {
        window.location.href = "/join";
      }
    } catch (e: any) {
      console.error(e);
      alert("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen text-white">
      {/* Dark premium background */}
      <div className="fixed inset-0 -z-10 bg-[#07070A]">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_20%_10%,rgba(255,255,255,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_80%_30%,rgba(255,255,255,0.08),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_50%_100%,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.04))]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Secure UPI Checkout
            </div>

            <h1 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
              Finish your membership payment
            </h1>
            <p className="mt-2 text-white/70 max-w-2xl">
              Scan the QR, pay the exact amount, then paste your transaction (UTR) ID.
              Admin will verify and activate your membership.
            </p>
          </div>

          {/* Amount pill */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-5 py-4">
            <p className="text-xs text-white/60">Payable Amount</p>
            <p className="mt-1 text-2xl font-bold">₹{amount}</p>
            <p className="mt-1 text-xs text-white/60">
              Group limit: {selectedPlan?.plan_group_limit ?? draft?.plan_group_limit ?? "—"}
            </p>
          </div>
        </div>

        {/* Warnings */}
        <div className="mt-6 space-y-3">
          {!selectedPlan && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              Plan not found. Please go back and select a plan again.
            </div>
          )}

          {selectedPlan && !profileId && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              Profile not found. Please register again.
            </div>
          )}
        </div>

        {/* Main grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: QR */}
          <section className="lg:col-span-7">
            <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-semibold">Scan & Pay</h2>
                    <p className="mt-2 text-sm text-white/70">
                      Use any UPI app (GPay / PhonePe / Paytm). Pay exactly{" "}
                      <span className="font-semibold text-white">₹{amount}</span>.
                    </p>
                  </div>

                  <div className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70">
                    UPI • Instant
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* QR Card */}
                  <div className="md:col-span-6">
                    <div className="relative rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-5">
                      <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-[radial-gradient(600px_240px_at_50%_0%,rgba(255,255,255,0.10),transparent_65%)]" />
                      <div className="relative rounded-2xl border border-white/10 bg-black/30 p-4">
                        <div className="aspect-square w-full rounded-xl border border-white/10 bg-black/40 flex items-center justify-center text-white/60">
                          <div className="text-center">
                            <p className="text-sm font-medium text-white/80">UPI QR Placeholder</p>
                            <p className="mt-1 text-xs text-white/50">Replace with real QR image</p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between text-xs text-white/60">
                          <span>Amount</span>
                          <span className="font-semibold text-white">₹{amount}</span>
                        </div>
                      </div>

                      <p className="relative mt-3 text-xs text-white/50">
                        Make sure your UPI app shows the payment as{" "}
                        <span className="text-white/80 font-medium">Successful</span>.
                      </p>
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="md:col-span-6">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                      <h3 className="text-sm font-semibold text-white/90">Before you submit</h3>
                      <ul className="mt-3 space-y-2 text-sm text-white/70">
                        <li className="flex gap-2">
                          <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                          Pay exactly ₹{amount}
                        </li>
                        <li className="flex gap-2">
                          <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                          Copy Transaction/UTR ID from UPI history
                        </li>
                        <li className="flex gap-2">
                          <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                          Paste it and submit for verification
                        </li>
                      </ul>

                      <div className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                        <p className="text-xs text-white/60">After submit</p>
                        <p className="mt-1 text-sm font-semibold text-white/90">
                          Pending admin verification
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 bg-black/20 px-4 sm:px-6 py-4 text-xs text-white/60">
                If you entered the wrong transaction ID, you can submit again with the correct one.
              </div>
            </div>
          </section>

          {/* Right: Transaction */}
          <section className="lg:col-span-5">
            <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-semibold">Transaction</h2>
                <p className="mt-2 text-sm text-white/70">
                  Enter your UPI Transaction/UTR ID to complete verification.
                </p>

                <div className="mt-6">
                  <label className="text-sm font-medium text-white/80">
                    UPI Transaction ID <span className="text-red-300">*</span>
                  </label>
                  <input
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20"
                    placeholder="eg: 1234567890 / UTR..."
                  />
                  <p className="mt-2 text-xs text-white/50">
                    Found in your UPI app → transaction details.
                  </p>
                </div>

                {/* Total box (NO profile here) */}
                <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white/60">Total</p>
                    <p className="text-lg font-bold text-white">₹{amount}</p>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-white/50">
                    <span>Plan</span>
                    <span className="font-medium text-white/70">
                      {selectedPlan?.plan_id ?? "—"}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center justify-between text-xs text-white/50">
                    <span>Group limit</span>
                    <span className="font-medium text-white/70">
                      {selectedPlan?.plan_group_limit ?? draft?.plan_group_limit ?? "—"}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    disabled={!canSubmit}
                    onClick={submit}
                    className={[
                      "w-full rounded-2xl px-4 sm:px-6 py-3 font-semibold shadow-sm transition",
                      canSubmit
                        ? "bg-white text-black hover:bg-white/90 active:bg-white"
                        : "bg-white/15 text-white/40 cursor-not-allowed",
                    ].join(" ")}
                    type="button"
                  >
                    {submitting ? "Submitting..." : "Submit Payment"}
                  </button>

                  <p className="mt-3 text-xs text-white/50 text-center">
                    By submitting, you confirm this payment was made for the selected plan.
                  </p>
                </div>
              </div>

              <div className="border-t border-white/10 bg-black/20 px-4 sm:px-6 py-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-8 w-8 rounded-2xl border border-white/10 bg-black/40 flex items-center justify-center text-white/70">
                    ?
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/90">Where to find UTR?</p>
                    <p className="mt-1 text-xs text-white/60">
                      UPI app → transaction history → open payment → copy UTR/Transaction ID.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ Debug Preview REMOVED */}
          </section>
        </div>
      </div>
    </main>
  );
}
