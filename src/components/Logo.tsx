import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export const Logo = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl' };
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="relative">
        <Zap className={`${size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6'} text-primary fill-primary`} />
      </div>
      <span className={`font-display font-semibold gold-gradient-text ${sizes[size]}`}>
        FounderKey
      </span>
    </Link>
  );
};
