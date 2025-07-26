import { useState } from 'react';
import html2pdf from 'html2pdf.js';

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
      setResultado(response.ok ? data.resultado : (data.error || 'Error inesperado'));
    } catch (error) {
      console.error('Error al generar:', error);
      setResultado('Error de conexión con el servidor');
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
          placeholder="Por ejemplo: Quiero redactar un contrato de compraventa de un coche entre dos particulares..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={generarDocumento}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg shadow transition duration-300"
            disabled={cargando}
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

        {resultado && (
          <div id="resultado-doc" className="bg-white rounded-xl border border-gray-300 p-6 shadow-md whitespace-pre-wrap text-sm">
            {resultado}
          </div>
        )}

        <footer className="text-xs text-gray-400 text-center mt-10">
          Este documento ha sido generado con inteligencia artificial. Revisión legal recomendada.
        </footer>
      </main>
    </div>
  );
}