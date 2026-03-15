import { ReactNode, forwardRef, useRef, useCallback } from 'react';
import { motion, HTMLMotionProps, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  elevated?: boolean;
  glow?: boolean;
  spotlight?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-7',
};

/** Mouse-tracking spotlight — follows cursor inside the card */
const Spotlight = () => {
  const spotRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useSpring(0, { stiffness: 200, damping: 20 });

  const bg = useTransform([x, y], ([mx, my]: number[]) =>
    `radial-gradient(280px circle at ${mx}px ${my}px, rgba(212,168,76,0.07) 0%, rgba(212,168,76,0.02) 40%, transparent 70%)`
  );

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = spotRef.current?.parentElement;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
    opacity.set(1);
  }, [x, y, opacity]);

  const handleMouseLeave = useCallback(() => opacity.set(0), [opacity]);

  const attachRef = useCallback((node: HTMLDivElement | null) => {
    (spotRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    const parent = node?.parentElement;
    if (!parent) return;
    parent.addEventListener('mousemove', handleMouseMove);
    parent.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      parent.removeEventListener('mousemove', handleMouseMove);
      parent.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <motion.div
      ref={attachRef}
      style={{ background: bg, opacity }}
      className="absolute inset-0 pointer-events-none z-0 rounded-[inherit]"
    />
  );
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, hover = false, elevated = false, glow = false, spotlight = false, padding = 'md', onClick, ...rest }, ref) => {
    const base = elevated ? 'glass-card-elevated' : hover ? 'glass-card-hover' : 'glass-card';
    const useSpotlight = spotlight || hover;

    if (hover || onClick) {
      return (
        <motion.div
          ref={ref}
          whileHover={{ y: -3, scale: 1.004 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          className={cn(base, paddingMap[padding], glow && 'gold-border-glow', onClick && 'cursor-pointer', 'overflow-hidden', className)}
          onClick={onClick}
          {...rest}
        >
          {useSpotlight && <Spotlight />}
          <div className="shimmer-overlay" />
          <div className="relative z-10">{children}</div>
        </motion.div>
      );
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={cn(base, paddingMap[padding], glow && 'gold-border-glow', useSpotlight && 'overflow-hidden', className)}
        onClick={onClick}
        {...(rest as React.HTMLAttributes<HTMLDivElement>)}
      >
        {useSpotlight && <Spotlight />}
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
