// Lógica del chatbot Econova AI
// Para el demo, usa respuestas mock. En producción se integraría con OpenAI API

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const DEMO_RESPONSES: Record<string, string> = {
  'hola': '¡Hola! Soy Econova AI, tu asistente de gestión ambiental. Puedo ayudarte a entender tus datos de residuos, agua y energía. ¿Qué te gustaría saber?',
  'cuánto': 'Según los datos más recientes, el Club Avandaro ha desviado **72%** de sus residuos del relleno sanitario. Esto incluye reciclaje, compostaje y reutilización. ¿Te gustaría saber más sobre algún módulo específico?',
  'residuos': 'En el módulo de Trazabilidad de Residuos puedes ver el flujo completo desde las áreas de generación (casas 501-506, restaurantes, etc.) hasta los destinos finales. Actualmente procesamos **33 ton/mes** con una desviación del **72%**.',
  'agua': 'El módulo de Agua muestra el consumo, reciclaje a través de la PTAR, y eficiencia del sistema. Actualmente reciclamos **28.9%** del agua total, principalmente para riego del campo de golf.',
  'energía': 'El módulo de Energía muestra el consumo, generación renovable de paneles solares, y emisiones de CO₂. Actualmente **29.1%** de nuestra energía es renovable, reduciendo significativamente las emisiones.',
  'casas': 'Las casas 501-506 del Club Residencial Avandaro generan aproximadamente **1.5 ton/mes** de residuos orgánicos, **1.0 ton/mes** de reciclables, y **0.8 ton/mes** de inorgánicos. Puedes expandir el diagrama en el dashboard para ver cada casa individualmente.',
  'default': 'Puedo ayudarte con información sobre:\n\n• **Residuos**: Flujos, desviación, y trazabilidad\n• **Agua**: Consumo, reciclaje PTAR, y eficiencia\n• **Energía**: Renovables, emisiones, y ahorros\n• **Casas 501-506**: Generación por vivienda\n\n¿Qué te gustaría conocer?'
};

export async function sendMessageToAI(
  messages: ChatMessage[],
  questionCount: number
): Promise<string> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 800));

  const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
  
  // Buscar respuesta específica
  for (const [key, response] of Object.entries(DEMO_RESPONSES)) {
    if (lastMessage.includes(key) && key !== 'default') {
      return response;
    }
  }

  // Respuesta por defecto
  return DEMO_RESPONSES.default;
}

export const MAX_QUESTIONS = 3;
