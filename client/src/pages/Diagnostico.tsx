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
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
          {/* Subtle floating shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-32 h-32 bg-lime-200/20 rounded-full blur-3xl"></div>
            <div className="absolute top-40 right-20 w-48 h-48 bg-navy-200/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-emerald-200/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-5xl mx-auto px-8 py-24 relative z-10">
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
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                  >
                    <motion.h1 
                      className="text-7xl md:text-8xl font-extralight bg-gradient-to-r from-navy to-lime-600 bg-clip-text text-transparent tracking-tight leading-[0.85] mb-6"
                      whileHover={{ 
                        scale: 1.02
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      ECONOMÍA
                      <br />
                      <span className="font-light">
                        CIRCULAR
                      </span>
                    </motion.h1>
                    <motion.div 
                      className="text-3xl md:text-4xl font-light text-gray-600 tracking-wide"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                    >
                      Diagnóstico Integral
                    </motion.div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="max-w-2xl mx-auto"
                  >
                    <motion.div 
                      className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 shadow-xl"
                      whileHover={{ 
                        y: -5,
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)"
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-xl text-gray-700 leading-relaxed font-light">
                        Evaluación completa de <span className="text-navy font-semibold">Agua</span>, 
                        <span className="text-lime-600 font-semibold"> Energía</span> y 
                        <span className="text-emerald-600 font-semibold"> Residuos</span> para 
                        organizaciones líderes en sustentabilidad
                      </p>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Simple Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="flex justify-center items-center space-x-12 text-center"
                >
                  <motion.div 
                    className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100"
                    whileHover={{ 
                      y: -8,
                      boxShadow: "0 20px 40px -12px rgba(59, 130, 246, 0.15)"
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-5xl mb-3">💧</div>
                    <div className="text-sm text-navy uppercase tracking-wider font-semibold">Gestión Hídrica</div>
                  </motion.div>
                  
                  <div className="w-px h-20 bg-gradient-to-b from-navy/20 to-lime-600/20"></div>
                  
                  <motion.div 
                    className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100"
                    whileHover={{ 
                      y: -8,
                      boxShadow: "0 20px 40px -12px rgba(132, 204, 22, 0.15)"
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-5xl mb-3">⚡</div>
                    <div className="text-sm text-lime-600 uppercase tracking-wider font-semibold">Eficiencia Energética</div>
                  </motion.div>
                  
                  <div className="w-px h-20 bg-gradient-to-b from-lime-600/20 to-emerald-600/20"></div>
                  
                  <motion.div 
                    className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100"
                    whileHover={{ 
                      y: -8,
                      boxShadow: "0 20px 40px -12px rgba(16, 185, 129, 0.15)"
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-5xl mb-3">♻️</div>
                    <div className="text-sm text-emerald-600 uppercase tracking-wider font-semibold">Zero Waste</div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Minimal CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Button
                    onClick={startDiagnostic}
                    className="relative px-12 py-6 text-lg font-medium tracking-wide
                              bg-gradient-to-r from-navy to-lime-600
                              hover:from-navy-dark hover:to-lime-700
                              text-white border-0 rounded-full 
                              shadow-xl hover:shadow-2xl hover:shadow-lime-500/20
                              transition-all duration-300
                              group overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      <Award className="w-5 h-5 mr-3" />
                      Comenzar Evaluación
                    </span>
                    
                    {/* Subtle glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      initial={{ x: '-100%', opacity: 0 }}
                      whileHover={{ x: '100%', opacity: 1 }}
                      transition={{ duration: 0.8 }}
                    />
                  </Button>
                </motion.div>
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