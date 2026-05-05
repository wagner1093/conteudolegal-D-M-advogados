"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  Trash2,
  ExternalLink,
  Loader2,
  CheckCircle2,
  Clock,
  MessageSquare
} from "lucide-react";

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const client = supabase;
    if (!client) return;
    try {
      const { data, error } = await client
        .from("site_dm_advogados_leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error("Erro ao buscar leads:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir este lead?")) return;
    const client = supabase;
    if (!client) {
      console.error("Database client not initialized");
      return;
    }
    try {
      const { error } = await client
        .from("site_dm_advogados_leads")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setLeads(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      console.error("Erro ao deletar lead:", err);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const client = supabase;
    if (!client) {
      console.error("Database client not initialized");
      return;
    }
    try {
      const { error } = await client
        .from("site_dm_advogados_leads")
        .update({ status: newStatus })
        .eq("id", id);
      if (error) throw error;
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      !searchTerm ||
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "todos" || lead.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "60px" }}>
      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1e293b", margin: 0, display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ color: "#f59e0b" }}><Users size={28} strokeWidth={2.5} /></span>
            Gestão de Leads
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "8px", fontWeight: 500 }}>
            Gerencie as consultas e contatos recebidos através do site.
          </p>
        </div>
      </div>

      {/* ── Search & Filter ── */}
      <div style={{ 
        background: "#ffffff", 
        padding: "20px 24px", 
        borderRadius: "20px", 
        border: "1px solid rgba(0,0,0,0.05)", 
        display: "flex", 
        gap: "20px", 
        marginBottom: "32px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.02)"
      }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={18} color="#94a3b8" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
          <input 
            type="text" 
            placeholder="Pesquisar por nome, e-mail ou assunto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px 12px 48px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 500,
              outline: "none",
              color: "#1e293b",
              transition: "all 0.2s"
            }}
          />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {["todos", "novo", "em_atendimento", "concluido"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 600,
                border: filterStatus === s ? "1px solid #1e293b" : "1px solid #e2e8f0",
                background: filterStatus === s ? "#1e293b" : "#ffffff",
                color: filterStatus === s ? "#ffffff" : "#64748b",
                cursor: "pointer",
                transition: "all 0.2s",
                textTransform: "capitalize"
              }}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table Section ── */}
      <div style={{ 
        background: "#ffffff", 
        borderRadius: "24px", 
        border: "1px solid rgba(0,0,0,0.06)", 
        overflow: "hidden",
        boxShadow: "0 10px 40px rgba(0,0,0,0.02)"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
              <th style={{ padding: "20px 24px", fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Lead</th>
              <th style={{ padding: "20px 24px", fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Status</th>
              <th style={{ padding: "20px 24px", fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Mensagem</th>
              <th style={{ padding: "20px 24px", fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Data</th>
              <th style={{ padding: "20px 24px", textAlign: "right" }}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: "100px", textAlign: "center" }}>
                  <Loader2 size={32} className="animate-spin" color="#1e293b" />
                </td>
              </tr>
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "80px", textAlign: "center" }}>
                  <p style={{ fontSize: "15px", color: "#64748b", fontWeight: 500 }}>Nenhum lead encontrado.</p>
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id} style={{ borderBottom: "1px solid #f1f5f9", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#fbfcfd"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "15px", fontWeight: 700, color: "#1e293b" }}>{lead.name}</span>
                      <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
                        <span style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Mail size={12} /> {lead.email}
                        </span>
                        {lead.phone && (
                          <span style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                            <Phone size={12} /> {lead.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "20px 24px" }}>
                    <StatusBadge status={lead.status} />
                  </td>
                  <td style={{ padding: "20px 24px" }}>
                    <p style={{ 
                      fontSize: "13px", 
                      color: "#475569", 
                      margin: 0, 
                      maxWidth: "300px", 
                      whiteSpace: "nowrap", 
                      overflow: "hidden", 
                      textOverflow: "ellipsis",
                      fontWeight: 500
                    }}>
                      {lead.message}
                    </p>
                  </td>
                  <td style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748b", fontSize: "13px", fontWeight: 500 }}>
                      <Calendar size={14} />
                      {new Date(lead.created_at).toLocaleDateString("pt-BR")}
                    </div>
                  </td>
                  <td style={{ padding: "20px 24px", textAlign: "right" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                      <button 
                        onClick={() => updateStatus(lead.id, lead.status === 'novo' ? 'em_atendimento' : lead.status === 'em_atendimento' ? 'concluido' : 'novo')}
                        style={{ padding: "8px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#ffffff", color: "#64748b", cursor: "pointer" }}
                        title="Alterar Status"
                      >
                        <Clock size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(lead.id)}
                        style={{ padding: "8px", borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#ef4444", cursor: "pointer" }}
                        title="Excluir Lead"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: any = {
    novo: { label: "Novo", color: "#3b82f6", bg: "#eff6ff", icon: Clock },
    em_atendimento: { label: "Atendimento", color: "#f59e0b", bg: "#fffbeb", icon: MessageSquare },
    concluido: { label: "Concluído", color: "#10b981", bg: "#f0fdf4", icon: CheckCircle2 },
  };

  const config = configs[status] || configs.novo;
  const Icon = config.icon;

  return (
    <div style={{ 
      display: "inline-flex", 
      alignItems: "center", 
      gap: "6px", 
      padding: "6px 12px", 
      borderRadius: "100px", 
      background: config.bg, 
      color: config.color,
      fontSize: "12px",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.5px"
    }}>
      <Icon size={12} strokeWidth={3} />
      {config.label}
    </div>
  );
}
