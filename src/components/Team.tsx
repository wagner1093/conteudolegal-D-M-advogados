'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

const spring = { type: 'spring' as const, stiffness: 180, damping: 25 };

const Team = () => {
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('site_dm_advogados_equipe')
        .select('*')
        .order('ordem', { ascending: true })
        .order('nome', { ascending: true });

      if (error) throw error;
      if (data) {
        setMembers(data);
      }
    } catch (err) {
      console.error('Erro ao buscar equipe:', err);
    }
  };

  return (
    <section id="equipe" style={{ padding: '100px 24px', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
      <div className="container" style={{ maxWidth: 1100 }}>
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
              Talento e dedicação em cada detalhe
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
              key={member.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              <div className="team-card">
                <div 
                  className="team-card-image" 
                  style={{ 
                    backgroundImage: member.imagem_url ? `url(${member.imagem_url})` : 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }} 
                >
                  {!member.imagem_url && (
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Foto Indisponível
                    </span>
                  )}
                </div>

                <div className="team-card__content">
                  <h3 className="team-card__title">{member.nome}</h3>
                  <p className="team-card__role">{member.cargo}</p>
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
