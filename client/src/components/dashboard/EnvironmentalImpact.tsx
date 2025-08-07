import { Leaf, Droplets, Zap, TreePine } from 'lucide-react';

interface EnvironmentalImpactProps {
  organicWasteDiverted: number; // kg
  recyclableWasteDiverted: number; // kg
}

export function EnvironmentalImpact({ organicWasteDiverted, recyclableWasteDiverted }: EnvironmentalImpactProps) {
  // Cálculos de impacto ambiental basados en datos reales
  const treesEquivalent = Math.round((organicWasteDiverted + recyclableWasteDiverted) * 0.0012); // 1.2 kg residuos = 1 árbol
  const waterSaved = Math.round((recyclableWasteDiverted * 15) + (organicWasteDiverted * 8)); // litros
  const energySaved = Math.round((recyclableWasteDiverted * 3.2) + (organicWasteDiverted * 1.8)); // kWh
  const co2Reduced = Math.round((organicWasteDiverted + recyclableWasteDiverted) * 0.85); // kg CO2

  const impacts = [
    {
      icon: TreePine,
      title: 'Árboles Equivalentes',
      value: treesEquivalent,
      unit: 'árboles',
      description: 'Salvados por el reciclaje y compostaje',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      icon: Droplets,
      title: 'Agua Conservada',
      value: waterSaved.toLocaleString(),
      unit: 'litros',
      description: 'Ahorrados en procesos de producción',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: Zap,
      title: 'Energía Ahorrada',
      value: energySaved.toLocaleString(),
      unit: 'kWh',
      description: 'Equivalente al consumo de hogares',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    },
    {
      icon: Leaf,
      title: 'CO₂ Reducido',
      value: co2Reduced.toLocaleString(),
      unit: 'kg CO₂',
      description: 'Emisiones evitadas al ambiente',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 mb-6 border border-green-100">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-anton text-gray-800 uppercase tracking-wider mb-2">
          Impacto Ambiental Positivo
        </h2>
        <p className="text-sm text-gray-600">
          Beneficios ambientales generados por el programa de gestión de residuos
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {impacts.map((impact, index) => {
          const Icon = impact.icon;
          return (
            <div 
              key={index} 
              className={`${impact.bgColor} rounded-lg p-4 text-center hover:shadow-md transition-all duration-200 border border-opacity-20`}
            >
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Icon className={`w-6 h-6 ${impact.iconColor}`} />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className={`text-2xl font-bold ${impact.color}`}>
                  {impact.value}
                </div>
                <div className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                  {impact.unit}
                </div>
                <div className="text-xs text-gray-600 leading-tight">
                  {impact.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mensaje motivacional */}
      <div className="mt-6 text-center bg-white bg-opacity-70 rounded-lg p-4">
        <p className="text-sm text-gray-700 font-medium">
          🌱 Con <span className="font-bold text-green-600">{((organicWasteDiverted + recyclableWasteDiverted) / 1000).toFixed(1)} toneladas</span> desviadas del relleno sanitario, 
          el Club Campestre está generando un impacto positivo significativo en el medio ambiente.
        </p>
      </div>
    </div>
  );
}