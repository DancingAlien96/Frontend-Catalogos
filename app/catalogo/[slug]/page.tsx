'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { catalogApi, Product, Category } from '@/src/lib/api';
import Image from 'next/image';

interface PublicStore {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export default function CatalogPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [store, setStore] = useState<PublicStore | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadCatalog();
  }, [slug]);

  const loadCatalog = async () => {
    try {
      const response = await catalogApi.getCatalog(slug);
      setStore(response.data.store);
      setCategories(response.data.categories);
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error al cargar catálogo:', error);
      alert('Tienda no encontrada');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category?.slug === selectedCategory)
    : products;

  const formatPrice = (price: number) => {
    return `$${Number(price).toFixed(2)}`;
  };

  const getFirstImage = (product: Product) => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }
    return '/placeholder-product.png';
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Cargando catálogo...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Tienda no encontrada</h1>
          <p className="mt-2 text-gray-600">El catálogo que buscas no existe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">{store.name}</h1>
            {store.description && (
              <p className="mt-2 text-gray-600 max-w-2xl mx-auto">{store.description}</p>
            )}
          </div>
        </div>
      </header>

      {/* Categories Filter */}
      {categories.length > 0 && (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition ${
                  selectedCategory === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition ${
                    selectedCategory === category.slug
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No hay productos</h3>
            <p className="mt-2 text-gray-500">No se encontraron productos en esta categoría.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              >
                <div className="relative h-64 bg-gray-200">
                  <Image
                    src={getFirstImage(product)}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {product.current_stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">
                        AGOTADO
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(product.price)}
                    </span>
                    {product.current_stock > 0 && (
                      <span className="text-sm text-gray-500">
                        Stock: {product.current_stock}
                      </span>
                    )}
                  </div>
                  {product.category && (
                    <div className="mt-2">
                      <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {product.category.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full my-8">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-lg">
              <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Images */}
                <div className="space-y-4">
                  <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={getFirstImage(selectedProduct)}
                      alt={selectedProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {Array.isArray(selectedProduct.images) && selectedProduct.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {selectedProduct.images.slice(1, 5).map((img, idx) => (
                        <div key={idx} className="relative h-20 bg-gray-200 rounded overflow-hidden">
                          <Image src={img} alt={`${selectedProduct.name} ${idx + 1}`} fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <span className="text-4xl font-bold text-blue-600">
                      {formatPrice(selectedProduct.price)}
                    </span>
                  </div>

                  {selectedProduct.description && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Descripción</h3>
                      <p className="text-gray-600">{selectedProduct.description}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700">SKU</h3>
                      <p className="text-gray-900">{selectedProduct.sku}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700">Stock</h3>
                      <p className={selectedProduct.current_stock > 0 ? 'text-green-600' : 'text-red-600'}>
                        {selectedProduct.current_stock > 0
                          ? `${selectedProduct.current_stock} disponibles`
                          : 'Agotado'}
                      </p>
                    </div>
                  </div>

                  {selectedProduct.category && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Categoría</h3>
                      <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {selectedProduct.category.name}
                      </span>
                    </div>
                  )}

                  {Array.isArray(selectedProduct.variants) && selectedProduct.variants.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Variantes</h3>
                      <div className="space-y-2">
                        {selectedProduct.variants.map((variant: any, idx: number) => (
                          <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-900">
                              <strong>{variant.name}:</strong> {variant.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <a
                      href={`https://t.me/${store.slug}_bot`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-blue-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      🛒 Ordenar por Telegram
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-gray-600">
            💬 Para realizar pedidos, contáctanos por{' '}
            <a
              href={`https://t.me/${slug}_bot`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Telegram
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
