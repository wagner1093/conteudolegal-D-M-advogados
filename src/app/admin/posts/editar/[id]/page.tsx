'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Eye,
  ImageIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from "@/lib/supabaseClient";
import { validateFileSignature, logAudit } from "@/lib/security";
import RichTextEditor from '@/components/RichTextEditor';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const selectedSiteId = process.env.NEXT_PUBLIC_SITE_ID;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    author_id: '',
    category_id: '',
    status: '',
    content: '',
    image_url: '',
    slug: ''
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchCategories();
    }
  }, [id]);

  const fetchCategories = async () => {
    const client = supabase;
    if (!client || !selectedSiteId) return;
    try {
      const { data, error } = await client
        .from('site_dm_advogados_categorias')
        .select('id, nome')
        .order('nome');

      if (error) throw error;
      if (data) {
        setCategories(data);
      }
    } catch (err) {
      console.error('Erro ao buscar categorias:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim() || !selectedSiteId) return;

    const client = supabase;
    if (!client) return;

    setSaving(true);
    try {
      const slug = newCategoryName.trim().toLowerCase().replace(/ /g, '-');
      const { data, error } = await client
        .from('site_dm_advogados_categorias')
        .insert([{
          nome: newCategoryName.trim(),
          slug: slug
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setCategories(prev => [...prev, data].sort((a, b) => a.nome.localeCompare(b.nome)));
        setFormData(prev => ({ ...prev, category_id: data.id }));
      }
      setNewCategoryName('');
      setIsAddingCategory(false);
    } catch (err) {
      console.error('Erro ao adicionar categoria:', err);
      alert('Erro ao adicionar categoria. Talvez ela já exista?');
    } finally {
      setSaving(false);
    }
  };

  const fetchPost = async () => {
    const client = supabase;
    if (!client) return;
    try {
      const { data, error: fetchError } = await client
        .from('site_dm_advogados_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      if (data) {
        setFormData({
          title: data.title || '',
          author_id: data.author_id || '',
          category_id: data.category_id || '',
          status: data.status || '',
          content: data.content || '',
          image_url: data.image_url || '',
          slug: data.slug || ''
        });
      }
    } catch (err: any) {
      console.error('Erro ao buscar post:', err);
      setError('Não foi possível carregar o artigo.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Upload Hardening: Magic Byte Validation
    const isValid = await validateFileSignature(file);
    if (!isValid) {
      alert("Arquivo inválido. Por favor, envie uma imagem real (JPG, PNG, GIF ou WebP).");
      await logAudit("UPLOAD_REJECTED", "storage", file.name, null, { reason: "invalid_signature", type: file.type });
      return;
    }

    setUploading(true);
    try {
      const client = supabase;
      if (!client) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error: uploadError } = await client.storage
        .from('blog_covers')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = client.storage
        .from('blog_covers')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      await logAudit("UPLOAD_SUCCESS", "storage", filePath, null, { bucket: "blog_covers" });
    } catch (err: any) {
      console.error('Erro no upload:', err);
      alert('Erro ao fazer upload da imagem.');
      await logAudit("UPLOAD_ERROR", "storage", file.name, null, { error: err.message });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const client = supabase;
    if (!client) {
      console.error("Database client not initialized");
      return;
    }
    setSaving(true);
    setError(null);

    try {
      const slug = formData.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

      // Obter nome da categoria
      const categoryName = categories.find(c => c.id === formData.category_id)?.nome || "";

      // Preparar payload alinhado com o banco de dados
      const updateData = {
        // Colunas em Inglês
        title: formData.title,
        content: formData.content,
        image_url: formData.image_url || null,
        status: formData.status,
        slug: slug,
        author_id: formData.author_id && formData.author_id.length === 36 ? formData.author_id : null,
        category_id: formData.category_id && formData.category_id.length === 36 ? formData.category_id : null,
        excerpt: formData.content.substring(0, 160).replace(/<[^>]*>/g, ''),
        published_at: formData.status === 'published' || formData.status === 'Publicado' ? new Date().toISOString() : null,
        seo_title: formData.title,
        seo_description: formData.content.substring(0, 160).replace(/<[^>]*>/g, ''),

        // Colunas em Português
        titulo: formData.title,
        autor: formData.author_id, // Usar o texto inserido no campo
        categoria: categoryName,
        conteudo: formData.content,
        imagem_url: formData.image_url || null,
        resumo: formData.content.substring(0, 160).replace(/<[^>]*>/g, ''),
        updated_at: new Date().toISOString()
      };

      const { error: updateError } = await client
        .from('site_dm_advogados_posts')
        .update(updateData)
        .eq('id', id);

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/posts');
      }, 2000);
    } catch (err: any) {
      console.error("Erro ao atualizar post:", err);
      setError(err.message || "Erro ao atualizar o artigo. Verifique os campos e tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={40} className="animate-spin" color="#1e293b" />
      </div>
    );
  }

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
        <h2 style={{ fontSize: '24px', color: '#1e293b', fontWeight: 700, marginBottom: '12px' }}>
          Artigo Atualizado!
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
          <h1 style={{ fontSize: '28px', color: '#1e293b', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Editar Artigo
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              padding: '10px 24px',
              borderRadius: '10px',
              background: '#1e293b',
              color: '#fff',
              border: 'none',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.8 : 1
            }}
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Salvar Alterações
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
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                style={inputStyle}
              />
            </Field>

            <Field label="Conteúdo do Artigo">
              <RichTextEditor
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content: content })}
                placeholder="Escreva seu artigo aqui..."
              />
            </Field>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card title="Configurações">
            <Field label="ID do Autor (Opcional)">
              <input
                type="text"
                placeholder="ID do Usuário ou deixe em branco"
                value={formData.author_id}
                onChange={(e) => setFormData({ ...formData, author_id: e.target.value })}
                style={inputStyle}
              />
            </Field>

            <Field label="Categoria">
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    style={{ ...inputStyle, flex: 1 }}
                    disabled={loadingCategories}
                  >
                    {loadingCategories ? (
                      <option>Carregando...</option>
                    ) : (
                      categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nome}</option>
                      ))
                    )}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(!isAddingCategory)}
                    style={{
                      padding: '0 12px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      background: isAddingCategory ? '#1e293b' : '#fff',
                      color: isAddingCategory ? '#fff' : '#1e293b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    title="Adicionar Nova Categoria"
                  >
                    <Plus size={20} style={{ transform: isAddingCategory ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                </div>

                <AnimatePresence>
                  {isAddingCategory && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      style={{
                        marginTop: '12px',
                        padding: '16px',
                        background: '#fff',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                        zIndex: 10
                      }}
                    >
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Nova Categoria
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input
                          type="text"
                          placeholder="Digite o nome..."
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          autoFocus
                          style={{
                            ...inputStyle,
                            background: '#f8fafc',
                            borderColor: '#cbd5e1'
                          }}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={handleAddCategory}
                            style={{
                              flex: 1,
                              padding: '10px',
                              borderRadius: '8px',
                              background: '#1e293b',
                              color: '#fff',
                              border: 'none',
                              fontWeight: 700,
                              fontSize: '13px',
                              cursor: 'pointer',
                              boxShadow: '0 4px 6px -1px rgba(30, 41, 59, 0.2)'
                            }}
                          >
                            Criar Categoria
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsAddingCategory(false)}
                            style={{
                              padding: '10px 16px',
                              borderRadius: '8px',
                              background: '#f1f5f9',
                              color: '#64748b',
                              border: 'none',
                              fontWeight: 600,
                              fontSize: '13px',
                              cursor: 'pointer'
                            }}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Field>

            <Field label="Status">
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                style={inputStyle}
              >
                <option value="published">Publicado</option>
                <option value="draft">Rascunho</option>
                <option value="scheduled">Agendado</option>
              </select>
            </Field>
          </Card>

          <Card title="Imagem de Capa">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
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
                background: formData.image_url ? `url(${formData.image_url}) center/cover` : '#f8fafc',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = '#1e293b'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              {uploading ? (
                <Loader2 size={32} className="animate-spin" />
              ) : !formData.image_url ? (
                <>
                  <ImageIcon size={32} style={{ marginBottom: '8px' }} />
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>Clique para Upload</span>
                </>
              ) : (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'rgba(30, 41, 59, 0.7)',
                  color: '#fff',
                  padding: '8px',
                  fontSize: '11px',
                  textAlign: 'center',
                  fontWeight: 600
                }}>
                  Alterar Imagem
                </div>
              )}
            </div>
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
      {title && <h3 style={{ fontSize: '14px', color: '#1e293b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>{title}</h3>}
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
  color: '#1e293b',
  outline: 'none',
  transition: 'border-color 0.2s',
  background: '#f8fafc'
};
