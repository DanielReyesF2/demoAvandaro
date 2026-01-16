import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, BarChart, Bar } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "../components/layout/AppLayout";
import { Droplets, TrendingDown, Recycle, Gauge, Waves, Sparkles, Activity, ThermometerSun, Beaker } from "lucide-react";
import { AnimatedCounter } from '@/components/ui/animated-counter';

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
  const ahorroAnual = 890000; // Pesos mexicanos
  const reduccionHuella = 34.2; // Porcentaje

  // Simulación de datos en tiempo real
  const [currentFlow, setCurrentFlow] = useState(145);
  const [ptarStatus, setPtarStatus] = useState({ ph: 7.2, turbidity: 0.8, temp: 22.5 });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const flowInterval = setInterval(() => {
      setCurrentFlow(prev => {
        const variation = (Math.random() - 0.5) * 10;
        return Math.max(130, Math.min(160, prev + variation));
      });
      setPtarStatus({
        ph: 7.0 + Math.random() * 0.4,
        turbidity: 0.5 + Math.random() * 0.5,
        temp: 21 + Math.random() * 3
      });
    }, 4000);

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(flowInterval);
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Hero Dashboard Hídrico */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 p-8 mb-8 shadow-2xl"
          >
            {/* Efectos de agua animados */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-cyan-400/30 to-transparent rounded-full blur-3xl"
              />
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
              />
              {/* Burbujas animadas */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [-20, -100],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.8,
                  }}
                  className="absolute bottom-0 w-4 h-4 bg-white/20 rounded-full"
                  style={{ left: `${15 + i * 18}%` }}
                />
              ))}
            </div>

            <div className="relative z-10">
              {/* Header con tiempo real */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                  >
                    <Waves className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">Gestión Hídrica Integral</h1>
                    <p className="text-white/80">PTAR · Laguna de Riego · Sistema de Conservación</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-3 h-3 bg-cyan-300 rounded-full"
                  />
                  <div className="text-white">
                    <div className="text-xs text-white/70">PTAR EN LÍNEA</div>
                    <div className="text-sm font-mono">
                      {currentTime.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Métricas principales en tiempo real */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center"
                >
                  <div className="text-4xl font-bold text-white mb-1">
                    <AnimatedCounter value={parseFloat(porcentajeReciclada)} decimals={1} suffix="%" duration={2} />
                  </div>
                  <div className="text-white/70 text-sm">Agua Reciclada</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center"
                >
                  <div className="text-4xl font-bold text-white mb-1">
                    {Math.round(currentFlow)} <span className="text-xl">L/s</span>
                  </div>
                  <div className="text-white/70 text-sm flex items-center justify-center gap-1">
                    <Activity className="w-3 h-3" />
                    Flujo PTAR
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center"
                >
                  <div className="text-4xl font-bold text-white mb-1">
                    {(totalLluvia / 1000).toFixed(1)} <span className="text-xl">ML</span>
                  </div>
                  <div className="text-white/70 text-sm">Lluvia Captada</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center"
                >
                  <div className="text-4xl font-bold text-white mb-1">98%</div>
                  <div className="text-white/70 text-sm">Calidad Agua</div>
                </motion.div>
              </div>

              {/* Indicadores PTAR en tiempo real */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Beaker className="w-5 h-5 text-cyan-200" />
                    <span className="text-white/80 text-sm">pH</span>
                  </div>
                  <span className="text-white font-bold">{ptarStatus.ph.toFixed(1)}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-200" />
                    <span className="text-white/80 text-sm">Turbidez</span>
                  </div>
                  <span className="text-white font-bold">{ptarStatus.turbidity.toFixed(1)} NTU</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ThermometerSun className="w-5 h-5 text-cyan-200" />
                    <span className="text-white/80 text-sm">Temp</span>
                  </div>
                  <span className="text-white font-bold">{ptarStatus.temp.toFixed(1)}°C</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 shadow-sm border border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <Droplets className="w-8 h-8 text-blue-600" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{(totalConsumo/1000).toFixed(1)}</div>
                  <div className="text-sm text-gray-600">ML consumidos</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">Millones de litros - semestre</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-sm border border-green-100">
              <div className="flex items-center justify-between mb-3">
                <Recycle className="w-8 h-8 text-green-600" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{porcentajeReciclada}%</div>
                  <div className="text-sm text-gray-600">Agua reciclada</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">Meta: 35% en 2026</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 shadow-sm border border-purple-100">
              <div className="flex items-center justify-between mb-3">
                <TrendingDown className="w-8 h-8 text-purple-600" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">$890K</div>
                  <div className="text-sm text-gray-600">Ahorro anual</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">vs. año anterior</div>
            </div>
            
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 shadow-sm border border-teal-100">
              <div className="flex items-center justify-between mb-3">
                <Gauge className="w-8 h-8 text-teal-600" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-teal-600">{reduccionHuella}%</div>
                  <div className="text-sm text-gray-600">Huella hídrica reducida</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">Impacto ambiental</div>
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

          {/* Análisis detallado */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-anton text-gray-800 mb-6 uppercase tracking-wide">
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