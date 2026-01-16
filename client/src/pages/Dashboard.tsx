import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/layout/AppLayout';
import { MetricCard } from '@/components/ui/metric-card';
import { ChartCard } from '@/components/ui/chart-card';
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
  Trash2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Droplets,
  Package,
  Recycle,
  Activity,
  Zap,
  RefreshCw,
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

  // Usar datos realistas de Avandaro
  const monthlyWasteData = generateMonthlyWasteData(currentYear);
  
  // Calcular totales anuales
  const annualTotals = monthlyWasteData.reduce((acc, month) => ({
    total: acc.total + month.total,
    organic: acc.organic + month.organic,
    recyclable: acc.recyclable + month.recyclable,
    reuse: acc.reuse + month.reuse,
    landfill: acc.landfill + month.landfill,
    circular: acc.circular + month.circular,
  }), { total: 0, organic: 0, recyclable: 0, reuse: 0, landfill: 0, circular: 0 });

  // Calcular métricas ejecutivas
  const totalGenerado = annualTotals.total / 1000; // toneladas
  const totalReciclables = annualTotals.circular / 1000; // toneladas
  const deviationPercentage = (annualTotals.circular / annualTotals.total) * 100;
  
  // Costos y finanzas (datos realistas para Avandaro)
  const costoTotalGestion = 485000; // Pesos al mes
  const ingresosReciclables = 145000; // Pesos al mes
  const aguaTratadaMes = 12400; // m³ tratados este mes
  const pipasCompradasMes = 18; // Número de pipas compradas
  const costoPipasMes = 324000; // Costo total de pipas este mes
  
  // Tendencias vs mes anterior
  const variacionGestion = -5.2; // % vs mes anterior
  const variacionIngresos = +12.5; // % vs mes anterior
  
  // Impacto ambiental
  const impact = IMPACT_EQUIVALENCES.getEquivalences(annualTotals.circular);
  
  // Datos financieros mensuales
  const financialData = [
    { month: 'Ene', gestion: 520000, ingresos: 128000, pipas: 20, agua: 12800 },
    { month: 'Feb', gestion: 495000, ingresos: 132000, pipas: 19, agua: 11900 },
    { month: 'Mar', gestion: 505000, ingresos: 138000, pipas: 21, agua: 13500 },
    { month: 'Abr', gestion: 490000, ingresos: 140000, pipas: 18, agua: 14200 },
    { month: 'May', gestion: 485000, ingresos: 145000, pipas: 18, agua: 15800 },
    { month: 'Jun', gestion: 488000, ingresos: 148000, pipas: 17, agua: 17300 },
  ];
  
  // Datos para gráfico de flujo financiero
  const cashFlowData = financialData.map(month => ({
    month: month.month,
    costos: month.gestion + (month.pipas * 18000),
    ingresos: month.ingresos,
    balance: month.ingresos - (month.gestion + (month.pipas * 18000)),
  }));
  
  // Datos mensuales para gráficas
  const monthlyData = monthlyWasteData.map(month => ({
    month: month.month,
    recycling: month.recyclable,
    compost: month.organic,
    reuse: month.reuse,
    landfill: month.landfill,
    total: month.total,
  }));

  return (
    <AppLayout>
      <div className="p-8 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
          {/* Métricas Ejecutivas Principales - Residuos con WOW Factor */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 p-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
