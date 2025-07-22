import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-2xl w-full text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-800">
          Redactor Legal Exprés
        </h1>
        <p className="text-gray-600 text-lg">
          Genera documentos legales personalizados explicando brevemente tu situación. Rápido, fácil y profesional.
        </p>
        <Link
          href="/Generar"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 px-6 rounded shadow transition"
        >
          Comenzar ahora
        </Link>
        <p className="text-xs text-gray-400 mt-10">
          Este servicio no sustituye la revisión de un abogado en casos importantes. Documento generado por inteligencia artificial.
        </p>
      </div>
    </main>
  );
}
