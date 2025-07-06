
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
    script.src = "https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js";
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  const handleSubmit = async () => {
    if (!descripcion.trim()) return;
    setLoading(true);
    setResultado("");

    const prompt = `
Eres un abogado experto en legislación española. Un cliente ha descrito lo que necesita legalmente.
Tu tarea es redactar un documento legal COMPLETO, válido y profesional para esta situación,
redactado con lenguaje legal real. No incluyas explicaciones, solo el texto del documento.
Aquí va la descripción del cliente:

"${descripcion}"
`;

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

  const previewLimit = 1200; // caracteres visibles antes del corte

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-800">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Redactador Legal Exprés</h1>
        <p className="text-center text-gray-600">
          Describe tu situación legal y genera un documento personalizado.
        </p>

        {!autorizado ? (
          <div className="text-center text-red-600">
            Acceso restringido. Debes realizar el pago para acceder.
          </div>
        ) : (
          <>
            <textarea
              rows={4}
              className="w-full p-3 border rounded-md"
              placeholder="Describe tu situación legal..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
            >
              {loading ? "Generando..." : "Generar documento"}
            </button>

            {resultado && (
              <div className="bg-white border p-4 rounded-md space-y-4">
                <h2 className="text-lg font-semibold">Vista previa:</h2>
                <div
                  ref={resultadoRef}
                  className="whitespace-pre-wrap text-sm text-gray-700"
                >
                  {resultado.length > previewLimit
                    ? resultado.slice(0, previewLimit) + "..."
                    : resultado}
                </div>

                {resultado.length > previewLimit && (
                  <button
                    onClick={redirigirAPago}
                    className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition"
                  >
                    Ver completo por 1,99 €
                  </button>
                )}

                {resultado.length <= previewLimit && (
                  <button
                    onClick={descargarPDF}
                    className="w-full bg-gray-800 text-white p-2 rounded-md hover:bg-gray-900 transition"
                  >
                    Descargar PDF
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
