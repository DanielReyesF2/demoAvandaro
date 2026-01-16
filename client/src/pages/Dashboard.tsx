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
  DollarSign,
  TrendingDown,
  AlertTriangle,
  Recycle,
  Trash2,
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
  const totals = calculateSectionTotals();

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

  // ===== INDICADORES FINANCIEROS DE MANEJO DE RESIDUOS =====
  // Factores de costo y precio (MXN)
  const COSTO_RELLENO_SANITARIO = 850; // $/tonelada
  const PRECIO_RECICLABLES = 3500; // $/tonelada (promedio de materiales reciclables)
  const PRECIO_COMPOSTA = 1200; // $/tonelada
  const PRECIO_REUSO = 2500; // $/tonelada
  const COSTO_GESTION_TOTAL = 450; // $/tonelada (procesamiento, transporte, etc.)
  const TASA_RECHAZO_CONTAMINACION = 0.08; // 8% de reciclables rechazados por contaminación

  // Cálculos financieros
  const totalGeneradoTon = realTimeKPIs.totalWeight / 1000;
  const totalRellenoTon = realTimeKPIs.totalLandfill / 1000;
  const totalReciclablesTon = totals.recyclingTotal / 1000;
  const totalCompostaTon = totals.compostTotal / 1000;
  const totalReusoTon = totals.reuseTotal / 1000;

  // Costos
  const costoRellenoSanitario = totalRellenoTon * COSTO_RELLENO_SANITARIO;
  const costoGestionTotal = totalGeneradoTon * COSTO_GESTION_TOTAL;
  const costoTotalManejo = costoRellenoSanitario + costoGestionTotal;

  // Ingresos
  const ingresosReciclables = totalReciclablesTon * PRECIO_RECICLABLES;
  const ingresosComposta = totalCompostaTon * PRECIO_COMPOSTA;
  const ingresosReuso = totalReusoTon * PRECIO_REUSO;
  const ingresosTotales = ingresosReciclables + ingresosComposta + ingresosReuso;

  // Ingresos posibles (si todo se vendiera)
  const ingresosPosiblesReciclables = totalReciclablesTon * PRECIO_RECICLABLES;
  const ingresosPosiblesComposta = totalCompostaTon * PRECIO_COMPOSTA;
  const ingresosPosiblesReuso = totalReusoTon * PRECIO_REUSO;
  const ingresosPosiblesTotales = ingresosPosiblesReciclables + ingresosPosiblesComposta + ingresosPosiblesReuso;

  // Ingresos perdidos por contaminación
  const reciclablesRechazadosTon = totalReciclablesTon * TASA_RECHAZO_CONTAMINACION;
  const ingresosPerdidosContaminacion = reciclablesRechazadosTon * PRECIO_RECICLABLES;

  // Balance neto
  const balanceNeto = ingresosTotales - costoTotalManejo;

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

          {/* Indicadores Financieros de Manejo de Residuos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard variant="default" hover={false}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Análisis Financiero</h3>
                  <p className="text-sm text-gray-500">Lo que gastas vs. lo que ganas</p>
                </div>
              </div>

              {/* Comparación Principal: Gastas vs. Dinero en la Basura */}
              <div className="mb-8 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 rounded-2xl p-6 border border-red-200/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Lo que gastas */}
                  <div className="bg-white rounded-xl p-6 border-2 border-red-200 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center">
                        <TrendingDown className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Lo que gastas</h4>
                        <p className="text-xs text-gray-500">En manejo de residuos</p>
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-red-600 mb-2">
                      ${(costoTotalManejo / 1000).toFixed(1)}K
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Gestión total:</span>
                        <span className="font-medium">${(costoGestionTotal / 1000).toFixed(1)}K</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Relleno sanitario:</span>
                        <span className="font-medium">${(costoRellenoSanitario / 1000).toFixed(1)}K</span>
                      </div>
                    </div>
                  </div>

                  {/* Dinero en la basura */}
                  <div className="bg-white rounded-xl p-6 border-2 border-orange-200 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center">
                        <Trash2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Dinero en la basura</h4>
                        <p className="text-xs text-gray-500">Lo que podrías ganar</p>
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-orange-600 mb-2">
                      ${((totalRellenoTon * PRECIO_RECICLABLES) / 1000).toFixed(1)}K
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="mb-2">Si lo que va al relleno se reciclara:</div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>{totalRellenoTon.toFixed(1)} ton:</span>
                          <span className="font-medium">× ${PRECIO_RECICLABLES}/ton</span>
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-amber-700 font-medium">
                          💡 Opción de ingresos perdida
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Diferencia visual */}
                <div className="mt-6 pt-6 border-t border-red-300/50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold">Diferencia:</span> Lo que podrías ganar menos lo que gastas
                    </div>
                    <div className="text-2xl font-bold text-amber-600">
                      ${(((totalRellenoTon * PRECIO_RECICLABLES) - costoTotalManejo) / 1000).toFixed(1)}K
                    </div>
                  </div>
                </div>
              </div>

              {/* Métricas secundarias simplificadas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Ingresos actuales */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200/50">
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Ingresos actuales</div>
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    ${(ingresosTotales / 1000).toFixed(1)}K
                  </div>
                  <div className="text-xs text-gray-600">Por reciclables vendidos</div>
                </div>

                {/* Perdidos por contaminación */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200/50">
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Rechazados</div>
                  <div className="text-3xl font-bold text-amber-600 mb-1">
                    ${(ingresosPerdidosContaminacion / 1000).toFixed(1)}K
                  </div>
                  <div className="text-xs text-gray-600">Por contaminación (8%)</div>
                </div>

                {/* Balance neto */}
                <div className={`rounded-xl p-5 border ${
                  balanceNeto >= 0 
                    ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200/50' 
                    : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200/50'
                }`}>
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Balance neto</div>
                  <div className={`text-3xl font-bold mb-1 ${
                    balanceNeto >= 0 ? 'text-blue-600' : 'text-red-600'
                  }`}>
                    ${(balanceNeto / 1000).toFixed(1)}K
                  </div>
                  <div className="text-xs text-gray-600">Ganancias - Costos</div>
                </div>
              </div>
            </GlassCard>
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
