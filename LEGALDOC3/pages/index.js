import { useState } from "react";

export default function Home() {
  const [descripcion, setDescripcion] = useState("");

  const handlePago = async () => {
    const response = await fetch("/api/checkout", { method: "POST" });
    const data = await response.json();
    if (data?.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-900">Redactor Legal Exprés</h1>
      <p className="mb-4 text-center max-w-xl text-gray-700">
        Describe tu situación legal y genera un documento personalizado y profesional al instante.
      </p>
      <textarea
        className="w-full max-w-xl p-3 border border-gray-300 rounded mb-4"
        rows="6"
        placeholder="Escribe tu situación legal aquí..."
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />
      <button
        onClick={handlePago}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition-all"
      >
        Acceder al documento - 5€
      </button>
    </div>
  );
}