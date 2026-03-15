import { motion } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { GlassCard } from '@/components/GlassCard';
import { useAppStore } from '@/store/appStore';
import { Trophy, Zap, Lock, Crown, Star, Target, Users, Medal, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const badges = [
  { name: 'First Connect', icon: Users, earned: true, desc: 'Made your first connection', date: 'Jan 2026' },
  { name: 'Networker', icon: Zap, earned: true, desc: 'Connected with 50+ people', date: 'Feb 2026' },
  { name: 'Event Regular', icon: Star, earned: true, desc: 'Attended 10+ events', date: 'Feb 2026' },
  { name: 'Gold Connector', icon: Crown, earned: true, desc: 'Reached Gold tier status', date: 'Mar 2026' },
  { name: 'Speed Networker', icon: Target, earned: false, desc: '10 connections in 1 hour' },
  { name: 'Platinum', icon: Medal, earned: false, desc: 'Reach Platinum status' },
];

const scoreBreakdown = [
  { label: 'Events attended', value: 23, multiplier: 5, points: 115, icon: Star, color: 'text-amber-400' },
  { label: 'Connections made', value: 142, multiplier: 2, points: 284, icon: Users, color: 'text-blue-400' },
  { label: 'Notes added', value: 45, multiplier: 3, points: 135, icon: Zap, color: 'text-purple-400' },
  { label: 'Challenges completed', value: 8, multiplier: 10, points: 80, icon: Target, color: 'text-emerald-400' },
];

const leaderboard = [
  { rank: 1, name: 'Raj Patel', score: 340, connections: 198, tier: 'Platinum' },
  { rank: 2, name: 'Priya Sharma', score: 290, connections: 165, tier: 'Gold' },
  { rank: 3, name: 'Alex Chen', score: 240, connections: 142, tier: 'Gold', isYou: true },
  { rank: 4, name: 'Elena Rossi', score: 198, connections: 110, tier: 'Silver' },
  { rank: 5, name: 'James Liu', score: 155, connections: 88, tier: 'Silver' },
];

const challenges = [
  { label: 'Connect with 5 investors', done: 2, total: 5, reward: '+50 pts' },
  { label: 'Attend 3 events this month', done: 2, total: 3, reward: '+30 pts' },
  { label: 'Add notes to 10 connections', done: 7, total: 10, reward: '+20 pts' },
];

const tierColors: Record<string, string> = {
  Platinum: 'text-blue-300 bg-blue-500/10 border-blue-500/20',
  Gold: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Silver: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
};

const GamificationPage = () => {
  const user = useAppStore(s => s.user);
  const score = user?.fkScore || 87;
  const total = scoreBreakdown.reduce((a, s) => a + s.points, 0);

  return (
    <AppLayout>
      <div className="space-y-7 pb-28 md:pb-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl font-semibold text-foreground">Achievements</h1>
          <p className="text-muted-foreground mt-1">Your FounderKey progress and rankings</p>
        </motion.div>

        {/* Score hero */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bento-stagger">

          {/* Big score ring */}
          <GlassCard glow className="text-center flex flex-col items-center justify-center py-8">
            <div className="relative w-36 h-36 mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                <motion.circle
                  cx="22" cy="22" r="18"
                  fill="none" stroke="url(#scoreGrad2)" strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="0 113.1"
                  animate={{ strokeDasharray: `${score * 1.131} 113.1` }}
                  transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                />
                <defs>
                  <linearGradient id="scoreGrad2" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(40,72%,58%)" />
                    <stop offset="100%" stopColor="hsl(38,85%,72%)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  className="font-display text-4xl font-bold gold-gradient-text"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {score}
                </motion.span>
                <span className="text-[10px] text-muted-foreground font-sans">FK Score</span>
              </div>
            </div>
            <div className="gold-pill mb-2"><Crown className="w-3.5 h-3.5 mr-1" /> Gold Connector</div>
            <p className="text-xs text-muted-foreground">Top 15% globally</p>
            <p className="text-xs text-primary mt-1 flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> +5 this week</p>
          </GlassCard>

          {/* Breakdown */}
          <GlassCard className="md:col-span-2">
            <h3 className="font-display text-xl font-semibold text-foreground mb-5">Score Breakdown</h3>
            <div className="space-y-4">
              {scoreBreakdown.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl glass-card flex items-center justify-center flex-shrink-0">
                      <s.icon className={`w-4 h-4 ${s.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm text-foreground">{s.label}</span>
                        <span className="text-sm font-semibold gold-gradient-text">+{s.points}</span>
                      </div>
                      <div className="progress-track">
                        <motion.div
                          className="progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${(s.points / total) * 100 * 2}%` }}
                          transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/[0.05] flex justify-between text-sm">
              <span className="text-muted-foreground">Total points earned</span>
              <span className="font-semibold gold-gradient-text">+{total}</span>
            </div>
          </GlassCard>
        </div>

        {/* Badges */}
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Badges</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {badges.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: b.earned ? 1 : 0.4, scale: 1 }}
                transition={{ delay: 0.05 + i * 0.07, type: 'spring', stiffness: 300 }}
                whileHover={b.earned ? { scale: 1.08, y: -4 } : {}}
              >
                <GlassCard className="text-center" padding="sm">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2 ${b.earned ? 'gold-gradient-bg gold-glow' : 'bg-white/[0.05]'}`}>
                    {b.earned
                      ? <b.icon className="w-6 h-6 text-primary-foreground" />
                      : <Lock className="w-5 h-5 text-muted-foreground" />
                    }
                  </div>
                  <p className="text-xs font-semibold text-foreground leading-snug">{b.name}</p>
                  {b.earned && b.date && (
                    <p className="text-[9px] text-primary mt-0.5">{b.date}</p>
                  )}
                  {!b.earned && (
                    <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{b.desc}</p>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Challenges + Leaderboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Active challenges */}
          <GlassCard>
            <h3 className="font-display text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" /> Active Challenges
            </h3>
            <div className="space-y-5">
              {challenges.map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}>
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm text-foreground font-medium flex-1 pr-3 leading-snug">{c.label}</p>
                    <span className="text-[11px] text-primary font-semibold flex-shrink-0 gold-pill">{c.reward}</span>
                  </div>
                  <div className="progress-track mb-1.5">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${(c.done / c.total) * 100}%` }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                    />
                  </div>
                  <div className="flex justify-between">
                    <div className="flex gap-1">
                      {Array.from({ length: c.total }).map((_, j) => (
                        <div key={j} className={`w-5 h-1 rounded-full ${j < c.done ? 'gold-gradient-bg' : 'bg-white/[0.07]'}`} />
                      ))}
                    </div>
                    <span className="text-[11px] text-muted-foreground">{c.done}/{c.total}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Leaderboard */}
          <GlassCard>
            <h3 className="font-display text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" /> Global Leaderboard
            </h3>
            <div className="space-y-2">
              {leaderboard.map((entry, i) => (
                <motion.div
                  key={entry.rank}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.08 }}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${entry.isYou ? 'bg-primary/8 border border-primary/20' : 'hover:bg-white/[0.03]'}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${entry.rank === 1 ? 'gold-gradient-bg text-primary-foreground' : entry.rank === 2 ? 'bg-slate-400/20 text-slate-300' : entry.rank === 3 ? 'bg-amber-700/30 text-amber-600' : 'bg-white/[0.05] text-muted-foreground'}`}>
                    {entry.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${entry.isYou ? 'text-primary' : 'text-foreground'} truncate`}>
                        {entry.name} {entry.isYou && <span className="text-[10px] text-primary/60">(you)</span>}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{entry.connections} connections</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${tierColors[entry.tier]}`}>
                      {entry.tier}
                    </span>
                    <span className="font-display text-base font-bold gold-gradient-text">{entry.score}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>

      </div>
    </AppLayout>
  );
};

export default GamificationPage;
