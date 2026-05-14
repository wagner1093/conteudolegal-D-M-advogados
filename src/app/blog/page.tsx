'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Calendar, User, Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { supabase } from '@/lib/supabaseClient';

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const client = supabase;
    const siteId = process.env.NEXT_PUBLIC_SITE_ID;
    if (!client) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await client
        .from('site_dm_advogados_posts')
        .select('*, site_dm_advogados_categorias(nome)')
        .in('status', ['published', 'Publicado'])
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Erro ao buscar posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const categoryName = post.site_dm_advogados_categorias?.nome || 'Geral';
    const matchesCategory = activeCategory === 'Todos' || categoryName === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.content?.toLowerCase().includes(searchQuery.toLowerCase());
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
              fontSize: 'clamp(2rem, 5vw, 4rem)', 
              color: 'var(--white)',
              lineHeight: 1.1,
              marginBottom: '24px',
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              letterSpacing: '-0.02em'
            }}>
              Blog Jurídico
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
            gridTemplateColumns: loading ? '1fr' : filteredPosts.length > 0 ? 'repeat(auto-fill, minmax(360px, 1fr))' : '1fr', 
            gap: '40px' 
          }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '100px 0', gridColumn: '1 / -1' }}>
                <div className="loader" style={{ 
                  width: '40px', 
                  height: '40px', 
                  border: '3px solid var(--border)', 
                  borderTopColor: 'var(--primary)', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto'
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <p style={{ marginTop: '20px', color: 'var(--text-light)', fontWeight: 500 }}>Carregando artigos...</p>
              </div>
            ) : filteredPosts.length > 0 ? (
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
                    src={post.image_url || '/images/blog/health-law.png'} 
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
                      {post.site_dm_advogados_categorias?.nome || 'Geral'}
                    </span>
                  </div>
                  
                  <h3 style={{ 
                    fontSize: '1.4rem', 
                    color: 'var(--primary)', 
                    marginBottom: '16px',
                    lineHeight: 1.25,
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: '-0.01em',
                    overflowWrap: 'break-word',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word'
                  }}>
                    {post.title || post.titulo}
                  </h3>
                  
                  <p style={{ 
                    color: 'var(--text-light)', 
                    fontSize: '1rem', 
                    lineHeight: 1.6,
                    marginBottom: '24px',
                    flex: 1,
                    overflowWrap: 'break-word',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word'
                  }}>
                    {post.resumo || post.summary || (post.conteudo || post.content)?.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
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
                      <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text)' }}>{post.autor || post.author_name || 'Equipe'}</span>
                    </div>
                    <Link href={`/blog/${post.slug || encodeURIComponent(post.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '').substring(0, 80) || post.id)}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
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
