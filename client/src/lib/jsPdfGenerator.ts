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
  doc.setFontSize(16);
  doc.text('DATOS DEL CLIENTE', 15, 45);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`Cliente: ${data.client.name}`, 15, 55);
  doc.text(`Descripción: ${data.client.description || 'N/A'}`, 15, 62);
  
  // Resumen de residuos
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('RESUMEN DE RESIDUOS', 15, 75);
  
  // Tabla de resumen usando jspdf-autotable
  autoTable(doc, {
    startY: 80,
    head: [['Tipo de Residuo', 'Cantidad (kg)', 'Porcentaje']],
    body: [
      ['Orgánicos (Comedor)', formatNumber(data.organicTotal), `${(data.organicTotal / data.totalWaste * 100).toFixed(2)}%`],
      ['Inorgánicos', formatNumber(data.inorganicTotal), `${(data.inorganicTotal / data.totalWaste * 100).toFixed(2)}%`],
      ['Reciclables', formatNumber(data.recyclableTotal), `${(data.recyclableTotal / data.totalWaste * 100).toFixed(2)}%`],
      ['TOTAL', formatNumber(data.totalWaste), '100.00%'],
    ],
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
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 60, halign: 'right' },
      2: { cellWidth: 40, halign: 'right' },
    },
  });
  
  // Calcula la posición Y después de la tabla
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  
  // Índice de desviación
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('ÍNDICE DE DESVIACIÓN', 15, finalY);
  
  // Crear un cuadro para el índice de desviación
  doc.setFillColor(245, 247, 250); // Light gray
  doc.rect(70, finalY + 5, 70, 30, 'F');
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text('Índice de Desviación de', 105, finalY + 15, { align: 'center' });
  doc.text('Relleno Sanitario', 105, finalY + 20, { align: 'center' });
  
  doc.setTextColor(181, 233, 81); // Lime
  doc.setFontSize(20);
  doc.text(`${data.deviation.toFixed(2)}%`, 105, finalY + 28, { align: 'center' });
  
  // Impacto ambiental
  doc.setTextColor(39, 57, 73); // Navy
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('IMPACTO AMBIENTAL', 15, finalY + 45);
  
  // Calcular impacto ambiental
  const paperRecycled = data.recyclableTotal * 0.3; // Asumiendo que el 30% de los reciclables es papel
  const treesSaved = (paperRecycled / 1000) * 17; // 17 árboles salvados por tonelada de papel reciclado
  const waterSaved = (paperRecycled / 1000) * 26000; // 26,000 litros de agua por tonelada de papel
  const energySaved = data.recyclableTotal * 5.3; // 5.3 kWh por kg de reciclables
  
  // Crear tabla para el impacto ambiental
  autoTable(doc, {
    startY: finalY + 50,
    head: [['Indicador', 'Valor', 'Unidad']],
    body: [
      ['Árboles Salvados', formatNumber(treesSaved), 'árboles'],
      ['Agua Ahorrada', formatNumber(waterSaved), 'litros'],
      ['Energía Ahorrada', formatNumber(energySaved), 'kWh'],
    ],
    headStyles: {
      fillColor: [43, 138, 62], // Green
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250], // Light gray
    },
    styles: {
      cellPadding: 5,
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 60, halign: 'right' },
      2: { cellWidth: 40 },
    },
  });
  
  // Detalle mensual
  const finalY2 = (doc as any).lastAutoTable.finalY + 15;
  
  doc.setTextColor(39, 57, 73); // Navy
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('DETALLE MENSUAL', 15, finalY2);
  
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
      const deviation = toSanitaryLandfill > 0 ? (data.recyclableWaste / toSanitaryLandfill) * 100 : 0;
      
      return [
        `${monthName} ${year}`,
        formatNumber(data.organicWaste),
        formatNumber(data.inorganicWaste),
        formatNumber(data.recyclableWaste),
        formatNumber(total),
        `${deviation.toFixed(2)}%`
      ];
    });
  
  // Añadir nueva página si no hay suficiente espacio
  if (finalY2 + 10 > 270) {
    doc.addPage();
    autoTable(doc, {
      startY: 20,
      head: [['Mes/Año', 'Orgánico Comedor (kg)', 'Inorgánico (kg)', 'Reciclable (kg)', 'Total (kg)', 'Desviación']],
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
  } else {
    autoTable(doc, {
      startY: finalY2 + 5,
      head: [['Mes/Año', 'Orgánico Comedor (kg)', 'Inorgánico (kg)', 'Reciclable (kg)', 'Total (kg)', 'Desviación']],
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
  }
  
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