import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface QuartingAnalysisProps {
  wasteData: any[];
  clientId: number;
}

export default function QuartingAnalysis({ wasteData, clientId }: QuartingAnalysisProps) {
  // Datos del último cuarteo realizado (simulados para esta demostración)
  // En una aplicación real, estos datos vendrían de la base de datos
  const quartingResults = [
    { name: 'Plástico PET', value: 18.4, color: '#ff6b6b' },
    { name: 'Papel', value: 22.7, color: '#48dbfb' },
    { name: 'Cartón', value: 15.3, color: '#feca57' },
    { name: 'Metal', value: 7.8, color: '#1dd1a1' },
    { name: 'Vidrio', value: 9.2, color: '#00d2d3' },
    { name: 'Orgánico', value: 14.6, color: '#5f27cd' },
    { name: 'No reciclable', value: 12.0, color: '#c8d6e5' }
  ];
  
  // Datos de contaminación en reciclables
  const contaminationData = [
    { name: 'Correctamente separado', value: 78, color: '#10ac84' },
    { name: 'Contaminado', value: 22, color: '#ee5253' }
  ];
  
  // Calcular potencial de reciclaje basado en auditoría
  const recyclablePotential = quartingResults.reduce((sum, item) => {
    // Consideramos como potencialmente reciclables: PET, Papel, Cartón, Metal y Vidrio
    if (['Plástico PET', 'Papel', 'Cartón', 'Metal', 'Vidrio'].includes(item.name)) {
      return sum + item.value;
    }
    return sum;
  }, 0);
  
  // Factor de rendimiento (ratio entre reciclaje actual y potencial)
  const actualRecyclingPercentage = 37;  // Este es el índice de desviación actual
  const efficiencyFactor = Math.round((actualRecyclingPercentage / recyclablePotential) * 100);
  
  // Fecha de la última auditoría
  const lastAuditDate = new Date(2025, 2, 15);  // 15 de marzo de 2025
  
  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white text-xl">Análisis de Cuarteo</CardTitle>
          <div className="px-2 py-1 bg-white/20 rounded-full text-xs text-white font-semibold">
            Última auditoría: {lastAuditDate.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Composición detallada de residuos */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Composición de Residuos</h3>
            <div className="flex-1 h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={quartingResults} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={60}
                    outerRadius={90} 
                    fill="#8884d8" 
                    paddingAngle={1} 
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                    labelLine={false}
                  >
                    {quartingResults.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Proporción']}
                    contentStyle={{
                      backgroundColor: 'white', 
                      borderRadius: '0.5rem',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      border: 'none',
                      padding: '10px 14px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Potencial Reciclable</div>
                <div className="text-lg font-semibold text-navy">{recyclablePotential.toFixed(1)}%</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Factor de Eficiencia</div>
                <div className="text-lg font-semibold text-navy">{efficiencyFactor}%</div>
              </div>
            </div>
          </div>
          
          {/* Calidad de separación */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Calidad de Separación en Reciclables</h3>
            <div className="flex-1 h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={contaminationData} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={0}
                    outerRadius={90} 
                    fill="#8884d8" 
                    paddingAngle={0} 
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {contaminationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Proporción']}
                    contentStyle={{
                      backgroundColor: 'white', 
                      borderRadius: '0.5rem',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      border: 'none',
                      padding: '10px 14px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg mt-4">
              <div className="text-xs text-gray-500 mb-1">Observaciones</div>
              <div className="text-sm text-gray-700">
                Los contenedores de reciclables muestran un nivel de contaminación del 22%, principalmente con residuos orgánicos. 
                Se recomienda reforzar capacitación y mejorar señalización de contenedores.
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold mb-2 text-gray-700">Hallazgos principales</h3>
          <ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
            <li>El potencial total de reciclaje según composición es del {recyclablePotential.toFixed(1)}%</li>
            <li>Existe una oportunidad de incrementar el índice de desviación en {(recyclablePotential - actualRecyclingPercentage).toFixed(1)} puntos porcentuales</li>
            <li>Los residuos de Papel y Cartón representan la mayor oportunidad de captura (38% combinado)</li>
            <li>La contaminación en contenedores de reciclables ha disminuido un 5% desde la auditoría anterior</li>
          </ul>
        </div>
        
        <div className="mt-4 text-xs text-center text-gray-500 border-t pt-3">
          Los resultados del análisis de cuarteo proveen una caracterización detallada de residuos para optimizar estrategias de reciclaje
        </div>
      </CardContent>
    </Card>
  );
}