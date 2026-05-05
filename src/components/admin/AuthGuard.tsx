"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isLoginPage = pathname === "/admin/login";

    const checkUser = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session && !isLoginPage) {
        router.push("/admin/login");
      } else if (session) {
        setAuthenticated(true);
      }
      setLoading(false);
    };

    checkUser();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase?.auth.onAuthStateChange((_event, session) => {
      if (!session && !isLoginPage) {
        router.push("/admin/login");
        setAuthenticated(false);
      } else if (session) {
        setAuthenticated(true);
      }
    }) || { data: { subscription: null } };

    return () => {
      subscription?.unsubscribe();
    };
  }, [router, pathname]);

  // Se for a página de login, permitimos renderizar sem autenticação
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F0F2F5",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Loader2 className="animate-spin" size={48} color="#c5a059" />
          <p style={{ marginTop: "16px", color: "#64748b", fontWeight: 600 }}>
            Verificando autenticação...
          </p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}

