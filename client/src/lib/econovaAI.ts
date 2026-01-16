// Lógica del chatbot Econova AI
// Para el demo, usa respuestas mock. En producción se integraría con OpenAI API

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const DEMO_RESPONSES: Record<string, string> = {
  // Pregunta 1: Operativa - Sorprendente y específica
  'cuál es el área que genera más residuos orgánicos': '🏨 **¡Los restaurantes Acuarimas y José juntos!** Generan **14.2 ton/mes de residuos orgánicos**, lo que representa más del **65% de todo el flujo orgánico** del Club Avandaro. Solo Acuarimas aporta **7.8 ton/mes** - eso es equivalente a lo que generan **4 casas del Club Residencial completo**. \n\nLa buena noticia: Todo este flujo orgánico se está procesando correctamente en **Biodegradación ORKA**, convirtiendo los residuos en composta para el campo de golf. Sin embargo, hay una oportunidad: mejorar la separación en origen podría reducir la contaminación cruzada y aumentar el valor de los reciclables.',
  
  // Pregunta 2: Financiera - Impactante con números concretos
  'cuánto dinero estamos perdiendo al no recuperar todos los residuos': '💰 **¡Estás dejando $18K mensuales en la basura!** \n\nActualmente envías **6.2 ton/mes** al relleno sanitario. Si esos residuos se reciclaran correctamente (a $3,500/ton), generarían **$21.7K en ingresos mensuales**. Considerando tus costos actuales de **$3.8K/mes** en manejo, el **potencial de mejora neto es de $17.9K mensuales**.\n\n💡 **Eso son $214.8K anuales** que podrías estar ganando solo mejorando la separación en origen y el proceso de reciclaje. Con ese dinero podrías financiar mejoras en infraestructura, capacitación del personal, o incluso proyectos de energía renovable.',
  
  // Pregunta 3: Reportes - Completa y accionable
  'qué información necesito para la certificación true zero waste': '📊 Para la **Certificación TRUE Zero Waste**, el sistema ya está preparado para generar todo lo necesario:\n\n✅ **1. Trazabilidad completa**: El módulo de Trazabilidad muestra el flujo desde cada punto de generación (casas 501-506, restaurantes, hotel) hasta destino final\n✅ **2. Desviación mínima del 90%**: Actualmente estás en **72%** - necesitas reducir el relleno sanitario de **6.2 ton/mes** a menos de **3.3 ton/mes**\n✅ **3. Auditoría anual**: Los reportes del dashboard incluyen todos los datos mensuales necesarios\n✅ **4. Documentación de compradores**: Ya tienes registrados a "Recupera" y "Verde Ciudad" como compradores\n✅ **5. Eliminación de tóxicos**: Verifica que no haya materiales peligrosos mezclados\n\n🎯 **Próximos pasos**: Enfócate en mejorar la separación en restaurantes y hotel. El sistema tiene toda la infraestructura de datos lista - solo necesitas mejorar los procesos operativos.',
  
  'hola': '¡Hola! Soy Econova AI, tu asistente de gestión ambiental. Puedo ayudarte a entender tus datos de residuos, agua y energía. ¿Qué te gustaría saber?',
  'default': 'Puedo ayudarte con información sobre:\n\n• **Operaciones**: Áreas de generación, flujos de residuos, eficiencia\n• **Finanzas**: Costos, ingresos, potencial de mejora\n• **Certificaciones**: Reportes para TRUE Zero Waste, ISO 14001\n\n¿Qué te gustaría conocer?'
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
