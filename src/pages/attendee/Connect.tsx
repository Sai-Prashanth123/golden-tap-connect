import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { QRCodeSVG } from 'qrcode.react';
import { useAppStore } from '@/store/appStore';
import { useMyCard } from '@/hooks/useFounderCard';
import { useMyProfile } from '@/hooks/useProfile';
import { Scan, QrCode, Nfc, User, Sparkles, UserPlus } from 'lucide-react';

const ConnectPage = () => {
  const [mode, setMode] = useState<'scan' | 'show' | 'nfc'>('show');
  const user = useAppStore((s) => s.user);
  const { data: card } = useMyCard();
  const { data: profileData } = useMyProfile();

  const profile = profileData?.profile;
  const fullName = profile ? `${profile.firstName} ${profile.lastName}` : user?.name ?? '';
  const qrValue = `founderkey://profile/${user?.id}`;

  return (
    <AppLayout>
      <div className="space-y-6 pb-24 md:pb-8">
        <h1 className="font-display text-3xl font-semibold text-foreground">Connect</h1>

        {/* Mode tabs */}
        <div className="flex gap-1 p-1 glass-card rounded-xl">
          {([
            { key: 'show', label: 'My QR', icon: QrCode },
            { key: 'scan', label: 'Scan', icon: Scan },
            { key: 'nfc', label: 'NFC', icon: Nfc },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
                mode === key ? 'gold-gradient-bg text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {mode === 'show' && (
          <GlassCard className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground font-semibold">
                {fullName[0] ?? 'U'}
              </div>
              <div className="text-left">
                <p className="font-display text-lg font-semibold text-foreground">{fullName}</p>
                <p className="text-xs text-muted-foreground">{profileData?.email}</p>
              </div>
            </div>

            <div className="bg-foreground p-5 rounded-2xl inline-block mb-6 gold-glow">
              <QRCodeSVG
                value={qrValue}
                size={200}
                bgColor="#E8E0D0"
                fgColor="#0D0D0D"
                level="M"
              />
            </div>

            {card?.status === 'ACTIVE' && (
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">FounderKey Card Active</span>
              </div>
            )}

            <p className="text-xs text-muted-foreground mb-4">
              Others can scan this to instantly view your profile and connect.
            </p>
            <Button variant="gold" size="sm" onClick={() => {
              if (navigator.share) {
                navigator.share({ title: `Connect with ${fullName} on FounderKey`, url: qrValue }).catch(() => {});
              }
            }}>
              <UserPlus className="w-3.5 h-3.5 mr-1.5" /> Share Profile
            </Button>
          </GlassCard>
        )}

        {mode === 'scan' && (
          <GlassCard className="text-center py-12">
            <Scan className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">Camera Scanner</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Point your camera at another user's FounderKey QR code to instantly connect.
            </p>
            <p className="text-xs text-muted-foreground/60">
              Camera access requires a native app or browser with camera permissions.
            </p>
          </GlassCard>
        )}

        {mode === 'nfc' && (
          <GlassCard className="text-center py-12">
            <Nfc className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">NFC Tap-to-Connect</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Tap your phone with another FounderKey user to instantly exchange profiles.
            </p>
            {card?.status !== 'ACTIVE' ? (
              <div>
                <p className="text-xs text-muted-foreground/60 mb-4">NFC requires an active FounderKey card.</p>
                <Button variant="gold" size="sm" asChild>
                  <a href="/apply-card">Apply for Card</a>
                </Button>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground/60">
                Hold your device near another FounderKey user's phone.
              </p>
            )}
          </GlassCard>
        )}

        {/* Stats */}
        <GlassCard>
          <h3 className="text-sm font-medium text-foreground mb-3">Your Profile Stats</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'Profile views', value: '—' },
              { label: 'QR scans', value: '—' },
              { label: 'Connections', value: '—' },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </AppLayout>
  );
};

export default ConnectPage;
