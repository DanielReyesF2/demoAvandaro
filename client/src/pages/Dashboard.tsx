import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/layout/AppLayout';
import { MetricCard } from '@/components/ui/metric-card';
import { ChartCard } from '@/components/ui/chart-card';
import { 
  Trash2, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Droplets,
  Package,
  Recycle,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
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
  Area,
  AreaChart,
} from 'recharts';

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
  
  // Datos mock realistas para el demo si no hay datos de API
  const mockMonthlyData = [
    { month: 'Ene', recycling: 2200, compost: 5200, reuse: 1800, landfill: 2800 },
    { month: 'Feb', recycling: 2100, compost: 5100, reuse: 1750, landfill: 2700 },
    { month: 'Mar', recycling: 2300, compost: 5300, reuse: 1850, landfill: 2900 },
    { month: 'Abr', recycling: 2250, compost: 5250, reuse: 1820, landfill: 2850 },
    { month: 'May', recycling: 2400, compost: 5400, reuse: 1900, landfill: 3000 },
    { month: 'Jun', recycling: 2350, compost: 5350, reuse: 1880, landfill: 2950 },
    { month: 'Jul', recycling: 2450, compost: 5500, reuse: 1950, landfill: 3100 },
    { month: 'Ago', recycling: 2420, compost: 5450, reuse: 1920, landfill: 3050 },
    { month: 'Sep', recycling: 2380, compost: 5380, reuse: 1890, landfill: 2980 },
    { month: 'Oct', recycling: 2320, compost: 5320, reuse: 1860, landfill: 2920 },
    { month: 'Nov', recycling: 2280, compost: 5280, reuse: 1840, landfill: 2880 },
    { month: 'Dic', recycling: 2500, compost: 5600, reuse: 2000, landfill: 3200 },
  ];
  
  // Obtener datos de la tabla de trazabilidad (FUENTE DE VERDAD)
  const { data: wasteExcelData } = useQuery<WasteExcelData>({
    queryKey: ['/api/waste-excel', currentYear],
    queryFn: async ({ queryKey }) => {
      try {
        const response = await fetch(`/api/waste-excel/${currentYear}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        return response.json();
      } catch (error) {
        // Si falla, retornar null para usar datos mock
        return null;
      }
    },
    refetchOnWindowFocus: false,
  });

  // Calcular totales de cada sección
  const calculateSectionTotals = () => {
    if (wasteExcelData) {
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
    }
    
    // Usar datos mock si no hay datos de API
    const totals = mockMonthlyData.reduce((acc, month) => ({
      recyclingTotal: acc.recyclingTotal + month.recycling,
      compostTotal: acc.compostTotal + month.compost,
      reuseTotal: acc.reuseTotal + month.reuse,
      landfillTotal: acc.landfillTotal + month.landfill,
    }), { recyclingTotal: 0, compostTotal: 0, reuseTotal: 0, landfillTotal: 0 });
    
    return totals;
  };

  // Calcular KPIs
  const calculateRealTimeKPIs = () => {
    const totals = calculateSectionTotals();
    const totalCircular = totals.recyclingTotal + totals.compostTotal + totals.reuseTotal;
    const totalLandfill = totals.landfillTotal;
    const totalWeight = totalCircular + totalLandfill;
    const deviationPercentage = totalWeight > 0 ? (totalCircular / totalWeight) * 100 : 72;
    
    return {
      totalCircular,
      totalLandfill,
      totalWeight,
      deviationPercentage
    };
  };

  const realTimeKPIs = calculateRealTimeKPIs();

  // Calcular métricas ejecutivas
  const totalGenerado = (realTimeKPIs.totalWeight || 33000) / 1000; // toneladas
  const totalReciclables = (realTimeKPIs.totalCircular || 24000) / 1000; // toneladas
  
  // Costos y finanzas (datos mock para demo)
  const costoTotalGestion = 485000; // Pesos al mes
  const ingresosReciclables = 145000; // Pesos al mes
  const aguaTratadaMes = 12400; // m³ tratados este mes
  const pipasCompradasMes = 18; // Número de pipas compradas
  const costoPipasMes = 324000; // Costo total de pipas este mes
  const aguaTotalAnual = 85500; // m³ tratados anuales
  
  // Tendencias vs mes anterior
  const variacionGestion = -5.2; // % vs mes anterior (negativo es bueno)
  const variacionIngresos = +12.5; // % vs mes anterior
  
  // Datos financieros mensuales para gráficas
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
    costos: month.gestion + (month.pipas * 18000), // Costo gestión + pipas
    ingresos: month.ingresos,
    balance: month.ingresos - (month.gestion + (month.pipas * 18000)),
  }));

  return (
    <AppLayout>
      <div className="p-8 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in" style={{ paddingTop: '2rem' }}>
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

          {/* Resumen Financiero Consolidado */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 shadow-premium-xl text-white animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-2">Resumen Financiero</h2>
                <p className="text-gray-300 text-sm">Balance operativo mensual</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-400 mb-1">
                  ${((ingresosReciclables - costoTotalGestion - costoPipasMes) / 1000).toFixed(1)}K
                </div>
                <div className="text-sm text-gray-400">Balance Neto</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-300 text-sm">Ingresos</span>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-green-400 mb-1">${(ingresosReciclables / 1000).toFixed(1)}K</div>
                <div className="text-xs text-gray-400">Por reciclables vendidos</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-300 text-sm">Costos Gestión</span>
                  <TrendingDown className="w-5 h-5 text-red-400" />
                </div>
                <div className="text-2xl font-bold text-red-400 mb-1">-${(costoTotalGestion / 1000).toFixed(1)}K</div>
                <div className="text-xs text-gray-400">Procesamiento y tratamiento</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-300 text-sm">Costo Pipas</span>
                  <Package className="w-5 h-5 text-orange-400" />
                </div>
                <div className="text-2xl font-bold text-orange-400 mb-1">-${(costoPipasMes / 1000).toFixed(1)}K</div>
                <div className="text-xs text-gray-400">Abastecimiento de agua</div>
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
