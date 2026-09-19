'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectField } from '@/components/ui/select-field';
import { 
  Plus, 
  Upload, 
  Trash2, 
  Edit, 
  Image as ImageIcon, 
  Check, 
  X, 
  AlertCircle,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SiteImageItem {
  id: string;
  section: string;
  category: string;
  url: string;
  label: string;
  description: string | null;
  order: number;
}

const CATEGORIES = [
  'Piscina & Lazer',
  'Casa Sede & Suítes',
  'Alojamentos',
  'Salão de Festas',
  'Natureza & Lago'
];

const SECTIONS = [
  { value: 'GALLERY', label: 'Galeria de Fotos' },
  { value: 'HERO', label: 'Carrossel Principal (Hero)' },
  { value: 'ACCOMMODATION', label: 'Acomodações' },
];

export function ImagesManager() {
  const [images, setImages] = useState<SiteImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<SiteImageItem | null>(null);

  // Form states
  const [uploadMode, setUploadMode] = useState<'FILE' | 'URL'>('FILE');
  const [formUrl, setFormUrl] = useState('');
  const [formLabel, setFormLabel] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('Piscina & Lazer');
  const [formSection, setFormSection] = useState('GALLERY');
  const [uploading, setUploading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/images');
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const openAddModal = () => {
    setEditingImage(null);
    setFormUrl('');
    setFormLabel('');
    setFormDescription('');
    setFormCategory('Piscina & Lazer');
    setFormSection('GALLERY');
    setUploadMode('FILE');
    setActionError('');
    setActionSuccess('');
    setModalOpen(true);
  };

  const openEditModal = (img: SiteImageItem) => {
    setEditingImage(img);
    setFormUrl(img.url);
    setFormLabel(img.label);
    setFormDescription(img.description || '');
    setFormCategory(img.category);
    setFormSection(img.section);
    setUploadMode('URL');
    setActionError('');
    setActionSuccess('');
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setActionError('');
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao enviar foto');

      setFormUrl(data.url);
      if (!formLabel) {
        setFormLabel(file.name.replace(/\.[^/.]+$/, ''));
      }
    } catch (err: any) {
      setActionError(err.message || 'Falha no upload do arquivo');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUrl) {
      setActionError('Faça o upload de uma foto ou insira a URL da imagem');
      return;
    }
    if (!formLabel) {
      setActionError('Informe o título/legenda da imagem');
      return;
    }

    try {
      setUploading(true);
      setActionError('');

      if (editingImage) {
        // Update
        const res = await fetch(`/api/images/${editingImage.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: formUrl,
            label: formLabel,
            description: formDescription,
            category: formCategory,
            section: formSection,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Falha ao atualizar imagem');
        }

        const savedData = await res.json().catch(() => null);

        // Atualização otimista imediata na tela
        setImages((prev) =>
          prev.map((img) =>
            img.id === editingImage.id
              ? {
                  ...img,
                  url: formUrl,
                  label: formLabel,
                  description: formDescription,
                  category: formCategory,
                  section: formSection,
                }
              : img
          )
        );
      } else {
        // Create
        const res = await fetch('/api/images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: formUrl,
            label: formLabel,
            description: formDescription,
            category: formCategory,
            section: formSection,
            order: images.length + 1,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Falha ao criar imagem');
        }

        const newImg = await res.json().catch(() => null);
        if (newImg) {
          setImages((prev) => [...prev, newImg]);
        }
      }

      setModalOpen(false);
      fetchImages();
    } catch (err: any) {
      setActionError(err.message || 'Erro ao salvar alterações');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Tem certeza que deseja excluir a imagem "${label}"?`)) return;

    try {
      const res = await fetch(`/api/images/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.id !== id));
      } else {
        alert('Erro ao excluir imagem');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir imagem');
    }
  };

  const filteredImages = images.filter((img) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'HERO') return img.section === 'HERO';
    if (selectedFilter === 'ACCOMMODATION') return img.section === 'ACCOMMODATION';
    return img.category === selectedFilter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1F2937] flex items-center gap-2.5">
            <ImageIcon className="text-[#1B4332]" />
            Gerenciador de Fotos do Sítio
          </h1>
          <p className="text-gray-500 mt-1">
            Altere, adicione novas fotos do sítio ou remova imagens exibidas no site público
          </p>
        </div>

        <Button 
          onClick={openAddModal} 
          variant="primary" 
          size="lg" 
          className="shadow-md cursor-pointer flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Adicionar Nova Foto
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2">
        <button
          onClick={() => setSelectedFilter('ALL')}
          className={cn(
            'px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer',
            selectedFilter === 'ALL'
              ? 'bg-[#1B4332] text-white shadow-sm'
              : 'bg-white border border-[#E9ECEF] text-gray-600 hover:bg-gray-50'
          )}
        >
          Todas ({images.length})
        </button>
        <button
          onClick={() => setSelectedFilter('HERO')}
          className={cn(
            'px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer',
            selectedFilter === 'HERO'
              ? 'bg-[#1B4332] text-white shadow-sm'
              : 'bg-white border border-[#E9ECEF] text-gray-600 hover:bg-gray-50'
          )}
        >
          🌟 Banner / Hero ({images.filter(i => i.section === 'HERO').length})
        </button>
        <button
          onClick={() => setSelectedFilter('ACCOMMODATION')}
          className={cn(
            'px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer',
            selectedFilter === 'ACCOMMODATION'
              ? 'bg-[#1B4332] text-white shadow-sm'
              : 'bg-white border border-[#E9ECEF] text-gray-600 hover:bg-gray-50'
          )}
        >
          🏡 Cards Acomodações ({images.filter(i => i.section === 'ACCOMMODATION').length})
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer',
              selectedFilter === cat
                ? 'bg-[#1B4332] text-white shadow-sm'
                : 'bg-white border border-[#E9ECEF] text-gray-600 hover:bg-gray-50'
            )}
          >
            {cat} ({images.filter(i => i.category === cat).length})
          </button>
        ))}
      </div>

      {/* Grid of Images */}
      {loading ? (
        <div className="py-20 text-center text-gray-500">
          Carregando galeria...
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-[#E9ECEF] p-8">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Nenhuma foto encontrada nesta categoria.</p>
          <Button onClick={openAddModal} variant="outline" className="mt-4">
            Adicionar a primeira foto
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((img) => (
            <Card key={img.id} className="overflow-hidden border-[#E9ECEF] group hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-sm">
                      {img.category}
                    </span>
                    {img.section === 'HERO' && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#D4A373] text-white shadow-sm">
                        Banner Hero
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-[#1F2937] line-clamp-1">{img.label}</h3>
                  {img.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">{img.description}</p>
                  )}
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-gray-100 flex items-center justify-between gap-2 mt-2">
                <Button 
                  onClick={() => openEditModal(img)} 
                  variant="outline" 
                  size="sm"
                  className="flex-1 cursor-pointer hover:bg-gray-100"
                >
                  <Edit className="w-3.5 h-3.5 mr-1" />
                  Alterar
                </Button>
                <button
                  onClick={() => handleDelete(img.id, img.label)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Excluir imagem"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Add / Edit Image */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative my-8">
            <button 
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-[#1F2937] mb-1 font-[family-name:var(--font-playfair)]">
              {editingImage ? 'Alterar Foto' : 'Adicionar Nova Foto'}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Envie a foto do seu computador ou informe um link direto.
            </p>

            {actionError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5">
              {/* Upload Mode Selector */}
              <div className="flex rounded-xl bg-gray-100 p-1">
                <button
                  type="button"
                  onClick={() => setUploadMode('FILE')}
                  className={cn(
                    'flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2',
                    uploadMode === 'FILE' ? 'bg-white text-[#1B4332] shadow-sm' : 'text-gray-600'
                  )}
                >
                  <Upload className="w-4 h-4" />
                  Enviar do Computador
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('URL')}
                  className={cn(
                    'flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2',
                    uploadMode === 'URL' ? 'bg-white text-[#1B4332] shadow-sm' : 'text-gray-600'
                  )}
                >
                  <ExternalLink className="w-4 h-4" />
                  Link / URL da Imagem
                </button>
              </div>

              {/* Upload or URL input */}
              {uploadMode === 'FILE' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selecione a Foto *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 hover:border-[#1B4332] rounded-xl p-6 text-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-gray-50"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <span className="text-sm font-medium text-[#1B4332]">
                      Clique para escolher a imagem
                    </span>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP até 15MB</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    URL Direta da Imagem *
                  </label>
                  <Input
                    placeholder="https://exemplo.com/foto.jpg ou /images/..."
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Image Preview if available */}
              {formUrl && (
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                    Pré-visualização
                  </div>
                </div>
              )}

              {/* Label */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Título / Legenda da Imagem *
                </label>
                <Input
                  placeholder="Ex: Piscina com Toboágua e Solarium"
                  value={formLabel}
                  onChange={(e) => setFormLabel(e.target.value)}
                  required
                />
              </div>

              {/* Category & Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Categoria da Foto
                  </label>
                  <SelectField
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    options={CATEGORIES.map((c) => ({ value: c, label: c }))}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Onde ela deve aparecer?
                  </label>
                  <SelectField
                    value={formSection}
                    onChange={(e) => setFormSection(e.target.value)}
                    options={SECTIONS}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Descrição / Detalhes (Opcional)
                </label>
                <textarea
                  className="w-full border border-[#E9ECEF] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2D6A4F] focus:outline-none"
                  rows={3}
                  placeholder="Ex: Piscina semiolímpica com espreguiçadeiras e quiosque ao lado..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  disabled={uploading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={uploading}
                  className="px-6"
                >
                  {editingImage ? 'Salvar Alterações' : 'Adicionar Foto'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
