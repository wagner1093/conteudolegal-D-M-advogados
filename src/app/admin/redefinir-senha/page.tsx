"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Loader2, CheckCircle, ShieldAlert } from "lucide-react";

export default function RedefinirSenhaPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Supabase injeta a sessão via hash fragment na URL ao clicar no link do e-mail
    const { data: listener } = supabase!.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true);
      }
    });

    // Verificar se já tem sessão ativa (caso o usuário já estava logado)
    supabase!.auth.getSession().then(({ data: { session } }) => {
      if (session) setSessionReady(true);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleReset = async () => {
    if (!password || !confirm) {
      setError("Preencha os dois campos.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase!.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => router.push("/admin/login"), 3000);
    } catch (err: any) {
      setError(`Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0d1117 0%, #161b22 50%, #0d1117 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(197,160,89,0.15)",
        borderRadius: "24px",
        padding: "48px 40px",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
        textAlign: "center"
      }}>
        {success ? (
          /* Tela de Sucesso */
          <>
            <CheckCircle size={64} color="#22c55e" style={{ marginBottom: "20px" }} />
            <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: 700, marginBottom: "12px" }}>
              Senha Atualizada!
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginBottom: "24px" }}>
              Sua senha foi redefinida com sucesso.<br />
              Você será redirecionado ao login em instantes...
            </p>
            <div style={{
              height: "4px", background: "rgba(255,255,255,0.1)",
              borderRadius: "2px", overflow: "hidden"
            }}>
              <div style={{
                height: "100%", background: "#22c55e",
                animation: "progress 3s linear forwards",
                borderRadius: "2px"
              }} />
            </div>
            <style>{`@keyframes progress { from { width: 0% } to { width: 100% } }`}</style>
          </>
        ) : !sessionReady ? (
          /* Link inválido ou expirado */
          <>
            <ShieldAlert size={64} color="#f59e0b" style={{ marginBottom: "20px" }} />
            <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: 700, marginBottom: "12px" }}>
              Link Inválido
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginBottom: "24px" }}>
              Este link de redefinição é inválido ou expirou.<br />
              Solicite um novo link na tela de login.
            </p>
            <button
              onClick={() => router.push("/admin/login")}
              style={{
                background: "linear-gradient(135deg, #c5a059, #d4b06a)",
                color: "#fff", border: "none", borderRadius: "12px",
                padding: "14px", fontWeight: 700, fontSize: "14px",
                cursor: "pointer", width: "100%"
              }}
            >
              Voltar ao Login
            </button>
          </>
        ) : (
          /* Formulário de Nova Senha */
          <>
            <div style={{
              width: "64px", height: "64px",
              background: "linear-gradient(135deg, #c5a059, #d4b06a)",
              borderRadius: "16px",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px"
            }}>
              <Lock size={28} color="#fff" />
            </div>

            <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: 700, marginBottom: "8px" }}>
              Criar Nova Senha
            </h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginBottom: "32px" }}>
              Escolha uma senha segura com pelo menos 6 caracteres
            </p>

            {/* Campo Nova Senha */}
            <div style={{ marginBottom: "16px", textAlign: "left" }}>
              <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "8px" }}>
                NOVA SENHA
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={16} color="rgba(255,255,255,0.3)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  style={{
                    width: "100%", padding: "12px 40px 12px 40px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px", color: "#fff",
                    fontSize: "14px", outline: "none", boxSizing: "border-box"
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: 0 }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Campo Confirmar Senha */}
            <div style={{ marginBottom: "24px", textAlign: "left" }}>
              <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "8px" }}>
                CONFIRMAR NOVA SENHA
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={16} color="rgba(255,255,255,0.3)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleReset()}
                  placeholder="Repita a nova senha"
                  style={{
                    width: "100%", padding: "12px 12px 12px 40px",
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${confirm && confirm !== password ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: "12px", color: "#fff",
                    fontSize: "14px", outline: "none", boxSizing: "border-box"
                  }}
                />
              </div>
              {confirm && confirm !== password && (
                <p style={{ color: "#fca5a5", fontSize: "12px", marginTop: "6px" }}>As senhas não coincidem</p>
              )}
            </div>

            {error && (
              <div style={{
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "10px", padding: "10px 14px",
                color: "#fca5a5", fontSize: "13px", marginBottom: "16px", textAlign: "left"
              }}>
                {error}
              </div>
            )}

            <button
              onClick={handleReset}
              disabled={loading}
              style={{
                width: "100%", padding: "14px",
                background: "linear-gradient(135deg, #c5a059, #d4b06a)",
                color: "#fff", border: "none", borderRadius: "12px",
                fontWeight: 700, fontSize: "14px",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                opacity: loading ? 0.7 : 1,
                boxShadow: "0 10px 20px -5px rgba(197,160,89,0.3)"
              }}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />}
              {loading ? "Salvando..." : "Redefinir Senha"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
