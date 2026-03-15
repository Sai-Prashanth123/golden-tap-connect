import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Logo } from '@/components/Logo';
import { GlassCard } from '@/components/GlassCard';
import {
  Eye, EyeOff, Users, Calendar, Shield, ArrowRight, ArrowLeft,
  Phone, User, Building, GraduationCap, MapPin, Briefcase,
} from 'lucide-react';
import { useAppStore, mockAttendee, mockOrganizer, mockAdmin, type UserRole } from '@/store/appStore';

const roles = [
  { value: 'attendee' as UserRole, icon: Users, title: 'Attendee', desc: 'Connect at events, build your network', color: 'from-amber-500/20 to-yellow-600/10', border: 'border-amber-500/40' },
  { value: 'organizer' as UserRole, icon: Calendar, title: 'Event Organizer', desc: 'Create events, manage attendees', color: 'from-blue-500/20 to-indigo-600/10', border: 'border-blue-500/40' },
  { value: 'admin' as UserRole, icon: Shield, title: 'Platform Admin', desc: 'Manage the entire platform', color: 'from-purple-500/20 to-violet-600/10', border: 'border-purple-500/40' },
];

const industries = ['AI / Machine Learning', 'Fintech', 'HealthTech', 'CleanTech', 'SaaS', 'E-Commerce', 'EdTech', 'Deep Tech', 'Web3 / Crypto', 'Events & Hospitality', 'Media', 'Other'];

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState<UserRole>('attendee');
  const [accountType, setAccountType] = useState<'company' | 'student'>('company');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [designation, setDesignation] = useState('');
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [linkedin, setLinkedin] = useState('');

  const login = useAppStore((s) => s.login);
  const navigate = useNavigate();

  const demoMap = { attendee: mockAttendee, organizer: mockOrganizer, admin: mockAdmin };

  const handleSubmit = () => {
    const base = demoMap[role];
    login({
      ...base,
      name: name || base.name,
      email: email || base.email,
      phone: phone || base.phone,
      role,
      accountType,
      gender: gender || base.gender,
      age: age ? parseInt(age) : base.age,
      designation: designation || base.designation,
      company: company || base.company,
      industry: industry || base.industry,
      location: location || base.location,
      linkedin: linkedin || base.linkedin,
    });
    navigate(role === 'attendee' ? '/dashboard' : role === 'organizer' ? '/organizer/dashboard' : '/admin/dashboard');
  };

  const steps = ['Account', 'Role', 'Profile', 'Details'];

  return (
    <div className="min-h-screen flex overflow-hidden">
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden">
        <ParticleBackground />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 text-center px-12"
        >
          <Logo size="lg" />
          <p className="mt-4 text-muted-foreground text-lg max-w-md">Join the network of elite founders</p>
          <div className="mt-8 space-y-3">
            {['Free to join and network', 'NFC & QR-powered connections', 'AI-powered match suggestions'].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                {f}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 bg-background overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="lg:hidden mb-8"><Logo /></div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium transition-all duration-300 ${i + 1 < step ? 'gold-gradient-bg text-primary-foreground' : i + 1 === step ? 'border-2 border-primary text-primary' : 'border border-border text-muted-foreground'}`}>
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                {i < steps.length - 1 && <div className={`w-8 h-px transition-all duration-500 ${i + 1 < step ? 'bg-primary' : 'bg-border'}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="font-display text-3xl font-semibold text-foreground mb-1">Create account</h1>
                <p className="text-muted-foreground mb-8">Start networking in minutes</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Full name *</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="gold-input w-full" placeholder="Alex Chen" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Email *</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="gold-input w-full" placeholder="you@company.com" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Phone number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input value={phone} onChange={(e) => setPhone(e.target.value)} className="gold-input w-full pl-10" placeholder="+91 9876543210" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Password *</label>
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
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="font-display text-3xl font-semibold text-foreground mb-1">Choose your role</h1>
                <p className="text-muted-foreground mb-8">This determines your experience on FounderKey</p>
                <div className="space-y-3">
                  {roles.map((r) => (
                    <motion.button
                      key={r.value}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setRole(r.value)}
                      className={`w-full p-4 rounded-2xl border bg-gradient-to-br text-left transition-all duration-200 ${r.color} ${role === r.value ? r.border + ' shadow-lg' : 'border-border hover:border-primary/30'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${role === r.value ? 'gold-gradient-bg' : 'bg-muted'}`}>
                          <r.icon className={`w-5 h-5 ${role === r.value ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{r.title}</p>
                          <p className="text-xs text-muted-foreground">{r.desc}</p>
                        </div>
                        {role === r.value && <div className="ml-auto w-5 h-5 rounded-full gold-gradient-bg flex items-center justify-center"><span className="text-primary-foreground text-xs">✓</span></div>}
                      </div>
                    </motion.button>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="gold-ghost" onClick={() => setStep(1)}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
                  <Button variant="gold" className="flex-1" size="lg" onClick={() => setStep(3)}>
                    Continue <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="font-display text-3xl font-semibold text-foreground mb-1">About you</h1>
                <p className="text-muted-foreground mb-8">Build your FounderKey profile</p>
                <div className="space-y-4">
                  {/* Account type */}
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">I represent</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[{ v: 'company', icon: Building, label: 'A Company' }, { v: 'student', icon: GraduationCap, label: 'A University' }].map((t) => (
                        <button
                          key={t.v}
                          onClick={() => setAccountType(t.v as 'company' | 'student')}
                          className={`p-3 rounded-xl border flex items-center gap-2 text-sm transition-all ${accountType === t.v ? 'border-primary/60 bg-primary/10 text-foreground' : 'border-border text-muted-foreground hover:border-primary/30'}`}
                        >
                          <t.icon className="w-4 h-4" /> {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">Gender</label>
                      <select value={gender} onChange={(e) => setGender(e.target.value)} className="gold-input w-full">
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary">Non-binary</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">Age</label>
                      <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="gold-input w-full" placeholder="28" min="18" max="99" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Designation / Title *</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input value={designation} onChange={(e) => setDesignation(e.target.value)} className="gold-input w-full pl-10" placeholder="Founder & CEO" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">{accountType === 'student' ? 'University' : 'Company'} *</label>
                    <div className="relative">
                      {accountType === 'student' ? <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /> : <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />}
                      <input value={company} onChange={(e) => setCompany(e.target.value)} className="gold-input w-full pl-10" placeholder={accountType === 'student' ? 'IIT Bombay' : 'NexusAI'} />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2">
                    <Button variant="gold-ghost" onClick={() => setStep(2)}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
                    <Button variant="gold" className="flex-1" size="lg" onClick={() => setStep(4)}>
                      Continue <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="font-display text-3xl font-semibold text-foreground mb-1">Almost there!</h1>
                <p className="text-muted-foreground mb-8">Your professional context helps us match you better</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Industry</label>
                    <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="gold-input w-full">
                      <option value="">Select your industry</option>
                      {industries.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input value={location} onChange={(e) => setLocation(e.target.value)} className="gold-input w-full pl-10" placeholder="San Francisco, CA" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">LinkedIn URL</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="gold-input w-full pl-10" placeholder="https://linkedin.com/in/..." />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2">
                    <Button variant="gold-ghost" onClick={() => setStep(3)}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
                    <Button variant="gold" className="flex-1" size="lg" onClick={handleSubmit}>
                      Create Account <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
