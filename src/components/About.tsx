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
              Atuação Técnica e Estratégica em Demandas Sensíveis.
            </h2>

            <p style={{ fontSize: '1rem', color: 'var(--text-light)', lineHeight: 1.8, marginBottom: 20 }}>
              O <strong style={{ color: 'var(--primary)' }}>Dohmen & Matta Advogados Associados</strong> foi estruturado com um posicionamento claro: atuar de forma técnica e estratégica em demandas que envolvem saúde, responsabilidade civil e relações de consumo.
            </p>

            <p style={{ fontSize: '1rem', color: 'var(--text-light)', lineHeight: 1.8, marginBottom: 20 }}>
              Nossa atuação se concentra em cenários onde há desequilíbrio entre o indivíduo e grandes estruturas, como operadoras de saúde e instituições, exigindo não apenas conhecimento jurídico, mas capacidade de leitura prática do caso.
            </p>

            <p style={{ fontSize: '1rem', color: 'var(--text-light)', lineHeight: 1.8, marginBottom: 48 }}>
              Com abordagem direta e linguagem acessível, conduzimos cada demanda com foco em solução, segurança jurídica e tomada de decisão eficiente.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 48 }}>
              {[
                'Atendimento próximo e acessível',
                'Clareza na condução dos casos',
                'Atuação ágil e estratégica',
                'Uso de tecnologia na gestão dos processos',
                'Visão orientada por indicadores',
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

        {/* Nosso Método — Centered and Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ 
            marginTop: 120, 
            paddingTop: 100, 
            borderTop: '1px solid rgba(0,0,0,0.05)',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 80 }}>
            <span style={{ 
              fontSize: '0.9rem', 
              fontWeight: 700, 
              letterSpacing: '4px', 
              color: 'var(--accent)', 
              textTransform: 'uppercase',
              fontFamily: 'var(--font-body)'
            }}>
              NOSSO MÉTODO
            </span>
            <div style={{ width: 60, height: 2, backgroundColor: 'var(--accent)', marginTop: 12 }} />
          </div>

          {/* Timeline Container - Sequential Animation */}
          <motion.div 
            className="timeline-container" 
            style={{ 
              position: 'relative', 
              width: '100%', 
              overflowX: 'auto', 
              paddingTop: 40, // Space for the halo/pulse
              paddingBottom: 40,
              paddingLeft: 20,
              paddingRight: 20,
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Background Line (Muted) */}
            <div style={{
              position: 'absolute',
              top: 70, // 40px padding + 30px (half of 60px icon)
              left: '12.5%',
              right: '12.5%',
              height: '2px',
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              zIndex: 0,
            }} />

            {/* Progress Line (Animated) */}
            <motion.div 
              variants={{
                hidden: { scaleX: 0 },
                visible: { 
                  scaleX: 1,
                  transition: { duration: 2, ease: "easeInOut" }
                }
              }}
              style={{
                position: 'absolute',
                top: 70, // Matches background line
                left: '12.5%',
                right: '12.5%',
                height: '2px',
                backgroundColor: 'var(--accent)',
                zIndex: 1,
                transformOrigin: 'left',
              }} 
            />

            {/* Items row */}
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 0,
              minWidth: '900px',
            }}>
              {[
                { step: '01', title: 'Diagnóstico', desc: 'Análise técnica profunda do cenário jurídico e mapeamento de riscos.' },
                { step: '02', title: 'Planejamento', desc: 'Definição da melhor estratégia com foco em viabilidade e rapidez.' },
                { step: '03', title: 'Execução Ágil', desc: 'Implementação direta com foco em velocidade e máxima precisão.' },
                { step: '04', title: 'Monitoramento', desc: 'Acompanhamento constante via indicadores de performance e sucesso.' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8, y: 20 },
                    visible: { 
                      opacity: 1, 
                      scale: 1, 
                      y: 0,
                      transition: { 
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                        delay: idx * 0.6 // Coordinated with line duration
                      } 
                    }
                  }}
                  style={{
                    flex: '1 1 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '0 30px',
                    position: 'relative',
                    zIndex: 2,
                  }}
                >
                  {/* Circle Indicator with Pulse */}
                  <div style={{ position: 'relative', marginBottom: 32 }}>
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.1, 0.3],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{
                        position: 'absolute',
                        top: -10,
                        left: -10,
                        right: -10,
                        bottom: -10,
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent)',
                        zIndex: -1,
                      }}
                    />
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary)',
                        color: 'var(--accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        fontWeight: 800,
                        boxShadow: '0 8px 24px rgba(8,25,41,0.25)',
                        border: '4px solid #fff',
                        flexShrink: 0,
                      }}
                    >
                      {item.step}
                    </motion.div>
                  </div>

                  <h4 style={{
                    fontSize: '1.4rem',
                    color: 'var(--primary)',
                    marginBottom: 16,
                    fontWeight: 700,
                  }}>
                    {item.title}
                  </h4>
                  <p style={{
                    fontSize: '1rem',
                    color: 'var(--text-light)',
                    lineHeight: 1.8,
                    margin: 0,
                  }}>
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      <style jsx>{`
        .timeline-container::-webkit-scrollbar {
          height: 4px;
        }
        .timeline-container::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
        }
        .timeline-container::-webkit-scrollbar-thumb {
          background: var(--accent);
          border-radius: 10px;
        }
        @media (max-width: 992px) {
          .timeline-line {
            display: none;
          }
          .timeline-container {
            overflow-x: hidden;
          }
          .timeline-container > div:last-child {
            flex-direction: column !important;
            min-width: 100% !important;
            gap: 60px;
          }
        }
      `}</style>
    </section>
  );
};

export default About;
