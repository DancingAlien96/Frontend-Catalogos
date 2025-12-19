import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-sky-50 to-white">
      <header className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 text-white rounded flex items-center justify-center font-bold">C</div>
          <span className="font-semibold text-lg">Catalogos</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/signup" className="text-sm font-medium text-blue-600">Crear tienda</Link>
          <Link href="/login" className="text-sm text-gray-600">Iniciar sesión</Link>
        </nav>
      </header>

      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-12">
        {/* Hero */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">Crea tu tienda online y deja que el bot gestione tus ventas</h1>
          <p className="mt-4 text-lg text-gray-600">Empieza gratis con <strong>15 productos</strong>. Automática gestión de inventario, notificaciones por WhatsApp y atención por el bot integrado.</p>

          <div className="mt-8 flex gap-4">
            <Link href="/signup" className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-md font-semibold shadow">Crear mi tienda gratis</Link>
            <Link href="/plans" className="inline-block bg-white border border-gray-200 px-6 py-3 rounded-md font-medium text-gray-700">Ver planes</Link>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-blue-50 rounded">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18"/></svg>
              </div>
              <div>
                <p className="font-semibold">Gestión por Bot</p>
                <p className="text-sm text-gray-600">Respuestas automáticas y notificaciones por Telegram/WhatsApp.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-3 bg-green-50 rounded">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 6h18M3 14h18M3 18h18"/></svg>
              </div>
              <div>
                <p className="font-semibold">Inventario automático</p>
                <p className="text-sm text-gray-600">Stock ajustado con cada venta, evita oversells.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-3 bg-yellow-50 rounded">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8c-3 0-5 2-5 5 0 2 .5 3 2 4"/></svg>
              </div>
              <div>
                <p className="font-semibold">Pagos integrados</p>
                <p className="text-sm text-gray-600">Conecta Stripe y PayPal para aceptar pagos al instante.</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-white to-slate-50 border border-gray-100 rounded-lg p-3 shadow-sm">
              <div className="w-10 h-10 rounded bg-indigo-600 text-white flex items-center justify-center">🤖</div>
              <div>
                <p className="font-medium">Bot de ventas incluido</p>
                <p className="text-sm text-gray-600">Automatiza confirmaciones, envíos y comunicación con clientes — tú solo vendes.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Visual mock / signup card */}
        <aside className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Comienza gratis</h3>
                <p className="text-sm text-gray-500">Free — hasta 15 productos</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">$0</p>
                <p className="text-xs text-gray-400">por mes</p>
              </div>
            </div>

            <div className="mt-4">
              <Link href="/signup" className="w-full block text-center bg-blue-600 text-white px-4 py-2 rounded">Crear mi tienda gratis</Link>
            </div>

            <div className="mt-6 border-t pt-4 text-sm text-gray-600">
              <p className="mb-2">Incluye:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Bot de ventas (Telegram)</li>
                <li>Gestión de inventario automática</li>
                <li>Soporte básico</li>
              </ul>
            </div>
          </div>
        </aside>
      </section>

      {/* Testimonials / footer */}
      <section className="bg-white border-t py-10">
        <div className="max-w-6xl mx-auto px-6">
          <h4 className="text-lg font-semibold mb-4">Lo que dicen nuestros usuarios</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <blockquote className="bg-gray-50 p-6 rounded-lg">“Con el bot ya no pierdo pedidos; todo llega a mi WhatsApp y el stock se actualiza automáticamente.” — Ana, tienda local</blockquote>
            <blockquote className="bg-gray-50 p-6 rounded-lg">“Configurar mi tienda fue cuestión de minutos. Recomendada.” — Pedro, emprendedor</blockquote>
            <blockquote className="bg-gray-50 p-6 rounded-lg">“Las ventas aumentaron con el flujo automatizado y las notificaciones.” — Marta, boutique</blockquote>
          </div>
        </div>
      </section>

      <footer className="py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-500">© {new Date().getFullYear()} Catalogos — Hecho con ❤️</div>
      </footer>
    </main>
  );
}
