"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type NetworkMode = "instagram" | "gmail" | "whatsapp" | "telegram";
type IdentifierType = "instagram" | "email" | "whatsapp" | "telegram";
type FieldKey = NetworkMode | "password";

type ExclusiveGroup = {
  id: string;
  title: string;
  price: number;
  platforms: string[];
};

type Profile = {
  id: string;
  payment_status: "pending" | "verified" | "rejected";
  is_member: boolean;
};

export default function ExclusiveApplyPage() {
  const params = useParams<{ id: string }>();
  const groupId = params?.id;

  const [group, setGroup] = useState<ExclusiveGroup | null>(null);

  const [mode, setMode] = useState<NetworkMode>("instagram");
  const [allowedPlatforms, setAllowedPlatforms] = useState<NetworkMode[]>(["instagram"]);

  const [fields, setFields] = useState<Record<FieldKey, string>>({
    instagram: "",
    gmail: "",
    whatsapp: "",
    telegram: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<
    null | { type: "success" | "not_registered" | "not_member" | "error"; message: string }
  >(null);

  useEffect(() => {
    if (!groupId) return;

    async function loadGroup() {
      const { data, error } = await supabase
        .from("exclusive_groups")
        .select("id, title, price, platforms")
        .eq("id", groupId)
        .maybeSingle();

      if (error) {
        console.error("Error loading exclusive group:", error);
        return;
      }

      const g = (data as any) as ExclusiveGroup;
      setGroup(g);

      const raw = (g?.platforms || []).map((p) => String(p).toLowerCase());
      const normalized = raw.filter((p) => ["instagram", "gmail", "whatsapp", "telegram"].includes(p));
      const uniq = Array.from(new Set(normalized)) as NetworkMode[];
      const fallback: NetworkMode[] = uniq.length ? uniq : ["instagram"];

      setAllowedPlatforms(fallback);
      setMode((prev) => (fallback.includes(prev) ? prev : fallback[0]));
    }

    loadGroup();
  }, [groupId]);

  function updateField(key: FieldKey, value: string) {
    setFields((p) => ({ ...p, [key]: value }));
  }

  const requiredKeys = useMemo(() => [mode, "password"] as const, [mode]);

  const formValid = useMemo(() => {
    if (!groupId) return false;
    for (const k of requiredKeys) {
      const v = fields[k];
      if (!v || !v.trim()) return false;
    }
    return true;
  }, [fields, requiredKeys, groupId]);

  async function findProfileByEnteredContact(): Promise<Profile | null> {
    const value =
      mode === "instagram"
        ? fields.instagram.trim()
        : mode === "gmail"
        ? fields.gmail.trim()
        : mode === "whatsapp"
        ? fields.whatsapp.trim()
        : fields.telegram.trim();

    if (!value) return null;

    const identifierType: IdentifierType = mode === "gmail" ? "email" : mode;

    const { data, error } = await supabase.rpc("verify_profile_password", {
      _identifier_type: identifierType,
      _identifier_value: value,
      _password: fields.password,
    });

    if (error) throw error;

    const row = Array.isArray(data) ? data[0] : data;
    return (row as Profile) || null;
  }

  async function submit() {
    if (!formValid || !groupId || submitting) return;

    setSubmitting(true);
    setResult(null);

    try {
      const profile = await findProfileByEnteredContact();

      if (!profile) {
        setResult({
          type: "not_registered",
          message: "Not registered or wrong password. Please register and become a member first.",
        });
        setSubmitting(false);
        return;
      }

      // Member check (your same rule)
      const isActiveMember = profile.is_member === true && profile.payment_status === "verified";
      if (!isActiveMember) {
        setResult({
          type: "not_member",
          message: "You must be a verified member before applying to exclusive groups.",
        });
        setSubmitting(false);
        return;
      }

      // Save application
      const { error: appErr } = await supabase.from("exclusive_applications").insert({
        profile_id: profile.id,
        exclusive_group_id: groupId,
        status: "pending",
      });

      if (appErr) {
        if ((appErr as any).code === "23505") {
          setResult({ type: "success", message: "✅ Already applied. Please wait for admin response." });
        } else {
          throw appErr;
        }
        setSubmitting(false);
        return;
      }

      setResult({ type: "success", message: "✅ Application sent successfully!" });
      setSubmitting(false);
    } catch (e: any) {
      console.error("Exclusive apply error:", e);
      setResult({ type: "error", message: e?.message || "Something went wrong." });
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen text-white">
      {/* Premium background (match Join/Home vibe) */}
      <div className="fixed inset-0 -z-10 bg-[#07070A]">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_20%_10%,rgba(255,255,255,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_80%_30%,rgba(255,255,255,0.08),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_50%_100%,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.04))]" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <a
          href={`/exclusive/${groupId ?? ""}`}
          className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition"
        >
          <span className="text-white/60">←</span> Back
        </a>

        <div className="mt-6 flex items-end justify-between flex-wrap gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-blue-500/80" />
              Exclusive application
            </div>

            <h1 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">Apply</h1>

            <p className="mt-2 text-white/70">
              {group ? (
                <>
                  Applying for <span className="font-semibold text-white">{group.title}</span>
                  <span className="text-white/45"> • </span>
                  Price: <span className="font-semibold text-white">₹{group.price}</span>
                </>
              ) : (
                "Loading group..."
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-5 py-4">
            <p className="text-xs text-white/60">Status</p>
            <p className="mt-1 text-sm font-semibold text-white">Member-only</p>
            <p className="mt-1 text-xs text-white/55">Verified members can apply</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-sm overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-xl font-semibold tracking-tight">Enter details</h2>
            <p className="mt-2 text-sm text-white/65">
              Use the same contact + password you used while registering.
            </p>

            {allowedPlatforms.length > 1 ? (
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {allowedPlatforms.includes("instagram") && (
                  <ModeButton active={mode === "instagram"} onClick={() => setMode("instagram")}>
                    Instagram
                  </ModeButton>
                )}
                {allowedPlatforms.includes("gmail") && (
                  <ModeButton active={mode === "gmail"} onClick={() => setMode("gmail")}>
                    Gmail
                  </ModeButton>
                )}
                {allowedPlatforms.includes("whatsapp") && (
                  <ModeButton active={mode === "whatsapp"} onClick={() => setMode("whatsapp")}>
                    WhatsApp
                  </ModeButton>
                )}
                {allowedPlatforms.includes("telegram") && (
                  <ModeButton active={mode === "telegram"} onClick={() => setMode("telegram")}>
                    Telegram
                  </ModeButton>
                )}
              </div>
            ) : (
              <div className="mt-5 text-sm text-white/65">
                This group supports: <span className="font-semibold text-white">{allowedPlatforms[0]}</span>
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mode === "instagram" && (
                <Field label="Instagram Username *">
                  <input
                    value={fields.instagram}
                    onChange={(e) => updateField("instagram", e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-white/15"
                    placeholder="eg: yourhandle"
                  />
                </Field>
              )}

              {mode === "gmail" && (
                <Field label="Gmail / Email *">
                  <input
                    value={fields.gmail}
                    onChange={(e) => updateField("gmail", e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-white/15"
                    placeholder="eg: you@gmail.com"
                  />
                </Field>
              )}

              {mode === "whatsapp" && (
                <Field label="WhatsApp Number *">
                  <input
                    value={fields.whatsapp}
                    onChange={(e) => updateField("whatsapp", e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-white/15"
                    placeholder="eg: +91 9876543210"
                  />
                </Field>
              )}

              {mode === "telegram" && (
                <Field label="Telegram Username/Number *">
                  <input
                    value={fields.telegram}
                    onChange={(e) => updateField("telegram", e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-white/15"
                    placeholder="eg: @username"
                  />
                </Field>
              )}

              <Field label="Password *">
                <input
                  type="password"
                  value={fields.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-white/15"
                  placeholder="Enter your password"
                />
              </Field>
            </div>

            {result && (
              <div
                className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
                  result.type === "success"
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
                    : result.type === "not_registered"
                    ? "border-amber-500/20 bg-amber-500/10 text-amber-200"
                    : result.type === "not_member"
                    ? "border-blue-500/20 bg-blue-500/10 text-blue-200"
                    : "border-red-500/20 bg-red-500/10 text-red-200"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="leading-relaxed">{result.message}</div>
                </div>

                {result.type === "not_member" && (
                  <div className="mt-4">
                    <a
                      href="/register"
                      className="inline-flex items-center justify-center rounded-2xl px-4 py-2 font-semibold bg-white text-black hover:bg-white/90 transition"
                    >
                      Become a Member
                    </a>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={submit}
              disabled={!formValid || submitting}
              className={[
                "mt-6 w-full px-4 sm:px-6 py-3 rounded-2xl font-semibold transition",
                formValid && !submitting
                  ? "bg-white text-black hover:bg-white/90 shadow-sm"
                  : "bg-white/10 border border-white/10 cursor-not-allowed text-white/60 shadow-none",
              ].join(" ")}
              type="button"
            >
              {submitting ? "Submitting..." : "Done"}
            </button>

            <p className="mt-3 text-xs text-white/55">
              Payment will be handled personally after approval.
            </p>
          </div>

          <div className="border-t border-white/10 bg-black/20 px-4 sm:px-6 py-4 text-xs text-white/60">
            If you applied already, you’ll see a confirmation message. Admin will respond soon.
          </div>
        </div>
      </div>
    </main>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-sm font-medium transition outline-none focus:ring-2 focus:ring-white/10 ${
        active
          ? "border-blue-500/40 bg-blue-500/10 text-blue-200"
          : "border-white/10 bg-black/35 hover:bg-black/55 text-white/80"
      }`}
      type="button"
    >
      {children}
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
