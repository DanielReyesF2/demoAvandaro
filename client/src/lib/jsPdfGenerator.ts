import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Client, WasteData } from '@shared/schema';
import autoTable from 'jspdf-autotable';
import { createGradientPattern } from './imageUtils';
import logoPath from '@assets/Logo-ECONOVA-OF_Blanco.png';

// Acciones pendientes para certificación TRUE
const truePendingActions = [
  {
    title: 'Plan de Manejo Integral de Residuos',
    description: 'Desarrollar un plan documentado de gestión de residuos con objetivos medibles.',
    status: 'pending' // pending, in-progress, completed
  },
  {
    title: 'Sistema de Compostaje',
    description: 'Implementar sistema de compostaje propio o contratar proveedor para residuos orgánicos.',
    status: 'in-progress'
  },
  {
    title: 'Trazabilidad de Residuos',
    description: 'Establecer sistema de seguimiento para todos los flujos de residuos.',
    status: 'pending'
  },
  {
    title: 'Capacitación del Personal',
    description: 'Capacitar a todo el personal en los protocolos de separación y reducción.',
    status: 'in-progress'
  },
  {
    title: 'Políticas de Compras Sostenibles',
    description: 'Implementar políticas que prioricen productos con menor generación de residuos.',
    status: 'pending'
  }
];

// Un margen adecuado mejora la legibilidad del documento
const MARGINS = {
  top: 25,
  bottom: 25,
  left: 15,
  right: 15
};

// Colores corporativos de Econova - Paleta extendida y mejorada para mejor diseño
const COLORS = {
  navy: '#273949',      // Azul marino corporativo principal
  navyLight: '#3a556f', // Azul marino más claro para variaciones
  navyDark: '#1e2d3b',  // Azul marino más oscuro para sombras y detalles
  lime: '#b5e951',      // Verde lima corporativo principal
  limeLight: '#c7ef7a', // Verde lima más claro para hover y destacados
  limeDark: '#9aca45',  // Verde lima más oscuro para bordes y detalles
  lightGray: '#f8f9fa', // Fondo claro
  mediumGray: '#e9ecef', // Fondo medio para paneles
  darkGray: '#495057',  // Texto secundario
  green: '#74c278',     // Verde para orgánicos
  greenLight: '#a3dcaa', // Verde claro para fondos de orgánicos
  blue: '#3e8cbe',      // Azul para elementos decorativos
  blueLight: '#70b0dc', // Azul claro para fondos y decoraciones
  accent: '#e9f5d8',    // Color de acento suave
  accentDark: '#d8edbd', // Acento más oscuro para bordes
  water: '#63c5da',     // Azul agua para indicadores hídricos
  energy: '#ffd166',    // Amarillo para energía
  teal: '#20b2aa',      // Verde azulado para PODA
  coral: '#ff7f50',     // Coral para elementos destacados
};

// Función para formatear números con separador de miles
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 }).format(num);
};

// Función auxiliar para añadir el encabezado minimalista de Econova
function addMinimalistHeader(doc: jsPDF, title: string = 'REPORTE DE GESTIÓN DE RESIDUOS') {
  // Barra superior azul 
  doc.setFillColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.rect(0, 0, 210, 20, 'F');
  
  // Línea verde característica
  doc.setFillColor(parseInt(COLORS.lime.slice(1, 3), 16), parseInt(COLORS.lime.slice(3, 5), 16), parseInt(COLORS.lime.slice(5, 7), 16));
  doc.rect(0, 20, 210, 2, 'F');
  
  // Logo en el encabezado
  try {
    doc.addImage(logoPath, 'PNG', 10, 2, 30, 15, undefined, 'FAST');
  } catch (error) {
    console.error('Error al añadir el logo en el encabezado:', error);
  }
  
  // Título
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(title, 105, 13, { align: 'center' });
}

// Función para dibujar icono de árbol más detallado y alineado correctamente
function drawTreeIcon(doc: jsPDF, x: number, y: number, size: number = 1) {
  // Centrar mejor las posiciones
  const trunkWidth = 3 * size;
  const trunkHeight = 10 * size; // Ligeramente más corto
  const crownRadius = 8 * size; // Ligeramente más pequeño
  
  // Posición del tronco perfectamente centrada
  const trunkX = x - (trunkWidth/2);
  const trunkY = y - (trunkHeight/2);
  
  // Tronco con color más suave
  doc.setFillColor(140, 100, 60); // Marrón más claro para el tronco
  doc.rect(trunkX, trunkY, trunkWidth, trunkHeight, 'F');
  
  // Copa del árbol (varias capas para darle forma)
  const crownCenterY = y - (trunkHeight/2) - (crownRadius * 0.5); // Posición más precisa
  
  // Capa base más grande
  doc.setFillColor(76, 175, 80); // Verde medio
  doc.circle(x, crownCenterY, crownRadius, 'F');
  
  // Capa media
  doc.setFillColor(100, 190, 90); // Verde claro
  doc.circle(x, crownCenterY - (crownRadius * 0.2), crownRadius * 0.8, 'F');
  
  // Capa superior más pequeña
  doc.setFillColor(120, 200, 100); // Verde aún más claro
  doc.circle(x, crownCenterY - (crownRadius * 0.4), crownRadius * 0.6, 'F');
}

// Función para dibujar icono de gota de agua más detallado y alineado
function drawWaterDropIcon(doc: jsPDF, x: number, y: number, size: number = 1) {
  // Tamaños ajustados para mejor proporción
  const dropWidth = 8 * size;
  const dropHeight = 12 * size;
  
  // Usamos colores más suaves y evitamos colores oscuros
  
  // Forma principal de la gota primero (sin sombra para evitar problemas de alineación)
  doc.setFillColor(80, 165, 225); // Azul principal más suave
  doc.ellipse(x, y, dropWidth/2, dropHeight/2, 'F');
  
  // Brillo para efecto 3D - bien posicionado
  doc.setFillColor(165, 210, 245); // Azul más claro
  doc.ellipse(x - dropWidth/8, y - dropHeight/8, dropWidth/4, dropHeight/4, 'F');
  
  // Borde suave en lugar de sombra
  doc.setDrawColor(65, 145, 205);
  doc.setLineWidth(0.5);
  doc.ellipse(x, y, dropWidth/2, dropHeight/2, 'S');
}

// Función para dibujar icono de rayo eléctrico más detallado y mejor alineado
function drawLightningIcon(doc: jsPDF, x: number, y: number, size: number = 1) {
  // Ajustar tamaños para una mejor proporción
  const boltWidth = 9 * size;
  const boltHeight = 14 * size;
  
  // Usar un amarillo más suave para mejor impresión
  doc.setFillColor(245, 215, 85); // Amarillo más suave
  
  // En lugar de usar polygon (que no existe en jsPDF), usamos triángulos
  // Dibujar el rayo principal con triángulos simples
  
  // Parte superior del rayo
  doc.triangle(
    x, y - boltHeight/2,                   // Punta superior
    x + boltWidth*0.3, y - boltHeight*0.2, // Esquina derecha superior
    x - boltWidth*0.4, y - boltHeight*0.2  // Esquina izquierda superior
  , 'F');
  
  // Parte central derecha
  doc.triangle(
    x - boltWidth*0.1, y,                 // Punto medio
    x + boltWidth*0.3, y - boltHeight*0.2, // Punto superior derecho
    x - boltWidth*0.4, y - boltHeight*0.2  // Punto superior izquierdo
  , 'F');
  
  // Parte inferior del rayo
  doc.triangle(
    x - boltWidth*0.1, y,                // Punto medio
    x + boltWidth*0.4, y + boltHeight/2, // Punta inferior
    x, y + boltHeight*0.1                // Punto medio inferior
  , 'F');
  
  // Parte inferior izquierda
  doc.triangle(
    x - boltWidth*0.1, y,                // Punto medio
    x, y + boltHeight*0.1,               // Punto medio inferior
    x - boltWidth*0.4, y - boltHeight*0.2 // Punto superior izquierdo
  , 'F');
  
  // Añadir un brillo para efecto de energía
  doc.setFillColor(255, 245, 180);
  doc.circle(x, y - boltHeight*0.25, boltWidth*0.12, 'F');
}

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

// Función para añadir sección de Certificación TRUE al PDF
function addTrueCertificationSection(doc: jsPDF, currentDeviation: number) {
  // Añadir encabezado para la página
  addMinimalistHeader(doc, 'CERTIFICACIÓN TRUE ZERO WASTE');
  
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
  
  // Descripción de la certificación
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text('La certificación TRUE (Total Resource Use and Efficiency) reconoce a las instalaciones que logran desviar al menos', 15, 50);
  doc.text('el 90% de sus residuos sólidos del relleno sanitario, incineración y medio ambiente. Este reporte presenta', 15, 57);
  doc.text('el estado actual y las acciones necesarias para alcanzar la certificación.', 15, 64);
  
  // Añadir escudo de certificación en la esquina
  drawShieldIcon(doc, 185, 55, 2);
  
  // Sección de estado actual de la certificación
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.text('ESTADO ACTUAL', 15, 80);
  
  // Línea decorativa
  doc.setDrawColor(parseInt(COLORS.lime.slice(1, 3), 16), parseInt(COLORS.lime.slice(3, 5), 16), parseInt(COLORS.lime.slice(5, 7), 16));
  doc.setLineWidth(0.7);
  doc.line(15, 82, 80, 82);
  
  // Panel para el estado actual
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(15, 90, 180, 50, 3, 3, 'F');
  
  // Dibujar barra de progreso
  // Fondo de la barra
  doc.setFillColor(220, 220, 220);
  doc.roundedRect(30, 103, 150, 8, 4, 4, 'F');
  
  // Progreso actual
  const progressPercentage = Math.min(100, (currentDeviation / 90) * 100);
  const progressWidth = 150 * (progressPercentage / 100);
  
  // Color según el nivel de progreso
  let progressColor = COLORS.green;
  if (currentDeviation < 50) {
    progressColor = COLORS.coral; // Rojo/coral para nivel crítico
  } else if (currentDeviation < 75) {
    progressColor = COLORS.energy; // Amarillo para nivel medio
  }
  
  doc.setFillColor(
    parseInt(progressColor.slice(1, 3), 16),
    parseInt(progressColor.slice(3, 5), 16),
    parseInt(progressColor.slice(5, 7), 16)
  );
  doc.roundedRect(30, 103, progressWidth, 8, 4, 4, 'F');
  
  // Marcador de meta
  const targetX = 30 + (150 * 90) / 100;
  doc.setDrawColor(39, 57, 73); // Navy
  doc.setLineWidth(1.5);
  doc.line(targetX, 98, targetX, 116);
  
  // Etiqueta de meta
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(39, 57, 73);
  doc.text('Meta 90%', targetX - 10, 95);
  
  // Indicador de desviación actual
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Índice de Desviación Actual:', 30, 130);
  
  doc.setFontSize(24);
  doc.setTextColor(39, 57, 73);
  doc.text(`${currentDeviation.toFixed(1)}%`, 160, 130, { align: 'center' });
  
  // Estado con color
  doc.setFontSize(12);
  let statusText = '';
  
  if (currentDeviation < 50) {
    statusText = 'ESTADO: CRÍTICO';
    doc.setTextColor(220, 38, 38); // Rojo
  } else if (currentDeviation < 75) {
    statusText = 'ESTADO: EN PROGRESO';
    doc.setTextColor(245, 158, 11); // Ámbar
  } else if (currentDeviation < 90) {
    statusText = 'ESTADO: CERCANO A META';
    doc.setTextColor(16, 185, 129); // Verde
  } else {
    statusText = 'ESTADO: META ALCANZADA';
    doc.setTextColor(5, 150, 105); // Verde oscuro
  }
  
  doc.text(statusText, 105, 145, { align: 'center' });
  
  // Sección de acciones pendientes
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.text('ACCIONES PENDIENTES', 15, 160);
  
  // Línea decorativa
  doc.setDrawColor(parseInt(COLORS.lime.slice(1, 3), 16), parseInt(COLORS.lime.slice(3, 5), 16), parseInt(COLORS.lime.slice(5, 7), 16));
  doc.setLineWidth(0.7);
  doc.line(15, 162, 120, 162);
  
  // Tabla de acciones pendientes
  // @ts-ignore
  autoTable(doc, {
    startY: 170,
    head: [['Acción', 'Descripción', 'Estado']],
    body: truePendingActions.map(action => {
      let statusText = '';
      switch (action.status) {
        case 'completed':
          statusText = 'Completado';
          break;
        case 'in-progress':
          statusText = 'En progreso';
          break;
        case 'pending':
          statusText = 'Pendiente';
          break;
      }
      return [action.title, action.description, statusText];
    }),
    headStyles: {
      fillColor: [39, 57, 73], // Navy
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 250]
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 100 },
      2: { cellWidth: 30 }
    },
    didDrawPage: (data) => {
      // Añadir encabezado para cada página adicional si la tabla se extiende
      if (data.pageCount > 1 && data.cursor.y === data.settings.margin.top) {
        addMinimalistHeader(doc, 'CERTIFICACIÓN TRUE ZERO WASTE');
      }
    }
  });
  
  // Añadir recomendaciones según el nivel actual
  // Obtener la posición Y después de la tabla
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  // Si hay espacio suficiente en la página actual
  if (finalY < 240) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
    doc.text('RECOMENDACIONES', 15, finalY);
    
    // Línea decorativa
    doc.setDrawColor(parseInt(COLORS.lime.slice(1, 3), 16), parseInt(COLORS.lime.slice(3, 5), 16), parseInt(COLORS.lime.slice(5, 7), 16));
    doc.setLineWidth(0.7);
    doc.line(15, finalY + 2, 110, finalY + 2);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    // Recomendaciones basadas en el nivel actual de desviación
    let recommendations = [];
    
    if (currentDeviation < 50) {
      recommendations = [
        '1. Priorizar la implementación del Plan de Manejo Integral de Residuos.',
        '2. Adquirir tecnología de compostaje para aumentar la desviación de residuos orgánicos.',
        '3. Implementar sistema de trazabilidad para todos los flujos de residuos.',
        '4. Capacitar a todo el personal en separación adecuada de residuos en origen.'
      ];
    } else if (currentDeviation < 75) {
      recommendations = [
        '1. Reforzar los programas de separación en la fuente, especialmente en áreas de cocina.',
        '2. Aumentar la capacidad de procesamiento de residuos orgánicos para compostaje.',
        '3. Implementar auditorías internas mensuales para verificar la correcta separación.',
        '4. Desarrollar políticas de compras sostenibles para reducir residuos desde el origen.'
      ];
    } else {
      recommendations = [
        '1. Afinar los procesos actuales para incrementar la desviación del 37.18% al 90%.',
        '2. Completar la documentación requerida para la precertificación.',
        '3. Desarrollar campañas de comunicación para involucrar a los socios del club.',
        '4. Programar una pre-auditoría con consultores certificados en TRUE.'
      ];
    }
    
    // Escribir recomendaciones
    let yPosition = finalY + 10;
    recommendations.forEach(recommendation => {
      doc.text(recommendation, 20, yPosition);
      yPosition += 7;
    });
  }
}

// Función para dibujar icono de hoja para CO2 más detallado y correctamente alineado
function drawLeafIcon(doc: jsPDF, x: number, y: number, size: number = 1) {
  // Ajustar tamaños para una mejor proporción
  const leafWidth = 8 * size;
  const leafHeight = 12 * size; // Ligeramente más corta para mejor proporción
  
  // Forma principal de la hoja - usar color más suave, evitar colores oscuros
  doc.setFillColor(100, 190, 130); // Verde medio más suave
  doc.ellipse(x, y, leafWidth/2, leafHeight/2, 'F');
  
  // Borde suave para mejor definición
  doc.setDrawColor(80, 170, 110);
  doc.setLineWidth(0.5);
  doc.ellipse(x, y, leafWidth/2, leafHeight/2, 'S');
  
  // Nervio central
  doc.setDrawColor(80, 170, 110); // Verde más suave para nervios
  doc.setLineWidth(0.7 * size);
  doc.line(x, y - leafHeight/2, x, y + leafHeight/2);
  
  // Nervios laterales más precisos y mejor alineados
  doc.setLineWidth(0.4 * size);
  const nerveLength = leafWidth * 0.35;
  const nerveCount = 4; // Menos nervios para mayor claridad
  const nerveSpacing = leafHeight / (nerveCount + 1);
  
  // Dibujamos nervios simétricos a cada lado
  for (let i = 1; i <= nerveCount; i++) {
    const yPos = y - leafHeight/2 + i * nerveSpacing;
    const angle = 20; // Ángulo en grados para los nervios
    const angleRad = angle * Math.PI / 180;
    
    // Calculamos puntos finales con trigonometría para mejor alineación
    // Nervio derecho
    const rightEndX = x + nerveLength * Math.cos(angleRad);
    const rightEndY = yPos - nerveLength * Math.sin(angleRad);
    doc.line(x, yPos, rightEndX, rightEndY);
    
    // Nervio izquierdo (reflejado)
    const leftEndX = x - nerveLength * Math.cos(angleRad);
    const leftEndY = yPos - nerveLength * Math.sin(angleRad);
    doc.line(x, yPos, leftEndX, leftEndY);
  }
  
  // Brillo para efecto 3D
  doc.setFillColor(140, 230, 170, 0.7);
  doc.ellipse(x - leafWidth/8, y - leafHeight/6, leafWidth/6, leafHeight/8, 'F');
}

interface ReportData {
  client: Client;
  wasteData: WasteData[];
  organicTotal: number;
  inorganicTotal: number;
  recyclableTotal: number;
  totalWaste: number;
  deviation: number;
  period: string;
}

export async function generateClientPDF(data: ReportData): Promise<Blob> {
  // Crear documento PDF - ahora con 4 páginas (agregamos certificación TRUE)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // ===== PÁGINA 1: PORTADA Y RESUMEN EJECUTIVO =====
  // Fondo blanco limpio para mayor minimalismo
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, 'F');
  
  // Barra superior con color corporativo - más compacta
  doc.setFillColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.rect(0, 0, 210, 50, 'F');
  
  // Línea decorativa verde
  doc.setFillColor(parseInt(COLORS.lime.slice(1, 3), 16), parseInt(COLORS.lime.slice(3, 5), 16), parseInt(COLORS.lime.slice(5, 7), 16));
  doc.rect(0, 50, 210, 3, 'F');
  
  // Añadir imagen del logo centrado
  try {
    doc.addImage(logoPath, 'PNG', 70, 8, 70, 35, undefined, 'FAST');
  } catch (error) {
    console.error('Error al añadir el logo:', error);
  }
  
  // Título del reporte con aspecto minimalista
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.setFontSize(22);
  doc.text('REPORTE DE GESTIÓN DE RESIDUOS', 105, 70, { align: 'center' });
  
  // Línea decorativa para separar el título
  doc.setDrawColor(parseInt(COLORS.lime.slice(1, 3), 16), parseInt(COLORS.lime.slice(3, 5), 16), parseInt(COLORS.lime.slice(5, 7), 16));
  doc.setLineWidth(1);
  doc.line(60, 75, 150, 75);
  
  // Cliente
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(data.client.name, 105, 90, { align: 'center' });
  
  // Información del periodo
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.text(data.period, 105, 105, { align: 'center' });
  
  // INDICADORES CLAVE - Panel más compacto
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(15, 115, 180, 40, 3, 3, 'F');
  
  // Título de la métrica clave
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.text('INDICADORES CLAVE', 105, 125, { align: 'center' });
  
  // Calcular valores en toneladas
  const organicTons = data.organicTotal / 1000;
  const inorganicTons = data.inorganicTotal / 1000;
  const recyclableTons = data.recyclableTotal / 1000;
  const totalTons = data.totalWaste / 1000;
  const landfillTons = organicTons + inorganicTons;
  
  // Mostrar tres indicadores clave en línea
  // 1. Desviación
  doc.setFillColor(parseInt(COLORS.lime.slice(1, 3), 16), parseInt(COLORS.lime.slice(3, 5), 16), parseInt(COLORS.lime.slice(5, 7), 16));
  doc.circle(45, 140, 12, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.text(`${data.deviation.toFixed(1)}%`, 45, 143, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('ÍNDICE DE DESVIACIÓN', 45, 155, { align: 'center' });
  
  // 2. Total toneladas
  doc.setFillColor(parseInt(COLORS.blue.slice(1, 3), 16), parseInt(COLORS.blue.slice(3, 5), 16), parseInt(COLORS.blue.slice(5, 7), 16), 0.8);
  doc.circle(105, 140, 12, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(formatNumber(totalTons), 105, 143, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(parseInt(COLORS.darkGray.slice(1, 3), 16), parseInt(COLORS.darkGray.slice(3, 5), 16), parseInt(COLORS.darkGray.slice(5, 7), 16));
  doc.text('TONELADAS TOTALES', 105, 155, { align: 'center' });
  
  // 3. Reciclaje
  doc.setFillColor(parseInt(COLORS.green.slice(1, 3), 16), parseInt(COLORS.green.slice(3, 5), 16), parseInt(COLORS.green.slice(5, 7), 16), 0.8);
  doc.circle(165, 140, 12, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(formatNumber(recyclableTons), 165, 143, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(parseInt(COLORS.darkGray.slice(1, 3), 16), parseInt(COLORS.darkGray.slice(3, 5), 16), parseInt(COLORS.darkGray.slice(5, 7), 16));
  doc.text('TONELADAS RECICLADAS', 165, 155, { align: 'center' });

  // ==== RESUMEN EJECUTIVO ====
  // Título con diseño moderno
  // Encabezado con degradado para destacar el resumen ejecutivo
  createGradientPattern(doc, 15, 180, 180, 10, COLORS.navyLight, COLORS.navy, 'horizontal');
  doc.roundedRect(15, 180, 180, 10, 3, 3, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('RESUMEN EJECUTIVO', 105, 187, { align: 'center' });
  
  // Panel principal para el resumen con diseño mejorado - más ancho para evitar desbordamiento
  // Fondo con degradado suave para mejor lectura
  createGradientPattern(doc, 15, 190, 180, 75, COLORS.accent, COLORS.accentDark, 'vertical');
  doc.roundedRect(15, 190, 180, 75, 4, 4, 'F');
  
  // Borde sutil con efecto de profundidad
  doc.setDrawColor(parseInt(COLORS.limeDark.slice(1, 3), 16), parseInt(COLORS.limeDark.slice(3, 5), 16), parseInt(COLORS.limeDark.slice(5, 7), 16), 0.4);
  doc.setLineWidth(0.7);
  doc.roundedRect(15, 190, 180, 75, 4, 4, 'S');
  
  // Elemento decorativo: pequeño icono ecológico en la esquina
  drawLeafIcon(doc, 25, 200, 0.5);
  
  // Calcular tendencia (comparando primera mitad con segunda mitad del período)
  const sortedData = [...data.wasteData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const midpoint = Math.floor(sortedData.length / 2);
  const firstHalf = sortedData.slice(0, midpoint);
  const secondHalf = sortedData.slice(midpoint);
  
  const firstHalfTotal = firstHalf.reduce((sum, item) => sum + (item.organicWaste || 0) + (item.inorganicWaste || 0) + (item.recyclableWaste || 0), 0);
  const secondHalfTotal = secondHalf.reduce((sum, item) => sum + (item.organicWaste || 0) + (item.inorganicWaste || 0) + (item.recyclableWaste || 0), 0);
  
  const firstHalfAvg = firstHalfTotal / firstHalf.length;
  const secondHalfAvg = secondHalfTotal / secondHalf.length;
  
  const percentChange = firstHalfAvg > 0 ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg * 100) : 0;
  const trendDescription = percentChange > 5 ? 'aumento' : percentChange < -5 ? 'reducción' : 'estabilidad';
  
  // Formato mejorado para los puntos del resumen ejecutivo
  const summaryPoints = [
    {
      title: 'GENERACIÓN TOTAL',
      value: `${formatNumber(totalTons)} ton.`,
      description: `Durante el período ${data.period}` 
    },
    {
      title: 'DESVIACIÓN',
      value: `${data.deviation.toFixed(1)}%`,
      description: 'Índice de Desviación de Relleno Sanitario'
    },
    {
      title: 'DESTINO FINAL',
      value: `${formatNumber(landfillTons)} ton. a relleno, ${formatNumber(recyclableTons)} ton. a reciclaje`,
      description: ''
    },
    {
      title: 'TENDENCIA',
      value: `${trendDescription} de ${Math.abs(percentChange).toFixed(1)}%`,
      description: 'En la generación de residuos durante el período'
    },
    {
      title: 'IMPACTO AMBIENTAL',
      value: `${formatNumber((recyclableTons * 0.3) * 17)} árboles salvados`,
      description: 'Por reciclaje de papel y cartón'
    }
  ];
  
  // Posicionamiento y estilo para cada punto del resumen - mejorar espaciado
  doc.setTextColor(parseInt(COLORS.darkGray.slice(1, 3), 16), parseInt(COLORS.darkGray.slice(3, 5), 16), parseInt(COLORS.darkGray.slice(5, 7), 16));
  
  let yPos = 205;
  summaryPoints.forEach((point, index) => {
    // Título del punto - más corto a la izquierda para dar espacio al valor
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(parseInt(COLORS.navyDark.slice(1, 3), 16), parseInt(COLORS.navyDark.slice(3, 5), 16), parseInt(COLORS.navyDark.slice(5, 7), 16));
    doc.text(`• ${point.title}:`, 25, yPos);
    
    // Valor con énfasis - alineado a la derecha para evitar solapamiento
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
    // Si el destino final es muy largo, reducir el tamaño de la fuente
    if (point.title === 'DESTINO FINAL') {
      doc.setFontSize(8);
      doc.text(point.value, 185, yPos, { align: 'right' });
    } else {
      doc.text(point.value, 185, yPos, { align: 'right' });
    }
    
    // Descripción adicional si existe
    if (point.description) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(parseInt(COLORS.darkGray.slice(1, 3), 16), parseInt(COLORS.darkGray.slice(3, 5), 16), parseInt(COLORS.darkGray.slice(5, 7), 16));
      doc.text(point.description, 35, yPos + 5);
    }
    
    yPos += (point.description ? 15 : 10);
  });
  
  // Pie de página minimalista
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('ECONOVA © 2025 | Innovando en Gestión Ambiental', 105, 280, { align: 'center' });
  doc.text('Página 1 de 3', 185, 290, { align: 'right' });

  // ===== PÁGINA 2: ANÁLISIS VISUAL DE RESIDUOS + ÍNDICE DE DESVIACIÓN =====
  doc.addPage();
  
  // Usar la función auxiliar para crear el encabezado
  addMinimalistHeader(doc);
  
  // Información del cliente con estilo minimalista
  doc.setFillColor(245, 247, 250);
  doc.rect(0, 22, 210, 18, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.text(`Cliente: ${data.client.name}`, 15, 33);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Período: ${data.period}`, 105, 33);

  // ==== ANÁLISIS VISUAL DE RESIDUOS ====
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.text('ANÁLISIS VISUAL DE RESIDUOS', 105, 50, { align: 'center' });
  
  // Línea decorativa
  doc.setDrawColor(parseInt(COLORS.lime.slice(1, 3), 16), parseInt(COLORS.lime.slice(3, 5), 16), parseInt(COLORS.lime.slice(5, 7), 16));
  doc.setLineWidth(1);
  doc.line(65, 53, 145, 53);
  
  // Visualizar proporciones con gráficos simples
  // Gráfico de barras horizontal para tipos de residuos
  doc.setFillColor(108, 185, 71); // Verde para orgánicos
  doc.rect(25, 65, (data.organicTotal / data.totalWaste) * 160, 12, 'F');
  
  doc.setFillColor(120, 120, 120); // Gris para inorgánicos (evitando negro)
  doc.rect(25, 82, (data.inorganicTotal / data.totalWaste) * 160, 12, 'F');
  
  doc.setFillColor(181, 233, 81); // Lima para reciclables
  doc.rect(25, 99, (data.recyclableTotal / data.totalWaste) * 160, 12, 'F');
  
  // Etiquetas para el gráfico
  const organicPercentage = (data.organicTotal / data.totalWaste * 100).toFixed(1);
  const inorganicPercentage = (data.inorganicTotal / data.totalWaste * 100).toFixed(1);
  const recyclablePercentage = (data.recyclableTotal / data.totalWaste * 100).toFixed(1);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.text('Orgánicos (Comedor)', 25, 63);
  doc.text(`${formatNumber(organicTons)} ton (${organicPercentage}%)`, 182, 71, { align: 'right' });
  
  doc.text('Inorgánicos', 25, 80);
  doc.text(`${formatNumber(inorganicTons)} ton (${inorganicPercentage}%)`, 182, 88, { align: 'right' });
  
  doc.text('Reciclables', 25, 97);
  doc.text(`${formatNumber(recyclableTons)} ton (${recyclablePercentage}%)`, 182, 105, { align: 'right' });

  // ==== DESTINO DE RESIDUOS E ÍNDICE DE DESVIACIÓN ====
  // Utilizando una representación visual más compacta y clara
  
  // Título de la sección
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.text('DESTINO DE RESIDUOS E ÍNDICE DE DESVIACIÓN', 105, 130, { align: 'center' });
  
  // Línea decorativa
  doc.setDrawColor(parseInt(COLORS.lime.slice(1, 3), 16), parseInt(COLORS.lime.slice(3, 5), 16), parseInt(COLORS.lime.slice(5, 7), 16));
  doc.setLineWidth(1);
  doc.line(55, 133, 155, 133);

  // Panel para la visualización
  doc.setFillColor(245, 250, 255);
  doc.roundedRect(15, 140, 180, 140, 3, 3, 'F');
  
  // 1. Destino de residuos (gráfico circular simplificado)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text('Destino de Residuos', 60, 155);
  
  // Porcentajes para relleno sanitario y reciclaje
  const landfillPercentage = (data.organicTotal + data.inorganicTotal) / data.totalWaste;
  const recyclePercentage = data.recyclableTotal / data.totalWaste;
  
  // Dibujar círculo base (relleno sanitario)
  const centerX = 60;
  const centerY = 185;
  const radius = 25;
  
  doc.setFillColor(120, 120, 120); // Gris para relleno sanitario
  doc.circle(centerX, centerY, radius, 'F');
  
  // Dibujar segmento para reciclaje (aproximación)
  doc.setFillColor(181, 233, 81); // Lima para reciclables
  
  // Ángulo para el segmento de reciclaje (en radianes)
  const angle = recyclePercentage * Math.PI * 2;
  
  // Simular segmento circular con triángulos
  for (let i = 0; i < 20; i++) {
    const startAngle = i / 20 * angle;
    const endAngle = (i + 1) / 20 * angle;
    
    if (endAngle <= angle) {
      doc.triangle(
        centerX,
        centerY,
        centerX + radius * Math.cos(startAngle),
        centerY + radius * Math.sin(startAngle),
        centerX + radius * Math.cos(endAngle),
        centerY + radius * Math.sin(endAngle),
        'F'
      );
    }
  }
  
  // Leyenda del gráfico circular
  doc.setFillColor(120, 120, 120); // Gris para relleno
  doc.rect(35, 220, 8, 8, 'F');
  
  doc.setFillColor(181, 233, 81); // Lima para reciclaje
  doc.rect(35, 235, 8, 8, 'F');
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Relleno Sanitario (${(landfillPercentage * 100).toFixed(1)}%)`, 48, 225);
  doc.text(`Reciclaje (${(recyclePercentage * 100).toFixed(1)}%)`, 48, 240);
  
  // 2. Índice de desviación (medidor de progreso)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text('Índice de Desviación', 150, 155);
  
  // Barra de progreso
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(15);
  doc.line(110, 185, 190, 185);
  
  // Progreso actual
  const progressWidth = Math.min(80, (data.deviation / 100) * 80);
  doc.setDrawColor(parseInt(COLORS.lime.slice(1, 3), 16), parseInt(COLORS.lime.slice(3, 5), 16), parseInt(COLORS.lime.slice(5, 7), 16));
  doc.setLineWidth(15);
  doc.line(110, 185, 110 + progressWidth, 185);
  
  // Valor actual
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(60, 60, 60);
  doc.text(`${data.deviation.toFixed(1)}%`, 150, 185, { align: 'center' });
  
  // Marcas de referencia
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('0%', 110, 200);
  doc.text('100%', 190, 200);
  
  // Explicación
  doc.setFontSize(9);
  doc.text('El Índice de Desviación representa el porcentaje de residuos que se recuperan', 25, 260);
  doc.text('para reciclaje en lugar de enviarse al relleno sanitario.', 25, 270);
  
  doc.setFontSize(9);
  doc.text('Página 2 de 3', 185, 290, { align: 'right' });

  // ===== PÁGINA 3: IMPACTO AMBIENTAL + TABLA DE GENERACIÓN + GRÁFICO DE GENERACIÓN MENSUAL =====
  doc.addPage();
  
  // Usar la función auxiliar para crear el encabezado
  addMinimalistHeader(doc);

  // Banner del impacto ambiental con degradado atractivo (más compacto)
  createGradientPattern(doc, 0, 28, 210, 20, COLORS.lime, COLORS.navy, 'horizontal');
  
  // Título con mayor impacto visual
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('IMPACTO AMBIENTAL POSITIVO', 105, 42, { align: 'center' });
  
  // Fondo para los indicadores visuales (más compacto)
  doc.setFillColor(250, 252, 255);
  doc.rect(0, 48, 210, 70, 'F');
  
  // Marco para los indicadores
  doc.setDrawColor(181, 233, 81); // Verde lima
  doc.setLineWidth(0.8);
  doc.roundedRect(15, 53, 180, 60, 3, 3, 'S');
  
  // Calcular impacto ambiental
  const paperRecycled = data.recyclableTotal * 0.3; // Asumiendo que el 30% de los reciclables es papel
  const treesSaved = (paperRecycled / 1000) * 17; // 17 árboles salvados por tonelada de papel
  const waterSaved = (paperRecycled / 1000) * 26000; // 26,000 litros de agua por tonelada de papel
  const energySaved = data.recyclableTotal * 5.3; // 5.3 kWh por kg de reciclables
  const co2Reduced = data.recyclableTotal * 2.5; // 2.5 kg de CO2 por kg de residuos
  
  // PANEL DE IMPACTO AMBIENTAL CON 4 INDICADORES EN FORMATO 2x2 MÁS COMPACTO
  
  // Reducir tamaño de paneles e iconos para ocupar menos espacio
  const panelWidth = 80;
  const panelHeight = 25;
  const iconSize = 0.5;
  
  // Fila superior - Árboles y Agua
  // Panel de árboles
  doc.setFillColor(240, 248, 240);
  doc.roundedRect(25, 58, panelWidth, panelHeight, 2, 2, 'F');
  
  // Icono de árbol
  drawTreeIcon(doc, 35, 70, iconSize);
  
  // Valor y etiqueta - más compacto
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(60, 60, 60);
  doc.text(formatNumber(Math.round(treesSaved)), 95, 66, { align: 'right' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('ÁRBOLES SALVADOS', 95, 74, { align: 'right' });
  
  // Panel de agua
  doc.setFillColor(235, 245, 255);
  doc.roundedRect(115, 58, panelWidth, panelHeight, 2, 2, 'F');
  
  // Icono de agua
  drawWaterDropIcon(doc, 125, 70, iconSize);
  
  // Valor y etiqueta
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(60, 60, 60);
  const waterKL = Math.round(waterSaved / 1000);
  doc.text(formatNumber(waterKL), 185, 66, { align: 'right' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('MILES LITROS AHORRADOS', 185, 74, { align: 'right' });
  
  // Fila inferior - Energía y CO2
  // Panel de energía
  doc.setFillColor(255, 248, 230);
  doc.roundedRect(25, 87, panelWidth, panelHeight, 2, 2, 'F');
  
  // Icono de rayo
  drawLightningIcon(doc, 35, 99, iconSize);
  
  // Valor y etiqueta
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(60, 60, 60);
  const energyMWh = Math.round(energySaved / 1000);
  doc.text(formatNumber(energyMWh), 95, 95, { align: 'right' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('MWh ENERGÍA AHORRADOS', 95, 103, { align: 'right' });
  
  // Panel de CO2
  doc.setFillColor(235, 250, 240);
  doc.roundedRect(115, 87, panelWidth, panelHeight, 2, 2, 'F');
  
  // Icono de hoja
  drawLeafIcon(doc, 125, 99, iconSize);
  
  // Valor y etiqueta
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(60, 60, 60);
  const co2Tons = Math.round(co2Reduced / 1000);
  doc.text(formatNumber(co2Tons), 185, 95, { align: 'right' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('TON CO₂ NO EMITIDAS', 185, 103, { align: 'right' });

  // ==== DETALLE MENSUAL ====
  // Sección de tabla con diseño más atractivo
  createGradientPattern(doc, 0, 135, 210, 25, COLORS.lightGray, COLORS.mediumGray, 'horizontal');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.text('TABLA DE GENERACIÓN MENSUAL', 105, 150, { align: 'center' });
  
  // Línea decorativa estilizada
  doc.setDrawColor(parseInt(COLORS.lime.slice(1, 3), 16), parseInt(COLORS.lime.slice(3, 5), 16), parseInt(COLORS.lime.slice(5, 7), 16));
  doc.setLineWidth(1);
  doc.line(60, 153, 105, 153);
  doc.setDrawColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.line(105, 153, 150, 153);
  
  // Agrupar datos por mes y año
  const monthlyData: Record<string, { 
    organicWaste: number, 
    inorganicWaste: number, 
    recyclableWaste: number,
    date: Date
  }> = {};
  
  data.wasteData.forEach(item => {
    const date = new Date(item.date);
    const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = {
        organicWaste: 0,
        inorganicWaste: 0,
        recyclableWaste: 0,
        date
      };
    }
    
    monthlyData[monthYear].organicWaste += (item.organicWaste || 0);
    monthlyData[monthYear].inorganicWaste += (item.inorganicWaste || 0);
    monthlyData[monthYear].recyclableWaste += (item.recyclableWaste || 0);
  });
  
  // Preparar datos para la tabla
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  const monthlyRows = Object.entries(monthlyData)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, data]) => {
      const [year, month] = key.split('-');
      const monthName = monthNames[parseInt(month) - 1];
      const total = data.organicWaste + data.inorganicWaste + data.recyclableWaste;
      const deviation = total > 0 ? (data.recyclableWaste / total) * 100 : 0;
      
      return [
        `${monthName} ${year}`,
        formatNumber(data.organicWaste / 1000), // Mostrar en toneladas
        formatNumber(data.inorganicWaste / 1000),
        formatNumber(data.recyclableWaste / 1000),
        formatNumber(total / 1000),
        `${deviation.toFixed(1)}%`
      ];
    });
  
  // Añadir la tabla de detalle mensual - más compacta para ahorrar espacio
  autoTable(doc, {
    startY: 160,
    head: [['Mes/Año', 'Orgánico', 'Inorgánico', 'Reciclable', 'Total', 'Desv.']],
    body: monthlyRows,
    headStyles: {
      fillColor: [39, 57, 73], // Navy
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250], // Light gray
    },
    styles: {
      cellPadding: 1.5, // Más compacto
      fontSize: 6.5, // Más pequeño pero legible
      lineWidth: 0.1,
      overflow: 'linebreak', // Evitar desbordamiento
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 30 },
      1: { halign: 'right', cellWidth: 20 },
      2: { halign: 'right', cellWidth: 20 },
      3: { halign: 'right', cellWidth: 20 },
      4: { halign: 'right', cellWidth: 20 },
      5: { halign: 'right', fontStyle: 'bold', cellWidth: 18 },
    },
    margin: { left: 20, right: 20 }, // Márgenes más amplios para evitar desbordamiento
    tableWidth: 180, // Ancho fijo para evitar desbordamiento
  });
  
  // Omitimos el gráfico mensual para dar espacio a la sección de certificación TRUE
  
  // Pie de página con estilo corporativo
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  
  // Línea decorativa para el pie de página
  doc.setDrawColor(parseInt(COLORS.lime.slice(1, 3), 16), parseInt(COLORS.lime.slice(3, 5), 16), parseInt(COLORS.lime.slice(5, 7), 16), 0.5);
  doc.setLineWidth(0.5);
  doc.line(15, 280, 195, 280);
  
  // Añadir información resumida sobre certificación TRUE en la página 3
  // Fondo para las siguientes secciones que borra cualquier contenido previo
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 135, 210, 130, 'F');
  
  // Título de certificación TRUE
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(parseInt(COLORS.navy.slice(1, 3), 16), parseInt(COLORS.navy.slice(3, 5), 16), parseInt(COLORS.navy.slice(5, 7), 16));
  doc.text('CERTIFICACIÓN TRUE ZERO WASTE', 105, 150, { align: 'center' });
  
  // Línea decorativa
  doc.setDrawColor(parseInt(COLORS.lime.slice(1, 3), 16), parseInt(COLORS.lime.slice(3, 5), 16), parseInt(COLORS.lime.slice(5, 7), 16));
  doc.setLineWidth(0.7);
  doc.line(55, 153, 155, 153);
  
  // Marco para la visualización del estado
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(15, 160, 180, 40, 3, 3, 'F');
  
  // Barrita de progreso
  doc.setFillColor(220, 220, 220);
  doc.roundedRect(30, 185, 150, 8, 4, 4, 'F');
  
  // Progreso actual (valor de desviación convertido a %)
  const progressPercentage = Math.min(100, (data.deviation / 90) * 100);
  const barWidth = (progressPercentage / 100) * 150;
  
  // Color según el nivel
  let barColor = '#74c278'; // Verde para nivel alto
  if (data.deviation < 50) {
    barColor = '#ff7f50'; // Naranja para nivel bajo
  } else if (data.deviation < 75) {
    barColor = '#ffd166'; // Amarillo para nivel medio
  }
  
  doc.setFillColor(
    parseInt(barColor.slice(1, 3), 16),
    parseInt(barColor.slice(3, 5), 16),
    parseInt(barColor.slice(5, 7), 16)
  );
  doc.roundedRect(30, 185, barWidth, 8, 4, 4, 'F');
  
  // Marcador de meta (línea vertical en 90%)
  const targetX = 30 + (150 * 90) / 100;
  doc.setDrawColor(39, 57, 73);
  doc.setLineWidth(1);
  doc.line(targetX, 180, targetX, 193);
  
  // Etiqueta de meta
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(39, 57, 73);
  doc.text('Meta 90%', targetX, 177);
  
  // Indicador desviación actual - valor grande
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(39, 57, 73);
  doc.text('Desviación actual:', 25, 172);
  
  doc.setFontSize(16);
  doc.text(`${data.deviation.toFixed(1)}%`, 150, 172, { align: 'center' });
  
  // Acciones clave recomendadas - título con mejor formato
  doc.setFillColor(39, 57, 73);
  doc.rect(0, 210, 210, 18, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('ACCIONES PRIORITARIAS PARA ALCANZAR CERTIFICACIÓN', 105, 222, { align: 'center' });
  
  // Lista de acciones - más compacta y con mejor formato
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  
  // Marco para las acciones recomendadas
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(15, 235, 180, 35, 3, 3, 'F');
  
  // Recomendaciones específicas basadas en la desviación actual
  // Diseño de dos columnas para ahorrar espacio
  if (data.deviation < 50) {
    // Columna izquierda
    doc.text('1. Priorizar programa de residuos en la', 20, 245);
    doc.text('   alta dirección', 20, 250);
    
    doc.text('2. Implementar compostero en sitio', 20, 260);
    doc.text('   para residuos de poda y comedor', 20, 265);
    
    // Columna derecha
    doc.text('3. Contratar proveedor privado para', 115, 245);
    doc.text('   asegurar trazabilidad', 115, 250);
    
    doc.text('4. Formar brigada de mínimo 3', 115, 260);
    doc.text('   personas para gestión interna', 115, 265);
  } else if (data.deviation < 75) {
    // Columna izquierda
    doc.text('1. Involucrar más a la alta dirección', 20, 245);
    doc.text('   en el programa de residuos', 20, 250);
    
    doc.text('2. Ampliar capacidad de compostaje', 20, 260);
    doc.text('   in situ para residuos orgánicos', 20, 265);
    
    // Columna derecha
    doc.text('3. Mejorar reportes con proveedor', 115, 245);
    doc.text('   privado para trazabilidad', 115, 250);
    
    doc.text('4. Aumentar capacitación de personal', 115, 260);
    doc.text('   dedicado a gestión de residuos', 115, 265);
  } else {
    // Columna izquierda
    doc.text('1. Presentar avances a la dirección', 20, 245);
    doc.text('   sobre logros y beneficios', 20, 250);
    
    doc.text('2. Optimizar sistema de compostaje', 20, 260);
    doc.text('   y aumentar su capacidad', 20, 265);
    
    // Columna derecha
    doc.text('3. Revisar indicadores mensuales', 115, 245);
    doc.text('   con proveedores de servicios', 115, 250);
    
    doc.text('4. Implementar técnicas avanzadas', 115, 260);
    doc.text('   de separación y recuperación', 115, 265);
  }
  
  // Pie de página corporativo
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('ECONOVA © 2025 | Innovando en Gestión Ambiental', 105, 286, { align: 'center' });
  doc.text('Página 3 de 3', 185, 286, { align: 'right' });
  
  // Devolver como blob
  return doc.output('blob');
}

export function downloadPDF(pdfBlob: Blob, fileName: string): void {
  // Crear un objeto URL para el blob
  const blobUrl = URL.createObjectURL(pdfBlob);
  
  // Crear un enlace temporal
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = fileName;
  
  // Simular un clic en el enlace para iniciar la descarga
  document.body.appendChild(link);
  link.click();
  
  // Limpiar
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
}

export async function generateAndDownloadPDFReport(client: Client, wasteData: WasteData[]): Promise<void> {
  // Calcular totales
  const organicTotal = wasteData.reduce((sum, item) => sum + (item.organicWaste || 0), 0);
  const inorganicTotal = wasteData.reduce((sum, item) => sum + (item.inorganicWaste || 0), 0);
  const recyclableTotal = wasteData.reduce((sum, item) => sum + (item.recyclableWaste || 0), 0);
  const totalWaste = organicTotal + inorganicTotal + recyclableTotal;
  
  // Calcular desviación (recyclableWaste / totalWaste) * 100
  const deviation = totalWaste > 0 ? (recyclableTotal / totalWaste) * 100 : 0;
  
  // Determinar el periodo del reporte
  const formatMonth = (date: Date) => date.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
  const sortedData = [...wasteData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let period = 'Reporte Completo';
  if (sortedData.length > 0) {
    const firstDate = new Date(sortedData[0].date);
    const lastDate = new Date(sortedData[sortedData.length - 1].date);
    if (firstDate.getFullYear() === lastDate.getFullYear() && firstDate.getMonth() === lastDate.getMonth()) {
      period = formatMonth(firstDate);
    } else {
      period = `${formatMonth(firstDate)} - ${formatMonth(lastDate)}`;
    }
  }
  
  // Preparar datos para el reporte
  const reportData: ReportData = {
    client,
    wasteData,
    organicTotal,
    inorganicTotal,
    recyclableTotal,
    totalWaste,
    deviation,
    period
  };
  
  // Generar y descargar el PDF
  const pdfBlob = await generateClientPDF(reportData);
  downloadPDF(pdfBlob, `Reporte_${client.name.replace(/\s+/g, '_')}_${period.replace(/\s+/g, '_')}.pdf`);
}