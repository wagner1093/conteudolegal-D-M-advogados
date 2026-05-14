"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Code2,
  Plus,
  Power,
  Activity,
  X,
  Save,
  TerminalSquare,
  Trash2,
  Loader2,
} from "lucide-react";

export default function IntegrationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);
  const selectedSiteId = process.env.NEXT_PUBLIC_SITE_ID;

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    const client = supabase;
    if (!client) return;
    setLoading(true);
    try {
      const { data, error } = await client
        .from("site_dm_advogados_integracoes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setIntegrations(data || []);
    } catch (err) {
      console.error("Erro ao buscar integrações:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const client = supabase;
    if (!client) {
      console.error("Database client not initialized");
      return;
    }
    const newStatus = currentStatus === "ativo" ? "inativo" : "ativo";
    try {
      const { error } = await client
        .from("site_dm_advogados_integracoes")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      setIntegrations(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta integração?")) return;
    const client = supabase;
    if (!client) {
      console.error("Database client not initialized");
      return;
    }
    try {
      const { error } = await client
        .from("site_dm_advogados_integracoes")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setIntegrations(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Erro ao deletar:", err);
    }
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingItem(null);
    setIsModalOpen(false);
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "60px" }}>
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1e293b", margin: 0, display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ color: "#8b5cf6" }}><Code2 size={28} strokeWidth={2.5} /></span>
            Pixels & Integrações
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "8px", fontWeight: 500 }}>
            Gerencie scripts externos, Google Analytics e Pixels de conversão.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            background: "#1e293b",
            color: "#ffffff",
            padding: "12px 24px",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 12px rgba(11,30,45,0.15)",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
          <Plus size={18} /> Conectar Script
        </button>
      </div>

      {/* ── Integrations Grid ── */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "100px" }}>
          <Loader2 className="animate-spin" size={40} color="#1e293b" />
        </div>
      ) : integrations.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px", background: "#ffffff", borderRadius: "24px", border: "1px dashed #e2e8f0" }}>
          <Code2 size={48} color="#94a3b8" style={{ marginBottom: "20px" }} />
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1e293b" }}>Nenhuma integração configurada</h3>
          <p style={{ fontSize: "14px", color: "#64748b", marginTop: "8px" }}>Comece adicionando um script do Google Analytics ou Pixel do Facebook.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
          {integrations.map((item) => (
            <IntegrationCard 
              key={item.id} 
              item={item} 
              onToggle={() => handleToggleStatus(item.id, item.status)} 
              onDelete={() => handleDelete(item.id)}
              onEdit={() => openEditModal(item)}
            />
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      {isModalOpen && (
        <IntegrationModal 
          onClose={closeModal} 
          onSave={fetchIntegrations}
          editingItem={editingItem}
        />
      )}
    </div>
  );
}

function IntegrationCard({ item, onToggle, onDelete, onEdit }: { item: any, onToggle: () => void, onDelete: () => void, onEdit: () => void }) {
  const isActive = item.status === "ativo";

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        transition: "all 0.3s ease"
      }}
    >
      {/* Top Green Indicator */}
      {isActive && (
        <div style={{ height: "4px", background: "#34d399", width: "100%" }} />
      )}

      <div style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "#f8fafc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <Code2 size={20} color="#0f172a" />
          </div>
          <button 
            onClick={onDelete}
            style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: "4px" }}
          >
            <Trash2 size={16} />
          </button>
        </div>

        <h3 
          onClick={onEdit}
          style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", margin: 0, marginBottom: "12px", cursor: "pointer" }}
        >
          {item.nome}
        </h3>
        
        <div
          style={{
            color: isActive ? "#059669" : "#64748b",
            fontSize: "11px",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: "6px",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}
        >
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: isActive ? "#10b981" : "#94a3b8" }} />
          {isActive ? "Ativo e Rodando" : "Inativo"}
        </div>
      </div>

      <div style={{ 
        borderTop: "1px solid #f1f5f9", 
        padding: "16px 24px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        background: "#f8fafc"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#94a3b8", fontSize: "11px", fontWeight: 600 }}>
          <Activity size={14} /> INSTALADO VIA CMS
        </div>
        <button
          onClick={onToggle}
          style={{
            background: isActive ? "#fee2e2" : "#dcfce7",
            border: "none",
            color: isActive ? "#ef4444" : "#10b981",
            padding: "8px 16px",
            borderRadius: "100px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "6px",
            textTransform: "uppercase"
          }}
        >
          <Power size={14} /> {isActive ? "Desativar" : "Ativar"}
        </button>
      </div>
    </div>
  );
}

function IntegrationModal({ onClose, onSave, editingItem }: { onClose: () => void, onSave: () => void, editingItem?: any }) {
  const [nome, setNome] = useState(editingItem?.nome || "");
  const [headScript, setHeadScript] = useState(editingItem?.head_script || "");
  const [bodyScript, setBodyScript] = useState(editingItem?.body_script || "");
  const [status, setStatus] = useState(editingItem?.status || "ativo");
  const [isSaving, setIsSaving] = useState(false);
  const selectedSiteId = process.env.NEXT_PUBLIC_SITE_ID;

  const handleSave = async () => {
    if (!nome) return alert("Por favor, dê um nome para a integração.");
    if (!selectedSiteId) return alert("Site não selecionado.");
    
    const client = supabase;
    if (!client) {
      console.error("Database client not initialized");
      return;
    }

    setIsSaving(true);
    try {
      const { data: { user } } = await client.auth.getUser();
      if (!user) throw new Error("Não autenticado");

      const payload = {
        user_id: user.id,
        nome,
        head_script: headScript,
        body_script: bodyScript,
        status,
        updated_at: new Date().toISOString(),
      };

      if (editingItem) {
        const { error } = await client
          .from("site_dm_advogados_integracoes")
          .update(payload)
          .eq("id", editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await client
          .from("site_dm_advogados_integracoes")
          .insert([payload]);
        if (error) throw error;
      }

      onSave();
      onClose();
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao salvar integração.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(15, 23, 42, 0.7)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        background: "#f8fafc",
        width: "100%",
        maxWidth: "960px",
        borderRadius: "16px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
      }}>
        {/* Modal Header */}
        <div style={{
          background: "#0f172a",
          padding: "32px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          position: "relative"
        }}>
          <button 
            onClick={onClose}
            style={{ position: "absolute", top: "24px", right: "24px", background: "none", border: "none", color: "#475569", cursor: "pointer" }}
          >
            <X size={24} />
          </button>

          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TerminalSquare size={32} color="#94a3b8" />
            </div>
            <div>
              <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#ffffff", margin: 0, letterSpacing: "-0.5px" }}>
                {editingItem ? "Editar Ferramenta" : "Conectar Nova Ferramenta"}
              </h2>
              <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "8px", fontWeight: 700, letterSpacing: "1px", display: "flex", alignItems: "center", gap: "8px" }}>
                CONSOLE DE CÓDIGO <span style={{ color: "#475569" }}>&gt;</span> EXTERNAL SCRIPTS
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              style={{
                background: "#3b82f6",
                border: "none",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                opacity: isSaving ? 0.7 : 1
              }}
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Salvar
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "40px", display: "flex", flexDirection: "column", gap: "32px", background: "#ffffff" }}>
          
          <div style={{ background: "#ffffff", padding: "24px", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#94a3b8", marginBottom: "16px", letterSpacing: "1px" }}>
              NOME DE IDENTIFICAÇÃO (EX: PIXEL FACEBOOK, GOOGLE ADS)
            </label>
            <input 
              type="text" 
              placeholder="Digite o nome desta integração..."
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={{
                width: "100%",
                padding: "18px 24px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                background: "#f8fafc",
                fontSize: "15px",
                color: "#0f172a",
                fontWeight: 500,
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "24px" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", alignItems: "center" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", letterSpacing: "1px" }}>
                  BLOCO &lt;HEAD&gt;
                </label>
                <span style={{ fontSize: "12px", color: "#3b82f6", fontWeight: 600 }}>Recomendado p/ Pixels</span>
              </div>
              <div style={{ position: "relative" }}>
                <textarea 
                  placeholder="<script>...codigo...</script>"
                  value={headScript}
                  onChange={(e) => setHeadScript(e.target.value)}
                  style={{
                    width: "100%",
                    height: "280px",
                    padding: "24px",
                    borderRadius: "16px",
                    border: "none",
                    background: "#0f172a",
                    fontSize: "14px",
                    fontFamily: "monospace",
                    color: "#e2e8f0",
                    resize: "none",
                    outline: "none",
                    boxSizing: "border-box",
                    lineHeight: 1.6
                  }}
                />
                <div style={{ position: "absolute", bottom: "24px", right: "24px", fontSize: "56px", fontWeight: 900, color: "rgba(255,255,255,0.02)", pointerEvents: "none" }}>HEAD</div>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", alignItems: "center" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", letterSpacing: "1px" }}>
                  BLOCO &lt;BODY&gt;
                </label>
                <span style={{ fontSize: "12px", color: "#3b82f6", fontWeight: 600 }}>Recomendado p/ Widgets</span>
              </div>
              <div style={{ position: "relative" }}>
                <textarea 
                  placeholder="<!-- Insira o código aqui -->"
                  value={bodyScript}
                  onChange={(e) => setBodyScript(e.target.value)}
                  style={{
                    width: "100%",
                    height: "280px",
                    padding: "24px",
                    borderRadius: "16px",
                    border: "none",
                    background: "#0f172a",
                    fontSize: "14px",
                    fontFamily: "monospace",
                    color: "#e2e8f0",
                    resize: "none",
                    outline: "none",
                    boxSizing: "border-box",
                    lineHeight: 1.6
                  }}
                />
                <div style={{ position: "absolute", bottom: "24px", right: "24px", fontSize: "56px", fontWeight: 900, color: "rgba(255,255,255,0.02)", pointerEvents: "none" }}>BODY</div>
              </div>
            </div>
          </div>

          <div style={{ 
            background: "#ffffff", 
            border: "1px solid #e2e8f0", 
            borderRadius: "16px", 
            padding: "24px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: status === "ativo" ? "#dcfce7" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Power size={24} color={status === "ativo" ? "#10b981" : "#94a3b8"} />
              </div>
              <div>
                <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Estado da Integração</h4>
                <p style={{ fontSize: "14px", color: "#64748b", margin: 0, marginTop: "4px", fontWeight: 500 }}>Ative ou pause a execução deste código no site.</p>
              </div>
            </div>
            
            <div 
              onClick={() => setStatus(status === "ativo" ? "inativo" : "ativo")}
              style={{
                width: "56px",
                height: "32px",
                borderRadius: "100px",
                background: status === "ativo" ? "#3b82f6" : "#cbd5e1",
                position: "relative",
                cursor: "pointer",
                transition: "background 0.3s"
              }}
            >
              <div style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: "#ffffff",
                position: "absolute",
                top: "4px",
                left: status === "ativo" ? "28px" : "4px",
                transition: "left 0.3s",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
