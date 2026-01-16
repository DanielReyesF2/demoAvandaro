// Calculadora de Métricas de Energía
// Incluye eficiencia, ahorros, y comparativas

export interface EnergyEfficiencyResult {
  efficiency: number; // Porcentaje de eficiencia energética
  savings: number; // Ahorro en kWh
  costReduction: number; // Reducción de costos en pesos
  impact: string; // Impacto ambiental
}

export interface EnergyComparison {
  before: {
    consumption: number;
    renewable: number;
    emissions: number;
    cost: number;
  };
  after: {
    consumption: number;
    renewable: number;
    emissions: number;
    cost: number;
  };
  improvement: {
    consumptionReduction: number;
    renewableIncrease: number;
    emissionsReduction: number;
    costSavings: number;
  };
}

// Factores de eficiencia
const EFFICIENCY_BASELINE = {
  // Consumo promedio por metro cuadrado (kWh/m²/año)
  commercial: 120,
  residential: 100,
  
  // Eficiencia energética óptima
  optimal: 80,
};

/**
 * Calcula la eficiencia energética
 */
export function calculateEnergyEfficiency(
  totalConsumptionKwh: number,
  totalAreaM2: number,
  buildingType: 'commercial' | 'residential' = 'commercial'
): EnergyEfficiencyResult {
  const baseline = EFFICIENCY_BASELINE[buildingType];
  const optimal = EFFICIENCY_BASELINE.optimal;
  
  const consumptionPerM2 = (totalConsumptionKwh / totalAreaM2);
  const efficiency = baseline > 0 ? ((baseline - consumptionPerM2) / baseline) * 100 : 0;
  
  // Ahorro potencial vs. óptimo
  const optimalConsumption = totalAreaM2 * optimal;
  const savings = Math.max(0, totalConsumptionKwh - optimalConsumption);
  
  // Reducción de costos
  const costReduction = savings * 2.5; // Precio promedio kWh
  
  // Impacto
  let impact: string;
  if (efficiency >= 30) {
    impact = 'Excelente';
  } else if (efficiency >= 20) {
    impact = 'Bueno';
  } else if (efficiency >= 10) {
    impact = 'Aceptable';
  } else {
    impact = 'Mejorable';
  }
  
  return {
    efficiency,
    savings,
    costReduction,
    impact,
  };
}

/**
 * Compara energía antes y después de mejoras
 */
export function compareEnergyUsage(comparison: {
  beforeConsumption: number;
  beforeRenewable: number;
  afterConsumption: number;
  afterRenewable: number;
}): EnergyComparison {
  const CFE_EMISSION_FACTOR = 0.5;
  const RENEWABLE_EMISSION_FACTOR = 0.02;
  const COST_PER_KWH = 2.5;
  
  // Antes
  const beforeConventional = comparison.beforeConsumption - comparison.beforeRenewable;
  const beforeEmissions = 
    (beforeConventional * CFE_EMISSION_FACTOR) + 
    (comparison.beforeRenewable * RENEWABLE_EMISSION_FACTOR);
  const beforeCost = comparison.beforeConsumption * COST_PER_KWH;
  
  // Después
  const afterConventional = comparison.afterConsumption - comparison.afterRenewable;
  const afterEmissions = 
    (afterConventional * CFE_EMISSION_FACTOR) + 
    (comparison.afterRenewable * RENEWABLE_EMISSION_FACTOR);
  const afterCost = comparison.afterConsumption * COST_PER_KWH;
  
  // Mejoras
  const consumptionReduction = comparison.beforeConsumption - comparison.afterConsumption;
  const renewableIncrease = comparison.afterRenewable - comparison.beforeRenewable;
  const emissionsReduction = beforeEmissions - afterEmissions;
  const costSavings = beforeCost - afterCost;
  
  return {
    before: {
      consumption: comparison.beforeConsumption,
      renewable: comparison.beforeRenewable,
      emissions: beforeEmissions,
      cost: beforeCost,
    },
    after: {
      consumption: comparison.afterConsumption,
      renewable: comparison.afterRenewable,
      emissions: afterEmissions,
      cost: afterCost,
    },
    improvement: {
      consumptionReduction,
      renewableIncrease,
      emissionsReduction,
      costSavings,
    },
  };
}

/**
 * Formatea valores de energía
 */
export function formatEnergyValues(value: number, type: 'consumption' | 'cost' | 'emissions'): string {
  switch (type) {
    case 'consumption':
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)} GWh`;
      }
      if (value >= 1000) {
        return `${(value / 1000).toFixed(1)} MWh`;
      }
      return `${value.toFixed(0)} kWh`;
    
    case 'cost':
      if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
      }
      if (value >= 1000) {
        return `$${(value / 1000).toFixed(0)}K`;
      }
      return `$${value.toFixed(0)}`;
    
    case 'emissions':
      if (value >= 1000) {
        return `${(value / 1000).toFixed(1)} ton CO₂`;
      }
      return `${value.toFixed(0)} kg CO₂`;
    
    default:
      return value.toFixed(0);
  }
}
