export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { prompt } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const resultado = data.choices?.[0]?.message?.content || "Error al generar texto";

    res.status(200).json({ resultado });
  } catch (error) {
    console.error("Error al conectar con OpenAI:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}