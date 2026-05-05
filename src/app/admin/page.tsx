"use client";

import {
  FileText,
  Plus,
  Clock,
  ChevronRight,
  Eye,
  ExternalLink as ExternalLinkIcon,
  Users,
  Calendar,
  MousePointer2,
  Share2,
  Settings,
  ArrowUpRight as ArrowUpRightIcon,
  LayoutGrid as LayoutGridIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

// ─────────────────────────────────────────────
// Stat Card Component
// ─────────────────────────────────────────────
type StatProps = {
  title: string;
  value: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  accent: string;
};

function StatCard({ title, value, desc, icon: Icon, accent }: StatProps) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.04)",
        borderRadius: "24px",
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        position: "relative",
        flex: 1,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "24px",
          right: "24px",
          opacity: 0.1,
        }}
      >
        <ArrowUpRightIcon size={20} />
      </div>

      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          background: accent + "12",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "8px",
        }}
      >
        <Icon size={22} color={accent} />
      </div>

      <div>
        <p
          style={{
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#9ca3af",
            margin: 0,
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: "38px",
            fontWeight: 700,
            color: "#0B1E2D",
            margin: "4px 0",
            lineHeight: 1,
          }}
        >
          {value}
        </p>
        <p
          style={{
            fontSize: "12px",
            color: "#9ca3af",
            fontWeight: 500,
            margin: 0,
          }}
        >
          {desc}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────
export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    posts: 0,
    leads: 0,
    views: "4.8k" // Keeping mock views for now as they are harder to track
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      if (!supabase) return;
      const [{ count: postCount }, { count: leadCount }] = await Promise.all([
        supabase.from("site_dm_advogados_posts").select("*", { count: "exact", head: true }),
        supabase.from("site_dm_advogados_leads").select("*", { count: "exact", head: true })
      ]);

      setCounts({
        posts: postCount || 0,
        leads: leadCount || 0,
        views: "4.8k"
      });
    } catch (err) {
      console.error("Erro ao buscar contagens:", err);
    } finally {
      setLoading(false);
    }
  };

  const dateStr = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto" }}>
      
      {/* ── Header Section ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "40px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#0B1E2D",
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            Olá, Administrador
          </h1>
          <p style={{ fontSize: "15px", color: "#6b7280", marginTop: "6px", fontWeight: 500 }}>
            Bem-vindo de volta ao portal de gestão D&M Advogados.
          </p>
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: "10px 20px",
            borderRadius: "14px",
            border: "1px solid rgba(0,0,0,0.05)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
          }}
        >
          <Calendar size={16} color="#c5a059" />
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#4b5563" }}>
            {dateStr}
          </span>
        </div>
      </div>

      {/* ── Top Stat Cards ── */}
      <div style={{ display: "flex", gap: "24px", marginBottom: "40px" }}>
        <StatCard 
          title="Artigos no Blog" 
          value={loading ? "..." : counts.posts.toString()} 
          desc="Conteúdo educativo e informativo." 
          icon={FileText} 
          accent="#6366f1" 
        />
        <StatCard 
          title="Leads de Contato" 
          value={loading ? "..." : counts.leads.toString()} 
          desc="Consultas enviadas pelo site." 
          icon={Users} 
          accent="#f59e0b" 
        />
        <StatCard 
          title="Visualizações do Site" 
          value={counts.views} 
          desc="Tráfego mensal acumulado." 
          icon={MousePointer2} 
          accent="#22c55e" 
        />
      </div>

      {/* ── Bottom Section ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "32px",
          alignItems: "start",
          marginTop: "32px",
        }}
      >
        {/* Acesso Rápido */}
        <div
          style={{
            background: "#ffffff",
            padding: "32px",
            borderRadius: "24px",
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
             <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0B1E2D", margin: 0 }}>
               Acesso Rápido
             </h3>
             <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, background: "#f1f5f9", padding: "4px 10px", borderRadius: "8px" }}>
               Atalhos Úteis
             </span>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <QuickActionCard
              icon={Plus}
              label="Novo Artigo"
              desc="Criar post para o blog"
              href="/admin/posts/novo"
              color="#6366f1"
            />
            <QuickActionCard
              icon={Users}
              label="Leads"
              desc="Gerenciar contatos"
              href="/admin/leads"
              color="#f59e0b"
            />
            <QuickActionCard
              icon={Share2}
              label="Integrações"
              desc="Scripts e pixels"
              href="/admin/integracao"
              color="#c5a059"
            />
            <QuickActionCard
              icon={FileText}
              label="Ver Posts"
              desc="Gerenciar biblioteca"
              href="/admin/posts"
              color="#0ea5e9"
            />
            <QuickActionCard
              icon={Settings}
              label="Preferências"
              desc="Configurar sistema"
              href="/admin/configuracoes"
              color="#64748b"
            />
          </div>
        </div>

      </div>
    </div>
  );
}

function QuickActionCard({ icon: Icon, label, desc, href, color }: any) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "18px",
        borderRadius: "18px",
        background: "#ffffff",
        border: "1px solid #f1f5f9",
        textDecoration: "none",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color + "40";
        e.currentTarget.style.background = color + "05";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 10px 20px -5px ${color}15`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#f1f5f9";
        e.currentTarget.style.background = "#ffffff";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "12px",
          background: color + "10",
          color: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={20} strokeWidth={2.5} />
      </div>
      <div>
        <div style={{ fontSize: "14px", fontWeight: 700, color: "#0B1E2D" }}>{label}</div>
        <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 500, marginTop: "2px" }}>{desc}</div>
      </div>
    </Link>
  );
}

