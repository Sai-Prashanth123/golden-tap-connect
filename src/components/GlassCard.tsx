import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const GlassCard = ({ children, className, hover = false, onClick }: GlassCardProps) => {
  return (
    <div
      className={cn(
        hover ? 'glass-card-hover' : 'glass-card',
        'p-6',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {hover && <div className="shimmer-overlay" />}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
