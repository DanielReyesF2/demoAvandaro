// Calculadora de Emisiones de Agua
// Basado en factores de emisión EPA, IPCC, y UNESCO

export interface WaterImpactMetrics {
  co2Emissions: number; // kg CO₂
  energySaved: number; // kWh
  treesEquivalent: number; // Árboles salvados (por captura de CO₂)
  costSavings: number; // Pesos mexicanos
}

// Factores de emisión (kg CO₂ por m³)
const EMISSION_FACTORS = {
  // Tratamiento de agua residual
  wastewaterTreatment: 0.45, // PTAR estándar
  
  // Producción de agua potable
  potableWaterProduction: 0.35,
  
  // Reciclaje de agua
  waterRecycling: 0.25, // Menor emisión por reuso
  
  // Transporte y distribución
  transportDistribution: 0.15,
};

// Factores de equivalencia
const EQUIVALENCE_FACTORS = {
  // 1 árbol captura aproximadamente 22 kg CO₂/año (CONAFOR)
  treeCo2Capture: 22,
  
  // 1 kWh genera ~0.5 kg CO₂ en México (CFE promedio)
  kwhToCo2: 0.5,
  
  // Costo promedio de agua en México (pesos por m³)
  waterCostPerM3: 12.5, // Precio promedio comercial
};

/**
 * Calcula el impacto ambiental total del agua
 */
export function calculateWaterImpact(
  totalConsumptionM3: number,
  recycledM3: number,
  treatmentType: 'conventional' | 'advanced' | 'recycling' = 'advanced'
): WaterImpactMetrics {
  // Agua no reciclada (consumo neto)
  const netConsumption = totalConsumptionM3 - recycledM3;
  
  // Emisiones por tratamiento de agua residual
  const treatmentEmissions = totalConsumptionM3 * EMISSION_FACTORS.wastewaterTreatment;
  
  // Emisiones evitadas por reciclaje
  const avoidedEmissions = recycledM3 * (EMISSION_FACTORS.potableWaterProduction - EMISSION_FACTORS.waterRecycling);
  
  // Emisiones totales (tratamiento - evitadas por reciclaje)
  const co2Emissions = treatmentEmissions - avoidedEmissions;
  
  // Energía ahorrada (por reciclaje)
  const energySaved = avoidedEmissions / EQUIVALENCE_FACTORS.kwhToCo2;
  
  // Equivalente en árboles (si las emisiones fueran negativas, indica captura)
  const treesEquivalent = Math.abs(co2Emissions) / EQUIVALENCE_FACTORS.treeCo2Capture;
  
  // Ahorro de costos por reciclaje
  const costSavings = recycledM3 * EQUIVALENCE_FACTORS.waterCostPerM3;
  
  return {
    co2Emissions: Math.max(0, co2Emissions),
    energySaved,
    treesEquivalent,
    costSavings,
  };
}

/**
 * Calcula la eficiencia hídrica del sistema
 */
export function calculateWaterEfficiency(
  consumptionM3: number,
  recycledM3: number,
  rainwaterM3: number
): {
  efficiency: number; // Porcentaje
  circularity: number; // Índice de circularidad (0-100)
  sustainability: string; // Nivel de sostenibilidad
} {
  const totalInput = consumptionM3 + rainwaterM3;
  const totalOutput = recycledM3 + rainwaterM3;
  
  // Eficiencia: porcentaje de agua que se recicla o reutiliza
  const efficiency = consumptionM3 > 0 
    ? ((recycledM3 + rainwaterM3) / consumptionM3) * 100 
    : 0;
  
  // Circularidad: porcentaje de agua que vuelve al sistema
  const circularity = totalInput > 0 
    ? (totalOutput / totalInput) * 100 
    : 0;
  
  // Nivel de sostenibilidad
  let sustainability: string;
  if (efficiency >= 40) {
    sustainability = 'Excelente';
  } else if (efficiency >= 25) {
    sustainability = 'Bueno';
  } else if (efficiency >= 15) {
    sustainability = 'Aceptable';
  } else {
    sustainability = 'Mejorable';
  }
  
  return {
    efficiency,
    circularity,
    sustainability,
  };
}

/**
 * Convierte impacto ambiental a descripción legible
 */
export function formatWaterImpact(impact: WaterImpactMetrics): {
  co2Formatted: string;
  energyFormatted: string;
  treesFormatted: string;
  costFormatted: string;
} {
  return {
    co2Formatted: impact.co2Emissions >= 1000 
      ? `${(impact.co2Emissions / 1000).toFixed(1)} ton CO₂`
      : `${impact.co2Emissions.toFixed(0)} kg CO₂`,
    energyFormatted: impact.energySaved >= 1000 
      ? `${(impact.energySaved / 1000).toFixed(1)} MWh`
      : `${impact.energySaved.toFixed(0)} kWh`,
    treesFormatted: `${impact.treesEquivalent.toFixed(0)} árboles`,
    costFormatted: impact.costSavings >= 1000000 
      ? `$${(impact.costSavings / 1000000).toFixed(1)}M`
      : impact.costSavings >= 1000
      ? `$${(impact.costSavings / 1000).toFixed(0)}K`
      : `$${impact.costSavings.toFixed(0)}`,
  };
}
