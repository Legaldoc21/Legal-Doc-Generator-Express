import { useState } from "react";

export default function GenerarContrato() {
  const [descripcion, setDescripcion] = useState("");
  const [resultado, setResultado] = useState("");
  const [cargando, setCargando] = useState(false);

  const generar = async () => {
    setCargando(true);
    setResultado("");

    try {
      const response = await fetch("/api/generar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: descripcion }),
      });

      const data = await response.json();
      if (data.resultado) {
        setResultado(data.resultado);
      } else {
        setResultado("No se pudo generar el documento.");
      }
    } catch (error) {
      setResultado("Error al conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-6">
      <div className="max-w-xl w-full space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">Generar documento legal</h1>
        <textarea
          className="w-full border border-gray-300 rounded-md p-3 resize-none min-h-[150px]"
          placeholder="Describe tu situación legal..."
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <button
          onClick={generar}
          disabled={cargando || !descripcion.trim()}
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          {cargando ? "Generando..." : "Generar contrato"}
        </button>

        {resultado && (
          <div className="mt-6 p-4 bg-white rounded shadow text-gray-800 whitespace-pre-wrap border border-gray-200">
            <h2 className="text-xl font-semibold mb-2">Vista previa:</h2>
            <p>{resultado}</p>

            <div className="mt-4 text-xs text-gray-500 border-t border-gray-200 pt-3 bg-gray-50 rounded-md p-3">
              <div className="flex items-start space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 18.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13z" />
                </svg>
                <p className="leading-snug">
                  Este documento ha sido generado automáticamente mediante inteligencia artificial basada en legislación española. Puede no reflejar cambios recientes o circunstancias particulares. Se recomienda la revisión por un profesional del Derecho en casos importantes. Su uso implica aceptación de estas condiciones.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
