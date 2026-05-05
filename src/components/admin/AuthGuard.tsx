"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/admin/login");
      } else {
        setAuthenticated(true);
      }
      setLoading(false);
    };

    checkUser();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase?.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/admin/login");
        setAuthenticated(false);
      } else {
        setAuthenticated(true);
      }
    }) || { data: { subscription: null } };

    return () => {
      subscription?.unsubscribe();
    };
  }, [router]);

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
