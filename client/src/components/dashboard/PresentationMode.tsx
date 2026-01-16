import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  TreePine,
  Recycle,
  Zap,
  Droplets,
  TrendingUp,
  Award,
  Target,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/animated-counter';

interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  type: 'hero' | 'metric' | 'impact' | 'achievement' | 'future';
  content: React.ReactNode;
  background: string;
}

interface PresentationModeProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    deviationRate: number;
    totalWasteDiverted: number;
    co2Avoided: number;
    treesEquivalent: number;
    energyRenewable: number;
    waterRecycled: number;
    circularityIndex: number;
  };
}

export function PresentationMode({ isOpen, onClose, data }: PresentationModeProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const slides: Slide[] = [
    {
      id: 'welcome',
      title: 'ECONOVA',
      subtitle: 'Sistema Integral de Gestión Ambiental',
      type: 'hero',
      background: 'from-slate-900 via-slate-800 to-emerald-900',
      content: (
        <div className="text-center space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.3 }}
            className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center"
          >
            <Recycle className="w-16 h-16 text-white" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h1 className="text-6xl font-bold text-white mb-4">Grupo Avándaro</h1>
            <p className="text-2xl text-emerald-300">Reporte de Sustentabilidad 2025</p>
          </motion.div>
        </div>
      ),
    },
    {
      id: 'main-metric',
      title: 'Desviación de Residuos',
      type: 'metric',
      background: 'from-emerald-600 to-teal-700',
      content: (
        <div className="text-center space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="relative"
          >
            <div className="text-[180px] font-bold text-white leading-none">
              <AnimatedCounter value={data.deviationRate} decimals={1} duration={2} suffix="%" />
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.5, duration: 1.5 }}
              className="h-2 bg-white/30 rounded-full mt-8 max-w-2xl mx-auto overflow-hidden"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${data.deviationRate}%` }}
                transition={{ delay: 1, duration: 1.5 }}
                className="h-full bg-white rounded-full"
              />
            </motion.div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-3xl text-white/90"
          >
            de residuos desviados del relleno sanitario
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="flex items-center justify-center gap-4 text-xl text-emerald-200"
          >
            <Target className="w-8 h-8" />
            <span>Meta TRUE Platino: 90%</span>
          </motion.div>
        </div>
      ),
    },
    {
      id: 'total-diverted',
      title: 'Impacto Total',
      type: 'metric',
      background: 'from-blue-600 to-indigo-700',
      content: (
        <div className="text-center space-y-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring' }}
          >
            <div className="text-[160px] font-bold text-white leading-none">
              <AnimatedCounter value={data.totalWasteDiverted} decimals={1} duration={2.5} />
            </div>
            <div className="text-5xl font-medium text-blue-200 mt-4">toneladas</div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-3xl text-white/90"
          >
            de materiales recuperados en 2025
          </motion.p>
        </div>
      ),
    },
    {
      id: 'environmental-impact',
      title: 'Impacto Ambiental',
      type: 'impact',
      background: 'from-green-600 to-emerald-700',
      content: (
        <div className="grid grid-cols-2 gap-12 max-w-4xl mx-auto">
          {[
            { icon: TreePine, value: data.treesEquivalent, label: 'Árboles equivalentes', color: 'text-green-300' },
            { icon: Zap, value: Math.round(data.co2Avoided / 1000), label: 'Toneladas CO₂ evitadas', color: 'text-yellow-300' },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.2 }}
              className="text-center"
            >
              <div className={`w-24 h-24 mx-auto rounded-2xl bg-white/10 flex items-center justify-center mb-6 ${item.color}`}>
                <item.icon className="w-12 h-12" />
              </div>
              <div className="text-7xl font-bold text-white mb-2">
                <AnimatedCounter value={item.value} duration={2} />
              </div>
              <div className="text-xl text-white/80">{item.label}</div>
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      id: 'modules',
      title: 'Pilares de Sustentabilidad',
      type: 'achievement',
      background: 'from-violet-600 to-purple-700',
      content: (
        <div className="grid grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { icon: Recycle, value: data.deviationRate, label: 'Residuos', sublabel: 'Desviación TRUE', color: 'from-emerald-400 to-teal-500' },
            { icon: Zap, value: data.energyRenewable, label: 'Energía', sublabel: 'Renovable', color: 'from-amber-400 to-orange-500' },
            { icon: Droplets, value: data.waterRecycled, label: 'Agua', sublabel: 'Reciclada', color: 'from-sky-400 to-blue-500' },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.15 }}
              className="text-center"
            >
              <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-4 shadow-lg`}>
                <item.icon className="w-10 h-10 text-white" />
              </div>
              <div className="text-6xl font-bold text-white mb-1">
                <AnimatedCounter value={item.value} decimals={1} duration={2} suffix="%" />
              </div>
              <div className="text-xl font-semibold text-white">{item.label}</div>
              <div className="text-white/60">{item.sublabel}</div>
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      id: 'circularity',
      title: 'Índice de Circularidad',
      type: 'metric',
      background: 'from-cyan-600 to-teal-700',
      content: (
        <div className="text-center space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
            className="relative w-80 h-80 mx-auto"
          >
            {/* Círculo de fondo */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="160"
                cy="160"
                r="140"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="20"
              />
              <motion.circle
                cx="160"
                cy="160"
                r="140"
                fill="none"
                stroke="white"
                strokeWidth="20"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 140}
                initial={{ strokeDashoffset: 2 * Math.PI * 140 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 140 * (1 - data.circularityIndex / 100) }}
                transition={{ delay: 0.5, duration: 2, ease: 'easeOut' }}
              />
            </svg>
            {/* Valor central */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-7xl font-bold text-white">
                <AnimatedCounter value={data.circularityIndex} duration={2} suffix="%" />
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="space-y-2"
          >
            <p className="text-2xl text-white/90">Economía Circular Integral</p>
            <p className="text-lg text-cyan-200">Meta 2026: 85%</p>
          </motion.div>
        </div>
      ),
    },
    {
      id: 'future',
      title: 'Rumbo al Futuro',
      type: 'future',
      background: 'from-slate-800 via-emerald-900 to-slate-900',
      content: (
        <div className="text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4"
          >
            <Award className="w-16 h-16 text-amber-400" />
            <Sparkles className="w-12 h-12 text-emerald-400" />
            <Award className="w-16 h-16 text-amber-400" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-5xl font-bold text-white">Certificación TRUE Platino</h2>
            <p className="text-2xl text-emerald-300">Objetivo 2026</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-8 text-xl text-white/80"
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-400" />
              <span>90% Desviación</span>
            </div>
            <ArrowRight className="w-6 h-6 text-emerald-400" />
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-amber-400" />
              <span>85% Circularidad</span>
            </div>
            <ArrowRight className="w-6 h-6 text-emerald-400" />
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-sky-400" />
              <span>50% Energía Renovable</span>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-3xl font-semibold text-gradient"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #0ea5e9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Juntos construimos un futuro sustentable
          </motion.p>
        </div>
      ),
    },
  ];

  // Navegación con teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlide]);

  // Auto-play
  useEffect(() => {
    if (!isAutoPlay || !isOpen) return;
    const timer = setInterval(() => {
      if (currentSlide < slides.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else {
        setIsAutoPlay(false);
      }
    }, 8000);
    return () => clearInterval(timer);
  }, [isAutoPlay, isOpen, currentSlide]);

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1 && !isAnimating) {
      setIsAnimating(true);
      setCurrentSlide(prev => prev + 1);
      setTimeout(() => setIsAnimating(false), 500);
    }
  }, [currentSlide, isAnimating]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentSlide(prev => prev - 1);
      setTimeout(() => setIsAnimating(false), 500);
    }
  }, [currentSlide, isAnimating]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black"
    >
      {/* Slide actual */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].background} flex items-center justify-center p-12`}
        >
          {/* Patrón de fondo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }} />
          </div>

          {/* Contenido del slide */}
          <div className="relative z-10 w-full max-w-6xl">
            {slides[currentSlide].content}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controles */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-20">
        {/* Botón anterior */}
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* Indicadores de slide */}
        <div className="flex items-center gap-2 px-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 bg-white'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Botón siguiente */}
        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Auto-play */}
        <button
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          className={`p-3 rounded-full transition-colors ${
            isAutoPlay ? 'bg-emerald-500' : 'bg-white/10 hover:bg-white/20'
          }`}
        >
          {isAutoPlay ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Número de slide */}
      <div className="absolute top-6 left-6 text-white/50 text-sm z-20">
        {currentSlide + 1} / {slides.length}
      </div>

      {/* Instrucciones */}
      <div className="absolute bottom-8 right-8 text-white/30 text-sm z-20">
        Usa ← → o espacio para navegar · ESC para salir
      </div>
    </motion.div>
  );
}
