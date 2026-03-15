import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import { Link } from 'react-router-dom';
import {
  QrCode, Scan, CreditCard, Share2, Calendar, Users,
  Trophy, ChevronRight, Sparkles, Zap, MapPin, TrendingUp,
  ArrowUpRight, Star, Activity,
} from 'lucide-react';

/* ── Animated counter ─────────────────────────────── */
const Counter = ({ to, duration = 1.4 }: { to: number; duration?: number }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = to / (duration * 60);
    const id = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(id); }
      else setVal(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(id);
  }, [to, duration]);
  return <>{val}</>;
};

/* ── Section header ───────────────────────────────── */
const SectionHeader = ({ icon: Icon, label, linkTo, linkLabel }: { icon: any; label: string; linkTo?: string; linkLabel?: string }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-lg gold-gradient-bg-subtle flex items-center justify-center">
        <Icon className="w-3.5 h-3.5 text-primary" />
      </div>
      <span className="section-label">{label}</span>
    </div>
    {linkTo && (
      <Link to={linkTo} className="flex items-center gap-1 text-[11px] text-primary hover:text-gold-bright transition-colors font-medium">
        {linkLabel || 'View all'} <ArrowUpRight className="w-3 h-3" />
      </Link>
    )}
  </div>
);

const AttendeeDashboard = () => {
  const user = useAppStore((s) => s.user);

  const recentConnections = [
    { name: 'Priya Sharma', role: 'CEO', company: 'TechVentures', time: '2h', warm: true },
    { name: 'James Liu', role: 'Partner', company: 'Sequoia', time: '5h', warm: true },
    { name: 'Sarah Mitchell', role: 'Founder', company: 'GreenScale', time: '1d', warm: false },
    { name: 'Raj Patel', role: 'CTO', company: 'Finova', time: '1d', warm: true },
    { name: 'Mika Tanaka', role: 'VP Eng', company: 'ByteDance', time: '2d', warm: false },
  ];

  const upcomingEvents = [
    { name: 'BLR Tech Week', date: 'Today', attendees: 420, live: true },
    { name: 'AI Founders Meetup', date: 'Wed', attendees: 85, live: false },
    { name: 'Climate Summit', date: 'Fri', attendees: 200, live: false },
  ];

  const quickActions = [
    { icon: Scan, label: 'Scan QR', to: '/connect', color: 'from-amber-500/20 to-yellow-600/10', border: 'border-amber-500/20' },
    { icon: QrCode, label: 'My QR', to: '/connect', color: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/20' },
    { icon: CreditCard, label: 'My Card', to: '/apply-card', color: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/20' },
    { icon: Share2, label: 'Network', to: '/connections', color: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/20' },
  ];

  const stats = [
    { label: 'Connections', value: user?.connectionsCount || 142, delta: '+12', icon: Users },
    { label: 'Events', value: user?.eventsAttended || 23, delta: '+2', icon: Calendar },
    { label: 'FK Score', value: user?.fkScore || 87, delta: '+5', icon: Star },
  ];

  return (
    <AppLayout>
      <div className="space-y-7 pb-28 md:pb-10">

        {/* ── Greeting ─────────────────────────────────────── */}
        <div className="pt-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground leading-tight">
              Welcome back,{' '}
              <span className="gold-gradient-text">{user?.name?.split(' ')[0] || 'there'}</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-base">Your network is growing · {user?.connectionsCount || 142} connections made</p>
          </motion.div>
        </div>

        {/* ── Stats Row ─────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4 bento-stagger">
          {stats.map(({ label, value, delta, icon: Icon }) => (
            <GlassCard key={label} hover className="text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full gold-gradient-bg opacity-[0.04] -translate-y-8 translate-x-8" />
              <div className="flex items-center justify-center mb-1">
                <div className="w-8 h-8 rounded-xl gold-gradient-bg-subtle flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
              </div>
              <p className="font-display text-3xl font-bold gold-gradient-text mt-2">
                <Counter to={value} />
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-400 font-medium mt-1">
                <TrendingUp className="w-3 h-3" />{delta}
              </span>
            </GlassCard>
          ))}
        </div>

        {/* ── Main Bento Grid ───────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 bento-stagger">

          {/* Hero Event — 7 cols */}
          <GlassCard hover glow className="lg:col-span-7 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(212,168,76,0.08)_0%,transparent_60%)]" />
            <SectionHeader icon={Calendar} label="Today's Event" linkTo="/events" linkLabel="All events" />
            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="live-dot" />
                    <span className="text-[11px] font-semibold text-emerald-400 tracking-wide uppercase">Live Now</span>
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-foreground mb-1">BLR Tech Week 2026</h3>
                  <div className="space-y-1 mb-5">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-primary/60" /> Today, 10:00 AM – 6:00 PM
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-primary/60" /> Bangalore International Centre
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-primary/60" /> 420 attendees registered
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="gold" size="sm" asChild>
                      <Link to="/connect"><QrCode className="w-3.5 h-3.5 mr-1.5" /> Check In</Link>
                    </Button>
                    <Button variant="gold-ghost" size="sm" asChild>
                      <Link to="/event/1">View Details</Link>
                    </Button>
                  </div>
                </div>
                {/* Event illustration */}
                <div className="hidden sm:flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl gold-gradient-bg-subtle border border-primary/20 flex items-center justify-center">
                    <Calendar className="w-9 h-9 text-primary" />
                  </div>
                  <span className="gold-pill text-[10px]">Premium Seat</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* AI Matches — 5 cols */}
          <GlassCard hover className="lg:col-span-5">
            <SectionHeader icon={Sparkles} label="AI Matches" linkTo="/discover" />
            <div className="flex items-end gap-4 mb-4">
              <div>
                <p className="font-display text-5xl font-bold gold-gradient-text leading-none">3</p>
                <p className="text-sm text-muted-foreground mt-1">new today</p>
              </div>
              <div className="flex-1 mb-1">
                <div className="space-y-1.5">
                  {[
                    { name: 'Priya S.', pct: 94 },
                    { name: 'James L.', pct: 88 },
                    { name: 'Raj P.', pct: 82 },
                  ].map((m) => (
                    <div key={m.name} className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground w-14 truncate">{m.name}</span>
                      <div className="flex-1 progress-track">
                        <motion.div
                          className="progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${m.pct}%` }}
                          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                      <span className="text-[11px] text-primary font-medium">{m.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Button variant="gold" size="sm" className="w-full" asChild>
              <Link to="/discover"><Sparkles className="w-3.5 h-3.5 mr-1.5" /> View Matches</Link>
            </Button>
          </GlassCard>

          {/* Recent Connections — 5 cols, row-span */}
          <GlassCard className="lg:col-span-5 lg:row-span-2">
            <SectionHeader icon={Users} label="Recent Connections" linkTo="/connections" linkLabel={`All ${user?.connectionsCount || 142}`} />
            <div className="space-y-2">
              {recentConnections.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-9 h-9 rounded-xl gold-gradient-bg flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {c.name[0]}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background ${c.warm ? 'bg-amber-500' : 'bg-blue-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{c.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{c.role} · {c.company}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground flex-shrink-0 group-hover:text-primary/60 transition-colors">{c.time}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-white/[0.05] flex justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Warm</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Cold</span>
            </div>
          </GlassCard>

          {/* FK Score — 4 cols */}
          <GlassCard hover className="lg:col-span-4">
            <SectionHeader icon={Trophy} label="FK Score" />
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
                  <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                  <motion.circle
                    cx="22" cy="22" r="18"
                    fill="none"
                    stroke="url(#scoreGrad)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${(user?.fkScore || 87) * 1.131} 113.1`}
                    initial={{ strokeDasharray: '0 113.1' }}
                    animate={{ strokeDasharray: `${(user?.fkScore || 87) * 1.131} 113.1` }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                  />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(40,72%,58%)" />
                      <stop offset="100%" stopColor="hsl(38,85%,68%)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-2xl font-bold gold-gradient-text leading-none">
                    <Counter to={user?.fkScore || 87} />
                  </span>
                  <span className="text-[9px] text-muted-foreground">/ 100</span>
                </div>
              </div>
              <div>
                <p className="text-base font-semibold text-foreground mb-1">Gold Connector</p>
                <p className="text-xs text-muted-foreground mb-3">Top 15% this month</p>
                <div className="space-y-1.5">
                  {[
                    { label: 'Network', pct: 78 },
                    { label: 'Events', pct: 92 },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground w-12">{s.label}</span>
                      <div className="flex-1 progress-track">
                        <motion.div
                          className="progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${s.pct}%` }}
                          transition={{ duration: 1, delay: 0.6 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Challenge — 3 cols */}
          <GlassCard hover className="lg:col-span-3">
            <SectionHeader icon={Zap} label="Active Challenge" />
            <div className="space-y-4">
              <div>
                <p className="text-base font-semibold text-foreground mb-0.5">Meet 5 speakers</p>
                <p className="text-xs text-muted-foreground mb-3">Unlock VIP Lounge access</p>
                <div className="progress-track mb-1.5">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: '60%' }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                  />
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">3 of 5 done</span>
                  <span className="text-primary font-medium">60%</span>
                </div>
              </div>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className={`flex-1 h-1.5 rounded-full ${n <= 3 ? 'gold-gradient-bg' : 'bg-white/[0.06]'}`} />
                ))}
              </div>
              <p className="text-[11px] text-primary flex items-center gap-1">
                <Star className="w-3 h-3" /> 2 more to unlock reward
              </p>
            </div>
          </GlassCard>

          {/* Quick Actions — 4 cols */}
          <GlassCard className="lg:col-span-4">
            <span className="section-label block mb-4">Quick Actions</span>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((a, i) => (
                <motion.div key={i} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    to={a.to}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br ${a.color} border ${a.border} hover:border-opacity-60 transition-all duration-200`}
                  >
                    <div className="w-9 h-9 rounded-xl gold-gradient-bg-subtle flex items-center justify-center">
                      <a.icon className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <span className="text-[11px] font-medium text-foreground">{a.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Events this week — 8 cols */}
          <GlassCard className="lg:col-span-8">
            <SectionHeader icon={Calendar} label="Events This Week" linkTo="/events" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {upcomingEvents.map((e, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -3 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                >
                  <Link to="/events" className={`block p-4 rounded-2xl border transition-all ${e.live ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/[0.05] bg-white/[0.02] hover:border-primary/20'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {e.live
                        ? <div className="live-dot" />
                        : <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                      }
                      <span className={`text-[10px] font-semibold uppercase tracking-wide ${e.live ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                        {e.date}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-foreground mb-1 leading-snug">{e.name}</p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Users className="w-3 h-3" /> {e.attendees}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </GlassCard>

        </div>
      </div>
    </AppLayout>
  );
};

export default AttendeeDashboard;
