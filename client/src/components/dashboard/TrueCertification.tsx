import React from 'react';
import { Shield, ClipboardCheck, AlertTriangle, Award, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateAndDownloadTrueCertificationReport } from '@/lib/trueCertificationReport';

interface TrueCertificationProps {
  currentDeviation: number;
}

export const TrueCertification: React.FC<TrueCertificationProps> = ({ currentDeviation }) => {
  // Objetivo para certificación TRUE Zero Waste
  const targetDeviation = 90;
  
  // Calcular el porcentaje de progreso hacia la meta
  const progressPercentage = Math.min(100, (currentDeviation / targetDeviation) * 100);
  
  // Determinar si estamos en nivel crítico, alertante o bueno
  const getStatusColor = () => {
    if (currentDeviation < 50) return 'bg-red-500';
    if (currentDeviation < 75) return 'bg-amber-500';
    return 'bg-green-500';
  };
  
  // Acciones pendientes para alcanzar la certificación
  const pendingActions = [
    {
      id: 1,
      title: 'Plan de Manejo Integral de Residuos',
      description: 'Desarrollar un plan documentado de gestión de residuos con objetivos medibles.',
      status: 'pending', // pending, in-progress, completed
    },
    {
      id: 2,
      title: 'Sistema de Compostaje',
      description: 'Implementar sistema de compostaje propio o contratar proveedor para residuos orgánicos.',
      status: 'in-progress',
    },
    {
      id: 3,
      title: 'Trazabilidad de Residuos',
      description: 'Establecer sistema de seguimiento para todos los flujos de residuos.',
      status: 'pending',
    },
    {
      id: 4,
      title: 'Capacitación del Personal',
      description: 'Capacitar a todo el personal en los protocolos de separación y reducción.',
      status: 'in-progress',
    },
    {
      id: 5,
      title: 'Políticas de Compras Sostenibles',
      description: 'Implementar políticas que prioricen productos con menor generación de residuos.',
      status: 'pending',
    },
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
      <div className="bg-navy p-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-8 w-8 mr-3 text-lime" />
            <div>
              <h2 className="text-xl font-anton tracking-wider uppercase">Certificación TRUE Zero Waste</h2>
              <p className="text-white/70 text-sm">Green Business Certification Inc. (GBCI)</p>
            </div>
          </div>
          
          <div className="bg-white/10 px-3 py-1 rounded-lg flex items-center">
            <span className="text-xs font-medium mr-2">Estado:</span>
            <span className="text-xs font-bold">Precertificación en proceso</span>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Progress towards certification */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-3">Progreso hacia certificación</h3>
            
            <div className="bg-gray-100 p-5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Desviación actual</span>
                <span className="font-bold text-navy">{currentDeviation.toFixed(1)}%</span>
              </div>
              
              <div className="w-full h-3 bg-gray-200 rounded-full mb-4">
                <div 
                  className={`h-3 rounded-full ${getStatusColor()}`} 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-600">
                <div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                    <span>Crítico (&lt;50%)</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mr-1"></div>
                    <span>En proceso (50-75%)</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                    <span>Cercano (75-90%)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Award className="h-5 w-5 text-blue-500 mr-2" />
                <div>
                  <span className="text-sm font-medium">Meta para certificación</span>
                  <p className="text-xs text-gray-500">Mínimo 90% de desviación</p>
                </div>
              </div>
              <span className="text-lg font-bold text-blue-700">90%</span>
            </div>
          </div>
          
          {/* Actions needed */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Acciones pendientes</h3>
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            
            <div className="space-y-3">
              {pendingActions.map(action => (
                <div 
                  key={action.id} 
                  className={`p-3 rounded-lg border ${
                    action.status === 'completed' 
                      ? 'border-green-200 bg-green-50' 
                      : action.status === 'in-progress' 
                        ? 'border-blue-200 bg-blue-50' 
                        : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`p-1 rounded-full mt-0.5 mr-3 ${
                      action.status === 'completed' 
                        ? 'bg-green-500' 
                        : action.status === 'in-progress' 
                          ? 'bg-blue-500' 
                          : 'bg-gray-300'
                    }`}>
                      <ClipboardCheck className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <h4 className={`text-sm font-medium ${
                        action.status === 'completed' ? 'text-green-800' : 
                        action.status === 'in-progress' ? 'text-blue-800' : 'text-gray-800'
                      }`}>{action.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{action.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-100 px-5 py-3 bg-gray-50 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          La certificación TRUE reconoce a las instalaciones que desvían al menos el 90% de sus residuos de los vertederos.
        </span>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-white flex items-center"
            onClick={() => {
              // Preparamos los datos para el reporte
              const reportActions = pendingActions.map(action => ({
                title: action.title,
                description: action.description,
                status: action.status as 'pending' | 'in-progress' | 'completed'
              }));
              
              // Generamos y descargamos el reporte
              generateAndDownloadTrueCertificationReport(
                'Club Campestre de la Ciudad de México',
                currentDeviation,
                reportActions
              );
            }}
          >
            <FileDown className="h-4 w-4 mr-1" />
            Generar reporte
          </Button>
          
          <Button size="sm" variant="outline" className="bg-white">
            Ver requisitos completos
          </Button>
        </div>
      </div>
    </div>
  );
};