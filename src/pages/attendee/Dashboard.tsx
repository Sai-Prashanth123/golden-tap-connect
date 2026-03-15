import { AppLayout } from '@/components/AppLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import { Link } from 'react-router-dom';
import {
  QrCode, Scan, CreditCard, Share2, Calendar, Users,
  Trophy, ChevronRight, Sparkles, Zap
} from 'lucide-react';

const AttendeeDashboard = () => {
  const user = useAppStore((s) => s.user);

  return (
    <AppLayout>
      <div className="space-y-6 pb-20 md:pb-0">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
            Welcome back, <span className="gold-gradient-text">{user?.name?.split(' ')[0] || 'there'}</span>
          </h1>
          <p className="text-muted-foreground mt-1">Here's what's happening in your network</p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bento-stagger">
          {/* A: Hero event card - wide */}
          <GlassCard hover className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Today's Event</span>
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-1">BLR Tech Week 2026</h3>
            <p className="text-sm text-muted-foreground mb-4">10:00 AM · Bangalore International Centre</p>
            <Button variant="gold" size="sm" asChild>
              <Link to="/connect"><QrCode className="w-4 h-4 mr-1" /> Check In</Link>
            </Button>
          </GlassCard>

          {/* B: AI Matches */}
          <GlassCard hover>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">AI Matches</span>
            </div>
            <p className="font-display text-3xl font-bold text-foreground">3</p>
            <p className="text-sm text-muted-foreground">new matches today</p>
            <Link to="/discover" className="text-primary text-xs mt-3 inline-flex items-center gap-1 hover:underline">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </GlassCard>

          {/* C: FK Score */}
          <GlassCard hover>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">FK Score</span>
            </div>
            <div className="relative w-20 h-20 mx-auto my-2">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
                <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(var(--gold-primary))" strokeWidth="2" strokeDasharray={`${user?.fkScore || 87}, 100`} strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-display text-xl font-bold text-foreground">{user?.fkScore || 87}</span>
            </div>
            <p className="text-xs text-center text-muted-foreground">Gold Connector</p>
          </GlassCard>

          {/* D: Connections feed - tall */}
          <GlassCard hover className="lg:row-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Recent Connections</span>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Priya Sharma', role: 'CEO, TechVentures', time: '2h ago' },
                { name: 'James Liu', role: 'Partner, Sequoia', time: '5h ago' },
                { name: 'Sarah Mitchell', role: 'Founder, GreenScale', time: '1d ago' },
                { name: 'Raj Patel', role: 'CTO, Finova', time: '1d ago' },
                { name: 'Mika Tanaka', role: 'VP Eng, ByteDance', time: '2d ago' },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="w-8 h-8 rounded-full gold-gradient-bg flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                    {c.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{c.role}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground flex-shrink-0">{c.time}</span>
                </div>
              ))}
            </div>
            <Link to="/connections" className="text-primary text-xs mt-4 inline-flex items-center gap-1 hover:underline">
              View all {user?.connectionsCount || 142} <ChevronRight className="w-3 h-3" />
            </Link>
          </GlassCard>

          {/* E: Active Challenge */}
          <GlassCard hover>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Challenge</span>
            </div>
            <p className="text-sm font-medium text-foreground mb-2">Meet 5 speakers</p>
            <div className="w-full h-2 rounded-full bg-muted mb-1">
              <div className="h-full rounded-full gold-gradient-bg" style={{ width: '60%' }} />
            </div>
            <p className="text-xs text-muted-foreground">3/5 completed · Unlock VIP Lounge</p>
          </GlassCard>

          {/* F: Quick Actions */}
          <GlassCard hover>
            <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-3">Quick Actions</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Scan, label: 'Scan QR', to: '/connect' },
                { icon: QrCode, label: 'My QR', to: '/connect' },
                { icon: CreditCard, label: 'My Card', to: '/apply-card' },
                { icon: Share2, label: 'Network', to: '/connections' },
              ].map((a, i) => (
                <Link key={i} to={a.to} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <a.icon className="w-5 h-5 text-primary" />
                  <span className="text-[10px] text-muted-foreground">{a.label}</span>
                </Link>
              ))}
            </div>
          </GlassCard>

          {/* G: Events this week - wide */}
          <GlassCard hover className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Events This Week</span>
              </div>
              <Link to="/events" className="text-primary text-xs hover:underline">See all</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
              {[
                { name: 'BLR Tech Week', date: 'Today', attendees: 420 },
                { name: 'AI Founders Meetup', date: 'Wed', attendees: 85 },
                { name: 'Climate Summit', date: 'Fri', attendees: 200 },
              ].map((e, i) => (
                <div key={i} className="glass-card p-4 min-w-[180px] flex-shrink-0">
                  <p className="font-medium text-sm text-foreground mb-1">{e.name}</p>
                  <p className="text-xs text-muted-foreground">{e.date} · {e.attendees} attendees</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Connections', value: user?.connectionsCount || 142 },
            { label: 'Events Attended', value: user?.eventsAttended || 23 },
            { label: 'FK Score', value: user?.fkScore || 87 },
          ].map((s, i) => (
            <GlassCard key={i} className="text-center py-4">
              <p className="font-display text-2xl md:text-3xl font-bold gold-gradient-text">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default AttendeeDashboard;
