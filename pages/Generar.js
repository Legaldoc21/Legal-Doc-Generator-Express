import { useState } from 'react';

export default function Generador() {
  const [prompt, setPrompt] = useState('');
  const [resultado, setResultado] = useState('');
  const [loading, setLoading] = useState(false);

  const generarDocumento = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResultado('');
    try {
      const response = await fetch('/api/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setResultado(data.resultado || 'Error al generar documento.');
    } catch (error) {
      setResultado('Error al conectar con el servidor.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gray-50">
      <div className="w-full max-w-xl space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">Generador Legal Exprés</h1>
        <textarea
          className="w-full border border-gray-300 rounded p-3"
          rows="5"
          placeholder="Describe tu situación legal..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={generarDocumento}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          {loading ? 'Generando...' : 'Generar documento'}
        </button>
        <div className="border border-gray-300 rounded p-4 bg-white">
          <h2 className="font-semibold mb-2">Vista previa:</h2>
          <p className="whitespace-pre-wrap text-sm text-gray-700">{resultado}</p>
          <p className="text-xs text-gray-400 mt-4">
            Este documento ha sido generado automáticamente mediante inteligencia artificial. Se recomienda revisión legal en casos importantes.
          </p>
        </div>
      </div>
    </main>
  );
}
