"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Group = {
  id: string;
  title: string;
  city: string;
  interest: string;
  is_active?: boolean | null;
};

type Section = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  sort_order: number;
  is_active: boolean;
};

type SectionItem = {
  id: string;
  section_id: string;
  group_id: string;
  sort_order: number;
  group?: Group | null;
};

export default function AdminHomepagePage() {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);
  const [itemsBySection, setItemsBySection] = useState<Record<string, SectionItem[]>>({});
  const [groups, setGroups] = useState<Group[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function loadAll() {
    setLoading(true);
    setError(null);

    try {
      // 1) sections
      const { data: sec, error: secErr } = await supabase
        .from("homepage_sections")
        .select("id,slug,title,subtitle,sort_order,is_active")
        .order("sort_order", { ascending: true });

      if (secErr) throw secErr;

      // 2) items (sort_order)
      const { data: it, error: itErr } = await supabase
        .from("homepage_section_items")
        .select("id,section_id,group_id,sort_order, group:groups(id,title,city,interest,is_active)")
        .order("sort_order", { ascending: true });

      if (itErr) throw itErr;

      // 3) all groups (for picker)
      const { data: g, error: gErr } = await supabase
        .from("groups")
        .select("id,title,city,interest,is_active")
        .order("created_at", { ascending: false });

      if (gErr) throw gErr;

      const secArr = (sec ?? []) as Section[];
      const itemsArr = (it ?? []) as unknown as Array<
        Omit<SectionItem, "group"> & { group?: Group | null }
      >;
      const groupsArr = (g ?? []) as Group[];

      // Build map: section_id -> items[]
      const map: Record<string, SectionItem[]> = {};
      for (const s of secArr) map[s.id] = [];
      for (const row of itemsArr) {
        const item: SectionItem = {
          id: row.id,
          section_id: row.section_id,
          group_id: row.group_id,
          sort_order: row.sort_order,
          group: (row as any).group ?? null,
        };
        if (!map[item.section_id]) map[item.section_id] = [];
        map[item.section_id].push(item);
      }

      // Ensure each section items are sorted
      for (const k of Object.keys(map)) {
        map[k].sort((a, b) => a.sort_order - b.sort_order);
      }

      setSections(secArr);
      setItemsBySection(map);
      setGroups(groupsArr);
    } catch (e: any) {
      console.error("AdminHomepage loadAll error:", e);
      setError(e?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAll();
  }, []);

  async function addGroupToSection(sectionId: string, groupId: string) {
    setError(null);

    const current = itemsBySection[sectionId] ?? [];
    const nextOrder = current.length ? Math.max(...current.map((x) => x.sort_order)) + 1 : 0;

    const { data, error: insErr } = await supabase
      .from("homepage_section_items")
      .insert({ section_id: sectionId, group_id: groupId, sort_order: nextOrder })
      .select("id,section_id,group_id,sort_order")
      .single();

    if (insErr) {
      console.error("addGroupToSection error:", insErr);
      setError(insErr.message);
      return;
    }

    const newItem: SectionItem = {
      ...(data as any),
      group: groups.find((g) => g.id === groupId) ?? null,
    };

    setItemsBySection((prev) => {
      const next = { ...prev };
      next[sectionId] = [...(next[sectionId] ?? []), newItem].sort(
        (a, b) => a.sort_order - b.sort_order
      );
      return next;
    });
  }

  async function removeItem(itemId: string, sectionId: string) {
    setError(null);

    const { error: delErr } = await supabase
      .from("homepage_section_items")
      .delete()
      .eq("id", itemId);

    if (delErr) {
      console.error("removeItem error:", delErr);
      setError(delErr.message);
      return;
    }

    setItemsBySection((prev) => {
      const next = { ...prev };
      next[sectionId] = (next[sectionId] ?? []).filter((x) => x.id !== itemId);
      return next;
    });
  }

  async function moveItem(sectionId: string, index: number, dir: "up" | "down") {
    setError(null);

    const list = [...(itemsBySection[sectionId] ?? [])].sort(
      (a, b) => a.sort_order - b.sort_order
    );

    const j = dir === "up" ? index - 1 : index + 1;
    if (j < 0 || j >= list.length) return;

    const a = list[index];
    const b = list[j];

    const aOrder = a.sort_order;
    const bOrder = b.sort_order;

    // optimistic swap in UI
    a.sort_order = bOrder;
    b.sort_order = aOrder;
    list.sort((x, y) => x.sort_order - y.sort_order);
    setItemsBySection((prev) => ({ ...prev, [sectionId]: list }));

    // try RPC first (fast + atomic)
    const { error: rpcErr } = await supabase.rpc("swap_homepage_item_positions", {
      p_item_a: a.id,
      p_item_b: b.id,
    });

    if (!rpcErr) return;

    // fallback if rpc missing/blocked
    console.warn("RPC swap failed, falling back to updates:", rpcErr);

    const { error: up1 } = await supabase
      .from("homepage_section_items")
      .update({ sort_order: bOrder })
      .eq("id", a.id);

    const { error: up2 } = await supabase
      .from("homepage_section_items")
      .update({ sort_order: aOrder })
      .eq("id", b.id);

    if (up1 || up2) {
      console.error("moveItem update fallback error:", up1 ?? up2);
      setError((up1 ?? up2)?.message ?? "Failed to reorder");
      await loadAll();
    }
  }

  if (loading) {
    return <div style={{ padding: 16 }}>Loading…</div>;
  }

  return (
    <div style={{ padding: 16, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Admin: Homepage</h1>

      {error ? (
        <div style={{ padding: 12, background: "#fee", border: "1px solid #f99", marginBottom: 12 }}>
          <b>Error:</b> {error}
        </div>
      ) : null}

      <div style={{ display: "grid", gap: 16 }}>
        {sections.map((s) => {
          const items = (itemsBySection[s.id] ?? [])
            .slice()
            .sort((a, b) => a.sort_order - b.sort_order);

          return (
            <div
              key={s.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 16,
                background: "white",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{s.title}</div>
                  <div style={{ opacity: 0.8 }}>{s.subtitle ?? s.slug}</div>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      const gid = e.target.value;
                      if (!gid) return;
                      void addGroupToSection(s.id, gid);
                      e.currentTarget.value = "";
                    }}
                    style={{ padding: 8, borderRadius: 8 }}
                  >
                    <option value="" disabled>
                      + Add ring…
                    </option>
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.title} — {g.city} ({g.interest})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                {items.length === 0 ? (
                  <div style={{ opacity: 0.7 }}>No rings yet.</div>
                ) : (
                  items.map((it, idx) => (
                    <div
                      key={it.id}
                      style={{
                        border: "1px solid #eee",
                        borderRadius: 10,
                        padding: 12,
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700 }}>{it.group?.title ?? it.group_id}</div>
                        <div style={{ opacity: 0.8, fontSize: 13 }}>
                          {it.group ? `${it.group.city} • ${it.group.interest}` : ""}
                        </div>
                        <div style={{ opacity: 0.6, fontSize: 12 }}>
                          sort_order: {it.sort_order}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <button
                          onClick={() => void moveItem(s.id, idx, "up")}
                          disabled={idx === 0}
                          style={{ padding: "8px 10px", borderRadius: 8 }}
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => void moveItem(s.id, idx, "down")}
                          disabled={idx === items.length - 1}
                          style={{ padding: "8px 10px", borderRadius: 8 }}
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => void removeItem(it.id, s.id)}
                          style={{ padding: "8px 10px", borderRadius: 8 }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
