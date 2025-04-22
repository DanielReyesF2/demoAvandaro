import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Client, WasteData } from '@shared/schema';
import autoTable from 'jspdf-autotable';

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

// Colores corporativos
const COLORS = {
  navy: '#273949',
  lime: '#b5e951',
  lightGray: '#f8f9fa',
  darkGray: '#495057',
  green: '#2b8a3e',
  orange: '#e67700',
  red: '#e03131',
};

// Función para formatear números con separador de miles
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 }).format(num);
};

export async function generateClientPDF(data: ReportData): Promise<Blob> {
  // Crear documento PDF
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Configurar fuentes
  doc.setFont('helvetica', 'bold');
  
  // Cabecera
  doc.setTextColor(39, 57, 73); // Navy
  doc.setFontSize(22);
  doc.text('REPORTE DE GESTIÓN DE RESIDUOS', 15, 20);
  
  doc.setFontSize(14);
  doc.text(data.period, 15, 30);
  
  // Línea separadora
  doc.setDrawColor(181, 233, 81); // Lime
  doc.setLineWidth(1);
  doc.line(15, 35, 195, 35);
  
  // Información del cliente
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`Cliente: ${data.client.name}`, 15, 45);
  
  // ==== RESUMEN EJECUTIVO ====
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(39, 57, 73); // Navy
  doc.text('RESUMEN EJECUTIVO', 15, 60);
  
  // Crear fondo para el resumen ejecutivo
  doc.setFillColor(245, 250, 255); // Light blue background
  doc.roundedRect(15, 65, 180, 45, 3, 3, 'F');
  
  // Texto del resumen ejecutivo
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  
  // Cálculos para el resumen ejecutivo (valores en toneladas para más impacto)
  const organicTons = data.organicTotal / 1000;
  const inorganicTons = data.inorganicTotal / 1000;
  const recyclableTons = data.recyclableTotal / 1000;
  const totalTons = data.totalWaste / 1000;
  const landfillTons = organicTons + inorganicTons;
  
  const recyclablePercentage = (data.recyclableTotal / data.totalWaste * 100).toFixed(1);
  const organicPercentage = (data.organicTotal / data.totalWaste * 100).toFixed(1);
  
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
  
  // Crear texto del resumen ejecutivo
  const summaryText = [
    `• Durante el período ${data.period}, ${data.client.name} generó un total de ${formatNumber(totalTons)} toneladas de residuos.`,
    `• El Índice de Desviación de Relleno Sanitario fue de ${data.deviation.toFixed(1)}%, lo que indica que esta proporción`,
    `  de residuos fueron recuperados para reciclaje en lugar de enviarse al relleno sanitario.`,
    `• Del total de residuos, ${formatNumber(landfillTons)} toneladas fueron enviadas a relleno sanitario y`,
    `  ${formatNumber(recyclableTons)} toneladas a reciclaje.`,
    `• Se observa una ${trendDescription} en la generación de residuos del ${Math.abs(percentChange).toFixed(1)}% durante el período.`,
    `• El impacto ambiental positivo equivale a ${formatNumber((recyclableTons * 0.3) * 17)} árboles salvados.`
  ];
  
  // Posicionar el texto del resumen
  let yPos = 72;
  summaryText.forEach(line => {
    doc.text(line, 20, yPos);
    yPos += 6;
  });
  
  // ==== VISUALIZACIÓN DE DATOS ====
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(39, 57, 73); // Navy
  doc.text('ANÁLISIS VISUAL DE RESIDUOS', 15, 120);
  
  // Visualizar proporciones con gráficos simples
  
  // Gráfico de barras horizontal para tipos de residuos
  doc.setFillColor(108, 185, 71); // Verde para orgánicos
  doc.rect(20, 130, (data.organicTotal / data.totalWaste) * 160, 12, 'F');
  
  doc.setFillColor(156, 156, 156); // Gris para inorgánicos
  doc.rect(20, 147, (data.inorganicTotal / data.totalWaste) * 160, 12, 'F');
  
  doc.setFillColor(181, 233, 81); // Lime para reciclables
  doc.rect(20, 164, (data.recyclableTotal / data.totalWaste) * 160, 12, 'F');
  
  // Etiquetas para el gráfico
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.text('Orgánicos (Comedor)', 20, 128);
  doc.text(`${formatNumber(data.organicTotal/1000)} ton (${organicPercentage}%)`, 182, 136, { align: 'right' });
  
  doc.text('Inorgánicos', 20, 145);
  doc.text(`${formatNumber(data.inorganicTotal/1000)} ton (${(data.inorganicTotal / data.totalWaste * 100).toFixed(1)}%)`, 182, 153, { align: 'right' });
  
  doc.text('Reciclables', 20, 162);
  doc.text(`${formatNumber(data.recyclableTotal/1000)} ton (${recyclablePercentage}%)`, 182, 170, { align: 'right' });
  
  // Gráfico circular para destino de residuos (Relleno sanitario vs Reciclaje)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(39, 57, 73);
  doc.text('Destino de Residuos', 105, 190, { align: 'center' });
  
  // Dibujar un círculo dividido (simplificado)
  const centerX = 105;
  const centerY = 215;
  const radius = 25;
  
  // Porcentaje a relleno sanitario (orgánico + inorgánico)
  const landfillPercentage = (data.organicTotal + data.inorganicTotal) / data.totalWaste;
  const recyclePercentage = data.recyclableTotal / data.totalWaste;
  
  // Dibujar sector para relleno sanitario
  doc.setFillColor(156, 156, 156); // Gris
  doc.circle(centerX, centerY, radius, 'F');
  
  // Dibujar sector para reciclaje
  doc.setFillColor(181, 233, 81); // Lime
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.5);
  
  // Crear un "pie slice" simulado
  const angle = recyclePercentage * Math.PI * 2;
  doc.ellipse(centerX, centerY, radius, radius, 'F');
  doc.setFillColor(156, 156, 156);
  
  // Método simplificado para dibujar un sector circular
  // (Esta es una aproximación simplificada para jsPDF)
  doc.triangle(
    centerX, 
    centerY, 
    centerX + radius * Math.cos(0), 
    centerY + radius * Math.sin(0), 
    centerX + radius * Math.cos(angle), 
    centerY + radius * Math.sin(angle), 
    'F'
  );
  
  // Dibujar dos rectángulos para la leyenda
  doc.setFillColor(156, 156, 156);
  doc.rect(centerX - 50, centerY + 35, 10, 5, 'F');
  doc.setFillColor(181, 233, 81);
  doc.rect(centerX + 10, centerY + 35, 10, 5, 'F');
  
  // Agregar texto para la leyenda
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.text(`Relleno Sanitario (${(landfillPercentage * 100).toFixed(1)}%)`, centerX - 35, centerY + 39);
  doc.text(`Reciclaje (${(recyclePercentage * 100).toFixed(1)}%)`, centerX + 25, centerY + 39);
  
  // ==== ÍNDICE DE DESVIACIÓN ====
  // Añadir nueva página para el resto del contenido
  doc.addPage();
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(39, 57, 73); // Navy
  doc.text('ÍNDICE DE DESVIACIÓN', 15, 20);
  
  // Crear un indicador visual para el índice de desviación
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(15);
  doc.line(40, 50, 160, 50);
  
  // Dibujar la línea de progreso
  const deviationWidth = Math.min(120, (data.deviation / 100) * 120);
  doc.setDrawColor(181, 233, 81);
  doc.setLineWidth(15);
  doc.line(40, 50, 40 + deviationWidth, 50);
  
  // Añadir marcadores
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  
  // Marcadores de porcentaje
  doc.text('0%', 40, 65);
  doc.text('25%', 70, 65);
  doc.text('50%', 100, 65);
  doc.text('75%', 130, 65);
  doc.text('100%', 160, 65);
  
  // Valor actual
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(39, 57, 73);
  doc.text(`${data.deviation.toFixed(1)}%`, 105, 40, { align: 'center' });
  
  // Explicación
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  const deviationExplanation = [
    'El Índice de Desviación representa el porcentaje de residuos que son desviados del relleno sanitario',
    'mediante el reciclaje. Un mayor índice indica un mejor desempeño ambiental.',
    '',
    'Cálculo: (Residuos Reciclables / Residuos Totales) × 100'
  ];
  
  let yPosDeviation = 80;
  deviationExplanation.forEach(line => {
    doc.text(line, 15, yPosDeviation);
    yPosDeviation += 5;
  });
  
  // ==== IMPACTO AMBIENTAL ====
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(39, 57, 73);
  doc.text('IMPACTO AMBIENTAL POSITIVO', 15, 110);
  
  // Calcular impacto ambiental
  const paperRecycled = data.recyclableTotal * 0.3; // Asumiendo que el 30% de los reciclables es papel
  const treesSaved = (paperRecycled / 1000) * 17; // 17 árboles salvados por tonelada de papel reciclado
  const waterSaved = (paperRecycled / 1000) * 26000; // 26,000 litros de agua por tonelada de papel
  const energySaved = data.recyclableTotal * 5.3; // 5.3 kWh por kg de reciclables
  
  // Crear íconos visuales para el impacto
  
  // Árboles 
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.setTextColor(108, 185, 71);
  doc.text('🌳', 30, 135);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(39, 57, 73);
  doc.text(formatNumber(treesSaved), 60, 130);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Árboles salvados', 60, 140);
  
  // Agua
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.setTextColor(66, 139, 202);
  doc.text('💧', 30, 170);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(39, 57, 73);
  doc.text(formatNumber(waterSaved), 60, 165);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Litros de agua ahorrados', 60, 175);
  
  // Energía
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.setTextColor(241, 196, 15);
  doc.text('⚡', 120, 135);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(39, 57, 73);
  doc.text(formatNumber(energySaved), 150, 130);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('kWh de energía ahorrados', 150, 140);
  
  // CO2
  const co2Reduced = data.recyclableTotal * 2.5; // Aproximación: 2.5 kg de CO2 por kg de residuos reciclados
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.setTextColor(52, 152, 219);
  doc.text('🌎', 120, 170);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(39, 57, 73);
  doc.text(formatNumber(co2Reduced / 1000), 150, 165);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Ton CO₂ no emitidas', 150, 175);
  
  // ==== DETALLE MENSUAL ====
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(39, 57, 73);
  doc.text('DETALLE MENSUAL', 15, 200);
  
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
      const toSanitaryLandfill = data.organicWaste + data.inorganicWaste;
      const deviation = toSanitaryLandfill > 0 ? (data.recyclableWaste / total) * 100 : 0;
      
      return [
        `${monthName} ${year}`,
        formatNumber(data.organicWaste / 1000), // Mostrar en toneladas
        formatNumber(data.inorganicWaste / 1000),
        formatNumber(data.recyclableWaste / 1000),
        formatNumber(total / 1000),
        `${deviation.toFixed(2)}%`
      ];
    });
  
  // Añadir la tabla de detalle mensual
  autoTable(doc, {
    startY: 205,
    head: [['Mes/Año', 'Orgánico (ton)', 'Inorgánico (ton)', 'Reciclable (ton)', 'Total (ton)', 'Desviación']],
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
      cellPadding: 5,
      fontSize: 9,
    },
    columnStyles: {
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right' },
    },
  });
  
  // Pie de página
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Reporte generado por Econova - Página ${i} de ${totalPages}`, 105, 285, { align: 'center' });
  }
  
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
  
  // Calcular desviación (recyclableWaste / (organicWaste + inorganicWaste)) * 100
  const toSanitaryLandfill = organicTotal + inorganicTotal;
  const deviation = toSanitaryLandfill > 0 ? (recyclableTotal / toSanitaryLandfill) * 100 : 0;
  
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