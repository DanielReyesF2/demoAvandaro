import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Target,
  Sparkles,
  ChevronRight,
  ArrowUpRight,
  Zap,
  Leaf,
  BarChart3
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';

interface Insight {
  id: string;
  type: 'prediction' | 'recommendation' | 'alert' | 'achievement';
  title: string;
  description: string;
  metric?: string;
  trend?: 'up' | 'down' | 'stable';
  confidence?: number;
  priority: 'high' | 'medium' | 'low';
  actionable?: string;
}

interface AIInsightsProps {
  deviationRate: number;
  monthlyData: Array<{
    month: string;
    recycling: number;
    compost: number;
    landfill: number;
  }>;
}

export function AIInsights({ deviationRate, monthlyData }: AIInsightsProps) {
  const [activeInsight, setActiveInsight] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  // Simular análisis de IA
  useEffect(() => {
    const timer = setTimeout(() => setIsAnalyzing(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Generar insights basados en datos reales
  const generateInsights = (): Insight[] => {
    const insights: Insight[] = [];

    // Calcular tendencias
    const lastThreeMonths = monthlyData.slice(-3);
    const avgRecycling = lastThreeMonths.reduce((sum, m) => sum + m.recycling, 0) / 3;
    const avgLandfill = lastThreeMonths.reduce((sum, m) => sum + m.landfill, 0) / 3;

    // Predicción de desviación
    const projectedDeviation = Math.min(deviationRate + 2.3, 100);
    insights.push({
      id: '1',
      type: 'prediction',
      title: 'Proyección Q2 2025',
      description: `Basado en la tendencia actual, se proyecta alcanzar ${projectedDeviation.toFixed(1)}% de desviación para junio 2025.`,
      metric: `${projectedDeviation.toFixed(1)}%`,
      trend: 'up',
      confidence: 87,
      priority: 'high',
    });

    // Recomendación de optimización
    insights.push({
      id: '2',
      type: 'recommendation',
      title: 'Optimizar separación en restaurantes',
      description: 'Los restaurantes generan 45% de orgánicos. Implementar contenedores específicos aumentaría la composta en 12%.',
      metric: '+12%',
      trend: 'up',
      priority: 'high',
      actionable: 'Implementar programa piloto en Restaurante Acuarimas',
    });

    // Logro detectado
    if (deviationRate > 80) {
      insights.push({
        id: '3',
        type: 'achievement',
        title: 'Rumbo a Certificación Platino',
        description: `Con ${deviationRate.toFixed(1)}% de desviación, están a ${(90 - deviationRate).toFixed(1)} puntos del nivel Platino TRUE.`,
        metric: `${(90 - deviationRate).toFixed(1)} pts`,
        priority: 'medium',
      });
    }

    // Alerta de oportunidad
    insights.push({
      id: '4',
      type: 'alert',
      title: 'Pico de generación detectado',
      description: 'Los fines de semana aumenta la generación 35%. Reforzar separación en kioscos sábados y domingos.',
      trend: 'up',
      priority: 'medium',
    });

    // Insight de ahorro
    insights.push({
      id: '5',
      type: 'recommendation',
      title: 'Potencial de ahorro económico',
      description: 'Reducir 500 kg mensuales de relleno sanitario generaría un ahorro de $8,500 MXN/mes.',
      metric: '$8,500',
      priority: 'medium',
      actionable: 'Ver análisis detallado de costos',
    });

    return insights;
  };

  const insights = generateInsights();

  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'prediction':
        return <BarChart3 className="w-5 h-5" />;
      case 'recommendation':
        return <Lightbulb className="w-5 h-5" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5" />;
      case 'achievement':
        return <Target className="w-5 h-5" />;
    }
  };

  const getInsightColor = (type: Insight['type']) => {
    switch (type) {
      case 'prediction':
        return 'from-blue-500 to-indigo-600';
      case 'recommendation':
        return 'from-emerald-500 to-teal-600';
      case 'alert':
        return 'from-amber-500 to-orange-600';
      case 'achievement':
        return 'from-violet-500 to-purple-600';
    }
  };

  const getBgColor = (type: Insight['type']) => {
    switch (type) {
      case 'prediction':
        return 'bg-blue-50 border-blue-100';
      case 'recommendation':
        return 'bg-emerald-50 border-emerald-100';
      case 'alert':
        return 'bg-amber-50 border-amber-100';
      case 'achievement':
        return 'bg-violet-50 border-violet-100';
    }
  };

  // Animación de "pensando"
  if (isAnalyzing) {
    return (
      <GlassCard variant="primary" className="min-h-[300px]">
        <div className="flex flex-col items-center justify-center h-full py-12">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mb-4"
          >
            <Brain className="w-8 h-8 text-white" />
          </motion.div>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-gray-600 font-medium"
          >
            Analizando patrones ambientales...
          </motion.p>
          <div className="flex gap-1 mt-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 bg-blue-500 rounded-full"
              />
            ))}
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Insights Inteligentes</h2>
            <p className="text-sm text-gray-500">Análisis predictivo impulsado por IA</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>{insights.length} insights activos</span>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Insight Principal */}
        <motion.div
          layout
          className="lg:row-span-2"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeInsight}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className={`h-full rounded-2xl p-6 border ${getBgColor(insights[activeInsight].type)}`}
            >
              {/* Badge de tipo */}
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-sm font-medium mb-4 bg-gradient-to-r ${getInsightColor(insights[activeInsight].type)}`}>
                {getInsightIcon(insights[activeInsight].type)}
                <span className="capitalize">{insights[activeInsight].type === 'prediction' ? 'Predicción' :
                  insights[activeInsight].type === 'recommendation' ? 'Recomendación' :
                  insights[activeInsight].type === 'alert' ? 'Alerta' : 'Logro'}</span>
              </div>

              {/* Contenido */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {insights[activeInsight].title}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {insights[activeInsight].description}
              </p>

              {/* Métricas */}
              {insights[activeInsight].metric && (
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl font-bold text-gray-900">
                    {insights[activeInsight].metric}
                  </div>
                  {insights[activeInsight].trend && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      insights[activeInsight].trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {insights[activeInsight].trend === 'up' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>Tendencia</span>
                    </div>
                  )}
                  {insights[activeInsight].confidence && (
                    <div className="text-sm text-gray-500">
                      {insights[activeInsight].confidence}% confianza
                    </div>
                  )}
                </div>
              )}

              {/* Acción */}
              {insights[activeInsight].actionable && (
                <button className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  <span>{insights[activeInsight].actionable}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Lista de insights secundarios */}
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <motion.button
              key={insight.id}
              onClick={() => setActiveInsight(index)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                activeInsight === index
                  ? `${getBgColor(insight.type)} ring-2 ring-offset-2 ${
                      insight.type === 'prediction' ? 'ring-blue-400' :
                      insight.type === 'recommendation' ? 'ring-emerald-400' :
                      insight.type === 'alert' ? 'ring-amber-400' : 'ring-violet-400'
                    }`
                  : 'bg-white border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white bg-gradient-to-r ${getInsightColor(insight.type)}`}>
                    {getInsightIcon(insight.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">
                      {insight.title}
                    </h4>
                    {insight.metric && (
                      <span className="text-xs text-gray-500">
                        {insight.metric}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${
                  activeInsight === index ? 'rotate-90 text-gray-900' : 'text-gray-400'
                }`} />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
