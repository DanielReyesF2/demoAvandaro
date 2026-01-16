import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, PieChart, Pie, Cell, RadialBarChart, RadialBar, ComposedChart, Bar } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "../components/layout/AppLayout";
import { Zap, TrendingDown, Battery, Sun, Target, Gauge, Bolt, Activity, TrendingUp, ArrowUp, Sparkles, Clock } from "lucide-react";
import { AnimatedCounter } from '@/components/ui/animated-counter';

import { generateEnergyData } from "@/lib/avandaroData";

// Datos energéticos realistas para Avandaro
const energyData = generateEnergyData();

// Datos para gráficas circulares
const energySourcesData = [
  { name: 'Solar', value: 72, color: '#fbbf24' },
  { name: 'Eólica', value: 18, color: '#60a5fa' },
  { name: 'Red CFE', value: 10, color: '#94a3b8' }
];

// Datos para gauge de eficiencia
const efficiencyGaugeData = [
  { name: 'Eficiencia', value: 87, fill: '#22c55e' },
  { name: 'Meta', value: 95, fill: '#e5e7eb' }
];

// Datos de comparación antes/después del proyecto solar
const comparacionData = [
  { period: 'Antes\n(2023)', consumoTotal: 720000, renovable: 48000, costo: 1450000, co2: 380 },
  { period: 'Actual\n(2024)', consumoTotal: 680000, renovable: 156000, costo: 1180000, co2: 290 },
  { period: 'Proyección\n(2025)', consumoTotal: 650000, renovable: 325000, costo: 980000, co2: 185 }
];

export default function Energia() {
  const totalConsumo = energyData.reduce((sum, month) => sum + month.consumo, 0);
  const totalRenovable = energyData.reduce((sum, month) => sum + month.renovable, 0);
  const porcentajeRenovable = ((totalRenovable / totalConsumo) * 100).toFixed(1);
  const eficienciaPromedio = (energyData.reduce((sum, month) => sum + month.eficiencia, 0) / energyData.length).toFixed(1);
  const ahorroAnual = 1350000; // Pesos mexicanos
  const reduccionCO2 = 125.7; // Toneladas CO2

  // Simulación de generación en tiempo real
  const [currentPower, setCurrentPower] = useState(612);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const powerInterval = setInterval(() => {
      // Simular variación en generación solar (+/- 5%)
      setCurrentPower(prev => {
        const variation = (Math.random() - 0.5) * 30;
        return Math.max(580, Math.min(680, prev + variation));
      });
    }, 3000);

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(powerInterval);
      clearInterval(timeInterval);
    };
  }, []);

  // Colores para las gráficas
  const COLORS = ['#fbbf24', '#60a5fa', '#94a3b8', '#22c55e'];
  const RAMP = (t: number) => {
    return `hsl(${120 * t + 60}, 70%, ${50 + t * 30}%)`;
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Hero Dashboard Solar - Con datos en tiempo real */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-8 mb-8 shadow-2xl"
          >
            {/* Efectos de fondo animados */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-r from-yellow-400/30 to-transparent rounded-full blur-3xl"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-20 right-20 w-32 h-32 bg-white/20 rounded-full blur-2xl"
              />
            </div>

            <div className="relative z-10">
              {/* Header con tiempo real */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                  >
                    <Sun className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">Proyecto Solar Avándaro</h1>
                    <p className="text-white/80">Sistema fotovoltaico de 850 kW instalados</p>
                  </div>
                </div>

                {/* Indicador de tiempo real */}
                <div className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-3 h-3 bg-green-400 rounded-full"
                  />
                  <div className="text-white">
                    <div className="text-xs text-white/70">EN VIVO</div>
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
                    <AnimatedCounter value={parseFloat(porcentajeRenovable)} decimals={1} suffix="%" duration={2} />
                  </div>
                  <div className="text-white/70 text-sm">Energía Renovable</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center"
                >
                  <div className="text-4xl font-bold text-white mb-1">
                    {Math.round(currentPower)} <span className="text-xl">kW</span>
                  </div>
                  <div className="text-white/70 text-sm flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Generando ahora
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center"
                >
                  <div className="text-4xl font-bold text-white mb-1">1,247</div>
                  <div className="text-white/70 text-sm">Paneles Activos</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center"
                >
                  <div className="text-4xl font-bold text-white mb-1">98.7%</div>
                  <div className="text-white/70 text-sm">Uptime Sistema</div>
                </motion.div>
              </div>

              {/* Barra de progreso de generación */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80 text-sm">Capacidad actual</span>
                  <span className="text-white font-bold">{Math.round((currentPower / 850) * 100)}% de 850 kW</span>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentPower / 850) * 100}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-yellow-300 to-white rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Métricas principales - Rediseñadas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 shadow-lg border border-yellow-200 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-100/30 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Bolt className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-gray-900 group-hover:scale-105 transition-transform">{(totalConsumo/1000).toFixed(0)}</div>
                    <div className="text-sm text-gray-600 font-medium">MWh Año</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-medium">Consumo energético total</div>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-100/30 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Sun className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-green-600 group-hover:scale-105 transition-transform">{porcentajeRenovable}%</div>
                    <div className="text-sm text-gray-600 font-medium">Renovable</div>
                  </div>
                </div>
                <div className="text-xs text-green-600 font-medium">Meta: 50% en 2026 ✓</div>
                <div className="mt-3 flex items-center space-x-2">
                  <ArrowUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-bold text-green-600">+8.2% vs año anterior</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100/30 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <TrendingDown className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-blue-600 group-hover:scale-105 transition-transform">$1.35M</div>
                    <div className="text-sm text-gray-600 font-medium">Ahorro</div>
                  </div>
                </div>
                <div className="text-xs text-blue-600 font-medium">vs. año anterior</div>
                <div className="mt-3 text-xs text-gray-500">ROI: 3.2 años</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-100/30 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-purple-600 group-hover:scale-105 transition-transform">{reduccionCO2}</div>
                    <div className="text-sm text-gray-600 font-medium">Ton CO₂</div>
                  </div>
                </div>
                <div className="text-xs text-purple-600 font-medium">Emisiones evitadas</div>
                <div className="mt-3 text-xs text-gray-500">≈ 1,574 árboles plantados</div>
              </div>
            </div>
          </div>

          {/* Impacto ambiental específico de energía */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 mb-8 border border-green-100">
            <h2 className="text-xl font-anton text-gray-800 mb-6 uppercase tracking-wide">
              Impacto Ambiental Energético
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-green-600 mb-2">{reduccionCO2}</div>
                <div className="text-sm text-gray-600 mb-2">Toneladas CO₂ reducidas</div>
                <div className="text-xs text-gray-500">Equivale a plantar 1,574 árboles</div>
              </div>
              
              <div className="text-center bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-2">2.1M</div>
                <div className="text-sm text-gray-600 mb-2">Litros de agua ahorrados</div>
                <div className="text-xs text-gray-500">En generación de energía</div>
              </div>
              
              <div className="text-center bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-yellow-600 mb-2">156</div>
                <div className="text-sm text-gray-600 mb-2">Hogares alimentados</div>
                <div className="text-xs text-gray-500">Con energía renovable</div>
              </div>
            </div>
          </div>

          {/* Comparación Antes vs Después - Espectacular */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl border border-gray-200 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-anton text-gray-800 uppercase tracking-wide mb-3">
                Transformación Energética
              </h2>
              <p className="text-lg text-gray-600">
                Impacto del proyecto de energía renovable en el Club de Golf Avandaro
              </p>
            </div>
            
            <div className="h-[400px] mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={comparacionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                  <XAxis dataKey="period" fontSize={14} stroke="#374151" fontWeight="bold" />
                  <YAxis yAxisId="left" fontSize={12} stroke="#6b7280" tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} />
                  <YAxis yAxisId="right" orientation="right" fontSize={12} stroke="#6b7280" tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      name === 'costo' ? `$${Number(value).toLocaleString()}` : `${Number(value).toLocaleString()} kWh`,
                      name === 'consumoTotal' ? 'Consumo Total' : 
                      name === 'renovable' ? 'Energía Renovable' : 'Costo Anual'
                    ]}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '2px solid #273949',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="consumoTotal" fill="#94a3b8" name="Consumo Total" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="left" dataKey="renovable" fill="#22c55e" name="Energía Renovable" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="costo" stroke="#f59e0b" strokeWidth={4} name="Costo Anual" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <div className="text-3xl font-black text-green-600 mb-2">+225%</div>
                <div className="text-sm font-bold text-gray-800 mb-1">INCREMENTO RENOVABLE</div>
                <div className="text-xs text-gray-600">De 48k a 156k kWh anuales</div>
              </div>
              <div className="text-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                <div className="text-3xl font-black text-blue-600 mb-2">-19%</div>
                <div className="text-sm font-bold text-gray-800 mb-1">REDUCCIÓN COSTOS</div>
                <div className="text-xs text-gray-600">Ahorro de $270k anuales</div>
              </div>
              <div className="text-center bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
                <div className="text-3xl font-black text-purple-600 mb-2">-24%</div>
                <div className="text-sm font-bold text-gray-800 mb-1">MENOS EMISIONES</div>
                <div className="text-xs text-gray-600">Reducción de 90 ton CO₂</div>
              </div>
            </div>
          </div>

          {/* Dashboard de Eficiencia con Gauge */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Gauge de Eficiencia */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl border border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-anton text-gray-800 uppercase tracking-wide mb-2">
                  Eficiencia Energética
                </h3>
                <p className="text-gray-600">Índice actual vs meta 2026</p>
              </div>
              
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="80%" data={efficiencyGaugeData}>
                    <RadialBar 
                      dataKey="value" 
                      cornerRadius={30} 
                      fill="#22c55e"
                      background={{ fill: '#e5e7eb' }}
                    />
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-4xl font-black fill-gray-800">
                      {eficienciaPromedio}%
                    </text>
                    <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="text-sm fill-gray-600">
                      Eficiencia Actual
                    </text>
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center bg-green-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-green-600">{eficienciaPromedio}%</div>
                  <div className="text-xs text-gray-600">Actual</div>
                </div>
                <div className="text-center bg-gray-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-gray-600">95%</div>
                  <div className="text-xs text-gray-600">Meta 2026</div>
                </div>
              </div>
            </div>
            
            {/* Fuentes de Energía - Gráfica Circular */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl border border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-anton text-gray-800 uppercase tracking-wide mb-2">
                  Mix Energético
                </h3>
                <p className="text-gray-600">Distribución de fuentes renovables</p>
              </div>
              
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={energySourcesData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {energySourcesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any, name: string) => [`${value}%`, name]}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '2px solid #273949',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-3">
                {energySourcesData.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: source.color }}></div>
                      <span className="font-medium text-gray-800">{source.name}</span>
                    </div>
                    <span className="font-bold text-gray-800">{source.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Análisis detallado con gráficas mejoradas */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
            <h2 className="text-2xl font-anton text-gray-800 mb-8 uppercase tracking-wide text-center">
              Análisis Energético Detallado
            </h2>
            
            <Tabs defaultValue="consumption" className="w-full">
              <TabsList className="mb-8 bg-gray-100 p-1 rounded-xl">
                <TabsTrigger value="consumption" className="data-[state=active]:bg-white data-[state=active]:shadow-md">Consumo</TabsTrigger>
                <TabsTrigger value="renewable" className="data-[state=active]:bg-white data-[state=active]:shadow-md">Renovables</TabsTrigger>
                <TabsTrigger value="efficiency" className="data-[state=active]:bg-white data-[state=active]:shadow-md">Eficiencia</TabsTrigger>
                <TabsTrigger value="costs" className="data-[state=active]:bg-white data-[state=active]:shadow-md">Costos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="consumption">
                <div className="space-y-8">
                  <div className="h-[450px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={energyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <defs>
                          <linearGradient id="consumoGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#273949" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#273949" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="renovableGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="metaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} />
                        <XAxis dataKey="month" fontSize={14} stroke="#374151" fontWeight="600" />
                        <YAxis fontSize={12} stroke="#6b7280" tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} />
                        <Tooltip 
                          formatter={(value: any, name: string) => [
                            `${Number(value).toLocaleString()} kWh`, 
                            name === 'consumo' ? 'Consumo Total' : 
                            name === 'renovable' ? 'Energía Renovable' : 
                            name === 'meta' ? 'Meta Renovable' : name
                          ]}
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '2px solid #273949',
                            borderRadius: '16px',
                            fontSize: '14px',
                            fontWeight: '600',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '14px', fontWeight: '600' }} />
                        <Area dataKey="consumo" stackId="1" stroke="#273949" fill="url(#consumoGradient)" strokeWidth={3} name="Consumo Total" />
                        <Area dataKey="renovable" stackId="1" stroke="#22c55e" fill="url(#renovableGradient)" strokeWidth={3} name="Energía Renovable" />
                        <Line type="monotone" dataKey="meta" stroke="#f59e0b" strokeWidth={4} strokeDasharray="5 5" name="Meta Renovable" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                      <div className="text-center">
                        <div className="text-2xl font-black text-blue-600 mb-2">{(totalConsumo/1000).toFixed(0)} MWh</div>
                        <div className="text-sm font-bold text-gray-800">Consumo Total 2024</div>
                        <div className="text-xs text-gray-600 mt-2">-5.2% vs 2023</div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                      <div className="text-center">
                        <div className="text-2xl font-black text-green-600 mb-2">{(totalRenovable/1000).toFixed(0)} MWh</div>
                        <div className="text-sm font-bold text-gray-800">Energía Renovable</div>
                        <div className="text-xs text-gray-600 mt-2">+125% vs 2023</div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100">
                      <div className="text-center">
                        <div className="text-2xl font-black text-yellow-600 mb-2">{porcentajeRenovable}%</div>
                        <div className="text-sm font-bold text-gray-800">% Renovable Actual</div>
                        <div className="text-xs text-gray-600 mt-2">Meta: 50% (2026)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="renewable">
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={energyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                          <defs>
                            <linearGradient id="renovableGlow" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="proyeccionGlow" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} />
                          <XAxis dataKey="month" fontSize={14} stroke="#374151" fontWeight="600" />
                          <YAxis fontSize={12} stroke="#6b7280" tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} />
                          <Tooltip 
                            formatter={(value: any, name: string) => [
                              `${Number(value).toLocaleString()} kWh`, 
                              name === 'renovable' ? 'Energía Generada' : 
                              name === 'proyeccion' ? 'Proyección Solar' : name
                            ]}
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              border: '3px solid #22c55e',
                              borderRadius: '16px',
                              fontSize: '14px',
                              fontWeight: '600',
                              boxShadow: '0 10px 25px rgba(34,197,94,0.2)'
                            }}
                          />
                          <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '14px', fontWeight: '600' }} />
                          <Area dataKey="renovable" stroke="#22c55e" fill="url(#renovableGlow)" strokeWidth={4} name="Energía Generada" />
                          <Line type="monotone" dataKey="proyeccion" stroke="#3b82f6" strokeWidth={4} strokeDasharray="8 4" name="Proyección Solar" />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                        <h3 className="text-xl font-anton text-green-800 mb-4 uppercase tracking-wide">Panel Solar Avandaro</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-green-100">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                              <span className="font-bold text-gray-800">Generación Solar</span>
                            </div>
                            <span className="text-lg font-black text-green-600">72%</span>
                          </div>
                          
                          <div className="flex justify-between items-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-blue-100">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                              <span className="font-bold text-gray-800">Compra CFE</span>
                            </div>
                            <span className="text-lg font-black text-blue-600">28%</span>
                          </div>
                          
                          <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-yellow-100 rounded-xl">
                            <div className="text-center">
                              <div className="text-2xl font-black text-green-700">{((totalRenovable/totalConsumo) * 100).toFixed(1)}%</div>
                              <div className="text-sm font-bold text-gray-700">Autosuficiencia Energética</div>
                              <div className="text-xs text-gray-600 mt-1">Meta 2026: 65%</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 text-center border border-yellow-200">
                      <div className="text-2xl font-black text-yellow-600">850 kW</div>
                      <div className="text-sm font-bold text-gray-800">Capacidad Instalada</div>
                      <div className="text-xs text-gray-600 mt-1">1,247 paneles</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center border border-green-200">
                      <div className="text-2xl font-black text-green-600">{(totalRenovable/1000).toFixed(0)} MWh</div>
                      <div className="text-sm font-bold text-gray-800">Energía Generada</div>
                      <div className="text-xs text-gray-600 mt-1">Año 2024</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 text-center border border-blue-200">
                      <div className="text-2xl font-black text-blue-600">$1.35M</div>
                      <div className="text-sm font-bold text-gray-800">Ahorro Generado</div>
                      <div className="text-xs text-gray-600 mt-1">vs compra CFE</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 text-center border border-purple-200">
                      <div className="text-2xl font-black text-purple-600">98.7%</div>
                      <div className="text-sm font-bold text-gray-800">Disponibilidad</div>
                      <div className="text-xs text-gray-600 mt-1">Uptime sistema</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="efficiency">
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl border border-gray-200">
                      <h3 className="text-xl font-anton text-gray-800 mb-6 uppercase tracking-wide text-center">
                        Eficiencia Mensual
                      </h3>
                      <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={energyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <defs>
                              <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} />
                            <XAxis dataKey="month" fontSize={14} stroke="#374151" fontWeight="600" />
                            <YAxis domain={[80, 95]} fontSize={12} stroke="#6b7280" tickFormatter={(value) => `${value}%`} />
                            <Tooltip 
                              formatter={(value: any) => [`${value}%`, 'Eficiencia Energética']}
                              contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '3px solid #3b82f6',
                                borderRadius: '16px',
                                fontSize: '14px',
                                fontWeight: '600',
                                boxShadow: '0 10px 25px rgba(59,130,246,0.2)'
                              }}
                            />
                            <Area 
                              dataKey="eficiencia" 
                              stroke="#3b82f6" 
                              fill="url(#efficiencyGradient)" 
                              strokeWidth={4}
                              name="Eficiencia"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 border border-blue-200">
                        <h3 className="text-xl font-anton text-blue-800 mb-6 uppercase tracking-wide text-center">
                          Medidas Implementadas
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-green-100">
                            <div className="flex items-center space-x-3">
                              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="font-bold text-gray-800">Iluminación LED</span>
                            </div>
                            <span className="text-lg font-black text-green-600">100%</span>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-blue-100">
                            <div className="flex items-center space-x-3">
                              <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                              <span className="font-bold text-gray-800">HVAC Inteligente</span>
                            </div>
                            <span className="text-lg font-black text-blue-600">85%</span>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-purple-100">
                            <div className="flex items-center space-x-3">
                              <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
                              <span className="font-bold text-gray-800">Monitoreo IoT</span>
                            </div>
                            <span className="text-lg font-black text-purple-600">95%</span>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-yellow-100">
                            <div className="flex items-center space-x-3">
                              <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
                              <span className="font-bold text-gray-800">Aislamiento</span>
                            </div>
                            <span className="text-lg font-black text-yellow-600">78%</span>
                          </div>
                        </div>
                        
                        <div className="mt-6 p-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl">
                          <div className="text-center">
                            <div className="text-2xl font-black text-blue-700">{eficienciaPromedio}%</div>
                            <div className="text-sm font-bold text-gray-700">Eficiencia Promedio</div>
                            <div className="text-xs text-gray-600 mt-1">Meta 2026: 95%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center border border-green-200">
                      <div className="text-2xl font-black text-green-600">25%</div>
                      <div className="text-sm font-bold text-gray-800">Reducción Consumo</div>
                      <div className="text-xs text-gray-600 mt-1">vs baseline 2022</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 text-center border border-blue-200">
                      <div className="text-2xl font-black text-blue-600">$850k</div>
                      <div className="text-sm font-bold text-gray-800">Ahorro Eficiencia</div>
                      <div className="text-xs text-gray-600 mt-1">Año 2024</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 text-center border border-purple-200">
                      <div className="text-2xl font-black text-purple-600">24/7</div>
                      <div className="text-sm font-bold text-gray-800">Monitoreo</div>
                      <div className="text-xs text-gray-600 mt-1">Tiempo real</div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 text-center border border-yellow-200">
                      <div className="text-2xl font-black text-yellow-600">2.1 años</div>
                      <div className="text-sm font-bold text-gray-800">ROI Eficiencia</div>
                      <div className="text-xs text-gray-600 mt-1">Payback period</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="costs">
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl border border-gray-200">
                      <h3 className="text-xl font-anton text-gray-800 mb-6 uppercase tracking-wide text-center">
                        Evolución de Costos
                      </h3>
                      <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={energyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <defs>
                              <linearGradient id="costoGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                              </linearGradient>
                              <linearGradient id="ahorroGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} />
                            <XAxis dataKey="month" fontSize={14} stroke="#374151" fontWeight="600" />
                            <YAxis fontSize={12} stroke="#6b7280" tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                            <Tooltip 
                              formatter={(value: any, name: string) => [
                                `$${Number(value).toLocaleString()}`, 
                                name === 'costo' ? 'Costo Real' : 'Ahorro vs CFE'
                              ]}
                              contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '3px solid #f59e0b',
                                borderRadius: '16px',
                                fontSize: '14px',
                                fontWeight: '600',
                                boxShadow: '0 10px 25px rgba(245,158,11,0.2)'
                              }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '14px', fontWeight: '600' }} />
                            <Area 
                              dataKey="costo" 
                              stroke="#f59e0b" 
                              fill="url(#costoGradient)" 
                              strokeWidth={4}
                              name="Costo Real"
                            />
                            <Bar 
                              dataKey="meta" 
                              fill="url(#ahorroGradient)" 
                              name="Ahorro vs CFE"
                              radius={[4, 4, 0, 0]}
                            />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-8 border border-yellow-200">
                        <h3 className="text-xl font-anton text-yellow-800 mb-6 uppercase tracking-wide text-center">
                          Análisis de Ahorros
                        </h3>
                        
                        <div className="space-y-4">
                          <div className="p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-green-100">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-gray-800">Ahorro Mensual Promedio</span>
                              <span className="text-xl font-black text-green-600">$112k</span>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">vs tarifa CFE estándar</div>
                          </div>
                          
                          <div className="p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-blue-100">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-gray-800">Costo kWh Solar</span>
                              <span className="text-xl font-black text-blue-600">$0.85</span>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">vs $2.45 tarifa CFE</div>
                          </div>
                          
                          <div className="p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-purple-100">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-gray-800">ROI Proyecto</span>
                              <span className="text-xl font-black text-purple-600">3.2 años</span>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">Payback period</div>
                          </div>
                        </div>
                        
                        <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
                          <div className="text-center">
                            <div className="text-2xl font-black text-green-700">65%</div>
                            <div className="text-sm font-bold text-gray-700">Reducción de Costos</div>
                            <div className="text-xs text-gray-600 mt-1">vs energía convencional</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl border border-gray-200">
                    <h3 className="text-2xl font-anton text-gray-800 mb-8 uppercase tracking-wide text-center">
                      Proyección Financiera Quinquenal
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                      <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                        <div className="text-lg font-black text-green-600 mb-2">2024</div>
                        <div className="text-2xl font-black text-green-700">$1.35M</div>
                        <div className="text-sm font-bold text-gray-800">Ahorro Real</div>
                        <div className="text-xs text-gray-600 mt-1">vs año anterior</div>
                      </div>
                      
                      <div className="text-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                        <div className="text-lg font-black text-blue-600 mb-2">2025</div>
                        <div className="text-2xl font-black text-blue-700">$2.1M</div>
                        <div className="text-sm font-bold text-gray-800">Proyectado</div>
                        <div className="text-xs text-gray-600 mt-1">+56% crecimiento</div>
                      </div>
                      
                      <div className="text-center bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                        <div className="text-lg font-black text-purple-600 mb-2">2026</div>
                        <div className="text-2xl font-black text-purple-700">$2.8M</div>
                        <div className="text-sm font-bold text-gray-800">Proyectado</div>
                        <div className="text-xs text-gray-600 mt-1">+33% crecimiento</div>
                      </div>
                      
                      <div className="text-center bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                        <div className="text-lg font-black text-yellow-600 mb-2">2027</div>
                        <div className="text-2xl font-black text-yellow-700">$3.2M</div>
                        <div className="text-sm font-bold text-gray-800">Proyectado</div>
                        <div className="text-xs text-gray-600 mt-1">+14% crecimiento</div>
                      </div>
                      
                      <div className="text-center bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border border-red-200">
                        <div className="text-lg font-black text-red-600 mb-2">Total</div>
                        <div className="text-2xl font-black text-red-700">$8.7M</div>
                        <div className="text-sm font-bold text-gray-800">Ahorro 5 años</div>
                        <div className="text-xs text-gray-600 mt-1">Acumulado</div>
                      </div>
                    </div>
                    
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-6">
                        <div className="text-3xl font-black text-green-700 mb-2">147%</div>
                        <div className="text-sm font-bold text-gray-800">ROI Acumulado</div>
                        <div className="text-xs text-gray-600">Return on Investment</div>
                      </div>
                      <div className="text-center bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl p-6">
                        <div className="text-3xl font-black text-blue-700 mb-2">$5.9M</div>
                        <div className="text-sm font-bold text-gray-800">Inversión Total</div>
                        <div className="text-xs text-gray-600">Proyecto solar completo</div>
                      </div>
                      <div className="text-center bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-6">
                        <div className="text-3xl font-black text-purple-700 mb-2">25</div>
                        <div className="text-sm font-bold text-gray-800">Años Garantía</div>
                        <div className="text-xs text-gray-600">Paneles solares</div>
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