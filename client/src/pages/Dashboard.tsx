import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  FileUp, 
  BarChart2, 
  Download, 
  Leaf, 
  Droplets, 
  ArrowUpDown, 
  Trash2,
  Recycle,
  Calendar,
  ChartPie,
  Settings,
  Eye
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AlertsTable from '@/components/dashboard/AlertsTable';
import SummaryCard from '@/components/dashboard/SummaryCard';
import { ClubHeader } from '@/components/dashboard/ClubHeader';
import { ClubAchievements } from '@/components/dashboard/ClubAchievements';
import { TrueCertification } from '@/components/dashboard/TrueCertification';
import { EnvironmentalImpact } from '@/components/dashboard/EnvironmentalImpact';
import { MetricsGrid } from '@/components/dashboard/MetricsGrid';
import { WasteData, Alert } from '@shared/schema';

export default function Dashboard() {
  // Estados para filtros
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Obtener datos de residuos
  const { data: wasteData = [] } = useQuery<WasteData[]>({
    queryKey: ['/api/waste-data'],
    refetchOnWindowFocus: false,
  });
  
  // Obtener alertas
  const { data: alerts = [] } = useQuery<Alert[]>({
    queryKey: ['/api/alerts'],
    refetchOnWindowFocus: false,
  });
  
  // Datos reales 2025 extraídos de los PDFs (enero-junio)
  const realData2025 = [
    { month: 'Enero', organicsToLandfill: 5386.5, recyclables: 569.05, inorganicNonRecyclable: 2965.58, organicsCompost: 12800 },
    { month: 'Febrero', organicsToLandfill: 4841.5, recyclables: 2368.0, inorganicNonRecyclable: 2423.3, organicsCompost: 0 },
    { month: 'Marzo', organicsToLandfill: 5964.0, recyclables: 2156.8, inorganicNonRecyclable: 3140.5, organicsCompost: 0 },
    { month: 'Abril', organicsToLandfill: 4677.5, recyclables: 721.2, inorganicNonRecyclable: 2480.7, organicsCompost: 25600 },
    { month: 'Mayo', organicsToLandfill: 4921.0, recyclables: 2980.0, inorganicNonRecyclable: 2844.0, organicsCompost: 0 },
    { month: 'Junio', organicsToLandfill: 3837.5, recyclables: 3468.0, inorganicNonRecyclable: 2147.5, organicsCompost: 0 },
  ];

  // Calcular totales reales
  const totals = realData2025.reduce((acc, month) => {
    const totalGenerated = month.organicsToLandfill + month.recyclables + month.inorganicNonRecyclable + month.organicsCompost;
    const totalDiverted = month.organicsCompost + month.recyclables;
    return {
      organicTotal: acc.organicTotal + month.organicsToLandfill + month.organicsCompost,
      inorganicTotal: acc.inorganicTotal + month.inorganicNonRecyclable,
      recyclableTotal: acc.recyclableTotal + month.recyclables,
      totalGenerated: acc.totalGenerated + totalGenerated,
      totalDiverted: acc.totalDiverted + totalDiverted,
    };
  }, { organicTotal: 0, inorganicTotal: 0, recyclableTotal: 0, totalGenerated: 0, totalDiverted: 0 });

  const summaryData = {
    organicWaste: (totals.organicTotal / 1000).toFixed(1), // Convertir a toneladas
    inorganicWaste: (totals.inorganicTotal / 1000).toFixed(1),
    recyclableWaste: (totals.recyclableTotal / 1000).toFixed(1),
    totalWaste: (totals.totalGenerated / 1000).toFixed(1),
    deviation: ((totals.totalDiverted / totals.totalGenerated) * 100).toFixed(1), // Desviación real
  };

  // Datos para el componente de impacto ambiental
  const environmentalData = {
    organicWasteDiverted: realData2025.reduce((acc, month) => acc + month.organicsCompost, 0), // PODA compostada
    recyclableWasteDiverted: totals.recyclableTotal, // Total de reciclables
  };
  
  // Datos para gráfica de barras con datos reales (en kg)
  const monthlyData = realData2025.map(month => ({
    name: month.month.slice(0, 3), // Ene, Feb, etc.
    organicos: Math.round(month.organicsToLandfill + month.organicsCompost), // Mantener en kg
    inorganicos: Math.round(month.inorganicNonRecyclable),
    reciclables: Math.round(month.recyclables),
  }));
  
  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <ClubHeader />
        
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Métricas principales mejoradas */}
          <MetricsGrid 
            deviation={summaryData.deviation}
            organicWaste={summaryData.organicWaste}
            inorganicWaste={summaryData.inorganicWaste}
            totalWaste={summaryData.totalWaste}
          />

          {/* Impacto ambiental - SECCIÓN DESTACADA */}
          <EnvironmentalImpact 
            organicWasteDiverted={environmentalData.organicWasteDiverted}
            recyclableWasteDiverted={environmentalData.recyclableWasteDiverted}
          />

          {/* Gráfica principal mejorada */}
          <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-navy/10 rounded-xl p-8 mb-6 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-anton text-gray-800 uppercase tracking-wider">
                  Análisis Mensual de Residuos
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  Club Campestre Ciudad de México • Enero - Junio 2025
                </p>
              </div>
              <div className="text-xs text-gray-500 bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Datos en tiempo real</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="h-[450px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{
                      top: 30,
                      right: 40,
                      left: 20,
                      bottom: 20,
                    }}
                    barCategoryGap="20%"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                    <XAxis 
                      dataKey="name" 
                      fontSize={12}
                      fontWeight="500"
                      stroke="#6b7280"
                    />
                    <YAxis 
                      fontSize={12}
                      stroke="#6b7280"
                      tickFormatter={(value) => `${(value/1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value, name) => [`${Number(value).toLocaleString()} kg`, name]}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '2px solid #273949',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: '500',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                      }}
                      labelStyle={{ color: '#273949', fontWeight: '600' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '14px', fontWeight: '500' }} />
                    <Bar 
                      dataKey="organicos" 
                      fill="#b5e951" 
                      name="Orgánicos (incluye PODA)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="inorganicos" 
                      fill="#273949" 
                      name="Inorgánicos"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="reciclables" 
                      fill="#d97706" 
                      name="Reciclables"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Notas informativas */}
              <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-lime rounded"></div>
                  <span>PODA: Enero +12.8 ton, Abril +25.6 ton</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span>Todos los valores en kilogramos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de certificación y logros */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* TRUE Certification - más prominente */}
            <TrueCertification currentDeviation={parseFloat(summaryData.deviation)} />
            
            {/* Certificaciones y logros */}
            <ClubAchievements />
          </div>

          
        </div>
      </div>
    </AppLayout>
  );
}