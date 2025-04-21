import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/layout/AppLayout';
import SummaryCard from '@/components/dashboard/SummaryCard';
import TrendChart from '@/components/dashboard/TrendChart';
import AlertsTable from '@/components/dashboard/AlertsTable';
import FileUploader from '@/components/FileUploader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, PlusCircle } from 'lucide-react';

export default function Dashboard() {
  const [selectedClient, setSelectedClient] = useState<string>("1");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("month");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Fetch clients
  const { data: clients } = useQuery({
    queryKey: ['/api/clients'],
    refetchOnWindowFocus: false
  });
  
  // Fetch alerts for selected client
  const { data: alerts } = useQuery({
    queryKey: ['/api/alerts', selectedClient],
    queryFn: async ({ queryKey }) => {
      const [_, clientId] = queryKey;
      const res = await fetch(`/api/alerts?clientId=${clientId}`);
      if (!res.ok) throw new Error('Failed to fetch alerts');
      return await res.json();
    },
    refetchOnWindowFocus: false
  });
  
  // Mock chart data (would normally come from an API)
  const chartData = [
    { month: 'Mayo', organicWaste: 2.1, inorganicWaste: 3.2 },
    { month: 'Junio', organicWaste: 1.9, inorganicWaste: 2.8 },
    { month: 'Julio', organicWaste: 2.3, inorganicWaste: 2.7 },
    { month: 'Agosto', organicWaste: 2.6, inorganicWaste: 2.5 },
    { month: 'Sept', organicWaste: 2.9, inorganicWaste: 2.3 },
    { month: 'Oct', organicWaste: 2.7, inorganicWaste: 2.6 },
    { month: 'Nov', organicWaste: 3.1, inorganicWaste: 2.4 }
  ];
  
  // Apply filters
  const handleApplyFilters = () => {
    // This would typically trigger API calls with the new filter values
    console.log('Applying filters:', { selectedClient, selectedPeriod, selectedCategory });
  };
  
  return (
    <AppLayout>
      <div className="p-5">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-anton text-gray-800 uppercase tracking-wider">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Visualiza y analiza la gestión de residuos</p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Button variant="outline" size="sm" className="mr-3">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button size="sm" className="bg-lime hover:bg-lime-dark text-black">
                <PlusCircle className="w-4 h-4 mr-2" />
                Nuevo Reporte
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <div className="md:flex md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                <div>
                  <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                  <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los clientes</SelectItem>
                      <SelectItem value="1">Empresa Sustentable S.A.</SelectItem>
                      <SelectItem value="2">EcoServicios SpA</SelectItem>
                      <SelectItem value="3">Constructora Verde Ltda.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Último mes</SelectItem>
                      <SelectItem value="quarter">Último trimestre</SelectItem>
                      <SelectItem value="year">Último año</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      <SelectItem value="organic">Residuos Orgánicos</SelectItem>
                      <SelectItem value="inorganic">Residuos Inorgánicos</SelectItem>
                      <SelectItem value="recyclable">Reciclables</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Button 
                  onClick={handleApplyFilters}
                  className="w-full md:w-auto bg-navy hover:bg-navy-light"
                >
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </div>

          {/* File Uploader */}
          <FileUploader clientId={parseInt(selectedClient)} />
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 my-6">
            <SummaryCard
              title="Residuos Orgánicos"
              value="2.4 ton"
              change={8.2}
              progress={78}
              progressLabel="78% de la meta mensual"
              type="organic"
            />
            
            <SummaryCard
              title="Residuos Inorgánicos"
              value="3.7 ton"
              change={-5.1}
              progress={92}
              progressLabel="92% de la meta mensual"
              type="inorganic"
            />
            
            <SummaryCard
              title="Total Residuos"
              value="6.1 ton"
              change={-2.8}
              progress={86}
              progressLabel="86% de la meta mensual"
              type="total"
            />
            
            <SummaryCard
              title="Desviación"
              value="4.2%"
              change={1.5}
              progress={42}
              progressLabel="42% del máximo permitido"
              type="deviation"
            />
          </div>
          
          {/* Charts and Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TrendChart data={chartData} />
            </div>
            
            <div>
              <AlertsTable alerts={alerts || []} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
