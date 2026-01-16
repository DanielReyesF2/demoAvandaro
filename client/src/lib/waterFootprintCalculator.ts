// Calculadora de Huella Hídrica
// Basado en estándares internacionales de Water Footprint Network y UNESCO

export interface WaterFootprintResult {
  blue: number; // Agua azul (superficial y subterránea)
  green: number; // Agua verde (lluvia)
  grey: number; // Agua gris (contaminación)
  total: number; // Total
}

export interface WaterEmissionsResult {
  co2Equivalent: number; // kg CO₂ equivalente
  energyConsumed: number; // kWh
  treatmentEfficiency: number; // Porcentaje
}

// Factores de emisión para tratamiento de agua (kg CO₂/m³)
const TREATMENT_EMISSION_FACTORS = {
  conventional: 0.35, // Tratamiento convencional
  advanced: 0.45, // Tratamiento avanzado (PTAR)
  desalination: 2.8, // Desalinización
  recycling: 0.25, // Reciclaje/Reuso
};

// Factores de huella hídrica (litros por unidad)
const WATER_FOOTPRINT_FACTORS = {
  consumption: 1, // Consumo directo 1:1
  wastewater: 1.5, // Agua residual (incluye dilución)
  treatment: 1.2, // Agua para tratamiento
};

/**
 * Calcula la huella hídrica total
 */
export function calculateWaterFootprint(
  consumptionLiters: number,
  recycledLiters: number,
  rainwaterLiters: number
): WaterFootprintResult {
  // Agua azul: consumo neto (consumo - reciclada)
  const blue = Math.max(0, consumptionLiters - recycledLiters);
  
  // Agua verde: lluvia captada
  const green = rainwaterLiters;
  
  // Agua gris: estimada como 1.5x el consumo (dilución de contaminantes)
  const grey = consumptionLiters * 1.5;
  
  // Total
  const total = blue + green + grey;
  
  return {
    blue,
    green,
    grey,
    total,
  };
}

/**
 * Calcula las emisiones de CO₂ equivalente para tratamiento de agua
 */
export function calculateWaterEmissions(
  consumptionM3: number,
  recycledM3: number,
  treatmentType: keyof typeof TREATMENT_EMISSION_FACTORS = 'advanced'
): WaterEmissionsResult {
  const factor = TREATMENT_EMISSION_FACTORS[treatmentType];
  
  // Emisiones del tratamiento de agua consumida
  const consumptionEmissions = consumptionM3 * factor;
  
  // Emisiones del reciclaje (menor emisión)
  const recyclingEmissions = recycledM3 * TREATMENT_EMISSION_FACTORS.recycling;
  
  // Total de emisiones
  const co2Equivalent = consumptionEmissions + recyclingEmissions;
  
  // Energía consumida (1 kWh = ~0.5 kg CO₂ en México)
  const energyConsumed = (co2Equivalent / 0.5) || 0;
  
  // Eficiencia del tratamiento (porcentaje de reciclaje)
  const treatmentEfficiency = consumptionM3 > 0 
    ? (recycledM3 / consumptionM3) * 100 
    : 0;
  
  return {
    co2Equivalent,
    energyConsumed,
    treatmentEfficiency,
  };
}

/**
 * Convierte litros a metros cúbicos
 */
export function litersToM3(liters: number): number {
  return liters / 1000;
}

/**
 * Convierte metros cúbicos a litros
 */
export function m3ToLiters(m3: number): number {
  return m3 * 1000;
}

/**
 * Calcula el ahorro de agua reciclada vs. consumo
 */
export function calculateWaterSavings(
  consumptionLiters: number,
  recycledLiters: number
): {
  percentage: number;
  savedLiters: number;
  equivalent: string; // Descripción del equivalente
} {
  const percentage = consumptionLiters > 0 
    ? (recycledLiters / consumptionLiters) * 100 
    : 0;
  
  const savedLiters = recycledLiters;
  
  // Equivalente en términos comprensibles
  const equivalent = getWaterEquivalent(savedLiters);
  
  return {
    percentage,
    savedLiters,
    equivalent,
  };
}

/**
 * Obtiene una descripción del equivalente del ahorro de agua
 */
function getWaterEquivalent(liters: number): string {
  if (liters >= 1000000) {
    return `${(liters / 1000000).toFixed(1)} piscinas olímpicas`;
  }
  if (liters >= 1000) {
    return `${(liters / 1000).toFixed(1)} tanques de 1000L`;
  }
  return `${liters.toFixed(0)} litros`;
}
