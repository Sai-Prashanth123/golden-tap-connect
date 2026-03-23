import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export const LandingNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card rounded-none border-t-0 border-x-0">
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <Logo />
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Button variant="gold" size="sm" asChild>
            <Link to="/login">Log In</Link>
          </Button>
        </div>
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden p-6 border-t border-border flex flex-col gap-4">
          <a href="#features" className="text-sm text-muted-foreground">Features</a>
          <a href="#pricing" className="text-sm text-muted-foreground">Pricing</a>
          <Button variant="gold" size="sm" asChild><Link to="/login">Log In</Link></Button>
        </div>
      )}
    </nav>
  );
};
