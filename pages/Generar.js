import { useState } from 'react';

export default function Generar() {
  const [prompt, setPrompt] = useState('');
  const [resultado, setResultado] = useState('');
  const [cargando, setCargando] = useState(false);

  const generarDocumento = async () => {
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
        setResultado('Error al generar el documento.');
      }

    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      setResultado('Error al conectar con el servidor.');
    }

    setCargando(false);
  };

  return (
    <main className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Generar documento</h1>
        <textarea
          className="w-full p-4 border border-gray-300 rounded"
          rows="5"
          placeholder="Escribe aquí tu situación legal..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={generarDocumento}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          {cargando ? 'Generando...' : 'Generar documento'}
        </button>
        <div className="mt-4 bg-white p-4 border rounded">
          <h2 className="font-semibold">Resultado:</h2>
          <pre className="whitespace-pre-wrap">{resultado}</pre>
        </div>
      </div>
    </main>
  );
}
