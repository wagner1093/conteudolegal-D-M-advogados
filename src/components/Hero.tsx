'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const spring = { type: 'spring' as const, stiffness: 200, damping: 24 };

const stats = [
  { value: '500+', label: 'Clientes Atendidos' },
  { value: '10+', label: 'Anos de Experiência' },
  { value: '98%', label: 'Taxa de Sucesso' },
];

const Hero = () => {
  return (
    <section
      id="hero"
      className="hero-section"
      style={{
        padding: 0,
        minHeight: '100vh',
      }}
    >
      {/* LEFT PANEL */}
      <div
        className="hero-left-panel"
        style={{
          backgroundColor: 'var(--primary-deep)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          overflow: 'hidden',
        }}
      >
        {/* Decorative lines */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `repeating-linear-gradient(
            -45deg, transparent, transparent 60px,
            rgba(255,255,255,0.015) 60px, rgba(255,255,255,0.015) 61px
          )`,
          pointerEvents: 'none',
        }} />

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.1 }}
          style={{ marginBottom: 28, willChange: 'transform' }}
        >
          <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Excelência Jurídica em São Paulo
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.18 }}
          style={{
            color: '#fff',
            fontSize: 'clamp(2.4rem, 3.5vw, 3.8rem)',
            lineHeight: 1.08,
            marginBottom: 24,
            fontWeight: 600,
            willChange: 'transform',
          }}
        >
          Defendendo seus direitos com<br />
          <span style={{ color: 'var(--accent)' }}>estratégia e precisão.</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.26 }}
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '1rem',
            maxWidth: 460,
            lineHeight: 1.75,
            marginBottom: 44,
            willChange: 'transform',
          }}
        >
          Atendimento humanizado, transparente e estratégico nas áreas de Família, Consumidor, Cível, Empresarial e Saúde.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.34 }}
          style={{ display: 'flex', gap: 16, willChange: 'transform' }}
        >
          <a
            href="https://wa.me/5511987795023"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '14px 32px',
              backgroundColor: '#fff',
              color: 'var(--primary)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              border: '1px solid rgba(255,255,255,0.2)',
              transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease',
            }}
            onMouseOver={e => {
              e.currentTarget.style.backgroundColor = 'var(--accent)';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.borderColor = 'var(--accent)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.backgroundColor = '#fff';
              e.currentTarget.style.color = 'var(--primary)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            }}
          >
            Consulta Gratuita <ArrowRight size={16} />
          </a>

          <a
            href="#atuacao"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 20px',
              color: 'rgba(255,255,255,0.55)',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '0.9rem',
              transition: 'color 0.2s ease',
            }}
            onMouseOver={e => e.currentTarget.style.color = '#fff'}
            onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
          >
            Ver Áreas de Atuação
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="hero-stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            display: 'flex',
            gap: 48,
            marginTop: 64,
            paddingTop: 36,
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.55 + i * 0.07 }}
              style={{ willChange: 'transform' }}
            >
              <div style={{
                fontSize: 'clamp(1.8rem, 2.5vw, 2.4rem)',
                fontWeight: 600,
                color: '#fff',
                fontFamily: 'var(--font-headings)',
                letterSpacing: '-1px',
              }}>
                {s.value}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.38)',
                marginTop: 4,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* RIGHT PANEL — Photo */}
      <div className="hero-right-panel" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#c8d0d8' }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/images/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }} />
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '40%',
          background: 'linear-gradient(to top, rgba(8,25,41,0.6) 0%, transparent 100%)',
        }} />

        {/* Trust badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.7 }}
          style={{
            position: 'absolute',
            bottom: 40,
            right: 40,
            backgroundColor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(16px)',
            padding: '16px 20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            minWidth: 200,
            willChange: 'transform',
          }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>
            Assessores Jurídicos
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--accent)', fontSize: '1rem' }}>★★★★★</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 500 }}>4.9 Avaliação</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
