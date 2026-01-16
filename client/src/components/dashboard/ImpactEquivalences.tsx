import { motion } from 'framer-motion';
import {
  TreePine,
  Car,
  Plane,
  Home,
  Lightbulb,
  Droplets,
  Smartphone,
  Coffee
} from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/animated-counter';

interface ImpactEquivalencesProps {
  co2Avoided: number; // kg de CO2 evitado
  waterSaved: number; // litros de agua ahorrados
  energySaved: number; // kWh ahorrados
  wasteDeviated: number; // kg de residuos desviados
}

// Factores de conversión para equivalencias
const EQUIVALENCES = {
  // Árboles: 1 árbol absorbe ~21 kg CO2/año
  treesPerKgCO2: 1 / 21,
  // Coches: 1 coche emite ~4.6 toneladas CO2/año = 4600 kg
  carsPerKgCO2: 1 / 4600,
  // Vuelos Madrid-NYC: ~1000 kg CO2 por pasajero
  flightsPerKgCO2: 1 / 1000,
  // Hogares: 1 hogar consume ~10,000 kWh/año
  homesPerKwh: 1 / 10000,
  // Smartphones: cargar un smartphone = ~0.012 kWh
  phonesPerKwh: 1 / 0.012,
  // Botellas de agua: 1 botella = 0.5 litros
  bottlesPerLiter: 1 / 0.5,
  // Cafés: 1 café usa ~140 litros de agua en producción
  coffeesPerLiter: 1 / 140,
};

export function ImpactEquivalences({
  co2Avoided,
  waterSaved,
  energySaved,
  wasteDeviated,
}: ImpactEquivalencesProps) {
  const equivalences = [
    {
      icon: TreePine,
      value: Math.round(co2Avoided * EQUIVALENCES.treesPerKgCO2),
      label: 'Árboles equivalentes',
      description: 'plantados durante un año',
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      icon: Car,
      value: Math.round(co2Avoided * EQUIVALENCES.carsPerKgCO2 * 12), // meses fuera de circulación
      label: 'Meses sin auto',
      description: 'equivalente a sacar un coche',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: Plane,
      value: Math.round(co2Avoided * EQUIVALENCES.flightsPerKgCO2),
      label: 'Vuelos evitados',
      description: 'CDMX - Nueva York',
      color: 'from-violet-500 to-purple-600',
      bgColor: 'bg-violet-50',
      iconColor: 'text-violet-600',
    },
    {
      icon: Home,
      value: Math.round(energySaved * EQUIVALENCES.homesPerKwh * 12), // meses de consumo de hogar
      label: 'Meses de energía',
      description: 'de un hogar promedio',
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      icon: Smartphone,
      value: Math.round(energySaved * EQUIVALENCES.phonesPerKwh),
      label: 'Cargas de celular',
      description: 'smartphones cargados',
      color: 'from-cyan-500 to-teal-600',
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
    },
    {
      icon: Droplets,
      value: Math.round(waterSaved * EQUIVALENCES.bottlesPerLiter),
      label: 'Botellas de agua',
      description: 'de 500ml ahorradas',
      color: 'from-sky-500 to-blue-600',
      bgColor: 'bg-sky-50',
      iconColor: 'text-sky-600',
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Impacto Ambiental Real
          </h2>
          <p className="text-gray-500 mt-1">
            Equivalencias que hacen tangible nuestro compromiso
          </p>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center"
        >
          <TreePine className="w-6 h-6 text-white" />
        </motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
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
              />
            </div>

            {/* Labels */}
            <div className="text-sm font-semibold text-gray-700">
              {item.label}
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
