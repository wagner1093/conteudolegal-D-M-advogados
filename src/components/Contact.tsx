'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, ArrowRight, MessageSquare, Phone } from 'lucide-react';

const whatsAppContacts = [
  { name: 'Atendimento Especializado', role: 'Direito da Saúde', number: '(11) 98779-5023', raw: '11987795023' },
  { name: 'Lucas Dohmen', role: 'Sócio Fundador', number: '(11) 94862-2339', raw: '11948622339' },
  { name: 'Alexandre Matta', role: 'Diretor Operacional', number: '(11) 98338-0371', raw: '11983380371' },
];

const Contact = () => {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

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
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span style={{ 
              display: 'inline-block', 
              padding: '6px 14px', 
              backgroundColor: 'rgba(102, 178, 142, 0.1)', 
              color: 'var(--accent)', 
              borderRadius: '100px',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '24px'
            }}>
              Avaliação Gratuita
            </span>
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

          <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Input Row 1 */}
            <div className="input-grid" style={{ display: 'grid', gap: '20px' }}>
              <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: focusedInput === 'nome' ? 'var(--accent)' : '#4b5563', marginBottom: '8px', transition: 'color 0.3s' }}>Nome Completo</label>
                <input 
                  type="text" 
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

            {/* Input Row 2 */}
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: focusedInput === 'email' ? 'var(--accent)' : '#4b5563', marginBottom: '8px', transition: 'color 0.3s' }}>E-mail</label>
              <input 
                type="email" 
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

            {/* Input Row 3 */}
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: focusedInput === 'area' ? 'var(--accent)' : '#4b5563', marginBottom: '8px', transition: 'color 0.3s' }}>Área de Interesse</label>
              <div style={{ position: 'relative' }}>
                <select 
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
                  <option value="" disabled selected hidden>Selecione uma área...</option>
                  <option>Direito da Saúde</option>
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

            {/* Input Row 4 */}
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: focusedInput === 'mensagem' ? 'var(--accent)' : '#4b5563', marginBottom: '8px', transition: 'color 0.3s' }}>Mensagem (Opcional)</label>
              <textarea 
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

            {/* Submit Button */}
            <motion.button 
              whileHover={{ scale: 1.02, backgroundColor: '#1d3557' }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              style={{ 
                marginTop: '8px',
                padding: '14px 32px', 
                backgroundColor: 'var(--primary)', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '8px',
                cursor: 'pointer', 
                fontSize: '1rem', 
                fontWeight: 600, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '12px', 
                width: '100%',
                transition: 'background-color 0.3s'
              }}
              className="submit-btn"
            >
              Enviar Mensagem
              <ArrowRight size={20} />
            </motion.button>
          </form>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
              {whatsAppContacts.map((contact, idx) => (
                <motion.a
                  key={idx}
                  href={`https://wa.me/55${contact.raw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + (idx * 0.1) }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
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
                  <div className="wa-icon-wrapper" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', color: '#94a3b8' }}>
                    <ArrowRight size={14} className="wa-icon" style={{ transition: 'all 0.3s' }} />
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Firm Details */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <MapPin size={20} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <span style={{ display: 'block', color: '#fff', fontWeight: 600, fontSize: '0.9rem', marginBottom: '2px' }}>Sede São Paulo</span>
                  <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    Av. Paulista, 1439, 1º Andar, Conj. 12<br />Bela Vista, São Paulo/SP
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Mail size={20} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <span style={{ display: 'block', color: '#fff', fontWeight: 600, fontSize: '0.9rem', marginBottom: '2px' }}>E-mail Institucional</span>
                  <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem' }}>
                    alexandre@dmaadvs.com.br
                  </span>
                </div>
              </div>
            </div>

          </motion.div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
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
