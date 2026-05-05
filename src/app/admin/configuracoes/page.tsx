"use client";

import {
  Save,
  Globe,
  Mail,
  Lock,
  Shield,
  Settings as SettingsIcon,
  Bell,
  Palette,
  CheckCircle2,
  Image as ImageIcon
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

// Social Icons components for Lucide v1 compatibility
const Facebook = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const Instagram = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const Linkedin = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

const Youtube = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.42 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.42-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
);

const tabs = [
  { id: "Geral", icon: Globe, desc: "Informações básicas" },
  { id: "SEO", icon: Shield, desc: "Otimização de busca" },
  { id: "Segurança", icon: Lock, desc: "Acesso e conta" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Geral");
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);

  // Form States
  const [settings, setSettings] = useState({
    id: null,
    site_name: "Dohmen & Matta Advogados Associados",
    site_description: "Especialistas em Direito da Saúde e Erro Médico",
    contact_email: "contato@dmatta.com.br",
    contact_phone: "(11) 98779-5023",
    address: "Av. Paulista, 1439 - 1º Andar, São Paulo - SP",
    seo_title: "Dohmen & Matta Advogados Associados | Direito da Saúde e Erro Médico",
    seo_description: "Escritório especializado em direito da saúde e erro médico, atuando com excelência na defesa dos direitos dos pacientes e profissionais da saúde.",
    seo_keywords: "advogado saúde, erro médico, direito da saúde, lucas dohmen, alexandre matta, DMA advogados",
    google_verify_id: "",
    two_factor_enabled: false,
    favicon_url: "",
    facebook_url: "https://www.facebook.com/Dohmenematta/",
    instagram_url: "https://www.instagram.com/dohmenematta/",
    linkedin_url: "https://br.linkedin.com/company/dohmen-matta-advogados",
    youtube_url: ""
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      let query = supabase.from("site_dm_advogados_configuracoes").select("*");
      
      if (user) {
        query = query.eq("user_id", user.id);
      }
      
      const { data, error } = await query.limit(1).maybeSingle();

      if (data) {
        setSettings(data);
      }
    } catch (err) {
      console.error("Erro ao carregar configurações:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const saveData: any = {
        ...settings,
        updated_at: new Date().toISOString()
      };

      if (user) {
        saveData.user_id = user.id;
      }

      const { error } = await supabase
        .from("site_dm_advogados_configuracoes")
        .upsert(saveData);

      if (error) throw error;
      
      setTimeout(() => setIsSaving(false), 2000);
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao salvar as configurações.");
      setIsSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingFavicon(true);
    try {
      // Garantir que o bucket exista ou apenas tentar o upload
      const fileExt = file.name.split('.').pop();
      const fileName = `favicon-${Date.now()}.${fileExt}`;
      const filePath = `branding/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site_dm_advogados')
        .upload(filePath, file);

      if (uploadError) {
        // Se o erro for que o bucket não existe, poderíamos tentar criar, 
        // mas em produção o bucket já deve estar configurado.
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('site_dm_advogados')
        .getPublicUrl(filePath);

      updateField("favicon_url", publicUrl);
    } catch (err) {
      console.error("Erro no upload do favicon:", err);
      alert("Erro ao fazer upload do favicon. Verifique se o bucket 'site_dm_advogados' existe no Supabase.");
    } finally {
      setIsUploadingFavicon(false);
    }
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", paddingBottom: "40px" }}>
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
          <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#0B1E2D", margin: 0, letterSpacing: "-0.02em" }}>
            Configurações
          </h1>
          <p style={{ fontSize: "15px", color: "#64748b", marginTop: "6px", fontWeight: 500 }}>
            Gerencie as preferências globais do seu escritório e as configurações do site.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{
            padding: "12px 28px",
            background: isSaving ? "#22c55e" : "#0B1E2D",
            color: "#ffffff",
            border: "none",
            borderRadius: "14px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 10px 25px -5px rgba(11,30,45,0.2)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {isSaving ? (
            <>
              <CheckCircle2 size={18} /> Salvo com Sucesso
            </>
          ) : (
            <>
              <Save size={18} /> Salvar Alterações
            </>
          )}
        </button>
      </div>

      <div style={{ display: "flex", gap: "40px" }}>
        {/* ── Tabs Sidebar ── */}
        <div style={{ width: "280px", flexShrink: 0 }}>
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              padding: "12px",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "14px 16px",
                    borderRadius: "16px",
                    border: "none",
                    background: isActive ? "#0B1E2D" : "transparent",
                    color: isActive ? "#ffffff" : "#64748b",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "#f8fafc";
                      e.currentTarget.style.color = "#0B1E2D";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#64748b";
                    }
                  }}
                >
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "10px",
                    background: isActive ? "rgba(255,255,255,0.1)" : "#f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isActive ? "#ffffff" : "#64748b",
                  }}>
                    <tab.icon size={18} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span>{tab.id}</span>
                    <span style={{ fontSize: "11px", fontWeight: 500, opacity: isActive ? 0.7 : 1, color: isActive ? "#fff" : "#94a3b8" }}>
                      {tab.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{
            marginTop: "24px",
            padding: "20px",
            background: "linear-gradient(135deg, #0B1E2D 0%, #1c4b70 100%)",
            borderRadius: "24px",
            color: "#ffffff",
            position: "relative",
            overflow: "hidden"
          }}>
            <Bell size={48} style={{ position: "absolute", right: "-10px", top: "-10px", opacity: 0.1, transform: "rotate(15deg)" }} />
            <h4 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "8px" }}>Central de Ajuda</h4>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", lineHeight: "1.5", marginBottom: "16px" }}>
              Precisa de ajuda com alguma configuração? Nossa equipe está disponível.
            </p>
            <button style={{
              width: "100%",
              padding: "10px",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "12px",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer"
            }}>
              Falar com Suporte
            </button>
          </div>
        </div>

        {/* ── Content Area ── */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              padding: "40px",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
              <div style={{ width: "8px", height: "24px", background: "#c5a059", borderRadius: "4px" }} />
              <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#0B1E2D", margin: 0 }}>
                {activeTab}
              </h3>
            </div>

            {activeTab === "Geral" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <Field 
                    label="Nome Fantasia do Escritório" 
                    placeholder="Dohmen & Matta Advogados Associados" 
                    value={settings.site_name}
                    onChange={(v: string) => updateField("site_name", v)}
                  />
                  <Field 
                    label="Descrição Curta" 
                    placeholder="Escritório especializado em Erro Médico" 
                    value={settings.site_description}
                    onChange={(v: string) => updateField("site_description", v)}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "20px" }}>
                  <Field 
                    label="E-mail de Contato Principal" 
                    placeholder="contato@dmatta.com.br" 
                    value={settings.contact_email}
                    onChange={(v: string) => updateField("contact_email", v)}
                  />
                  <Field 
                    label="WhatsApp / Telefone" 
                    placeholder="(11) 99999-9999" 
                    value={settings.contact_phone}
                    onChange={(v: string) => updateField("contact_phone", v)}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
                  <Field 
                    label="Endereço Completo" 
                    placeholder="Av. Paulista, 1000 - Sala 12, São Paulo - SP" 
                    value={settings.address}
                    onChange={(v: string) => updateField("address", v)}
                  />
                </div>

                <div style={{ borderTop: "1px solid #f1f5f9", marginTop: "12px", paddingTop: "24px" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#0B1E2D", marginBottom: "20px" }}>Redes Sociais</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <Field 
                      label="Instagram" 
                      placeholder="https://instagram.com/seu-perfil" 
                      value={settings.instagram_url}
                      onChange={(v: string) => updateField("instagram_url", v)}
                      icon={Instagram}
                    />
                    <Field 
                      label="LinkedIn" 
                      placeholder="https://linkedin.com/company/sua-empresa" 
                      value={settings.linkedin_url}
                      onChange={(v: string) => updateField("linkedin_url", v)}
                      icon={Linkedin}
                    />
                    <Field 
                      label="Facebook" 
                      placeholder="https://facebook.com/sua-pagina" 
                      value={settings.facebook_url}
                      onChange={(v: string) => updateField("facebook_url", v)}
                      icon={Facebook}
                    />
                    <Field 
                      label="YouTube" 
                      placeholder="https://youtube.com/@seu-canal" 
                      value={settings.youtube_url}
                      onChange={(v: string) => updateField("youtube_url", v)}
                      icon={Youtube}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "SEO" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                {/* ── Favicon Card ── */}
                <div style={{
                  background: "#f8fafc",
                  border: "1px dashed #cbd5e1",
                  borderRadius: "24px",
                  padding: "32px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: "20px"
                }}>
                  <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#0B1E2D", alignSelf: "flex-start", margin: 0 }}>Ícone do Navegador</h4>
                  
                  <div style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "24px",
                    background: "#ffffff",
                    border: "1px solid rgba(0,0,0,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.05)"
                  }}>
                    {settings.favicon_url ? (
                      <img src={settings.favicon_url} alt="Favicon Preview" style={{ width: "64px", height: "64px", objectFit: "contain" }} />
                    ) : (
                      <div style={{ color: "#94a3b8", fontSize: "12px", fontWeight: 500 }}>Sem ícone</div>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <input 
                      type="file" 
                      id="favicon-upload" 
                      accept=".png,.ico,.jpg,.jpeg" 
                      style={{ display: "none" }} 
                      onChange={handleFaviconUpload}
                    />
                    <label 
                      htmlFor="favicon-upload"
                      style={{
                        padding: "12px 24px",
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        color: "#0B1E2D",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                    >
                      {isUploadingFavicon ? "ENVIANDO..." : "ALTERAR FAVICON"}
                    </label>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <Field 
                    label="Título SEO (Meta Title)" 
                    placeholder="Título que aparece no Google" 
                    value={settings.seo_title}
                    onChange={(v: string) => updateField("seo_title", v)}
                    icon={Globe}
                  />
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <label style={{ fontSize: "14px", fontWeight: 700, color: "#475569" }}>Descrição SEO (Meta Description)</label>
                    <textarea
                      placeholder="Breve resumo para os resultados de busca..."
                      value={settings.seo_description}
                      onChange={(e) => updateField("seo_description", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "16px",
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "16px",
                        fontSize: "14px",
                        minHeight: "120px",
                        outline: "none",
                        fontFamily: "inherit",
                        fontWeight: 600,
                        color: "#0B1E2D",
                        lineHeight: "1.6",
                        transition: "all 0.2s ease",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#0B1E2D")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <Field 
                      label="Palavras-chave" 
                      placeholder="advogado, saúde, erro médico" 
                      value={settings.seo_keywords}
                      onChange={(v: string) => updateField("seo_keywords", v)}
                      icon={Shield}
                    />
                    <Field 
                      label="ID de Verificação do Google" 
                      placeholder="google-site-verification=..." 
                      value={settings.google_verify_id}
                      onChange={(v: string) => updateField("google_verify_id", v)}
                      icon={Lock}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Segurança" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                <div style={{ 
                  padding: "24px", 
                  background: "#fff1f2", 
                  border: "1px solid #ffe4e6", 
                  borderRadius: "20px",
                  display: "flex",
                  gap: "20px",
                  alignItems: "center"
                }}>
                  <div style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    background: "#ef4444",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    boxShadow: "0 8px 16px rgba(239, 68, 68, 0.2)"
                  }}>
                    <Lock size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p style={{ fontSize: "16px", fontWeight: 700, color: "#991b1b", margin: 0 }}>Segurança da Conta</p>
                    <p style={{ fontSize: "13px", color: "#b91c1c", marginTop: "4px", fontWeight: 500 }}>
                      Mantenha suas credenciais seguras. A troca de senha encerra todas as sessões ativas.
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <Field label="Senha Atual do Administrador" type="password" placeholder="••••••••" />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <Field label="Nova Senha" type="password" placeholder="••••••••" />
                    <Field label="Confirmar Nova Senha" type="password" placeholder="••••••••" />
                  </div>
                </div>
                
                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "24px" }}>
                  <button style={{
                    background: "transparent",
                    border: "1px solid #e2e8f0",
                    padding: "12px 20px",
                    borderRadius: "12px",
                    color: "#ef4444",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#fff1f2"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    Ativar Autenticação em Dois Fatores (2FA)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, placeholder, type = "text", value, onChange, icon: Icon, style = {} }: any) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", ...style }}>
      <label style={{ fontSize: "14px", fontWeight: 700, color: "#475569" }}>{label}</label>
      <div style={{ position: "relative" }}>
        {Icon && (
          <div style={{
            position: "absolute",
            left: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#94a3b8",
            display: "flex",
            alignItems: "center"
          }}>
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value || ""}
          onChange={(e) => onChange && onChange(e.target.value)}
          style={{
            width: "100%",
            padding: "16px",
            paddingLeft: Icon ? "48px" : "16px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            fontSize: "14px",
            outline: "none",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            fontWeight: 600,
            color: "#0B1E2D",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#0B1E2D";
            e.currentTarget.style.background = "#ffffff";
            e.currentTarget.style.boxShadow = "0 8px 24px -10px rgba(11,30,45,0.15)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.background = "#f8fafc";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </div>
    </div>
  );
}
