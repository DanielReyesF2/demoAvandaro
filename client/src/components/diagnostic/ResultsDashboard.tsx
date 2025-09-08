import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Award, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Download,
  RefreshCw,
  BarChart3,
  Target
} from 'lucide-react';
import { DIAGNOSTIC_CONFIG } from '@shared/diagnosticConfig';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadialBarChart, RadialBar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { generateAndDownloadTrueCertificationReport } from '@/lib/trueCertificationReport';

interface ResultsDashboardProps {
  contactInfo: {
    clientName: string;
    contactEmail: string;
    contactPhone: string;
  };
  answers: Record<string, string>;
  gateStatus: boolean;
  readinessIndex: number;
  moduleScores: Record<string, number>;
  onRestart: () => void;
}

const COLORS = {
  excellent: '#10b981',
  good: '#84cc16',
  fair: '#eab308',
  poor: '#ef4444',
  gate: '#dc2626'
};

export function ResultsDashboard({
  contactInfo,
  answers,
  gateStatus,
  readinessIndex,
  moduleScores,
  onRestart
}: ResultsDashboardProps) {
  
  // Create data for visualizations
  const moduleData = DIAGNOSTIC_CONFIG
    .filter(module => module.weight > 0)
    .map(module => ({
      id: module.id,
      name: module.name,
      score: Math.round((moduleScores[module.id] || 0) * 100),
      weight: module.weight,
      icon: module.icon,
      color: module.color,
      maxScore: Math.round(module.weight * 100)
    }))
    .sort((a, b) => b.score - a.score);

  const readinessData = [{
    name: 'TRUE Readiness',
    value: readinessIndex,
    fill: readinessIndex >= 80 ? COLORS.excellent : 
          readinessIndex >= 60 ? COLORS.good :
          readinessIndex >= 40 ? COLORS.fair : COLORS.poor
  }];

  const gateModule = DIAGNOSTIC_CONFIG.find(m => m.id === "A")!;
  const gateBlockers = gateModule.gate_blockers || [];
  const gateResults = gateBlockers.map(questionId => {
    const question = gateModule.questions.find(q => q.id === questionId);
    const answer = answers[questionId];
    const score = question ? (question.options[answer] ?? 0) : 0;
    const isCritical = score < (gateModule.gate_threshold || 0.8);
    
    return {
      id: questionId,
      question: question?.text || '',
      answer,
      score,
      isCritical,
      status: isCritical ? 'No Cumple' : 'Cumple'
    };
  });

  const criticalBlockers = gateResults.filter(r => r.isCritical);

  const getReadinessLevel = (index: number) => {
    if (index >= 80) return { 
      level: 'LISTO PARA TRUE', 
      color: 'text-green-600', 
      bgColor: 'bg-green-50',
      description: 'Excelente posicionamiento para certificación completa'
    };
    if (index >= 60) return { 
      level: 'PERFECTAMENTE POSICIONADO', 
      color: 'text-green-600', 
      bgColor: 'bg-green-50',
      description: 'Ideal para iniciar proceso de certificación TRUE'
    };
    if (index >= 40) return { 
      level: 'GRAN OPORTUNIDAD ESTRATÉGICA', 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50',
      description: 'Excelente base para crecimiento acelerado'
    };
    return { 
      level: 'OPORTUNIDAD DE ALTO IMPACTO', 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-50',
      description: 'Perfecta situación para transformación con máximo ROI'
    };
  };

  const readinessLevel = getReadinessLevel(readinessIndex);

  // Calcular índice de circularidad basado en puntuaciones de módulos
  const calculateCircularityIndex = () => {
    // Factores de circularidad con diferentes pesos según su impacto en economía circular
    const circularityFactors = {
      'B': 0.25, // Información y Seguimiento (datos son base de circularidad)
      'C': 0.20, // Reducción de Residuos (fundamental para circularidad)
      'D': 0.15, // Gestión de Materiales (cadena de suministro circular)
      'E': 0.15, // Tratamiento de Residuos (procesamiento hacia circularidad)
      'F': 0.10, // Organización (estructura para implementar circularidad)
      'G': 0.15, // Innovación y Mejora Continua (evolución circular)
    };

    let totalScore = 0;
    let totalWeight = 0;

    Object.entries(circularityFactors).forEach(([moduleId, weight]) => {
      // Obtener el puntaje bruto del módulo (0-1) dividiendo por su peso original
      const module = DIAGNOSTIC_CONFIG.find(m => m.id === moduleId);
      if (!module || module.weight === 0) return;
      
      const rawScore = (moduleScores[moduleId] || 0) / module.weight; // Esto da el puntaje 0-1
      totalScore += rawScore * weight;
      totalWeight += weight;
    });

    return Math.round((totalScore / totalWeight) * 100);
  };

  const circularityIndex = calculateCircularityIndex();

  // Datos para gráfica de araña - convertir puntajes ponderados a porcentajes
  const radarData = moduleData.map(module => {
    // Encontrar el módulo en la configuración para obtener su peso
    const configModule = DIAGNOSTIC_CONFIG.find(m => m.id === module.id);
    const moduleWeight = configModule?.weight || 1;
    
    // Convertir el puntaje ponderado a porcentaje (0-100)
    const percentageScore = moduleWeight > 0 ? Math.round((module.score / moduleWeight) * 100) : 0;
    
    return {
      module: module.name.split(' ')[0], // Tomar primera palabra para que se vea mejor
      score: percentageScore,
      fullName: module.name
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-2xl ${
                gateStatus ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              <Award className="w-10 h-10 text-white" />
            </motion.div>
            
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">
                Resultados del Diagnóstico
              </h1>
              <h2 className="text-2xl font-bold text-gray-700">
                {contactInfo.clientName}
              </h2>
              <p className="text-gray-600">
                Evaluación TRUE Zero Waste Certification
              </p>
            </div>
          </div>

          {/* Main Score Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* TRUE Readiness Index */}
            <Card className="shadow-xl border-0 rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white p-6">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  TRUE Readiness
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="text-5xl font-black text-gray-900">
                    {readinessIndex}%
                  </div>
                  <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${readinessLevel.bgColor} ${readinessLevel.color}`}>
                    {readinessIndex >= 50 ? 'IDEAL PARA PRECERTIFICACIÓN' : readinessLevel.level}
                  </div>
                  <div className="w-32 h-32 mx-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="80%" data={readinessData}>
                        <RadialBar
                          dataKey="value"
                          cornerRadius={8}
                          fill={readinessData[0].fill}
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Circularity Index */}
            <Card className="shadow-xl border-0 rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
                <CardTitle className="text-xl font-bold flex items-center">
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Índice Circularidad
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="text-5xl font-black text-gray-900">
                    {circularityIndex}%
                  </div>
                  <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                    circularityIndex >= 80 ? 'bg-green-100 text-green-800' :
                    circularityIndex >= 60 ? 'bg-blue-100 text-blue-800' : 
                    circularityIndex >= 40 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {circularityIndex >= 80 ? 'CIRCULAR AVANZADO' :
                     circularityIndex >= 60 ? 'CIRCULARIDAD SÓLIDA' :
                     circularityIndex >= 40 ? 'EN TRANSICIÓN' : 'GRAN POTENCIAL'}
                  </div>
                  <div className="w-32 h-32 mx-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="80%" data={[{
                        name: 'Circularidad',
                        value: circularityIndex,
                        fill: circularityIndex >= 80 ? '#10b981' :
                              circularityIndex >= 60 ? '#3b82f6' :
                              circularityIndex >= 40 ? '#eab308' : '#8b5cf6'
                      }]}>
                        <RadialBar
                          dataKey="value"
                          cornerRadius={8}
                          fill={circularityIndex >= 80 ? '#10b981' :
                               circularityIndex >= 60 ? '#3b82f6' :
                               circularityIndex >= 40 ? '#eab308' : '#8b5cf6'}
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gate Status */}
            <Card className="shadow-xl border-0 rounded-3xl overflow-hidden">
              <CardHeader className="p-6 bg-gradient-to-r from-blue-600 to-green-600 text-white">
                <CardTitle className="text-lg font-bold flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Análisis Estratégico
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-lg font-bold text-blue-800">
                    {gateStatus ? '🚀 LISTO PARA TRUE' : '💎 PRECERTIFICACIÓN ESTRATÉGICA'}
                  </div>
                  <p className="text-sm text-gray-600">
                    {gateStatus 
                      ? 'Excelente posicionamiento para certificación completa'
                      : 'Oportunidad perfecta para PRECERTIFICACIÓN con impacto inmediato'
                    }
                  </p>
                  
                  {!gateStatus && (
                    <div className="space-y-2">
                      <div className="text-sm font-semibold text-blue-800">Áreas de Mayor Impacto:</div>
                      <ul className="text-xs text-blue-700 space-y-1">
                        {criticalBlockers.slice(0, 3).map(blocker => (
                          <li key={blocker.id} className="flex items-start">
                            <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            <span className="line-clamp-2">Oportunidad de mejora en: {blocker.question.toLowerCase()}</span>
                          </li>
                        ))}
                        {criticalBlockers.length > 3 && (
                          <li className="text-blue-600 font-semibold">
                            +{criticalBlockers.length - 3} oportunidades más...
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Spider Chart - Análisis Multidimensional */}
          <Card className="shadow-xl border-0 rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white p-6">
              <CardTitle className="text-xl font-bold flex items-center">
                <TrendingUp className="w-6 h-6 mr-2" />
                Análisis Multidimensional TRUE
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} margin={{ top: 40, right: 80, bottom: 40, left: 80 }}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis 
                      dataKey="module" 
                      tick={{ fontSize: 12, fontWeight: 600 }}
                      className="fill-gray-700"
                    />
                    <PolarRadiusAxis 
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fontSize: 10 }}
                      tickCount={6}
                    />
                    <Radar
                      name="Puntuación"
                      dataKey="score"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.1}
                      strokeWidth={3}
                      dot={{ r: 6, fill: '#10b981' }}
                    />
                    <Tooltip 
                      formatter={(value: number, name: string, props: any) => [
                        `${value}%`,
                        props.payload?.fullName || name
                      ]}
                      labelFormatter={(label) => `Módulo: ${label}`}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Visualización integral de fortalezas y oportunidades por módulo TRUE
                </p>
              </div>
            </CardContent>
          </Card>


          {/* Strategic Opportunity Section */}
          <Card className="shadow-xl border-0 rounded-3xl overflow-hidden bg-gradient-to-r from-blue-50 to-green-50">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="text-3xl font-black text-gray-900">
                  🎯 Estrategia Recomendada
                </div>
                
                {gateStatus ? (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-green-800">
                      ¡Excelente! Su organización está lista para TRUE Zero Waste
                    </h3>
                    <p className="text-gray-700 max-w-4xl mx-auto">
                      Su nivel actual de preparación es perfecto para iniciar la certificación TRUE. 
                      Esta certificación está 100% alineada con sus objetivos de Zero Waste y 
                      posicionará a {contactInfo.clientName} como líder en sustentabilidad.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-purple-800">
                      🚀 PRECERTIFICACIÓN: Su Oportunidad de Impacto Inmediato
                    </h3>
                    <p className="text-gray-700 max-w-4xl mx-auto">
                      Su situación actual es <strong>perfecta</strong> para una estrategia de PRECERTIFICACIÓN. 
                      Esta fase inicial le permitirá lograr impacto inmediato mientras desarrolla las bases 
                      para la certificación TRUE completa. Es la forma más inteligente de maximizar ROI 
                      y posicionar a {contactInfo.clientName} como pionero en Zero Waste.
                    </p>
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <h4 className="font-bold text-purple-800 mb-3">Beneficios de PRECERTIFICACIÓN:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                        <div>✅ Impacto visible en 3-6 meses</div>
                        <div>✅ Fundamentos sólidos para TRUE</div>
                        <div>✅ ROI inmediato en gestión de residuos</div>
                        <div>✅ Posicionamiento de liderazgo</div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <p className="text-lg font-semibold text-gray-800">
                    💡 TRUE Zero Waste no es solo una certificación, es la estrategia perfecta 
                    para lograr sus objetivos de sustentabilidad con máximo impacto y credibilidad internacional.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              onClick={onRestart}
              size="lg"
              variant="outline"
              className="px-8 py-4 text-lg font-bold rounded-2xl"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Nuevo Diagnóstico
            </Button>
            
            <Button
              onClick={() => generateAndDownloadTrueCertificationReport(
                contactInfo.clientName,
                readinessIndex,
                circularityIndex,
                moduleScores,
                answers
              )}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-bold rounded-2xl"
            >
              <Download className="w-5 h-5 mr-2" />
              Plan Estratégico Detallado
            </Button>
          </div>

          {/* Contact Info */}
          <div className="text-center text-sm text-gray-500 pt-4">
            <p>
              Reporte generado para: <strong>{contactInfo.contactEmail}</strong>
            </p>
            <p>
              © 2025 ECONOVA - TRUE Zero Waste Consulting
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}