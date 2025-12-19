import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <section className="p-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">Crea tu tienda online en minutos</h1>
          <p className="mt-4 text-lg text-gray-600">Empieza gratis con hasta <strong>15 productos</strong>. Pedidos por WhatsApp, pagos integrados y gestión de stock automática.</p>

          <div className="mt-8 flex gap-4">
            <Link href="/signup" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium">Crear mi tienda gratis</Link>
            <Link href="/plans" className="inline-block bg-white border border-gray-200 px-6 py-3 rounded-md font-medium text-gray-700">Ver planes</Link>
          </div>

          <ul className="mt-8 space-y-3 text-gray-700">
            <li>✅ Pedidos por WhatsApp</li>
            <li>✅ Pagos con Stripe y PayPal</li>
            <li>✅ Gestión de inventario y alertas</li>
          </ul>
        </section>

        <section className="p-8 flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Prueba la plataforma</h3>
            <p className="text-sm text-gray-600">Regístrate y obtén tu API Key para probar la integración con tu tienda.</p>
            <div className="mt-4">
              <Link href="/signup" className="w-full block text-center bg-green-600 text-white px-4 py-2 rounded">Crear mi tienda gratis</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
