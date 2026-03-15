import { useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { CreditCard, MapPin, Check, ArrowRight, ArrowLeft, Zap } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const ApplyCardPage = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center"><Logo /></div>

        {/* Progress */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`h-1 rounded-full transition-all ${s <= step ? 'bg-primary w-10' : 'bg-border w-6'}`} />
          ))}
        </div>

        {step === 1 && (
          <GlassCard>
            <CreditCard className="w-8 h-8 text-primary mb-4" />
            <h2 className="font-display text-2xl font-semibold text-foreground mb-2">Apply for FounderCard</h2>
            <p className="text-sm text-muted-foreground mb-6">Your premium NFC networking card</p>
            <div className="space-y-3 mb-6">
              {['Premium NFC card delivered to your door', 'One-tap connection at any event', 'Digital QR available immediately', 'Priority at all FounderKey events'].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" /> {f}
                </div>
              ))}
            </div>
            <Button variant="gold" className="w-full" size="lg" onClick={() => setStep(2)}>
              Continue <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </GlassCard>
        )}

        {step === 2 && (
          <GlassCard>
            <MapPin className="w-8 h-8 text-primary mb-4" />
            <h2 className="font-display text-2xl font-semibold text-foreground mb-6">Shipping Address</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Full Name</label>
                <input className="gold-input w-full" placeholder="Alex Chen" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Address</label>
                <input className="gold-input w-full" placeholder="123 Main St, Apt 4" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">City</label>
                  <input className="gold-input w-full" placeholder="San Francisco" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">ZIP Code</label>
                  <input className="gold-input w-full" placeholder="94102" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="gold-ghost" onClick={() => setStep(1)}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
                <Button variant="gold" className="flex-1" size="lg" onClick={() => setStep(3)}>
                  Continue <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </GlassCard>
        )}

        {step === 3 && (
          <GlassCard>
            <Zap className="w-8 h-8 text-primary mb-4" />
            <h2 className="font-display text-2xl font-semibold text-foreground mb-6">Select Plan</h2>
            <div className="space-y-3 mb-6">
              {[
                { name: 'Monthly', price: '$29/mo', desc: 'Cancel anytime' },
                { name: 'Annual', price: '$19/mo', desc: 'Save 34% — billed yearly', popular: true },
              ].map((p, i) => (
                <div key={i} className={`glass-card p-4 cursor-pointer transition-all ${p.popular ? 'gold-border-glow' : 'hover:border-primary/30'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.desc}</p>
                    </div>
                    <span className="font-display text-lg font-bold gold-gradient-text">{p.price}</span>
                  </div>
                  {p.popular && <span className="gold-pill text-[10px] mt-2 inline-block">Best Value</span>}
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="gold-ghost" onClick={() => setStep(2)}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
              <Button variant="gold" className="flex-1" size="lg" onClick={() => setStep(4)}>
                Subscribe <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </GlassCard>
        )}

        {step === 4 && (
          <GlassCard className="text-center gold-border-glow">
            <div className="w-16 h-16 rounded-full gold-gradient-bg flex items-center justify-center mx-auto mb-4 gold-glow">
              <Check className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-2">Your FounderCard is on its way!</h2>
            <p className="text-sm text-muted-foreground mb-6">Physical card arrives in 5–7 business days. Your digital QR is ready now.</p>
            <div className="bg-foreground p-4 rounded-2xl inline-block mb-6">
              <QRCodeSVG value="founderkey://card/1" size={160} bgColor="#E8E0D0" fgColor="#0D0D0D" />
            </div>
            <div className="space-y-2">
              <Button variant="gold" className="w-full" size="lg" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
};

export default ApplyCardPage;
