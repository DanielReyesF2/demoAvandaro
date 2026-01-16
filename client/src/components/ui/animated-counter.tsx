import { useEffect, useState, useRef } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  onComplete?: () => void;
}

export function AnimatedCounter({
  value,
  duration = 2,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  onComplete,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  });

  const display = useTransform(spring, (current) => {
    return `${prefix}${current.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${suffix}`;
  });

  useEffect(() => {
    if (isInView) {
      spring.set(value);
      const timer = setTimeout(() => {
        onComplete?.();
      }, duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, value, spring, duration, onComplete]);

  return (
    <motion.span
      ref={ref}
      className={className}
    >
      {display}
    </motion.span>
  );
}

// Componente para contador con efecto de "slot machine"
interface SlotCounterProps {
  value: number;
  className?: string;
}

export function SlotCounter({ value, className = '' }: SlotCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div ref={ref} className={className}>
      {displayValue.toLocaleString()}
    </div>
  );
}
