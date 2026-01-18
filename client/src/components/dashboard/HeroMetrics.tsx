import { motion } from 'framer-motion';
import {
  Leaf,
  Recycle,
  Zap,
  Droplets,
  Trophy,
  TrendingUp,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/animated-counter';

interface HeroMetricsProps {
  deviationRate: number;
  energyRenewable: number;
  waterRecycled: number;
  circularityIndex: number;
  totalWasteDiverted: number; // toneladas
  ahorroEconomico: number; // ahorro económico en MXN
}

export function HeroMetrics({
  deviationRate,
  energyRenewable,
  waterRecycled,
  circularityIndex,
  totalWasteDiverted,
  ahorroEconomico,
}: HeroMetricsProps) {
  const mainMetrics = [
    {
      label: 'Desviación TRUE',
      value: deviationRate,
      suffix: '%',
      target: 90,
      icon: Recycle,
      color: 'emerald',
      gradient: 'from-emerald-400 to-teal-500',
      description: 'Certificación Zero Waste',
    },
    {
      label: 'Energía Renovable',
      value: energyRenewable,
      suffix: '%',
      target: 50,
      icon: Zap,
      color: 'amber',
      gradient: 'from-amber-400 to-orange-500',
      description: 'Paneles solares activos',
    },
    {
      label: 'Agua Reciclada',
      value: waterRecycled,
      suffix: '%',
      target: 40,
      icon: Droplets,
      color: 'sky',
      gradient: 'from-sky-400 to-blue-500',
      description: 'PTAR y sistemas',
    },
    {
      label: 'Circularidad',
      value: circularityIndex,
      suffix: '%',
      target: 85,
      icon: Leaf,
      color: 'violet',
      gradient: 'from-violet-400 to-purple-500',
      description: 'Índice integral',
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-blue-50/30 to-emerald-50/30 p-8 mb-8 border border-gray-200 shadow-premium-xl">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradiente animado */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 blur-3xl rounded-full"
        />
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-violet-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full"
        />

        {/* Patrón de puntos */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }} />
        </div>
      </div>

      {/* Contenido */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-2"
            >
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </motion.div>
                <span className="text-sm font-medium text-emerald-400">En vivo</span>
              </div>
              <span className="text-gray-500 text-sm">Actualizado ahora</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
            >
              Panel de Sustentabilidad
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 text-lg"
            >
              Grupo Avándaro · Compromiso ambiental en tiempo real
            </motion.p>
          </div>

          {/* Badge de certificación */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden md:flex items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30"
          >
            <Trophy className="w-6 h-6 text-amber-400" />
            <div>
              <div className="text-sm font-semibold text-amber-400">Rumbo a TRUE Platino</div>
              <div className="text-xs text-amber-400/70">Meta 2026: 90% desviación</div>
            </div>
          </motion.div>
        </div>

        {/* Métrica principal destacada */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8 py-6"
        >
          <div className="text-gray-600 text-sm uppercase tracking-wider mb-2">
            Residuos desviados del relleno sanitario
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="text-6xl md:text-7xl font-bold text-gray-900">
              <AnimatedCounter
                value={totalWasteDiverted}
                decimals={1}
                duration={2.5}
              />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-emerald-600">toneladas</div>
              <div className="text-gray-600">este año</div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-3 text-center"
          >
            <div className="text-lg font-semibold text-gray-700">
              Equivalente a{' '}
              <span className="text-emerald-600 font-bold">
                ${(ahorroEconomico / 1000).toFixed(1)}K
              </span>{' '}
              de ahorro económico
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Gastos evitados por no usar servicios de relleno sanitario
            </div>
          </motion.div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }}
            className="h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto max-w-md mt-4 rounded-full"
          />
        </motion.div>

        {/* Grid de métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mainMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-5 hover:border-gray-300 hover:shadow-lg transition-all">
                {/* Ícono con gradiente */}
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${metric.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                  <metric.icon className="w-5 h-5 text-white" />
                </div>

                {/* Valor */}
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-gray-900">
                    <AnimatedCounter
                      value={metric.value}
                      decimals={1}
                      duration={2}
                    />
                  </span>
                  <span className="text-lg text-gray-600">{metric.suffix}</span>
                </div>

                {/* Label */}
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {metric.label}
                </div>
                <div className="text-xs text-gray-600">
                  {metric.description}
                </div>

                {/* Progress hacia meta */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Progreso</span>
                    <span>Meta: {metric.target}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                      className={`h-full bg-gradient-to-r ${metric.gradient} rounded-full`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Indicadores de tendencia */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-200"
        >
          <div className="flex items-center gap-2 text-emerald-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">+5.2% vs mes anterior</span>
          </div>
          <div className="h-4 w-px bg-white/20" />
          <div className="flex items-center gap-2 text-gray-600">
            <ArrowUpRight className="w-4 h-4" />
            <span className="text-sm">Rumbo a superar meta anual</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
