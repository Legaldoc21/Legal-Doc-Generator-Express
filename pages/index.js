
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState("");
  const [autorizado, setAutorizado] = useState(false);
  const resultadoRef = useRef(null);

  useEffect(() => {
    const acceso = localStorage.getItem("accesoPermitido");
    if (acceso === "true") setAutorizado(true);

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  const handleSubmit = async () => {
    if (!descripcion.trim()) return;
    setLoading(true);
    setResultado("");

    const prompt = \`
Eres un abogado experto en legislación española. Un cliente ha descrito lo que necesita legalmente. 
Tu tarea es redactar un documento legal COMPLETO, válido y profesional para esta situación, redactado 
con lenguaje legal real. No incluyas explicaciones, solo el texto del documento. Aquí va la descripción del cliente:

"\${descripcion}"
\`;

    const response = await fetch("/api/generar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    setResultado(data.resultado || "Hubo un error generando el documento.");
    setLoading(false);
  };

  const redirigirAPago = async () => {
    const res = await fetch("/api/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  const descargarPDF = () => {
    if (window.html2pdf && resultadoRef.current) {
      window.html2pdf()
        .from(resultadoRef.current)
        .set({ margin: 1, filename: "documento-legal.pdf", html2canvas: { scale: 2 } })
        .save();
    }
  };

  const previewLimit = 1200;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center text-blue-700">Redactador Legal Exprés</h1>
        <p className="text-center text-gray-600">Tu contrato legal, redactado por IA, en minutos.</p>

        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={5}
          placeholder="Describe aquí para qué necesitas tu contrato o documento legal..."
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm resize-none"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Generando..." : "Generar contrato legal"}
        </button>

        {resultado && (
          <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold text-green-700">Vista previa del contrato:</h2>
            <div ref={resultadoRef} className="whitespace-pre-wrap border-l-4 border-green-400 pl-4">
              {autorizado ? resultado : resultado.slice(0, previewLimit) + "..."}
            </div>

            {!autorizado ? (
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">
                  Para ver el contrato completo y poder descargarlo, haz clic abajo:
                </p>
                <button
                  onClick={redirigirAPago}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Desbloquear contrato completo (1,99 €)
                </button>
              </div>
            ) : (
              <div className="text-center">
                <button
                  onClick={descargarPDF}
                  className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition"
                >
                  Descargar en PDF
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
