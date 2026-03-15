import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Logo } from '@/components/Logo';
import { Eye, EyeOff, Mail, Users, Calendar, Shield, ArrowRight, Zap, Lock } from 'lucide-react';
import { useAppStore, mockAttendee, mockOrganizer, mockAdmin, type UserRole } from '@/store/appStore';

const roles = [
  {
    value: 'attendee' as UserRole,
    icon: Users,
    title: 'Attendee',
    subtitle: 'Network at events',
    color: 'from-amber-500/20 to-yellow-600/10',
    border: 'border-amber-500/40',
    glow: 'shadow-amber-500/20',
    demo: mockAttendee,
    path: '/dashboard',
  },
  {
    value: 'organizer' as UserRole,
    icon: Calendar,
    title: 'Organizer',
    subtitle: 'Manage your events',
    color: 'from-blue-500/20 to-indigo-600/10',
    border: 'border-blue-500/40',
    glow: 'shadow-blue-500/20',
    demo: mockOrganizer,
    path: '/organizer/dashboard',
  },
  {
    value: 'admin' as UserRole,
    icon: Shield,
    title: 'Admin',
    subtitle: 'Platform control',
    color: 'from-purple-500/20 to-violet-600/10',
    border: 'border-purple-500/40',
    glow: 'shadow-purple-500/20',
    demo: mockAdmin,
    path: '/admin/dashboard',
  },
];

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = useAppStore((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname;

  const activeRole = roles.find((r) => r.value === selectedRole);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRole) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    login(activeRole.demo);
    navigate(from || activeRole.path);
  };

  const handleGoogleLogin = async () => {
    if (!activeRole) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    login(activeRole.demo);
    navigate(from || activeRole.path);
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden">
        <ParticleBackground />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 text-center px-12"
        >
          <Logo size="lg" />
          <p className="mt-4 text-muted-foreground text-lg max-w-md">
            One tap connects you to the world's best founders
          </p>
          <div className="mt-8 flex justify-center gap-6 text-center">
            {[['12,800+', 'Members'], ['284', 'Events'], ['45K+', 'Connections']].map(([n, l]) => (
              <motion.div
                key={l}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <p className="font-display text-2xl font-bold gold-gradient-text">{n}</p>
                <p className="text-xs text-muted-foreground">{l}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Logo />
          </div>

          <AnimatePresence mode="wait">
            {!selectedRole ? (
              <motion.div
                key="role-selector"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="font-display text-3xl font-semibold text-foreground mb-1">Welcome back</h1>
                <p className="text-muted-foreground mb-8">Choose how you're signing in today</p>

                <div className="space-y-3">
                  {roles.map((r, i) => (
                    <motion.button
                      key={r.value}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      onClick={() => setSelectedRole(r.value)}
                      className={`w-full p-4 rounded-2xl border bg-gradient-to-br ${r.color} ${r.border} hover:shadow-lg ${r.glow} transition-all duration-300 group text-left`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl glass-card flex items-center justify-center group-hover:scale-110 transition-transform">
                          <r.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{r.title}</p>
                          <p className="text-xs text-muted-foreground">{r.subtitle}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </motion.button>
                  ))}
                </div>

                <p className="text-sm text-muted-foreground mt-8 text-center">
                  New to FounderKey?{' '}
                  <Link to="/register" className="text-primary hover:underline">Create an account</Link>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
              >
                {/* Back button + role badge */}
                <div className="flex items-center gap-3 mb-6">
                  <button
                    onClick={() => setSelectedRole(null)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    ← Back
                  </button>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border bg-gradient-to-r ${activeRole!.color} ${activeRole!.border}`}>
                    {activeRole!.title}
                  </span>
                </div>

                <h1 className="font-display text-3xl font-semibold text-foreground mb-1">Sign in</h1>
                <p className="text-muted-foreground mb-8">
                  as <span className="text-primary font-medium">{activeRole!.title}</span>
                </p>

                {/* Google + Wisein */}
                <div className="space-y-3 mb-6">
                  <Button
                    type="button"
                    variant="gold-ghost"
                    className="w-full h-11"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </Button>
                  <Button
                    type="button"
                    variant="gold-ghost"
                    className="w-full h-11"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                  >
                    <Zap className="w-5 h-5 mr-2 text-primary" />
                    Continue with Wisein
                  </Button>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">or continue with email</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="gold-input w-full pl-10"
                        placeholder={activeRole!.demo.email}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type={showPw ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="gold-input w-full pl-10 pr-10"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="gold"
                    className="w-full h-11 relative overflow-hidden"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                      />
                    ) : (
                      <>Sign In as {activeRole!.title} <ArrowRight className="w-4 h-4 ml-1" /></>
                    )}
                  </Button>
                </form>

                <p className="text-sm text-muted-foreground mt-6 text-center">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary hover:underline">Sign up</Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
