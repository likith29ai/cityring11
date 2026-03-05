"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AdminGuard from "./AdminGuard";
import { supabase } from "../../lib/supabaseClient";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getSession();
      setEmail(data.session?.user?.email ?? null);
    }
    load();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  // Login page should not show the dashboard chrome
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-zinc-50 text-zinc-900">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-zinc-900 text-white flex items-center justify-center font-bold">
                CR
              </div>
              <div>
                <div className="font-semibold leading-tight">CityRing Admin</div>
                <div className="text-xs text-zinc-500">{email ?? "—"}</div>
              </div>
            </div>

            <nav className="flex flex-wrap items-center gap-2">
              <Link
                href="/admin"
                className={`px-3 py-2 rounded-xl text-sm border hover:bg-zinc-50 ${
                  pathname === "/admin" ? "bg-zinc-900 text-white border-zinc-900" : "bg-white"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/admin/approvals"
                className={`px-3 py-2 rounded-xl text-sm border hover:bg-zinc-50 ${
                  pathname?.startsWith("/admin/approvals")
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "bg-white"
                }`}
              >
                Membership
              </Link>
              <Link
                href="/admin/join-requests"
                className={`px-3 py-2 rounded-xl text-sm border hover:bg-zinc-50 ${
                  pathname?.startsWith("/admin/join-requests")
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "bg-white"
                }`}
              >
                Join requests
              </Link>
              <Link
                href="/admin/groups/new"
                className={`px-3 py-2 rounded-xl text-sm border hover:bg-zinc-50 ${
                  pathname?.startsWith("/admin/groups/new")
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "bg-white"
                }`}
              >
                New group
              </Link>

              <button
                onClick={signOut}
                className="px-3 py-2 rounded-xl text-sm border bg-white hover:bg-zinc-50"
              >
                Sign out
              </button>
            </nav>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-10">{children}</div>
      </div>
    </AdminGuard>
  );
}
