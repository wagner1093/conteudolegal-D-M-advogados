'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

const areas = [
  {
    num: '01',
    title: 'Direito de Família e Sucessões',
    desc: 'Assessoria completa em divórcio, guarda, inventários e planejamento sucessório com agilidade e sensibilidade.',
    items: ['Divórcio e Separação', 'Guarda e Alimentos', 'Inventário e Herança'],
  },
  {
    num: '02',
    title: 'Direito do Consumidor',
    desc: 'Defesa dos seus direitos contra práticas abusivas, cobranças indevidas e vícios de produtos e serviços.',
    items: ['Cobranças Indevidas', 'Recall e Vícios', 'Indenizações'],
  },
  {
    num: '03',
    title: 'Direito Cível',
    desc: 'Representação em disputas contratuais, responsabilidade civil e execuções judiciais com excelência técnica.',
    items: ['Contratos', 'Responsabilidade Civil', 'Execuções'],
  },
  {
    num: '04',
    title: 'Direito Empresarial e Trabalhista',
    desc: 'Proteção jurídica completa para empresas: contratos, relações trabalhistas e conformidade regulatória.',
    items: ['Contratos Empresariais', 'Relações Trabalhistas', 'Compliance'],
  },
  {
    num: '05',
    title: 'Direito da Saúde',
    desc: 'Especialistas em planos de saúde, erro médico e direitos de pacientes para garantir o acesso à saúde.',
    items: ['Planos de Saúde', 'Erro Médico', 'Direitos do Paciente'],
  },
];

const spring = { type: 'spring' as const, stiffness: 300, damping: 30 };
const fade = { type: 'spring' as const, stiffness: 200, damping: 25 };

// Animação super suave para o accordion (altura + fade)
const accordionVariants = {
  hidden: { height: 0, opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' as const } },
  visible: { height: 'auto', opacity: 1, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

const PracticeAreas = () => {
  const [expanded, setExpanded] = useState<number | null>(0);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="atuacao" style={{ padding: '120px 24px', backgroundColor: 'var(--primary-deep)' }}>
      <div className="container">

        {/* Header row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 80,
          gap: 40,
          flexWrap: 'wrap',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={fade}
          >
            <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.4)' }}>Nossas Áreas</span>
            <h2 style={{ color: '#fff', fontSize: 'clamp(2rem, 3.5vw, 3rem)', maxWidth: 500 }}>
              Soluções Jurídicas<br />Completas para Você
            </h2>
          </motion.div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} />

        {/* Accordion list */}
        {areas.map((area, index) => {
          const isOpen = expanded === index;
          const isHovered = hovered === index;

          return (
            <div 
              key={index} 
              style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Row header */}
              <motion.div
                onClick={() => setExpanded(isOpen ? null : index)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '32px 16px',
                  cursor: 'pointer',
                  gap: 24,
                  userSelect: 'none',
                  backgroundColor: isHovered && !isOpen ? 'rgba(255,255,255,0.02)' : 'transparent',
                  transition: 'background-color 0.3s ease, padding 0.3s ease',
                  borderLeft: isOpen ? '4px solid var(--accent)' : (isHovered ? '4px solid rgba(255,255,255,0.1)' : '4px solid transparent'),
                  marginLeft: '-4px', // compensa a borda para não empurrar o layout
                }}
              >
                <div className="practice-item-header" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                  <span style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: isOpen ? 'var(--accent)' : 'rgba(255,255,255,0.25)',
                    fontFamily: 'var(--font-body)',
                    minWidth: 28,
                    transition: 'color 0.3s ease',
                  }}>
                    {area.num}.
                  </span>
                  <h3 style={{
                    fontSize: 'clamp(1.1rem, 1.8vw, 1.4rem)',
                    color: isOpen ? '#fff' : (isHovered ? '#fff' : 'rgba(255,255,255,0.7)'),
                    fontWeight: isOpen ? 600 : 400,
                    transition: 'color 0.3s ease, font-weight 0.3s ease',
                    fontFamily: 'var(--font-headings)',
                    letterSpacing: '-0.02em',
                  }}>
                    {area.title}
                  </h3>
                </div>

                {/* Animated Arrow Icon */}
                <motion.div
                  animate={{ 
                    rotate: isOpen ? 45 : 0,
                    backgroundColor: isOpen ? 'var(--accent)' : (isHovered ? 'rgba(255,255,255,0.08)' : 'transparent'),
                    color: isOpen ? '#000' : (isHovered ? '#fff' : 'rgba(255,255,255,0.3)')
                  }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    flexShrink: 0,
                    willChange: 'transform',
                  }}
                >
                  <ArrowUpRight size={20} />
                </motion.div>
              </motion.div>

              {/* Expanded content */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={accordionVariants}
                    style={{ overflow: 'hidden', willChange: 'height, opacity' }}
                  >
                    <div className="practice-expanded" style={{
                      alignItems: 'start',
                    }}>
                      <div>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 20, maxWidth: 600 }}>
                          {area.desc}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                          {area.items.map((item, i) => (
                            <span key={i} style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: 8, 
                              color: '#fff', 
                              fontSize: '0.82rem',
                              padding: '6px 14px',
                              backgroundColor: 'rgba(255,255,255,0.06)',
                              borderRadius: '40px',
                              border: '1px solid rgba(255,255,255,0.05)'
                            }}>
                              <span style={{ width: 6, height: 6, backgroundColor: 'var(--accent)', borderRadius: '50%' }} />
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      <a
                        href="#contato"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '14px 28px',
                          backgroundColor: 'transparent',
                          color: '#fff',
                          textDecoration: 'none',
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          whiteSpace: 'nowrap',
                          fontFamily: 'var(--font-body)',
                        }}
                        onMouseOver={e => {
                          e.currentTarget.style.backgroundColor = '#fff';
                          e.currentTarget.style.color = 'var(--primary-deep)';
                          e.currentTarget.style.borderColor = '#fff';
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#fff';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                        }}
                      >
                        Falar com Especialista <ArrowRight size={14} />
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PracticeAreas;
