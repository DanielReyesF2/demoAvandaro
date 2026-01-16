// Lógica del chatbot Econova AI
// Para el demo, usa respuestas mock. En producción se integraría con OpenAI API

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Función para normalizar texto (quitar acentos y convertir a minúsculas)
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
    .replace(/[¿?¡!.,]/g, '') // Quitar puntuación
    .trim();
}

// Definir preguntas con palabras clave flexibles
interface DemoQuestion {
  keywords: string[][]; // Arrays de palabras clave que deben coincidir (OR entre arrays, AND dentro de cada array)
  response: string;
}

const DEMO_QUESTIONS: DemoQuestion[] = [
  {
    // Pregunta 1: Operativa - Área con más residuos orgánicos
    keywords: [
      ['area', 'residuos', 'organicos'],
      ['area', 'mas', 'organicos'],
      ['genera', 'mas', 'organicos'],
      ['quien', 'genera', 'organicos'],
      ['donde', 'organicos'],
      ['mas', 'residuos', 'organicos'],
    ],
    response: '🏨 **¡Los restaurantes Acuarimas y José juntos!** Generan **14.2 ton/mes de residuos orgánicos**, lo que representa más del **65% de todo el flujo orgánico** del Club Avandaro. Solo Acuarimas aporta **7.8 ton/mes** - eso es equivalente a lo que generan **4 casas del Club Residencial completo**. \n\nLa buena noticia: Todo este flujo orgánico se está procesando correctamente en **Biodegradación ORKA**, convirtiendo los residuos en composta para el campo de golf. Sin embargo, hay una oportunidad: mejorar la separación en origen podría reducir la contaminación cruzada y aumentar el valor de los reciclables.',
  },
  {
    // Pregunta 2: Financiera - Dinero perdido
    keywords: [
      ['dinero', 'perdiendo'],
      ['dinero', 'perdemos'],
      ['cuanto', 'perdemos'],
      ['cuanto', 'perdiendo'],
      ['dinero', 'basura'],
      ['perdida', 'residuos'],
      ['costo', 'no', 'reciclar'],
      ['dinero', 'recuperar'],
      ['perdemos', 'residuos'],
    ],
    response: '💰 **¡Están perdiendo aproximadamente $12K mensuales!** \n\nActualmente los costos de manejo superan los ingresos por venta de materiales. Envían **6.2 ton/mes** al relleno sanitario pagando disposición, cuando esos materiales podrían generar ingresos.\n\nSi mejoraran la separación en origen y recuperaran el **90%** de los residuos (en lugar del 72% actual), podrían:\n- **Reducir costos** de relleno sanitario en $5.3K/mes\n- **Aumentar ingresos** por venta de reciclables en $8K/mes\n\n💡 **Potencial de mejora: $13K+ mensuales** (~$156K anuales). Con ese dinero podrían financiar infraestructura de separación, capacitación, o proyectos de energía renovable.',
  },
  {
    // Pregunta 3: Certificación TRUE Zero Waste
    keywords: [
      ['certificacion', 'true'],
      ['true', 'zero', 'waste'],
      ['certificacion', 'zero', 'waste'],
      ['informacion', 'certificacion'],
      ['requisitos', 'true'],
      ['como', 'certificar'],
      ['necesito', 'certificacion'],
    ],
    response: '📊 Para la **Certificación TRUE Zero Waste**, el sistema ya está preparado para generar todo lo necesario:\n\n✅ **1. Trazabilidad completa**: El módulo de Trazabilidad muestra el flujo desde cada punto de generación (casas 501-506, restaurantes, hotel) hasta destino final\n✅ **2. Desviación mínima del 90%**: Actualmente estás en **72%** - necesitas reducir el relleno sanitario de **6.2 ton/mes** a menos de **3.3 ton/mes**\n✅ **3. Auditoría anual**: Los reportes del dashboard incluyen todos los datos mensuales necesarios\n✅ **4. Documentación de compradores**: Ya tienes registrados a "Recupera" y "Verde Ciudad" como compradores\n✅ **5. Eliminación de tóxicos**: Verifica que no haya materiales peligrosos mezclados\n\n🎯 **Próximos pasos**: Enfócate en mejorar la separación en restaurantes y hotel. El sistema tiene toda la infraestructura de datos lista - solo necesitas mejorar los procesos operativos.',
  },
];

// Respuestas simples
const SIMPLE_RESPONSES: Record<string, string> = {
  'hola': '¡Hola! Soy Econova AI, tu asistente de gestión ambiental. Puedo ayudarte a entender tus datos de residuos, agua y energía. ¿Qué te gustaría saber?',
  'gracias': '¡De nada! Estoy aquí para ayudarte con cualquier duda sobre la gestión ambiental del Club Avandaro.',
  'ayuda': 'Puedo responder preguntas como:\n\n• ¿Cuál es el área que genera más residuos orgánicos?\n• ¿Cuánto dinero estamos perdiendo al no recuperar todos los residuos?\n• ¿Qué información necesito para la certificación TRUE Zero Waste?',
};

const DEFAULT_RESPONSE = 'Puedo ayudarte con información sobre:\n\n• **Operaciones**: Áreas de generación, flujos de residuos, eficiencia\n• **Finanzas**: Costos, ingresos, potencial de mejora\n• **Certificaciones**: Reportes para TRUE Zero Waste, ISO 14001\n\n¿Qué te gustaría conocer?';

// Función para verificar si todas las palabras clave están en el mensaje
function matchesKeywords(normalizedMessage: string, keywords: string[]): boolean {
  return keywords.every(keyword => normalizedMessage.includes(keyword));
}

export async function sendMessageToAI(
  messages: ChatMessage[],
  questionCount: number
): Promise<string> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 800));

  const lastMessage = messages[messages.length - 1]?.content || '';
  const normalizedMessage = normalizeText(lastMessage);

  // Primero buscar respuestas simples (hola, gracias, etc.)
  for (const [key, response] of Object.entries(SIMPLE_RESPONSES)) {
    if (normalizedMessage.includes(key)) {
      return response;
    }
  }

  // Buscar en las preguntas preparadas con matching flexible
  for (const question of DEMO_QUESTIONS) {
    for (const keywordSet of question.keywords) {
      if (matchesKeywords(normalizedMessage, keywordSet)) {
        return question.response;
      }
    }
  }

  // Respuesta por defecto
  return DEFAULT_RESPONSE;
}

export const MAX_QUESTIONS = 3;
