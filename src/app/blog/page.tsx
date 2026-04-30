'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Calendar, User, Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const posts = [
  {
    id: 1,
    title: 'Novas atualizações no Direito da Saúde em 2024',
    excerpt: 'Entenda as principais mudanças regulatórias que impactam hospitais e profissionais da saúde neste ano. As atualizações focam na transparência e segurança do paciente.',
    date: '28 Abr, 2024',
    author: 'Dr. Lucas Dohmen',
    category: 'Direito da Saúde',
    image: '/images/blog/health-law.png',
  },
  {
    id: 2,
    title: 'Como prevenir litígios em casos de erro médico',
    excerpt: 'A importância do prontuário médico e da comunicação assertiva na mitigação de riscos jurídicos. Estratégias práticas para profissionais e instituições.',
    date: '15 Abr, 2024',
    author: 'Dr. Alexandre Matta',
    category: 'Erro Médico',
    image: '/images/blog/medical-risk.png',
  },
  {
    id: 3,
    title: 'Telemedicina: Aspectos Legais e Desafios Éticos',
    excerpt: 'Uma análise profunda sobre a regulamentação do atendimento remoto e a proteção de dados sensíveis. O que mudou com a nova resolução do CFM.',
    date: '05 Abr, 2024',
    author: 'Dra. Yarla Ferreira',
    category: 'Bioética',
    image: '/images/blog/telemedicine.png',
  },
  {
    id: 4,
    title: 'Responsabilidade Civil do Médico e LGPD',
    excerpt: 'Como a Lei Geral de Proteção de Dados impacta a rotina dos consultórios e a responsabilidade civil dos profissionais frente ao vazamento de dados.',
    date: '22 Mar, 2024',
    author: 'Dr. Rafael Jelezoglo',
    category: 'Digital',
    image: '/images/blog/health-law.png',
  },
  {
    id: 5,
    title: 'Direito do Paciente com Doenças Raras',
    excerpt: 'Os desafios jurídicos para a obtenção de medicamentos de alto custo e tratamentos experimentais no sistema público e privado.',
    date: '10 Mar, 2024',
    author: 'Dra. Bianca Fortes',
    category: 'Direito da Saúde',
    image: '/images/blog/medical-risk.png',
  },
  {
    id: 6,
    title: 'Compliance Hospitalar: Melhores Práticas',
    excerpt: 'Como implementar um programa de integridade eficaz em instituições de saúde para evitar fraudes e melhorar a governança corporativa.',
    date: '01 Mar, 2024',
    author: 'Dr. Luiz Gustavo Ricca',
    category: 'Compliance',
    image: '/images/blog/telemedicine.png',
  },

];

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'Todos' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main style={{ backgroundColor: 'var(--bg)' }}>
      <Navbar />
      
      {/* Hero Section */}
      <section style={{ 
        padding: '160px 24px 100px', 
        backgroundColor: 'var(--primary-deep)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(76, 175, 80, 0.05) 0%, transparent 50%)',
          zIndex: 0
        }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow" style={{ color: 'var(--accent)' }}>Conhecimento & Estratégia</span>
            <h1 style={{ 
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
              color: 'var(--white)',
              lineHeight: 1.08,
              marginBottom: '24px',
              fontWeight: 600,
              fontFamily: 'var(--font-headings)',
              letterSpacing: '-1px'
            }}>
              Blog <span style={{ color: 'var(--accent)', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 700 }}>Jurídico.</span>
            </h1>

            <p style={{ 
              color: 'rgba(255,255,255,0.7)', 
              fontSize: '1.2rem', 
              maxWidth: '600px',
              lineHeight: 1.6
            }}>
              Insights exclusivos sobre direito da saúde, bioética e as tendências que moldam o futuro do setor jurídico médico.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Content */}
      <section style={{ padding: '80px 24px' }}>
        <div className="container">
          {/* Filters/Search Bar */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '60px',
            flexWrap: 'wrap',
            gap: '24px'
          }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {['Todos', 'Direito da Saúde', 'Erro Médico', 'Bioética', 'Compliance', 'Digital'].map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '50px',
                    border: '1px solid',
                    borderColor: activeCategory === cat ? 'var(--primary)' : 'var(--border)',
                    backgroundColor: activeCategory === cat ? 'var(--primary)' : 'transparent',
                    color: activeCategory === cat ? 'white' : 'var(--text)',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', maxWidth: '350px', width: '100%' }}>
              <input 
                type="text" 
                placeholder="Pesquisar artigos..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 20px 14px 45px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'white',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
              <Search size={18} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            </div>
          </div>

          {/* Posts Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: filteredPosts.length > 0 ? 'repeat(auto-fill, minmax(360px, 1fr))' : '1fr', 
            gap: '40px' 
          }}>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  border: '1px solid var(--border)',
                  transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
              >
                <div style={{ height: '240px', overflow: 'hidden' }}>
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                
                <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 700, 
                      color: 'var(--accent)', 
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      {post.category}
                    </span>
                  </div>
                  
                  <h3 style={{ 
                    fontSize: '1.5rem', 
                    color: 'var(--primary)', 
                    marginBottom: '16px',
                    lineHeight: 1.2,
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
                    fontSize: '1rem', 
                    lineHeight: 1.6,
                    marginBottom: '24px',
                    flex: 1
                  }}>
                    {post.excerpt}
                  </p>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    paddingTop: '20px',
                    borderTop: '1px solid var(--border)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={16} color="var(--primary)" />
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text)' }}>{post.author}</span>
                    </div>
                    <Link href={`/blog/${post.id}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                      <motion.div whileHover={{ x: 5 }}>
                        <ArrowRight size={20} />
                      </motion.div>
                    </Link>
                  </div>
                </div>
              </motion.article>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ 
                  textAlign: 'center', 
                  padding: '100px 0', 
                  gridColumn: '1 / -1',
                  color: 'var(--text-light)'
                }}
              >
                <div style={{ marginBottom: '24px', opacity: 0.3 }}>
                  <Search size={64} style={{ margin: '0 auto' }} />
                </div>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '12px' }}>Nenhum resultado encontrado</h3>
                <p>Tente ajustar seus termos de pesquisa ou filtros para encontrar o que procura.</p>
                <button 
                  onClick={() => { setActiveCategory('Todos'); setSearchQuery(''); }}
                  style={{ 
                    marginTop: '24px', 
                    color: 'var(--primary)', 
                    background: 'none', 
                    border: 'none', 
                    fontWeight: 600, 
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Limpar todos os filtros
                </button>
              </motion.div>
            )}
          </div>

          {/* Pagination */}
          {filteredPosts.length > 0 && (
            <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '12px',
            marginTop: '80px' 
          }}>
            {[1, 2, 3].map(page => (
              <button 
                key={page}
                style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  backgroundColor: page === 1 ? 'var(--primary)' : 'white',
                  color: page === 1 ? 'white' : 'var(--text)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {page}
              </button>
            ))}
            <button style={{
              width: '45px',
              height: '45px',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              backgroundColor: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ChevronRight size={20} />
            </button>
          </div>
          )}
        </div>
      </section>


      <Footer />
    </main>
  );
};

export default BlogPage;
