import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  Target,
  Award,
  Zap
} from 'lucide-react';
import { DIAGNOSTIC_CONFIG, calculateReadinessIndex } from '@shared/diagnosticConfig';
import { GateModule } from '@/components/diagnostic/GateModule';
import { ResultsDashboard } from '@/components/diagnostic/ResultsDashboard';
import { MatchAnimation } from '@/components/diagnostic/MatchAnimation';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

type DiagnosticStep = 'welcome' | 'contact' | 'modules' | 'match' | 'results';

interface ContactInfo {
  clientName: string;
  contactEmail: string;
  contactPhone: string;
}

export function Diagnostico() {
  const [currentStep, setCurrentStep] = useState<DiagnosticStep>('welcome');
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    clientName: '',
    contactEmail: '',
    contactPhone: ''
  });
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentModule = DIAGNOSTIC_CONFIG[currentModuleIndex];
  const currentQuestion = currentModule?.questions[currentQuestionIndex];
  const totalQuestions = DIAGNOSTIC_CONFIG.reduce((sum, module) => sum + module.questions.length, 0);
  const answeredQuestions = Object.keys(answers).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  // Save diagnostic session mutation
  const saveDiagnosticMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/diagnostic/sessions', data);
    }
  });

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    // Auto-advance to next question
    setTimeout(() => {
      if (currentQuestionIndex < currentModule.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else if (currentModuleIndex < DIAGNOSTIC_CONFIG.length - 1) {
        setCurrentModuleIndex(prev => prev + 1);
        setCurrentQuestionIndex(0);
      } else {
        // All questions answered, calculate results and save
        const { gateStatus, readinessIndex, moduleScores } = calculateReadinessIndex(answers);
        
        // Prepare responses data for saving
        const responses = Object.entries(answers).map(([questionId, answer]) => {
          const moduleId = questionId.match(/^([A-Z]+)/)?.[1] || questionId.charAt(0);
          const module = DIAGNOSTIC_CONFIG.find(m => m.id === moduleId);
          const question = module?.questions.find(q => q.id === questionId);
          const score = question?.options[answer] ?? 0;
          
          return {
            moduleId,
            questionId,
            answer,
            score
          };
        });

        // Save to database
        saveDiagnosticMutation.mutate({
          clientName: contactInfo.clientName,
          contactEmail: contactInfo.contactEmail,
          contactPhone: contactInfo.contactPhone,
          gateStatus,
          readinessIndex,
          moduleScores,
          responses
        });

        setCurrentStep('match');
      }
    }, 800);
  };

  const startDiagnostic = () => {
    setCurrentStep('contact');
  };

  const proceedToModules = () => {
    if (contactInfo.clientName && contactInfo.contactEmail) {
      setCurrentStep('modules');
    }
  };

  const goBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex(prev => prev - 1);
      setCurrentQuestionIndex(DIAGNOSTIC_CONFIG[currentModuleIndex - 1].questions.length - 1);
    } else {
      setCurrentStep('contact');
    }
  };

  if (currentStep === 'welcome') {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-4xl mx-auto px-8 py-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-20"
            >
              {/* Minimalist Hero */}
              <div className="text-center space-y-12">
                <div className="space-y-8">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <h1 className="text-7xl md:text-8xl font-light bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent tracking-tight leading-none">
                      TRUE
                    </h1>
                    <div className="text-2xl md:text-3xl font-light text-slate-700 mt-2 tracking-wide">DIAGNÓSTICO DE CIRCULARIDAD</div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="max-w-2xl mx-auto"
                  >
                    <p className="text-lg text-slate-600 leading-relaxed font-light">
                      Evaluación estratégica para organizaciones comprometidas 
                      con la excelencia en sustentabilidad
                    </p>
                  </motion.div>
                </div>

                {/* Simple Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="flex justify-center items-center space-x-12 text-center"
                >
                  <div>
                    <div className="text-3xl font-light text-emerald-600">11</div>
                    <div className="text-sm text-slate-500 uppercase tracking-wider">Módulos</div>
                  </div>
                  <div className="w-px h-12 bg-gradient-to-b from-emerald-200 to-blue-200"></div>
                  <div>
                    <div className="text-3xl font-light text-blue-600">25min</div>
                    <div className="text-sm text-slate-500 uppercase tracking-wider">Duración</div>
                  </div>
                  <div className="w-px h-12 bg-gradient-to-b from-blue-200 to-emerald-200"></div>
                  <div>
                    <div className="text-3xl font-light text-emerald-600">Instantáneo</div>
                    <div className="text-sm text-slate-500 uppercase tracking-wider">Resultados</div>
                  </div>
                </motion.div>
              </div>

              {/* Minimal CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="text-center"
              >
                <Button
                  onClick={startDiagnostic}
                  variant="outline"
                  className="border-2 border-emerald-600 text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-blue-600 hover:text-white hover:border-transparent px-16 py-6 text-lg font-light rounded-none transition-all duration-500 tracking-wide uppercase shadow-lg hover:shadow-xl"
                >
                  Comenzar Evaluación
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (currentStep === 'contact') {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-2xl mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-xl border-0 rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-8">
                  <CardTitle className="text-2xl font-bold text-center">
                    Información de Contacto
                  </CardTitle>
                  <p className="text-blue-100 text-center mt-2">
                    Para generar su reporte personalizado
                  </p>
                </CardHeader>
                
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="clientName" className="text-lg font-semibold">
                      Nombre del Club/Organización *
                    </Label>
                    <Input
                      id="clientName"
                      placeholder="Ej: Club de Golf Avandaro"
                      value={contactInfo.clientName}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, clientName: e.target.value }))}
                      className="text-lg p-4 rounded-xl border-2 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail" className="text-lg font-semibold">
                      Email de Contacto *
                    </Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="contacto@club.com"
                      value={contactInfo.contactEmail}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, contactEmail: e.target.value }))}
                      className="text-lg p-4 rounded-xl border-2 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone" className="text-lg font-semibold">
                      Teléfono (Opcional)
                    </Label>
                    <Input
                      id="contactPhone"
                      placeholder="+52 555 123 4567"
                      value={contactInfo.contactPhone}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, contactPhone: e.target.value }))}
                      className="text-lg p-4 rounded-xl border-2 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('welcome')}
                      className="flex-1 py-3 rounded-xl"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Atrás
                    </Button>
                    
                    <Button
                      onClick={proceedToModules}
                      disabled={!contactInfo.clientName || !contactInfo.contactEmail}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 py-3 rounded-xl"
                    >
                      Continuar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (currentStep === 'modules' && currentModule && currentQuestion) {
    // Special handling for Gate module (Module A)
    if (currentModule.id === 'A') {
      return (
        <AppLayout>
          <GateModule
            answers={answers}
            currentQuestionIndex={currentQuestionIndex}
            onAnswer={handleAnswer}
            onNext={() => {
              if (currentQuestionIndex < currentModule.questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
              } else {
                setCurrentModuleIndex(1); // Skip to module B
                setCurrentQuestionIndex(0);
              }
            }}
            onBack={goBack}
            canGoBack={currentQuestionIndex > 0 || currentModuleIndex > 0}
          />
        </AppLayout>
      );
    }

    // Regular module handling for non-gate modules
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-50">
          {/* Progress Header */}
          <div className="bg-white shadow-sm border-b">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentModule.color} flex items-center justify-center`}>
                    <span className="text-lg">{currentModule.icon}</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">{currentModule.name}</h2>
                    <p className="text-sm text-gray-600">
                      Pregunta {currentQuestionIndex + 1} de {currentModule.questions.length}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-600">Progreso General</div>
                  <div className="text-lg font-bold text-gray-900">{Math.round(progress)}%</div>
                </div>
              </div>
              
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          {/* Question Content */}
          <div className="max-w-2xl mx-auto px-4 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentModule.id}-${currentQuestion.id}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="shadow-xl border-0 rounded-3xl overflow-hidden">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="text-center space-y-3">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentModule.color} flex items-center justify-center text-white font-bold`}>
                            {currentQuestionIndex + 1}
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900">
                            {currentQuestion.text}
                          </h3>
                        </div>
                        
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
                            onClick={() => handleAnswer(currentQuestion.id, option)}
                            className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                              answers[currentQuestion.id] === option
                                ? 'border-green-500 bg-green-50 shadow-lg'
                                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-medium text-gray-900">
                                {option}
                              </span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">
                                  {Math.round(score * 100)}pts
                                </span>
                                {answers[currentQuestion.id] === option && (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
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
                          onClick={goBack}
                          className="flex-1 py-3 rounded-xl"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Anterior
                        </Button>
                        
                        {answers[currentQuestion.id] && (
                          <Button
                            onClick={() => handleAnswer(currentQuestion.id, answers[currentQuestion.id])}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 py-3 rounded-xl"
                          >
                            Siguiente
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
      </AppLayout>
    );
  }

  if (currentStep === 'match') {
    return (
      <MatchAnimation
        clientName={contactInfo.clientName}
        onComplete={() => setCurrentStep('results')}
      />
    );
  }

  if (currentStep === 'results') {
    const { gateStatus, readinessIndex, moduleScores } = calculateReadinessIndex(answers);

    return (
      <AppLayout>
        <ResultsDashboard
          contactInfo={contactInfo}
          answers={answers}
          gateStatus={gateStatus}
          readinessIndex={readinessIndex}
          moduleScores={moduleScores}
          onRestart={() => window.location.reload()}
        />
      </AppLayout>
    );
  }

  return null;
}