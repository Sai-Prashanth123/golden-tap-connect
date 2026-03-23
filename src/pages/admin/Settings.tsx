import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';
import { usePlatformSettings, useUpdatePlatformSetting } from '@/hooks/useAdmin';

interface PlatformSetting {
  key: string;
  value: string;
  type: string;
  label?: string;
}

const AdminSettingsPage = () => {
  const { data: settings, isLoading } = usePlatformSettings();
  const updateSetting = useUpdatePlatformSetting();
  const [localValues, setLocalValues] = useState<Record<string, string>>({});

  const getValue = (key: string, fallback: string) => localValues[key] ?? fallback;

  const handleSave = (key: string) => {
    if (localValues[key] !== undefined) {
      updateSetting.mutate({ key, value: localValues[key] });
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="font-display text-3xl font-semibold text-foreground">Platform Settings</h1>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-muted/50 rounded-xl animate-pulse" />)}
          </div>
        ) : settings && settings.length > 0 ? (
          <GlassCard>
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">Configuration</h2>
            <div className="space-y-4">
              {(settings as PlatformSetting[]).map((s) => (
                <div key={s.key}>
                  <label className="text-sm font-medium text-foreground block mb-1.5">
                    {s.label ?? s.key}
                  </label>
                  <div className="flex gap-2">
                    {s.type === 'boolean' ? (
                      <button
                        onClick={() => {
                          const newVal = getValue(s.key, s.value) === 'true' ? 'false' : 'true';
                          setLocalValues((prev) => ({ ...prev, [s.key]: newVal }));
                          updateSetting.mutate({ key: s.key, value: newVal });
                        }}
                        className={`relative w-10 h-6 rounded-full transition-colors ${
                          getValue(s.key, s.value) === 'true' ? 'bg-primary/30' : 'bg-muted'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full absolute top-0.5 transition-all ${
                          getValue(s.key, s.value) === 'true' ? 'right-0.5 gold-gradient-bg' : 'left-0.5 bg-muted-foreground'
                        }`} />
                      </button>
                    ) : (
                      <>
                        <Input
                          value={getValue(s.key, s.value)}
                          onChange={(e) => setLocalValues((prev) => ({ ...prev, [s.key]: e.target.value }))}
                          className="flex-1"
                        />
                        <Button
                          variant="gold-ghost"
                          size="sm"
                          onClick={() => handleSave(s.key)}
                          disabled={updateSetting.isPending || localValues[s.key] === undefined}
                        >
                          <Save className="w-3.5 h-3.5" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        ) : (
          <GlassCard>
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">Feature Flags</h2>
            <p className="text-sm text-muted-foreground text-center py-4">
              No platform settings configured. Add settings via the database <code className="text-primary">platform_settings</code> table.
            </p>
          </GlassCard>
        )}

        <GlassCard>
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">Tracking</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Meta Pixel ID</label>
              <Input placeholder="Enter Pixel ID" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Google Analytics ID</label>
              <Input placeholder="G-XXXXXXXXXX" />
            </div>
          </div>
        </GlassCard>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
