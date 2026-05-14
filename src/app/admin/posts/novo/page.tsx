'use client';

import React, { useState } from 'react';
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
import { useRouter } from 'next/navigation';
import { supabase } from "@/lib/supabaseClient";
import { validateFileSignature, logAudit } from "@/lib/security";
import RichTextEditor from '@/components/RichTextEditor';

export default function NewPostPage() {
  const router = useRouter();
  const selectedSiteId = process.env.NEXT_PUBLIC_SITE_ID;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    author_id: '', // Seria o ID do usuário, mas podemos deixar opcional
    category_id: '',
    status: 'published',
    content: '',
    image_url: '',
    slug: ''
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(true);

  React.useEffect(() => {
    fetchCategories();
  }, []);

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
        if (data.length > 0 && !formData.category_id) {
          setFormData(prev => ({ ...prev, category_id: data[0].id }));
        }
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

    setLoading(true);
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
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiteId) return;

    setLoading(true);
    setError(null);

    try {
      const client = supabase;
      if (!client) throw new Error("Database client not initialized");
      
      const slug = formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      
      const { error: insertError } = await client
        .from('site_dm_advogados_posts')
        .insert([{
          ...formData,
          slug: slug,
          views: 0
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
          <h1 style={{ fontSize: '28px', color: '#1e293b', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Novo Artigo
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={handleSubmit}
            disabled={loading}
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
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                style={inputStyle}
              />
            </Field>

            <Field label="Conteúdo do Artigo">
              <RichTextEditor 
                value={formData.content}
                onChange={(content) => setFormData({...formData, content: content})}
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
                onChange={(e) => setFormData({...formData, author_id: e.target.value})}
                style={inputStyle}
              />
            </Field>

            <Field label="Categoria">
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select 
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
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
                onChange={(e) => setFormData({...formData, status: e.target.value})}
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
