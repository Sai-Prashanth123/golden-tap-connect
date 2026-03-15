import { AdminLayout } from '@/components/AdminLayout';
import { GlassCard } from '@/components/GlassCard';
import { Toggle } from '@/components/ui/toggle';
import { Settings, Mail, BarChart3, Nfc, Gamepad2 } from 'lucide-react';

const AdminSettingsPage = () => (
  <AdminLayout>
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="font-display text-3xl font-semibold text-foreground">Platform Settings</h1>

      <GlassCard>
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">Feature Flags</h2>
        <div className="space-y-3">
          {[
            { label: 'AI Matchmaking', icon: Settings, enabled: true },
            { label: 'Gamification', icon: Gamepad2, enabled: true },
            { label: 'Spin-to-Meet', icon: Gamepad2, enabled: false },
            { label: 'NFC Card Orders', icon: Nfc, enabled: true },
          ].map((f, i) => (
            <div key={i} className="flex items-center justify-between p-3 glass-card">
              <div className="flex items-center gap-3">
                <f.icon className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">{f.label}</span>
              </div>
              <div className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${f.enabled ? 'bg-primary/30' : 'bg-muted'}`}>
                <div className={`w-5 h-5 rounded-full absolute top-0.5 transition-all ${f.enabled ? 'right-0.5 gold-gradient-bg' : 'left-0.5 bg-muted-foreground'}`} />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">Tracking</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Meta Pixel ID</label>
            <input className="gold-input w-full" placeholder="Enter Pixel ID" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Google Analytics ID</label>
            <input className="gold-input w-full" placeholder="G-XXXXXXXXXX" />
          </div>
        </div>
      </GlassCard>
    </div>
  </AdminLayout>
);

export default AdminSettingsPage;
