'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { productsApi, categoriesApi, Category } from '@/src/lib/api';
import axios from 'axios';

interface ProductFormData {
  name: string;
  sku: string;
  description: string;
  cost_price: string;
  price: string;
  current_stock: string;
  min_stock_alert: string;
  category_id: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Imágenes existentes (URLs de Cloudinary)
  const [existingImages, setExistingImages] = useState<string[]>([]);
  
  // Nuevas imágenes para subir
  const [newImages, setNewImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    sku: '',
    description: '',
    cost_price: '',
    price: '',
    current_stock: '0',
    min_stock_alert: '5',
    category_id: '',
  });

  useEffect(() => {
    loadProduct();
    loadCategories();
  }, [productId]);

  const loadCategories = async () => {
    try {
      const response = await categoriesApi.getAll();
      setCategories(response.data.categories.filter(c => c.is_active));
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const loadProduct = async () => {
    try {
      const response = await productsApi.getOne(parseInt(productId));
      const product = response.data;

      setFormData({
        name: product.name,
        sku: product.sku,
        description: product.description || '',
        cost_price: product.cost_price?.toString() || '',
        price: product.price.toString(),
        current_stock: product.current_stock.toString(),
        min_stock_alert: product.min_stock_alert.toString(),
        category_id: product.category_id?.toString() || '',
      });

      setExistingImages(product.images || []);
    } catch (error) {
      console.error('Error al cargar producto:', error);
      alert('Error al cargar producto');
      router.push('/dashboard/products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNewImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const totalImages = existingImages.length + newImages.length + files.length;
    if (totalImages > 5) {
      alert('Máximo 5 imágenes por producto');
      return;
    }

    // Crear previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setNewImageFiles(prev => [...prev, ...files]);
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadNewImages = async (): Promise<string[]> => {
    if (newImageFiles.length === 0) return [];

    setUploadingImages(true);
    try {
      const apiKey = localStorage.getItem('api_key');
      const formData = new FormData();
      
      newImageFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await axios.post(
        'http://localhost:3000/api/upload/product-images',
        formData,
        {
          headers: {
            'X-API-Key': apiKey!,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data.urls;
    } catch (error) {
      console.error('Error al subir imágenes:', error);
      throw new Error('Error al subir imágenes');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // 1. Subir nuevas imágenes
      const uploadedUrls = await uploadNewImages();

      // 2. Combinar imágenes existentes + nuevas
      const allImages = [...existingImages, ...uploadedUrls];

      // 3. Actualizar producto
      await productsApi.update(parseInt(productId), {
        ...formData,
        cost_price: parseFloat(formData.cost_price) || 0,
        price: parseFloat(formData.price),
        current_stock: parseInt(formData.current_stock) || 0,
        min_stock_alert: parseInt(formData.min_stock_alert) || 5,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        images: allImages,
      });

      alert('Producto actualizado exitosamente');
      router.push('/dashboard/products');
    } catch (error: any) {
      console.error('Error al actualizar producto:', error);
      alert(error.response?.data?.error || 'Error al actualizar producto');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  const totalImages = existingImages.length + newImages.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push('/dashboard/products')}
            className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-2"
          >
            ← Volver a Productos
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Editar Producto</h1>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Imágenes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imágenes del Producto (máx 5)
            </label>
            
            {/* Imágenes existentes y nuevas */}
            {totalImages > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
                {/* Imágenes existentes */}
                {existingImages.map((img, idx) => (
                  <div key={`existing-${idx}`} className="relative group">
                    <img
                      src={img}
                      alt={`Imagen ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {/* Nuevas imágenes */}
                {newImages.map((img, idx) => (
                  <div key={`new-${idx}`} className="relative group">
                    <img
                      src={img}
                      alt={`Nueva ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-blue-500"
                    />
                    <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      Nueva
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input para nuevas imágenes */}
            {totalImages < 5 && (
              <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">Agregar más imágenes</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleNewImageSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Producto *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU (Código) *
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                title="El SKU no se puede modificar"
              />
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            >
              <option value="">Sin categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Precios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio de Costo
              </label>
              <input
                type="number"
                name="cost_price"
                value={formData.cost_price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio de Venta *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>

          {/* Inventario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Actual
              </label>
              <input
                type="number"
                name="current_stock"
                value={formData.current_stock}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alerta de Stock Mínimo
              </label>
              <input
                type="number"
                name="min_stock_alert"
                value={formData.min_stock_alert}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard/products')}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={saving || uploadingImages}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || uploadingImages}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {uploadingImages ? 'Subiendo imágenes...' : saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
