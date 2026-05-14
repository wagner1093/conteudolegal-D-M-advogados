"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Search, Loader2, Activity, User, Calendar, Database, Eye } from "lucide-react";

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("site_dm_advogados_audit_logs")
        .select("*, profiles:user_id(full_name, email)")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (err) {
      console.error("Erro ao buscar logs:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "40px" }}>
      {/* ── Header ── */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1e293b", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
          <Activity size={28} color="#6366f1" /> Logs do Sistema
        </h1>
        <p style={{ fontSize: "14px", color: "#64748b", marginTop: "4px" }}>
          Trilha de auditoria: acompanhe todas as modificações críticas feitas no sistema.
        </p>
      </div>

      {/* ── Table Container ── */}
      <div style={{
        background: "#ffffff",
        borderRadius: "24px",
        border: "1px solid rgba(0,0,0,0.06)",
        overflow: "hidden",
        boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9", background: "#fcfdfe" }}>
                <th style={tableHeaderStyle}>Ação</th>
                <th style={tableHeaderStyle}>Usuário</th>
                <th style={tableHeaderStyle}>Entidade (Tabela)</th>
                <th style={tableHeaderStyle}>Data/Hora</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ padding: "100px", textAlign: "center" }}>
                    <Loader2 size={32} className="animate-spin" color="#1e293b" />
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: "80px", textAlign: "center" }}>
                    <p style={{ fontSize: "15px", color: "#64748b", fontWeight: 500 }}>Nenhum log encontrado.</p>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: "1px solid #f8fafc", transition: "all 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#fcfdfe")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <td style={{ padding: "16px 24px" }}>
                      <span style={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 700,
                        background: log.action === 'CREATE' ? '#dcfce7' : log.action === 'UPDATE' ? '#e0e7ff' : '#fee2e2',
                        color: log.action === 'CREATE' ? '#166534' : log.action === 'UPDATE' ? '#3730a3' : '#991b1b',
                      }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: "16px 24px", color: "#475569", fontWeight: 500, fontSize: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <User size={16} color="#94a3b8" />
                        {log.profiles?.full_name || log.profiles?.email || log.user_id}
                      </div>
                    </td>
                    <td style={{ padding: "16px 24px", color: "#64748b", fontWeight: 600, fontSize: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Database size={16} color="#94a3b8" />
                        {log.entity_type} <span style={{ fontSize: "11px", color: "#cbd5e1" }}>({log.entity_id?.substring(0, 8)}...)</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 24px", color: "#64748b", fontWeight: 500, fontSize: "13px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Calendar size={14} />
                        {new Date(log.created_at).toLocaleString("pt-BR")}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
