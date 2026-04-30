'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Calendar, User } from 'lucide-react';

const spring = { type: 'spring' as const, stiffness: 180, damping: 25 };

const latestPosts = [
  {
    id: 1,
    title: 'Novas atualizações no Direito da Saúde em 2024',
    excerpt: 'Entenda as principais mudanças regulatórias que impactam hospitais e profissionais da saúde neste ano.',
    date: '28 Abr, 2024',
    author: 'Dr. Lucas Dohmen',
    category: 'Direito da Saúde',
    image: '/images/blog/health-law.png',
  },
  {
    id: 2,
    title: 'Como prevenir litígios em casos de erro médico',
    excerpt: 'A importância do prontuário médico e da comunicação assertiva na mitigação de riscos jurídicos.',
    date: '15 Abr, 2024',
    author: 'Dr. Alexandre Matta',
    category: 'Gestão de Risco',
    image: '/images/blog/medical-risk.png',
  },
  {
    id: 3,
    title: 'Telemedicina: Aspectos Legais e Desafios Éticos',
    excerpt: 'Uma análise profunda sobre a regulamentação do atendimento remoto e a proteção de dados sensíveis.',
    date: '05 Abr, 2024',
    author: 'Dra. Yarla Ferreira',
    category: 'Bioética',
    image: '/images/blog/telemedicine.png',
  },

];

const BlogSection = () => {
  return (
    <section id="blog" style={{ padding: '120px 24px', backgroundColor: 'var(--bg)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="team-header-grid" style={{ marginBottom: 60, alignItems: 'end' }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={spring}
          >
            <span className="eyebrow">Nosso Blog</span>
            <h2 style={{ 
              fontSize: 'clamp(2.2rem, 4vw, 3rem)', 
              color: 'var(--primary)',
              lineHeight: 1.1,
              fontWeight: 600,
              letterSpacing: '-1px'
            }}>
              Conhecimento <span style={{ color: 'var(--accent)', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 700 }}>Jurídico</span> <br />em Atualização
            </h2>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ ...spring, delay: 0.1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
          >
            <p style={{ color: 'var(--text-light)', fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
              Artigos, análises e as principais notícias do mundo jurídico selecionadas pelos nossos especialistas para manter você sempre informado.
            </p>
            <Link href="/blog" className="btn btn-primary" style={{ alignSelf: 'flex-start', borderRadius: '50px', padding: '12px 32px' }}>
              Ver Todos os Posts <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>

        {/* Blog Cards Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '32px' 
        }}>
          {latestPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              style={{
                backgroundColor: 'var(--white)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Image Container */}
              <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                <img 
                  src={post.image} 
                  alt={post.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                  padding: '6px 16px',
                  borderRadius: '30px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {post.category}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '15px', color: 'var(--text-light)', fontSize: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="var(--accent)" /> {post.date}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={14} color="var(--accent)" /> {post.author}
                  </span>
                </div>
                
                <h3 style={{ 
                  fontSize: '1.4rem', 
                  color: 'var(--primary)', 
                  marginBottom: '15px',
                  lineHeight: 1.3,
                  fontWeight: 600,
                  letterSpacing: '-0.5px'
                }}>
                  {post.title.split(' ').slice(0, -1).join(' ')} {' '}
                  <span style={{ 
                    color: 'var(--accent)', 
                    fontFamily: "'Playfair Display', serif", 
                    fontStyle: 'italic', 
                    fontWeight: 700 
                  }}>
                    {post.title.split(' ').slice(-1)}
                  </span>
                </h3>
                
                <p style={{ 
                  color: 'var(--text-light)', 
                  fontSize: '0.95rem', 
                  lineHeight: 1.6,
                  marginBottom: '25px',
                  flex: 1
                }}>
                  {post.excerpt}
                </p>

                <Link 
                  href={`/blog/${post.id}`} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    color: 'var(--accent)', 
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    transition: 'gap 0.3s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.gap = '12px')}
                  onMouseLeave={(e) => (e.currentTarget.style.gap = '8px')}
                >
                  Continuar lendo <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
