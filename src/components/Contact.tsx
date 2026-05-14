'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Mail, ArrowRight, Phone, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from "@/lib/supabaseClient";

const Contact = () => {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    async function loadConfig() {
      if (!supabase) return;
      const { data } = await supabase
        .from("site_dm_advogados_configuracoes")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (data) setConfig(data);
    }
    loadConfig();
  }, []);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    area: '',
    mensagem: '',
    website: '' // SECURITY: Honeypot field - invisible to humans, filled by bots
  });
  const [lastSubmitTime, setLastSubmitTime] = useState(0);


  const whatsAppContacts = [
    { 
      name: 'Atendimento Especializado', 
      role: 'Geral', 
      number: config?.contact_phone || '(11) 98779-5023', 
      raw: config?.contact_phone?.replace(/\D/g, '') || '11987795023' 
    },
    { name: 'Dr. Lucas Dohmen', role: 'Sócio Fundador', number: '(11) 94862-2339', raw: '11948622339' },
    { name: 'Dr. Alexandre Matta', role: 'Sócio Fundador', number: '(11) 98338-0371', raw: '11983380371' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // SECURITY: Honeypot check - se o campo invisível foi preenchido, é um bot
    if (formData.website) {
      setSubmitted(true); // Finge sucesso para não alertar o bot
      setIsSubmitting(false);
      return;
    }

    // SECURITY: Rate limiting local - mínimo 10 segundos entre envios
    const now = Date.now();
    if (lastSubmitTime && now - lastSubmitTime < 10000) {
      setError('Aguarde alguns segundos antes de enviar novamente.');
      setIsSubmitting(false);
      return;
    }

    try {
      if (!supabase) throw new Error("Database client not initialized");

      const { error: insertError } = await supabase
        .from('site_dm_advogados_leads')
        .insert([{
          name: formData.nome,
          email: formData.email,
          phone: formData.telefone,
          area: formData.area,
          message: formData.mensagem,
          status: 'novo'
        }]);

      if (insertError) throw insertError;
      setLastSubmitTime(Date.now());
      setSubmitted(true);
    } catch (err: any) {
      console.error('Erro ao enviar lead:', err);
      setError('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contato" style={{
      position: 'relative',
      minHeight: '100vh',
      backgroundColor: '#0a1118', // Deep dark premium background
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--section-pad)',
      overflow: 'hidden'
    }}>
      
      {/* Abstract Background Glows */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(102,178,142,0.15) 0%, rgba(10,17,24,0) 70%)', filter: 'blur(80px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(29,53,87,0.4) 0%, rgba(10,17,24,0) 70%)', filter: 'blur(100px)', zIndex: 0 }} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '1100px',
        display: 'grid',
        borderRadius: '0', // Sharp corners for editorial look
        overflow: 'hidden',
        boxShadow: '0 40px 100px -20px rgba(0,0,0,0.5)',
        backgroundColor: '#fff' 
      }} className="contact-wrapper">

        {/* LEFT COLUMN: THE FORM (LIGHT) */}
        <div style={{
          padding: '56px 48px',
          backgroundColor: '#ffffff',
          position: 'relative'
        }} className="form-panel">
          
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '40px 0'
                }}
              >
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(102, 178, 142, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}>
                  <CheckCircle2 size={40} color="var(--accent)" />
                </div>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-deep)', fontWeight: 700, marginBottom: '12px' }}>
                  Mensagem Enviada!
                </h3>
                <p style={{ color: '#6b7280', lineHeight: 1.6, maxWidth: '300px', marginBottom: '32px' }}>
                  Agradecemos o seu contato. Nossa equipe analisará seu caso e retornará em breve.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  style={{
                    padding: '12px 24px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    color: '#6b7280',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Enviar outra mensagem
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 style={{ 
                    fontSize: 'clamp(1.75rem, 2.5vw, 2.2rem)', 
                    color: 'var(--primary-deep)', 
                    fontFamily: 'var(--font-headings)',
                    fontWeight: 700,
                    lineHeight: 1.1,
                    marginBottom: '12px'
                  }}>
                    Conte-nos sobre o seu caso.
                  </h2>
                  <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '32px', maxWidth: '400px' }}>
                    Nossa equipe jurídica analisará as informações com total sigilo e retornará o mais breve possível.
                  </p>
                </motion.div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="input-grid" style={{ display: 'grid', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: focusedInput === 'nome' ? 'var(--accent)' : '#4b5563', marginBottom: '8px', transition: 'color 0.3s' }}>Nome Completo</label>
                      <input 
                        type="text" 
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        onFocus={() => setFocusedInput('nome')}
                        onBlur={() => setFocusedInput(null)}
                        required 
                        style={{
                          width: '100%', padding: '10px 14px', backgroundColor: '#f9fafb', border: '1px solid', borderColor: focusedInput === 'nome' ? 'var(--accent)' : '#e5e7eb',
                          borderRadius: '8px', fontSize: '0.95rem', color: '#111827', outline: 'none', transition: 'all 0.3s',
                          boxShadow: focusedInput === 'nome' ? '0 0 0 4px rgba(102, 178, 142, 0.1)' : 'none'
                        }} 
                        placeholder="Como devemos chamá-lo?" 
                      />
                    </div>

                    <div style={{ position: 'relative' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: focusedInput === 'telefone' ? 'var(--accent)' : '#4b5563', marginBottom: '8px', transition: 'color 0.3s' }}>Telefone / WhatsApp</label>
                      <input 
                        type="tel" 
                        value={formData.telefone}
                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                        onFocus={() => setFocusedInput('telefone')}
                        onBlur={() => setFocusedInput(null)}
                        required 
                        style={{
                          width: '100%', padding: '10px 14px', backgroundColor: '#f9fafb', border: '1px solid', borderColor: focusedInput === 'telefone' ? 'var(--accent)' : '#e5e7eb',
                          borderRadius: '8px', fontSize: '0.95rem', color: '#111827', outline: 'none', transition: 'all 0.3s',
                          boxShadow: focusedInput === 'telefone' ? '0 0 0 4px rgba(102, 178, 142, 0.1)' : 'none'
                        }} 
                        placeholder="(00) 00000-0000" 
                      />
                    </div>
                  </div>

                  <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: focusedInput === 'email' ? 'var(--accent)' : '#4b5563', marginBottom: '8px', transition: 'color 0.3s' }}>E-mail</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      onFocus={() => setFocusedInput('email')}
                      onBlur={() => setFocusedInput(null)}
                      required 
                      style={{
                        width: '100%', padding: '10px 14px', backgroundColor: '#f9fafb', border: '1px solid', borderColor: focusedInput === 'email' ? 'var(--accent)' : '#e5e7eb',
                        borderRadius: '8px', fontSize: '0.95rem', color: '#111827', outline: 'none', transition: 'all 0.3s',
                        boxShadow: focusedInput === 'email' ? '0 0 0 4px rgba(102, 178, 142, 0.1)' : 'none'
                      }} 
                      placeholder="seu@email.com" 
                    />
                  </div>

                  <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: focusedInput === 'area' ? 'var(--accent)' : '#4b5563', marginBottom: '8px', transition: 'color 0.3s' }}>Área de Interesse</label>
                    <div style={{ position: 'relative' }}>
                      <select 
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        onFocus={() => setFocusedInput('area')}
                        onBlur={() => setFocusedInput(null)}
                        required 
                        style={{
                          width: '100%', padding: '10px 14px', backgroundColor: '#f9fafb', border: '1px solid', borderColor: focusedInput === 'area' ? 'var(--accent)' : '#e5e7eb',
                          borderRadius: '8px', fontSize: '0.95rem', color: '#111827', outline: 'none', transition: 'all 0.3s',
                          boxShadow: focusedInput === 'area' ? '0 0 0 4px rgba(102, 178, 142, 0.1)' : 'none',
                          appearance: 'none', cursor: 'pointer'
                        }}
                      >
                        <option value="" disabled hidden>Selecione uma área...</option>
                        <option>Direito da saúde</option>
                        <option>Erro Médico</option>
                        <option>Cumprimento de Decisões</option>
                        <option>Visão Estratégica (Clínicas/Profissionais)</option>
                      </select>
                      <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1.5L6 6.5L11 1.5" stroke={focusedInput === 'area' ? "var(--accent)" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.3s' }}/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: focusedInput === 'mensagem' ? 'var(--accent)' : '#4b5563', marginBottom: '8px', transition: 'color 0.3s' }}>Mensagem (Opcional)</label>
                    <textarea 
                      value={formData.mensagem}
                      onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                      onFocus={() => setFocusedInput('mensagem')}
                      onBlur={() => setFocusedInput(null)}
                      rows={2}
                      style={{
                        width: '100%', padding: '10px 14px', backgroundColor: '#f9fafb', border: '1px solid', borderColor: focusedInput === 'mensagem' ? 'var(--accent)' : '#e5e7eb',
                        borderRadius: '8px', fontSize: '0.95rem', color: '#111827', outline: 'none', transition: 'all 0.3s',
                        boxShadow: focusedInput === 'mensagem' ? '0 0 0 4px rgba(102, 178, 142, 0.1)' : 'none',
                        resize: 'vertical', minHeight: '80px'
                      }} 
                      placeholder="Descreva brevemente o motivo do contato..." 
                    />
                  </div>

                  {/* SECURITY: Honeypot field - invisible to humans, attracts bots */}
                  <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
                    <input 
                      type="text" 
                      name="website" 
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                  </div>

                  {error && (
                    <div style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 500 }}>
                      {error}
                    </div>
                  )}

                  <motion.button 
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02, backgroundColor: isSubmitting ? 'var(--primary)' : '#1d3557' }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    type="submit" 
                    style={{ 
                      marginTop: '8px',
                      padding: '14px 32px', 
                      backgroundColor: 'var(--primary)', 
                      color: '#fff', 
                      border: 'none', 
                      borderRadius: '8px',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer', 
                      fontSize: '1rem', 
                      fontWeight: 600, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: '12px', 
                      width: '100%',
                      transition: 'background-color 0.3s',
                      opacity: isSubmitting ? 0.7 : 1
                    }}
                    className="submit-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar Mensagem
                        <ArrowRight size={20} />
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: DIRECT CONTACTS (DARK) */}
        <div style={{
          backgroundColor: 'var(--primary-deep)', // Same tone as the menu
          padding: '56px 48px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }} className="info-panel">
          

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <h3 style={{ fontSize: '1.4rem', color: '#fff', fontFamily: 'var(--font-headings)', fontWeight: 600, marginBottom: '8px' }}>
              Atendimento Direto
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '24px' }}>
              Fale diretamente com nossos especialistas via WhatsApp.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '40px' }}>
              {/* SECTION 1: GERAL */}
              <div>
                <h4 style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Atendimento Geral</h4>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {whatsAppContacts.slice(0, 1).map((contact, idx) => (
                    <motion.a
                      key={idx}
                      href={`https://wa.me/55${contact.raw}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                      }}
                      className="whatsapp-card"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(102, 178, 142, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Phone size={20} color="var(--accent)" />
                        </div>
                        <div>
                          <span style={{ display: 'block', color: '#fff', fontWeight: 600, fontSize: '0.95rem', marginBottom: '2px' }}>{contact.name}</span>
                          <span style={{ display: 'block', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 500 }}>{contact.role}</span>
                        </div>
                      </div>
                      <div className="wa-icon-wrapper" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                        <ArrowRight size={14} className="wa-icon" />
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* SECTION 2: SÓCIOS */}
              <div>
                <h4 style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Contatos Diretos</h4>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {whatsAppContacts.slice(1).map((contact, idx) => (
                    <motion.a
                      key={idx}
                      href={`https://wa.me/55${contact.raw}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                      }}
                      className="whatsapp-card"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(102, 178, 142, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Phone size={20} color="var(--accent)" />
                        </div>
                        <div>
                          <span style={{ display: 'block', color: '#fff', fontWeight: 600, fontSize: '0.95rem', marginBottom: '2px' }}>{contact.name}</span>
                          <span style={{ display: 'block', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 500 }}>{contact.role}</span>
                        </div>
                      </div>
                      <div className="wa-icon-wrapper" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                        <ArrowRight size={14} className="wa-icon" />
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

            {/* Firm Details */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <MapPin size={20} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <span style={{ display: "block", color: "#fff", fontWeight: 600, fontSize: "0.9rem", marginBottom: "2px" }}>Sede São Paulo</span>
                  <span style={{ display: "block", color: "#94a3b8", fontSize: "0.85rem", lineHeight: 1.5 }}>
                    {config?.address || (
                      <>Av. Paulista, 1439, 1º Andar, Conj. 12<br />Bela Vista, São Paulo/SP</>
                    )}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <Mail size={20} color="var(--accent)" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <span style={{ display: "block", color: "#fff", fontWeight: 600, fontSize: "0.9rem", marginBottom: "2px" }}>E-mail Institucional</span>
                  <span style={{ display: "block", color: "#94a3b8", fontSize: "0.85rem" }}>
                    {config?.contact_email || "contato@dmatta.com.br"}
                  </span>
                </div>
              </div>

              {/* Social Media Links */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                {config?.facebook_url && (
                  <motion.a 
                    whileHover={{ y: -3 }}
                    href={config.facebook_url} target="_blank" rel="noopener noreferrer"
                    style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </motion.a>
                )}
                {config?.instagram_url && (
                  <motion.a 
                    whileHover={{ y: -3 }}
                    href={config.instagram_url} target="_blank" rel="noopener noreferrer"
                    style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  </motion.a>
                )}
                {config?.linkedin_url && (
                  <motion.a 
                    whileHover={{ y: -3 }}
                    href={config.linkedin_url} target="_blank" rel="noopener noreferrer"
                    style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                  </motion.a>
                )}
              </div>
            </div>

          </motion.div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .whatsapp-card:hover {
          background-color: rgba(255, 255, 255, 0.06) !important;
          border-color: rgba(102, 178, 142, 0.4) !important;
          transform: translateY(-2px);
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
        }
        .whatsapp-card:hover .wa-icon-wrapper {
          background-color: var(--accent) !important;
          border-color: var(--accent) !important;
        }
        .whatsapp-card:hover .wa-icon {
          color: #ffffff !important;
          transform: translateX(2px);
        }
        
        .submit-btn:hover svg {
          transform: translateX(4px);
          transition: transform 0.3s;
        }

        @media (max-width: 992px) {
          .contact-wrapper {
            grid-template-columns: 1fr !important;
          }
          .form-panel {
            padding: 40px 24px !important;
          }
          .info-panel {
            padding: 40px 24px !important;
          }
          .input-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}} />
    </section>
  );
};

export default Contact;
