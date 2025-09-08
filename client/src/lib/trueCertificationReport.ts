import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoPath from '@assets/Logo-ECONOVA-OF_Blanco.png';
import avendaroLogo from '@assets/Logoavandaro_1755897680615.png';

// Colores corporativos
const COLORS = {
  navy: '#273949',      // Azul marino corporativo principal
  navyLight: '#3a556f', // Azul marino más claro 
  navyDark: '#1e2d3b',  // Azul marino más oscuro 
  lime: '#b5e951',      // Verde lima corporativo principal
  lightGray: '#f8f9fa', // Fondo claro
  mediumGray: '#e9ecef', // Fondo medio para paneles
  darkGray: '#495057',  // Texto secundario
};

// Función para dibujar icono de escudo para la certificación TRUE
function drawShieldIcon(doc: jsPDF, x: number, y: number, size: number = 1) {
  // Tamaño del escudo
  const shieldWidth = 10 * size;
  const shieldHeight = 12 * size;
  
  // Dibujar el contorno del escudo (forma básica)
  doc.setFillColor(39, 57, 73); // Color navy
  
  // Parte superior del escudo (rectángulo con bordes redondeados)
  doc.roundedRect(
    x - shieldWidth/2, 
    y - shieldHeight/2, 
    shieldWidth, 
    shieldHeight * 0.6, 
    1, 
    1, 
    'F'
  );
  
  // Parte inferior del escudo (forma de punta)
  doc.triangle(
    x - shieldWidth/2, 
    y - shieldHeight/2 + (shieldHeight * 0.6),
    x + shieldWidth/2, 
    y - shieldHeight/2 + (shieldHeight * 0.6),
    x, 
    y + shieldHeight/2,
    'F'
  );
  
  // Decoración interior del escudo
  doc.setFillColor(181, 233, 81); // Color lime
  doc.circle(x, y - shieldHeight/6, shieldWidth/4, 'F');
  
  // Bordes para dar profundidad
  doc.setDrawColor(20, 40, 70);
  doc.setLineWidth(0.2);
  
  // Borde parte superior
  doc.roundedRect(
    x - shieldWidth/2, 
    y - shieldHeight/2, 
    shieldWidth, 
    shieldHeight * 0.6, 
    1, 
    1, 
    'S'
  );
  
  // Borde parte inferior
  doc.line(
    x - shieldWidth/2, 
    y - shieldHeight/2 + (shieldHeight * 0.6),
    x, 
    y + shieldHeight/2
  );
  doc.line(
    x + shieldWidth/2, 
    y - shieldHeight/2 + (shieldHeight * 0.6),
    x, 
    y + shieldHeight/2
  );
}

// Función auxiliar para añadir el encabezado minimalista
function addHeader(doc: jsPDF, title: string = 'CERTIFICACIÓN TRUE ZERO WASTE') {
  // Barra superior azul 
  doc.setFillColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.rect(0, 0, 210, 20, 'F');
  
  // Línea verde característica
  doc.setFillColor(parseInt(COLORS.lime.slice(1, 3), 16), parseInt(COLORS.lime.slice(3, 5), 16), parseInt(COLORS.lime.slice(5, 7), 16));
  doc.rect(0, 20, 210, 2, 'F');
  
  // Logo de Econova en el lado izquierdo
  try {
    doc.addImage(logoPath, 'PNG', 10, 2, 30, 15, undefined, 'FAST');
  } catch (error) {
    console.error('Error al añadir el logo de Econova:', error);
  }
  
  // Logo del Club Campestre en el lado derecho
  try {
    doc.addImage(avendaroLogo, 'PNG', 170, 2, 15, 15, undefined, 'FAST');
  } catch (error) {
    console.error('Error al añadir el logo del Club de Golf Avandaro:', error);
  }
  
  // Título
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(title, 105, 13, { align: 'center' });
}

type ActionStatus = 'pending' | 'in-progress' | 'completed';

interface ActionItem {
  title: string;
  description: string;
  status: ActionStatus;
}

export async function generateAndDownloadTrueCertificationReport(
  clientName: string,
  trueReadinessIndex: number,
  circularityIndex: number,
  moduleScores: Record<string, number>,
  answers: Record<string, string>
): Promise<void> {
  // Crear documento PDF 
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Añadir encabezado
  addHeader(doc);
  
  // Título principal con mayor impacto visual
  doc.setFillColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.rect(0, 22, 210, 16, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('PLAN DE CERTIFICACIÓN TRUE ZERO WASTE', 105, 33, { align: 'center' });
  
  // Línea decorativa verde
  doc.setFillColor(parseInt(COLORS.lime.slice(1, 3), 16), parseInt(COLORS.lime.slice(3, 5), 16), parseInt(COLORS.lime.slice(5, 7), 16));
  doc.rect(0, 38, 210, 2, 'F');
  
  // Información del cliente
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`Cliente: ${clientName}`, 105, 50, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`Fecha del reporte: ${new Date().toLocaleDateString('es-MX', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  })}`, 105, 58, { align: 'center' });
  
  // Descripción de la certificación
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text('La certificación TRUE (Total Resource Use and Efficiency) reconoce a las instalaciones que logran desviar al menos', 15, 75);
  doc.text('el 90% de sus residuos sólidos del relleno sanitario, incineración y medio ambiente. Este reporte presenta', 15, 82);
  doc.text('el estado actual y las acciones necesarias para alcanzar la certificación.', 15, 89);
  
  // Añadir escudo de certificación en la esquina
  drawShieldIcon(doc, 175, 80, 2);
  
  // Sección de índices principales  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.text('ÍNDICES DE EVALUACIÓN', 15, 105);
  
  // Línea decorativa
  doc.setDrawColor(parseInt(COLORS.lime.slice(1, 3), 16), parseInt(COLORS.lime.slice(3, 5), 16), parseInt(COLORS.lime.slice(5, 7), 16));
  doc.setLineWidth(0.7);
  doc.line(15, 107, 80, 107);
  
  // Panel para TRUE Readiness Index
  doc.setFillColor(245, 247, 250);
  doc.rect(15, 110, 90, 35, 'F');
  
  // TRUE Readiness Index
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.text('TRUE Readiness Index', 20, 120);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(trueReadinessIndex >= 70 ? 16 : 239, trueReadinessIndex >= 70 ? 185 : 68, trueReadinessIndex >= 70 ? 129 : 68);
  doc.text(`${trueReadinessIndex}%`, 20, 135);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  const readinessLevel = trueReadinessIndex >= 80 ? 'LISTO PARA TRUE' :
                        trueReadinessIndex >= 60 ? 'BIEN POSICIONADO' :
                        trueReadinessIndex >= 40 ? 'GRAN POTENCIAL' : 'OPORTUNIDAD DE IMPACTO';
  doc.text(readinessLevel, 20, 142);

  // Panel para Índice de Circularidad
  doc.setFillColor(245, 247, 250);
  doc.rect(110, 110, 90, 35, 'F');
  
  // Índice de Circularidad
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.text('Índice de Circularidad', 115, 120);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(circularityIndex >= 70 ? 139 : 147, circularityIndex >= 70 ? 92 : 51, circularityIndex >= 70 ? 246 : 230);
  doc.text(`${circularityIndex}%`, 115, 135);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  const circularityLevel = circularityIndex >= 80 ? 'CIRCULAR AVANZADO' :
                          circularityIndex >= 60 ? 'CIRCULARIDAD SÓLIDA' :
                          circularityIndex >= 40 ? 'EN TRANSICIÓN' : 'GRAN POTENCIAL';
  doc.text(circularityLevel, 115, 142);

  // Análisis estratégico basado en resultados
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.text('ANÁLISIS ESTRATÉGICO', 15, 160);
  
  // Línea decorativa
  doc.setDrawColor(parseInt(COLORS.lime.slice(1, 3), 16), parseInt(COLORS.lime.slice(3, 5), 16), parseInt(COLORS.lime.slice(5, 7), 16));
  doc.setLineWidth(0.7);
  doc.line(15, 162, 120, 162);

  // Determinar estrategia recomendada
  const strategyRecommendation = trueReadinessIndex >= 80 ? 
    'Certificación TRUE Inmediata' : 
    trueReadinessIndex >= 60 ?
    'Preparación Acelerada para TRUE' :
    'Precertificación Estratégica';

  // Panel de recomendación estratégica
  doc.setFillColor(245, 247, 250);
  doc.rect(15, 170, 180, 40, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.text('Estrategia Recomendada:', 20, 180);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(16, 185, 129);
  doc.text(strategyRecommendation, 20, 190);
  
  // Descripción de la estrategia
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  
  if (trueReadinessIndex >= 80) {
    doc.text('Su organización está perfectamente posicionada para la certificación TRUE', 20, 200);
    doc.text('Zero Waste. Recomendamos iniciar el proceso de certificación inmediato.', 20, 207);
  } else if (trueReadinessIndex >= 60) {
    doc.text('Excelente base para TRUE. Con mejoras específicas en áreas clave,', 20, 200);
    doc.text('puede alcanzar la certificación en 6-12 meses.', 20, 207);
  } else {
    doc.text('Gran oportunidad para precertificación. Esta estrategia permite impacto', 20, 200);
    doc.text('inmediato mientras construye fundamentos para TRUE completo.', 20, 207);
  }

  const finalY = 220;

  // Sección de áreas de oportunidad
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.text('ÁREAS DE OPORTUNIDAD', 15, finalY);
  
  // Línea decorativa
  doc.setDrawColor(parseInt(COLORS.lime.slice(1, 3), 16), parseInt(COLORS.lime.slice(3, 5), 16), parseInt(COLORS.lime.slice(5, 7), 16));
  doc.setLineWidth(0.7);
  doc.line(15, finalY + 2, 120, finalY + 2);
  
  // Encontrar módulos con más oportunidad de mejora
  const moduleNames = {
    'B': 'Información y Seguimiento',
    'C': 'Reducción de Residuos', 
    'D': 'Gestión de Materiales',
    'E': 'Tratamiento de Residuos',
    'F': 'Organización',
    'G': 'Innovación y Mejora Continua'
  };

  const sortedModules = Object.entries(moduleScores)
    .filter(([moduleId]) => moduleNames[moduleId as keyof typeof moduleNames])
    .map(([moduleId, score]) => ({
      id: moduleId,
      name: moduleNames[moduleId as keyof typeof moduleNames],
      score: Math.round(score * 100)
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  
  let currentY = finalY + 15;
  doc.text('Priorizar las siguientes áreas para maximizar el impacto:', 20, currentY);
  currentY += 10;

  sortedModules.forEach((module, index) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${module.name} (${module.score}%)`, 25, currentY);
    currentY += 6;
    
    doc.setFont('helvetica', 'normal');
    const recommendation = module.score < 40 ? 
      'Oportunidad de alto impacto para desarrollo inicial' :
      module.score < 70 ? 
      'Área estratégica para mejora acelerada' :
      'Excelente base para optimización avanzada';
    
    doc.text(`   ${recommendation}`, 25, currentY);
    currentY += 8;
  });
  
  // Información de contacto
  const contactY = currentY + 10;
  doc.setFillColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.rect(0, contactY, 210, 25, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text('ECONOVA - TRUE Zero Waste Consulting', 105, contactY + 8, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Certificación TRUE Zero Waste | Consultoría en Sustentabilidad', 105, contactY + 16, { align: 'center' });
  doc.text('Email: info@econova.com.mx | Tel: +52 55 1234 5678', 105, contactY + 22, { align: 'center' });
  // Generar y descargar el PDF
  const pdfBlob = doc.output('blob');
  const blobUrl = URL.createObjectURL(pdfBlob);
  
  // Crear un enlace temporal
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = `Plan_Estrategico_TRUE_${clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  
  // Simular un clic en el enlace para iniciar la descarga
  document.body.appendChild(link);
  link.click();
  
  // Limpiar
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
}