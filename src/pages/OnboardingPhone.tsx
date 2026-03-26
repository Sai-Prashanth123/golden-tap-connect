import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, ShieldCheck, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { useAppStore } from '@/store/appStore';
import { supabase } from '@/lib/supabase';
import { apiFetch } from '@/services/api';
import { toast } from 'sonner';
import { takePostAuthReturnPath } from '@/lib/loginReturnPath';

const COUNTRY_CODES = [
  { code: '+91',  flag: '🇮🇳', name: 'India' },
  { code: '+1',   flag: '🇺🇸', name: 'USA' },
  { code: '+44',  flag: '🇬🇧', name: 'UK' },
  { code: '+61',  flag: '🇦🇺', name: 'Australia' },
  { code: '+65',  flag: '🇸🇬', name: 'Singapore' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+60',  flag: '🇲🇾', name: 'Malaysia' },
];

const ROLE_PATHS: Record<string, string> = {
  attendee: '/dashboard',
  organizer: '/organizer/dashboard',
  admin: '/admin/dashboard',
};

type Step = 'phone' | 'otp';

const OnboardingPhone = () => {
  const user     = useAppStore((s) => s.user);
  const updateUser = useAppStore((s) => s.updateUser);
  const navigate = useNavigate();

  const [step, setStep]             = useState<Step>('phone');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone]           = useState('');
  const [otp, setOtp]               = useState(['', '', '', '', '', '']);
  const [loading, setLoading]       = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  if (!user) { navigate('/login'); return null; }

  const defaultDestination = ROLE_PATHS[user.role] ?? '/dashboard';
  const fullPhone    = `${countryCode}${phone.replace(/\s/g, '')}`;
  const firstName    = user.name.split(' ')[0] || 'there';
  const otpValue     = otp.join('');

  // ─── Send OTP ──────────────────────────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 7) { toast.error('Enter a valid phone number'); return; }

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
    setLoading(false);

    if (error) {
      toast.error(error.message || 'Failed to send OTP. Check Supabase phone settings.');
      return;
    }

    toast.success(`OTP sent to ${countryCode} ${phone}`);
    setStep('otp');
    startResendCooldown();
  };

  // ─── Verify OTP ────────────────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue.length < 6) { toast.error('Enter the 6-digit OTP'); return; }

    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      phone: fullPhone,
      token: otpValue,
      type: 'sms',
    });

    if (error) {
      setLoading(false);
      toast.error(error.message || 'Invalid OTP. Please try again.');
      return;
    }

    // OTP verified — save phone to backend
    const savedPhone = `${countryCode} ${phone.trim()}`;
    try {
      await apiFetch('/users/me', {
        method: 'PUT',
        body: JSON.stringify({ phone: savedPhone }),
      });
    } catch {
      // non-fatal
    }

    updateUser({ phone: savedPhone });
    toast.success('Phone verified!');
    navigate(takePostAuthReturnPath() ?? defaultDestination);
    setLoading(false);
  };

  // ─── OTP input handlers ─────────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      otpRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  // ─── Resend cooldown ────────────────────────────────────────────────────────
  const startResendCooldown = () => {
    setResendCooldown(30);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
    setLoading(false);
    if (error) { toast.error('Failed to resend OTP'); return; }
    toast.success('OTP resent!');
    setOtp(['', '', '', '', '', '']);
    startResendCooldown();
    otpRefs.current[0]?.focus();
  };

  const handleSkip = () => navigate(takePostAuthReturnPath() ?? defaultDestination);

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        {/* Avatar */}
        <div className="text-center mb-8">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name}
              className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-primary/30 object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full mx-auto mb-3 gold-gradient-bg flex items-center justify-center text-2xl font-bold text-primary-foreground">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {/* ── Step 1: Phone input ── */}
          {step === 'phone' && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="font-display text-2xl font-semibold text-foreground text-center mb-1">
                Welcome, {firstName}!
              </h1>
              <p className="text-muted-foreground text-sm text-center mb-8">
                Add your phone number to connect at events.
              </p>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Phone number</label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="gold-input appearance-none cursor-pointer"
                      style={{ minWidth: '90px' }}
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                      ))}
                    </select>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="gold-input w-full pl-10"
                        placeholder="98765 43210"
                        autoFocus
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" variant="gold" className="w-full h-11" size="lg" disabled={loading}>
                  {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
                  ) : (
                    <>Send OTP <ArrowRight className="w-4 h-4 ml-1" /></>
                  )}
                </Button>

                <button type="button" onClick={handleSkip}
                  className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
                  Skip for now
                </button>
              </form>
            </motion.div>
          )}

          {/* ── Step 2: OTP input ── */}
          {step === 'otp' && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl gold-gradient-bg flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-7 h-7 text-primary-foreground" />
                </div>
                <h1 className="font-display text-2xl font-semibold text-foreground mb-1">
                  Verify your number
                </h1>
                <p className="text-muted-foreground text-sm">
                  Enter the 6-digit code sent to<br />
                  <span className="text-foreground font-medium">{countryCode} {phone}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {/* OTP boxes */}
                <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={`w-11 h-13 text-center text-xl font-bold gold-input transition-all duration-200
                        ${digit ? 'border-primary text-foreground' : 'text-muted-foreground'}
                        focus:border-primary focus:ring-2 focus:ring-primary/20`}
                      style={{ height: '52px' }}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  className="w-full h-11"
                  size="lg"
                  disabled={loading || otpValue.length < 6}
                >
                  {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
                  ) : (
                    <>Verify &amp; Continue <ShieldCheck className="w-4 h-4 ml-1" /></>
                  )}
                </Button>

                {/* Resend + change number */}
                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']); }}
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    ← Change number
                  </button>

                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0}
                    className="flex items-center gap-1 text-muted-foreground hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-10">
          <div className={`h-2 rounded-full transition-all duration-300 ${step === 'phone' ? 'w-6 gold-gradient-bg' : 'w-2 bg-primary/30'}`} />
          <div className={`h-2 rounded-full transition-all duration-300 ${step === 'otp' ? 'w-6 gold-gradient-bg' : 'w-2 bg-primary/30'}`} />
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingPhone;
