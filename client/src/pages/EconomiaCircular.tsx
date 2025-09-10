import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "../components/layout/AppLayout";
import { ClubHeader } from "../components/dashboard/ClubHeader";
import { RotateCcw, TrendingUp, Award, Target } from "lucide-react";

// Datos del índice de circularidad
const circularityMetrics = [
  { subject: 'Residuos', score: 68, maxScore: 100, description: 'Desviación del relleno sanitario' },
  { subject: 'Energía', score: 75, maxScore: 100, description: 'Eficiencia y renovables' },
  { subject: 'Agua', score: 82, maxScore: 100, description: 'Reciclaje y conservación' },
  { subject: 'Materiales', score: 45, maxScore: 100, description: 'Compras sustentables' },
  { subject: 'Biodiversidad', score: 63, maxScore: 100, description: 'Espacios verdes nativos' },
  { subject: 'Movilidad', score: 38, maxScore: 100, description: 'Transporte sustentable' },
];

// Datos de progreso mensual
const monthlyProgress = [
  { month: 'Ene', circularidad: 58, residuos: 52, energia: 71, agua: 79 },
  { month: 'Feb', circularidad: 61, residuos: 55, energia: 73, agua: 80 },
  { month: 'Mar', circularidad: 63, residuos: 58, energia: 74, agua: 81 },
  { month: 'Abr', circularidad: 67, residuos: 62, energia: 75, agua: 82 },
  { month: 'May', circularidad: 69, residuos: 65, energia: 75, agua: 82 },
  { month: 'Jun', circularidad: 72, residuos: 68, energia: 75, agua: 82 },
];

// Indicadores de impacto
const impactData = [
  { name: 'Materiales Circulares', value: 65, fill: '#22c55e' },
  { name: 'Materiales Lineales', value: 35, fill: '#ef4444' },
];

export default function EconomiaCircular() {
  const indiceCircularidad = circularityMetrics.reduce((sum, metric) => sum + metric.score, 0) / circularityMetrics.length;
  const mejorCategoria = circularityMetrics.reduce((prev, current) => (prev.score > current.score) ? prev : current);
  const categoriaAMejorar = circularityMetrics.reduce((prev, current) => (prev.score < current.score) ? prev : current);

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <ClubHeader />
        
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header del módulo */}
          <div className="mb-8">
            <h1 className="text-3xl font-anton text-gray-800 uppercase tracking-wider">
              Economía Circular
            </h1>
            <p className="text-gray-600 mt-2">
              Índice integral de circularidad y sostenibilidad del Club Campestre
            </p>
          </div>

          {/* Indicador principal de circularidad */}
          <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-xl p-8 mb-8 border-2 border-green-100">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="text-6xl font-bold text-green-600">{indiceCircularidad.toFixed(0)}%</div>
                <div className="absolute -top-2 -right-8 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold transform rotate-12">
                  B+
                </div>
              </div>
              <div className="text-lg text-gray-600 mt-2">Nivel: Avanzado</div>
              <div className="text-sm text-gray-500 mt-1">Meta 2026: 85% (Nivel Excelente)</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center bg-white rounded-lg p-4 shadow-sm">
                <Award className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-700">Fortaleza</div>
                <div className="text-lg font-bold text-green-600">{mejorCategoria.subject}</div>
                <div className="text-xs text-gray-500">{mejorCategoria.score}% - {mejorCategoria.description}</div>
              </div>
              
              <div className="text-center bg-white rounded-lg p-4 shadow-sm">
                <Target className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-700">Oportunidad</div>
                <div className="text-lg font-bold text-red-600">{categoriaAMejorar.subject}</div>
                <div className="text-xs text-gray-500">{categoriaAMejorar.score}% - {categoriaAMejorar.description}</div>
              </div>
              
              <div className="text-center bg-white rounded-lg p-4 shadow-sm">
                <TrendingUp className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-700">Tendencia</div>
                <div className="text-lg font-bold text-blue-600">+14%</div>
                <div className="text-xs text-gray-500">Mejora en 6 meses</div>
              </div>
            </div>
          </div>

          {/* Métricas por categoría */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {circularityMetrics.map((metric, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{metric.subject}</h3>
                    <p className="text-xs text-gray-500">{metric.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{metric.score}%</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      metric.score >= 80 ? 'bg-green-500' :
                      metric.score >= 60 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${metric.score}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Análisis detallado */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-anton text-gray-800 mb-6 uppercase tracking-wide">
              Análisis de Circularidad
            </h2>
            
            <Tabs defaultValue="radar" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="radar">Vista Integral</TabsTrigger>
                <TabsTrigger value="trends">Tendencias</TabsTrigger>
                <TabsTrigger value="materials">Flujo de Materiales</TabsTrigger>
                <TabsTrigger value="actions">Plan de Acción</TabsTrigger>
              </TabsList>
              
              <TabsContent value="radar">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={circularityMetrics}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                        <Radar
                          name="Puntuación Actual"
                          dataKey="score"
                          stroke="#22c55e"
                          fill="#22c55e"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Interpretación del Índice</h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                        <div className="font-medium text-green-800 mb-1">Excelente (80-100%)</div>
                        <div className="text-sm text-green-700">Liderazgo en sostenibilidad, modelo a seguir</div>
                        <div className="text-xs text-green-600 mt-1">• Agua: {circularityMetrics.find(m => m.subject === 'Agua')?.score}%</div>
                      </div>
                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                        <div className="font-medium text-yellow-800 mb-1">Avanzado (60-79%)</div>
                        <div className="text-sm text-yellow-700">Buen desempeño, oportunidades de mejora</div>
                        <div className="text-xs text-yellow-600 mt-1">• Energía: {circularityMetrics.find(m => m.subject === 'Energía')?.score}% • Residuos: {circularityMetrics.find(m => m.subject === 'Residuos')?.score}%</div>
                      </div>
                      <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                        <div className="font-medium text-red-800 mb-1">En Desarrollo (&lt;60%)</div>
                        <div className="text-sm text-red-700">Requiere atención prioritaria</div>
                        <div className="text-xs text-red-600 mt-1">• Materiales: {circularityMetrics.find(m => m.subject === 'Materiales')?.score}% • Movilidad: {circularityMetrics.find(m => m.subject === 'Movilidad')?.score}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="trends">
                <div className="h-[400px] mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyProgress}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                      <XAxis dataKey="month" fontSize={12} stroke="#6b7280" />
                      <YAxis fontSize={12} stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '2px solid #273949',
                          borderRadius: '12px',
                          fontSize: '13px',
                          fontWeight: '500',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="circularidad" fill="#8b5cf6" name="Índice General" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="residuos" fill="#b5e951" name="Residuos" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="energia" fill="#f59e0b" name="Energía" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="agua" fill="#06b6d4" name="Agua" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-100">
                  <h3 className="font-medium text-gray-900 mb-4">Proyección 2025-2026</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-purple-600">78%</div>
                      <div className="text-sm text-gray-600">Diciembre 2025</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-green-600">85%</div>
                      <div className="text-sm text-gray-600">Meta 2026</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-blue-600">+13%</div>
                      <div className="text-sm text-gray-600">Mejora proyectada</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="materials">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={impactData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {impactData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Flujos de Material</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Materiales Reciclados</span>
                        <span className="text-sm font-bold text-green-600">34 ton/año</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Compost Generado</span>
                        <span className="text-sm font-bold text-blue-600">68 ton/año</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Agua Reciclada</span>
                        <span className="text-sm font-bold text-purple-600">85 ML/año</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Energía Renovable</span>
                        <span className="text-sm font-bold text-yellow-600">102 MWh/año</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="actions">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                      <h3 className="font-anton text-lg text-red-800 mb-4 uppercase tracking-wide">
                        Acciones Prioritarias
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                          <div>
                            <div className="font-medium">Programa de Movilidad Sustentable</div>
                            <div className="text-gray-600">Implementar bicicletas eléctricas y transporte compartido</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                          <div>
                            <div className="font-medium">Compras Circulares</div>
                            <div className="text-gray-600">Política de adquisiciones con criterios de circularidad</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                          <div>
                            <div className="font-medium">Biodiversidad Nativa</div>
                            <div className="text-gray-600">Restauración de ecosistemas con especies autóctonas</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                      <h3 className="font-anton text-lg text-green-800 mb-4 uppercase tracking-wide">
                        Oportunidades de Mejora
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <div className="font-medium">Optimización Energética</div>
                            <div className="text-gray-600">Aumentar capacidad solar a 250 kW</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <div className="font-medium">Zero Waste Avanzado</div>
                            <div className="text-gray-600">Alcanzar 90% de desviación para TRUE certification</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <div className="font-medium">Economía del Agua</div>
                            <div className="text-gray-600">Implementar sistemas de reutilización avanzados</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="font-anton text-lg text-gray-800 mb-4 uppercase tracking-wide">
                      Cronograma de Implementación 2025-2026
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="bg-white p-4 rounded-lg">
                        <div className="font-medium text-blue-600 mb-2">Q3 2025</div>
                        <div className="space-y-1 text-xs">
                          <div>• Movilidad sustentable</div>
                          <div>• Compras circulares</div>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <div className="font-medium text-green-600 mb-2">Q4 2025</div>
                        <div className="space-y-1 text-xs">
                          <div>• Ampliación solar</div>
                          <div>• Biodiversidad nativa</div>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <div className="font-medium text-purple-600 mb-2">Q1 2026</div>
                        <div className="space-y-1 text-xs">
                          <div>• Certificación TRUE</div>
                          <div>• Agua circular avanzada</div>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <div className="font-medium text-orange-600 mb-2">Q2 2026</div>
                        <div className="space-y-1 text-xs">
                          <div>• Índice 85%</div>
                          <div>• Certificación integral</div>
                        </div>
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