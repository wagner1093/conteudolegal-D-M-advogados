'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, MessageCircle, ArrowRight } from 'lucide-react';

const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const Footer = () => {
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
              Pronto para resolver seu caso? Agende sua consulta agora.
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
              href="https://wa.me/5511987795023"
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
              Consulta Gratuita <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--primary-deep)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '60px 24px 40px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 60, marginBottom: 60 }}>
            {/* Brand column */}
            <div>
              <div style={{ marginBottom: 24 }}>
                <img 
                  src="/images/logo.png" 
                  alt="Dohmen & Matta Advogados" 
                  style={{ 
                    height: '65px', 
                    width: 'auto', 
                    objectFit: 'contain'
                  }} 
                />
              </div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: 24, maxWidth: 280 }}>
                Dohmen & Matta Advogados. Especialistas em soluções jurídicas modernas e eficazes em todo o Brasil.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { href: 'https://instagram.com/dmadireitos', Icon: Instagram, color: '#E4405F' },
                  { href: 'https://linkedin.com/company/111383436', Icon: Linkedin, color: '#0A66C2' },
                  { href: 'https://wa.me/5511987795023', Icon: WhatsAppIcon, color: '#25D366' },
                ].map(({ href, Icon, color }, i) => (
                  <a
                    key={i}
                    href={href}
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
                {['Família e Sucessões', 'Consumidor', 'Cível', 'Empresarial', 'Saúde'].map(area => (
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
                {[['Sobre', '#sobre'], ['Sócios', '#socios'], ['Equipe', '#equipe'], ['Contato', '#contato']].map(([label, href]) => (
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
                Av. Paulista, 1439<br />São Paulo/SP
              </p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: 4 }}>
                contato@dmaadvs.com.br
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
              © {new Date().getFullYear()} Dohmen & Matta Advogados Associados. Todos os direitos reservados.
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
