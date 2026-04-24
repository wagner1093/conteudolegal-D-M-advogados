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
        <div className="team-header-grid" style={{
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

        {/* Members Grid — Cards with 3D Flip Animation */}
        <div className="team-grid">
          {members.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              <div className="team-card">
                {/* Gray Placeholder Image */}
                <div 
                  className="team-card-image" 
                  style={{ 
                    backgroundColor: '#d1d5db', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundImage: 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)'
                  }} 
                >
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Foto Indisponível
                  </span>
                </div>

                <div className="team-card__content">
                  <h3 className="team-card__title">{member.name}</h3>
                  <p className="team-card__role">{member.role}</p>
                  <p className="team-card__description">
                    Profissional dedicado à excelência jurídica e ao atendimento estratégico dos nossos clientes.
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
