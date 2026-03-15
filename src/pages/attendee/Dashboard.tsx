import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import { Link } from 'react-router-dom';
import {
  QrCode, Scan, CreditCard, Share2, Calendar, Users,
  Trophy, ChevronRight, Sparkles, Zap, MapPin, ArrowUpRight,
} from 'lucide-react';

const Counter = ({ to, delay = 0 }: { to: number; delay?: number }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      let start = 0;
      const step = to / 50;
      const id = setInterval(() => {
        start += step;
        if (start >= to) { setVal(to); clearInterval(id); }
        else setVal(Math.floor(start));
      }, 20);
      return () => clearInterval(id);
    }, delay);
    return () => clearTimeout(timeout);
  }, [to, delay]);
  return <>{val}</>;
};

const AttendeeDashboard = () => {
  const user = useAppStore((s) => s.user);
  const score = user?.fkScore || 87;

  const connections = [
    { name: 'Priya Sharma', role: 'CEO, TechVentures', time: '2h', warm: true },
    { name: 'James Liu', role: 'Partner, Sequoia', time: '5h', warm: true },
    { name: 'Sarah Mitchell', role: 'Founder, GreenScale', time: '1d', warm: false },
    { name: 'Raj Patel', role: 'CTO, Finova', time: '1d', warm: true },
    { name: 'Mika Tanaka', role: 'VP Eng, ByteDance', time: '2d', warm: false },
  ];

  const events = [
    { name: 'BLR Tech Week', date: 'Today', attendees: 420, live: true },
    { name: 'AI Founders Meetup', date: 'Wed', attendees: 85, live: false },
    { name: 'Climate Summit', date: 'Fri', attendees: 200, live: false },
  ];

  const actions = [
    { icon: Scan, label: 'Scan QR', to: '/connect' },
    { icon: QrCode, label: 'My QR', to: '/connect' },
    { icon: CreditCard, label: 'My Card', to: '/apply-card' },
    { icon: Share2, label: 'Network', to: '/connections' },
  ];

  const fade = (delay = 0) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <AppLayout>
      <div className="space-y-6 pb-28 md:pb-10">

        {/* Greeting */}
        <motion.div {...fade(0)} className="pt-1">
          <p className="text-sm text-muted-foreground mb-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="font-display text-4xl font-semibold text-foreground">
            Welcome back,{' '}
            <span className="gold-gradient-text">{user?.name?.split(' ')[0] || 'there'}</span>
          </h1>
        </motion.div>

        {/* Stats row */}
        <motion.div {...fade(0.08)} className="grid grid-cols-3 gap-3">
          {[
            { label: 'Connections', value: user?.connectionsCount || 142, delta: '+12 this week', icon: Users },
            { label: 'Events', value: user?.eventsAttended || 23, delta: '+2 this month', icon: Calendar },
            { label: 'FK Score', value: score, delta: 'Gold tier', icon: Trophy, gold: true },
          ].map(({ label, value, delta, icon: Icon, gold }) => (
            <GlassCard key={label} padding="md" className="text-center">
              <Icon className="w-4 h-4 text-muted-foreground mx-auto mb-3" />
              <p className={`font-display text-3xl font-bold mb-0.5 ${gold ? 'gold-gradient-text' : 'text-foreground'}`}>
                <Counter to={value} delay={150} />
              </p>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-[11px] text-muted-foreground/60 mt-1">{delta}</p>
            </GlassCard>
          ))}
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bento-stagger">

          {/* Today's event — full width on md, 2 cols on lg */}
          <GlassCard hover className="lg:col-span-2">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="live-dot" />
                  <span className="text-xs font-semibold text-emerald-400 tracking-wide">LIVE NOW</span>
                </div>
                <h3 className="font-display text-2xl font-semibold text-foreground mb-1">
                  BLR Tech Week 2026
                </h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 flex-shrink-0" /> Today · 10:00 AM – 6:00 PM</p>
                  <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 flex-shrink-0" /> Bangalore International Centre</p>
                  <p className="flex items-center gap-2"><Users className="w-3.5 h-3.5 flex-shrink-0" /> 420 attendees</p>
                </div>
              </div>
              <span className="gold-pill text-[10px] flex-shrink-0 ml-4">Premium</span>
            </div>
            <div className="flex gap-2 pt-4 border-t border-border">
              <Button variant="gold" size="sm" asChild>
                <Link to="/connect"><QrCode className="w-3.5 h-3.5 mr-1.5" /> Check In</Link>
              </Button>
              <Button variant="gold-ghost" size="sm" asChild>
                <Link to="/event/1">View Details <ChevronRight className="w-3 h-3 ml-1" /></Link>
              </Button>
            </div>
          </GlassCard>

          {/* AI Matches */}
          <GlassCard hover>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-muted-foreground" />
                <span className="section-label">AI Matches</span>
              </div>
              <Link to="/discover" className="flex items-center gap-0.5 text-[11px] text-primary font-medium hover:underline">
                View all <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-display text-5xl font-bold text-foreground">3</span>
              <span className="text-sm text-muted-foreground">new today</span>
            </div>
            <div className="space-y-3">
              {[{ name: 'Priya S.', pct: 94 }, { name: 'James L.', pct: 88 }, { name: 'Raj P.', pct: 82 }].map((m) => (
                <div key={m.name} className="flex items-center gap-2.5">
                  <span className="text-xs text-muted-foreground w-14 truncate">{m.name}</span>
                  <div className="flex-1 progress-track">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${m.pct}%` }}
                      transition={{ duration: 0.9, delay: 0.4 }}
                    />
                  </div>
                  <span className="text-[11px] text-primary w-8 text-right">{m.pct}%</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Recent connections */}
          <GlassCard className="lg:row-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="section-label">Recent Connections</span>
              </div>
              <Link to="/connections" className="flex items-center gap-0.5 text-[11px] text-primary font-medium hover:underline">
                All {user?.connectionsCount || 142} <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-1">
              {connections.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                  className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground text-xs font-semibold">
                      {c.name[0]}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card ${c.warm ? 'bg-amber-500' : 'bg-slate-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{c.role}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground/60">{c.time}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* FK Score */}
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4 text-muted-foreground" />
              <span className="section-label">FK Score</span>
            </div>
            <div className="flex items-center gap-5">
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="16" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
                  <motion.circle
                    cx="20" cy="20" r="16"
                    fill="none"
                    stroke="hsl(var(--gold-primary))"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="0 100.5"
                    animate={{ strokeDasharray: `${score * 1.005} 100.5` }}
                    transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-xl font-bold text-foreground leading-none">{score}</span>
                  <span className="text-[9px] text-muted-foreground">/ 100</span>
                </div>
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm mb-0.5">Gold Connector</p>
                <p className="text-xs text-muted-foreground mb-2">Top 15% this month</p>
                <span className="gold-pill text-[10px]">+5 this week</span>
              </div>
            </div>
          </GlassCard>

          {/* Active challenge */}
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-muted-foreground" />
              <span className="section-label">Challenge</span>
            </div>
            <p className="font-semibold text-foreground mb-1">Meet 5 speakers</p>
            <p className="text-xs text-muted-foreground mb-4">Unlock VIP Lounge access</p>
            <div className="progress-track mb-2">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: '60%' }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">3 of 5 done</span>
              <span className="text-primary font-medium">60%</span>
            </div>
          </GlassCard>

          {/* Quick actions */}
          <GlassCard>
            <span className="section-label block mb-4">Quick Actions</span>
            <div className="grid grid-cols-2 gap-2">
              {actions.map((a) => (
                <Link
                  key={a.label}
                  to={a.to}
                  className="flex flex-col items-center gap-2 p-3.5 rounded-xl bg-muted/40 hover:bg-secondary transition-colors group"
                >
                  <a.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">{a.label}</span>
                </Link>
              ))}
            </div>
          </GlassCard>

          {/* Events this week */}
          <GlassCard className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="section-label">Events This Week</span>
              </div>
              <Link to="/events" className="flex items-center gap-0.5 text-[11px] text-primary font-medium hover:underline">
                See all <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {events.map((e, i) => (
                <Link
                  key={i}
                  to="/events"
                  className={`p-3.5 rounded-xl border transition-colors ${e.live ? 'border-emerald-500/25 bg-emerald-500/5 hover:bg-emerald-500/8' : 'border-border bg-muted/30 hover:bg-muted/50'}`}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    {e.live ? <div className="live-dot" /> : <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />}
                    <span className={`text-[10px] font-semibold uppercase tracking-wide ${e.live ? 'text-emerald-400' : 'text-muted-foreground'}`}>{e.date}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground leading-snug mb-1">{e.name}</p>
                  <p className="text-[11px] text-muted-foreground">{e.attendees} attendees</p>
                </Link>
              ))}
            </div>
          </GlassCard>

        </div>
      </div>
    </AppLayout>
  );
};

export default AttendeeDashboard;
