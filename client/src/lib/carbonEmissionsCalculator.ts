// Calculadora de Emisiones de Carbono
// Basado en factores de emisión CFE México, IPCC, y GHG Protocol

export interface CarbonEmissionsResult {
  totalCo2: number; // kg CO₂
  renewableCo2: number; // kg CO₂ evitadas por renovables
  netCo2: number; // kg CO₂ neto (total - evitadas)
  carbonOffset: number; // Porcentaje de compensación
}

export interface EnergyMetricsResult {
  totalConsumption: number; // kWh
  renewableGeneration: number; // kWh
  renewablePercentage: number; // Porcentaje
  costSavings: number; // Pesos mexicanos
  emissionsSavings: number; // kg CO₂ evitadas
}

// Factor de emisión eléctrica CFE México (kg CO₂/kWh)
// Promedio nacional: ~0.5 kg CO₂/kWh
const CFE_EMISSION_FACTOR = 0.5;

// Factor de emisión renovable (kg CO₂/kWh)
const RENEWABLE_EMISSION_FACTOR = 0.02; // Muy bajo por renovables

// Costo promedio de electricidad en México (pesos por kWh)
const ELECTRICITY_COST_PER_KWH = 2.5; // Precio promedio comercial

// Equivalencias
const EQUIVALENCE_FACTORS = {
  // 1 árbol captura aproximadamente 22 kg CO₂/año (CONAFOR)
  treeCo2Capture: 22,
  
  // 1 litro de diesel genera ~2.68 kg CO₂
  dieselCo2PerLiter: 2.68,
  
  // 1 kWh equivale a ~0.265 litros de diesel
  kwhToDiesel: 0.265,
};

/**
 * Calcula las emisiones de CO₂ de energía
 */
export function calculateCarbonEmissions(
  totalConsumptionKwh: number,
  renewableKwh: number
): CarbonEmissionsResult {
  // Emisiones totales si todo fuera de CFE
  const totalCo2 = totalConsumptionKwh * CFE_EMISSION_FACTOR;
  
  // Emisiones de generación renovable (mínimas)
  const renewableCo2 = renewableKwh * RENEWABLE_EMISSION_FACTOR;
  
  // Emisiones evitadas por usar renovables
  const avoidedEmissions = renewableKwh * (CFE_EMISSION_FACTOR - RENEWABLE_EMISSION_FACTOR);
  
  // Emisiones netas (total - evitadas)
  const netCo2 = totalCo2 - avoidedEmissions;
  
  // Porcentaje de compensación de carbono
  const carbonOffset = totalCo2 > 0 ? (avoidedEmissions / totalCo2) * 100 : 0;
  
  return {
    totalCo2,
    renewableCo2,
    netCo2: Math.max(0, netCo2),
    carbonOffset,
  };
}

/**
 * Calcula métricas de energía
 */
export function calculateEnergyMetrics(
  totalConsumptionKwh: number,
  renewableKwh: number,
  solarCapacityKw?: number
): EnergyMetricsResult {
  const renewablePercentage = totalConsumptionKwh > 0 
    ? (renewableKwh / totalConsumptionKwh) * 100 
    : 0;
  
  // Ahorro de costos (energía renovable vs. CFE)
  const costSavings = renewableKwh * ELECTRICITY_COST_PER_KWH;
  
  // Emisiones evitadas
  const emissionsSavings = renewableKwh * (CFE_EMISSION_FACTOR - RENEWABLE_EMISSION_FACTOR);
  
  return {
    totalConsumption: totalConsumptionKwh,
    renewableGeneration: renewableKwh,
    renewablePercentage,
    costSavings,
    emissionsSavings,
  };
}

/**
 * Convierte emisiones a descripciones legibles
 */
export function formatCarbonEmissions(emissions: CarbonEmissionsResult): {
  totalFormatted: string;
  netFormatted: string;
  offsetFormatted: string;
  treesFormatted: string;
  dieselFormatted: string;
} {
  return {
    totalFormatted: emissions.totalCo2 >= 1000 
      ? `${(emissions.totalCo2 / 1000).toFixed(1)} ton CO₂`
      : `${emissions.totalCo2.toFixed(0)} kg CO₂`,
    netFormatted: emissions.netCo2 >= 1000 
      ? `${(emissions.netCo2 / 1000).toFixed(1)} ton CO₂`
      : `${emissions.netCo2.toFixed(0)} kg CO₂`,
    offsetFormatted: `${emissions.carbonOffset.toFixed(1)}%`,
    treesFormatted: `${(emissions.netCo2 / EQUIVALENCE_FACTORS.treeCo2Capture).toFixed(0)} árboles`,
    dieselFormatted: `${(emissions.netCo2 * EQUIVALENCE_FACTORS.kwhToDiesel / EQUIVALENCE_FACTORS.dieselCo2PerLiter).toFixed(1)} L diesel`,
  };
}

/**
 * Proyecta emisiones futuras basadas en tendencia
 */
export function projectFutureEmissions(
  currentEmissions: number,
  currentRenewablePercentage: number,
  targetRenewablePercentage: number,
  projectedConsumption: number
): {
  projectedEmissions: number;
  projectedSavings: number;
  reductionPercentage: number;
} {
  // Proyección de emisiones con porcentaje objetivo de renovables
  const renewableKwh = projectedConsumption * (targetRenewablePercentage / 100);
  const conventionalKwh = projectedConsumption * ((100 - targetRenewablePercentage) / 100);
  
  const projectedEmissions = 
    (conventionalKwh * CFE_EMISSION_FACTOR) + 
    (renewableKwh * RENEWABLE_EMISSION_FACTOR);
  
  const projectedSavings = currentEmissions - projectedEmissions;
  
  const reductionPercentage = currentEmissions > 0 
    ? (projectedSavings / currentEmissions) * 100 
    : 0;
  
  return {
    projectedEmissions,
    projectedSavings,
    reductionPercentage,
  };
}
