// pages/api/generar.js
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { prompt } = req.body;

  if (!prompt || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'Prompt vacío' });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'Eres un abogado experto en derecho español. Escribe documentos legales claros, completos y profesionales, listos para ser usados.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.5,
    });

    const result = completion.data.choices[0].message.content;
    res.status(200).json({ resultado: result });
  } catch (error) {
    console.error('Error al conectar con OpenAI:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
