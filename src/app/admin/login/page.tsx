"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { consumeRateLimit, logAudit } from "@/lib/security";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/admin");
      }
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Check Rate Limit
      const rlIdentifier = `login:${email}`;
      const { limited, retry_after_seconds } = await consumeRateLimit(rlIdentifier, 5, 60);
      
      if (limited) {
        setError(`Muitas tentativas. Tente novamente em ${retry_after_seconds} segundos.`);
        await logAudit("LOGIN_FAILURE", "auth", email, null, { reason: "rate_limited" });
        return;
      }

      // 2. Attempt Login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError("Credenciais inválidas. Por favor, tente novamente.");
        await logAudit("LOGIN_FAILURE", "auth", email, null, { error: error.message });
        return;
      }

      // 3. Success Audit
      await logAudit("LOGIN_SUCCESS", "auth", data.user?.id);
      router.push("/admin");
    } catch (err: any) {
      setError("Ocorreu um erro ao tentar entrar. Tente novamente mais tarde.");
      await logAudit("LOGIN_ERROR", "auth", email, null, { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
        backgroundImage: "radial-gradient(circle at top right, #1e293b 0%, #0f172a 100%)",
        padding: "20px",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "rgba(30, 41, 59, 0.5)",
          backdropFilter: "blur(20px)",
          borderRadius: "32px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "48px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Logo Container */}
        <div
          style={{
            width: "80px",
            height: "80px",
            background: "linear-gradient(135deg, #c5a059 0%, #e2c08d 100%)",
            borderRadius: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "24px",
            boxShadow: "0 10px 25px rgba(197, 160, 89, 0.2)",
          }}
        >
          <Shield size={40} color="#0f172a" />
        </div>

        <img
          src="/images/logo.png"
          alt="D&M Advogados"
          style={{
            height: "60px",
            width: "auto",
            marginBottom: "32px",
            filter: "brightness(0) invert(1)", // Makes logo white for dark theme
          }}
        />

        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#ffffff",
              margin: "0 0 8px 0",
              letterSpacing: "-0.02em",
            }}
          >
            Acesso ao Painel
          </h1>
          <p style={{ fontSize: "15px", color: "rgba(255, 255, 255, 0.5)", margin: 0 }}>
            Digite suas credenciais para gerenciar o portal.
          </p>
        </div>

        {error && (
          <div
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              borderRadius: "12px",
              color: "#f87171",
              fontSize: "13px",
              fontWeight: 500,
              marginBottom: "24px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ width: "100%" }}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: "8px",
                marginLeft: "4px",
              }}
            >
              E-mail
            </label>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(255, 255, 255, 0.3)",
                }}
              >
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                style={{
                  width: "100%",
                  padding: "14px 16px 14px 48px",
                  background: "rgba(15, 23, 42, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "14px",
                  color: "#ffffff",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#c5a059";
                  e.target.style.boxShadow = "0 0 0 4px rgba(197, 160, 89, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "32px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: "8px",
                marginLeft: "4px",
              }}
            >
              Senha
            </label>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(255, 255, 255, 0.3)",
                }}
              >
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "14px 48px 14px 48px",
                  background: "rgba(15, 23, 42, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "14px",
                  color: "#ffffff",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#c5a059";
                  e.target.style.boxShadow = "0 0 0 4px rgba(197, 160, 89, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "rgba(255, 255, 255, 0.3)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              background: "linear-gradient(135deg, #c5a059 0%, #e2c08d 100%)",
              border: "none",
              borderRadius: "14px",
              color: "#0f172a",
              fontSize: "16px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 10px 20px -5px rgba(197, 160, 89, 0.3)",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 15px 30px -5px rgba(197, 160, 89, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 20px -5px rgba(197, 160, 89, 0.3)";
              }
            }}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Entrar no Sistema"
            )}
          </button>
        </form>

        <div style={{ marginTop: "32px", fontSize: "12px", color: "rgba(255, 255, 255, 0.3)", fontWeight: 500 }}>
          © 2026 Dohmen & Matta Advogados Associados
        </div>
      </div>
      
      {/* Background decoration elements */}
      <div style={{
        position: 'fixed',
        top: '10%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: '#c5a059',
        filter: 'blur(150px)',
        opacity: 0.05,
        borderRadius: '50%',
        zIndex: -1
      }} />
      <div style={{
        position: 'fixed',
        bottom: '10%',
        right: '10%',
        width: '400px',
        height: '400px',
        background: '#6366f1',
        filter: 'blur(150px)',
        opacity: 0.03,
        borderRadius: '50%',
        zIndex: -1
      }} />
    </div>
  );
}
