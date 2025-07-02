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

    const prompt = `
Eres un abogado experto en legislación española. Un cliente ha descrito lo que necesita legalmente. Tu tarea es redactar un documento legal COMPLETO, válido y profesional para esta situación, redactado con lenguaje legal real. No incluyas explicaciones, solo el texto del documento. Aquí va la descripción del cliente:

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
    if (!window.html2pdf || !resultadoRef.current) return;
    window.html2pdf()
      .from(resultadoRef.current)
      .set({ margin: 1, filename: "documento-legal.pdf", html2canvas: { scale: 2 } })
      .save();
  };

  const previewLimit = 1200; // caracteres visibles antes del corte

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "2rem" }}>
      <h1>Redactador Legal Inteligente</h1>
      <p>Describe tu situación y genera un documento legal válido y profesional.</p>

      {!autorizado && (
        <div style={{ background: "#f8f8f8", padding: "1rem", marginBottom: "1rem", border: "1px solid #ccc" }}>
          ⚠️ El documento completo se mostrará tras el pago. Verás una vista previa del comienzo.
        </div>
      )}

      <textarea
        rows={6}
        placeholder="Escribe aquí para qué necesitas un contrato o documento legal..."
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        style={{ width: "100%", margin: "10px 0", padding: "10px" }}
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Generando..." : "Generar documento"}
      </button>

      {resultado && (
        <div style={{ marginTop: "2rem" }}>
          <pre ref={resultadoRef} style={{ whiteSpace: "pre-wrap", border: "1px solid #ccc", padding: "1rem", position: "relative" }}>
            {autorizado ? (
              resultado
            ) : (
              <>
                {resultado.slice(0, previewLimit)}
                <div style={{ marginTop: "1rem", fontWeight: "bold", color: "gray" }}>
                  🔒 Documento completo bloqueado. Paga para desbloquear el 100%.
                </div>
              </>
            )}
          </pre>

          {autorizado ? (
            <button onClick={descargarPDF} style={{ marginTop: "1rem" }}>
              📄 Descargar PDF
            </button>
          ) : (
            <button onClick={redirigirAPago} style={{ marginTop: "1rem" }}>
              🔓 Pagar 1,99 € y desbloquear todo el contrato
            </button>
          )}
        </div>
      )}
    </div>
  );
}