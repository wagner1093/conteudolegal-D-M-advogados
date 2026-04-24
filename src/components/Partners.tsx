'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const spring = { type: 'spring' as const, stiffness: 180, damping: 22 };

const partners = [
  {
    name: 'Lucas Dohmen',
    role: 'Sócio Fundador',
    spec: 'Direito Empresarial',
    oab: 'OAB/SP 000.000',
    bio: 'Especialista em direito empresarial e cível com mais de 10 anos de atuação estratégica em casos complexos.',
    whatsapp: '11948622339',
  },
  {
    name: 'Alexandre Matta',
    role: 'Sócio Fundador',
    spec: 'Direito da Saúde',
    oab: 'OAB/SP 000.001',
    bio: 'Referência em direito da saúde, planos de saúde e erro médico, com foco em resultados de alto impacto.',
    whatsapp: '11983380371',
  },
];

const Partners = () => {
  return (
    <section id="socios" style={{ padding: '140px 24px', backgroundColor: '#fff', position: 'relative' }}>
      <div className="container" style={{ maxWidth: 1100 }}>
        {/* Header Section */}
        <div style={{ marginBottom: 80 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={spring}
          >
            <span className="eyebrow" style={{ marginBottom: 16 }}>Liderança</span>
            <div className="partners-header-grid" style={{ gap: 40, alignItems: 'end' }}>
              <h2 style={{ 
                fontSize: 'clamp(2.4rem, 4vw, 3.2rem)', 
                color: 'var(--primary)', 
                lineHeight: 1.1,
                fontWeight: 600,
                letterSpacing: '-1px'
              }}>
                Visão Estratégica e<br />Experiência de Mercado
              </h2>
              <p style={{ 
                color: 'var(--text-light)', 
                fontSize: '1rem', 
                lineHeight: 1.8,
                maxWidth: 400,
                margin: 0
              }}>
                Nossos sócios fundadores unem expertise técnica de ponta com um olhar inovador sobre o direito contemporâneo.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Partners Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: 60,
        }}>
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring, delay: index * 0.1 }}
              style={{ position: 'relative' }}
            >
              {/* Image Container with Editorial Border */}
              <div style={{
                position: 'relative',
                height: 520,
                backgroundColor: 'var(--bg-secondary)',
                overflow: 'hidden',
                borderRadius: '2px', // Slight rounding for premium feel
                boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                marginBottom: 32,
              }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: 'url(/images/partners.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top',
                    filter: 'grayscale(100%) contrast(1.1)',
                  }}
                />
                
                {/* Info Overlay on Hover (Visual Enhancement) */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(8,25,41,0.9) 0%, transparent 60%)',
                  opacity: 0,
                  transition: 'opacity 0.4s ease',
                  padding: 32,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                }}
                className="partner-overlay"
                >
                  <p style={{ color: '#fff', fontSize: '0.9rem', lineHeight: 1.6, transform: 'translateY(10px)', transition: 'transform 0.4s ease' }} className="partner-bio">
                    {partner.bio}
                  </p>
                </div>

                {/* Corner Label */}
                <div style={{
                  position: 'absolute',
                  top: 24,
                  right: 24,
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  padding: '8px 16px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: 'var(--primary)',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  backdropFilter: 'blur(8px)',
                }}>
                  {partner.oab}
                </div>
              </div>

              {/* Textual Content */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ 
                    fontSize: '1.6rem', 
                    color: 'var(--primary)', 
                    marginBottom: 8, 
                    fontWeight: 600,
                    letterSpacing: '-0.5px'
                  }}>
                    {partner.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {partner.role}
                    </span>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'var(--border)' }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {partner.spec}
                    </span>
                  </div>
                </div>

                <motion.a
                  href={`https://wa.me/55${partner.whatsapp}`}
                  whileHover={{ scale: 1.1, backgroundColor: 'var(--accent)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    width: 48,
                    height: 48,
                    backgroundColor: 'var(--primary)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    textDecoration: 'none',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <ArrowUpRight size={20} />
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <style>{`
        .partner-overlay:hover { opacity: 1; }
        .partner-overlay:hover .partner-bio { transform: translateY(0); }
      `}</style>
    </section>
  );
};

export default Partners;
