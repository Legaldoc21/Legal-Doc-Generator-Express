import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [form, setForm] = useState({
    comprador: "",
    vendedor: "",
    descripcion: "",
    precio: "",
    tono: "Formal",
  });

  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState("");
  const [autorizado, setAutorizado] = useState(false);
  const resultadoRef = useRef(null);

  useEffect(() => {
    const acceso = localStorage.getItem("accesoPermitido");
    if (acceso === "true") setAutorizado(true);

    // Inyectar script de html2pdf.js
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  const handleChange = (campo, valor) => {
    setForm({ ...form, [campo]: valor });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResultado("");

    const prompt = `Redacta un contrato de compraventa con estos datos:\nComprador: ${form.comprador}\nVendedor: ${form.vendedor}\nDescripción del artículo: ${form.descripcion}\nPrecio: ${form.precio}€\nTono: ${form.tono}`;

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

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "2rem" }}>
      <h1>Redactador Legal Exprés</h1>
      <p>Documentos legales personalizados por solo 1,99 €</p>

      {!autorizado ? (
        <button onClick={redirigirAPago} style={{ marginTop: "2rem" }}>
          Pagar 1,99 € y acceder al generador
        </button>
      ) : (
        <>
          <input
            placeholder="Nombre del comprador"
            value={form.comprador}
            onChange={(e) => handleChange("comprador", e.target.value)}
            style={{ display: "block", width: "100%", margin: "10px 0" }}
          />
          <input
            placeholder="Nombre del vendedor"
            value={form.vendedor}
            onChange={(e) => handleChange("vendedor", e.target.value)}
            style={{ display: "block", width: "100%", margin: "10px 0" }}
          />
          <input
            placeholder="Descripción del artículo"
            value={form.descripcion}
            onChange={(e) => handleChange("descripcion", e.target.value)}
            style={{ display: "block", width: "100%", margin: "10px 0" }}
          />
          <input
            placeholder="Precio (€)"
            value={form.precio}
            onChange={(e) => handleChange("precio", e.target.value)}
            style={{ display: "block", width: "100%", margin: "10px 0" }}
          />
          <select
            value={form.tono}
            onChange={(e) => handleChange("tono", e.target.value)}
            style={{ display: "block", width: "100%", margin: "10px 0" }}
          >
            <option value="Formal">Formal</option>
            <option value="Informal">Informal</option>
          </select>

          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Generando..." : "Generar documento"}
          </button>

          {resultado && (
            <div style={{ marginTop: "2rem" }}>
              <pre ref={resultadoRef} style={{ whiteSpace: "pre-wrap", border: "1px solid #ccc", padding: "1rem" }}>
                {resultado}
              </pre>
              <button onClick={descargarPDF} style={{ marginTop: "1rem" }}>
                📄 Descargar PDF
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}