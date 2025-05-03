import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { getEconovaLogoAsBase64 } from './imageUtils';

interface TrueReportData {
  clientName: string;
  currentDeviation: number;
  date: Date;
  pendingActions: {
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
  }[];
}

export async function generateTrueCertificationReport(data: TrueReportData): Promise<Blob> {
  const doc = new jsPDF();
  const logoBase64 = await getEconovaLogoAsBase64();
  
  // Agregar encabezado
  doc.setFillColor(39, 57, 73); // Color navy
  doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');
  
  // Agregar logo
  doc.addImage(logoBase64, 'PNG', 10, 8, 25, 15);
  
  // Título del reporte
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('INFORME DE CERTIFICACIÓN TRUE', doc.internal.pageSize.width / 2, 20, { align: 'center' });
  
  // Información del cliente y fecha
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text(`Cliente: ${data.clientName}`, 15, 40);
  doc.text(`Fecha: ${data.date.toLocaleDateString('es-MX')}`, 15, 48);
  
  // Sección de estado actual
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('ESTADO ACTUAL DE CERTIFICACIÓN', 15, 65);
  
  doc.setDrawColor(181, 233, 81); // Color lime
  doc.setLineWidth(0.5);
  doc.line(15, 68, 195, 68);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('La certificación TRUE Zero Waste reconoce a las instalaciones que desvían al menos', 15, 78);
  doc.text('el 90% de sus residuos sólidos del vertedero, la incineración y el medio ambiente.', 15, 85);
  
  // Índice de desviación actual
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(15, 95, 180, 40, 3, 3, 'F');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Índice de Desviación Actual:', 25, 110);
  
  doc.setFontSize(22);
  doc.setTextColor(39, 57, 73); // Color navy
  doc.text(`${data.currentDeviation.toFixed(1)}%`, 160, 110);
  
  // Status con color
  doc.setFontSize(12);
  let statusText = '';
  let statusColor = [0, 0, 0]; // Negro por defecto
  
  if (data.currentDeviation < 50) {
    statusText = 'CRÍTICO';
    statusColor = [220, 38, 38]; // Rojo
  } else if (data.currentDeviation < 75) {
    statusText = 'EN PROGRESO';
    statusColor = [245, 158, 11]; // Ámbar
  } else if (data.currentDeviation < 90) {
    statusText = 'CERCANO A META';
    statusColor = [16, 185, 129]; // Verde
  } else {
    statusText = 'META ALCANZADA';
    statusColor = [5, 150, 105]; // Verde oscuro
  }
  
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.text(`Estado: ${statusText}`, 25, 125);
  
  // Barra de progreso
  const progressWidth = 150;
  const progressStartX = 25;
  const progressY = 135;
  const progressHeight = 6;
  
  // Fondo de la barra
  doc.setFillColor(220, 220, 220);
  doc.roundedRect(progressStartX, progressY - progressHeight/2, progressWidth, progressHeight, 2, 2, 'F');
  
  // Progreso actual
  const currentProgress = Math.min(100, (data.currentDeviation / 90) * 100);
  const currentProgressWidth = (progressWidth * currentProgress) / 100;
  
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(progressStartX, progressY - progressHeight/2, currentProgressWidth, progressHeight, 2, 2, 'F');
  
  // Marcador de meta
  const targetX = progressStartX + (progressWidth * 90) / 100;
  doc.setDrawColor(39, 57, 73); // navy
  doc.setLineWidth(1.5);
  doc.line(targetX, progressY - 5, targetX, progressY + 5);
  doc.setFontSize(8);
  doc.setTextColor(39, 57, 73);
  doc.text('Meta: 90%', targetX - 15, progressY + 10);
  
  // Sección de acciones pendientes
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('ACCIONES PENDIENTES PARA CERTIFICACIÓN', 15, 155);
  
  doc.setDrawColor(181, 233, 81); // Color lime
  doc.setLineWidth(0.5);
  doc.line(15, 158, 195, 158);
  
  // Tabla de acciones pendientes
  const tableHeaders = [
    { title: 'Acción', dataKey: 'title' },
    { title: 'Descripción', dataKey: 'description' },
    { title: 'Estado', dataKey: 'status' }
  ];
  
  const tableRows = data.pendingActions.map(action => {
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
    return { 
      title: action.title,
      description: action.description,
      status: statusText
    };
  });
  
  // @ts-ignore
  doc.autoTable({
    startY: 165,
    head: [tableHeaders.map(header => header.title)],
    body: tableRows.map(row => [
      row.title,
      row.description,
      row.status
    ]),
    theme: 'grid',
    headStyles: { 
      fillColor: [39, 57, 73],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 90 },
      2: { cellWidth: 30 }
    },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    rowStyles: { minCellHeight: 15 },
  });
  
  // Agregar conclusión y recomendaciones
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('RECOMENDACIONES', 15, finalY);
  
  doc.setDrawColor(181, 233, 81); // Color lime
  doc.setLineWidth(0.5);
  doc.line(15, finalY + 3, 195, finalY + 3);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  let recommendations = '';
  
  if (data.currentDeviation < 50) {
    recommendations = 
      '1. Priorizar inmediatamente la implementación del Plan de Manejo Integral de Residuos.\n' +
      '2. Adquirir tecnología de compostaje para aumentar la desviación de residuos orgánicos.\n' +
      '3. Implementar sistema de trazabilidad con urgencia para todos los flujos de residuos.\n' +
      '4. Capacitar a todo el personal en separación adecuada de residuos en origen.';
  } else if (data.currentDeviation < 75) {
    recommendations = 
      '1. Reforzar los programas de separación en la fuente, especialmente en áreas de cocina.\n' +
      '2. Aumentar la capacidad de procesamiento de residuos orgánicos para compostaje.\n' +
      '3. Implementar auditorías internas mensuales para verificar la correcta separación.\n' +
      '4. Desarrollar políticas de compras sostenibles para reducir residuos desde el origen.';
  } else {
    recommendations = 
      '1. Afinar los procesos actuales para incrementar la desviación del 37.18% al 90%.\n' +
      '2. Completar la documentación requerida para la precertificación.\n' +
      '3. Desarrollar campañas de comunicación para involucrar a los socios del club.\n' +
      '4. Programar una pre-auditoría con consultores certificados en TRUE.';
  }
  
  const recommendationsLines = recommendations.split('\n');
  let yPosition = finalY + 15;
  
  recommendationsLines.forEach(line => {
    doc.text(line, 15, yPosition);
    yPosition += 7;
  });
  
  // Pie de página
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('ECONOVA - Gestión Integral de Residuos | www.econova.mx', doc.internal.pageSize.width / 2, pageHeight - 10, { align: 'center' });
  
  return doc.output('blob');
}

export function downloadTrueCertificationReport(blob: Blob, clientName: string): void {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  const date = new Date();
  const formattedDate = date.toISOString().slice(0, 10);
  link.download = `${clientName}_CertificacionTRUE_${formattedDate}.pdf`;
  link.click();
}

export async function generateAndDownloadTrueCertificationReport(
  clientName: string,
  currentDeviation: number,
  pendingActions: {
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
  }[]
): Promise<void> {
  const date = new Date();
  
  const reportData: TrueReportData = {
    clientName,
    currentDeviation,
    date,
    pendingActions
  };
  
  const pdfBlob = await generateTrueCertificationReport(reportData);
  downloadTrueCertificationReport(pdfBlob, clientName);
}