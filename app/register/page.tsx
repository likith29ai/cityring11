"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { FaInstagram, FaWhatsapp, FaTelegramPlane, FaGlobe } from "react-icons/fa";

type NetworkMode = "instagram" | "whatsapp" | "telegram" | "all";

type Plan = {
  id: string; // ✅ from DB (not limited to p99/p199 etc)
  price: number;
  group_limit: number;
  title: string;
  subtitle: string | null;
  is_active: boolean;
  sort_order: number;
};

export default function RegisterPage() {
  const [mode, setMode] = useState<NetworkMode>("instagram");

  const [form, setForm] = useState({
    name: "",
    dob: "",
    email: "",
    instagram: "",
    whatsapp: "",
    telegram: "",
    password: "",
    confirmPassword: "",
  });

  // ✅ NEW: plans from DB
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);

  // ✅ plan selection
  const [planId, setPlanId] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadPlans() {
      setPlansLoading(true);

      const { data, error } = await supabase
        .from("membership_plans")
        .select("id,title,subtitle,price,group_limit,is_active,sort_order")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Failed to load plans:", error);
        setPlans([]);
      } else {
        setPlans((data as any) || []);
      }

      setPlansLoading(false);
    }

    loadPlans();
  }, []);

  const requiredFields = useMemo(() => {
    if (mode === "instagram") return ["name", "dob", "instagram"] as const;
    if (mode === "whatsapp") return ["name", "dob", "whatsapp"] as const;
    if (mode === "telegram") return ["name", "dob", "telegram"] as const;
    return ["name", "dob", "instagram", "whatsapp", "telegram"] as const;
  }, [mode]);

  const selectedPlan = useMemo(() => {
    return plans.find((p) => p.id === planId) || null;
  }, [plans, planId]);

  const isValid = useMemo(() => {
    // must pick plan
    if (!planId) return false;

    // must have plans loaded (avoid selecting stale)
    if (plansLoading) return false;

    // ✅ Email required
    if (!form.email || !form.email.trim()) return false;

    for (const key of requiredFields) {
      const v = (form as any)[key] as string;
      if (!v || !v.trim()) return false;
    }

    if (!form.password || form.password.length < 6) return false;
    if (form.password !== form.confirmPassword) return false;

    return true;
  }, [form, requiredFields, planId, plansLoading]);

  function updateField(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handlePayNow() {
    if (!isValid || submitting) return;
    if (!selectedPlan) {
      alert("Please select a plan.");
      return;
    }

    setSubmitting(true);

    try {
      const cleanEmail = form.email.trim().toLowerCase();

      // ✅ 1) Create Supabase Auth user
      const { error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: form.password,
      });

      if (signUpError) {
        console.error("Auth signUp failed:", {
          message: signUpError?.message,
          status: (signUpError as any)?.status,
          raw: signUpError,
        });
        alert(`Registration failed (Auth): ${signUpError.message}`);
        setSubmitting(false);
        return;
      }

      // ✅ 2) Create profile via RPC (your existing logic)
      const rpcPayload: any = {
        _name: form.name.trim(),
        _dob: form.dob,
        _email: cleanEmail,
        _network_mode: mode,
        _instagram: mode === "instagram" || mode === "all" ? form.instagram.trim() || null : null,
        _whatsapp: mode === "whatsapp" || mode === "all" ? form.whatsapp.trim() || null : null,
        _telegram: mode === "telegram" || mode === "all" ? form.telegram.trim() || null : null,
        _plan_id: selectedPlan.id,
        _plan_price: selectedPlan.price,
        _password: form.password,

        // OPTIONAL: only enable if your RPC accepts it
        // _plan_group_limit: selectedPlan.group_limit,
      };

      const { data, error } = await supabase.rpc("create_profile_with_password", rpcPayload);

      if (error) {
        console.error("Profile insert failed:", {
          message: error?.message,
          details: (error as any)?.details,
          hint: (error as any)?.hint,
          code: (error as any)?.code,
          raw: error,
        });
        alert(
          `Registration failed: ${error.message}\n\nIf you enabled RLS, you must add policies or temporarily turn RLS off for profiles while testing.`
        );
        setSubmitting(false);
        return;
      }

      // ✅ Store profile id for payment step
      localStorage.setItem("cityring_profile_id", String(data));

      // ✅ Store selected plan for payment step (subscriptions upsert)
      localStorage.setItem(
        "selectedPlan",
        JSON.stringify({
          plan_id: selectedPlan.id,
          plan_price: selectedPlan.price,
          plan_group_limit: selectedPlan.group_limit,
          is_renewal: false,
        })
      );

      // Optional: store draft for payment preview
      const { password, confirmPassword, ...safeForm } = form;
      const draft = {
        mode,
        ...safeForm,
        plan_id: selectedPlan.id,
        plan_price: selectedPlan.price,
        plan_group_limit: selectedPlan.group_limit,
      };
      localStorage.setItem("cityring_register_draft", JSON.stringify(draft));

      window.location.href = "/register/payment";
    } catch (e: any) {
      console.error(e);
      alert("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen text-white">
      {/* Premium background (same vibe as Join/Home/Payment) */}
      <div className="fixed inset-0 -z-10 bg-[#07070A]">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_20%_10%,rgba(255,255,255,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_80%_30%,rgba(255,255,255,0.08),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_50%_100%,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.04))]" />
      </div>
      {/* NAVBAR */}
      <nav className="border-y border-white/10 bg-black/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="h-[50px] sm:h-[60px] flex items-center justify-center">
            <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-6 lg:gap-x-10 gap-y-1 text-xs sm:text-sm lg:text-[15px] tracking-wide text-white/80">
              <a className="hover:text-white transition" href="/">Home</a>
              <a className="hover:text-white transition" href="/join">Join</a>
              <a className="hover:text-white transition" href="/register">Register</a>
              <a className="hover:text-white transition" href="/exclusive">Exclusive</a>
              <a className="hover:text-white transition" href="/about">About</a>
              <a className="hover:text-white transition" href="/contact">Contact Us</a>
              <a className="hover:text-white transition" href="/complaint">Raise Complaint</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {/* Header */}
        <div className="flex items-end justify-between flex-wrap gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-blue-500/80" />
              Membership
            </div>

            <h1 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">Register</h1>
            <p className="mt-2 text-white/70 max-w-2xl">
              Choose how you want to network, fill your details, then complete payment.
            </p>
          </div>

          {/* Selected plan mini pill */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-5 py-4">
            <p className="text-xs text-white/60">Selected Plan</p>
            <p className="mt-1 text-sm font-semibold text-white">
              {selectedPlan ? selectedPlan.title : "—"}
            </p>
            <p className="mt-1 text-xs text-white/55">
              Fee:{" "}
              <span className="text-white font-semibold">
                ₹{selectedPlan ? selectedPlan.price : "--"}
              </span>
              {"  "}•{"  "}
              Limit:{" "}
              <span className="text-white font-semibold">
                {selectedPlan ? selectedPlan.group_limit : "--"}
              </span>
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="mt-10 rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold tracking-tight">How would you like to network?</h2>
            <p className="mt-2 text-sm text-white/65">
              Pick one mode — this decides which contact fields are required.
            </p>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <ModeButton active={mode === "instagram"} onClick={() => setMode("instagram")} icon={<FaInstagram />}>
                Instagram
              </ModeButton>

              <ModeButton active={mode === "whatsapp"} onClick={() => setMode("whatsapp")} icon={<FaWhatsapp />}>
                WhatsApp
              </ModeButton>

              <ModeButton active={mode === "telegram"} onClick={() => setMode("telegram")} icon={<FaTelegramPlane />}>
                Telegram
              </ModeButton>

              <ModeButton active={mode === "all"} onClick={() => setMode("all")} icon={<FaGlobe />}>
                All Three
              </ModeButton>
            </div>
          </div>

          <div className="border-t border-white/10 bg-black/20 px-4 sm:px-6 py-4 text-xs text-white/60">
            Tip: You can change the mode anytime before payment.
          </div>
        </div>

        {/* Plan Selector */}
        <div className="mt-6 rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold tracking-tight">Choose a Plan</h2>
            <p className="mt-2 text-sm text-white/65">Pick a membership plan to continue to payment.</p>

            {plansLoading && <p className="mt-4 text-sm text-white/55">Loading plans...</p>}

            {!plansLoading && plans.length === 0 && (
              <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                No plans available. Please contact admin.
              </div>
            )}

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plans.map((p) => {
                const active = planId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlanId(p.id)}
                    className={`text-left rounded-2xl sm:rounded-3xl border p-5 transition ${
                      active
                        ? "border-blue-500/40 bg-blue-500/10"
                        : "border-white/10 bg-black/35 hover:bg-black/55"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-lg font-semibold tracking-tight text-white">{p.title}</div>
                        <div className="text-sm text-white/65">{p.subtitle ?? ""}</div>
                        <div className="mt-1 text-xs text-white/55">
                          Join up to <span className="font-semibold text-white">{p.group_limit}</span> groups
                        </div>
                      </div>

                      <div className={`text-lg font-bold ${active ? "text-blue-200" : "text-white"}`}>
                        ₹{p.price}
                      </div>
                    </div>

                    {active && (
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-xs text-blue-200 font-medium">Selected</div>
                        <div className="text-xs text-white/55">
                          Best for{" "}
                          <span className="text-white/80 font-semibold">{p.group_limit}</span> rings
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-white/10 bg-black/20 px-4 sm:px-6 py-4 text-xs text-white/60">
            You'll submit payment via UPI on the next screen.
          </div>
        </div>

        {/* Form */}
        <div className="mt-6 rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold tracking-tight">Your Details</h2>
            <p className="mt-2 text-sm text-white/65">
              Fill the required fields, then click <span className="text-white font-semibold">Pay Now</span>.
            </p>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Name *">
                <input
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-white/15"
                  placeholder="Your full name"
                />
              </Field>

              <Field label="DOB * (DD/MM/YYYY)">
                <input
                  value={form.dob}
                  onChange={(e) => updateField("dob", e.target.value)}
                  type="text"
                  className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-white/15"
                  placeholder="eg: 15/05/1995"
                />
              </Field>

              <Field label="Email *">
                <input
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  type="email"
                  className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-white/15"
                  placeholder="you@email.com"
                />
              </Field>

              {(mode === "instagram" || mode === "all") && (
                <Field label="Instagram Username *">
                  <input
                    value={form.instagram}
                    onChange={(e) => updateField("instagram", e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-white/15"
                    placeholder="eg: yourhandle"
                  />
                </Field>
              )}

              {(mode === "whatsapp" || mode === "all") && (
                <Field label="WhatsApp Number *">
                  <input
                    value={form.whatsapp}
                    onChange={(e) => updateField("whatsapp", e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-white/15"
                    placeholder="eg: +91 9876543210"
                  />
                </Field>
              )}

              {(mode === "telegram" || mode === "all") && (
                <Field label="Telegram Username/Number *">
                  <input
                    value={form.telegram}
                    onChange={(e) => updateField("telegram", e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-white/15"
                    placeholder="eg: @username or number"
                  />
                </Field>
              )}

              <Field label="Create Password *">
                <input
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  type="password"
                  className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-white/15"
                  placeholder="Minimum 6 characters"
                />
              </Field>

              <Field label="Confirm Password *">
                <input
                  value={form.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  type="password"
                  className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-white/15"
                  placeholder="Re-enter password"
                />
              </Field>
            </div>

            <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
              <p className="text-sm text-white/65">
                Membership fee:{" "}
                <span className="font-semibold text-white">
                  ₹{selectedPlan ? selectedPlan.price : "--"}
                </span>{" "}
                (manual UPI for now)
              </p>

              <button
                onClick={handlePayNow}
                disabled={!isValid || submitting}
                className={[
                  "px-4 sm:px-6 py-3 rounded-2xl font-semibold transition",
                  isValid && !submitting
                    ? "bg-white text-black hover:bg-white/90 shadow-sm"
                    : "bg-white/10 border border-white/10 cursor-not-allowed text-white/60 shadow-none",
                ].join(" ")}
                type="button"
              >
                {submitting ? "Saving..." : "Pay Now"}
              </button>
            </div>
          </div>

          <div className="border-t border-white/10 bg-black/20 px-4 sm:px-6 py-4 text-xs text-white/60">
            After payment submission, admin will verify and approve your membership.
          </div>
        </div>

        <p className="mt-6 text-sm text-white/55">
          By continuing, you agree to provide accurate details for verification.
        </p>
      </div>
    </main>
  );
}

function ModeButton({
  active,
  onClick,
  children,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-sm font-medium transition flex items-center justify-center gap-2 outline-none focus:ring-2 focus:ring-white/10 ${
        active
          ? "border-blue-500/40 bg-blue-500/10 text-blue-200"
          : "border-white/10 bg-black/35 hover:bg-black/55 text-white/80"
      }`}
      type="button"
    >
      <span className="text-lg leading-none">{icon}</span>
      <span>{children}</span>
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-white/80">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}