// pages/Generar.js
import { useState } from 'react';

export default function Generar() {
  const [input, setInput] = useState('');
  const [resultado, setResultado] = useState('');
  const [cargando, setCargando] = useState(false);

  const generarDocumento = async () => {
    setCargando(true);
    setResultado('Cargando...');
    try {
      const res = await fetch('/api/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();

      if (res.ok) {
        setResultado(data.resultado);
      } else {
        setResultado('Error al generar el documento.');
      }
    } catch (err) {
      setResultado('Error de conexión con el servidor.');
    }
    setCargando(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Redactor Legal Exprés</h1>
      <textarea
        className="w-full p-2 border rounded mb-4"
        rows="5"
        placeholder="Describe la situación legal aquí..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={generarDocumento}
        disabled={cargando}
      >
        {cargando ? 'Generando...' : 'Generar documento'}
      </button>
      <div className="mt-6 border-t pt-4 text-gray-800 whitespace-pre-wrap">
        <strong>Vista previa:</strong>
        <div>{resultado}</div>
      </div>
      <p className="mt-10 text-xs text-gray-500 text-right">
        Este documento ha sido generado automáticamente con tecnología de inteligencia artificial.
        A pesar de su validez legal, se recomienda su revisión por un profesional.
      </p>
    </div>
  );
}
