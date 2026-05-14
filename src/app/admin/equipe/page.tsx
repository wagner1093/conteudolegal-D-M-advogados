"use client";

import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  User,
  Loader2,
  X,
  ImageIcon,
  Save
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function EquipePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    nome: '',
    cargo: '',
    imagem_url: '',
    ordem: 0
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("site_dm_advogados_equipe")
        .select("*")
        .order("ordem", { ascending: true })
        .order("nome", { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch (err) {
      console.error("Erro ao buscar equipe:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (member?: any) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        nome: member.nome,
        cargo: member.cargo,
        imagem_url: member.imagem_url || '',
        ordem: member.ordem || 0
      });
    } else {
      setEditingMember(null);
      setFormData({
        nome: '',
        cargo: '',
        imagem_url: '',
        ordem: members.length + 1
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.cargo) return alert("Preencha nome e cargo.");
    
    try {
      setSaving(true);
      if (editingMember) {
        const { error } = await supabase
          .from("site_dm_advogados_equipe")
          .update(formData)
          .eq("id", editingMember.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("site_dm_advogados_equipe")
          .insert([formData]);
        if (error) throw error;
      }
      handleCloseModal();
      fetchMembers();
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao salvar o membro da equipe.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este membro?")) return;
    try {
      const { error } = await supabase
        .from("site_dm_advogados_equipe")
        .delete()
        .eq("id", id);
      if (error) throw error;
      fetchMembers();
    } catch (err) {
      console.error("Erro ao deletar:", err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `equipe/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-media') // Using the site-media bucket
        .upload(filePath, file);

      if (uploadError) {
        // Fallback to blog_covers if site-media fails/doesn't exist
        const { error: fallbackError } = await supabase.storage
          .from('blog_covers')
          .upload(filePath, file);
          
        if (fallbackError) throw fallbackError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('blog_covers')
          .getPublicUrl(filePath);
          
        setFormData(prev => ({ ...prev, imagem_url: publicUrl }));
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('site-media')
          .getPublicUrl(filePath);

        setFormData(prev => ({ ...prev, imagem_url: publicUrl }));
      }
    } catch (err: any) {
      console.error('Erro no upload:', err);
      alert('Erro ao fazer upload da imagem.');
    } finally {
      setUploading(false);
    }
  };

  const filteredMembers = members.filter(member => 
    member.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.cargo?.toLowerCase().includes(searchTerm.toLowerCase())
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
            Corpo Jurídico
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", marginTop: "4px", fontWeight: 400 }}>
            Gerencie os advogados e membros da equipe exibidos no site.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
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
          <Plus size={20} strokeWidth={2.5} /> Novo Membro
        </button>
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
            placeholder="Buscar por nome ou cargo..."
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
          />
        </div>
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
                <th style={tableHeaderStyle}>Membro</th>
                <th style={tableHeaderStyle}>Cargo</th>
                <th style={tableHeaderStyle}>Ordem</th>
                <th style={{ ...tableHeaderStyle, textAlign: "right" }}>Gerenciar</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ padding: "100px", textAlign: "center" }}>
                    <Loader2 size={32} className="animate-spin" color="#1e293b" />
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: "80px", textAlign: "center" }}>
                    <p style={{ fontSize: "15px", color: "#64748b", fontWeight: 500 }}>Nenhum membro encontrado.</p>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    style={{
                      borderBottom: "1px solid #f8fafc",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fcfdfe")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                        <img
                          src={member.imagem_url || "https://images.unsplash.com/photo-1505751172107-573225a912b7?w=400&h=400&fit=crop"}
                          alt=""
                          style={{ width: "48px", height: "48px", borderRadius: "10px", objectFit: "cover", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                        />
                        <div style={{ fontWeight: 600, color: "#1e293b", fontSize: "15px" }}>
                          {member.nome}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 24px", color: "#475569", fontWeight: 500, fontSize: "14px" }}>
                      {member.cargo}
                    </td>
                    <td style={{ padding: "16px 24px", color: "#64748b", fontWeight: 600, fontSize: "14px" }}>
                      {member.ordem}
                    </td>
                    <td style={{ padding: "16px 24px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                        <ActionButton icon={Edit} color="#6366f1" title="Editar" onClick={() => handleOpenModal(member)} />
                        <ActionButton icon={Trash2} color="#ef4444" title="Excluir" onClick={() => handleDelete(member.id)} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            width: '100%',
            maxWidth: '500px',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                {editingMember ? 'Editar Membro' : 'Adicionar Membro'}
              </h2>
              <button 
                onClick={handleCloseModal}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                  Foto
                </label>
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      width: '200px',
                      height: '250px',
                      borderRadius: '16px',
                      border: '2px dashed #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      position: 'relative',
                      background: formData.imagem_url ? `url(${formData.imagem_url}) center/cover` : '#f8fafc',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#94a3b8'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  >
                    {uploading ? (
                      <Loader2 size={24} className="animate-spin" />
                    ) : !formData.imagem_url ? (
                      <>
                        <ImageIcon size={24} style={{ marginBottom: '8px' }} />
                        <span style={{ fontSize: '12px', fontWeight: 600 }}>Upload de Foto</span>
                      </>
                    ) : (
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        background: 'rgba(30, 41, 59, 0.7)', color: '#fff',
                        padding: '10px', fontSize: '12px', textAlign: 'center', fontWeight: 600
                      }}>
                        Alterar Foto
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                  Nome
                </label>
                <input 
                  type="text"
                  required
                  value={formData.nome}
                  onChange={e => setFormData({...formData, nome: e.target.value})}
                  style={inputStyle}
                  placeholder="Nome completo"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                    Cargo
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.cargo}
                    onChange={e => setFormData({...formData, cargo: e.target.value})}
                    style={inputStyle}
                    placeholder="Ex: Advogado"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                    Ordem
                  </label>
                  <input 
                    type="number"
                    value={formData.ordem}
                    onChange={e => setFormData({...formData, ordem: parseInt(e.target.value) || 0})}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#f1f5f9',
                    color: '#475569',
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#1e293b',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    cursor: (saving || uploading) ? 'not-allowed' : 'pointer',
                    opacity: (saving || uploading) ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "10px",
  border: "1px solid #e2e8f0",
  fontSize: "14px",
  color: "#1e293b",
  outline: "none",
  background: "#f8fafc",
};

function ActionButton({ icon: Icon, color, title, onClick }: { icon: any; color: string; title: string; onClick?: () => void }) {
  return (
    <button
      title={title}
      onClick={onClick}
      type="button"
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "10px",
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
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "#64748b";
        e.currentTarget.style.borderColor = "#e2e8f0";
        e.currentTarget.style.background = "#ffffff";
      }}
    >
      <Icon size={16} strokeWidth={2} />
    </button>
  );
}
