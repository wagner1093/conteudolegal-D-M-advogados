'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, User, ArrowLeft, Share2, MessageSquare, Clock } from 'lucide-react';

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

const postsData = {
  '1': {
    title: 'Novas atualizações no Direito da Saúde em 2024',
    date: '28 Abr, 2024',
    author: 'Dr. Lucas Dohmen',
    category: 'Direito da Saúde',
    image: '/images/blog/health-law.png',
    readTime: '8 min',
    content: `
      <p>O cenário do Direito da Saúde no Brasil está passando por transformações significativas em 2024. Novas resoluções e decisões dos tribunais superiores têm moldado a forma como hospitais, clínicas e profissionais da saúde operam e se defendem juridicamente.</p>
      
      <h3>A Transparência como Pilar Fundamental</h3>
      <p>Uma das principais tendências deste ano é o reforço na transparência das informações. O dever de informar ao paciente não é mais apenas uma formalidade, mas um requisito essencial para a validade de qualquer procedimento. Isso inclui não apenas os riscos, mas também as alternativas de tratamento e as possíveis consequências da não realização do procedimento.</p>
      
      <h3>Novas Regulamentações da ANS</h3>
      <p>A Agência Nacional de Saúde Suplementar (ANS) atualizou recentemente o rol de procedimentos e eventos em saúde, trazendo novos desafios para as operadoras de planos de saúde e oportunidades para os pacientes que necessitam de tratamentos de alta complexidade.</p>
      
      <blockquote>
        "A segurança jurídica na área da saúde depende da conformidade rigorosa com as normas técnicas e éticas vigentes."
      </blockquote>
      
      <h3>Impactos para Profissionais da Saúde</h3>
      <p>Para o médico, a conformidade com a LGPD e o registro meticuloso em prontuários eletrônicos tornaram-se as melhores ferramentas de defesa preventiva. Em 2024, observamos um aumento no rigor da análise desses documentos em processos judiciais.</p>
      
      <p>Concluindo, manter-se atualizado com essas mudanças não é apenas uma necessidade acadêmica, mas uma estratégia vital para a sustentabilidade de qualquer prática médica contemporânea.</p>
    `
  },
  '2': {
    title: 'Como prevenir litígios em casos de erro médico',
    date: '15 Abr, 2024',
    author: 'Dr. Alexandre Matta',
    category: 'Gestão de Risco',
    image: '/images/blog/medical-risk.png',
    readTime: '12 min',
    content: `
      <p>A judicialização da medicina é um fenômeno crescente que preocupa toda a classe médica. No entanto, a grande maioria dos processos por suposto erro médico poderia ser evitada com medidas preventivas eficazes e uma gestão de risco assertiva.</p>
      
      <h3>A Importância do Prontuário Médico</h3>
      <p>O prontuário é o documento mais importante em uma defesa jurídica. Ele deve ser preenchido de forma clara, objetiva e, acima de tudo, contemporânea ao atendimento. Lacunas ou rasuras podem ser interpretadas negativamente em juízo.</p>
      
      <h3>Comunicação Médico-Paciente</h3>
      <p>A falha na comunicação é a causa raiz de mais de 70% dos processos judiciais. Estabelecer uma relação de confiança e garantir que o paciente compreenda as limitações da medicina é fundamental.</p>
      
      <h3>Termo de Consentimento Livre e Esclarecido (TCLE)</h3>
      <p>O TCLE não deve ser visto como um "escudo" burocrático, mas como um processo de diálogo. Documentar que o paciente foi devidamente esclarecido é a maior prova de boa-fé e respeito à autonomia.</p>
    `
  },
  '3': {
    title: 'Telemedicina: Aspectos Legais e Desafios Éticos',
    date: '05 Abr, 2024',
    author: 'Dra. Yarla Ferreira',
    category: 'Bioética',
    image: '/images/blog/telemedicine.png',
    readTime: '10 min',
    content: `
      <p>A consolidação da telemedicina trouxe agilidade ao sistema de saúde, mas também abriu uma série de discussões jurídicas sobre a responsabilidade profissional e a proteção de dados sensíveis.</p>
      
      <h3>Regulamentação Atual</h3>
      <p>Analisamos a última resolução do Conselho Federal de Medicina (CFM) que estabelece os critérios para a prática da telemedicina no Brasil, garantindo a autonomia do médico e a segurança do paciente.</p>
      
      <h3>Segurança de Dados e LGPD</h3>
      <p>O tráfego de informações de saúde por meios digitais exige plataformas seguras com criptografia de ponta a ponta. O uso de aplicativos de mensagens comuns para consultas pode acarretar sérias sanções administrativas e civis.</p>
      
      <h3>O Futuro da Bioética Digital</h3>
      <p>Como manter a humanização no atendimento remoto? Este é o grande desafio da bioética para os próximos anos. A tecnologia deve ser uma aliada, não um substituto para a ética médica tradicional.</p>
    `
  }
};

const BlogPostPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const post = postsData[id as keyof typeof postsData] || postsData['1'];

  return (
    <main style={{ backgroundColor: 'var(--white)' }}>
      <Navbar />

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
                {post.category}
              </span>
            </div>

            <motion.h1 
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ 
                fontSize: 'clamp(2.4rem, 5vw, 4rem)', 
                lineHeight: 1.08, 
                marginBottom: '32px',
                fontWeight: 600,
                color: '#ffffff',
                fontFamily: 'var(--font-headings)',
                letterSpacing: '-1px'
              }}
            >
              {post.title.split(' ').slice(0, -1).join(' ')} {' '}
              <span style={{ 
                color: 'var(--accent)', 
                fontFamily: "'Outfit', sans-serif", 
                fontStyle: 'italic', 
                fontWeight: 700 
              }}>
                {post.title.split(' ').slice(-1)}
              </span>
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
                <Calendar size={18} color="var(--accent)" /> {post.date}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <User size={18} color="var(--accent)" /> {post.author}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={18} color="var(--accent)" /> {post.readTime} de leitura
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
              src={post.image} 
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
                fontSize: '1.15rem', 
                lineHeight: 1.8, 
                color: '#374151' 
              }}
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
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
                  {[FacebookIcon, TwitterIcon, LinkedinIcon].map((Icon, i) => (
                    <button key={i} style={{ 
                      width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--border)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                      backgroundColor: 'white', transition: 'all 0.3s ease'
                    }} onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')} onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}>
                      <Icon size={18} color="var(--primary)" />
                    </button>
                  ))}
                </div>
              </div>
              
              <button style={{ 
                display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-secondary)', 
                border: 'none', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer',
                fontWeight: 600, color: 'var(--primary)', fontSize: '0.9rem'
              }}>
                <MessageSquare size={18} /> Comentar
              </button>
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
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={30} color="white" />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontWeight: 700, color: 'var(--primary)' }}>{post.author}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Advogado Especialista</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: 1.5 }}>
                  Atua há mais de 10 anos em causas complexas de Direito da Saúde e Bioética.
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
                <a href="https://wa.me/5511987795023" className="btn btn-accent" style={{ width: '100%', borderRadius: '12px' }}>
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />

    </main>
  );
};

export default BlogPostPage;
