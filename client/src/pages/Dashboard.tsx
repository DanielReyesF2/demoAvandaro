import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/layout/AppLayout';
import { WasteFlowVisualization } from '@/components/dashboard/WasteFlowVisualization';
import { MetricCard } from '@/components/ui/metric-card';
import { ChartCard } from '@/components/ui/chart-card';
import { 
  Trash2, 
  Zap, 
  Droplets, 
  RefreshCw,
  TrendingUp
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
  
  // Obtener datos de la tabla de trazabilidad (FUENTE DE VERDAD)
  const { data: wasteExcelData } = useQuery<WasteExcelData>({
    queryKey: ['/api/waste-excel', currentYear],
    queryFn: async ({ queryKey }) => {
      const response = await fetch(`/api/waste-excel/${currentYear}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      return response.json();
    },
    refetchOnWindowFocus: false,
  });

  // Calcular totales de cada sección
  const calculateSectionTotals = () => {
    if (!wasteExcelData) return { recyclingTotal: 0, compostTotal: 0, reuseTotal: 0, landfillTotal: 0 };
    
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

  // Calcular impacto ambiental
  const totalWasteDiverted = realTimeKPIs.totalCircular / 1000; // Convertir de kg a toneladas

  // Datos para gráfico mensual
  const monthlyData = wasteExcelData?.months.map(month => ({
    month: month.month.label,
    recycling: month.recycling.reduce((sum, e) => sum + e.kg, 0),
    compost: month.compost.reduce((sum, e) => sum + e.kg, 0),
    reuse: month.reuse.reduce((sum, e) => sum + e.kg, 0),
    landfill: month.landfill.reduce((sum, e) => sum + e.kg, 0),
  })) || [];

  return (
    <AppLayout>
      <div className="p-8 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto space-y-6" style={{ paddingTop: '2rem' }}>
          {/* Módulos ambientales principales - Diseño minimalista */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <MetricCard
              title="Desviación"
              value={`${processedData.wasteDeviation.toFixed(1)}%`}
              subtitle="TRUE Zero Waste"
              icon={<Trash2 className="w-5 h-5" />}
            />
            <MetricCard
              title="Renovable"
              value={`${processedData.energyRenewable}%`}
              subtitle="Paneles solares"
              icon={<Zap className="w-5 h-5" />}
            />
            <MetricCard
              title="Reciclada"
              value={`${processedData.waterRecycled}%`}
              subtitle="PTAR y laguna"
              icon={<Droplets className="w-5 h-5" />}
            />
            <MetricCard
              title="Circularidad"
              value={`${processedData.circularityIndex}%`}
              subtitle="Sustentabilidad"
              icon={<RefreshCw className="w-5 h-5" />}
            />
          </div>

          {/* Flujos Dinámicos de Residuos - Sección principal */}
          <div className="mb-8">
            <WasteFlowVisualization totalWasteDiverted={totalWasteDiverted} />
          </div>

          {/* Tendencias Mensuales */}
          {monthlyData.length > 0 && (
            <ChartCard title="Tendencias Mensuales">
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="recycling" fill="#14b8a6" radius={[4, 4, 0, 0]} stackId="a" />
                    <Bar dataKey="compost" fill="#10b981" radius={[4, 4, 0, 0]} stackId="a" />
                    <Bar dataKey="reuse" fill="#8b5cf6" radius={[4, 4, 0, 0]} stackId="a" />
                    <Bar dataKey="landfill" fill="#6b7280" radius={[4, 4, 0, 0]} stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
