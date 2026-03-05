"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type ExclusiveGroup = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  city: string | null;
  interest: string | null;
  platforms: string[];
  poster_url: string | null;
};

export default function ExclusiveGroupDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [group, setGroup] = useState<ExclusiveGroup | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function load() {
      setLoading(true);

      const { data, error } = await supabase
        .from("exclusive_groups")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error(error);
        setGroup(null);
        setLoading(false);
        return;
      }

      setGroup((data as any) || null);
      setLoading(false);
    }

    load();
  }, [id]);

  const tags = useMemo(() => {
    const out: string[] = [];
    if (group?.interest) out.push(group.interest);
    if (group?.city) out.push(group.city);
    for (const p of group?.platforms || []) out.push(String(p));
    return out;
  }, [group]);

  return (
    <main className="min-h-screen text-white">
      {/* Premium dark background */}
      <div className="fixed inset-0 -z-10 bg-[#07070A]">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_20%_10%,rgba(255,255,255,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_80%_30%,rgba(255,255,255,0.08),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_50%_100%,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.04))]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <a
          href="/exclusive"
          className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition"
        >
          ← Back to Exclusive Groups
        </a>

        {loading ? (
          <p className="mt-6 text-sm text-white/60">Loading...</p>
        ) : !group ? (
          <p className="mt-6 text-sm text-white/60">Exclusive group not found.</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-blue-500/80" />
                Exclusive group
              </div>

              <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
                {group.title}
              </h1>

              <div className="mt-5 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full border border-white/12 bg-white/5 text-xs text-white/75"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Poster - Auto fit */}
              <div className="mt-8 rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur flex justify-center">
                {group.poster_url ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={group.poster_url}
                      alt={group.title}
                      className="max-w-lg w-full h-auto object-contain"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-full py-12 flex items-center justify-center text-white/55 bg-black/30">
                    No poster available
                  </div>
                )}
              </div>

              {/* DESCRIPTION MOVED HERE - BELOW POSTER */}
              {group.description && (
                <p className="mt-6 text-white/70 leading-relaxed">
                  {group.description}
                </p>
              )}

              <div className="mt-8 rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6">
                <h2 className="text-xl font-semibold">About this exclusive group</h2>
                <p className="mt-2 text-sm text-white/65">
                  Payment will be handled personally after your application is approved.
                </p>
              </div>
            </div>

            {/* Bottom CTA (moved here visually across full width) */}
            <div className="lg:col-span-3">
              <div className="mt-2 rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden">
                <div className="px-4 sm:px-6 py-5 bg-black/20 border-b border-white/10">
                  <div className="text-xs text-white/60">Ready to apply?</div>
                  <div className="mt-1 text-sm text-white/75">
                    Submit your application to proceed.
                  </div>
                </div>

                <div className="px-4 sm:px-6 py-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Price box */}
                    <div className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4">
                      <p className="text-xs text-white/60">Price</p>
                      <p className="mt-1 text-2xl font-bold text-white">
                        ₹{group.price}
                      </p>
                      <p className="mt-1 text-xs text-white/55">
                        Pay after approval
                      </p>
                    </div>

                    <a
                      href={`/exclusive/${group.id}/apply`}
                      className="inline-flex items-center justify-center rounded-2xl px-4 sm:px-6 py-3 font-semibold bg-white text-black hover:bg-white/90 transition"
                    >
                      Apply Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}