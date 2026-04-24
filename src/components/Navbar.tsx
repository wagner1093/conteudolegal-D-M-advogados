'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

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
          backgroundColor: scrolled ? 'rgba(8,25,41,0.97)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          transition: 'background-color 0.35s ease, border-color 0.35s ease',
          willChange: 'transform',
        }}
      >
        {/* Logo */}
        <a href="#" style={{ textDecoration: 'none' }}>
          <span style={{
            fontFamily: 'var(--font-headings)',
            fontSize: '1.55rem',
            fontWeight: 600,
            color: '#fff',
            letterSpacing: '-0.5px',
          }}>
            DMA<span style={{ color: 'var(--accent)' }}>.</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              style={{
                color: active === link.href ? 'var(--accent)' : 'rgba(255,255,255,0.65)',
                textDecoration: 'none',
                fontSize: '0.83rem',
                fontWeight: 500,
                letterSpacing: '0.3px',
                transition: 'color 0.18s ease',
              }}
              onMouseOver={e => (e.currentTarget.style.color = '#fff')}
              onMouseOut={e => (e.currentTarget.style.color = active === link.href ? 'var(--accent)' : 'rgba(255,255,255,0.65)')}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
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
            fontSize: '0.83rem',
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
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: 72,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(8,25,41,0.98)',
              zIndex: 99,
              padding: '40px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: 32,
            }}
          >
            {links.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                onClick={() => setMenuOpen(false)}
                style={{
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: '2rem',
                  fontFamily: 'var(--font-headings)',
                  fontWeight: 600,
                  willChange: 'transform',
                }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
