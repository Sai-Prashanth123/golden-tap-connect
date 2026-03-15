import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { QRCodeSVG } from 'qrcode.react';
import { useAppStore } from '@/store/appStore';
import { Scan, QrCode, Nfc, User, Sparkles, UserPlus, StickyNote, X } from 'lucide-react';

const ConnectPage = () => {
  const [mode, setMode] = useState<'scan' | 'show' | 'nfc'>('scan');
  const [showResult, setShowResult] = useState(false);
  const user = useAppStore((s) => s.user);

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto space-y-6 pb-20 md:pb-0">
        <h1 className="font-display text-3xl font-semibold text-foreground">Connect</h1>

        {/* Mode Switcher */}
        <div className="flex gap-2">
          {[
            { value: 'scan' as const, icon: Scan, label: 'Scan QR' },
            { value: 'show' as const, icon: QrCode, label: 'My QR' },
            { value: 'nfc' as const, icon: Nfc, label: 'NFC' },
          ].map((m) => (
            <Button
              key={m.value}
              variant={mode === m.value ? 'gold' : 'gold-ghost'}
              size="sm"
              onClick={() => setMode(m.value)}
            >
              <m.icon className="w-4 h-4 mr-1" /> {m.label}
            </Button>
          ))}
        </div>

        {/* Scan Mode */}
        {mode === 'scan' && (
          <GlassCard className="text-center py-12">
            <div className="relative w-48 h-48 mx-auto mb-6 rounded-2xl border-2 border-primary/30 flex items-center justify-center">
              {/* Gold corner brackets */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-lg" />
              <Scan className="w-12 h-12 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">Point at another attendee's QR code</p>
            <Button variant="gold" onClick={() => setShowResult(true)}>
              Simulate Scan
            </Button>
          </GlassCard>
        )}

        {/* Show QR Mode */}
        {mode === 'show' && (
          <GlassCard className="text-center py-8">
            <div className="bg-foreground p-4 rounded-2xl inline-block mb-4">
              <QRCodeSVG
                value={`founderkey://connect/${user?.id || '1'}`}
                size={200}
                bgColor="#E8E0D0"
                fgColor="#0D0D0D"
              />
            </div>
            <p className="font-display text-lg font-semibold text-foreground">{user?.name || 'Alex Chen'}</p>
            <p className="text-sm text-muted-foreground">{user?.designation} · {user?.company}</p>
          </GlassCard>
        )}

        {/* NFC Mode */}
        {mode === 'nfc' && (
          <GlassCard className="text-center py-12">
            <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
              <Nfc className="w-12 h-12 text-primary relative z-10" />
              <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-nfc-pulse" />
              <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-nfc-pulse" style={{ animationDelay: '0.6s' }} />
              <div className="absolute inset-0 rounded-full border-2 border-primary/10 animate-nfc-pulse" style={{ animationDelay: '1.2s' }} />
            </div>
            <p className="text-foreground font-medium mb-2">Hold your FounderCard near their device</p>
            <p className="text-sm text-muted-foreground">Make sure NFC is enabled on both devices</p>
          </GlassCard>
        )}

        {/* Connection Result */}
        {showResult && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
            <GlassCard className="w-full max-w-md gold-border-glow animate-fade-in">
              <button onClick={() => setShowResult(false)} className="absolute top-4 right-4 text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full gold-gradient-bg flex items-center justify-center text-primary-foreground text-2xl font-display font-bold mx-auto mb-4">
                  P
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">Priya Sharma</h3>
                <p className="text-sm text-muted-foreground mb-3">CEO · TechVentures</p>

                <div className="glass-card p-3 mb-4 text-left">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      You're both building in fintech and attended BLR Tech Week together
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="gold" className="flex-1" onClick={() => setShowResult(false)}>
                    <UserPlus className="w-4 h-4 mr-1" /> Save Connection
                  </Button>
                  <Button variant="gold-ghost" size="icon">
                    <StickyNote className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ConnectPage;
