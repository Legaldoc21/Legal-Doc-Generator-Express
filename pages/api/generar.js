// pages/Generar.js
import { useState } from 'react';
import html2pdf from 'html2pdf.js';

export default function Generar() {
  const [prompt, setPrompt] = useState('');
  const [resultado, setResultado] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const generarDocumento = async () => {
    setCargando(true);
    setResultado('');
    setError('');

    try {
      const res = await fetch('/api/generar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detalle || data.error || 'Error desconocido');
      }

      setResultado(data.resultado);
    } catch (err) {
      setError(err.message);
    }

    setCargando(false);
  };

  const descargarPDF = () => {
    const element = document.getElementById('resultado-doc');
    if (!element) return;
    html2pdf().set({ margin: 10, filename: 'documento-legal.pdf', html2canvas: { scale: 2 } }).from(element).save();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4">
      <header className="bg-white shadow fixed top-0 left-0 w-full z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-700">📄 Redactor Legal Exprés</h1>
          <a href="/" className="text-sm text-blue-500 hover:underline">Inicio</a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-6 mt-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center">Describe tu situación legal</h2>

        <textarea
          className="w-full border border-gray-300 rounded-lg p-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          rows="6"
          placeholder="Por ejemplo: Necesito un contrato de alquiler temporal para un apartamento en Madrid..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={generarDocumento}
            disabled={cargando || !prompt.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg shadow transition duration-300 disabled:opacity-50"
          >
            {cargando ? 'Generando...' : 'Generar documento'}
          </button>

          {resultado && (
            <button
              onClick={descargarPDF}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-3 rounded-lg shadow transition"
            >
              Descargar PDF
            </button>
          )}
        </div>

        {error && (
          <div className="text-red-600 text-center font-semibold">{error}</div>
        )}

        {resultado && (
          <div id="resultado-doc" className="bg-white rounded-xl border border-gray-300 p-6 shadow-md whitespace-pre-wrap text-sm mt-6">
            {resultado}
          </div>
        )}

        <footer className="text-xs text-gray-400 text-center mt-10">
          Documento generado por IA. Aunque se basa en leyes reales, se recomienda validación profesional.
        </footer>
      </main>
    </div>
  );
}
