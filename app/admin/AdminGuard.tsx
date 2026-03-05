"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Allow login page to render without a session
    if (pathname === "/admin/login") {
      setChecking(false);
      return;
    }

    let cancelled = false;

    async function run() {
      try {
        const { data: sessionData, error: sessErr } = await supabase.auth.getSession();
        if (sessErr) throw sessErr;

        const user = sessionData.session?.user;
        const email = user?.email ?? null;

        if (!email) {
          router.replace("/admin/login");
          return;
        }

        // Check admins table
        const { data: adminRow, error: adminErr } = await supabase
          .from("admins")
          .select("email")
          .eq("email", email)
          .maybeSingle();

        if (adminErr) throw adminErr;

        if (!adminRow) {
          // Not an admin => sign out and send to login
          await supabase.auth.signOut();
          router.replace("/admin/login");
          return;
        }
      } catch (e) {
        console.error("AdminGuard error:", e);
        router.replace("/admin/login");
      } finally {
        if (!cancelled) setChecking(false);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-zinc-50 text-zinc-900 flex items-center justify-center">
        <div className="text-zinc-600">Checking admin access…</div>
      </div>
    );
  }

  return <>{children}</>;
}
