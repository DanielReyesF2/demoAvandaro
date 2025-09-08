import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ArrowRight, 
  ArrowLeft,
  Shield,
  ShieldCheck,
  ShieldX
} from 'lucide-react';
import { DIAGNOSTIC_CONFIG, DiagnosticModule } from '@shared/diagnosticConfig';

interface GateModuleProps {
  answers: Record<string, string>;
  currentQuestionIndex: number;
  onAnswer: (questionId: string, answer: string) => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
}

export function GateModule({ 
  answers, 
  currentQuestionIndex, 
  onAnswer, 
  onNext, 
  onBack, 
  canGoBack 
}: GateModuleProps) {
  const gateModule = DIAGNOSTIC_CONFIG.find(m => m.id === "A") as DiagnosticModule;
  const currentQuestion = gateModule.questions[currentQuestionIndex];
  
  // Calculate gate status
  const gateBlockers = gateModule.gate_blockers || [];
  const gateThreshold = gateModule.gate_threshold || 0.8;
  
  const blockerStatus = gateBlockers.map(questionId => {
    const question = gateModule.questions.find(q => q.id === questionId);
    const answer = answers[questionId];
    const score = question ? (question.options[answer] ?? 0) : 0;
    const isCritical = score < gateThreshold;
    
    return {
      questionId,
      question: question?.text || '',
      answer,
      score,
      isCritical,
      isAnswered: !!answer
    };
  });
  
  const answeredBlockers = blockerStatus.filter(b => b.isAnswered);
  const criticalBlockers = blockerStatus.filter(b => b.isCritical && b.isAnswered);
  const gateProgress = (answeredBlockers.length / blockerStatus.length) * 100;
  const gateStatus = answeredBlockers.length === blockerStatus.length && criticalBlockers.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Gate Status Header */}
      <div className="bg-white shadow-lg border-b-2 border-red-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <motion.div
                animate={{
                  backgroundColor: gateStatus 
                    ? '#10b981' 
                    : criticalBlockers.length > 0 
                      ? '#ef4444' 
                      : '#f59e0b'
                }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
              >
                {gateStatus ? (
                  <ShieldCheck className="w-8 h-8 text-white" />
                ) : criticalBlockers.length > 0 ? (
                  <ShieldX className="w-8 h-8 text-white" />
                ) : (
                  <Shield className="w-8 h-8 text-white" />
                )}
              </motion.div>
              
              <div>
                <h1 className="text-3xl font-black text-gray-900">
                  Gate de Elegibilidad TRUE
                </h1>
                <p className="text-lg text-gray-600">
                  Requisitos mínimos para certificación Zero Waste
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-600">Progreso del Gate</div>
              <div className="text-2xl font-black text-gray-900">{Math.round(gateProgress)}%</div>
            </div>
          </div>
          
          <Progress value={gateProgress} className="h-3 mb-4" />
          
          {/* Gate Status Banner */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-4 rounded-xl border-2 ${
              gateStatus
                ? 'bg-green-50 border-green-200 text-green-800'
                : criticalBlockers.length > 0
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-yellow-50 border-yellow-200 text-yellow-800'
            }`}
          >
            <div className="flex items-center space-x-3">
              {gateStatus ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : criticalBlockers.length > 0 ? (
                <XCircle className="w-6 h-6 text-red-600" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              )}
              
              <div className="flex-1">
                <div className="font-bold text-lg">
                  {gateStatus 
                    ? '✅ Elegible para TRUE Zero Waste'
                    : criticalBlockers.length > 0
                      ? '❌ Bloqueadores críticos identificados'
                      : '⏳ Evaluando elegibilidad...'
                  }
                </div>
                <div className="text-sm">
                  {gateStatus 
                    ? 'Cumple con todos los requisitos mínimos'
                    : criticalBlockers.length > 0
                      ? `${criticalBlockers.length} requisito(s) crítico(s) no cumplido(s)`
                      : `${answeredBlockers.length}/${blockerStatus.length} requisitos evaluados`
                  }
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Critical Blockers Alert */}
      {criticalBlockers.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 py-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border-2 border-red-300 rounded-xl p-4"
          >
            <div className="flex items-start space-x-3">
              <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <div className="font-bold text-red-800">Requisitos críticos no cumplidos:</div>
                <ul className="text-sm text-red-700 mt-2 space-y-1">
                  {criticalBlockers.map(blocker => (
                    <li key={blocker.questionId} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span>{blocker.question}: <strong>{blocker.answer}</strong></span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Question Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <div className="space-y-8">
                  {/* Question Header */}
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${
                        gateBlockers.includes(currentQuestion.id)
                          ? 'bg-red-500'
                          : 'bg-orange-500'
                      }`}>
                        {currentQuestionIndex + 1}
                      </div>
                      {gateBlockers.includes(currentQuestion.id) && (
                        <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">
                          CRÍTICO
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900">
                      {currentQuestion.text}
                    </h3>
                    
                    {currentQuestion.description && (
                      <p className="text-gray-600 text-lg bg-blue-50 p-4 rounded-xl border border-blue-100">
                        💡 {currentQuestion.description}
                      </p>
                    )}
                  </div>

                  {/* Answer Options */}
                  <div className="space-y-3">
                    {Object.entries(currentQuestion.options).map(([option, score]) => (
                      <motion.button
                        key={option}
                        onClick={() => onAnswer(currentQuestion.id, option)}
                        className={`w-full p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                          answers[currentQuestion.id] === option
                            ? score >= gateThreshold
                              ? 'border-green-500 bg-green-50 shadow-lg'
                              : 'border-red-500 bg-red-50 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-medium text-gray-900 flex-1">
                            {option}
                          </span>
                          <div className="flex items-center space-x-3">
                            <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                              score >= gateThreshold
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {score >= gateThreshold ? 'CUMPLE' : 'NO CUMPLE'}
                            </div>
                            <span className="text-sm text-gray-500">
                              {Math.round(score * 100)}pts
                            </span>
                            {answers[currentQuestion.id] === option && (
                              score >= gateThreshold ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-500" />
                              )
                            )}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {/* Navigation */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      variant="outline"
                      onClick={onBack}
                      disabled={!canGoBack}
                      className="flex-1 py-3 rounded-xl"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Anterior
                    </Button>
                    
                    {answers[currentQuestion.id] && (
                      <Button
                        onClick={onNext}
                        className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 py-3 rounded-xl"
                      >
                        {currentQuestionIndex === gateModule.questions.length - 1 ? 'Completar Gate' : 'Siguiente'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}