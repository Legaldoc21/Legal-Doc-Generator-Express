import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="max-w-2xl w-full text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-800">LegalDoc Generator</h1>
        <p className="text-gray-600 text-lg">Crea documentos legales con IA en segundos.</p>
        <Link
          href="/Generar"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 px-6 rounded shadow transition"
        >
          Empezar
        </Link>
      </div>
    </main>
  );
}
