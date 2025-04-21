import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SustainabilityBadgeProps {
  icon: React.ReactNode;
  name: string;
  description: string;
  isActive: boolean;
  progress?: number;
}

const SustainabilityBadge: React.FC<SustainabilityBadgeProps> = ({ 
  icon, 
  name, 
  description, 
  isActive,
  progress = 100
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`relative flex flex-col items-center justify-center p-2 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`w-16 h-16 flex items-center justify-center rounded-full mb-2 
                            ${isActive ? 'bg-gradient-to-br from-lime to-lime/60' : 'bg-gray-200'}`}>
              <div className="text-navy">
                {icon}
              </div>
            </div>
            <span className="text-xs font-semibold text-center">{name}</span>
            
            {/* Progress circle if not 100% */}
            {isActive && progress < 100 && (
              <svg className="absolute -top-1 -right-1 w-6 h-6 transform rotate-270">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                  fill="none"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#b5e951"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={`${progress * 0.628} 62.8`}
                  fill="none"
                  transform="rotate(-90 12 12)"
                />
              </svg>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[200px] p-3 text-xs">
          <p className="font-semibold mb-1">{name}</p>
          <p>{description}</p>
          {progress < 100 && isActive && (
            <p className="mt-1 text-lime font-medium">Progreso: {progress}%</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface SustainabilityBadgesProps {
  clientId: number;
}

const SustainabilityBadges: React.FC<SustainabilityBadgesProps> = ({ clientId }) => {
  // Simulated achievements based on client ID 
  // In a real app, these would come from a database
  const achievements = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.3 15.3a2.4 2.4 0 0 1-4.8 0"/>
          <path d="M15.3 15.3a2.4 2.4 0 0 1-4.8 0"/>
          <path d="M9.3 15.3a2.4 2.4 0 0 1-4.8 0"/>
          <path d="M21 5v4.5"/>
          <path d="M15 5v4.5"/>
          <path d="M9 5v4.5"/>
          <path d="M3 5v4.5"/>
          <path d="M3 12h18"/>
        </svg>
      ),
      name: "ISO 14001",
      description: "Certificación en gestión ambiental que demuestra el compromiso con la reducción de impacto ambiental.",
      isActive: true,
      progress: 100,
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-5 0v-15A2.5 2.5 0 0 1 9.5 2Z"/>
          <path d="M14.5 8a2.5 2.5 0 0 1 5 0v10.5a2.5 2.5 0 0 1-5 0V8Z"/>
        </svg>
      ),
      name: "Triple Impacto",
      description: "Reconocimiento por equilibrar resultados económicos con impactos sociales y ambientales positivos.",
      isActive: clientId === 4, // Solo Club Campestre tiene este logro
      progress: 100,
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.44 8.49a5 5 0 0 0 7.12 0"/>
          <path d="M8.44 15.51a5 5 0 0 1 7.12 0"/>
          <path d="M2 12h1"/>
          <path d="M21 12h1"/>
          <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10Z"/>
        </svg>
      ),
      name: "Zero Waste",
      description: "En progreso para lograr el objetivo de enviar cero residuos a vertederos mediante reciclaje y compostaje.",
      isActive: clientId === 4, // Solo Club Campestre tiene este logro
      progress: 55,
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7.33 2h9.34"/>
          <path d="M12 6v16"/>
          <path d="M5 10h14"/>
        </svg>
      ),
      name: "Carbono Neutral",
      description: "Compromiso de alcanzar cero emisiones netas de carbono para 2030.",
      isActive: false,
      progress: 0,
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 6a6 6 0 0 1 3.8-5.6c2-.7 4.3-.4 6 .8 1.9-1.3 4.1-1.6 6.2-.8a6 6 0 0 1 3.8 5.6c0 6.1-3.8 8.5-7.8 9.5V22h-4v-6.7C9.1 14.5 5 12.3 5 6Z"/>
          <path d="M9 12c1 0 1-1 2.80-1s1.89 1 2.9 1 1.8-1 2.4-1"/>
        </svg>
      ),
      name: "Eco-Friendly",
      description: "Reconocimiento por implementar prácticas sustentables en toda la cadena de valor.",
      isActive: true,
      progress: 100,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-lime" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19.2 17.8a2.7 2.7 0 0 0 0-3.81l-.83-.82a1.7 1.7 0 0 0-2.4 0l-.82.82"/>
            <path d="M7.3 7.3a2.7 2.7 0 0 0 0 3.82l.83.82a1.7 1.7 0 0 0 2.4 0l.82-.82"/>
            <path d="m15.5 11.5-3 3"/>
            <path d="M8.5 8.5a7 7 0 0 1 10 10 7 7 0 0 1-10-10Z"/>
          </svg>
          Reconocimientos Ambientales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2">
          {achievements.map((badge, index) => (
            <SustainabilityBadge 
              key={index}
              icon={badge.icon}
              name={badge.name}
              description={badge.description}
              isActive={badge.isActive}
              progress={badge.progress}
            />
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium text-navy">ODS alineados:</div>
            <div className="text-xs text-gray-500">4 de 17</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-green-600 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">3</div>
            <div className="bg-red-600 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">6</div>
            <div className="bg-orange-500 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">7</div>
            <div className="bg-lime text-navy text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">12</div>
            <div className="border border-dashed border-gray-300 text-gray-400 text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">+</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SustainabilityBadges;