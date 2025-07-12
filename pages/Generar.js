import { useState } from "react";

export default function Generar() {
  const [prompt, setPrompt] = useState("");
  const [resultado, setResultado] = useState("");
  const [cargando, setCargando] = useState(false);

  const generarDocumento = async () => {
    setCargando(true);
    setResultado("");

    try {
      const response = await fetch('/api/generar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (data.resultado) {
        setResultado(data.resultado);
      } else {
        setResultado("No se pudo generar el documento.");
      }
    } catch (error) {
      setResultado("Error al conectar con el servidor.");
    }

    setCargando(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="max-w-xl w-full">
        <h1 className="text-3xl font-bold mb-4">Generador Legal Exprés</h1>
        <textarea
          className="w-full p-3 border rounded-md mb-4"
          rows={5}
          placeholder="Describe aquí tu situación legal..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={generarDocumento}
          disabled={cargando || prompt.length === 0}
        >
          {cargando ? "Generando..." : "Generar documento"}
        </button>

        {resultado && (
          <div className="mt-6 p-4 bg-white border border-gray-200 rounded shadow whitespace-pre-wrap">
            <h2 className="text-lg font-semibold mb-2">Vista previa:</h2>
            <p>{resultado}</p>

            <p className="mt-6 text-xs text-gray-500 border-t pt-2">
              Este documento ha sido generado automáticamente mediante inteligencia artificial. Se recomienda revisión legal en casos importantes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
