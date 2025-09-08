import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Zap, Star } from 'lucide-react';

interface MatchAnimationProps {
  clientName: string;
  onComplete: () => void;
}

const BUILDUP_MESSAGES = [
  "🔄 Analizando compatibilidad estratégica...",
  "🔄 Evaluando alineación con objetivos zero waste...", 
  "🔄 Calculando potencial de impacto conjunto..."
];

export function MatchAnimation({ clientName, onComplete }: MatchAnimationProps) {
  const [currentPhase, setCurrentPhase] = useState<'buildup' | 'match' | 'complete'>('buildup');
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Fase 1: Buildup - cambiar mensaje cada 1.5 segundos
    const buildupInterval = setInterval(() => {
      setCurrentMessageIndex(prev => {
        if (prev < BUILDUP_MESSAGES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(buildupInterval);
          // Después del último mensaje, pasar a MATCH
          setTimeout(() => {
            setCurrentPhase('match');
            setShowConfetti(true);
          }, 1000);
          return prev;
        }
      });
    }, 1500);

    return () => clearInterval(buildupInterval);
  }, []);

  useEffect(() => {
    if (currentPhase === 'match') {
      // Después de 4 segundos de celebración, pasar al dashboard
      const completeTimer = setTimeout(() => {
        setCurrentPhase('complete');
        setTimeout(onComplete, 1000);
      }, 4000);

      return () => clearTimeout(completeTimer);
    }
  }, [currentPhase, onComplete]);

  // Generar partículas de confetti
  const confettiParticles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    color: ['#f1f5f9', '#e2e8f0', '#cbd5e1'][i % 3],
    delay: Math.random() * 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  if (currentPhase === 'complete') {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-50 flex items-center justify-center overflow-hidden">
      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && confettiParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full"
            style={{ 
              backgroundColor: particle.color,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              boxShadow: '0 0 10px rgba(255,255,255,0.4)'
            }}
            initial={{ scale: 0, y: -20, rotate: 0 }}
            animate={{ 
              scale: [0, 1, 0.5],
              y: [0, 100, 200],
              rotate: [0, 180, 360],
              x: [0, Math.random() * 100 - 50]
            }}
            transition={{ 
              duration: 3,
              delay: particle.delay,
              ease: "easeOut"
            }}
          />
        ))}
      </AnimatePresence>

      {/* Fase Buildup */}
      <AnimatePresence mode="wait">
        {currentPhase === 'buildup' && (
          <motion.div
            key="buildup"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-8"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 mx-auto mb-6"
              >
                <div className="w-full h-full border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </motion.div>
              
              <motion.h2
                key={currentMessageIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-2xl font-semibold text-slate-100"
              >
                {BUILDUP_MESSAGES[currentMessageIndex]}
              </motion.h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fase Match */}
      <AnimatePresence>
        {currentPhase === 'match' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 10
            }}
            className="text-center space-y-8 relative"
          >
            {/* Círculos de impacto */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 1] }}
              transition={{ duration: 1 }}
              className="absolute inset-0 bg-slate-100/10 rounded-full blur-3xl"
            />
            
            {/* Iconos flotantes */}
            <div className="absolute inset-0">
              {[Heart, Sparkles, Zap, Star].map((Icon, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ 
                    scale: [0, 1, 0.8],
                    rotate: [0, 180, 360],
                    y: [0, -20, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    delay: index * 0.2,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                  className={`absolute text-slate-200 ${
                    index === 0 ? 'top-4 left-4' :
                    index === 1 ? 'top-4 right-4' :
                    index === 2 ? 'bottom-4 left-4' : 'bottom-4 right-4'
                  }`}
                >
                  <Icon className="w-8 h-8" />
                </motion.div>
              ))}
            </div>

            {/* Contenido principal */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative z-10"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
                className="text-8xl mb-6"
              >
                💖
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="text-6xl font-black text-white mb-4 drop-shadow-2xl"
              >
                ¡ES UN MATCH
                <br />
                PERFECTO!
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="text-3xl font-semibold text-white space-y-2"
              >
                <div className="flex items-center justify-center space-x-4">
                  <span className="bg-slate-700 px-6 py-3 rounded-full border border-slate-500 shadow-lg">TRUE Zero Waste</span>
                  <span className="text-slate-300 text-2xl">+</span>
                  <span className="bg-slate-700 px-6 py-3 rounded-full border border-slate-500 shadow-lg">{clientName}</span>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                className="text-xl text-slate-200 mt-6"
              >
                ¡Destinados a liderar la sustentabilidad juntos! 🌟
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}