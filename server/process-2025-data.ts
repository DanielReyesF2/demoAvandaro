import { InsertDocument, InsertWasteData } from '@shared/schema';
import { storage } from './storage';

// Información de los PDFs de 2025 para Club Campestre (definidos manualmente)
const pdfData2025 = [
  {
    fileName: '2025-01 CCCM - Bitácora de Residuos Sólidos Urbanos.pdf',
    fileSize: 214531,
    date: new Date('2025-01-01'),
    organicWaste: 6874.20,
    inorganicWaste: 3745.18,
    recyclableWaste: 820.5,
    totalWaste: 11439.88,
    month: 'Enero',
    year: '2025'
  },
  {
    fileName: '2025-02 CCCM - Bitácora de Residuos Sólidos Urbanos.pdf',
    fileSize: 218043,
    date: new Date('2025-02-01'),
    organicWaste: 5612.10,
    inorganicWaste: 3395.00,
    recyclableWaste: 745.2,
    totalWaste: 9752.3,
    month: 'Febrero',
    year: '2025'
  },
  {
    fileName: '2025-03 CCCM - Bitácora de Residuos Sólidos Urbanos.pdf',
    fileSize: 220756,
    date: new Date('2025-03-01'),
    organicWaste: 5447.50,
    inorganicWaste: 4251.00,
    recyclableWaste: 678.3,
    totalWaste: 10376.8,
    month: 'Marzo',
    year: '2025'
  }
];

// Función principal para procesar los datos de 2025
async function process2025Data() {
  console.log('Iniciando procesamiento de datos de 2025...');
  
  // ID del cliente Club Campestre
  const clientId = 4;
  
  // Procesar datos de cada mes
  for (const pdfInfo of pdfData2025) {
    console.log(`\nProcesando datos de ${pdfInfo.month} ${pdfInfo.year}...`);
    
    try {
      // Crear el documento en la base de datos
      const documentData: InsertDocument = {
        fileName: pdfInfo.fileName,
        fileSize: pdfInfo.fileSize,
        clientId,
        processed: true,
        processingError: null
      };
      
      // Crear el documento
      const document = await storage.createDocument(documentData);
      console.log(`Documento creado con ID: ${document.id}`);
      
      // Calcular desviación - La desviación es el % de residuos reciclables respecto a residuos inorgánicos
      const deviation = pdfInfo.inorganicWaste > 0 ? (pdfInfo.recyclableWaste / pdfInfo.inorganicWaste) * 100 : 0;
      const roundedDeviation = Math.round(deviation * 100) / 100;
      
      // Crear registro de datos de residuos
      const wasteData: InsertWasteData = {
        clientId,
        documentId: document.id,
        date: pdfInfo.date,
        organicWaste: pdfInfo.organicWaste,
        inorganicWaste: pdfInfo.inorganicWaste,
        recyclableWaste: pdfInfo.recyclableWaste,
        totalWaste: pdfInfo.totalWaste,
        deviation: roundedDeviation,
        rawData: {} as Record<string, any>,
        notes: `Datos para ${pdfInfo.month} ${pdfInfo.year}`
      };
      
      // Guardar en la base de datos
      const savedWasteData = await storage.createWasteData(wasteData);
      console.log('Datos procesados con éxito:');
      console.log(`- Residuos orgánicos: ${pdfInfo.organicWaste} kg`);
      console.log(`- Residuos inorgánicos: ${pdfInfo.inorganicWaste} kg`);
      console.log(`- Residuos reciclables: ${pdfInfo.recyclableWaste} kg`);
      console.log(`- Total: ${pdfInfo.totalWaste} kg`);
      console.log(`- Desviación de relleno sanitario: ${roundedDeviation}%`);
      console.log(`- Fecha: ${pdfInfo.date}`);
      console.log(`- ID de datos guardados: ${savedWasteData.id}`);
    } catch (error) {
      console.error(`Error al procesar datos de ${pdfInfo.month} ${pdfInfo.year}:`, error);
    }
  }
  
  console.log('\nProcesamiento de datos completado.');
}

// Ejecutar el procesamiento
process2025Data()
  .then(() => {
    console.log('Procesamiento de datos de 2025 completado con éxito.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error en el procesamiento de datos:', error);
    process.exit(1);
  });