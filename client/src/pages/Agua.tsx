import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, BarChart, Bar } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "../components/layout/AppLayout";
import { MetricCard } from "@/components/ui/metric-card";
import { ChartCard } from "@/components/ui/chart-card";
import { calculateWaterImpact, calculateWaterEfficiency, formatWaterImpact } from "@/lib/waterEmissionsCalculator";
import { calculateWaterFootprint, calculateWaterSavings } from "@/lib/waterFootprintCalculator";
import { Droplets, TrendingDown, Recycle, Gauge, Leaf, Zap } from "lucide-react";

// Datos simulados de agua
const waterData = [
  { month: 'Ene', consumo: 12800, reciclada: 3200, lluvia: 1850, calidad: 98, costo: 78500 },
  { month: 'Feb', consumo: 11900, reciclada: 3400, lluvia: 2100, calidad: 97, costo: 73200 },
  { month: 'Mar', consumo: 13500, reciclada: 3800, lluvia: 1200, calidad: 99, costo: 83100 },
  { month: 'Abr', consumo: 14200, reciclada: 4100, lluvia: 2800, calidad: 98, costo: 87400 },
  { month: 'May', consumo: 15800, reciclada: 4600, lluvia: 3900, calidad: 96, costo: 97200 },
  { month: 'Jun', consumo: 17300, reciclada: 5100, lluvia: 4200, calidad: 97, costo: 106500 },
];

export default function Agua() {
  const totalConsumo = waterData.reduce((sum, month) => sum + month.consumo, 0);
  const totalReciclada = waterData.reduce((sum, month) => sum + month.reciclada, 0);
  const totalLluvia = waterData.reduce((sum, month) => sum + month.lluvia, 0);
  const porcentajeReciclada = ((totalReciclada / totalConsumo) * 100).toFixed(1);
  
  // Calcular impacto ambiental usando las calculadoras
  const consumoM3 = totalConsumo / 1000; // Convertir litros a m³
  const recicladaM3 = totalReciclada / 1000;
  const lluviaM3 = totalLluvia / 1000;
  
  const waterImpact = calculateWaterImpact(consumoM3, recicladaM3);
  const waterEfficiency = calculateWaterEfficiency(consumoM3, recicladaM3, lluviaM3);
  const formattedImpact = formatWaterImpact(waterImpact);
  const waterSavings = calculateWaterSavings(totalConsumo, totalReciclada);

  return (
    <AppLayout>
      <div className="p-8 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
          {/* Header Premium */}
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
              Gestión Hídrica
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              PTAR, laguna de riego y sistema de conservación integral
            </p>
            
            {/* Infraestructura Premium */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100 shadow-premium-sm card-hover">
                <h3 className="font-semibold text-blue-900 mb-2">Planta PTAR</h3>
                <p className="text-sm text-blue-700 leading-relaxed">
                  Planta de Tratamiento de Aguas Residuales en operación para el procesamiento y reutilización del agua
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100 shadow-premium-sm card-hover">
                <h3 className="font-semibold text-green-900 mb-2">Sistema de Riego</h3>
                <p className="text-sm text-green-700 leading-relaxed">
                  Laguna de almacenamiento para riego eficiente del campo de golf
                </p>
              </div>
            </div>
          </div>

          {/* Métricas principales - Premium */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card-hover">
              <MetricCard
                title="Consumo Total"
                value={`${(totalConsumo/1000).toFixed(1)}`}
                subtitle="ML consumidos (semestre)"
                icon={<Droplets className="w-5 h-5" />}
              />
            </div>
            
            <div className="card-hover">
              <MetricCard
                title="Reciclada"
                value={`${porcentajeReciclada}%`}
                subtitle="Agua reciclada"
                icon={<Recycle className="w-5 h-5" />}
              />
            </div>
            
            <div className="card-hover">
              <MetricCard
                title="Ahorro"
                value={formattedImpact.costFormatted}
                subtitle="Ahorro anual estimado"
                icon={<TrendingDown className="w-5 h-5" />}
              />
            </div>
            
            <div className="card-hover">
              <MetricCard
                title="Eficiencia"
                value={`${waterEfficiency.efficiency.toFixed(1)}%`}
                subtitle={waterEfficiency.sustainability}
                icon={<Gauge className="w-5 h-5" />}
              />
            </div>
          </div>

          {/* Impacto ambiental específico de agua */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-8 mb-8 border border-blue-100">
            <h2 className="text-xl font-anton text-gray-800 mb-6 uppercase tracking-wide">
              Impacto Ambiental Hídrico
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-2">{(totalLluvia/1000).toFixed(1)}ML</div>
                <div className="text-sm text-gray-600 mb-2">Agua de lluvia captada</div>
                <div className="text-xs text-gray-500">Equivale al consumo de 180 hogares</div>
              </div>
              
              <div className="text-center bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-green-600 mb-2">{(totalReciclada/1000).toFixed(1)}ML</div>
                <div className="text-sm text-gray-600 mb-2">Agua tratada y reutilizada</div>
                <div className="text-xs text-gray-500">Para riego y servicios</div>
              </div>
              
              <div className="text-center bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-purple-600 mb-2">67%</div>
                <div className="text-sm text-gray-600 mb-2">Eficiencia hídrica</div>
                <div className="text-xs text-gray-500">vs. promedio nacional</div>
              </div>
            </div>
          </div>

          {/* Tabla Detallada de Consumo Mensual */}
          <div className="bg-white rounded-xl p-8 shadow-premium-md border border-subtle animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                  Consumo Mensual Detallado
                </h2>
                <p className="text-sm text-gray-600 mt-1">Datos en miles de litros (kL)</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-subtle bg-gray-50">
                    <th className="text-left p-4 font-semibold text-gray-900 min-w-[150px]">Mes</th>
                    <th className="text-center p-4 font-semibold text-gray-900 min-w-[120px]">Consumo Total</th>
                    <th className="text-center p-4 font-semibold text-gray-900 min-w-[120px]">Agua Reciclada</th>
                    <th className="text-center p-4 font-semibold text-gray-900 min-w-[120px]">Agua de Lluvia</th>
                    <th className="text-center p-4 font-semibold text-gray-900 min-w-[120px]">% Reciclada</th>
                    <th className="text-center p-4 font-semibold text-gray-900 min-w-[120px]">Calidad %</th>
                    <th className="text-center p-4 font-semibold text-gray-900 min-w-[120px]">Costo</th>
                  </tr>
                </thead>
                <tbody>
                  {waterData.map((month, index) => {
                    const porcentajeRec = ((month.reciclada / month.consumo) * 100).toFixed(1);
                    return (
                      <tr key={index} className="border-b border-subtle hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium text-gray-900">{month.month}</td>
                        <td className="p-4 text-center text-gray-700 font-medium">{(month.consumo / 1000).toFixed(1)} kL</td>
                        <td className="p-4 text-center text-green-600 font-medium">{(month.reciclada / 1000).toFixed(1)} kL</td>
                        <td className="p-4 text-center text-blue-600 font-medium">{(month.lluvia / 1000).toFixed(1)} kL</td>
                        <td className="p-4 text-center text-gray-700 font-semibold">{porcentajeRec}%</td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${month.calidad >= 98 ? 'bg-green-500' : month.calidad >= 96 ? 'bg-yellow-500' : 'bg-orange-500'}`}
                                style={{ width: `${month.calidad}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700">{month.calidad}%</span>
                          </div>
                        </td>
                        <td className="p-4 text-center text-gray-700 font-medium">${month.costo.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                  {/* Totales */}
                  <tr className="border-t-2 border-subtle bg-gray-50 font-semibold">
                    <td className="p-4 text-gray-900">TOTAL</td>
                    <td className="p-4 text-center text-gray-900">{(totalConsumo / 1000).toFixed(1)} kL</td>
                    <td className="p-4 text-center text-green-600">{(totalReciclada / 1000).toFixed(1)} kL</td>
                    <td className="p-4 text-center text-blue-600">{(totalLluvia / 1000).toFixed(1)} kL</td>
                    <td className="p-4 text-center text-gray-900">{porcentajeReciclada}%</td>
                    <td className="p-4 text-center text-gray-900">-</td>
                    <td className="p-4 text-center text-gray-900">
                      ${waterData.reduce((sum, m) => sum + m.costo, 0).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Análisis detallado */}
          <div className="bg-white rounded-xl p-8 shadow-premium-md border border-subtle animate-slide-up">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
              Análisis Hídrico Detallado
            </h2>
            
            <Tabs defaultValue="consumption" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="consumption">Consumo</TabsTrigger>
                <TabsTrigger value="recycling">Reciclaje</TabsTrigger>
                <TabsTrigger value="rainwater">Pluvial</TabsTrigger>
                <TabsTrigger value="quality">Calidad</TabsTrigger>
              </TabsList>
              
              <TabsContent value="consumption">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={waterData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                      <XAxis dataKey="month" fontSize={12} stroke="#6b7280" />
                      <YAxis fontSize={12} stroke="#6b7280" tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} />
                      <Tooltip 
                        formatter={(value, name) => [`${Number(value).toLocaleString()} L`, name]}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '2px solid #273949',
                          borderRadius: '12px',
                          fontSize: '13px',
                          fontWeight: '500',
                        }}
                      />
                      <Legend />
                      <Area dataKey="consumo" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Consumo Total" />
                      <Area dataKey="reciclada" stackId="2" stroke="#22c55e" fill="#22c55e" name="Agua Reciclada" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="recycling">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={waterData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                        <XAxis dataKey="month" fontSize={12} stroke="#6b7280" />
                        <YAxis fontSize={12} stroke="#6b7280" />
                        <Tooltip 
                          formatter={(value) => [`${Number(value).toLocaleString()} L`, 'Agua Reciclada']}
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '2px solid #22c55e',
                            borderRadius: '12px',
                          }}
                        />
                        <Bar dataKey="reciclada" fill="#22c55e" name="Agua Reciclada" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Procesos de Tratamiento</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Aguas Grises</span>
                        <span className="text-sm font-bold text-green-600">65%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Osmosis Inversa</span>
                        <span className="text-sm font-bold text-blue-600">25%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Biodigestión</span>
                        <span className="text-sm font-bold text-purple-600">10%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="rainwater">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={waterData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                        <XAxis dataKey="month" fontSize={12} stroke="#6b7280" />
                        <YAxis fontSize={12} stroke="#6b7280" />
                        <Tooltip 
                          formatter={(value) => [`${Number(value).toLocaleString()} L`, 'Captación Pluvial']}
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '2px solid #06b6d4',
                            borderRadius: '12px',
                          }}
                        />
                        <Line type="monotone" dataKey="lluvia" stroke="#06b6d4" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Sistema de Captación</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                        <span>7,500 m² de superficie de captación</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Cisternas con capacidad de 850 m³</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Sistema de filtración automático</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Monitoreo de calidad en tiempo real</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="quality">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Índice de Calidad Mensual</h3>
                    {waterData.map((month, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">{month.month}</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${month.calidad}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-blue-600">{month.calidad}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="font-anton text-lg text-gray-800 mb-4 uppercase tracking-wide">
                      Parámetros Monitoreados
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>pH</span>
                        <span className="font-bold text-green-600">7.2 ✓</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Turbidez</span>
                        <span className="font-bold text-green-600">0.8 NTU ✓</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cloro residual</span>
                        <span className="font-bold text-green-600">0.7 mg/L ✓</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coliformes</span>
                        <span className="font-bold text-green-600">0 UFC/100mL ✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}