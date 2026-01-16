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
          {/* Métricas Ejecutivas Principales - Residuos */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card-hover">
              <MetricCard
                title="Total Generado"
                value={`${totalGenerado.toFixed(1)}`}
                subtitle="toneladas este mes"
                icon={<Trash2 className="w-5 h-5" />}
              />
            </div>
            <div className="card-hover">
              <MetricCard
                title="Total Reciclables"
                value={`${totalReciclables.toFixed(1)}`}
                subtitle="toneladas procesadas"
                icon={<Recycle className="w-5 h-5" />}
              />
            </div>
            <div className="card-hover">
              <MetricCard
                title="Costo Gestión"
                value={`$${(costoTotalGestion / 1000).toFixed(0)}K`}
                subtitle={`${variacionGestion > 0 ? '+' : ''}${variacionGestion}% vs mes anterior`}
                icon={<DollarSign className="w-5 h-5" />}
              />
            </div>
            <div className="card-hover">
              <MetricCard
                title="Ingresos Reciclables"
                value={`$${(ingresosReciclables / 1000).toFixed(0)}K`}
                subtitle={`${variacionIngresos > 0 ? '+' : ''}${variacionIngresos}% vs mes anterior`}
                icon={<TrendingUp className="w-5 h-5" />}
              />
            </div>
          </div>

          {/* Métricas Ejecutivas Secundarias - Agua y Operaciones */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card-hover">
              <MetricCard
                title="Agua Tratada"
                value={`${(aguaTratadaMes / 1000).toFixed(1)}K`}
                subtitle="m³ este mes"
                icon={<Droplets className="w-5 h-5" />}
              />
            </div>
            <div className="card-hover">
              <MetricCard
                title="Pipas Compradas"
                value={`${pipasCompradasMes}`}
                subtitle="unidades este mes"
                icon={<Package className="w-5 h-5" />}
              />
            </div>
            <div className="card-hover">
              <MetricCard
                title="Costo Pipas"
                value={`$${(costoPipasMes / 1000).toFixed(0)}K`}
                subtitle={`${pipasCompradasMes} pipas × $${(costoPipasMes / pipasCompradasMes).toLocaleString()}`}
                icon={<Activity className="w-5 h-5" />}
              />
            </div>
          </div>

          {/* Resumen Financiero Consolidado - SIN FONDO OSCURO */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 shadow-premium-md border border-blue-100 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Resumen Financiero</h2>
                <p className="text-gray-600 text-sm">Balance operativo mensual</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  ${((ingresosReciclables - costoTotalGestion - costoPipasMes) / 1000).toFixed(1)}K
                </div>
                <div className="text-sm text-gray-600">Balance Neto</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border border-blue-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 text-sm">Ingresos</span>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-green-600 mb-1">${(ingresosReciclables / 1000).toFixed(1)}K</div>
                <div className="text-xs text-gray-500">Por reciclables vendidos</div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-blue-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 text-sm">Costos Gestión</span>
                  <TrendingDown className="w-5 h-5 text-red-500" />
                </div>
                <div className="text-2xl font-bold text-red-500 mb-1">-${(costoTotalGestion / 1000).toFixed(1)}K</div>
                <div className="text-xs text-gray-500">Procesamiento y tratamiento</div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-blue-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600 text-sm">Costo Pipas</span>
                  <Package className="w-5 h-5 text-orange-500" />
                </div>
                <div className="text-2xl font-bold text-orange-500 mb-1">-${(costoPipasMes / 1000).toFixed(1)}K</div>
                <div className="text-xs text-gray-500">Abastecimiento de agua</div>
              </div>
            </div>
          </div>

          {/* Impacto Ambiental - Equivalencias Reales */}
          <div className="bg-white rounded-xl p-8 shadow-premium-md border border-subtle animate-slide-up">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              Impacto Ambiental - Equivalencias
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {(impact.co2Avoided / 1000).toFixed(1)} ton
                </div>
                <div className="text-sm text-gray-600 mb-1">CO₂ evitado</div>
                <div className="text-xs text-gray-500">≈ {impact.carsOffRoad} autos menos en carretera</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {(impact.waterSaved / 1000000).toFixed(1)}M L
                </div>
                <div className="text-sm text-gray-600 mb-1">Agua ahorrada</div>
                <div className="text-xs text-gray-500">≈ {impact.swimmingPools} albercas olímpicas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {(impact.energySaved / 1000).toFixed(1)}M kWh
                </div>
                <div className="text-sm text-gray-600 mb-1">Energía ahorrada</div>
                <div className="text-xs text-gray-500">≈ {impact.homesPowered} casas por año</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  {impact.treesSaved}
                </div>
                <div className="text-sm text-gray-600 mb-1">Árboles salvados</div>
                <div className="text-xs text-gray-500">Equivalente en captura CO₂</div>
              </div>
            </div>
          </div>

          {/* Gráfica de Flujo de Caja */}
          <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <ChartCard title="Flujo de Caja Mensual" subtitle="Ingresos vs Costos de gestión y pipas">
              <div style={{ height: '320px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={cashFlowData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                      formatter={(value: number) => [`$${(value / 1000).toFixed(1)}K`, '']}
                      cursor={{ fill: 'rgba(14, 184, 166, 0.1)' }}
                    />
                    <Bar dataKey="ingresos" fill="#10b981" radius={[6, 6, 0, 0]} name="Ingresos" />
                    <Bar dataKey="costos" fill="#ef4444" radius={[6, 6, 0, 0]} name="Costos" />
                    <Line
                      type="monotone"
                      dataKey="balance"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', r: 5 }}
                      activeDot={{ r: 7 }}
                      name="Balance"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          {/* Tendencias Operativas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <ChartCard title="Agua Tratada Mensual" subtitle="m³ procesados por PTAR">
              <div style={{ height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={financialData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '12px',
                      }}
                      formatter={(value: number) => [`${value.toLocaleString()} m³`, '']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="agua" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Pipas Compradas Mensual" subtitle="Unidades de abastecimiento">
              <div style={{ height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financialData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '12px',
                      }}
                      cursor={{ fill: 'rgba(251, 191, 36, 0.1)' }}
                    />
                    <Bar dataKey="pipas" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
