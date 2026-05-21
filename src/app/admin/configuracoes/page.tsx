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
  Plus,
  Trash2,
  Edit2,
  User,
  ShieldAlert,
  Image as ImageIcon
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { validateFileSignature, logAudit } from "@/lib/security";

// import { useSite } from "@/context/SiteContext";

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

const allTabs = [
  { id: "Geral", icon: Globe, desc: "Informações básicas" },
  { id: "SEO", icon: Shield, desc: "Otimização de busca" },
  { id: "Usuários", icon: Shield, desc: "Gestão de equipe", adminOnly: true },
  { id: "Segurança", icon: Lock, desc: "Acesso e conta" },
];

export default function SettingsPage() {
  // const { selectedSiteId } = useSite();
  const [activeTab, setActiveTab] = useState("Geral");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string>("suporte");
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({ nome: "", email: "", funcao: "suporte", senha: "" });
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

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
    fetchTeamMembers();
  }, []);

  const fetchSettings = async () => {
    const client = supabase;
    if (!client) return;
    try {
      const { data: { user } } = await client.auth.getUser();
      
      if (user) {
        setIsAdmin(true);
        setCurrentUserEmail(user.email || "");

        // Buscar o role real do usuário na tabela
        const { data: profile } = await client
          .from("site_dm_advogados_usuarios")
          .select("funcao")
          .eq("email", user.email || "")
          .maybeSingle();

        if (profile?.funcao) {
          setCurrentUserRole(profile.funcao);
        }
      }
      
      const { data, error } = await client
        .from("site_dm_advogados_configuracoes")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (data) {
        setSettings({
          id: data.id,
          site_name: data.site_name || "",
          site_description: data.site_description || "",
          contact_email: data.contact_email || "",
          contact_phone: data.contact_phone || "",
          address: data.address || "",
          seo_title: data.seo_title || "",
          seo_description: data.seo_description || "",
          seo_keywords: data.seo_keywords || "",
          google_verify_id: data.google_verify_id || "",
          two_factor_enabled: data.two_factor_enabled || false,
          favicon_url: data.favicon_url || "",
          facebook_url: data.facebook_url || "",
          instagram_url: data.instagram_url || "",
          linkedin_url: data.linkedin_url || "",
          youtube_url: data.youtube_url || ""
        });
      }
    } catch (err) {
      console.error("Erro ao carregar configurações:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    const client = supabase;
    if (!client) return;
    try {
      const { data, error } = await client
        .from("site_dm_advogados_usuarios")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (data) {
        setTeamMembers(data);
      }
      if (error) throw error;
    } catch (err) {
      console.error("Erro ao buscar membros:", err);
    }
  };

  const handleAddUser = async () => {
    const client = supabase;
    if (!client) return;
    
    if (!newUser.nome || !newUser.email || !newUser.senha) {
      alert("Erro: Preencha Nome, E-mail e Senha.");
      return;
    }

    if (newUser.senha.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      // 1. Verificar se e-mail já existe na tabela
      const { data: existing } = await client
        .from("site_dm_advogados_usuarios")
        .select("id")
        .eq("email", newUser.email)
        .maybeSingle();

      if (existing) {
        alert("Este e-mail já está cadastrado no sistema.");
        return;
      }

      // 2. Criar conta de acesso no Supabase Auth
      const { createClient } = await import('@supabase/supabase-js');
      const tempClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { persistSession: false } }
      );

      let authUserId: string | null = null;

      const { data: authData, error: authError } = await tempClient.auth.signUp({
        email: newUser.email,
        password: newUser.senha,
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          // Conta já existe no Auth - tudo bem, vamos só registrar na tabela
          authUserId = null;
        } else {
          throw new Error(`Erro ao criar acesso: ${authError.message}`);
        }
      } else {
        authUserId = authData?.user?.id || null;
      }

      // 3. Registrar na Tabela (fonte da verdade do sistema)
      const insertData: any = {
        nome: newUser.nome,
        email: newUser.email,
        funcao: newUser.funcao,
        status: "ativo"
      };

      if (authUserId) {
        insertData.auth_id = authUserId;
        insertData.user_id = authUserId; // Garante compatibilidade com políticas de RLS que usam user_id
      }

      const { error: dbError } = await client
        .from("site_dm_advogados_usuarios")
        .insert([insertData])
        .select();

      if (dbError) {
        throw new Error(`Erro ao salvar usuário: ${dbError.message}`);
      }
      
      alert(`Usuário "${newUser.nome}" adicionado!\n\nEle já pode acessar o sistema com o e-mail e senha definidos.`);
      setShowAddUserModal(false);
      setNewUser({ nome: "", email: "", funcao: "suporte", senha: "" });
      fetchTeamMembers();
    } catch (err: any) {
      console.error("Erro completo:", err);
      alert(err.message);
    }
  };

  // Verifica se o usuário logado pode deletar o usuário alvo
  const canDelete = (targetUser: any): boolean => {
    const targetEmail = (targetUser.email || "").toLowerCase();
    const targetRole = targetUser.funcao || "suporte";

    // Ninguém deleta o super admin (Wagner)
    if (targetEmail === "wagner.1093@gmail.com") return false;
    if (targetRole === "super_admin") return false;

    // super_admin pode deletar qualquer um
    if (currentUserRole === "super_admin") return true;

    // admin pode deletar apenas editor e suporte
    if (currentUserRole === "admin") {
      return targetRole === "editor" || targetRole === "suporte";
    }

    // editor e suporte não podem deletar ninguém
    return false;
  };

  const handleDeleteUser = async (id: string) => {
    const userToDelete = teamMembers.find(u => u.id === id);
    if (!userToDelete) return;

    // Verificar permissão antes de qualquer coisa
    if (!canDelete(userToDelete)) {
      const targetRole = userToDelete.funcao || "suporte";
      if (targetRole === "super_admin" || userToDelete.email === "wagner.1093@gmail.com") {
        alert("O Super Administrador não pode ser removido.");
      } else if (targetRole === "admin") {
        alert("Você não tem permissão para remover um Administrador. Apenas o Super Admin pode fazer isso.");
      } else {
        alert("Você não tem permissão para remover este usuário.");
      }
      return;
    }

    if (!confirm(`Tem certeza que deseja remover o usuário ${userToDelete.email}?`)) return;
    
    const client = supabase;
    if (!client) return;
    try {
      const { data, error } = await client
        .from("site_dm_advogados_usuarios")
        .delete()
        .eq("id", id)
        .select();
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        alert("Erro: Não foi possível excluir o usuário. Verifique se ele ainda existe.");
        return;
      }
      
      fetchTeamMembers();
      alert("Usuário removido com sucesso!");
    } catch (err: any) {
      console.error("Erro ao excluir usuário:", err);
      alert("Erro ao excluir usuário: " + err.message);
    }
  };

  // Verifica se o usuário logado pode editar o usuário alvo
  const canEdit = (targetUser: any): boolean => {
    const targetEmail = (targetUser.email || "").toLowerCase();
    const targetRole = targetUser.funcao || "suporte";

    // Ninguém edita o super_admin (Wagner)
    if (targetEmail === "wagner.1093@gmail.com") return false;
    if (targetRole === "super_admin") return false;

    // super_admin pode editar qualquer um
    if (currentUserRole === "super_admin") return true;

    // admin pode editar apenas editor e suporte
    if (currentUserRole === "admin") {
      return targetRole === "editor" || targetRole === "suporte";
    }

    // editor e suporte não podem editar ninguém
    return false;
  };

  const handleEditUser = (user: any) => {
    if (!canEdit(user)) {
      const targetRole = user.funcao || "suporte";
      if (targetRole === "super_admin" || user.email === "wagner.1093@gmail.com") {
        alert("O Super Administrador não pode ser editado.");
      } else if (targetRole === "admin") {
        alert("Você não tem permissão para editar um Administrador. Apenas o Super Admin pode fazer isso.");
      } else {
        alert("Você não tem permissão para editar este usuário.");
      }
      return;
    }
    setEditingUser({ ...user });
    setShowEditUserModal(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    const client = supabase;
    if (!client) return;

    try {
      const { data, error } = await client
        .from("site_dm_advogados_usuarios")
        .update({
          nome: editingUser.nome,
          funcao: editingUser.funcao
        })
        .eq("id", editingUser.id)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        alert("Erro: Não foi possível atualizar os dados.");
        return;
      }

      alert("Usuário atualizado com sucesso!");
      setShowEditUserModal(false);
      setEditingUser(null);
      fetchTeamMembers();
    } catch (err: any) {
      console.error("Erro ao atualizar usuário:", err);
      alert("Erro ao atualizar usuário: " + (err.message || "Erro desconhecido"));
    }
  };

  const handleSave = async () => {
    const client = supabase;
    if (!client) {
      alert("Erro: Cliente Supabase não encontrado.");
      return;
    }
    
    setIsSaving(true);
    setShowSuccess(false);
    
    try {
      const configData = {
        site_name: settings.site_name,
        site_description: settings.site_description,
        contact_email: settings.contact_email,
        contact_phone: settings.contact_phone,
        address: settings.address,
        seo_title: settings.seo_title,
        seo_description: settings.seo_description,
        seo_keywords: settings.seo_keywords,
        google_verify_id: settings.google_verify_id,
        two_factor_enabled: settings.two_factor_enabled,
        favicon_url: settings.favicon_url,
        facebook_url: settings.facebook_url,
        instagram_url: settings.instagram_url,
        linkedin_url: settings.linkedin_url,
        youtube_url: settings.youtube_url,
        updated_at: new Date().toISOString()
      };

      const { data: existingConfig } = await client
        .from("site_dm_advogados_configuracoes")
        .select("id")
        .limit(1)
        .maybeSingle();

      let configError;
      if (existingConfig) {
        const { error } = await client
          .from("site_dm_advogados_configuracoes")
          .update(configData)
          .eq("id", existingConfig.id);
        configError = error;
      } else {
        const { error } = await client
          .from("site_dm_advogados_configuracoes")
          .insert([configData]);
        configError = error;
      }
      
      if (configError) throw configError;
      
      await logAudit("SETTINGS_UPDATE", "site_config", "legacy", configData);
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (err: any) {
      console.error("Erro ao salvar:", err);
      alert(`Erro ao salvar: ${err.message}`);
      await logAudit("SETTINGS_UPDATE_ERROR", "site_config", "legacy", null, { error: err.message });
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwords.new || !passwords.confirm) {
      alert("Por favor, preencha a nova senha e a confirmação.");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      alert("A nova senha e a confirmação não coincidem.");
      return;
    }

    if (passwords.new.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const client = supabase;
      if (!client) throw new Error("Cliente de banco de dados não inicializado");

      const { error } = await client.auth.updateUser({
        password: passwords.new
      });

      if (error) throw error;

      await logAudit("PASSWORD_CHANGE_SUCCESS", "user");
      alert("Senha atualizada com sucesso!");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err: any) {
      console.error("Erro ao atualizar senha:", err);
      alert(`Erro ao atualizar senha: ${err.message}`);
      await logAudit("PASSWORD_CHANGE_ERROR", "user", undefined, null, { error: err.message });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Upload Hardening: Magic Byte Validation
    const isValid = await validateFileSignature(file);
    if (!isValid) {
      alert("Arquivo inválido. Por favor, envie uma imagem real (PNG, ICO, JPG ou SVG).");
      await logAudit("UPLOAD_REJECTED", "storage", file.name, null, { reason: "invalid_signature", type: file.type });
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      alert("O arquivo é muito grande. O limite é 1MB.");
      return;
    }

    const client = supabase;
    if (!client) return;

    setIsUploadingFavicon(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `favicon-${Date.now()}.${fileExt}`;
      const filePath = `branding/${fileName}`;

      const { error: uploadError } = await client.storage
        .from('site_dm_advogados')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const { data } = client.storage.from('site_dm_advogados').getPublicUrl(filePath);
      if (data?.publicUrl) {
        // Atualiza state local
        updateField("favicon_url", data.publicUrl);

        // Auto-salva favicon_url direto no banco sem precisar clicar em "Salvar"
        const { data: existingConfig } = await client
          .from("site_dm_advogados_configuracoes")
          .select("id")
          .limit(1)
          .maybeSingle();

        if (existingConfig) {
          await client
            .from("site_dm_advogados_configuracoes")
            .update({ favicon_url: data.publicUrl, updated_at: new Date().toISOString() })
            .eq("id", existingConfig.id);
        } else {
          await client
            .from("site_dm_advogados_configuracoes")
            .insert([{ favicon_url: data.publicUrl }]);
        }

        // Exibe toast de sucesso
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 4000);

        await logAudit("UPLOAD_SUCCESS", "storage", filePath, null, { bucket: "site_dm_advogados", type: "favicon" });
      }
    } catch (err: any) {
      alert(`Erro ao fazer upload: ${err.message}`);
      await logAudit("UPLOAD_ERROR", "storage", file.name, null, { error: err.message, type: "favicon" });
    } finally {
      setIsUploadingFavicon(false);
    }
  };

  const activeTabs = allTabs.filter(tab => !tab.adminOnly || isAdmin);

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
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1e293b", margin: 0, letterSpacing: "-0.02em" }}>
            Configurações
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", marginTop: "4px", fontWeight: 400 }}>
            Gerencie as preferências globais do seu escritório e as configurações do site.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving || showSuccess}
          style={{
            padding: "12px 28px",
            background: showSuccess ? "#22c55e" : (isSaving ? "#94a3b8" : "#1e293b"),
            color: "#ffffff",
            border: "none",
            borderRadius: "14px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: (isSaving || showSuccess) ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: showSuccess ? "0 10px 20px rgba(34,197,94,0.2)" : "0 10px 25px -5px rgba(11,30,45,0.2)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {showSuccess ? (
            <>
              <CheckCircle2 size={18} /> Salvo com Sucesso
            </>
          ) : isSaving ? (
            <>
              <div className="animate-spin" style={{ width: "16px", height: "16px", border: "2px solid #fff", borderTop: "2px solid transparent", borderRadius: "50%" }} />
              Salvando...
            </>
          ) : (
            <>
              <Save size={18} /> SALVAR ALTERAÇÕES
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
            {activeTabs.map((tab) => {
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
                    background: isActive ? "#1e293b" : "transparent",
                    color: isActive ? "#ffffff" : "#64748b",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "#f8fafc";
                      e.currentTarget.style.color = "#1e293b";
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
            background: "linear-gradient(135deg, #1e293b 0%, #1c4b70 100%)",
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
            <a 
              href="https://wa.me/5547992793347" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
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
            </a>
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
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px" }}>
              <div style={{ width: "4px", height: "18px", background: "#c5a059", borderRadius: "2px", opacity: 0.8 }} />
              <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#1e293b", margin: 0 }}>
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
                  <h4 style={{ fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "20px", textTransform: 'uppercase', letterSpacing: '0.05em' }}>Redes Sociais</h4>
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
                  <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", alignSelf: "flex-start", margin: 0 }}>Ícone do Navegador</h4>
                  
                  <div style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "24px",
                    background: "#ffffff",
                    border: "2px solid #e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                    position: "relative"
                  }}>
                    {isUploadingFavicon ? (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                        <div className="animate-spin" style={{ 
                          width: "24px", 
                          height: "24px", 
                          border: "3px solid #f3f3f3", 
                          borderTop: "3px solid #c5a059", 
                          borderRadius: "50%" 
                        }} />
                        <span style={{ fontSize: "10px", fontWeight: 700, color: "#c5a059" }}>ENVIANDO...</span>
                      </div>
                    ) : settings.favicon_url ? (
                      <img src={settings.favicon_url} alt="Favicon Preview" style={{ width: "64px", height: "64px", objectFit: "contain" }} />
                    ) : (
                      <div style={{ textAlign: "center", padding: "10px" }}>
                        <ImageIcon size={32} color="#94a3b8" style={{ marginBottom: "8px" }} />
                        <div style={{ color: "#94a3b8", fontSize: "10px", fontWeight: 700, textTransform: "uppercase" }}>Sem ícone</div>
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <input 
                      type="file" 
                      id="favicon-upload" 
                      accept=".png,.ico,.jpg,.jpeg,.svg" 
                      style={{ display: "none" }} 
                      onChange={handleFaviconUpload}
                      disabled={isUploadingFavicon}
                    />
                    <label 
                      htmlFor="favicon-upload"
                      style={{
                        padding: "12px 24px",
                        background: isUploadingFavicon ? "#f1f5f9" : "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        color: isUploadingFavicon ? "#94a3b8" : "#1e293b",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: isUploadingFavicon ? "not-allowed" : "pointer",
                        transition: "all 0.2s",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                      }}
                      onMouseEnter={(e) => {
                        if (!isUploadingFavicon) {
                          e.currentTarget.style.background = "#f8fafc";
                          e.currentTarget.style.borderColor = "#cbd5e1";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isUploadingFavicon) {
                          e.currentTarget.style.background = "#ffffff";
                          e.currentTarget.style.borderColor = "#e2e8f0";
                        }
                      }}
                    >
                      {isUploadingFavicon ? "AGUARDE..." : "ALTERAR FAVICON"}
                    </label>
                    <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                      Recomendado: PNG ou ICO (32x32px)
                    </p>
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
                        color: "#1e293b",
                        lineHeight: "1.6",
                        transition: "all 0.2s ease",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#1e293b")}
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

            {activeTab === "Usuários" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", margin: 0 }}>Membros da Equipe</h4>
                    <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>Gerencie quem tem acesso ao painel e seus níveis de permissão.</p>
                  </div>
                  <button 
                    onClick={() => setShowAddUserModal(true)}
                    style={{
                      padding: "10px 20px",
                      background: "#c5a059",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "12px",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      boxShadow: "0 4px 12px rgba(197, 160, 89, 0.2)"
                    }}
                  >
                    <Plus size={16} /> Adicionar Usuário
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {teamMembers.length === 0 ? (
                    <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                      Nenhum membro encontrado.
                    </div>
                  ) : teamMembers.map((user, idx) => (
                    <div key={user.id} style={{
                      padding: "20px",
                      background: "#f8fafc",
                      borderRadius: "20px",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "14px",
                          background: "#ffffff",
                          border: "1px solid #e2e8f0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#1e293b"
                        }}>
                          <User size={24} />
                        </div>
                        <div>
                          <p style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b", margin: 0 }}>{user.nome}</p>
                          <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>{user.email}</p>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
                        <div style={{ textAlign: "right" }}>
                          <span style={{
                            padding: "4px 12px",
                            background: user.funcao === 'admin' ? "#fef3c7" : user.funcao === 'editor' ? "#dcfce7" : "#f1f5f9",
                            color: user.funcao === 'admin' ? "#92400e" : user.funcao === 'editor' ? "#166534" : "#475569",
                            borderRadius: "8px",
                            fontSize: "11px",
                            fontWeight: 700,
                            textTransform: "uppercase"
                          }}>
                             {user.funcao === 'super_admin' ? 'Master' : user.funcao === 'admin' ? 'Administrador' : user.funcao === 'editor' ? 'Editor' : 'Suporte'}
                           </span>
                         </div>
                         <div style={{ display: "flex", gap: "8px" }}>
                           {canEdit(user) && (
                             <button 
                               onClick={() => handleEditUser(user)}
                               title="Editar usuário"
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
                                 cursor: "pointer"
                               }}
                             >
                               <Edit2 size={16} />
                             </button>
                           )}
                           {canDelete(user) && (
                             <button 
                               onClick={() => handleDeleteUser(user.id)}
                               title="Remover usuário"
                               style={{
                                 width: "36px",
                                 height: "36px",
                                 borderRadius: "10px",
                                 background: "#ffffff",
                                 border: "1px solid #fee2e2",
                                 display: "flex",
                                 alignItems: "center",
                                 justifyContent: "center",
                                 color: "#ef4444",
                                 cursor: "pointer"
                               }}
                             >
                               <Trash2 size={16} />
                             </button>
                           )}
                         </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{
                  padding: "24px",
                  background: "#fffbeb",
                  border: "1px solid #fef3c7",
                  borderRadius: "20px",
                  display: "flex",
                  gap: "16px"
                }}>
                  <ShieldAlert size={24} color="#b45309" />
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 700, color: "#92400e", margin: 0 }}>Dica de Segurança</p>
                    <p style={{ fontSize: "13px", color: "#b45309", marginTop: "4px", lineHeight: "1.5" }}>
                      Usuários com cargo **Admin** podem alterar todas as configurações do site. Atribua esse poder apenas a pessoas de confiança.
                    </p>
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
                  <Field 
                    label="Nova Senha" 
                    type="password" 
                    placeholder="No mínimo 6 caracteres" 
                    value={passwords.new}
                    onChange={(val: string) => setPasswords(prev => ({ ...prev, new: val }))}
                  />
                  <Field 
                    label="Confirmar Nova Senha" 
                    type="password" 
                    placeholder="Repita a nova senha" 
                    value={passwords.confirm}
                    onChange={(val: string) => setPasswords(prev => ({ ...prev, confirm: val }))}
                  />
                </div>
                
                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "24px", display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={handlePasswordChange}
                    disabled={isUpdatingPassword}
                    style={{
                      padding: "12px 24px",
                      background: "#ef4444",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "12px",
                      fontSize: "14px",
                      fontWeight: 700,
                      cursor: isUpdatingPassword ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      opacity: isUpdatingPassword ? 0.7 : 1,
                      boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)"
                    }}
                  >
                    {isUpdatingPassword ? (
                      <>
                        <div className="animate-spin" style={{ width: "16px", height: "16px", border: "2px solid #fff", borderTop: "2px solid transparent", borderRadius: "50%" }} />
                        ATUALIZANDO...
                      </>
                    ) : (
                      <>
                        <Lock size={18} /> ATUALIZAR SENHA
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── Add User Modal ── */}
      {showAddUserModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{
            background: "#ffffff",
            width: "100%",
            maxWidth: "500px",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          }}>
            <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#1e293b", margin: "0 0 8px 0" }}>Adicionar Novo Membro</h3>
            <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 24px 0" }}>Convide um novo usuário para gerenciar o painel da Dohmen & Matta.</p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Nome Completo</label>
                <input 
                  type="text" 
                  value={newUser.nome}
                  onChange={(e) => setNewUser(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: João Silva"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    background: "#f8fafc",
                    fontSize: "14px",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>E-mail</label>
                <input 
                  type="email" 
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    background: "#f8fafc",
                    fontSize: "14px",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Senha de Acesso</label>
                <input 
                  type="password" 
                  value={newUser.senha}
                  onChange={(e) => setNewUser(prev => ({ ...prev, senha: e.target.value }))}
                  placeholder="No mínimo 6 caracteres"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    background: "#f8fafc",
                    fontSize: "14px",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Cargo / Nível de Acesso</label>
                <select 
                  value={newUser.funcao}
                  onChange={(e) => setNewUser(prev => ({ ...prev, funcao: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    background: "#f8fafc",
                    fontSize: "14px",
                    outline: "none",
                    cursor: "pointer"
                  }}
                >
                  <option value="admin">Administrador (Acesso Total)</option>
                  <option value="editor">Editor (Conteúdo)</option>
                  <option value="suporte">Suporte (Leads e Atendimento)</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
              <button 
                onClick={() => setShowAddUserModal(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  background: "#ffffff",
                  color: "#64748b",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Cancelar
              </button>
              <button 
                onClick={handleAddUser}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "12px",
                  border: "none",
                  background: "#1e293b",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Adicionar Membro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit User Modal ── */}
      {showEditUserModal && editingUser && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{
            background: "#ffffff",
            width: "100%",
            maxWidth: "500px",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          }}>
            <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#1e293b", margin: "0 0 8px 0" }}>Editar Usuário</h3>
            <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 24px 0" }}>Altere as informações do membro da equipe.</p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Nome Completo</label>
                <input 
                  type="text" 
                  value={editingUser.nome}
                  onChange={(e) => setEditingUser((prev: any) => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: João Silva"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    background: "#f8fafc",
                    fontSize: "14px",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>E-mail</label>
                <input 
                  type="email" 
                  value={editingUser.email}
                  onChange={(e) => setEditingUser((prev: any) => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    background: "#f8fafc",
                    fontSize: "14px",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Cargo / Nível de Acesso</label>
                <select 
                  value={editingUser.funcao}
                  onChange={(e) => setEditingUser((prev: any) => ({ ...prev, funcao: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    background: "#f8fafc",
                    fontSize: "14px",
                    outline: "none",
                    cursor: "pointer"
                  }}
                >
                  <option value="admin">Administrador (Acesso Total)</option>
                  <option value="editor">Editor (Conteúdo)</option>
                  <option value="suporte">Suporte (Leads e Atendimento)</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
              <button 
                onClick={() => {
                  setShowEditUserModal(false);
                  setEditingUser(null);
                }}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  background: "#ffffff",
                  color: "#64748b",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Cancelar
              </button>
              <button 
                onClick={handleUpdateUser}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "12px",
                  border: "none",
                  background: "#1e293b",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, placeholder, type = "text", value, onChange, icon: Icon, style = {} }: any) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", ...style }}>
      <label style={{ fontSize: "13px", fontWeight: 600, color: "#64748b" }}>{label}</label>
      <div style={{ position: "relative" }}>
        {Icon && (
          <div style={{
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#94a3b8",
            display: "flex",
            alignItems: "center"
          }}>
            <Icon size={16} />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value || ""}
          onChange={(e) => onChange && onChange(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 16px",
            paddingLeft: Icon ? "42px" : "16px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            fontSize: "14px",
            outline: "none",
            transition: "all 0.2s ease",
            fontWeight: 500,
            color: "#1e293b",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#1e293b";
            e.currentTarget.style.background = "#ffffff";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
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
