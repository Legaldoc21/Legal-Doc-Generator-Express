export default async function handler(req, res) {
  const { prompt } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "Falta la clave de OpenAI" });
  }

  try {
    const respuesta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: `Eres un abogado experto en legislación española. Redacta un contrato legal detallado para esta situación: ${prompt}` }],
        temperature: 0.7,
      }),
    });

    const data = await respuesta.json();

    if (data.choices?.[0]?.message?.content) {
      res.status(200).json({ resultado: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: "No se pudo generar el contenido" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error de conexión con OpenAI" });
  }
}
