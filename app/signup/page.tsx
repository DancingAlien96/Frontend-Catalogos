'use client';

import { useState } from 'react';
import { publicAuthApi } from '@/src/lib/api';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await publicAuthApi.signup({ email, password, store_name: storeName, slug });
      setResult(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Error al crear la tienda');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-4">Tienda creada</h2>
          <p className="mb-4">Tu tienda <strong>{result.store.name}</strong> ha sido creada.</p>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">API Key:</p>
            <code className="block p-2 bg-white rounded mt-1 break-words">{result.api_key}</code>
            <p className="text-sm text-gray-600 mt-2">API Secret:</p>
            <code className="block p-2 bg-white rounded mt-1 break-words">{result.api_secret}</code>
          </div>
          <p className="mt-4 text-sm text-gray-500">Guarda estas credenciales. Puedes ir al dashboard para configurar productos y más.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <h2 className="text-xl font-bold mb-4">Crear mi tienda gratis</h2>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input className="mt-1 block w-full border rounded p-2" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" className="mt-1 block w-full border rounded p-2" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre de la tienda</label>
            <input className="mt-1 block w-full border rounded p-2" value={storeName} onChange={e => setStoreName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Slug (opcional)</label>
            <input className="mt-1 block w-full border rounded p-2" value={slug} onChange={e => setSlug(e.target.value)} />
          </div>
          <div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">{loading ? 'Creando...' : 'Crear mi tienda gratis'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}