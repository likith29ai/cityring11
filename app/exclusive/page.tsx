"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type ExclusiveGroup = {
  id: string;
  title: string;
  city: string | null;
  interest: string | null;
  description: string | null;
  price: number;
  platforms: string[];
  poster_url?: string | null;
};

export default function ExclusiveJoinPage() {
  const [groups, setGroups] = useState<ExclusiveGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const [interest, setInterest] = useState("All");
  const [city, setCity] = useState("All");
  const [platform, setPlatform] = useState("All");
  const [search, setSearch] = useState("");

  // Search helpers for the Interest/City dropdowns
  const [interestSearch, setInterestSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");

  // Dropdown open state
  const [interestOpen, setInterestOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  const interestWrapRef = useRef<HTMLDivElement | null>(null);
  const cityWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadGroups() {
      const q = supabase
        .from("exclusive_groups")
        .select("*")
        .order("created_at", { ascending: false });

      // If you don't have is_active column yet, comment this line.
      // @ts-ignore
      q.eq("is_active", true);

      const { data, error } = await q;

      if (error) {
        console.error("Error loading exclusive groups:", error);
        setGroups([]);
      } else {
        setGroups(((data as any) || []) as ExclusiveGroup[]);
      }
      setLoading(false);
    }

    loadGroups();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node;
      if (interestOpen && interestWrapRef.current && !interestWrapRef.current.contains(t)) {
        setInterestOpen(false);
      }
      if (cityOpen && cityWrapRef.current && !cityWrapRef.current.contains(t)) {
        setCityOpen(false);
      }
    }

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [interestOpen, cityOpen]);

  const interests = useMemo(() => {
    const set = new Set(
      groups
        .map((g) => g.interest || "")
        .map((s) => s.trim())
        .filter(Boolean)
    );
    return ["All", ...Array.from(set)];
  }, [groups]);

  const cities = useMemo(() => {
    const set = new Set(
      groups
        .map((g) => g.city || "")
        .map((s) => s.trim())
        .filter(Boolean)
    );
    return ["All", ...Array.from(set)];
  }, [groups]);

  const platforms = useMemo(() => {
    const set = new Set<string>();
    for (const g of groups) {
      for (const p of g.platforms || []) set.add(String(p));
    }
    const preferredOrder = ["instagram", "gmail", "whatsapp", "telegram"];
    const ordered = preferredOrder.filter((p) => set.has(p));
    const rest = Array.from(set).filter((p) => !preferredOrder.includes(p));
    return ["All", ...ordered, ...rest];
  }, [groups]);

  const visibleInterests = useMemo(() => {
    const q = interestSearch.trim().toLowerCase();
    if (!q) return interests;
    return interests.filter((i) => i.toLowerCase().includes(q));
  }, [interests, interestSearch]);

  const visibleCities = useMemo(() => {
    const q = citySearch.trim().toLowerCase();
    if (!q) return cities;
    return cities.filter((c) => c.toLowerCase().includes(q));
  }, [cities, citySearch]);

  const filtered = useMemo(() => {
    return groups.filter((g) => {
      const okInterest = interest === "All" || (g.interest || "") === interest;
      const okCity = city === "All" || (g.city || "") === city;

      const okPlatform =
        platform === "All" || (Array.isArray(g.platforms) && g.platforms.includes(platform));

      const okSearch =
        !search.trim() ||
        (
          (g.title || "") +
          " " +
          (g.description || "") +
          " " +
          (g.interest || "") +
          " " +
          (g.city || "")
        )
          .toLowerCase()
          .includes(search.trim().toLowerCase());

      return okInterest && okCity && okPlatform && okSearch;
    });
  }, [groups, interest, city, platform, search]);

  return (
    <main className="min-h-screen text-white">
      {/* Dark premium background (same vibe as your Payment page) */}
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {/* Header */}
        <div className="flex justify-between items-start flex-wrap gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Premium Circles
            </div>

            <h1 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
              Exclusive Groups
            </h1>
            <p className="mt-2 text-white/70 max-w-2xl">
              Premium circles. Payment will be done personally after approval.
            </p>
          </div>

          <a
            href="/register"
            className="px-5 py-3 rounded-2xl border border-white/12 bg-white/5 text-white/90 hover:bg-white/8 backdrop-blur transition"
          >
            Not a member? Register
          </a>
        </div>

        {/* Filters (same layout as /join) */}
        <div className="mt-8 rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-sm overflow-visible">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Interest dropdown */}
              <div ref={interestWrapRef} className="relative">
                <label className="text-sm font-medium text-white/80">Interest</label>

                <button
                  type="button"
                  onClick={() => {
                    setInterestOpen((v) => !v);
                    setCityOpen(false);
                  }}
                  className="mt-2 w-full rounded-2xl border border-white/10 px-4 py-3 bg-black/35 flex items-center justify-between text-white/90 outline-none focus:ring-2 focus:ring-white/10"
                >
                  <span className="text-sm">
                    <b className="text-white/95">{interest}</b>
                    <span className="text-white/45 font-normal">
                      {" "}
                      {interest === "All" ? "(All interests)" : ""}
                    </span>
                  </span>
                  <span className={`text-white/60 transition ${interestOpen ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>

                {interestOpen && (
                  <div className="absolute z-20 mt-2 w-full rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0B0B10]/95 shadow-2xl overflow-hidden backdrop-blur">
                    <div className="p-3 border-b border-white/10">
                      <input
                        value={interestSearch}
                        onChange={(e) => setInterestSearch(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/10"
                        placeholder="Search interest (eg: Cricket)"
                        autoFocus
                      />
                    </div>

                    <div className="max-h-64 overflow-auto p-2">
                      {visibleInterests.length === 0 && (
                        <div className="p-3 text-sm text-white/50">No matches</div>
                      )}

                      {visibleInterests.map((i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setInterest(i);
                            setInterestOpen(false);
                          }}
                          className={[
                            "w-full text-left px-3 py-2 rounded-2xl text-sm transition",
                            interest === i
                              ? "bg-white/10 text-white"
                              : "text-white/80 hover:bg-white/5",
                          ].join(" ")}
                        >
                          {i}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* City dropdown */}
              <div ref={cityWrapRef} className="relative">
                <label className="text-sm font-medium text-white/80">City</label>

                <button
                  type="button"
                  onClick={() => {
                    setCityOpen((v) => !v);
                    setInterestOpen(false);
                  }}
                  className="mt-2 w-full rounded-2xl border border-white/10 px-4 py-3 bg-black/35 flex items-center justify-between text-white/90 outline-none focus:ring-2 focus:ring-white/10"
                >
                  <span className="text-sm">
                    <b className="text-white/95">{city}</b>
                    <span className="text-white/45 font-normal">
                      {" "}
                      {city === "All" ? "(All cities)" : ""}
                    </span>
                  </span>
                  <span className={`text-white/60 transition ${cityOpen ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>

                {cityOpen && (
                  <div className="absolute z-20 mt-2 w-full rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0B0B10]/95 shadow-2xl overflow-hidden backdrop-blur">
                    <div className="p-3 border-b border-white/10">
                      <input
                        value={citySearch}
                        onChange={(e) => setCitySearch(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/10"
                        placeholder="Search city (eg: Hyderabad)"
                        autoFocus
                      />
                    </div>

                    <div className="max-h-64 overflow-auto p-2">
                      {visibleCities.length === 0 && (
                        <div className="p-3 text-sm text-white/50">No matches</div>
                      )}

                      {visibleCities.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setCity(c);
                            setCityOpen(false);
                          }}
                          className={[
                            "w-full text-left px-3 py-2 rounded-2xl text-sm transition",
                            city === c ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/5",
                          ].join(" ")}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Platform dropdown */}
              <div>
                <label className="text-sm font-medium text-white/80">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 px-4 py-3 bg-black/35 text-white/90 outline-none focus:ring-2 focus:ring-white/10"
                >
                  {platforms.map((p) => (
                    <option key={p} value={p} className="bg-[#0B0B10]">
                      {p === "All" ? "All platforms" : p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="text-sm font-medium text-white/80">
                  Search ( Title / Description / Interest / City)
                </label>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/10"
                  placeholder="Search anything..."
                />

                <button
                  onClick={() => {
                    setInterest("All");
                    setCity("All");
                    setPlatform("All");
                    setSearch("");
                    setInterestSearch("");
                    setCitySearch("");
                    setInterestOpen(false);
                    setCityOpen(false);
                  }}
                  className="mt-3 w-full px-4 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/8 text-sm text-white/90 backdrop-blur transition"
                  type="button"
                >
                  Clear filters
                </button>
              </div>
            </div>

            <div className="mt-4 text-sm text-white/60">
              Showing <b className="text-white">{filtered.length}</b> group(s)
            </div>
          </div>
        </div>

        {/* Groups (Netflix row like /join) */}
        <div className="mt-8">
          {loading && <div className="text-white/60">Loading groups...</div>}

          {!loading && filtered.length === 0 && (
            <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 text-white/70">
              No exclusive groups found. Try changing filters.
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
              {filtered.map((g) => (
                <div
                  key={g.id}
                  className="group rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden cursor-pointer transition hover:bg-white/7 hover:border-white/15 snap-start shrink-0"
                  style={{ width: 320 }}
                  onClick={() => (window.location.href = `/exclusive/${g.id}`)}
                >
                  <div className="aspect-square bg-black/40 relative">
                    {g.poster_url ? (
                      <img
                        src={g.poster_url}
                        alt={`${g.title} poster`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/50">
                        No poster
                      </div>
                    )}

                    <div className="absolute top-3 right-3 rounded-2xl bg-black/50 border border-white/10 px-3 py-1 text-sm font-bold text-white backdrop-blur">
                      ₹{Number(g.price) || 0}
                    </div>

                    {/* subtle hover overlay */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(600px_260px_at_50%_0%,rgba(255,255,255,0.12),transparent_65%)]" />
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-white/95">{g.title}</h3>
                    <p className="mt-2 text-sm text-white/70 line-clamp-2">
                      {g.description || ""}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {g.interest && <Tag>{g.interest}</Tag>}
                      {g.city && <Tag>{g.city}</Tag>}
                      {g.platforms?.map((p) => (
                        <Tag key={p}>{p}</Tag>
                      ))}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/exclusive/${g.id}`;
                      }}
                      className="mt-5 w-full px-4 py-3 rounded-2xl bg-white text-black hover:bg-white/90 transition font-semibold"
                      type="button"
                    >
                      Open
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs px-3 py-1 rounded-full border border-white/10 bg-black/30 text-white/70">
      {children}
    </span>
  );
}
