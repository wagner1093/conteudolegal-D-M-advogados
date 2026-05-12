"use client";

import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar,
  User,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSite } from "@/context/SiteContext";

export default function PostsPage() {
  const { selectedSiteId } = useSite();
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    publicados: 0,
    rascunhos: 0,
    views: 0
  });

  useEffect(() => {
    if (selectedSiteId) {
      fetchPosts();
    }
  }, [selectedSiteId]);

  const fetchPosts = async () => {
    const client = supabase;
    if (!client || !selectedSiteId) return;
    
    try {
      setLoading(true);
      const { data, error } = await client
        .from("painel_posts")
        .select("*, painel_categorias(name)")
        .eq("site_id", selectedSiteId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const p = data || [];
      setPosts(p);
      
      setStats({
        total: p.length,
        publicados: p.filter(x => x.status === "published" || x.status === "Publicado").length,
        rascunhos: p.filter(x => x.status === "draft" || x.status === "Rascunho").length,
        views: p.reduce((acc, curr) => acc + (curr.views || 0), 0)
      });
    } catch (err) {
      console.error("Erro ao buscar posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este artigo?")) return;
    const client = supabase;
    if (!client) return;
    
    try {
      const { error } = await client
        .from("painel_posts")
        .delete()
        .eq("id", id);
      if (error) throw error;
      fetchPosts();
    } catch (err) {
      console.error("Erro ao deletar:", err);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.painel_categorias?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "40px" }}>
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1e293b", margin: 0, letterSpacing: "-0.02em" }}>
            Gerenciar Posts
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", marginTop: "4px", fontWeight: 400 }}>
            Crie, edite e organize os artigos do seu blog jurídico com facilidade.
          </p>
        </div>

        <Link
          href="/admin/posts/novo"
          style={{
            padding: "12px 24px",
            background: "#1e293b",
            color: "#ffffff",
            border: "none",
            borderRadius: "14px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 10px 25px -5px rgba(30,41,59,0.2)",
            transition: "all 0.2s ease",
            textDecoration: "none"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 15px 30px -5px rgba(30,41,59,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(30,41,59,0.2)";
          }}
        >
          <Plus size={20} strokeWidth={2.5} /> Novo Artigo
        </Link>
      </div>

      {/* ── Stats Summary ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "32px" }}>
        <MiniStat label="Total de Posts" value={stats.total.toString()} color="#1e293b" />
        <MiniStat label="Publicados" value={stats.publicados.toString()} color="#22c55e" />
        <MiniStat label="Visualizações" value={stats.views.toString()} color="#6366f1" />
        <MiniStat label="Rascunhos" value={stats.rascunhos.toString()} color="#94a3b8" />
      </div>

      {/* ── Filters Bar ── */}
      <div
        style={{
          background: "#ffffff",
          padding: "16px",
          borderRadius: "20px",
          border: "1px solid rgba(0,0,0,0.06)",
          display: "flex",
          gap: "16px",
          marginBottom: "24px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
        }}
      >
        <div style={{ position: "relative", flex: 1 }}>
          <Search
            size={18}
            style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
          />
          <input
            type="text"
            placeholder="Buscar por título, categoria ou autor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 14px 14px 48px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "14px",
              fontSize: "14px",
              outline: "none",
              fontWeight: 500,
              color: "#1e293b",
              transition: "all 0.2s ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#1e293b";
              e.currentTarget.style.background = "#ffffff";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.background = "#f8fafc";
            }}
          />
        </div>
        <button
          style={{
            padding: "0 24px",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "14px",
            fontWeight: 700,
            color: "#475569",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#94a3b8")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
        >
          <Filter size={18} /> Filtros Avançados
        </button>
      </div>

      {/* ── Table Container ── */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "24px",
          border: "1px solid rgba(0,0,0,0.06)",
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9", background: "#fcfdfe" }}>
                <th style={tableHeaderStyle}>Artigo</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={tableHeaderStyle}>Popularidade</th>
                <th style={tableHeaderStyle}>Data</th>
                <th style={{ ...tableHeaderStyle, textAlign: "right" }}>Gerenciar</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: "100px", textAlign: "center" }}>
                    <Loader2 size={32} className="animate-spin" color="#1e293b" />
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "80px", textAlign: "center" }}>
                    <p style={{ fontSize: "15px", color: "#64748b", fontWeight: 500 }}>Nenhum post encontrado.</p>
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    style={{
                      borderBottom: "1px solid #f8fafc",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fcfdfe")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "24px" }}>
                      <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
                        <div style={{ position: "relative" }}>
                          <img
                            src={post.image_url || "https://images.unsplash.com/photo-1505751172107-573225a912b7?w=400&h=400&fit=crop"}
                            alt=""
                            style={{ width: "56px", height: "56px", borderRadius: "14px", objectFit: "cover", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                          />
                          <div style={{ position: "absolute", bottom: "-4px", right: "-4px", width: "12px", height: "12px", borderRadius: "50%", background: (post.status === "published" || post.status === "Publicado") ? "#22c55e" : "#94a3b8", border: "2px solid #ffffff" }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: "#1e293b", fontSize: "15px", marginBottom: "6px", lineHeight: "1.4" }}>
                            {post.title}
                          </div>
                          <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                            <span style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "5px", fontWeight: 600 }}>
                              <User size={13} strokeWidth={2.5} /> {post.author_id ? "Autor" : "Admin"}
                            </span>
                            <span style={{ fontSize: "12px", color: "#1e293b", background: "rgba(30,41,59,0.05)", padding: "2px 8px", borderRadius: "6px", fontWeight: 600 }}>
                              {post.painel_categorias?.name || "Sem Categoria"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "24px" }}>
                      <StatusBadge status={post.status} />
                    </td>
                    <td style={{ padding: "24px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>
                          {(post.views || 0).toLocaleString()}
                        </span>
                        <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 500 }}>Visualizações</span>
                      </div>
                    </td>
                    <td style={{ padding: "24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#475569", fontWeight: 600 }}>
                        <Calendar size={15} />
                        {new Date(post.created_at).toLocaleDateString("pt-BR")}
                      </div>
                    </td>
                    <td style={{ padding: "24px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                        <Link href={`/admin/posts/editar/${post.id}`}>
                          <ActionButton icon={Edit} color="#6366f1" title="Editar Artigo" />
                        </Link>
                        <ActionButton icon={Trash2} color="#ef4444" title="Excluir" onClick={() => handleDelete(post.id)} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div
          style={{
            padding: "24px",
            borderTop: "1px solid #f1f5f9",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#fcfdfe",
          }}
        >
          <p style={{ fontSize: "14px", color: "#64748b", fontWeight: 600 }}>
            Exibindo <span style={{ color: "#1e293b" }}>{filteredPosts.length}</span> de <span style={{ color: "#1e293b" }}>{posts.length}</span> resultados
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button style={paginationButtonStyle}><ChevronLeft size={20} /></button>
            <button style={{ ...paginationButtonStyle, background: "#1e293b", color: "#ffffff", borderColor: "#1e293b" }}>1</button>
            <button style={paginationButtonStyle}>2</button>
            <button style={paginationButtonStyle}>3</button>
            <button style={paginationButtonStyle}><ChevronRight size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

const tableHeaderStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "18px 24px",
  fontSize: "12px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "#94a3b8",
};

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{
      background: "#ffffff",
      padding: "20px",
      borderRadius: "20px",
      border: "1px solid rgba(0,0,0,0.06)",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.01)"
    }}>
      <span style={{ fontSize: "13px", fontWeight: 600, color: "#64748b" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "24px", fontWeight: 800, color: color }}>{value}</span>
        <div style={{ padding: "6px", background: color + "10", borderRadius: "8px", color: color }}>
          <ArrowUpRight size={16} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Publicado: "#22c55e",
    published: "#22c55e",
    Rascunho: "#94a3b8",
    draft: "#94a3b8",
    Agendado: "#6366f1",
    scheduled: "#6366f1",
  };
  const color = colors[status] || "#94a3b8";

  return (
    <span
      style={{
        padding: "6px 14px",
        borderRadius: "10px",
        fontSize: "12px",
        fontWeight: 700,
        background: color + "10",
        color: color,
        border: `1px solid ${color}20`,
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: color }} />
      {status}
    </span>
  );
}

function ActionButton({ icon: Icon, color, title, onClick }: { icon: any; color: string; title: string; onClick?: () => void }) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "12px",
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#64748b",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = color;
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.background = color + "05";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "#64748b";
        e.currentTarget.style.borderColor = "#e2e8f0";
        e.currentTarget.style.background = "#ffffff";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <Icon size={18} strokeWidth={2} />
    </button>
  );
}

const paginationButtonStyle: React.CSSProperties = {
  width: "40px",
  height: "40px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "14px",
  fontWeight: 700,
  color: "#475569",
  cursor: "pointer",
  transition: "all 0.2s ease",
};
