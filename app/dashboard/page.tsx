'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { productsApi, ordersApi, customersApi, categoriesApi, Product, Order, Customer } from '@/src/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    customers: 0,
    categories: 0,
  });
  const [loading, setLoading] = useState(true);
  const [catalogUrl, setCatalogUrl] = useState('');

  useEffect(() => {
    let apiKey = localStorage.getItem('api_key');
    
    // Si no hay API key, guardar la por defecto
    if (!apiKey) {
      const DEFAULT_KEY = 'mk_e8724f3186c5e7ce40f479b0420c14cfaf273cbaacb5c325';
      localStorage.setItem('api_key', DEFAULT_KEY);
      apiKey = DEFAULT_KEY;
      console.log('API Key guardado automáticamente:', DEFAULT_KEY);
    }

    // Generar URL del catálogo
    if (typeof window !== 'undefined') {
      setCatalogUrl(`${window.location.origin}/catalogo/mercysales-demo`);
    }

    loadStats();
  }, [router]);

  const loadStats = async () => {
    try {
      const [productsRes, ordersRes, customersRes, categoriesRes] = await Promise.all([
        productsApi.getAll(),
        ordersApi.getAll(),
        customersApi.getAll(),
        categoriesApi.getAll(),
      ]);

      setStats({
        products: productsRes.data.products.length,
        orders: ordersRes.data.orders.length,
        customers: customersRes.data.customers.length,
        categories: categoriesRes.data.categories.length,
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('api_key');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Catalog URL Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-2">📱 Comparte tu Catálogo</h2>
              <p className="text-blue-100 text-sm mb-3">
                Este es el enlace público de tu catálogo. Compártelo con tus clientes o en tu bot de Telegram.
              </p>
              <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-lg p-3">
                <code className="flex-1 text-sm font-mono text-white overflow-x-auto">
                  {catalogUrl}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(catalogUrl);
                    alert('¡URL copiado al portapapeles!');
                  }}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition whitespace-nowrap"
                >
                  📋 Copiar
                </button>
                <a
                  href="/catalogo/mercysales-demo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition whitespace-nowrap"
                >
                  👁️ Ver
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Productos</p>
                <p className="text-3xl font-bold text-gray-900">{stats.products}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Categorías</p>
                <p className="text-3xl font-bold text-gray-900">{stats.categories}</p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Órdenes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.orders}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Clientes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.customers}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/dashboard/products')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <p className="font-medium text-gray-900">Ver Productos</p>
              <p className="text-sm text-gray-600 mt-1">Gestiona tu catálogo</p>
            </button>

            <button
              onClick={() => router.push('/dashboard/categories')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition"
            >
              <p className="font-medium text-gray-900">Ver Categorías</p>
              <p className="text-sm text-gray-600 mt-1">Organiza productos</p>
            </button>

            <button
              onClick={() => router.push('/dashboard/orders')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition"
            >
              <p className="font-medium text-gray-900">Ver Órdenes</p>
              <p className="text-sm text-gray-600 mt-1">Gestiona pedidos</p>
            </button>

            <button
              onClick={() => router.push('/dashboard/customers')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition"
            >
              <p className="font-medium text-gray-900">Ver Clientes</p>
              <p className="text-sm text-gray-600 mt-1">Gestiona clientes</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
