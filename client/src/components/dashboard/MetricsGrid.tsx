import { Target, Recycle, Trash2, Scale } from 'lucide-react';

interface MetricsGridProps {
  deviation: string;
  organicWaste: string;
  inorganicWaste: string;
  totalWaste: string;
}

export function MetricsGrid({ deviation, organicWaste, inorganicWaste, totalWaste }: MetricsGridProps) {
  const deviationNum = parseFloat(deviation);
  
  const metrics = [
    {
      title: 'Desviación Actual',
      value: `${deviation}%`,
      subtitle: 'del relleno sanitario',
      target: '90%',
      progress: (deviationNum / 90) * 100,
      icon: Target,
      color: deviationNum >= 75 ? 'text-green-600' : deviationNum >= 50 ? 'text-yellow-600' : 'text-red-600',
      bgColor: deviationNum >= 75 ? 'bg-green-50' : deviationNum >= 50 ? 'bg-yellow-50' : 'bg-red-50',
      borderColor: deviationNum >= 75 ? 'border-green-200' : deviationNum >= 50 ? 'border-yellow-200' : 'border-red-200',
      isMainMetric: true
    },
    {
      title: 'Orgánicos',
      value: `${organicWaste} ton`,
      subtitle: 'incluye PODA',
      target: 'compost',
      progress: 75,
      icon: Recycle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      isMainMetric: false
    },
    {
      title: 'Inorgánicos',
      value: `${inorganicWaste} ton`,
      subtitle: 'al relleno',
      target: 'reducir',
      progress: 40,
      icon: Trash2,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      isMainMetric: false
    },
    {
      title: 'Total Generado',
      value: `${totalWaste} ton`,
      subtitle: 'ene-jun 2025',
      target: 'estable',
      progress: 65,
      icon: Scale,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      isMainMetric: false
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div 
            key={index}
            className={`${metric.bgColor} ${metric.borderColor} border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-200 ${
              metric.isMainMetric ? 'lg:col-span-1 ring-2 ring-opacity-50 ring-navy' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm`}>
                <Icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                  {metric.title}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className={`text-3xl font-bold ${metric.color}`}>
                {metric.value}
              </div>
              <div className="text-sm text-gray-600">
                {metric.subtitle}
              </div>
              
              {metric.isMainMetric && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progreso</span>
                    <span>Meta: {metric.target}</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2 shadow-inner">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        deviationNum >= 75 ? 'bg-green-500' : deviationNum >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(metric.progress, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-center">
                    {deviationNum.toFixed(1)}% de 90%
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}