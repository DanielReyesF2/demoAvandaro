import { motion } from 'framer-motion';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "../components/layout/AppLayout";
import { RotateCcw, TrendingUp, Award, Target, Leaf, Recycle, Zap, Droplets, TreePine, Car, ArrowRight, Sparkles } from "lucide-react";
import { AnimatedCounter } from '@/components/ui/animated-counter';

// Datos del índice de circularidad
const circularityMetrics = [
  { subject: 'Residuos', score: 68, maxScore: 100, description: 'Desviación del relleno sanitario' },
  { subject: 'Energía', score: 75, maxScore: 100, description: 'Eficiencia y renovables' },
  { subject: 'Agua', score: 82, maxScore: 100, description: 'Reciclaje y conservación' },
  { subject: 'Materiales', score: 45, maxScore: 100, description: 'Compras sustentables' },
  { subject: 'Biodiversidad', score: 63, maxScore: 100, description: 'Espacios verdes nativos' },
  { subject: 'Movilidad', score: 38, maxScore: 100, description: 'Transporte sustentable' },
];

// Datos de progreso mensual
const monthlyProgress = [
  { month: 'Ene', circularidad: 58, residuos: 52, energia: 71, agua: 79 },
  { month: 'Feb', circularidad: 61, residuos: 55, energia: 73, agua: 80 },
  { month: 'Mar', circularidad: 63, residuos: 58, energia: 74, agua: 81 },
  { month: 'Abr', circularidad: 67, residuos: 62, energia: 75, agua: 82 },
  { month: 'May', circularidad: 69, residuos: 65, energia: 75, agua: 82 },
  { month: 'Jun', circularidad: 72, residuos: 68, energia: 75, agua: 82 },
];

// Indicadores de impacto
const impactData = [
  { name: 'Materiales Circulares', value: 65, fill: '#22c55e' },
  { name: 'Materiales Lineales', value: 35, fill: '#ef4444' },
];

export default function EconomiaCircular() {
  const indiceCircularidad = circularityMetrics.reduce((sum, metric) => sum + metric.score, 0) / circularityMetrics.length;
  const mejorCategoria = circularityMetrics.reduce((prev, current) => (prev.score > current.score) ? prev : current);
  const categoriaAMejorar = circularityMetrics.reduce((prev, current) => (prev.score < current.score) ? prev : current);

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Hero Section - Índice de Circularidad */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-8 mb-8 shadow-2xl"
          >
            {/* Animación de ciclo circular */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-4 border-white/10 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border-2 border-white/10 rounded-full"
              />
              {/* Partículas flotantes */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -30, 0],
                    x: [0, 20, 0],
                    rotate: 360
                  }}
                  transition={{
                    duration: 5 + i,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                  className="absolute w-8 h-8 text-white/20"
                  style={{ top: `${20 + i * 15}%`, left: `${10 + i * 15}%` }}
                >
                  <Recycle className="w-full h-full" />
                </motion.div>
              ))}
            </div>

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                  >
                    <Recycle className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">Economía Circular</h1>
                    <p className="text-white/80">Índice integral de sustentabilidad</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span className="text-white font-medium">Nivel B+</span>
                </div>
              </div>

              {/* Indicador principal con círculo animado */}
              <div className="flex items-center justify-center mb-8">
                <div className="relative">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="85"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="12"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="85"
                      fill="none"
                      stroke="white"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 85}
                      initial={{ strokeDashoffset: 2 * Math.PI * 85 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 85 * (1 - indiceCircularidad / 100) }}
                      transition={{ duration: 2, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-white">
                      <AnimatedCounter value={indiceCircularidad} decimals={0} suffix="%" duration={2} />
                    </div>
                    <div className="text-white/70 text-sm">Circularidad</div>
                  </div>
                </div>
              </div>

              {/* Métricas rápidas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center"
                >
                  <Recycle className="w-6 h-6 text-white/80 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">68%</div>
                  <div className="text-white/70 text-xs">Residuos</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center"
                >
                  <Zap className="w-6 h-6 text-white/80 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">75%</div>
                  <div className="text-white/70 text-xs">Energía</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center"
                >
                  <Droplets className="w-6 h-6 text-white/80 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">82%</div>
                  <div className="text-white/70 text-xs">Agua</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center"
                >
                  <Target className="w-6 h-6 text-white/80 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">85%</div>
                  <div className="text-white/70 text-xs">Meta 2026</div>
                </motion.div>
              </div>

              {/* Progreso hacia meta */}
              <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80 text-sm">Progreso hacia meta 2026</span>
                  <span className="text-white font-bold">{((indiceCircularidad / 85) * 100).toFixed(0)}%</span>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(indiceCircularidad / 85) * 100}%` }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-white to-emerald-200 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tarjetas de fortaleza/oportunidad/tendencia */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Fortaleza</div>
                  <div className="text-xl font-bold text-emerald-700">{mejorCategoria.subject}</div>
                </div>
              </div>
              <div className="text-3xl font-bold text-emerald-600 mb-1">{mejorCategoria.score}%</div>
              <div className="text-sm text-gray-600">{mejorCategoria.description}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Oportunidad</div>
                  <div className="text-xl font-bold text-amber-700">{categoriaAMejorar.subject}</div>
                </div>
              </div>
              <div className="text-3xl font-bold text-amber-600 mb-1">{categoriaAMejorar.score}%</div>
              <div className="text-sm text-gray-600">{categoriaAMejorar.description}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Tendencia</div>
                  <div className="text-xl font-bold text-blue-700">Positiva</div>
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-1">+14%</div>
              <div className="text-sm text-gray-600">Mejora en últimos 6 meses</div>
            </motion.div>
          </div>

          {/* Métricas por categoría */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {circularityMetrics.map((metric, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{metric.subject}</h3>
                    <p className="text-xs text-gray-500">{metric.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{metric.score}%</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      metric.score >= 80 ? 'bg-green-500' :
                      metric.score >= 60 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${metric.score}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Análisis detallado */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-anton text-gray-800 mb-6 uppercase tracking-wide">
              Análisis de Circularidad
            </h2>
            
            <Tabs defaultValue="radar" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="radar">Vista Integral</TabsTrigger>
                <TabsTrigger value="trends">Tendencias</TabsTrigger>
                <TabsTrigger value="materials">Flujo de Materiales</TabsTrigger>
                <TabsTrigger value="actions">Plan de Acción</TabsTrigger>
              </TabsList>
              
              <TabsContent value="radar">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={circularityMetrics}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                        <Radar
                          name="Puntuación Actual"
                          dataKey="score"
                          stroke="#22c55e"
                          fill="#22c55e"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Interpretación del Índice</h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                        <div className="font-medium text-green-800 mb-1">Excelente (80-100%)</div>
                        <div className="text-sm text-green-700">Liderazgo en sostenibilidad, modelo a seguir</div>
                        <div className="text-xs text-green-600 mt-1">• Agua: {circularityMetrics.find(m => m.subject === 'Agua')?.score}%</div>
                      </div>
                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                        <div className="font-medium text-yellow-800 mb-1">Avanzado (60-79%)</div>
                        <div className="text-sm text-yellow-700">Buen desempeño, oportunidades de mejora</div>
                        <div className="text-xs text-yellow-600 mt-1">• Energía: {circularityMetrics.find(m => m.subject === 'Energía')?.score}% • Residuos: {circularityMetrics.find(m => m.subject === 'Residuos')?.score}%</div>
                      </div>
                      <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                        <div className="font-medium text-red-800 mb-1">En Desarrollo (&lt;60%)</div>
                        <div className="text-sm text-red-700">Requiere atención prioritaria</div>
                        <div className="text-xs text-red-600 mt-1">• Materiales: {circularityMetrics.find(m => m.subject === 'Materiales')?.score}% • Movilidad: {circularityMetrics.find(m => m.subject === 'Movilidad')?.score}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="trends">
                <div className="h-[400px] mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyProgress}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                      <XAxis dataKey="month" fontSize={12} stroke="#6b7280" />
                      <YAxis fontSize={12} stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '2px solid #273949',
                          borderRadius: '12px',
                          fontSize: '13px',
                          fontWeight: '500',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="circularidad" fill="#8b5cf6" name="Índice General" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="residuos" fill="#b5e951" name="Residuos" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="energia" fill="#f59e0b" name="Energía" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="agua" fill="#06b6d4" name="Agua" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-100">
                  <h3 className="font-medium text-gray-900 mb-4">Proyección 2025-2026</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-purple-600">78%</div>
                      <div className="text-sm text-gray-600">Diciembre 2025</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-green-600">85%</div>
                      <div className="text-sm text-gray-600">Meta 2026</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-blue-600">+13%</div>
                      <div className="text-sm text-gray-600">Mejora proyectada</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="materials">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={impactData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {impactData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Flujos de Material</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Materiales Reciclados</span>
                        <span className="text-sm font-bold text-green-600">34 ton/año</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Compost Generado</span>
                        <span className="text-sm font-bold text-blue-600">68 ton/año</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Agua Reciclada</span>
                        <span className="text-sm font-bold text-purple-600">85 ML/año</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Energía Renovable</span>
                        <span className="text-sm font-bold text-yellow-600">102 MWh/año</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="actions">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                      <h3 className="font-anton text-lg text-red-800 mb-4 uppercase tracking-wide">
                        Acciones Prioritarias
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                          <div>
                            <div className="font-medium">Programa de Movilidad Sustentable</div>
                            <div className="text-gray-600">Implementar bicicletas eléctricas y transporte compartido</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                          <div>
                            <div className="font-medium">Compras Circulares</div>
                            <div className="text-gray-600">Política de adquisiciones con criterios de circularidad</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                          <div>
                            <div className="font-medium">Biodiversidad Nativa</div>
                            <div className="text-gray-600">Restauración de ecosistemas con especies autóctonas</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                      <h3 className="font-anton text-lg text-green-800 mb-4 uppercase tracking-wide">
                        Oportunidades de Mejora
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <div className="font-medium">Optimización Energética</div>
                            <div className="text-gray-600">Aumentar capacidad solar a 250 kW</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <div className="font-medium">Zero Waste Avanzado</div>
                            <div className="text-gray-600">Alcanzar 90% de desviación para TRUE certification</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <div className="font-medium">Economía del Agua</div>
                            <div className="text-gray-600">Implementar sistemas de reutilización avanzados</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="font-anton text-lg text-gray-800 mb-4 uppercase tracking-wide">
                      Cronograma de Implementación 2025-2026
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="bg-white p-4 rounded-lg">
                        <div className="font-medium text-blue-600 mb-2">Q3 2025</div>
                        <div className="space-y-1 text-xs">
                          <div>• Movilidad sustentable</div>
                          <div>• Compras circulares</div>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <div className="font-medium text-green-600 mb-2">Q4 2025</div>
                        <div className="space-y-1 text-xs">
                          <div>• Ampliación solar</div>
                          <div>• Biodiversidad nativa</div>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <div className="font-medium text-purple-600 mb-2">Q1 2026</div>
                        <div className="space-y-1 text-xs">
                          <div>• Certificación TRUE</div>
                          <div>• Agua circular avanzada</div>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <div className="font-medium text-orange-600 mb-2">Q2 2026</div>
                        <div className="space-y-1 text-xs">
                          <div>• Índice 85%</div>
                          <div>• Certificación integral</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}