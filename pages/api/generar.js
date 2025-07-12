import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { prompt } = req.body;

  if (!prompt || prompt.trim() === "") {
    return res.status(400).json({ error: "El prompt es obligatorio" });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Eres un abogado experto en legislación española. Vas a redactar un contrato legal completo, válido y profesional, adaptado a la situación descrita por el usuario. Usa lenguaje legal real y no des explicaciones, solo el texto final del contrato.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const resultado = completion.data.choices[0].message.content;
    res.status(200).json({ resultado });
  } catch (error) {
    console.error("Error al generar el documento:", error);
    res.status(500).json({ error: "Error al generar el documento" });
  }
}
