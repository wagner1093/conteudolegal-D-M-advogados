'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Image as ImageIcon, 
  Loader2, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from "@/lib/supabaseClient";

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    titulo: '',
    autor: 'Dr. Roberto Matta',
    categoria: 'Direito da Saúde',
    status: 'Publicado',
    conteudo: '',
    imagem_url: '',
    resumo: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('site_dm_advogados_posts')
        .insert([{
          ...formData,
          visualizacoes: 0
        }]);

      if (insertError) throw insertError;
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/posts');
      }, 2000);
    } catch (err: any) {
      console.error('Erro ao criar post:', err);
      setError('Erro ao salvar o artigo. Verifique os campos e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ 
        height: '70vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center' 
      }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '50%', 
          backgroundColor: '#f0fdf4', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginBottom: '24px'
        }}>
          <CheckCircle2 size={40} color="#22c55e" />
        </div>
        <h2 style={{ fontSize: '24px', color: '#0B1E2D', fontWeight: 700, marginBottom: '12px' }}>
          Artigo Criado com Sucesso!
        </h2>
        <p style={{ color: '#64748b' }}>Redirecionando para a listagem...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <Link 
            href="/admin/posts" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              color: '#64748b', 
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '12px'
            }}
          >
            <ArrowLeft size={16} /> Voltar para Artigos
          </Link>
          <h1 style={{ fontSize: '28px', color: '#0B1E2D', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Novo Artigo
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            type="button"
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              background: '#fff',
              border: '1px solid #e2e8f0',
              color: '#64748b',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <Eye size={18} /> Visualizar
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: '10px 24px',
              borderRadius: '10px',
              background: '#0B1E2D',
              color: '#fff',
              border: 'none',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.8 : 1
            }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Publicar Artigo
          </button>
        </div>
      </div>

      {error && (
        <div style={{ 
          backgroundColor: '#fef2f2', 
          border: '1px solid #fecaca', 
          padding: '16px', 
          borderRadius: '12px', 
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#dc2626',
          fontSize: '14px',
          fontWeight: 500
        }}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <form style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px' }}>
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card>
            <Field label="Título do Artigo">
              <input 
                type="text"
                placeholder="Ex: Novos Direitos do Paciente em 2026"
                value={formData.titulo}
                onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                style={inputStyle}
              />
            </Field>

            <Field label="Resumo (Opcional)">
              <textarea 
                placeholder="Uma breve descrição para a listagem..."
                rows={3}
                value={formData.resumo}
                onChange={(e) => setFormData({...formData, resumo: e.target.value})}
                style={{...inputStyle, resize: 'vertical'}}
              />
            </Field>

            <Field label="Conteúdo do Artigo">
              <textarea 
                placeholder="Escreva seu artigo aqui..."
                rows={15}
                value={formData.conteudo}
                onChange={(e) => setFormData({...formData, conteudo: e.target.value})}
                style={{...inputStyle, resize: 'vertical', fontFamily: 'inherit'}}
              />
            </Field>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card title="Configurações">
            <Field label="Autor">
              <select 
                value={formData.autor}
                onChange={(e) => setFormData({...formData, autor: e.target.value})}
                style={inputStyle}
              >
                <option>Dr. Roberto Matta</option>
                <option>Dra. Ana Dohmen</option>
                <option>Equipe DMA</option>
              </select>
            </Field>

            <Field label="Categoria">
              <select 
                value={formData.categoria}
                onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                style={inputStyle}
              >
                <option>Direito da Saúde</option>
                <option>Erro Médico</option>
                <option>Planos de Saúde</option>
                <option>Regulatório</option>
                <option>Tecnologia</option>
              </select>
            </Field>

            <Field label="Status">
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                style={inputStyle}
              >
                <option>Publicado</option>
                <option>Rascunho</option>
                <option>Agendado</option>
              </select>
            </Field>
          </Card>

          <Card title="Imagem de Capa">
            <div style={{
              width: '100%',
              height: '160px',
              borderRadius: '12px',
              border: '2px dashed #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative',
              background: formData.imagem_url ? `url(${formData.imagem_url}) center/cover` : '#f8fafc'
            }}>
              {!formData.imagem_url && (
                <>
                  <ImageIcon size={32} style={{ marginBottom: '8px' }} />
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>URL da Imagem</span>
                </>
              )}
            </div>
            <input 
              type="text"
              placeholder="https://..."
              value={formData.imagem_url}
              onChange={(e) => setFormData({...formData, imagem_url: e.target.value})}
              style={{ ...inputStyle, marginTop: '12px', fontSize: '12px' }}
            />
          </Card>
        </div>
      </form>
    </div>
  );
}

function Card({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
      border: '1px solid #f1f5f9'
    }}>
      {title && <h3 style={{ fontSize: '14px', color: '#0B1E2D', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>{title}</h3>}
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '10px',
  border: '1px solid #e2e8f0',
  fontSize: '14px',
  color: '#0B1E2D',
  outline: 'none',
  transition: 'border-color 0.2s',
  background: '#f8fafc'
};
