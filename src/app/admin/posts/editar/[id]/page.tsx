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
  Plus,
  Music
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from "@/lib/supabaseClient";
import { useSite } from "@/context/SiteContext";
import { validateFileSignature, validateAudioSignature, logAudit } from "@/lib/security";
import RichTextEditor from '@/components/RichTextEditor';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { selectedSiteId } = useSite();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [uploadingAuthorPhoto, setUploadingAuthorPhoto] = useState(false);
  const authorFileInputRef = React.useRef<HTMLInputElement>(null);

  const [uploadingAudio, setUploadingAudio] = useState(false);
  const audioFileInputRef = React.useRef<HTMLInputElement>(null);
  
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    author_name: '',
    author_description: '',
    author_image_url: '',
    category_id: '',
    status: '',
    content: '',
    image_url: '',
    audio_url: '',
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
    if (!client) {
      setLoadingCategories(false);
      return;
    }
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
    if (!newCategoryName.trim()) return;

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
    if (!client) {
      setLoading(false);
      return;
    }
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
          author_name: data.author_name || '',
          author_description: data.author_description || '',
          author_image_url: data.author_image_url || '',
          category_id: data.category_id || '',
          status: data.status || '',
          content: data.content || '',
          image_url: data.image_url || '',
          audio_url: data.audio_url || '',
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

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValid = await validateAudioSignature(file);
    if (!isValid) {
      alert("Arquivo inválido. Por favor, envie um áudio real (MP3, WAV, OGG ou M4A).");
      await logAudit("UPLOAD_REJECTED", "storage", file.name, null, { reason: "invalid_audio_signature", type: file.type });
      return;
    }

    setUploadingAudio(true);
    try {
      const client = supabase;
      if (!client) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `audio_${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await client.storage
        .from('blog_covers')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = client.storage
        .from('blog_covers')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, audio_url: publicUrl }));
      await logAudit("UPLOAD_SUCCESS", "storage", fileName, null, { bucket: "blog_covers", type: "audio" });
    } catch (err: any) {
      console.error('Erro no upload do áudio:', err);
      alert('Erro ao fazer upload do áudio.');
      await logAudit("UPLOAD_ERROR", "storage", file.name, null, { error: err.message });
    } finally {
      setUploadingAudio(false);
      if (audioFileInputRef.current) audioFileInputRef.current.value = '';
    }
  };

  const handleAuthorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValid = await validateFileSignature(file);
    if (!isValid) {
      alert("Arquivo inválido. Por favor, envie uma imagem real (JPG, PNG, GIF ou WebP).");
      await logAudit("UPLOAD_REJECTED", "storage", file.name, null, { reason: "invalid_signature", type: file.type });
      return;
    }

    setUploadingAuthorPhoto(true);
    try {
      const client = supabase;
      if (!client) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `author_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error: uploadError } = await client.storage
        .from('blog_covers')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = client.storage
        .from('blog_covers')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, author_image_url: publicUrl }));
      await logAudit("UPLOAD_SUCCESS", "storage", filePath, null, { bucket: "blog_covers" });
    } catch (err: any) {
      console.error('Erro no upload da foto do autor:', err);
      alert('Erro ao fazer upload da foto.');
      await logAudit("UPLOAD_ERROR", "storage", file.name, null, { error: err.message });
    } finally {
      setUploadingAuthorPhoto(false);
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
      // Preservar o slug existente; só gerar um novo se ainda não houver
      const slug = formData.slug || (() => {
        const base = formData.title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");
        return `${base}-${Date.now().toString(36)}`;
      })();

      // Obter nome da categoria
      const categoryName = categories.find(c => c.id === formData.category_id)?.nome || "";

      // Preparar payload alinhado com o banco de dados
      // Normaliza &nbsp; (e o caractere U+00A0) inserido pelo editor Quill no lugar de espacos
      // normais — sem isso o texto nao quebra linha corretamente na pagina publicada.
      const cleanContent = (formData.content || '').replace(/&nbsp;|\u00a0/g, ' ');

      const updateData = {
        // Colunas em Inglês
        title: formData.title,
        content: cleanContent,
        image_url: formData.image_url || null,
        status: formData.status,
        slug: slug,
        author_id: null,
        category_id: formData.category_id && formData.category_id.length === 36 ? formData.category_id : null,
        excerpt: cleanContent.substring(0, 160).replace(/<[^>]*>/g, ''),
        published_at: formData.status === 'published' || formData.status === 'Publicado' ? new Date().toISOString() : null,
        seo_title: formData.title,
        seo_description: cleanContent.substring(0, 160).replace(/<[^>]*>/g, ''),

        // Colunas em Português
        titulo: formData.title,
        autor: formData.author_name || "",
        categoria: categoryName,
        conteudo: cleanContent,
        imagem_url: formData.image_url || null,
        resumo: cleanContent.substring(0, 160).replace(/<[^>]*>/g, ''),
        updated_at: new Date().toISOString(),

        // Novas colunas customizadas
        author_name: formData.author_name || null,
        author_description: formData.author_description || null,
        author_image_url: formData.author_image_url || null,
        audio_url: formData.audio_url || null
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
            <Field label="Nome do Autor (Opcional)">
              <input 
                type="text"
                placeholder="Ex: Dr. Lucas Dohmen"
                value={formData.author_name}
                onChange={(e) => setFormData({...formData, author_name: e.target.value})}
                style={inputStyle}
              />
            </Field>

            <Field label="Descrição Curta (Opcional)">
              <textarea 
                placeholder="Ex: Advogado Especialista em Direito da Saúde..."
                value={formData.author_description}
                onChange={(e) => setFormData({...formData, author_description: e.target.value})}
                rows={3}
                style={{ ...inputStyle, resize: 'vertical', minHeight: '80px', fontFamily: 'inherit' }}
              />
            </Field>

            <Field label="Foto do Autor (Opcional)">
              <input 
                type="file"
                ref={authorFileInputRef}
                onChange={handleAuthorImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div 
                  onClick={() => authorFileInputRef.current?.click()}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    border: '2px dashed #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    position: 'relative',
                    background: formData.author_image_url ? `url(${formData.author_image_url}) center/cover` : '#f8fafc',
                    transition: 'all 0.2s ease',
                    flexShrink: 0
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = '#1e293b'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  {uploadingAuthorPhoto ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : !formData.author_image_url ? (
                    <Plus size={20} />
                  ) : null}
                </div>
                {formData.author_image_url ? (
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, author_image_url: ''})}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Remover Foto
                  </button>
                ) : (
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Clique para enviar</span>
                )}
              </div>
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

          <Card title="Áudio do Artigo">
            <input
              type="file"
              ref={audioFileInputRef}
              onChange={handleAudioUpload}
              accept="audio/mpeg,audio/mp3,audio/x-mpeg,audio/x-mp3,audio/wav,audio/wave,audio/ogg,audio/mp4,audio/m4a,audio/x-m4a,.mp3,.wav,.ogg,.m4a,.mp4"
              style={{ display: 'none' }}
            />
            {!formData.audio_url ? (
              <div
                onClick={() => audioFileInputRef.current?.click()}
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  border: '2px dashed #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94a3b8',
                  cursor: uploadingAudio ? 'not-allowed' : 'pointer',
                  padding: '32px 16px',
                  background: '#f8fafc',
                  transition: 'all 0.2s ease',
                  gap: '8px'
                }}
                onMouseOver={(e) => { if (!uploadingAudio) e.currentTarget.style.borderColor = '#1e293b'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
              >
                {uploadingAudio ? (
                  <Loader2 size={28} className="animate-spin" />
                ) : (
                  <>
                    <Music size={28} />
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>Clique para Upload</span>
                    <span style={{ fontSize: '11px', color: '#cbd5e1' }}>MP3, WAV, OGG ou M4A</span>
                  </>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--accent, #4caf50)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Music size={18} color="white" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', display: 'block' }}>
                      Áudio enviado
                    </span>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                      Será exibido no artigo
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => audioFileInputRef.current?.click()}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#1e293b',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Trocar Áudio
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, audio_url: '' })}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Remover Áudio
                  </button>
                </div>
              </div>
            )}
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
