'use client';

import { useEffect, useState } from 'react';
import { publicPlanApi } from '@/src/lib/api';
import Link from 'next/link';

export default function PlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await publicPlanApi.getAll();
        setPlans(res.data.plans || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-8">Cargando planes...</div>;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Planes disponibles</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {plans.map((plan: any) => (
            <div key={plan.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <div className="text-2xl font-bold">{plan.price === '0.00' || plan.price === 0 ? '$0' : `$${plan.price}`}</div>
                  <div className="text-xs text-gray-400">{plan.product_limit ? `${plan.product_limit} productos` : 'Productos ilimitados'}</div>
                </div>
                <div>
                  {plan.slug === 'free' ? (
                    <Link href="/signup" className="px-4 py-2 bg-green-600 text-white rounded">Crear mi tienda</Link>
                  ) : (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded">Upgrade</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}