import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Sparkles, Filter, UserPlus, MessageSquare, Check, X } from 'lucide-react';

const suggestions = [
  { id: '1', name: 'David Kim', role: 'Founder', company: 'PayBridge', industry: 'Fintech', reason: 'Both in fintech, attended 2 same events', match: 92, mutual: 4, interests: ['Fintech', 'B2B SaaS'] },
  { id: '2', name: 'Anya Gupta', role: 'CEO', company: 'HealthFirst', industry: 'HealthTech', reason: 'Both interested in B2B SaaS and AI', match: 87, mutual: 2, interests: ['B2B SaaS', 'AI'] },
  { id: '3', name: 'Marcus Jones', role: 'Partner', company: 'a16z', industry: 'VC', reason: 'Looking for AI/ML startups to invest in', match: 85, mutual: 7, interests: ['AI/ML', 'Deep Tech'] },
  { id: '4', name: 'Lisa Wang', role: 'CTO', company: 'CloudSync', industry: 'SaaS', reason: 'Mutual connections: James Liu, Raj Patel', match: 82, mutual: 3, interests: ['Cloud', 'SaaS'] },
  { id: '5', name: 'Tom Anderson', role: 'VP Product', company: 'Stripe', industry: 'Fintech', reason: 'Both in payments space, SF Bay area', match: 79, mutual: 1, interests: ['Payments', 'Product'] },
  { id: '6', name: 'Nina Petrov', role: 'Founder', company: 'EduFlow', industry: 'EdTech', reason: 'Both looking for co-founders', match: 76, mutual: 2, interests: ['EdTech', 'Co-founder'] },
];

const matchColor = (pct: number) =>
  pct >= 90 ? 'text-emerald-400' : pct >= 80 ? 'text-primary' : 'text-blue-400';

const DiscoverPage = () => {
  const [connected, setConnected] = useState<string[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [filter, setFilter] = useState('all');

  const industries = ['all', ...Array.from(new Set(suggestions.map(s => s.industry)))];
  const visible = suggestions.filter(s =>
    !dismissed.includes(s.id) &&
    (filter === 'all' || s.industry === filter)
  );

  return (
    <AppLayout>
      <div className="space-y-7 pb-28 md:pb-10">

        {/* Header */}
        <div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl gold-gradient-bg flex items-center justify-center gold-glow">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-4xl font-semibold text-foreground">Discover</h1>
                <p className="text-muted-foreground text-sm mt-0.5">{visible.length} AI-powered matches for you today</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filter strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex gap-2 flex-wrap"
        >
          <div className="flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="section-label">Filter</span>
          </div>
          {industries.map((ind) => (
            <motion.button
              key={ind}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(ind)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${filter === ind ? 'gold-gradient-bg text-primary-foreground border-transparent' : 'border-white/[0.08] text-muted-foreground hover:text-foreground hover:border-primary/20'}`}
            >
              {ind === 'all' ? 'All Industries' : ind}
            </motion.button>
          ))}
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {visible.map((s, i) => {
              const isConnected = connected.includes(s.id);
              return (
                <motion.div
                  key={s.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  <GlassCard hover className="h-full flex flex-col relative overflow-hidden">
                    {/* Match badge */}
                    <div className={`absolute top-4 right-4 font-display text-xl font-bold ${matchColor(s.match)}`}>
                      {s.match}%
                    </div>

                    {/* Avatar + info */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-14 h-14 rounded-2xl gold-gradient-bg flex items-center justify-center text-primary-foreground text-lg font-bold overflow-hidden avatar-ring">
                          {s.name[0]}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full gold-gradient-bg flex items-center justify-center text-[8px] font-bold text-primary-foreground">
                          {s.mutual}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 pr-12">
                        <p className="font-semibold text-foreground">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.role} · {s.company}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{s.mutual} mutual connections</p>
                      </div>
                    </div>

                    {/* Match reason */}
                    <div className="flex-1 mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                      <p className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                        {s.reason}
                      </p>
                    </div>

                    {/* Interest tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {s.interests.map((int) => (
                        <span key={int} className="gold-pill text-[10px]">{int}</span>
                      ))}
                    </div>

                    {/* Match bar */}
                    <div className="progress-track mb-4">
                      <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${s.match}%` }}
                        transition={{ duration: 1, delay: 0.3 + i * 0.08 }}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant={isConnected ? 'gold' : 'gold-ghost'}
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() => setConnected(p => isConnected ? p.filter(x => x !== s.id) : [...p, s.id])}
                      >
                        {isConnected
                          ? <><Check className="w-3.5 h-3.5 mr-1" /> Connected</>
                          : <><UserPlus className="w-3.5 h-3.5 mr-1" /> Connect</>
                        }
                      </Button>
                      <Button variant="gold-ghost" size="sm" className="text-xs">
                        <MessageSquare className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="gold-ghost"
                        size="sm"
                        className="text-xs text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                        onClick={() => setDismissed(p => [...p, s.id])}
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {visible.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Sparkles className="w-12 h-12 text-primary/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No more suggestions for now. Check back tomorrow!</p>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default DiscoverPage;
