import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowDown,
  Recycle, 
  Leaf, 
  Trash2, 
  Factory,
  TreePine,
  Droplets,
  Zap,
  Package,
  Coffee,
  Utensils,
  Newspaper,
  Wine,
  Battery,
  Building2,
  ChefHat,
  Users,
  MapPin,
  MoveRight
} from 'lucide-react';

interface WasteFlow {
  id: string;
  name: string;
  category: 'organico' | 'inorganico' | 'reciclable';
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  destination: string;
  partner: string;
  volume: number; // toneladas mensuales promedio
  description: string;
  origins: string[]; // puntos de origen específicos
}

const wasteFlows: WasteFlow[] = [
  // ORGÁNICOS - Basado en la imagen detallada del Club
  {
    id: 'aceite-residual',
    name: 'Aceite Residual',
    category: 'organico',
    icon: <Droplets className="w-5 h-5" />,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    destination: 'Revalorización (Insumo para biodiesel)',
    partner: 'Reoil',
    volume: 0.8,
    description: 'Aceite usado de cocinas convertido a biodiesel sostenible',
    origins: ['Acuarima, Restaurante Jose', 'Casa Club', 'Cocinas de eventos', 'Campo', 'Canchas de Tennis', 'Canchas de Padel']
  },
  {
    id: 'grasa-cascaras',
    name: 'Grasa y Cáscaras de Fruta',
    category: 'organico',
    icon: <Utensils className="w-5 h-5" />,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    destination: 'Recolección y disposición de grasa cocinas',
    partner: 'TEDISD Innovative Group',
    volume: 3.2,
    description: 'Grasas de cocina y cáscaras de frutas procesadas sustainably',
    origins: ['Acuarima, Restaurante Jose', 'Cocina Casa Club', 'Área de preparación', 'Campo', 'Canchas de Tennis', 'Canchas de Padel']
  },
  {
    id: 'organicos-complejos',
    name: 'Orgánicos Diversos',
    category: 'organico',
    icon: <TreePine className="w-5 h-5" />,
    color: 'text-green-700',
    bgColor: 'bg-green-200',
    destination: 'Biodegradación mediante biodigestor ORKA',
    partner: 'ORKA',
    volume: 17.6,
    description: 'Pan, pescados, carne, huevo, queso, pollo, pasta, arroz, frutas, azúcar, salsas, papa, caña, conchas, aceites, café',
    origins: ['Acuarima, Restaurante Jose', 'Casa Club', 'Eventos especiales', 'Cocinas auxiliares', 'Campo', 'Canchas de Tennis', 'Canchas de Padel']
  },

  // RECICLABLES - Clasificación profesional detallada
  {
    id: 'papel-carton-periodico',
    name: 'Papel y Cartón',
    category: 'reciclable',
    icon: <Newspaper className="w-5 h-5" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    destination: 'Revalorización Reciclado Refabricación',
    partner: 'Recupera (Centros de Reciclaje)',
    volume: 2.1,
    description: 'Papel, periódico, revistas, cartón - proceso completo de refabricación',
    origins: ['Oficinas administrativas', 'Casa Club', 'Recepción', 'Campo', 'Canchas de Tennis', 'Canchas de Padel']
  },
  {
    id: 'vidrio-sat-timbrado',
    name: 'Vidrio (Timbrado SAT)',
    category: 'reciclable',
    icon: <Wine className="w-5 h-5" />,
    color: 'text-blue-700',
    bgColor: 'bg-blue-200',
    destination: 'Revalorización Proceso Refabricación',
    partner: 'Cerrando el Ciclo',
    volume: 1.2,
    description: 'Vidrio certificado SAT para proceso de refabricación industrial',
    origins: ['Bar y Acuarima, Restaurante Jose', 'Eventos especiales', 'Áreas VIP', 'Campo', 'Canchas de Tennis', 'Canchas de Padel']
  },
  {
    id: 'plasticos-polipropileno',
    name: 'Plásticos PET/HDPE',
    category: 'reciclable',
    icon: <Package className="w-5 h-5" />,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    destination: 'Donación para revalorización',
    partner: 'Verde Ciudad',
    volume: 1.9,
    description: 'Vidrio PET HDPE, plástico duro, aluminio, tapas de polipropileno',
    origins: ['Casa Club', 'Acuarima, Restaurante Jose', 'Áreas comunes', 'Eventos', 'Campo', 'Canchas de Tennis', 'Canchas de Padel']
  },

  // INORGÁNICOS - Sistema completo de manejo
  {
    id: 'residuos-electronicos-complejos',
    name: 'Residuos Electrónicos',
    category: 'inorganico',
    icon: <Battery className="w-5 h-5" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    destination: 'Recuperación Revalorización Reciclaje',
    partner: 'eWaste Group',
    volume: 0.3,
    description: 'Blancos, losa, objetos perdidos, mobiliario, equipos electrónicos',
    origins: ['Oficinas administrativas', 'Sistemas Casa Club', 'Mantenimiento', 'Campo', 'Canchas de Tennis', 'Canchas de Padel']
  },
  {
    id: 'cartuchos-nikken-especializados',
    name: 'Cartuchos Nikken',
    category: 'inorganico',
    icon: <Factory className="w-5 h-5" />,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    destination: 'Donación para revalorización',
    partner: 'NIKKEN',
    volume: 0.1,
    description: 'Cartuchos de tinta y tóner para remanufactura especializada',
    origins: ['Oficinas', 'Centros de impresión', 'Administración', 'Campo', 'Canchas de Tennis', 'Canchas de Padel']
  },
  {
    id: 'residuos-generales-controlados',
    name: 'Residuos Generales',
    category: 'inorganico',
    icon: <Trash2 className="w-5 h-5" />,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    destination: 'Donaciones o Defensa SGA',
    partner: 'Amistad Cristiano / KREY',
    volume: 5.8,
    description: 'Reprocesamiento y Compostaje cuando es iniciado - disposición controlada',
    origins: ['Casa Club general', 'Mantenimiento', 'Áreas comunes', 'Campo', 'Canchas de Tennis', 'Canchas de Padel']
  }
];

interface WasteFlowVisualizationProps {
  totalWasteDiverted: number;
}

export function WasteFlowVisualization({ totalWasteDiverted }: WasteFlowVisualizationProps) {
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  const [animatingParticles, setAnimatingParticles] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatingParticles(prev => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const organicFlows = wasteFlows.filter(flow => flow.category === 'organico');
  const recyclableFlows = wasteFlows.filter(flow => flow.category === 'reciclable');
  const inorganicFlows = wasteFlows.filter(flow => flow.category === 'inorganico');

  const totalVolume = wasteFlows.reduce((sum, flow) => sum + flow.volume, 0);
  const diversionRate = ((totalVolume - inorganicFlows.reduce((sum, flow) => sum + flow.volume, 0)) / totalVolume * 100);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-10 shadow-xl border border-gray-200">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-anton uppercase tracking-wide mb-3 text-[#b5e951]">Flujos de Materiales</h2>
        <p className="text-lg text-gray-600">
          Diagrama de flujo integral de gestión de residuos
        </p>
      </div>

      {/* Diagrama de Flujo Horizontal tipo Sankey */}
      <div className="relative max-w-6xl mx-auto">
        
        {/* Contenedor principal del flujo */}
        <div className="flex items-center justify-between gap-8 max-w-5xl mx-auto">
          
          {/* LADO IZQUIERDO - Puntos de Origen */}
          <div className="w-72 space-y-3">
            <div className="text-center mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Puntos de Origen</span>
            </div>
            
            {/* Puntos de origen con volúmenes */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3 text-white shadow-lg">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5" />
                <div>
                  <div className="font-semibold text-sm">Casa Club</div>
                  <div className="text-xs opacity-90">6.2 ton/mes</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-3 text-white shadow-lg">
              <div className="flex items-center space-x-2">
                <ChefHat className="w-5 h-5" />
                <div>
                  <div className="font-semibold text-sm">Acuarima, Restaurante Jose</div>
                  <div className="text-xs opacity-90">18.4 ton/mes</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-3 text-white shadow-lg">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <div>
                  <div className="font-semibold text-sm">Eventos & Instalaciones</div>
                  <div className="text-xs opacity-90">8.4 ton/mes</div>
                </div>
              </div>
            </div>

            {/* Total de Entrada */}
            <div className="bg-gradient-to-r from-[#273949] to-slate-700 rounded-xl p-3 text-white shadow-xl border-2 border-[#b5e951] mt-4">
              <div className="text-center">
                <div className="text-lg font-black">33.0 ton/mes</div>
                <div className="text-xs font-semibold uppercase tracking-wide">Total Generado</div>
              </div>
            </div>
          </div>

          {/* FLUJOS CENTRALES - Líneas animadas */}
          <div className="flex-1 max-w-md relative py-8">
            
            {/* Líneas de flujo con animación */}
            <div className="space-y-6">
              
              {/* Flujo Orgánicos */}
              <div className="relative">
                <div className="h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full relative overflow-hidden shadow-lg">
                  <div className="absolute inset-0 bg-white opacity-30 transform -skew-x-12"></div>
                  <div className={`absolute left-0 top-0 w-6 h-full bg-white opacity-50 rounded-full transform transition-transform duration-2000 ${
                    animatingParticles ? 'translate-x-full' : 'translate-x-0'
                  }`}></div>
                </div>
                <div className="absolute -top-1 left-2 text-xs font-bold text-green-700">Orgánicos: 21.6 ton</div>
                <div className="absolute -bottom-1 left-2 text-xs text-gray-500">65.5%</div>
                <MoveRight className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />
              </div>

              {/* Flujo Reciclables */}
              <div className="relative">
                <div className="h-7 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full relative overflow-hidden shadow-lg">
                  <div className="absolute inset-0 bg-white opacity-30 transform -skew-x-12"></div>
                  <div className={`absolute left-0 top-0 w-5 h-full bg-white opacity-50 rounded-full transform transition-transform duration-2000 delay-300 ${
                    animatingParticles ? 'translate-x-full' : 'translate-x-0'
                  }`}></div>
                </div>
                <div className="absolute -top-1 left-2 text-xs font-bold text-blue-700">Reciclables: 5.2 ton</div>
                <div className="absolute -bottom-1 left-2 text-xs text-gray-500">15.8%</div>
                <MoveRight className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600" />
              </div>

              {/* Flujo Inorgánicos */}
              <div className="relative">
                <div className="h-5 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full relative overflow-hidden shadow-lg">
                  <div className="absolute inset-0 bg-white opacity-30 transform -skew-x-12"></div>
                  <div className={`absolute left-0 top-0 w-4 h-full bg-white opacity-50 rounded-full transform transition-transform duration-2000 delay-600 ${
                    animatingParticles ? 'translate-x-full' : 'translate-x-0'
                  }`}></div>
                </div>
                <div className="absolute -top-1 left-2 text-xs font-bold text-gray-700">Inorgánicos: 6.2 ton</div>
                <div className="absolute -bottom-1 left-2 text-xs text-gray-500">18.7%</div>
                <MoveRight className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
              </div>

            </div>
          </div>

          {/* LADO DERECHO - Destinos Finales */}
          <div className="w-72 space-y-3">
            <div className="text-center mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Destinos Finales</span>
            </div>

            {/* Destinos con socios */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-3 text-white shadow-lg">
              <div className="flex items-center space-x-2">
                <Leaf className="w-5 h-5" />
                <div>
                  <div className="font-semibold text-sm">Biodegradación</div>
                  <div className="text-xs opacity-90">ORKA · TEDISD</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-3 text-white shadow-lg">
              <div className="flex items-center space-x-2">
                <Recycle className="w-5 h-5" />
                <div>
                  <div className="font-semibold text-sm">Reciclaje</div>
                  <div className="text-xs opacity-90">Recupera · Verde Ciudad</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-500 to-slate-600 rounded-xl p-3 text-white shadow-lg">
              <div className="flex items-center space-x-2">
                <Trash2 className="w-5 h-5" />
                <div>
                  <div className="font-semibold text-sm">Disposición</div>
                  <div className="text-xs opacity-90">Controlada · KREY</div>
                </div>
              </div>
            </div>

            {/* Impacto Ambiental */}
            <div className="bg-gradient-to-r from-[#b5e951] to-lime-400 rounded-xl p-3 text-[#273949] shadow-xl border-2 border-[#273949] mt-4">
              <div className="text-center">
                <div className="text-lg font-black">81.3%</div>
                <div className="text-xs font-semibold uppercase tracking-wide">Desviación de Relleno</div>
              </div>
            </div>
          </div>

        </div>

        {/* Métricas de Impacto */}
        <div className="mt-12 bg-gradient-to-r from-[#273949] to-slate-700 rounded-3xl p-8 text-white">
          <div className="grid grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl font-black text-[#b5e951]">72%</div>
              <div className="text-xs font-semibold uppercase tracking-wide">Circularidad</div>
            </div>
            <div>
              <div className="text-2xl font-black text-green-400">21.6 ton</div>
              <div className="text-xs font-semibold uppercase tracking-wide">Compostaje</div>
            </div>
            <div>
              <div className="text-2xl font-black text-blue-400">5.2 ton</div>
              <div className="text-xs font-semibold uppercase tracking-wide">Reciclado</div>
            </div>
            <div>
              <div className="text-2xl font-black text-gray-400">6.2 ton</div>
              <div className="text-xs font-semibold uppercase tracking-wide">Remanente</div>
            </div>
          </div>
        </div>

      </div>
      
    </div>
  );
}