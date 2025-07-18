import { useState } from 'react';

export default function Generar() {
  const [prompt, setPrompt] = useState('');
  const [resultado, setResultado] = useState('');
  const [cargando, setCargando] = useState(false);

  const generarDocumento = async () => {
    if (!prompt.trim()) return;

    setCargando(true);
    setResultado('');

    try {
      const response = await fetch('/api/generar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (response.ok) {
        setResultado(data.resultado);
      } else {
        setResultado('Error: ' + (data.error || 'No se pudo generar el documento'));
      }
    } catch (error) {
      console.error('Error al generar el documento:', error);
      setResultado('Error al conectar con el servidor.');
    }

    setCargando(false);
  };

  return (
    <main className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Generador Legal Exprés</h1>
        <textarea
          className="w-full p-4 border border-gray-300 rounded"
          rows="6"
          placeholder="Describe tu situación legal..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={generarDocumento}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-semibold"
          disabled={cargando}
        >
          {cargando ? 'Generando...' : 'Generar documento'}
        </button>
        <div className="bg-white border border-gray-300 p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Vista previa:</h2>
          <pre className="whitespace-pre-wrap text-sm">{resultado}</pre>
          <p className="text-xs text-gray-400 mt-4">
            Este documento ha sido generado automáticamente mediante inteligencia artificial. 
            Se recomienda revisión legal en casos importantes.
          </p>
        </div>
      </div>
    </main>
  );
}
