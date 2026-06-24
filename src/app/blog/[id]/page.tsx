'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, User, ArrowLeft, Share2, Clock } from 'lucide-react';

const FacebookIcon = ({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const TwitterIcon = ({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
  </svg>
);

const LinkedinIcon = ({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { supabase } from '@/lib/supabaseClient';
import DOMPurify from 'dompurify';

const BlogPostPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const [post, setPost] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    const client = supabase;
    const siteId = process.env.NEXT_PUBLIC_SITE_ID;
    if (!client) {
      setLoading(false);
      return;
    }

    try {
      // Sanitizar o ID para prevenir injeção de filtros
      const sanitizedId = id.replace(/[^a-zA-Z0-9\-]/g, '');
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sanitizedId);
      
      let query = client
        .from('site_dm_advogados_posts')
        .select('*, site_dm_advogados_categorias(nome)')
        .is('deleted_at', null);
        
      if (isUuid) {
        query = query.eq('id', sanitizedId);
      } else {
        query = query.eq('slug', sanitizedId);
      }

      const { data, error } = await query.maybeSingle();

      if (error) throw error;
      setPost(data);
    } catch (err) {
      console.error('Erro ao buscar post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || '';
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <main style={{ backgroundColor: 'var(--white)' }}>
      <Navbar />

      {/* Loading/Error State */}
      {(loading || !post) && (
        <section style={{ padding: '200px 24px', textAlign: 'center', backgroundColor: 'var(--primary-deep)', color: 'white' }}>
          {loading ? (
            <div className="loader" style={{ 
              width: '40px', 
              height: '40px', 
              border: '3px solid rgba(255,255,255,0.1)', 
              borderTopColor: 'var(--accent)', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }} />
          ) : (
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Artigo não encontrado</h2>
              <Link href="/blog" style={{ color: 'var(--accent)', fontWeight: 600 }}>Voltar para o Blog</Link>
            </div>
          )}
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </section>
      )}

      {post && !loading && (
        <>
          {/* Post Header */}
          <section style={{ 
            padding: '180px 24px 120px', 
            backgroundColor: 'var(--primary-deep)',
            color: '#ffffff',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1
          }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/blog" style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              color: 'var(--accent)', 
              textDecoration: 'none',
              marginBottom: '40px',
              fontSize: '0.9rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              <ArrowLeft size={16} /> Voltar para Artigos
            </Link>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '32px' }}>
              <span style={{ 
                backgroundColor: 'rgba(76, 175, 80, 0.15)', 
                color: 'var(--accent)', 
                padding: '8px 20px', 
                borderRadius: '50px', 
                fontSize: '0.85rem', 
                fontWeight: 700,
                border: '1px solid var(--accent)',
                textTransform: 'uppercase'
              }}>
                {post.site_dm_advogados_categorias?.nome || 'Geral'}
              </span>
            </div>

            <motion.h1 
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ 
                fontSize: 'clamp(2rem, 4vw, 3.5rem)', 
                lineHeight: 1.1, 
                marginBottom: '32px',
                fontWeight: 600,
                color: '#ffffff',
                fontFamily: "'Inter', sans-serif",
                letterSpacing: '-0.02em'
              }}
            >
              {post.title}
            </motion.h1>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '30px',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '1rem',
              flexWrap: 'wrap'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={18} color="var(--accent)" /> {new Date(post.created_at).toLocaleDateString('pt-BR')}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <User size={18} color="var(--accent)" /> {post.author_name || post.autor || 'Equipe'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={18} color="var(--accent)" /> {post.tempo_leitura || '5 min'} de leitura
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      <section style={{ marginTop: '-80px', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ 
              borderRadius: '24px', 
              overflow: 'hidden', 
              boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
              height: '500px'
            }}
          >
            <img 
              src={post.image_url || '/images/blog/health-law.png'} 
              alt={post.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section style={{ padding: '80px 24px 120px' }}>
        <div className="container blog-article-grid" style={{ 
          maxWidth: '1200px', 
          display: 'grid', 
          gridTemplateColumns: '1fr 300px', 
          gap: '80px',
          margin: '0 auto'
        }}>
          
          {/* Main Article */}
          <article>
            <div 
              style={{ 
                overflowWrap: 'break-word'
              }}
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize((post.content || '').replace(/&nbsp;|\u00a0/g, ' '), { ALLOWED_TAGS: ['p','br','strong','em','b','i','u','a','h1','h2','h3','h4','h5','h6','ul','ol','li','blockquote','img','span','div','table','thead','tbody','tr','th','td','pre','code','hr','sub','sup'], ALLOWED_ATTR: ['href','src','alt','title','target','rel','class','style','width','height'] }) }}
            />

            {/* Social Share */}
            <div style={{ 
              marginTop: '60px', 
              paddingTop: '40px', 
              borderTop: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Compartilhar:</span>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {[
                    { Icon: FacebookIcon, label: 'facebook' },
                    { Icon: TwitterIcon, label: 'twitter' },
                    { Icon: LinkedinIcon, label: 'linkedin' }
                  ].map((social, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleShare(social.label)}
                      style={{ 
                        width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--border)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        backgroundColor: 'white', transition: 'all 0.3s ease',
                        padding: 0
                      }} 
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')} 
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                    >
                      <social.Icon size={18} color="var(--primary)" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside>
            <div style={{ position: 'sticky', top: '100px' }}>
              {/* Author Bio */}
              <div style={{ 
                backgroundColor: 'var(--bg-secondary)', padding: '32px', borderRadius: '24px', marginBottom: '40px' 
              }}>
                <h4 style={{ color: 'var(--primary)', marginBottom: '16px', fontWeight: 700 }}>Sobre o Autor</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  {post.author_image_url ? (
                    <img
                      src={post.author_image_url}
                      alt={post.author_name || 'Autor'}
                      style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid var(--accent)' }}
                    />
                  ) : (
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <User size={30} color="white" />
                    </div>
                  )}
                  <div>
                    <span style={{ display: 'block', fontWeight: 700, color: 'var(--primary)', fontFamily: "'Inter', sans-serif" }}>
                      {post.author_name || post.autor || 'Equipe'}
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: 1.5 }}>
                  {post.author_description || 'Atua há mais de 10 anos em causas complexas de Direito da Saúde e Bioética.'}
                </p>
              </div>

              {/* CTA Widget */}
              <div style={{ 
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-deep) 100%)', 
                padding: '32px', borderRadius: '24px', color: 'white'
              }}>
                <h4 style={{ marginBottom: '16px', fontWeight: 700, fontSize: '1.2rem' }}>Precisa de orientação jurídica?</h4>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '24px', lineHeight: 1.5 }}>
                  Fale com nossos especialistas agora mesmo e tire suas dúvidas.
                </p>
                <a href="https://wa.me/5547992793347" className="btn btn-accent" style={{ width: '100%', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', display: 'block', padding: '14px' }}>
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />

        </>
      )}
    </main>
  );
};

export default BlogPostPage;
