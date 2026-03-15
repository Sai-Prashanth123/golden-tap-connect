import { AppLayout } from '@/components/AppLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import {
  MapPin, Linkedin, Twitter, Globe, Mail, Edit3, CreditCard
} from 'lucide-react';

const ProfilePage = () => {
  const user = useAppStore((s) => s.user);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6 pb-20 md:pb-0">
        {/* Header Card */}
        <GlassCard className="text-center">
          <div className="w-24 h-24 rounded-full gold-gradient-bg flex items-center justify-center text-primary-foreground text-3xl font-display font-bold mx-auto mb-4 ring-4 ring-primary/20">
            {user?.name?.[0] || 'A'}
          </div>
          <h1 className="font-display text-2xl font-semibold text-foreground">{user?.name || 'Alex Chen'}</h1>
          <p className="text-muted-foreground text-sm">{user?.designation || 'Founder & CEO'} · {user?.company || 'NexusAI'}</p>
          {user?.location && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3" /> {user.location}
            </p>
          )}
          <div className="flex justify-center gap-3 mt-4">
            <Button variant="gold" size="sm"><Edit3 className="w-4 h-4 mr-1" /> Edit Profile</Button>
          </div>
        </GlassCard>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Connections', value: user?.connectionsCount || 142 },
            { label: 'Events', value: user?.eventsAttended || 23 },
            { label: 'FK Score', value: user?.fkScore || 87 },
          ].map((s, i) => (
            <GlassCard key={i} className="text-center py-3">
              <p className="font-display text-xl font-bold gold-gradient-text">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </GlassCard>
          ))}
        </div>

        {/* Bio */}
        {user?.bio && (
          <GlassCard>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">About</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{user.bio}</p>
          </GlassCard>
        )}

        {/* Tags */}
        <GlassCard>
          <div className="space-y-4">
            {[
              { label: 'Industry', items: [user?.industry || 'AI / Machine Learning'] },
              { label: 'Skills', items: user?.skills || [] },
              { label: 'Interests', items: user?.interests || [] },
              { label: 'Looking For', items: user?.lookingFor || [] },
            ].map((section, i) => (
              <div key={i}>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{section.label}</p>
                <div className="flex flex-wrap gap-2">
                  {section.items.map((item, j) => (
                    <span key={j} className="gold-pill">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Social Links */}
        <GlassCard>
          <h3 className="font-display text-lg font-semibold text-foreground mb-3">Links</h3>
          <div className="space-y-2">
            {[
              { icon: Linkedin, label: 'LinkedIn', value: user?.linkedin },
              { icon: Twitter, label: 'Twitter/X', value: user?.twitter },
              { icon: Globe, label: 'Website', value: user?.website },
              { icon: Mail, label: 'Email', value: user?.email },
            ].filter(l => l.value).map((l, i) => (
              <a key={i} href={l.value?.startsWith('http') ? l.value : `mailto:${l.value}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors text-sm text-foreground">
                <l.icon className="w-4 h-4 text-primary" />
                <span className="truncate">{l.value}</span>
              </a>
            ))}
          </div>
        </GlassCard>

        {/* FounderCard */}
        <GlassCard className="gold-border-glow">
          <div className="flex items-center gap-3 mb-3">
            <CreditCard className="w-5 h-5 text-primary" />
            <h3 className="font-display text-lg font-semibold text-foreground">FounderCard</h3>
          </div>
          {user?.hasFounderCard ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm text-foreground">Active</span>
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground mb-3">Get your physical NFC card to connect with a single tap</p>
              <Button variant="gold" size="sm">Apply for FounderCard</Button>
            </div>
          )}
        </GlassCard>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
