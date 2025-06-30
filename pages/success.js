import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Success() {
  const router = useRouter();

  useEffect(() => {
    // Marcar como autorizado (simple ejemplo usando localStorage)
    if (typeof window !== "undefined") {
      localStorage.setItem("accesoPermitido", "true");
    }
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "4rem" }}>
      <h1>✅ ¡Pago realizado con éxito!</h1>
      <p>Ya puedes generar tu documento legal personalizado.</p>
      <button onClick={() => router.push("/")}>Ir al generador</button>
    </div>
  );
}