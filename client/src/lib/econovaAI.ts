// Lógica del chatbot Econova AI
// Para el demo, usa respuestas mock. En producción se integraría con OpenAI API

import { generateMonthlyWasteData } from './avandaroData';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Factores financieros (replicados de Dashboard.tsx)
const COSTO_RELLENO_SANITARIO = 850; // $/tonelada
const PRECIO_RECICLABLES = 3500; // $/tonelada
const PRECIO_COMPOSTA = 1200; // $/tonelada
const PRECIO_REUSO = 2500; // $/tonelada
const COSTO_GESTION_TOTAL = 450; // $/tonelada

// Función para calcular balance financiero mensual
function calculateFinancialBalance() {
  const currentYear = 2025;
  const monthlyData = generateMonthlyWasteData(currentYear);
  
  // Calcular totales mensuales promedio
  const totals = monthlyData.reduce((acc, month) => ({
    recyclingTotal: acc.recyclingTotal + month.recyclable,
    compostTotal: acc.compostTotal + month.organic,
    reuseTotal: acc.reuseTotal + month.reuse,
    landfillTotal: acc.landfillTotal + month.landfill,
    totalWeight: acc.totalWeight + month.total,
  }), { recyclingTotal: 0, compostTotal: 0, reuseTotal: 0, landfillTotal: 0, totalWeight: 0 });

  // Convertir a toneladas y calcular promedio mensual
  const avgMonth = 12;
  const totalGeneradoTon = totals.totalWeight / 1000 / avgMonth;
  const totalRellenoTon = totals.landfillTotal / 1000 / avgMonth;
  const totalReciclablesTon = totals.recyclingTotal / 1000 / avgMonth;
  const totalCompostaTon = totals.compostTotal / 1000 / avgMonth;
  const totalReusoTon = totals.reuseTotal / 1000 / avgMonth;

  // Costos mensuales
  const costoRellenoSanitario = totalRellenoTon * COSTO_RELLENO_SANITARIO;
  const costoGestionTotal = totalGeneradoTon * COSTO_GESTION_TOTAL;
  const costoTotalManejo = costoRellenoSanitario + costoGestionTotal;

  // Ingresos mensuales
  const ingresosReciclables = totalReciclablesTon * PRECIO_RECICLABLES;
  const ingresosComposta = totalCompostaTon * PRECIO_COMPOSTA;
  const ingresosReuso = totalReusoTon * PRECIO_REUSO;
  const ingresosTotales = ingresosReciclables + ingresosComposta + ingresosReuso;

  // Balance neto
  const balanceNeto = ingresosTotales - costoTotalManejo;

  return {
    totalGeneradoTon,
    totalReciclablesTon,
    totalCompostaTon,
    totalReusoTon,
    totalRellenoTon,
    ingresosTotales,
    ingresosReciclables,
    ingresosComposta,
    ingresosReuso,
    costoTotalManejo,
    costoGestionTotal,
    costoRellenoSanitario,
    balanceNeto,
  };
}

// Función para generar respuesta de balance financiero
function generateBalanceResponse(): string {
  const balance = calculateFinancialBalance();
  
  return `📊 **Balance Financiero Mensual - Avandaro Club**

💰 **Ingresos Totales**: $${(balance.ingresosTotales / 1000).toFixed(1)}K
• Reciclables: $${(balance.ingresosReciclables / 1000).toFixed(1)}K
• Composta: $${(balance.ingresosComposta / 1000).toFixed(1)}K
• Reuso: $${(balance.ingresosReuso / 1000).toFixed(1)}K

💸 **Costos Totales**: $${(balance.costoTotalManejo / 1000).toFixed(1)}K
• Gestión operativa: $${(balance.costoGestionTotal / 1000).toFixed(1)}K
• Relleno sanitario: $${(balance.costoRellenoSanitario / 1000).toFixed(1)}K

📈 **Generación Total**: ${balance.totalGeneradoTon.toFixed(1)} ton/mes
• Reciclables: ${balance.totalReciclablesTon.toFixed(1)} ton
• Orgánicos: ${balance.totalCompostaTon.toFixed(1)} ton
• Reuso: ${balance.totalReusoTon.toFixed(1)} ton
• Relleno: ${balance.totalRellenoTon.toFixed(1)} ton

💵 **Balance Neto**: $${(balance.balanceNeto / 1000).toFixed(1)}K${balance.balanceNeto >= 0 ? ' 🟢' : ' 🔴'}

${balance.balanceNeto >= 0 
  ? '✅ **Excelente resultado**: Estás generando más ingresos de los residuos recuperados que los costos de gestión. Sigue optimizando la separación en origen para maximizar el balance.' 
  : '⚠️ **Atención necesaria**: Los costos superan los ingresos. Enfócate en mejorar la tasa de desviación para reducir el relleno sanitario y aumentar los ingresos por reciclables.'}`;
}

// Normalizar texto para búsqueda mejorada
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/\s+/g, ' ') // Normalizar espacios
    .trim();
}

// Palabras clave para cada pregunta
const QUESTION_KEYWORDS: Record<string, string[]> = {
  'organicos': ['area', 'genera', 'mas', 'residuos', 'organicos', 'organico'],
  'perdida': ['dinero', 'perdiendo', 'no recuperar', 'residuos', 'basura', 'dejando'],
  'certificacion': ['certificacion', 'true', 'zero', 'waste', 'informacion', 'necesito'],
  'balance': ['balance', 'ingresos', 'egresos', 'este mes', 'cómo vamos', 'como vamos', 'resumen', 'financiero'],
  'hola': ['hola', 'hi', 'buenos días', 'buenas tardes', 'buenas noches'],
};

const DEMO_RESPONSES: Record<string, string> = {
  // Pregunta 1: Operativa - Sorprendente y específica
  'organicos': '🏨 **¡Los restaurantes Acuarimas y José juntos!** Generan **14.2 ton/mes de residuos orgánicos**, lo que representa más del **65% de todo el flujo orgánico** del Club Avandaro. Solo Acuarimas aporta **7.8 ton/mes** - eso es equivalente a lo que generan **4 casas del Club Residencial completo**. \n\nLa buena noticia: Todo este flujo orgánico se está procesando correctamente en **Biodegradación ORKA**, convirtiendo los residuos en composta para el campo de golf. Sin embargo, hay una oportunidad: mejorar la separación en origen podría reducir la contaminación cruzada y aumentar el valor de los reciclables.',
  
  // Pregunta 2: Financiera - Impactante con números concretos
  'perdida': '💰 **¡Estás dejando $18K mensuales en la basura!** \n\nActualmente envías **6.2 ton/mes** al relleno sanitario. Si esos residuos se reciclaran correctamente (a $3,500/ton), generarían **$21.7K en ingresos mensuales**. Considerando tus costos actuales de **$3.8K/mes** en manejo, el **potencial de mejora neto es de $17.9K mensuales**.\n\n💡 **Eso son $214.8K anuales** que podrías estar ganando solo mejorando la separación en origen y el proceso de reciclaje. Con ese dinero podrías financiar mejoras en infraestructura, capacitación del personal, o incluso proyectos de energía renovable.',
  
  // Pregunta 3: Reportes - Completa y accionable
  'certificacion': '📊 Para la **Certificación TRUE Zero Waste**, el sistema ya está preparado para generar todo lo necesario:\n\n✅ **1. Trazabilidad completa**: El módulo de Trazabilidad muestra el flujo desde cada punto de generación (casas 501-506, restaurantes, hotel) hasta destino final\n✅ **2. Desviación mínima del 90%**: Actualmente estás en **72%** - necesitas reducir el relleno sanitario de **6.2 ton/mes** a menos de **3.3 ton/mes**\n✅ **3. Auditoría anual**: Los reportes del dashboard incluyen todos los datos mensuales necesarios\n✅ **4. Documentación de compradores**: Ya tienes registrados a "Recupera" y "Verde Ciudad" como compradores\n✅ **5. Eliminación de tóxicos**: Verifica que no haya materiales peligrosos mezclados\n\n🎯 **Próximos pasos**: Enfócate en mejorar la separación en restaurantes y hotel. El sistema tiene toda la infraestructura de datos lista - solo necesitas mejorar los procesos operativos.',
  
  'hola': '¡Hola! Soy Econova AI, tu asistente de gestión ambiental. Puedo ayudarte a entender tus datos de residuos, agua y energía. ¿Qué te gustaría saber?',
  'default': 'Puedo ayudarte con información sobre:\n\n• **Operaciones**: Áreas de generación, flujos de residuos, eficiencia\n• **Finanzas**: Costos, ingresos, balance mensual, potencial de mejora\n• **Certificaciones**: Reportes para TRUE Zero Waste, ISO 14001\n\n¿Qué te gustaría conocer?'
};

export async function sendMessageToAI(
  messages: ChatMessage[],
  questionCount: number
): Promise<string> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 800));

  const lastMessage = messages[messages.length - 1]?.content || '';
  const normalizedMessage = normalizeText(lastMessage);
  
  // Si la pregunta es sobre balance, recalcular en tiempo real
  if (normalizedMessage.includes('balance') || normalizedMessage.includes('ingresos') || 
      normalizedMessage.includes('egresos') || normalizedMessage.includes('como vamos') ||
      normalizedMessage.includes('cómo vamos') || normalizedMessage.includes('resumen')) {
    return generateBalanceResponse();
  }
  
  // Buscar por palabras clave usando sistema mejorado
  for (const [questionKey, keywords] of Object.entries(QUESTION_KEYWORDS)) {
    // Saltar 'balance' porque ya se maneja antes
    if (questionKey === 'balance') continue;
    
    const matchesAllKeywords = keywords.some(keyword => 
      normalizedMessage.includes(keyword)
    );
    
    // Requisito mínimo: al menos 2 palabras clave deben coincidir (excepto para hola)
    if (questionKey === 'hola') {
      if (normalizedMessage.includes('hola') || normalizedMessage.includes('hi') || 
          normalizedMessage.includes('buenos') || normalizedMessage.includes('buenas')) {
        return DEMO_RESPONSES.hola;
      }
    } else if (matchesAllKeywords) {
      const matchingKeywords = keywords.filter(kw => normalizedMessage.includes(kw));
      // Requerir al menos 2 palabras clave coincidentes para preguntas complejas
      if (matchingKeywords.length >= 2) {
        return DEMO_RESPONSES[questionKey] || DEMO_RESPONSES.default;
      }
    }
  }

  // Respuesta por defecto
  return DEMO_RESPONSES.default;
}

export const MAX_QUESTIONS = 3;
