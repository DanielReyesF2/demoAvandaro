import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/components/layout/AppLayout';
import RegistroDiario from '@/pages/RegistroDiario';
import ResiduosExcel from '@/pages/ResiduosExcel';
import { WasteFlowVisualization } from '@/components/dashboard/WasteFlowVisualization';
import { MetricCard } from '@/components/ui/metric-card';
import { ChartCard } from '@/components/ui/chart-card';
import { generateMonthlyWasteData, IMPACT_EQUIVALENCES } from '@/lib/avandaroData';
import { 
  Table, 
  PlusCircle, 
  BarChart2, 
  TrendingUp,
  Calendar,
  FileText
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export default function TrazabilidadResiduos() {
  // Datos realistas para Avandaro
  const monthlyTrends = generateMonthlyWasteData(2025);
  const totalWasteDiverted = monthlyTrends.reduce((sum, m) => sum + m.circular, 0) / 1000; // toneladas
  const impact = IMPACT_EQUIVALENCES.getEquivalences(monthlyTrends.reduce((sum, m) => sum + m.circular, 0));

  return (
    <AppLayout>
      <div className="p-8 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
              Trazabilidad de Residuos
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              Gestión completa del flujo de residuos desde la generación hasta el destino final
            </p>
          </div>

          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card-hover">
              <MetricCard
                title="Total Anual"
                value={`${(monthlyTrends.reduce((sum, m) => sum + m.total, 0) / 1000).toFixed(1)}`}
                subtitle="toneladas procesadas"
                icon={<FileText className="w-5 h-5" />}
              />
            </div>
            <div className="card-hover">
              <MetricCard
                title="Desviación"
                value={`${((monthlyTrends.reduce((sum, m) => sum + m.circular, 0) / monthlyTrends.reduce((sum, m) => sum + m.total, 0)) * 100).toFixed(1)}%`}
                subtitle="TRUE Zero Waste"
                icon={<TrendingUp className="w-5 h-5" />}
              />
            </div>
            <div className="card-hover">
              <MetricCard
                title="Circular"
                value={`${(totalWasteDiverted).toFixed(1)}`}
                subtitle="toneladas"
                icon={<BarChart2 className="w-5 h-5" />}
              />
            </div>
            <div className="card-hover">
              <MetricCard
                title="CO₂ Evitado"
                value={`${(impact.co2Avoided / 1000).toFixed(1)}`}
                subtitle="toneladas"
                icon={<Calendar className="w-5 h-5" />}
              />
            </div>
          </div>

          {/* Visualización de flujos */}
          <div className="animate-slide-up">
            <WasteFlowVisualization totalWasteDiverted={totalWasteDiverted} />
          </div>

          {/* Tabla Principal de Trazabilidad - VISIBLE DIRECTAMENTE */}
          <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <ResiduosExcel />
          </div>

          {/* Tab para Registro Diario */}
          <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Tabs defaultValue="registro" className="space-y-6">
              <TabsList className="bg-gray-100/80 p-1.5 rounded-lg border border-subtle shadow-premium-sm">
                <TabsTrigger 
                  value="registro" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-premium-sm px-6 py-2.5 rounded-md font-medium transition-all"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Registro Diario
                </TabsTrigger>
              </TabsList>

              <TabsContent value="registro" className="mt-6">
                <RegistroDiario />
              </TabsContent>
            </Tabs>
          </div>

          {/* Tendencias mensuales */}
          <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <ChartCard title="Tendencias Mensuales de Desviación" subtitle="Porcentaje de desviación del relleno sanitario">
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                      domain={[70, 90]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                      cursor={{ stroke: '#14b8a6', strokeWidth: 1, strokeDasharray: '5 5' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="deviation"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: '#10b981', r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 pt-4 border-t border-subtle">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Promedio Mensual</div>
                    <div className="text-xl font-bold text-gray-900">
                      {((monthlyTrends.reduce((sum, m) => sum + parseFloat(m.deviation), 0) / monthlyTrends.length)).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Mejor Mes</div>
                    <div className="text-xl font-bold text-accent-green">
                      {Math.max(...monthlyTrends.map(m => parseFloat(m.deviation))).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {monthlyTrends.find(m => parseFloat(m.deviation) === Math.max(...monthlyTrends.map(m => parseFloat(m.deviation))))?.month}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Meta TRUE</div>
                    <div className="text-xl font-bold text-accent-purple">≥75%</div>
                    <div className="text-xs text-gray-500">Certificación</div>
                  </div>
                </div>
              </div>
            </ChartCard>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
