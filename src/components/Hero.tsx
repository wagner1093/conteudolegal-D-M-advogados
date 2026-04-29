'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const spring = { type: 'spring' as const, stiffness: 200, damping: 24 };



const Hero = () => {
  return (
    <section
      id="hero"
      className="hero-section"
      style={{
        padding: 0,
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'var(--primary-deep)', // Base color
      }}
    >
      {/* GLOBAL BACKGROUND IMAGE WITH OPACITY */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/images/fundo-geral.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.25, // Increased visibility as requested
        zIndex: 0
      }} />

      {/* LEFT PANEL */}
      <div
        className="hero-left-panel"
        style={{
          backgroundColor: 'transparent', // Consistent with the right side
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden',
          zIndex: 1,
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
            Excelência jurídica nacional
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
          Cuidar da saúde também é <span style={{ whiteSpace: 'nowrap' }}>uma <span style={{ color: 'var(--accent)', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 700 }}>decisão jurídica.</span></span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.26 }}
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '1rem',
            maxWidth: 480,
            lineHeight: 1.75,
            marginBottom: 44,
            willChange: 'transform',
          }}
        >
          Atuação estratégica em direito da saúde, erro médico e relações de consumo, com foco na resolução de conflitos complexos e na proteção de pacientes e profissionais.
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
            Entrar em contato <ArrowRight size={16} />
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
            Ver áreas de atuação
          </a>
        </motion.div>


      </div>

      {/* RIGHT PANEL — Now showing global background */}
      <div className="hero-right-panel" style={{ position: 'relative', overflow: 'hidden', backgroundColor: 'transparent', zIndex: 1 }}>
        {/* Gradients removed as requested to show only the horizontal background image */}
      </div>
    </section>
  );
};

export default Hero;
