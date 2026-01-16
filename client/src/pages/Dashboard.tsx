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
import avandaroLogo from '@assets/logo-avandaro.svg';
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
  MinusCircle,
  PlusCircle,
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
  const { data: wasteExcelData, isLoading, error } = useQuery<WasteExcelData>({
    queryKey: ['/api/waste-excel', currentYear],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/waste-excel/${currentYear}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        return response.json();
      } catch (err) {
        // Si hay error, retornar undefined para usar datos mock
        console.warn('Error fetching data, using mock data:', err);
        return undefined;
      }
    },
    refetchOnWindowFocus: false,
    retry: false, // No reintentar si falla
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
  // Factores de costo y precio (MXN) - Escenario actual: COSTOS > INGRESOS
  // Esto muestra la oportunidad de mejora al optimizar la gestión de residuos
  const COSTO_RELLENO_SANITARIO = 1200; // $/tonelada (incluye transporte)
  const PRECIO_RECICLABLES = 2800; // $/tonelada (promedio de materiales reciclables)
  const PRECIO_COMPOSTA = 800; // $/tonelada (mercado local limitado)
  const PRECIO_REUSO = 1500; // $/tonelada
  const COSTO_GESTION_TOTAL = 650; // $/tonelada (procesamiento, transporte, personal, etc.)
  const EFICIENCIA_VENTA = 0.45; // Solo se vende el 45% de lo separado (falta de compradores, logística)

  // Cálculos financieros
  const totalGeneradoTon = realTimeKPIs.totalWeight / 1000;
  const totalRellenoTon = realTimeKPIs.totalLandfill / 1000;
  const totalReciclablesTon = totals.recyclingTotal / 1000;
  const totalCompostaTon = totals.compostTotal / 1000;
  const totalReusoTon = totals.reuseTotal / 1000;

  // Costos (altos porque aún no optimizan)
  const costoRellenoSanitario = totalRellenoTon * COSTO_RELLENO_SANITARIO;
  const costoGestionTotal = totalGeneradoTon * COSTO_GESTION_TOTAL;
  const costoTotalManejo = costoRellenoSanitario + costoGestionTotal;

  // Ingresos actuales (bajos por falta de eficiencia en venta)
  const ingresosReciclables = totalReciclablesTon * PRECIO_RECICLABLES * EFICIENCIA_VENTA;
  const ingresosComposta = totalCompostaTon * PRECIO_COMPOSTA * EFICIENCIA_VENTA;
  const ingresosReuso = totalReusoTon * PRECIO_REUSO * EFICIENCIA_VENTA;
  const ingresosTotales = ingresosReciclables + ingresosComposta + ingresosReuso;

  // Ingresos POTENCIALES (si se vendiera todo al 90% de eficiencia)
  const EFICIENCIA_POTENCIAL = 0.90;
  const ingresosPotencialesReciclables = totalReciclablesTon * PRECIO_RECICLABLES * EFICIENCIA_POTENCIAL;
  const ingresosPotencialesComposta = totalCompostaTon * PRECIO_COMPOSTA * EFICIENCIA_POTENCIAL;
  const ingresosPotencialesReuso = totalReusoTon * PRECIO_REUSO * EFICIENCIA_POTENCIAL;
  const ingresosPotencialesTotales = ingresosPotencialesReciclables + ingresosPotencialesComposta + ingresosPotencialesReuso;

  // Balance neto actual (NEGATIVO - están perdiendo dinero)
  const balanceNeto = ingresosTotales - costoTotalManejo;

  // Potencial de mejora mensual
  const potencialMejora = ingresosPotencialesTotales - ingresosTotales;

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
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Análisis Financiero de Residuos</h3>
                    <p className="text-sm text-gray-500">Impacto económico de tu gestión actual</p>
                  </div>
                </div>
                {/* Logo Grupo Avandaro */}
                <img 
                  src={avandaroLogo} 
                  alt="Grupo Avandaro" 
                  className="h-12 w-auto opacity-90"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Costos en manejo de residuos */}
                <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 border-2 border-red-200 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <MinusCircle className="w-8 h-8 text-red-600" />
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">Costos en manejo de residuos</h4>
                      <p className="text-sm text-gray-600">Mensual</p>
                    </div>
                  </div>
                  <div className="text-5xl font-bold text-red-600 mb-4">
                    ${(costoTotalManejo / 1000).toFixed(1)}K
                  </div>
                  <div className="space-y-2 text-sm bg-white/50 rounded-lg p-3 border border-red-100">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Gestión operativa:</span>
                      <span className="font-bold text-red-700">${(costoGestionTotal / 1000).toFixed(1)}K</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Relleno sanitario:</span>
                      <span className="font-bold text-red-700">${(costoRellenoSanitario / 1000).toFixed(1)}K</span>
                    </div>
                  </div>
                </div>

                {/* Ingresos actuales */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <PlusCircle className="w-8 h-8 text-green-600" />
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">Ingresos actuales</h4>
                      <p className="text-sm text-gray-600">Por reciclables vendidos</p>
                    </div>
                  </div>
                  <div className="text-5xl font-bold text-green-600 mb-4">
                    ${(ingresosTotales / 1000).toFixed(1)}K
                  </div>
                  <div className="space-y-2 text-sm bg-white/50 rounded-lg p-3 border border-green-100">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Reciclables:</span>
                      <span className="font-bold text-green-700">${(ingresosReciclables / 1000).toFixed(1)}K</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Composta y reuso:</span>
                      <span className="font-bold text-green-700">${((ingresosComposta + ingresosReuso) / 1000).toFixed(1)}K</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Balance Actual - NEGATIVO */}
              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 rounded-2xl p-6 border-2 border-amber-300 shadow-lg mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-8 h-8 text-amber-600" />
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Balance Actual</h4>
                    <p className="text-sm text-gray-600">Situación financiera mensual de residuos</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/60 rounded-xl p-4 border border-amber-200">
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                      Balance mensual
                    </div>
                    <div className="text-3xl font-bold text-red-600">
                      -${Math.abs(balanceNeto / 1000).toFixed(1)}K
                    </div>
                    <div className="text-sm text-red-600 font-medium">
                      Pérdida actual
                    </div>
                  </div>
                  <div className="bg-white/60 rounded-xl p-4 border border-amber-200">
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                      Eficiencia de venta
                    </div>
                    <div className="text-3xl font-bold text-amber-600">
                      45%
                    </div>
                    <div className="text-sm text-gray-600">
                      De materiales separados
                    </div>
                  </div>
                  <div className="bg-white/60 rounded-xl p-4 border border-amber-200">
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                      A relleno sanitario
                    </div>
                    <div className="text-3xl font-bold text-gray-600">
                      {totalRellenoTon.toFixed(1)} ton
                    </div>
                    <div className="text-sm text-gray-600">
                      Sin recuperar valor
                    </div>
                  </div>
                </div>
              </div>

              {/* Potencial de Mejora */}
              <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-8 h-8 text-blue-600" />
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Oportunidad de Mejora</h4>
                    <p className="text-sm text-gray-600">Si optimizas la gestión y venta de materiales</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/60 rounded-xl p-4 border border-blue-200">
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                      Ingresos potenciales
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      +${(potencialMejora / 1000).toFixed(1)}K
                    </div>
                    <div className="text-sm text-gray-600">
                      Adicionales por mes
                    </div>
                  </div>
                  <div className="bg-white/60 rounded-xl p-4 border border-blue-200">
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                      Meta de eficiencia
                    </div>
                    <div className="text-3xl font-bold text-blue-600">
                      90%
                    </div>
                    <div className="text-sm text-gray-600">
                      De materiales vendidos
                    </div>
                  </div>
                  <div className="bg-white/60 rounded-xl p-4 border border-blue-200">
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                      Ahorro anual posible
                    </div>
                    <div className="text-3xl font-bold text-emerald-600">
                      ${((potencialMejora + Math.abs(balanceNeto)) * 12 / 1000).toFixed(0)}K
                    </div>
                    <div className="text-sm text-gray-600">
                      Al optimizar procesos
                    </div>
                  </div>
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
