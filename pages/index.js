// pages/index.js
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-gray-800 px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Redactor Legal Exprés
        </h1>
        <p className="text-lg mb-8">
          Genera documentos legales a medida. Describe tu situación legal y obtén un documento profesional al instante.
        </p>
        <Link
          href="/Generar"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded text-lg transition"
        >
          Generar Documento
        </Link>
        <p className="mt-10 text-xs text-gray-500 text-center">
          Aviso: Este sistema utiliza inteligencia artificial y no sustituye la revisión de un profesional legal.
        </p>
      </div>
    </main>
  );
}