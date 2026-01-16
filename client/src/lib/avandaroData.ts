// Datos realistas para Club Avandaro
// Basado en: Hotel (50 habitaciones), 2 Restaurantes, Club Residencial (6 casas), Campo de Golf

// FACTORES DE GENERACIÓN (kg/día)
const WASTE_GENERATION_FACTORS = {
  // Hotel: 2.5 kg por habitación por día (promedio México)
  hotel: {
    rooms: 50,
    kgPerRoomPerDay: 2.5,
    occupancyRate: 0.65, // 65% ocupación promedio
  },
  // Restaurantes: 0.8 kg por comensal
  restaurants: {
    acuarimas: { coversPerDay: 120, kgPerCover: 0.8 },
    jose: { coversPerDay: 90, kgPerCover: 0.8 },
  },
  // Club Residencial: 1.8 kg por casa por día
  residential: {
    houses: 6,
    kgPerHousePerDay: 1.8,
    occupancyRate: 0.85, // 85% ocupación
  },
  // Campo de Golf: mantenimiento y áreas comunes
  golfCourse: {
    kgPerDay: 180, // Mantenimiento, poda, áreas comunes
  },
  // Kioscos y áreas comunes
  kiosks: {
    kgPerDay: 25, // 2 kioscos
  },
  // Canchas deportivas
  sports: {
    kgPerDay: 15, // Padel y Tennis
  },
};

// Calcular generación diaria total
export function calculateDailyWasteGeneration() {
  // Hotel
  const hotelDaily = 
    WASTE_GENERATION_FACTORS.hotel.rooms * 
    WASTE_GENERATION_FACTORS.hotel.kgPerRoomPerDay * 
    WASTE_GENERATION_FACTORS.hotel.occupancyRate;
  
  // Restaurantes
  const restaurantDaily = 
    (WASTE_GENERATION_FACTORS.restaurants.acuarimas.coversPerDay * 
     WASTE_GENERATION_FACTORS.restaurants.acuarimas.kgPerCover) +
    (WASTE_GENERATION_FACTORS.restaurants.jose.coversPerDay * 
     WASTE_GENERATION_FACTORS.restaurants.jose.kgPerCover);
  
  // Club Residencial
  const residentialDaily = 
    WASTE_GENERATION_FACTORS.residential.houses * 
    WASTE_GENERATION_FACTORS.residential.kgPerHousePerDay * 
    WASTE_GENERATION_FACTORS.residential.occupancyRate;
  
  // Otras áreas
  const otherDaily = 
    WASTE_GENERATION_FACTORS.golfCourse.kgPerDay +
    WASTE_GENERATION_FACTORS.kiosks.kgPerDay +
    WASTE_GENERATION_FACTORS.sports.kgPerDay;
  
  const totalDaily = hotelDaily + restaurantDaily + residentialDaily + otherDaily;
  
  return {
    hotel: hotelDaily,
    restaurants: restaurantDaily,
    residential: residentialDaily,
    other: otherDaily,
    total: totalDaily,
  };
}

// Distribución típica de residuos en hoteles/restaurantes (porcentajes)
const WASTE_DISTRIBUTION = {
  organic: 0.55,      // 55% orgánicos (restaurantes, hotel)
  recyclable: 0.25,   // 25% reciclables (papel, cartón, plástico, vidrio)
  reuse: 0.08,        // 8% reutilizables
  landfill: 0.12,     // 12% relleno sanitario
};

// Generar datos mensuales realistas
export function generateMonthlyWasteData(year: number = 2025) {
  const dailyGen = calculateDailyWasteGeneration();
  const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const monthLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  
  // Variación estacional (más residuos en temporada alta: Dic, Ene, Feb, Jul, Ago)
  const seasonalFactors = [1.15, 1.20, 1.10, 0.95, 0.90, 0.95, 1.10, 1.15, 0.95, 0.90, 0.95, 1.25];
  
  return monthLabels.map((label, index) => {
    const days = daysPerMonth[index];
    const factor = seasonalFactors[index];
    const monthlyTotal = dailyGen.total * days * factor;
    
    // Distribución por tipo
    const organic = monthlyTotal * WASTE_DISTRIBUTION.organic;
    const recyclable = monthlyTotal * WASTE_DISTRIBUTION.recyclable;
    const reuse = monthlyTotal * WASTE_DISTRIBUTION.reuse;
    const landfill = monthlyTotal * WASTE_DISTRIBUTION.landfill;
    
    return {
      month: label,
      total: monthlyTotal,
      organic: Math.round(organic),
      recyclable: Math.round(recyclable),
      reuse: Math.round(reuse),
      landfill: Math.round(landfill),
      circular: Math.round(organic + recyclable + reuse),
      deviation: ((organic + recyclable + reuse) / monthlyTotal * 100).toFixed(1),
    };
  });
}

// Equivalencias de impacto ambiental (basadas en EPA, IPCC)
export const IMPACT_EQUIVALENCES = {
  // CO2 evitado por kg reciclado (varía por material, promedio)
  co2PerKgRecycled: 0.5, // kg CO2 por kg reciclado
  
  // Agua ahorrada por kg reciclado
  waterPerKgRecycled: 5.5, // litros por kg reciclado
  
  // Energía ahorrada por kg reciclado
  energyPerKgRecycled: 1.2, // kWh por kg reciclado
  
  // Árboles salvados (1 árbol captura ~21 kg CO2/año)
  treesPerKgCo2: 1 / 21,
  
  // Equivalencias comprensibles
  getEquivalences: (kgRecycled: number) => {
    const co2Avoided = kgRecycled * IMPACT_EQUIVALENCES.co2PerKgRecycled;
    const waterSaved = kgRecycled * IMPACT_EQUIVALENCES.waterPerKgRecycled;
    const energySaved = kgRecycled * IMPACT_EQUIVALENCES.energyPerKgRecycled;
    const treesSaved = co2Avoided * IMPACT_EQUIVALENCES.treesPerKgCo2;
    
    return {
      co2Avoided: Math.round(co2Avoided), // kg CO2
      waterSaved: Math.round(waterSaved), // litros
      energySaved: Math.round(energySaved * 10) / 10, // kWh
      treesSaved: Math.round(treesSaved),
      // Equivalencias comprensibles
      carsOffRoad: Math.round(co2Avoided / 4200), // 1 auto = 4.2 ton CO2/año
      homesPowered: Math.round(energySaved / 10800), // 1 casa = 10,800 kWh/año
      swimmingPools: Math.round(waterSaved / 75000), // 1 alberca = 75,000 L
    };
  },
};

// Datos de agua realistas para Avandaro
export function generateWaterData() {
  // Hotel: ~300 L/habitación/día
  // Restaurantes: ~15 L/comensal
  // Residencial: ~400 L/casa/día
  // Campo de golf: ~80,000 L/día (riego)
  
  const hotelWater = 50 * 300 * 0.65; // L/día
  const restaurantWater = (120 + 90) * 15; // L/día
  const residentialWater = 6 * 400 * 0.85; // L/día
  const golfWater = 80000; // L/día
  
  const totalDaily = hotelWater + restaurantWater + residentialWater + golfWater;
  const monthlyBase = totalDaily * 30; // L/mes
  
  // Variación estacional (más agua en temporada seca)
  const seasonalFactors = [0.95, 0.90, 0.95, 1.05, 1.15, 1.20, 1.25, 1.20, 1.10, 1.05, 0.95, 0.90];
  
  return seasonalFactors.map((factor, index) => {
    const consumption = monthlyBase * factor;
    const recycled = consumption * 0.29; // 29% reciclada
    const rainwater = consumption * 0.15; // 15% de lluvia captada
    
    return {
      month: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][index],
      consumo: Math.round(consumption),
      reciclada: Math.round(recycled),
      lluvia: Math.round(rainwater),
      calidad: 96 + Math.random() * 3, // 96-99%
      costo: Math.round(consumption * 0.0125), // $12.5 por m³
    };
  });
}

// Datos de energía realistas para Avandaro
export function generateEnergyData() {
  // Hotel: ~15 kWh/habitación/día
  // Restaurantes: ~8 kWh/comensal/día
  // Residencial: ~25 kWh/casa/día
  // Campo y áreas comunes: ~500 kWh/día
  
  const hotelEnergy = 50 * 15 * 0.65; // kWh/día
  const restaurantEnergy = (120 + 90) * 8; // kWh/día
  const residentialEnergy = 6 * 25 * 0.85; // kWh/día
  const commonEnergy = 500; // kWh/día
  
  const totalDaily = hotelEnergy + restaurantEnergy + residentialEnergy + commonEnergy;
  const monthlyBase = totalDaily * 30; // kWh/mes
  
  // Variación estacional (más energía en verano por AC)
  const seasonalFactors = [0.90, 0.85, 0.95, 1.05, 1.15, 1.25, 1.30, 1.25, 1.10, 1.00, 0.95, 0.90];
  
  return seasonalFactors.map((factor, index) => {
    const consumption = monthlyBase * factor;
    const renewable = consumption * (0.25 + index * 0.01); // Incremento gradual de renovables
    const efficiency = 85 + Math.random() * 5; // 85-90%
    
    return {
      month: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][index],
      consumo: Math.round(consumption),
      renovable: Math.round(renewable),
      eficiencia: Math.round(efficiency),
      costo: Math.round(consumption * 2.5), // $2.5 por kWh
      meta: Math.round(consumption * 0.30), // Meta 30% renovable
    };
  });
}
