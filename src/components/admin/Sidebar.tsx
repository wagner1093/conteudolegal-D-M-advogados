"use client";

import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Share2,
  LogOut,
  ChevronRight,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: "Painel", href: "/admin" },
  { icon: FileText, label: "Posts", href: "/admin/posts" },
  { icon: Users, label: "Leads", href: "/admin/leads" },
  { icon: Share2, label: "Integração", href: "/admin/integracao" },
  { icon: Settings, label: "Configurações", href: "/admin/configuracoes" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div
      style={{
        width: "280px",
        height: "100%",
        background: "#0B1E2D",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "relative",
        zIndex: 50,
        boxShadow: "10px 0 30px rgba(0,0,0,0.1)",
      }}
    >
      {/* ── Brand Logo ── */}
      <div
        style={{
          padding: "40px 32px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            background: "linear-gradient(135deg, #c5a059 0%, #e2c08d 100%)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(197,160,89,0.3)",
          }}
        >
          <Shield size={22} color="#0B1E2D" />
        </div>
        <div>
          <h2
            style={{
              color: "#ffffff",
              fontSize: "18px",
              fontWeight: 600,
              margin: 0,
              letterSpacing: "0.5px",
            }}
          >
            D&M <span style={{ color: "#c5a059", fontWeight: 500 }}>Admin</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", marginTop: "2px", letterSpacing: "1px" }}>
            Management Portal
          </p>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ flex: 1, padding: "0 16px" }}>
        <p style={{ padding: "0 16px 12px", fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "1px" }}>
          Menu Principal
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  textDecoration: "none",
                  background: isActive ? "rgba(197,160,89,0.1)" : "transparent",
                  color: isActive ? "#c5a059" : "rgba(255,255,255,0.6)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.9)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                  }
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <item.icon size={20} />
                  <span style={{ fontSize: "14px", fontWeight: 600 }}>{item.label}</span>
                </div>
                {isActive && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#c5a059", boxShadow: "0 0 10px #c5a059" }} />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── Footer / Logout ── */}
      <div style={{ padding: "24px 16px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <button
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 16px",
            borderRadius: "12px",
            border: "none",
            background: "rgba(239, 68, 68, 0.05)",
            color: "#ef4444",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239, 68, 68, 0.05)")}
        >
          <LogOut size={20} />
          Sair do Portal
        </button>
      </div>
    </div>
  );
}
