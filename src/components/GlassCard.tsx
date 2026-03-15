import { ReactNode, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  elevated?: boolean;
  glow?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-7',
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, hover = false, elevated = false, glow = false, padding = 'md', onClick, ...rest }, ref) => {
    const base = elevated ? 'glass-card-elevated' : hover ? 'glass-card-hover' : 'glass-card';

    if (hover || onClick) {
      return (
        <motion.div
          ref={ref}
          whileHover={{ y: -4, scale: 1.005 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className={cn(base, paddingMap[padding], glow && 'gold-border-glow', onClick && 'cursor-pointer', className)}
          onClick={onClick}
          {...rest}
        >
          {hover && <div className="shimmer-overlay" />}
          <div className="relative z-10">{children}</div>
        </motion.div>
      );
    }

    return (
      <div
        ref={ref as any}
        className={cn(base, paddingMap[padding], glow && 'gold-border-glow', className)}
        onClick={onClick}
        {...(rest as any)}
      >
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
