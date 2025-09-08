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
  const confettiParticles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'][i % 5],
    delay: Math.random() * 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  if (currentPhase === 'complete') {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-green-900 z-50 flex items-center justify-center overflow-hidden">
      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && confettiParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full"
            style={{ 
              backgroundColor: particle.color,
              left: `${particle.x}%`,
              top: `${particle.y}%`
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
                className="text-2xl font-bold text-white"
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
              className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl"
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
                  className={`absolute text-white ${
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
                className="text-6xl font-black text-white mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
              >
                ¡ES UN MATCH
                <br />
                PERFECTO!
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="text-3xl font-bold text-white space-y-2"
              >
                <div className="flex items-center justify-center space-x-4">
                  <span className="bg-green-500 px-4 py-2 rounded-full">TRUE Zero Waste</span>
                  <span className="text-pink-400">+</span>
                  <span className="bg-blue-500 px-4 py-2 rounded-full">{clientName}</span>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                className="text-xl text-white/90 mt-4"
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