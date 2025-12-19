'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const DEFAULT_API_KEY = 'mk_e8724f3186c5e7ce40f479b0420c14cfaf273cbaacb5c325';
  const [apiKey, setApiKey] = useState(DEFAULT_API_KEY);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Auto-login con el API key por defecto
    const savedKey = localStorage.getItem('api_key');
    if (savedKey) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setError('Por favor ingresa tu API Key');
      return;
    }

    // Guardar en localStorage
    localStorage.setItem('api_key', apiKey);
    
    // Redirigir al dashboard
    router.push('/dashboard');
  };

  const handleQuickLogin = () => {
    localStorage.setItem('api_key', DEFAULT_API_KEY);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Catálogos SaaS
          </h1>
          <p className="text-gray-600">
            Ingresa tu API Key para continuar
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <input
              id="apiKey"
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="mk_..."
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Iniciar Sesión
          </button>

          <button
            type="button"
            onClick={handleQuickLogin}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
          >
            Acceso Rápido (API Key de Prueba)
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700 mb-2">
            <strong>API Key de prueba (ya precargada):</strong>
          </p>
          <code className="text-xs bg-white px-2 py-1 rounded block break-all">
            mk_5eb6b6175dadf5dd41985d48277c41692ee4fc13e38c6678
          </code>
        </div>
      </div>
    </div>
  );
}
