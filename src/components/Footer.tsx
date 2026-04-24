'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Globe, MessageCircle, ArrowRight } from 'lucide-react';

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
                  { href: 'https://instagram.com/dmadireitos', Icon: Camera },
                  { href: 'https://linkedin.com/company/111383436', Icon: Globe },
                  { href: 'https://wa.me/5511987795023', Icon: MessageCircle },
                ].map(({ href, Icon }, i) => (
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
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.color = 'var(--accent)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                    }}
                  >
                    <Icon size={16} />
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
