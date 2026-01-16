import { motion } from 'framer-motion';
import {
  TreePine,
  Building2,
  Home,
  UtensilsCrossed,
  Droplets,
  Zap,
  Leaf,
  Recycle
} from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/animated-counter';

interface ImpactEquivalencesProps {
  co2Avoided: number; // kg de CO2 evitado
  waterSaved: number; // litros de agua ahorrados
  energySaved: number; // kWh ahorrados
  wasteDeviated: number; // kg de residuos desviados
}

// Factores específicos de Avandaro
const AVANDARO_SPECS = {
  hotel: {
    rooms: 50,
    kwhPerRoomPerDay: 15,
    litersPerRoomPerDay: 300,
  },
  restaurants: {
    acuarimas: { coversPerDay: 120, kwhPerCover: 0.067, litersPerCover: 15 },
    jose: { coversPerDay: 90, kwhPerCover: 0.067, litersPerCover: 15 },
  },
  residential: {
    houses: 6,
    kwhPerHousePerDay: 25,
    litersPerHousePerDay: 400,
  },
  pool: {
    volumeLiters: 75000, // 75,000 litros por alberca
  },
  // Consumos promedio
  energyPerHotelRoomPerMonth: 15 * 30, // 450 kWh/mes por habitación
  waterPerHotelRoomPerMonth: 300 * 30, // 9,000 L/mes por habitación
  energyPerRestaurantPerMonth: (120 + 90) * 0.067 * 30, // ~422 kWh/mes entre ambos restaurantes
  waterPerRestaurantPerMonth: (120 + 90) * 15 * 30, // ~94,500 L/mes entre ambos
  energyPerHousePerMonth: 25 * 30, // 750 kWh/mes por casa
  waterPerHousePerMonth: 400 * 30, // 12,000 L/mes por casa
};

// Factores de conversión para equivalencias
const EQUIVALENCES = {
  // Árboles: 1 árbol absorbe ~21 kg CO2/año
  treesPerKgCO2: 1 / 21,
};

export function ImpactEquivalences({
  co2Avoided,
  waterSaved,
  energySaved,
  wasteDeviated,
}: ImpactEquivalencesProps) {
  // Calcular equivalencias personalizadas de Avandaro
  const hotelRoomsEquivalentMonths = energySaved / (AVANDARO_SPECS.energyPerHotelRoomPerMonth * 50); // 50 habitaciones
  const hotelRoomsEquivalent = Math.round(hotelRoomsEquivalentMonths * 50); // Número de habitaciones-mes
  
  const restaurantsEquivalentMonths = energySaved / AVANDARO_SPECS.energyPerRestaurantPerMonth;
  const restaurantsEquivalent = Math.round(restaurantsEquivalentMonths * 30); // días equivalentes
  
  const housesEquivalentMonths = energySaved / (AVANDARO_SPECS.energyPerHousePerMonth * 6); // 6 casas
  const housesEquivalent = Math.round(housesEquivalentMonths * 6); // Número de casas-mes
  
  // Agua: habitaciones del hotel
  const hotelRoomsWaterMonths = waterSaved / (AVANDARO_SPECS.waterPerHotelRoomPerMonth * 50);
  const hotelRoomsWater = Math.round(hotelRoomsWaterMonths * 50);
  
  // Agua: albercas llenas
  const poolsEquivalent = waterSaved / AVANDARO_SPECS.pool.volumeLiters;
  
  // Agua: restaurantes
  const restaurantsWaterDays = waterSaved / ((AVANDARO_SPECS.waterPerRestaurantPerMonth / 30));
  const restaurantsWater = Math.round(restaurantsWaterDays);
  
  // CO2: árboles del campo de golf
  const treesEquivalent = Math.round(co2Avoided * EQUIVALENCES.treesPerKgCO2);
  
  // Residuos: equivalentes a días de operación
  const dailyWasteAtAvandaro = 350; // kg/día estimado total
  const daysOfWasteEquivalent = wasteDeviated / dailyWasteAtAvandaro;

  // Preparar equivalencias con valores y labels formateados
  const hotelRoomsMonths = hotelRoomsEquivalentMonths;
  const restaurantMonths = restaurantsEquivalentMonths;
  const housesMonths = housesEquivalentMonths;
  const hotelWaterMonths = hotelRoomsWaterMonths;
  const poolsRounded = poolsEquivalent;
  const restaurantWaterMonths = restaurantsWaterDays / 30;
  const daysOfWasteRounded = daysOfWasteEquivalent;

  // Calcular habitaciones equivalentes para mostrar cuando no es suficiente para un mes completo
  const hotelRoomsForMonth = hotelRoomsMonths < 1 ? Math.round(hotelRoomsMonths * 50 * 30) : null;
  const housesForMonth = housesMonths < 1 ? Math.round(housesMonths * 6 * 30) : null;
  const hotelWaterRoomsForMonth = hotelWaterMonths < 1 ? Math.round(hotelWaterMonths * 50 * 30) : null;

  // Seleccionar solo las 4 equivalencias más claras y representativas
  const equivalences = [
    {
      icon: Zap,
      value: hotelRoomsMonths >= 1 ? hotelRoomsMonths : (hotelRoomsForMonth || 1),
      label: hotelRoomsMonths >= 1 ? 'meses' : 'habitaciones',
      description: hotelRoomsMonths >= 1
        ? 'de energía del Hotel Avandaro completo'
        : `del Hotel Avandaro funcionando por 1 mes completo`,
      valueLabel: hotelRoomsMonths >= 1 ? `${hotelRoomsMonths.toFixed(1)} meses` : `${hotelRoomsForMonth} habitaciones`,
      decimals: hotelRoomsMonths >= 1 ? 1 : 0,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      icon: Droplets,
      value: poolsRounded >= 1 ? poolsRounded : (poolsRounded * 100),
      label: poolsRounded >= 1 ? 'albercas' : '% alberca',
      description: poolsRounded >= 1
        ? 'llenadas completamente del Club'
        : 'de una alberca del Club',
      valueLabel: poolsRounded >= 1 ? `${poolsRounded.toFixed(1)} albercas` : `${Math.round(poolsRounded * 100)}%`,
      decimals: poolsRounded >= 1 ? 1 : 0,
      color: 'from-sky-500 to-blue-600',
      bgColor: 'bg-sky-50',
      iconColor: 'text-sky-600',
    },
    {
      icon: TreePine,
      value: treesEquivalent >= 100 ? Math.round(treesEquivalent / 100) : treesEquivalent,
      label: treesEquivalent >= 100 ? 'hectáreas' : 'árboles',
      description: treesEquivalent >= 100
        ? 'del campo de golf Avandaro'
        : 'equivalente a árboles plantados en el campo de golf',
      valueLabel: treesEquivalent >= 100 ? `${Math.round(treesEquivalent / 100)} hectáreas` : `${treesEquivalent} árboles`,
      decimals: 0,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      icon: Recycle,
      value: daysOfWasteRounded >= 30 ? Math.round(daysOfWasteRounded / 30) : daysOfWasteRounded,
      label: daysOfWasteRounded >= 30 ? 'meses' : 'días',
      description: daysOfWasteRounded >= 30
        ? 'de residuos generados en Avandaro'
        : 'de operación completa del Club Avandaro',
      valueLabel: daysOfWasteRounded >= 30 ? `${Math.round(daysOfWasteRounded / 30)} meses` : `${Math.round(daysOfWasteRounded)} días`,
      decimals: 0,
      color: 'from-teal-500 to-cyan-600',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="space-y-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {equivalences.map((item, index) => (
          <motion.div
            key={item.label}
            variants={itemVariants}
            whileHover={{
              scale: 1.05,
              y: -8,
              transition: { type: 'spring', stiffness: 400 }
            }}
            className={`relative overflow-hidden rounded-2xl p-5 ${item.bgColor} border border-white/50 shadow-sm hover:shadow-xl transition-shadow duration-300`}
          >
            {/* Gradiente de fondo sutil */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-5`} />

            {/* Ícono */}
            <div className={`${item.iconColor} mb-3`}>
              <item.icon className="w-8 h-8" strokeWidth={1.5} />
            </div>

            {/* Valor animado */}
            <div className="text-3xl font-bold text-gray-900 mb-1">
              <AnimatedCounter
                value={item.value}
                duration={2.5}
                suffix=""
                decimals={item.decimals ?? 0}
              />
            </div>

            {/* Labels */}
            <div className="text-sm font-semibold text-gray-700">
              {item.valueLabel || item.label}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {item.description}
            </div>

            {/* Efecto de brillo */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/30 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
