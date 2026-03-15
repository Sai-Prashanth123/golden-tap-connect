import { AppLayout } from '@/components/AppLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Trophy, Medal, Zap, Lock, Crown, Star, Target, Users } from 'lucide-react';

const badges = [
  { name: 'First Connect', icon: Users, earned: true },
  { name: 'Networker', icon: Zap, earned: true },
  { name: 'Event Regular', icon: Star, earned: true },
  { name: 'Gold Connector', icon: Crown, earned: true },
  { name: 'Speed Networker', icon: Target, earned: false },
  { name: 'Platinum', icon: Medal, earned: false },
];

const GamificationPage = () => (
  <AppLayout>
    <div className="space-y-6 pb-20 md:pb-0">
      <h1 className="font-display text-3xl font-semibold text-foreground">Achievements</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bento-stagger">
        {/* FK Score */}
        <GlassCard className="lg:col-span-1 text-center">
          <Trophy className="w-6 h-6 text-primary mx-auto mb-3" />
          <div className="relative w-28 h-28 mx-auto my-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(var(--border))" strokeWidth="2.5" />
              <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(var(--gold-primary))" strokeWidth="2.5" strokeDasharray="87, 100" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-3xl font-bold gold-gradient-text">87</span>
              <span className="text-[10px] text-muted-foreground">FK Score</span>
            </div>
          </div>
          <p className="gold-pill inline-block"><Crown className="w-3 h-3 inline mr-1" />Gold Connector</p>
        </GlassCard>

        {/* Score Breakdown */}
        <GlassCard className="lg:col-span-2">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Score Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: 'Events attended (×5)', value: 23, points: 115 },
              { label: 'Connections made (×2)', value: 142, points: 284 },
              { label: 'Notes added (×3)', value: 45, points: 135 },
              { label: 'Challenges completed (×10)', value: 8, points: 80 },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <span className="text-sm font-medium gold-gradient-text">+{s.points}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Badges */}
        {badges.map((b, i) => (
          <GlassCard key={i} hover className={`text-center ${!b.earned ? 'opacity-50' : ''}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${b.earned ? 'gold-gradient-bg gold-glow' : 'bg-muted'}`}>
              {b.earned ? (
                <b.icon className="w-6 h-6 text-primary-foreground" />
              ) : (
                <Lock className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <p className="text-sm font-medium text-foreground">{b.name}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{b.earned ? 'Earned' : 'Locked'}</p>
          </GlassCard>
        ))}

        {/* Active Challenges */}
        <GlassCard className="lg:col-span-2">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Active Challenges</h3>
          <div className="space-y-4">
            {[
              { title: 'Meet 5 Speakers', progress: 60, reward: 'VIP Lounge Access' },
              { title: 'Connect with 10 Fintech Founders', progress: 30, reward: '50 Bonus XP' },
              { title: 'Add Notes to All Connections', progress: 80, reward: 'Profile Badge' },
            ].map((c, i) => (
              <div key={i} className="glass-card p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-foreground">{c.title}</p>
                  <span className="gold-pill text-[10px]">{c.reward}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted">
                  <div className="h-full rounded-full gold-gradient-bg transition-all duration-500" style={{ width: `${c.progress}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{c.progress}% complete</p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Leaderboard */}
        <GlassCard>
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Leaderboard</h3>
          <div className="space-y-2">
            {[
              { name: 'Priya S.', score: 156, rank: 1 },
              { name: 'James L.', score: 142, rank: 2 },
              { name: 'You', score: 87, rank: 3, isUser: true },
              { name: 'Sarah M.', score: 76, rank: 4 },
              { name: 'Raj P.', score: 65, rank: 5 },
            ].map((l, i) => (
              <div key={i} className={`flex items-center gap-3 p-2 rounded-lg ${l.isUser ? 'gold-border-glow' : ''}`}>
                <span className={`w-6 text-center text-xs font-bold ${l.rank <= 3 ? 'gold-gradient-text' : 'text-muted-foreground'}`}>
                  #{l.rank}
                </span>
                <div className="w-7 h-7 rounded-full gold-gradient-bg flex items-center justify-center text-primary-foreground text-[10px] font-bold">
                  {l.name[0]}
                </div>
                <span className="text-sm text-foreground flex-1">{l.name}</span>
                <span className="text-xs text-muted-foreground">{l.score}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  </AppLayout>
);

export default GamificationPage;
