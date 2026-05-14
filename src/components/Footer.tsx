'use client';

import { supabase } from '@/lib/supabaseClient';
import { MessageCircle, ArrowRight, MapPin, Mail, Phone } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const WhatsAppIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

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

const Footer = () => {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    async function loadConfig() {
      const siteId = process.env.NEXT_PUBLIC_SITE_ID;
      if (!supabase || !siteId) return;
      
      const { data } = await supabase
        .from('painel_sites')
        .select('*, painel_configuracoes(*)')
        .eq('id', siteId)
        .single();
      
      if (data) {
        const configData = data.painel_configuracoes && data.painel_configuracoes[0] ? data.painel_configuracoes[0] : {};
        setConfig({
          ...data,
          ...configData,
          site_name: configData.nome_fantasia || data.name,
          site_description: data.description,
          address: configData.endereco_completo || data.address,
          contact_email: configData.email_contato || data.contact_email,
          contact_phone: configData.whatsapp_telefone || data.contact_phone,
          instagram_url: configData.instagram_url || data.instagram_url,
          linkedin_url: configData.linkedin_url || data.linkedin_url,
          facebook_url: configData.facebook_url || data.facebook_url,
          youtube_url: configData.youtube_url || data.youtube_url
        });
      }
    }
    loadConfig();
  }, []);

  const socialLinks = config ? [
    { href: config.instagram_url, Icon: Instagram, color: '#E4405F', label: 'Instagram' },
    { href: config.linkedin_url, Icon: Linkedin, color: '#0A66C2', label: 'LinkedIn' },
    { href: config.facebook_url, Icon: Facebook, color: '#1877F2', label: 'Facebook' },
    { href: config.youtube_url, Icon: Youtube, color: '#FF0000', label: 'YouTube' },
    { 
      href: config.contact_phone ? `https://wa.me/${config.contact_phone.replace(/\D/g, '')}` : '', 
      Icon: WhatsAppIcon, 
      color: '#25D366', 
      label: 'WhatsApp' 
    },
  ].filter(link => link.href && link.href.trim() !== '') : [];

  return (
    <>
      {/* CTA Section */}
      <section style={{
        padding: '120px 24px',
        backgroundColor: 'var(--primary-deep)',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}>
        {/* Decorative background lines */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `repeating-linear-gradient(
            -45deg, transparent, transparent 60px,
            rgba(255,255,255,0.015) 60px, rgba(255,255,255,0.015) 61px
          )`,
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.35)', justifyContent: 'center' }}>
              Próximo Passo
            </span>
            <h2 style={{
              color: '#fff',
              fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
              maxWidth: 700,
              margin: '0 auto 24px auto',
              lineHeight: 1.1,
            }}>
              Pronto para resolver seu caso? Fale conosco agora.
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.5)',
              maxWidth: 520,
              margin: '0 auto 48px auto',
              fontSize: '1rem',
              lineHeight: 1.7,
            }}>
              Seja qual for o desafio jurídico que você enfrenta, nossa equipe está pronta para ouvir, orientar e agir com excelência.
            </p>
            <a
              href={config?.contact_phone ? `https://wa.me/${config.contact_phone.replace(/\D/g, '')}` : '#'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                padding: '16px 40px',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                letterSpacing: '0.5px',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={e => {
                e.currentTarget.style.backgroundColor = 'var(--accent)';
                e.currentTarget.style.borderColor = 'var(--accent)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
              }}
            >
              Entrar em contato <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--primary-deep)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '60px 24px 40px' }}>
        <div className="container">
          <div className="footer-grid" style={{ gap: 60, marginBottom: 60 }}>
            {/* Brand column */}
            <div>
              <div style={{ marginBottom: 24 }}>
                <img 
                  src="/images/logo.png" 
                  alt={config?.site_name || "Dohmen & Matta Advogados"} 
                  style={{ 
                    height: '65px', 
                    width: 'auto', 
                    objectFit: 'contain'
                  }} 
                />
              </div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: 24, maxWidth: 280 }}>
                {config?.site_description || "Dohmen & Matta Advogados. Especialistas em soluções jurídicas modernas e eficazes em todo o Brasil."}
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                {socialLinks.map(({ href, Icon, color, label }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    style={{
                      width: 36, height: 36,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.5)',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      borderRadius: '4px'
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.borderColor = color;
                      e.currentTarget.style.color = color;
                      e.currentTarget.style.backgroundColor = `${color}10`; // Very subtle tint
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Áreas */}
            <div>
              <h5 style={{ color: '#fff', fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 20 }}>
                Áreas de Atuação
              </h5>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Direito da Saúde', 
                  'Erro Médico', 
                  'Cumprimento de Decisões', 
                  'Visão Estratégica para Profissionais e Clínicas'
                ].map(area => (
                  <li key={area}>
                    <a href="#atuacao" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s ease' }}
                      onMouseOver={e => e.currentTarget.style.color = '#fff'}
                      onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                    >
                      {area}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Navegação */}
            <div>
              <h5 style={{ color: '#fff', fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 20 }}>
                Navegação
              </h5>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  ['Home', '/#hero'],
                  ['Sobre', '/#sobre'],
                  ['Atuação', '/#atuacao'],
                  ['Sócios', '/#socios'],
                  ['Equipe', '/#equipe'],
                  ['Blog', '/blog'],
                  ['Contato', '/#contato']
                ].map(([label, href]) => (
                  <li key={label}>
                    <a href={href} style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s ease' }}
                      onMouseOver={e => e.currentTarget.style.color = '#fff'}
                      onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contato */}
            <div>
              <h5 style={{ color: '#fff', fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 20 }}>
                Contato
              </h5>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: 12 }}>
                {config?.address ? config.address.split(',').map((part: string, i: number) => (
                  <React.Fragment key={i}>
                    {part}{i === 0 ? <br /> : ''}
                  </React.Fragment>
                )) : (
                  <>Av. Paulista, 1439<br />São Paulo/SP</>
                )}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: 4 }}>
                {config?.contact_email || "contato@dmaadvs.com.br"}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                Seg–Sex: 09:00–18:00
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: 32,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>
              © {new Date().getFullYear()} {config?.site_name || "Dohmen & Matta Advogados Associados"}. Todos os direitos reservados.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>
              Feito por <a href="#" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Conteúdo Legal</a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
