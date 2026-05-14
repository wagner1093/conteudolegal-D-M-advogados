"use client";

import AdminSidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AuthGuard from "@/components/admin/AuthGuard";
import IdleTimeout from "@/components/admin/IdleTimeout";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });


export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <div className={inter.className}>
        <AuthGuard>
          {children}
        </AuthGuard>
      </div>
    );
  }

  return (
    <div className={inter.className}>
      <AuthGuard>
          <IdleTimeout />
          <div
            suppressHydrationWarning
            style={{
            display: "flex",
            width: "100vw",
            height: "100vh",
            background: "#F0F2F5",
            overflow: "hidden",
          }}
        >
          {/* Sidebar — fixed width */}
          <AdminSidebar />

          {/* Main column */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            {/* Top bar */}
            <AdminHeader />

            {/* Scrollable content */}
            <main
              style={{
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
                padding: "32px 36px 48px",
              }}
            >
              {children}
            </main>

            {/* Footer */}
            <footer
              style={{
                background: "#ffffff",
                borderTop: "1px solid rgba(0,0,0,0.06)",
                padding: "10px 32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <p style={{ fontSize: "11px", fontWeight: 500, color: "#9ca3af", margin: 0 }}>
                © 2026 Dohmen &amp; Matta Advogados Associados
              </p>
              <div style={{ display: "flex", gap: "20px" }}>
                {["Termos", "Privacidade", "Suporte"].map((t) => (
                  <a
                    key={t}
                    href="#"
                    style={{ fontSize: "11px", fontWeight: 500, color: "#9ca3af", textDecoration: "none" }}
                  >
                    {t}
                  </a>
                ))}
              </div>
            </footer>
          </div>
        </div>
      </AuthGuard>
    </div>
  );
}


