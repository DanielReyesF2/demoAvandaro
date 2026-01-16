import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { WasteFlowVisualization } from '@/components/dashboard/WasteFlowVisualization';
import { HeroMetrics } from '@/components/dashboard/HeroMetrics';
import { ImpactEquivalences } from '@/components/dashboard/ImpactEquivalences';
import { AIInsights } from '@/components/dashboard/AIInsights';
import { GlassCard } from '@/components/ui/glass-card';
import { generateMonthlyWasteData, IMPACT_EQUIVALENCES } from '@/lib/avandaroData';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
} from 'recharts';
import {
  Calendar,
  TrendingUp,
  Award,
  Leaf,
  Target,
} from 'lucide-react';

// Types for the Excel data
interface MonthData {
  month: { id: number; year: number; month: number; label: string };
  recycling: Array<{ material: string; kg: number }>;
  compost: Array<{ category: string; kg: number }>;
  reuse: Array<{ category: string; kg: number }>;
  landfill: Array<{ wasteType: string; kg: number }>;
}

interface WasteExcelData {
  year: number;
  months: MonthData[];
  materials: {
    recycling: readonly string[];
    compost: readonly string[];
    reuse: readonly string[];
    landfill: readonly string[];
  };
}

export default function Dashboard() {
  const currentYear = 2025;

  // Obtener datos de la tabla de trazabilidad (FUENTE DE VERDAD)
  const { data: wasteExcelData, isLoading } = useQuery<WasteExcelData>({
    queryKey: ['/api/waste-excel', currentYear],
    queryFn: async () => {
      const response = await fetch(`/api/waste-excel/${currentYear}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      return response.json();
    },
    refetchOnWindowFocus: false,
  });

  // Calcular totales de cada sección
  const calculateSectionTotals = () => {
    if (!wasteExcelData) {
      // Si no hay datos, usar datos realistas de Avandaro
      const monthlyWasteData = generateMonthlyWasteData(currentYear);
      return monthlyWasteData.reduce((acc, month) => ({
        recyclingTotal: acc.recyclingTotal + month.recyclable,
        compostTotal: acc.compostTotal + month.organic,
        reuseTotal: acc.reuseTotal + month.reuse,
        landfillTotal: acc.landfillTotal + month.landfill,
      }), { recyclingTotal: 0, compostTotal: 0, reuseTotal: 0, landfillTotal: 0 });
    }

    let recyclingTotal = 0;
    let compostTotal = 0;
    let reuseTotal = 0;
    let landfillTotal = 0;

    wasteExcelData.months.forEach(monthData => {
      monthData.recycling.forEach(entry => {
        recyclingTotal += entry.kg;
      });
      monthData.compost.forEach(entry => {
        compostTotal += entry.kg;
      });
      monthData.reuse.forEach(entry => {
        reuseTotal += entry.kg;
      });
      monthData.landfill.forEach(entry => {
        landfillTotal += entry.kg;
      });
    });

    return { recyclingTotal, compostTotal, reuseTotal, landfillTotal };
  };

  // Calcular KPIs
  const calculateRealTimeKPIs = () => {
    const totals = calculateSectionTotals();
    const totalCircular = totals.recyclingTotal + totals.compostTotal + totals.reuseTotal;
    const totalLandfill = totals.landfillTotal;
    const totalWeight = totalCircular + totalLandfill;
    const deviationPercentage = totalWeight > 0 ? (totalCircular / totalWeight) * 100 : 0;

    return {
      totalCircular,
      totalLandfill,
      totalWeight,
      deviationPercentage
    };
  };

  const realTimeKPIs = calculateRealTimeKPIs();

  // Datos calculados en tiempo real
  const processedData = {
    wasteDeviation: realTimeKPIs.deviationPercentage,
    energyRenewable: 29.1,
    waterRecycled: 28.9,
    circularityIndex: 72
  };

  // Calcular impacto ambiental con datos reales
  const totalWasteDiverted = realTimeKPIs.totalCircular / 1000; // kg a toneladas

  // Datos de impacto ambiental basados en residuos desviados
  const co2Avoided = realTimeKPIs.totalCircular * 0.5; // ~0.5 kg CO2 por kg reciclado
  const waterSaved = realTimeKPIs.totalCircular * 5.5; // ~5.5 L agua por kg reciclado
  const energySaved = realTimeKPIs.totalCircular * 1.2; // ~1.2 kWh por kg reciclado
  const treesEquivalent = Math.round(co2Avoided / 21); // ~21 kg CO2 por árbol/año

  // Datos para gráfico mensual
  const monthlyData = wasteExcelData?.months.map(month => ({
    month: month.month.label,
    recycling: month.recycling.reduce((sum, e) => sum + e.kg, 0),
    compost: month.compost.reduce((sum, e) => sum + e.kg, 0),
    reuse: month.reuse.reduce((sum, e) => sum + e.kg, 0),
    landfill: month.landfill.reduce((sum, e) => sum + e.kg, 0),
    total: month.recycling.reduce((sum, e) => sum + e.kg, 0) +
           month.compost.reduce((sum, e) => sum + e.kg, 0) +
           month.reuse.reduce((sum, e) => sum + e.kg, 0) +
           month.landfill.reduce((sum, e) => sum + e.kg, 0),
  })) || generateMonthlyWasteData(currentYear).map(month => ({
    month: month.month,
    recycling: month.recyclable,
    compost: month.organic,
    reuse: month.reuse,
    landfill: month.landfill,
    total: month.total,
  }));

  // Calcular tasa de desviación por mes para gráfico de tendencia
  const trendData = monthlyData.map(month => {
    const circular = month.recycling + month.compost + month.reuse;
    const total = circular + month.landfill;
    return {
      month: month.month,
      desviacion: total > 0 ? ((circular / total) * 100).toFixed(1) : 0,
    };
  });

  // Loading state con animación
  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full"
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Hero Section con métricas principales */}
          <HeroMetrics
            deviationRate={processedData.wasteDeviation}
            energyRenewable={processedData.energyRenewable}
            waterRecycled={processedData.waterRecycled}
            circularityIndex={processedData.circularityIndex}
            totalWasteDiverted={totalWasteDiverted}
          />

          {/* Sección de Impacto Ambiental con Equivalencias */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ImpactEquivalences
              co2Avoided={co2Avoided}
              waterSaved={waterSaved}
              energySaved={energySaved}
              wasteDeviated={realTimeKPIs.totalCircular}
            />
          </motion.div>

          {/* Grid de dos columnas: Insights IA + Tendencias */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <AIInsights
                deviationRate={processedData.wasteDeviation}
                monthlyData={monthlyData}
              />
            </motion.div>

            {/* Gráfico de Tendencia de Desviación */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GlassCard variant="default" hover={false} className="h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Tendencia de Desviación</h3>
                      <p className="text-sm text-gray-500">Evolución mensual 2025</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                    <Target className="w-4 h-4" />
                    <span>Meta: 90%</span>
                  </div>
                </div>

                <div style={{ height: '280px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorDesviacion" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} domain={[0, 100]} unit="%" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                        formatter={(value: any) => [`${value}%`, 'Desviación']}
                      />
                      <Area
                        type="monotone"
                        dataKey="desviacion"
                        stroke="#10b981"
                        strokeWidth={3}
                        fill="url(#colorDesviacion)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Flujos Dinámicos de Residuos - Sankey */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <WasteFlowVisualization totalWasteDiverted={totalWasteDiverted} />
          </motion.div>

          {/* Gráfico de Composición Mensual */}
          {monthlyData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <GlassCard variant="default" hover={false}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Composición por Mes</h3>
                      <p className="text-sm text-gray-500">Desglose de residuos por categoría</p>
                    </div>
                  </div>

                  {/* Leyenda */}
                  <div className="hidden md:flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-teal-500" />
                      <span className="text-gray-600">Reciclaje</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-gray-600">Composta</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-violet-500" />
                      <span className="text-gray-600">Reuso</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-400" />
                      <span className="text-gray-600">Relleno</span>
                    </div>
                  </div>
                </div>

                <div style={{ height: '350px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} barCategoryGap="15%">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                        formatter={(value: any) => [`${value.toLocaleString()} kg`, '']}
                      />
                      <Bar
                        dataKey="recycling"
                        fill="#14b8a6"
                        radius={[4, 4, 0, 0]}
                        stackId="a"
                        name="Reciclaje"
                      />
                      <Bar
                        dataKey="compost"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                        stackId="a"
                        name="Composta"
                      />
                      <Bar
                        dataKey="reuse"
                        fill="#8b5cf6"
                        radius={[4, 4, 0, 0]}
                        stackId="a"
                        name="Reuso"
                      />
                      <Bar
                        dataKey="landfill"
                        fill="#9ca3af"
                        radius={[4, 4, 0, 0]}
                        stackId="a"
                        name="Relleno"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Footer con certificaciones */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-8 py-6 border-t border-gray-200"
          >
            <div className="flex items-center gap-2 text-gray-500">
              <Award className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium">Certificación TRUE en progreso</span>
            </div>
            <div className="h-4 w-px bg-gray-300" />
            <div className="flex items-center gap-2 text-gray-500">
              <Leaf className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-medium">Compromiso Sustentable 2025</span>
            </div>
          </motion.div>

        </div>
      </div>
    </AppLayout>
  );
}
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Trash2 className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Generado</p>
                <h3 className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {totalGenerado.toFixed(1)}
                </h3>
                <p className="text-sm text-gray-600">toneladas este mes</p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 p-6 hover:shadow-xl hover:shadow-emerald-200/50 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300 animate-pulse-glow">
                  <Recycle className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Reciclables</p>
                <h3 className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                  {totalReciclables.toFixed(1)}
                </h3>
                <p className="text-sm text-gray-600">toneladas procesadas</p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-50 to-white border border-orange-200 p-6 hover:shadow-xl hover:shadow-orange-200/50 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Costo Gestión</p>
                <h3 className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                  ${(costoTotalGestion / 1000).toFixed(0)}K
                </h3>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <span className={variacionGestion < 0 ? "text-green-600" : "text-red-600"}>
                    {variacionGestion > 0 ? '+' : ''}{variacionGestion}%
                  </span>
                  <span className="text-gray-500">vs mes anterior</span>
                </p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-white border border-green-200 p-6 hover:shadow-xl hover:shadow-green-200/50 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Ingresos Reciclables</p>
                <h3 className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                  ${(ingresosReciclables / 1000).toFixed(0)}K
                </h3>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <span className="text-green-600 font-semibold">
                    +{variacionIngresos}%
                  </span>
                  <span className="text-gray-500">vs mes anterior</span>
                </p>
              </div>
            </div>
          </div>

          {/* Métricas Ejecutivas Secundarias - Agua y Operaciones CON WOW FACTOR */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 p-6 hover:shadow-xl hover:shadow-cyan-200/50 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Droplets className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Agua Tratada</p>
                <h3 className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-cyan-600 transition-colors">
                  {(aguaTratadaMes / 1000).toFixed(1)}K
                </h3>
                <p className="text-sm text-gray-600">m³ este mes</p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-6 hover:shadow-xl hover:shadow-amber-200/50 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pipas Compradas</p>
                <h3 className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-amber-600 transition-colors">
                  {pipasCompradasMes}
                </h3>
                <p className="text-sm text-gray-600">unidades este mes</p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 p-6 hover:shadow-xl hover:shadow-rose-200/50 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Costo Pipas</p>
                <h3 className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-rose-600 transition-colors">
                  ${(costoPipasMes / 1000).toFixed(0)}K
                </h3>
                <p className="text-sm text-gray-600">{pipasCompradasMes} pipas × ${(costoPipasMes / pipasCompradasMes).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Resumen Financiero Consolidado - CON WOW FACTOR */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 rounded-2xl p-8 shadow-premium-xl border border-blue-200/50 animate-slide-up">
            {/* Efecto de brillo animado */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none" />
            
            {/* Decoración de fondo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-200/20 rounded-full blur-3xl translate-y-24 -translate-x-24" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
                    Resumen Financiero
                  </h2>
                  <p className="text-gray-600 text-sm ml-3">Balance operativo mensual</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1 animate-pulse-glow">
                    ${((ingresosReciclables - costoTotalGestion - costoPipasMes) / 1000).toFixed(1)}K
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Balance Neto</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group relative bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-green-200/50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-600 text-sm font-medium">Ingresos</span>
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-green-600 mb-1">${(ingresosReciclables / 1000).toFixed(1)}K</div>
                    <div className="text-xs text-gray-500">Por reciclables vendidos</div>
                  </div>
                </div>
                
                <div className="group relative bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-red-200/50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-600 text-sm font-medium">Costos Gestión</span>
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <TrendingDown className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-red-500 mb-1">-${(costoTotalGestion / 1000).toFixed(1)}K</div>
                    <div className="text-xs text-gray-500">Procesamiento y tratamiento</div>
                  </div>
                </div>
                
                <div className="group relative bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200/50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-600 text-sm font-medium">Costo Pipas</span>
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-orange-500 mb-1">-${(costoPipasMes / 1000).toFixed(1)}K</div>
                    <div className="text-xs text-gray-500">Abastecimiento de agua</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Impacto Ambiental - Equivalencias Reales CON WOW FACTOR */}
          <div className="relative bg-white rounded-xl p-8 shadow-premium-xl border border-subtle animate-slide-up overflow-hidden">
            {/* Decoración de fondo sutil */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-100/30 via-blue-100/20 to-purple-100/30 rounded-full blur-3xl -translate-y-48 translate-x-48" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-10 bg-gradient-to-b from-green-500 via-blue-500 to-purple-500 rounded-full" />
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                    Impacto Ambiental
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Equivalencias reales de tu impacto</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="group relative text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50 hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Activity className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                      {(impact.co2Avoided / 1000).toFixed(1)} ton
                    </div>
                    <div className="text-sm font-semibold text-gray-700 mb-1">CO₂ evitado</div>
                    <div className="text-xs text-gray-500">≈ {impact.carsOffRoad} autos menos</div>
                  </div>
                </div>
                
                <div className="group relative text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200/50 hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Droplets className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                      {(impact.waterSaved / 1000000).toFixed(1)}M L
                    </div>
                    <div className="text-sm font-semibold text-gray-700 mb-1">Agua ahorrada</div>
                    <div className="text-xs text-gray-500">≈ {impact.swimmingPools} albercas</div>
                  </div>
                </div>
                
                <div className="group relative text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200/50 hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-2">
                      {(impact.energySaved / 1000).toFixed(1)}M kWh
                    </div>
                    <div className="text-sm font-semibold text-gray-700 mb-1">Energía ahorrada</div>
                    <div className="text-xs text-gray-500">≈ {impact.homesPowered} casas/año</div>
                  </div>
                </div>
                
                <div className="group relative text-center p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50 hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform animate-pulse-glow">
                      <RefreshCw className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                      {impact.treesSaved}
                    </div>
                    <div className="text-sm font-semibold text-gray-700 mb-1">Árboles salvados</div>
                    <div className="text-xs text-gray-500">Captura de CO₂</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gráfica de Flujo de Caja CON WOW FACTOR */}
          <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="bg-white rounded-xl p-8 shadow-premium-xl border border-subtle relative overflow-hidden">
              {/* Decoración de fondo */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-green-100/20 via-blue-100/20 to-transparent rounded-full blur-3xl -translate-y-36 translate-x-36" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full" />
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 tracking-tight">Flujo de Caja Mensual</h3>
                    <p className="text-sm text-gray-600 mt-1">Ingresos vs Costos de gestión y pipas</p>
                  </div>
                </div>
                
                <div style={{ height: '320px' }} className="mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={cashFlowData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gradientIngresos" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
                        </linearGradient>
                        <linearGradient id="gradientCostos" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0.2}/>
                        </linearGradient>
                        <linearGradient id="gradientBalance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        stroke="#6b7280" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#6b7280" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '2px solid #e5e7eb',
                          borderRadius: '12px',
                          padding: '16px',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
                          fontSize: '14px',
                          fontWeight: '500',
                        }}
                        formatter={(value: number) => [`$${(value / 1000).toFixed(1)}K`, '']}
                        cursor={{ fill: 'rgba(14, 184, 166, 0.1)' }}
                      />
                      <Bar dataKey="ingresos" fill="url(#gradientIngresos)" radius={[8, 8, 0, 0]} name="Ingresos" />
                      <Bar dataKey="costos" fill="url(#gradientCostos)" radius={[8, 8, 0, 0]} name="Costos" />
                      <Area
                        type="monotone"
                        dataKey="balance"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fill="url(#gradientBalance)"
                        dot={{ fill: '#3b82f6', r: 6, strokeWidth: 2, stroke: 'white' }}
                        activeDot={{ r: 8, strokeWidth: 3, stroke: 'white' }}
                        name="Balance"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Tendencias Operativas CON WOW FACTOR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="bg-white rounded-xl p-8 shadow-premium-xl border border-subtle relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/20 rounded-full blur-3xl -translate-y-32 translate-x-32 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Agua Tratada Mensual</h3>
                    <p className="text-sm text-gray-600 mt-1">m³ procesados por PTAR</p>
                  </div>
                </div>
                <div style={{ height: '280px' }} className="mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={financialData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gradientAgua" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        stroke="#6b7280" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#6b7280" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '2px solid #3b82f6',
                          borderRadius: '12px',
                          padding: '14px',
                          boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.2)',
                        }}
                        formatter={(value: number) => [`${value.toLocaleString()} m³`, '']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="agua" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        fill="url(#gradientAgua)"
                        dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: 'white' }}
                        activeDot={{ r: 7, strokeWidth: 3, stroke: 'white' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-premium-xl border border-subtle relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100/20 rounded-full blur-3xl -translate-y-32 translate-x-32 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Pipas Compradas Mensual</h3>
                    <p className="text-sm text-gray-600 mt-1">Unidades de abastecimiento</p>
                  </div>
                </div>
                <div style={{ height: '280px' }} className="mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={financialData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gradientPipas" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.4}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        stroke="#6b7280" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#6b7280" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '2px solid #f59e0b',
                          borderRadius: '12px',
                          padding: '14px',
                          boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.2)',
                        }}
                        cursor={{ fill: 'rgba(251, 191, 36, 0.1)' }}
                      />
                      <Bar dataKey="pipas" fill="url(#gradientPipas)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
