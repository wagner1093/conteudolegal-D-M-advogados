'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const fade = { type: 'spring' as const, stiffness: 180, damping: 22 };

const About = () => {
  return (
    <section id="sobre" style={{ padding: '120px 24px', backgroundColor: '#fff' }}>
      <div className="container">
        <div className="about-grid" style={{
          alignItems: 'center',
        }}>
          {/* Left: Image block */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={fade}
            style={{ position: 'relative', willChange: 'transform' }}
          >
            <div style={{
              position: 'relative',
              paddingBottom: '120%',
              overflow: 'hidden',
              backgroundColor: '#c8d0d8',
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'url(/images/hero-bg.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }} />
            </div>

            {/* Floating stat card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ ...fade, delay: 0.15 }}
              style={{
                position: 'absolute',
                bottom: -30,
                right: -30,
                backgroundColor: 'var(--primary)',
                color: '#fff',
                padding: '32px',
                width: 180,
                willChange: 'transform',
              }}
            >
              <div style={{ fontSize: '2.8rem', fontWeight: 600, lineHeight: 1, fontFamily: 'var(--font-headings)', color: 'var(--accent)' }}>
                10+
              </div>
              <div style={{ fontSize: '0.8rem', marginTop: 8, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Anos de<br />Experiência
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ ...fade, delay: 0.1 }}
            style={{ willChange: 'transform' }}
          >
            <span className="eyebrow">Sobre Nós</span>

            <h2 style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
              color: 'var(--primary)',
              marginBottom: 24,
              lineHeight: 1.15,
            }}>
              Existimos para proteger o que mais importa para você.
            </h2>

            <p style={{ fontSize: '1rem', color: 'var(--text-light)', lineHeight: 1.8, marginBottom: 20 }}>
              A <strong style={{ color: 'var(--primary)' }}>Dohmen & Matta Advogados</strong> é um escritório moderno, 100% digital, especializado em oferecer soluções jurídicas ágeis, transparentes e humanizadas para pessoas físicas e empresas em todo o Brasil.
            </p>

            <p style={{ fontSize: '1rem', color: 'var(--text-light)', lineHeight: 1.8, marginBottom: 48 }}>
              Nosso time é formado por advogados especializados, comprometidos com resultados reais — com atendimento ágil, comunicação clara e profundo respeito pelo seu caso.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 48 }}>
              {[
                'Atendimento 100% digital em todo o Brasil',
                'Equipe multidisciplinar e especializada',
                'Comunicação clara e transparente',
                'Honorários acessíveis e justos',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ width: 6, height: 6, backgroundColor: 'var(--accent)', borderRadius: '50%', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.92rem', color: 'var(--text)', fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>

            <a
              href="#contato"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                color: 'var(--primary)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
                borderBottom: '2px solid var(--accent)',
                paddingBottom: 4,
                transition: 'gap 0.2s ease',
              }}
              onMouseOver={e => e.currentTarget.style.gap = '16px'}
              onMouseOut={e => e.currentTarget.style.gap = '10px'}
            >
              Iniciar Consulta <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
