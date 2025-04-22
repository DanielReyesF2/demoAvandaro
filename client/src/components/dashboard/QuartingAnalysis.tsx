import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface QuartingAnalysisProps {
  wasteData: any[];
  clientId: number;
}

export default function QuartingAnalysis({ wasteData, clientId }: QuartingAnalysisProps) {
  // Datos del último cuarteo realizado según requerimientos del cliente
  // 70% de residuos orgánicos de comedor en la composición
  const quartingResults = [
    { name: 'Orgánico (Comedor)', value: 70.0, color: '#5f27cd' },
    { name: 'Plástico PET', value: 6.8, color: '#ff6b6b' },
    { name: 'Papel', value: 8.2, color: '#48dbfb' },
    { name: 'Cartón', value: 5.7, color: '#feca57' },
    { name: 'Metal', value: 2.4, color: '#1dd1a1' },
    { name: 'Vidrio', value: 3.1, color: '#00d2d3' },
    { name: 'No reciclable', value: 3.8, color: '#c8d6e5' }
  ];
  
  // Datos de lo que va a relleno sanitario pero es aprovechable (78%)
  const contaminationData = [
    { name: 'Residuos aprovechables', value: 78, color: '#10ac84' },
    { name: 'No aprovechable', value: 22, color: '#ee5253' }
  ];
  
  // Potencial reciclable según análisis (valor fijo)
  const recyclablePotential = 78;
  
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
                    innerRadius={0}
                    outerRadius={90} 
                    fill="#8884d8" 
                    paddingAngle={1} 
                    dataKey="value"
                    label={false}
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
                  <Legend 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right"
                    payload={
                      quartingResults.map((item, index) => ({
                        id: item.name,
                        value: `${item.name} ${item.value}%`,
                        color: item.color,
                        type: 'square'
                      }))
                    }
                    formatter={(value) => <span className="text-xs">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 flex justify-center">
              <div className="bg-gray-50 px-5 py-3 rounded-lg text-center">
                <div className="text-xs text-gray-500">Potencial Reciclable</div>
                <div className="text-2xl font-bold text-navy">{recyclablePotential}%</div>
              </div>
            </div>
          </div>
          
          {/* Análisis de lo enviado a relleno sanitario */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Análisis de Residuos a Relleno Sanitario</h3>
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
                    label={false}
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
                  <Legend 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right"
                    payload={
                      contaminationData.map((item, index) => ({
                        id: item.name,
                        value: `${item.name} ${item.value}%`,
                        color: item.color,
                        type: 'square'
                      }))
                    }
                    formatter={(value) => <span className="text-xs">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg mt-4">
              <div className="text-xs text-gray-500 mb-1">Observaciones</div>
              <div className="text-sm text-gray-700">
                <p className="mb-1">Se siguen encontrando residuos reciclables dentro de lo que va a relleno sanitario debido a un mal manejo interno.</p>
                <p>Aproximadamente el 78% de lo que va a relleno sanitario es realmente aprovechable con una correcta separación en origen.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold mb-2 text-gray-700">Hallazgos principales</h3>
          <ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
            <li>El 70% de la composición corresponde a residuos orgánicos de comedor</li>
            <li>El 78% de los residuos que actualmente van a relleno sanitario son potencialmente aprovechables</li>
            <li>Existe una oportunidad de incrementar el índice de desviación actual (37.18%) significativamente</li>
            <li>Se requiere mejorar la capacitación del personal y la señalización de contenedores para reducir la contaminación</li>
            <li>Los residuos de Papel y Cartón (13.9% combinado) representan una importante oportunidad de captura</li>
          </ul>
        </div>
        
        <div className="mt-4 text-xs text-center text-gray-500 border-t pt-3">
          Los resultados del análisis de cuarteo proveen una caracterización detallada de residuos para optimizar estrategias de reciclaje
        </div>
      </CardContent>
    </Card>
  );
}