import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Analysis() {
  const [period, setPeriod] = useState('month');
  const [client, setClient] = useState('1');
  
  // Mock data for demonstration
  const monthlyData = [
    { name: 'Enero', organicos: 4000, inorganicos: 2400, reciclables: 2400 },
    { name: 'Febrero', organicos: 3000, inorganicos: 1398, reciclables: 2210 },
    { name: 'Marzo', organicos: 2000, inorganicos: 9800, reciclables: 2290 },
    { name: 'Abril', organicos: 2780, inorganicos: 3908, reciclables: 2000 },
    { name: 'Mayo', organicos: 1890, inorganicos: 4800, reciclables: 2181 },
    { name: 'Junio', organicos: 2390, inorganicos: 3800, reciclables: 2500 },
  ];
  
  const pieData = [
    { name: 'Orgánicos', value: 40 },
    { name: 'Inorgánicos', value: 35 },
    { name: 'Reciclables', value: 25 },
  ];
  
  const COLORS = ['#b5e951', '#273949', '#d97706'];
  
  return (
    <AppLayout>
      <div className="p-5">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-anton text-gray-800 uppercase tracking-wider">Análisis</h1>
              <p className="mt-1 text-sm text-gray-500">Analiza tendencias y patrones de residuos</p>
            </div>
          </div>
          
          {/* Filters */}
          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                <Select value={client} onValueChange={setClient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Empresa Sustentable S.A.</SelectItem>
                    <SelectItem value="2">EcoServicios SpA</SelectItem>
                    <SelectItem value="3">Constructora Verde Ltda.</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Mensual</SelectItem>
                    <SelectItem value="quarter">Trimestral</SelectItem>
                    <SelectItem value="year">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Charts */}
          <div className="space-y-6">
            <Tabs defaultValue="barChart">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-anton tracking-wider">Distribución de Residuos</CardTitle>
                    <TabsList>
                      <TabsTrigger value="barChart">Barras</TabsTrigger>
                      <TabsTrigger value="pieChart">Circular</TabsTrigger>
                    </TabsList>
                  </div>
                </CardHeader>
                <CardContent>
                  <TabsContent value="barChart" className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={monthlyData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`${value} kg`, undefined]}
                          contentStyle={{ 
                            backgroundColor: 'white',
                            borderRadius: '0.375rem',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="organicos" name="Orgánicos" fill="#b5e951" />
                        <Bar dataKey="inorganicos" name="Inorgánicos" fill="#273949" />
                        <Bar dataKey="reciclables" name="Reciclables" fill="#d97706" />
                      </BarChart>
                    </ResponsiveContainer>
                  </TabsContent>
                  <TabsContent value="pieChart" className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value}%`, undefined]}
                          contentStyle={{ 
                            backgroundColor: 'white',
                            borderRadius: '0.375rem',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </TabsContent>
                </CardContent>
              </Card>
            </Tabs>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-anton tracking-wider">Tendencia Mensual por Categoría</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} kg`, undefined]}
                      contentStyle={{ 
                        backgroundColor: 'white',
                        borderRadius: '0.375rem',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="organicos" name="Orgánicos" fill="#b5e951" />
                    <Bar dataKey="inorganicos" name="Inorgánicos" fill="#273949" />
                    <Bar dataKey="reciclables" name="Reciclables" fill="#d97706" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
