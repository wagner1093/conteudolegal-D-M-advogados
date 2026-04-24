'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const links = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Atuação', href: '#atuacao' },
  { label: 'Sócios', href: '#socios' },
  { label: 'Equipe', href: '#equipe' },
  { label: 'Contato', href: '#contato' },
];

const spring = { type: 'spring' as const, stiffness: 300, damping: 30 };

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = links.map(l => l.href.replace('#', ''));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(`#${id}`);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...spring, delay: 0.05 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '0 40px',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: scrolled ? 'rgba(8,25,41,0.98)' : 'transparent',
          backgroundImage: scrolled ? 'none' : 'linear-gradient(to bottom, rgba(8,25,41,0.85) 0%, rgba(8,25,41,0) 100%)',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
          transition: 'background-color 0.4s ease, background-image 0.4s ease',
          willChange: 'transform',
        }}
      >
        {/* Logo */}
        <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img 
            src="/images/logo.png" 
            alt="Dohmen & Matta Advogados" 
            style={{ 
              height: '50px', 
              width: 'auto', 
              objectFit: 'contain'
            }} 
          />
        </a>

        {/* Desktop Nav */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              style={{
                color: active === link.href ? 'var(--accent)' : (scrolled ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.95)'),
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
                letterSpacing: '0.3px',
                transition: 'color 0.18s ease',
              }}
              onMouseOver={e => (e.currentTarget.style.color = '#fff')}
              onMouseOut={e => (e.currentTarget.style.color = active === link.href ? 'var(--accent)' : (scrolled ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.95)'))}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="desktop-nav">
          <a
            href="https://wa.me/5511987795023"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '9px 20px',
              border: '1px solid rgba(255,255,255,0.25)',
              color: '#fff',
              textDecoration: 'none',
              fontSize: '0.92rem',
              fontWeight: 500,
              transition: 'border-color 0.2s ease, background-color 0.2s ease',
            }}
            onMouseOver={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)';
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Fale Conosco <ArrowUpRight size={13} />
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-nav-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: '8px',
            display: 'none', // Overridden by CSS
          }}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </motion.header>

      {/* Mobile sliding overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(8,25,41,0.6)',
                backdropFilter: 'blur(4px)',
                zIndex: 98,
              }}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '80%',
                maxWidth: '400px',
                backgroundColor: 'var(--primary-deep)',
                zIndex: 99,
                padding: '100px 32px 40px',
                display: 'flex',
                flexDirection: 'column',
                gap: 32,
                boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
              }}
            >
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    color: active === link.href ? 'var(--accent)' : '#fff',
                    textDecoration: 'none',
                    fontSize: '1.5rem',
                    fontFamily: 'var(--font-headings)',
                    fontWeight: 600,
                  }}
                >
                  {link.label}
                </motion.a>
              ))}
              
              <motion.a
                href="https://wa.me/5511987795023"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + links.length * 0.05 }}
                onClick={() => setMenuOpen(false)}
                style={{
                  marginTop: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '16px',
                  backgroundColor: 'var(--accent)',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: '4px',
                }}
              >
                Fale Conosco <ArrowUpRight size={18} />
              </motion.a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
