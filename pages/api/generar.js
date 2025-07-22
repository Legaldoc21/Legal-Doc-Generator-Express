// pages/api/generar.js
import OpenAI from 'openai';

// Configuración de OpenAI con la clave de API desde variables de entorno
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Configuración de CORS para permitir peticiones desde el frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  // Solo permitimos métodos POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Método no permitido',
      message: 'Esta API solo acepta peticiones POST' 
    });
  }

  // Validación del prompt
  const { prompt } = req.body;
  if (!prompt || prompt.trim().length === 0) {
    return res.status(400).json({ 
      error: 'Prompt vacío',
      message: 'Debes proporcionar una descripción válida para generar el documento' 
    });
  }

  try {
    // Llamada a la API de OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Eres un abogado experto en derecho español. Genera documentos legales claros, profesionales y en español. Incluye todos los elementos necesarios para que sea válido.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,  // Controla la creatividad (0 = más determinista)
      max_tokens: 1500   // Límite de longitud del documento
    });

    // Extraemos el resultado
    const resultado = completion.choices[0]?.message?.content;
    
    // Si no hay resultado, lanzamos error
    if (!resultado) {
      throw new Error('No se recibió respuesta de OpenAI');
    }

    // Enviamos la respuesta exitosa
    return res.status(200).json({ 
      resultado,
      modelo: completion.model,
      tokens_usados: completion.usage?.total_tokens 
    });

  } catch (error) {
    // Manejo detallado de errores
    console.error('Error en la API de OpenAI:', {
      message: error.message,
      code: error.code,
      status: error.status
    });

    return res.status(500).json({
      error: 'Error al generar el documento',
      detalle: error.message,
      tipo: error.code || 'openai_error'
    });
  }
}

