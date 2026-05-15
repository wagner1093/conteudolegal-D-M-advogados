'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Calendar, User } from 'lucide-react';

import { supabase } from '@/lib/supabaseClient';

const spring = { type: 'spring' as const, stiffness: 180, damping: 25 };

const BlogSection = () => {
  const [latestPosts, setLatestPosts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchLatestPosts();
  }, []);

  const fetchLatestPosts = async () => {
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
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setLatestPosts(data || []);
    } catch (err) {
      console.error('Erro ao buscar posts:', err);
    } finally {
      setLoading(false);
    }
  };
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
              Conhecimento <span style={{ color: 'var(--accent)', fontFamily: "'Outfit', sans-serif", fontStyle: 'italic', fontWeight: 700 }}>Jurídico</span> <br />em Atualização
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
          gridTemplateColumns: loading ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '32px' 
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', gridColumn: '1 / -1' }}>
              <div className="loader" style={{ 
                width: '30px', 
                height: '30px', 
                border: '2px solid var(--border)', 
                borderTopColor: 'var(--accent)', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite',
                margin: '0 auto 15px'
              }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Carregando artigos...</p>
            </div>
          ) : latestPosts.length > 0 ? (
            latestPosts.map((post, index) => (
              <Link 
                key={post.id}
                href={`/blog/${post.slug || post.id}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
              <motion.div
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
                  transition: 'all 0.3s ease',
                  maxWidth: '450px'
                }}
              >
                {/* Image Container */}
                <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                  <img 
                    src={post.image_url || '/images/blog/health-law.png'} 
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
                    {post.site_dm_advogados_categorias?.nome || 'Geral'}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '15px', color: 'var(--text-light)', fontSize: '0.85rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} color="var(--accent)" /> {new Date(post.created_at).toLocaleDateString('pt-BR')}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={14} color="var(--accent)" /> {post.autor || post.author_name || 'Equipe D&M'}
                    </span>
                  </div>
                  
                  <h3 style={{ 
                    fontSize: '1.4rem', 
                    color: 'var(--primary)', 
                    marginBottom: '15px',
                    lineHeight: 1.3,
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: '-0.01em',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word'
                  }}>
                    {post.title || post.titulo}
                  </h3>
                  
                  <p style={{ 
                    color: 'var(--text-light)', 
                    fontSize: '0.95rem', 
                    lineHeight: 1.6,
                    marginBottom: '25px',
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word'
                  }}>
                    {String(post.resumo || post.summary || post.content || '').replace(/<[^>]*>/g, '').replace(/&nbsp;|\u00A0|&[a-zA-Z0-9#]+;/gi, ' ').substring(0, 150) + '...'}
                  </p>

                  <div 
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
                  </div>
                </div>
              </motion.div>
              </Link>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', gridColumn: '1 / -1' }}>
              <p style={{ color: 'var(--text-light)', fontSize: '1rem' }}>Nenhum artigo publicado ainda.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
