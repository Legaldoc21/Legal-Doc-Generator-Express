import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50 px-6">
      <div className="max-w-2xl w-full text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">Redactor Legal Exprés</h1>
        <p className="text-gray-700 text-lg">Genera documentos legales personalizados en segundos.</p>
        <Link href="/Generar">
          <span className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 px-6 rounded shadow transition">
            Comenzar ahora
          </span>
        </Link>
        <p className="text-xs text-gray-400 mt-10">
          Este servicio no sustituye la revisión de un abogado. Documento generado por IA.
        </p>
      </div>
    </main>
  );
}