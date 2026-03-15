import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Logo } from '@/components/Logo';
import { GlassCard } from '@/components/GlassCard';
import { Eye, EyeOff, Users, Calendar, Shield, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAppStore, mockUser, type UserRole } from '@/store/appStore';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState<UserRole>('attendee');
  const login = useAppStore((s) => s.login);
  const navigate = useNavigate();

  const roles = [
    { value: 'attendee' as UserRole, icon: Users, title: 'Attendee', desc: 'Connect at events, build your network' },
    { value: 'organizer' as UserRole, icon: Calendar, title: 'Event Organizer', desc: 'Create events, manage attendees' },
    { value: 'admin' as UserRole, icon: Shield, title: 'Platform Admin', desc: 'Manage the entire platform' },
  ];

  const handleSubmit = () => {
    login({ ...mockUser, name: name || mockUser.name, email: email || mockUser.email, role });
    navigate(role === 'attendee' ? '/dashboard' : role === 'organizer' ? '/organizer/dashboard' : '/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden">
        <ParticleBackground />
        <div className="relative z-10 text-center px-12">
          <Logo size="lg" />
          <p className="mt-4 text-muted-foreground text-lg max-w-md">Join the network</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8"><Logo /></div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`w-2 h-2 rounded-full transition-all ${s === step ? 'bg-primary w-6' : s < step ? 'bg-primary' : 'bg-border'}`} />
            ))}
          </div>

          {step === 1 && (
            <>
              <h1 className="font-display text-3xl font-semibold text-foreground mb-2">Create your account</h1>
              <p className="text-muted-foreground mb-8">Start networking in minutes</p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Full name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="gold-input w-full" placeholder="Alex Chen" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="gold-input w-full" placeholder="you@company.com" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Password</label>
                  <div className="relative">
                    <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="gold-input w-full pr-10" placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button variant="gold" className="w-full" size="lg" onClick={() => setStep(2)}>
                  Continue <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="font-display text-3xl font-semibold text-foreground mb-2">Choose your role</h1>
              <p className="text-muted-foreground mb-8">This determines your experience</p>
              <div className="space-y-3">
                {roles.map((r) => (
                  <GlassCard
                    key={r.value}
                    hover
                    onClick={() => setRole(r.value)}
                    className={`cursor-pointer flex items-center gap-4 p-4 ${role === r.value ? 'gold-border-glow' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role === r.value ? 'gold-gradient-bg' : 'bg-muted'}`}>
                      <r.icon className={`w-5 h-5 ${role === r.value ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{r.title}</p>
                      <p className="text-xs text-muted-foreground">{r.desc}</p>
                    </div>
                  </GlassCard>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="gold-ghost" onClick={() => setStep(1)}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
                <Button variant="gold" className="flex-1" size="lg" onClick={() => setStep(3)}>
                  Continue <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="font-display text-3xl font-semibold text-foreground mb-2">Almost there!</h1>
              <p className="text-muted-foreground mb-8">Add your professional details</p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Designation / Title</label>
                  <input className="gold-input w-full" placeholder="Founder & CEO" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Company / University</label>
                  <input className="gold-input w-full" placeholder="NexusAI" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">LinkedIn URL</label>
                  <input className="gold-input w-full" placeholder="https://linkedin.com/in/..." />
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="gold-ghost" onClick={() => setStep(2)}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
                  <Button variant="gold" className="flex-1" size="lg" onClick={handleSubmit}>
                    Create Account <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}

          <p className="text-sm text-muted-foreground mt-6 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
