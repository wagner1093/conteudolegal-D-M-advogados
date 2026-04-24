'use client';

import React from 'react';
import { motion } from 'framer-motion';

const spring = { type: 'spring' as const, stiffness: 180, damping: 25 };

const members = [
  { name: 'Yarla V. G. Ferreira', role: 'Advogada' },
  { name: 'Bianca Fortes S.', role: 'Advogada' },
  { name: 'Júlia Simões L. Franco', role: 'Advogada' },
  { name: 'Emily Bom de Oliveira', role: 'Advogada' },
  { name: 'Aline Franciele Alexandre', role: 'Advogada' },
  { name: 'Bruna F. F. Oliveira', role: 'Advogada' },
  { name: 'Jessica Paloma de Paiva', role: 'Controller' },
  { name: 'Giovanna L. M. da Silva', role: 'Estagiária' },
  { name: 'Rafael Jelezoglo', role: 'Advogado' },
  { name: 'Luiz Gustavo Ricca', role: 'Advogado' },
];

const Team = () => {
  return (
    <section id="equipe" style={{ padding: '100px 24px', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
      <div className="container" style={{ maxWidth: 1000 }}>
        {/* Section Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: 60,
          marginBottom: 80,
          alignItems: 'end',
        }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={spring}
          >
            <span className="eyebrow" style={{ marginBottom: 12 }}>Corpo Jurídico</span>
            <h2 style={{ 
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', 
              color: 'var(--primary)',
              lineHeight: 1.1,
              fontWeight: 600,
              letterSpacing: '-0.8px'
            }}>
              Talento e Dedicação<br />em Cada Detalhe
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ ...spring, delay: 0.1 }}
            style={{ 
              color: 'var(--text-light)', 
              fontSize: '0.95rem', 
              lineHeight: 1.8,
              margin: 0
            }}
          >
            Nossa equipe multidisciplinar é rigorosamente selecionada para garantir agilidade processual e atendimento personalizado de alto nível.
          </motion.p>
        </div>

        {/* Members List - High-End Editorial Style */}
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {members.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              style={{ position: 'relative' }}
            >
              <motion.div
                whileHover={{ backgroundColor: 'rgba(15,44,65,0.02)', x: 10 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '24px 12px',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'default',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--accent)',
                    minWidth: 24,
                    opacity: 0.6,
                    fontFamily: 'var(--font-body)',
                  }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span style={{
                    fontSize: '1.15rem',
                    fontWeight: 500,
                    color: 'var(--primary)',
                    fontFamily: 'var(--font-headings)',
                    letterSpacing: '-0.2px'
                  }}>
                    {member.name}
                  </span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <span style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    fontWeight: 500,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                  }}>
                    {member.role}
                  </span>
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    style={{ 
                      width: 40, 
                      height: 1, 
                      backgroundColor: 'var(--accent)', 
                      transformOrigin: 'left' 
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
