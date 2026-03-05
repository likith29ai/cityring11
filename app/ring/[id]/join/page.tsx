"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../../lib/supabaseClient";
import Image from "next/image";

type NetworkMode = "instagram" | "gmail" | "whatsapp" | "telegram";
type IdentifierType = "instagram" | "email" | "whatsapp" | "telegram";

type Group = {
  id: string;
  platforms: string[];
};

type Profile = {
  id: string;
  payment_status: "pending" | "verified" | "rejected";
  is_member: boolean;
};

type FieldKey = NetworkMode | "password";

export default function JoinNowPage() {
  const params = useParams<{ id: string }>();
  const groupId = params?.id;

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
    null | {
      type: "success" | "not_registered" | "not_approved" | "expired" | "error";
      message: string;
    }
  >(null);

  useEffect(() => {
    if (!groupId) return;

    async function loadGroup() {
      const { data, error } = await supabase
        .from("groups")
        .select("id, platforms")
        .eq("id", groupId)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error loading group platforms:", error);
        return;
      }

      const g = (data as Group) || null;
      const raw = (g?.platforms || []).map((p) => String(p).toLowerCase());

      const normalized = raw.filter((p) =>
        ["instagram", "gmail", "whatsapp", "telegram"].includes(p)
      );

      const uniq = Array.from(new Set(normalized)) as NetworkMode[];

      const fallback: NetworkMode[] = uniq.length ? uniq : ["instagram"];

      setAllowedPlatforms(fallback);

      if (fallback.length === 1) {
        setMode(fallback[0]);
      } else {
        setMode((prev) => (fallback.includes(prev) ? prev : fallback[0]));
      }
    }

    loadGroup();
  }, [groupId]);
  const requiredKeys = useMemo(() => {
    return [mode, "password"] as const;
  }, [mode]);

  const formValid = useMemo(() => {
    if (!groupId) return false;
    for (const k of requiredKeys) {
      const v = fields[k];
      if (!v || !v.trim()) return false;
    }
    return true;
  }, [groupId, requiredKeys, fields]);

  function updateField(key: FieldKey, value: string) {
    setFields((p) => ({ ...p, [key]: value }));
  }

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

      if (profile?.id) {
        localStorage.setItem("cityring_profile_id", profile.id);
      }

      if (!profile) {
        setResult({
          type: "not_registered",
          message:
            "Not registered or wrong password. Please register and pay to become a member.",
        });
        setSubmitting(false);
        return;
      }

      if (profile.payment_status === "pending") {
        setResult({
          type: "not_approved",
          message: "Membership pending. Please wait for admin approval.",
        });
        setSubmitting(false);
        return;
      }

      if (profile.payment_status === "rejected") {
        setResult({
          type: "not_approved",
          message:
            "Payment rejected. Please register again or contact admin.",
        });
        setSubmitting(false);
        return;
      }

      if (
        profile.payment_status === "verified" &&
        profile.is_member === false
      ) {
        localStorage.setItem(
          "renew_return_to",
          `/ring/${groupId}/join`
        );

        setResult({
          type: "expired",
          message:
            "Membership expired. Please renew to join more groups.",
        });
        setSubmitting(false);
        return;
      }

      if (
        !(profile.is_member === true &&
          profile.payment_status === "verified")
      ) {
        setResult({
          type: "not_approved",
          message:
            "Membership not active yet. Please wait for admin approval.",
        });
        setSubmitting(false);
        return;
      }
      const updatePayload: any = {
        network_mode: mode === "gmail" ? "email" : mode,
      };

      if (mode === "instagram")
        updatePayload.instagram = fields.instagram.trim();

      if (mode === "gmail")
        updatePayload.email = fields.gmail.trim();

      if (mode === "whatsapp")
        updatePayload.whatsapp = fields.whatsapp.trim();

      if (mode === "telegram")
        updatePayload.telegram = fields.telegram.trim();

      const { error: updErr } = await supabase
        .from("profiles")
        .update(updatePayload)
        .eq("id", profile.id);

      if (updErr) throw updErr;

      const { data, error: rpcErr } = await supabase.rpc(
        "request_join_group",
        {
          _profile_id: profile.id,
          _group_id: groupId,
        }
      );

      if (rpcErr) {
        const msg = rpcErr.message || "";

        if (msg.includes("MEMBERSHIP_EXPIRED")) {
          setResult({
            type: "expired",
            message:
              "Membership expired. Please renew to join more groups.",
          });
          setSubmitting(false);
          return;
        }

        if (msg.includes("MEMBERSHIP_NOT_ACTIVE")) {
          setResult({
            type: "expired",
            message:
              "Membership is not active. Please renew or wait for approval.",
          });
          setSubmitting(false);
          return;
        }

        throw rpcErr;
      }

      if (data === "already_requested") {
        setResult({
          type: "success",
          message:
            "✅ Already requested. Admin will add you soon.",
        });

        setSubmitting(false);
        return;
      }

      setResult({
        type: "success",
        message:
          "✅ Success! Admin will add you soon.",
      });

      setSubmitting(false);

    } catch (e: any) {

      console.error("Join submit error:", e);

      setResult({
        type: "error",
        message:
          e?.message || "Something went wrong.",
      });

      setSubmitting(false);
    }
  }

  return (

    <main className="min-h-screen text-white">

      {/* Premium background (same vibe) */}
      <div className="fixed inset-0 -z-10 bg-[#07070A]">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_20%_10%,rgba(255,255,255,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_80%_30%,rgba(255,255,255,0.08),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_50%_100%,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.04))]" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

        <a
          href={`/ring/${groupId ?? ""}`}
          className="text-sm text-blue-400 hover:text-blue-300 transition"
        >
          ← Back to Ring
        </a>

        <h1 className="mt-3 text-4xl font-bold">
          Join Now
        </h1>

        <p className="mt-2 text-white/70">
          Select how you want to connect and enter your details.
        </p>

        <div className="mt-8 rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-sm p-6">

          <h2 className="text-xl font-semibold text-white">
            How would you like to connect?
          </h2>

          {allowedPlatforms.length > 1 && (

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">

              {allowedPlatforms.includes("instagram") && (

                <ModeButton

                  active={mode === "instagram"}

                  onClick={() => setMode("instagram")}

                  icon="/instagram.png"

                >

                  Instagram

                </ModeButton>

              )}

              {allowedPlatforms.includes("gmail") && (

                <ModeButton

                  active={mode === "gmail"}

                  onClick={() => setMode("gmail")}

                  icon="/gmail.png"

                >

                  Gmail

                </ModeButton>

              )}

              {allowedPlatforms.includes("whatsapp") && (

                <ModeButton

                  active={mode === "whatsapp"}

                  onClick={() => setMode("whatsapp")}

                  icon="/whatsapp.png"

                >

                  WhatsApp

                </ModeButton>

              )}

              {allowedPlatforms.includes("telegram") && (

                <ModeButton

                  active={mode === "telegram"}

                  onClick={() => setMode("telegram")}

                  icon="/telegram.png"

                >

                  Telegram

                </ModeButton>

              )}

            </div>

          )}

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">

            {mode === "instagram" && (

              <Field label="Instagram Username *">

                <input

                  value={fields.instagram}

                  onChange={(e) => updateField("instagram", e.target.value)}

                  className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-500/50"

                  placeholder="eg: yourhandle"

                />

              </Field>

            )}

            {mode === "gmail" && (

              <Field label="Gmail / Email *">

                <input

                  value={fields.gmail}

                  onChange={(e) => updateField("gmail", e.target.value)}

                  className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-500/50"

                  placeholder="eg: you@gmail.com"

                />

              </Field>

            )}

            {mode === "whatsapp" && (

              <Field label="WhatsApp Number *">

                <input

                  value={fields.whatsapp}

                  onChange={(e) => updateField("whatsapp", e.target.value)}

                  className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-500/50"

                  placeholder="eg: +91 9876543210"

                />

              </Field>

            )}

            {mode === "telegram" && (

              <Field label="Telegram Username/Number *">

                <input

                  value={fields.telegram}

                  onChange={(e) => updateField("telegram", e.target.value)}

                  className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-500/50"

                  placeholder="eg: @username"

                />

              </Field>

            )}

            <Field label="Password *">

              <input

                value={fields.password}

                onChange={(e) => updateField("password", e.target.value)}

                type="password"

                className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-blue-500/50"

                placeholder="Enter your password"

              />

              {/* FORGOT PASSWORD BUTTON */}

              <div className="mt-2 text-right">

                <a

                  href="/forgot-password"

                  className="text-xs text-blue-400 hover:text-blue-300 transition"

                >

                  Forgot Password?

                </a>

              </div>

            </Field>

          </div>

          {result && (

            <div

              className={`mt-5 rounded-2xl border px-4 py-3 text-sm transition ${
                result.type === "success"
                  ? "border-green-500/30 bg-green-500/10 text-green-200"
                  : result.type === "not_registered"
                  ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-200"
                  : result.type === "not_approved"
                  ? "border-blue-500/30 bg-blue-500/10 text-blue-200"
                  : result.type === "expired"
                  ? "border-orange-500/30 bg-orange-500/10 text-orange-200"
                  : "border-red-500/30 bg-red-500/10 text-red-200"
              }`}

            >

              {result.message}

              {result.type === "not_registered" && (

                <div className="mt-3">

                  <a

                    href="/register"

                    className="inline-block px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"

                  >

                    Go to Register

                  </a>

                </div>

              )}

              {result.type === "expired" && (

                <div className="mt-3">

                  <a

                    href="/membership/renew"

                    className="inline-block px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"

                  >

                    Become a member again

                  </a>

                </div>

              )}

            </div>

          )}

          <button

            onClick={submit}

            disabled={!formValid || submitting}

            className={`mt-6 w-full px-4 sm:px-6 py-3 rounded-2xl text-white transition ${
              formValid && !submitting
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-white/10 cursor-not-allowed"
            }`}

            type="button"

          >

            {submitting ? "Submitting..." : "Submit"}

          </button>

          <p className="mt-3 text-xs text-white/55">

            If you are a member, admin will add you soon after your request.

          </p>

        </div>

        {/* ================= RULES SECTION ================= */}

        <div className="mt-16 rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-sm p-8">

          <h2 className="text-2xl font-bold text-white">

            CityRing — Rules & Regulations

          </h2>

          <p className="mt-4 text-white/70">

            To preserve the integrity and experience of every circle, all members are expected to follow these principles.

          </p>

          <div className="mt-6 space-y-6 text-white/70 text-sm leading-relaxed">

            <Rule title="1. Respect the Circle">

              Every ring is built on mutual respect. Members must interact with courtesy, professionalism, and consideration at all times. Harassment, intimidation, or disrespectful behavior will not be tolerated.

            </Rule>

            <Rule title="2. Use CityRing for Genuine Connection Only">

              CityRing exists to foster meaningful, interest-based connections. It must not be used for spamming, unsolicited promotions, mass messaging, or unrelated commercial activities without authorization.

            </Rule>

            <Rule title="3. No Misrepresentation">

              Members must provide truthful and accurate information. Creating fake identities, impersonating others, or misrepresenting affiliation, profession, or intent is strictly prohibited.

            </Rule>

            <Rule title="4. Protect Privacy and Confidentiality">

              Information shared within a ring is expected to remain within that circle. Members must not share, publish, or distribute private conversations, member details, or group content outside the platform without permission.

            </Rule>

            <Rule title="5. No Abuse, Hate, or Harmful Content">

              CityRing maintains zero tolerance for hate speech, discrimination, threats, explicit content, or any form of harmful or illegal activity.

            </Rule>

            <Rule title="6. No Unauthorized Commercial Solicitation">

              Members may not use CityRing primarily to sell products, promote services, or recruit for unrelated ventures without prior approval from CityRing.

            </Rule>

            <Rule title="7. One Person, One Membership">

              Each membership is intended for a single individual. Sharing accounts, transferring memberships, or allowing others to operate under your identity is not permitted.

            </Rule>

            <Rule title="8. Follow Platform and Community Guidelines">

              Members must follow any specific guidelines established for individual rings, as well as all general platform policies.

            </Rule>

            <Rule title="9. Compliance with Applicable Laws">

              All members are responsible for ensuring their conduct complies with applicable local, national, and international laws.

            </Rule>

            <Rule title="10. Enforcement and Right to Remove Access">

              CityRing reserves the right to suspend or permanently revoke membership, remove access to rings, or take appropriate action if any member violates these rules or acts against the spirit of the platform.

            </Rule>

          </div>

        </div>

      </div>

    </main>

  );

}

function ModeButton({

  active,

  onClick,

  icon,

  children,

}: {

  active: boolean;

  onClick: () => void;

  icon: string;

  children: React.ReactNode;

}) {

  return (

    <button

      onClick={onClick}

      className={`rounded-2xl border px-4 py-3 text-sm font-medium transition flex items-center justify-center gap-3 ${
        active
          ? "border-blue-500/50 bg-blue-500/15 text-blue-200"
          : "border-white/10 bg-black/35 hover:bg-black/55 text-white/80"
      }`}

      type="button"

    >

      <Image src={icon} alt="" width={18} height={18} />

      {children}

    </button>

  );

}

function Field({

  label,

  children,

}: {

  label: string;

  children: React.ReactNode;

}) {

  return (

    <label className="block">

      <span className="text-sm font-medium text-white/80">

        {label}

      </span>

      <div className="mt-2">{children}</div>

    </label>

  );

}

function Rule({

  title,

  children,

}: {

  title: string;

  children: React.ReactNode;

}) {

  return (

    <div>

      <h3 className="font-semibold text-white">

        {title}

      </h3>

      <p className="mt-2 text-white/60">

        {children}

      </p>

    </div>

  );

}