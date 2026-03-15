import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { useParams } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import {
  Calendar, MapPin, Users, Trophy, QrCode, Sparkles, Star, CheckCircle2,
  Shield, Eye, ChevronDown, X, Check,
} from 'lucide-react';

const eventAttendees = [
  { id: '1', name: 'Priya Sharma', photo: null, role: 'CEO', company: 'TechVentures', industry: 'Fintech', match: 94, speaker: false, linkedin: 'https://linkedin.com', email: 'priya@techv.in', phone: '+91 9123456789', interests: ['SaaS', 'Fintech', 'AI'] },
  { id: '2', name: 'Dr. Arun Mehta', photo: null, role: 'Keynote Speaker', company: 'AI Research', industry: 'AI/ML', match: 88, speaker: true, linkedin: 'https://linkedin.com', email: 'arun@airesearch.in', phone: '+91 9000000003', interests: ['AI', 'Deep Tech'] },
  { id: '3', name: 'James Liu', photo: null, role: 'Partner', company: 'Sequoia Capital', industry: 'VC', match: 85, speaker: true, linkedin: 'https://linkedin.com', email: 'james@sequoia.com', phone: '+91 9000000004', interests: ['VC', 'B2B SaaS'] },
  { id: '4', name: 'Sarah Mitchell', photo: null, role: 'Founder', company: 'GreenScale', industry: 'Climate', match: 82, speaker: false, linkedin: 'https://linkedin.com', email: 'sarah@greenscale.co', phone: '+91 9000000005', interests: ['Climate', 'Impact'] },
  { id: '5', name: 'Raj Patel', photo: null, role: 'CTO', company: 'Finova', industry: 'Fintech', match: 79, speaker: false, linkedin: 'https://linkedin.com', email: 'raj@finova.in', phone: '+91 9000000006', interests: ['Fintech', 'Engineering'] },
  { id: '6', name: 'Lisa Wang', photo: null, role: 'CTO', company: 'CloudSync', industry: 'SaaS', match: 76, speaker: false, linkedin: 'https://linkedin.com', email: 'lisa@cloudsync.io', phone: '+91 9000000007', interests: ['Cloud', 'SaaS', 'DevOps'] },
];

const leaderboard = [
  { rank: 1, name: 'Raj Patel', connections: 18, score: 340 },
  { rank: 2, name: 'Priya Sharma', connections: 15, score: 290 },
  { rank: 3, name: 'You', connections: 12, score: 240, isYou: true },
  { rank: 4, name: 'Elena Rossi', connections: 10, score: 198 },
  { rank: 5, name: 'Mika Tanaka', connections: 8, score: 155 },
];

const scavengerHunt = [
  { label: 'Connect with a Founder', done: true },
  { label: 'Connect with an Investor', done: true },
  { label: 'Attend a keynote session', done: false },
  { label: 'Join a workshop', done: false },
  { label: 'Make 5+ connections', done: false },
];

const EventDetailPage = () => {
  const { id } = useParams();
  const { user } = useAppStore();
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [connected, setConnected] = useState<string[]>([]);

  const isRegistered = user?.registeredEvents?.includes(id || '') || id === '1';

  const handleRevealFull = () => setRulesAccepted(true);

  return (
    <AppLayout>
      <div className="space-y-6 pb-24 md:pb-8">
        {/* Event Header */}
        <GlassCard className="gold-border-glow relative overflow-hidden">
          <div className="absolute inset-0 gold-gradient-bg opacity-5 pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="gold-pill text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live Now
                </span>
                <span className="gold-pill text-[10px]">Premium Seat</span>
                {isRegistered && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Registered
                  </span>
                )}
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">BLR Tech Week 2026</h1>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> Today, 10:00 AM – 6:00 PM</p>
                <p className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Bangalore International Centre</p>
                <p className="text-sm text-muted-foreground flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> 420 attendees</p>
              </div>
            </div>
            <Button variant="gold" size="lg" className="flex-shrink-0">
              <QrCode className="w-5 h-5 mr-2" /> Check In
            </Button>
          </div>
        </GlassCard>

        {/* Security Notice */}
        {!rulesAccepted && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard className="border border-amber-500/30 bg-amber-500/5">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Attendee Privacy Mode</p>
                  <p className="text-xs text-muted-foreground mt-1">For security, only name, photo, and designation are shown. Accept the sharing rules to see full profiles.</p>
                  <Button variant="gold-ghost" size="sm" className="mt-3 text-xs" onClick={() => setShowRules(true)}>
                    <Eye className="w-3.5 h-3.5 mr-1" /> View & Accept Rules
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* People to Meet */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> People to Meet
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {eventAttendees.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <GlassCard hover className="cursor-pointer" onClick={() => setExpanded(expanded === a.id ? null : a.id)}>
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-11 h-11 rounded-full gold-gradient-bg flex items-center justify-center text-primary-foreground text-sm font-bold">
                          {a.name[0]}
                        </div>
                        {a.speaker && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full gold-gradient-bg flex items-center justify-center">
                            <Star className="w-2.5 h-2.5 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{a.name}</p>
                        <p className="text-xs text-muted-foreground">{a.role}{!rulesAccepted ? '' : ` · ${a.company}`}</p>
                        <div className="flex items-center justify-between mt-1.5">
                          <div className="flex items-center gap-1">
                            <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                              <div className="h-full gold-gradient-bg rounded-full" style={{ width: `${a.match}%` }} />
                            </div>
                            <span className="text-[10px] text-primary font-medium">{a.match}%</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground">{rulesAccepted ? a.industry : '🔒 Private'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Expanded full profile (only after rules accepted) */}
                    <AnimatePresence>
                      {expanded === a.id && rulesAccepted && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 pt-3 border-t border-border space-y-2 text-xs">
                            {[
                              ['Company', a.company],
                              ['Email', a.email],
                              ['Phone', a.phone],
                            ].map(([k, v]) => (
                              <div key={k} className="flex justify-between">
                                <span className="text-muted-foreground">{k}</span>
                                <span className="text-foreground">{v}</span>
                              </div>
                            ))}
                            <div className="flex flex-wrap gap-1 pt-1">
                              {a.interests.map((int) => <span key={int} className="gold-pill text-[10px]">{int}</span>)}
                            </div>
                          </div>
                        </motion.div>
                      )}
                      {expanded === a.id && !rulesAccepted && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 pt-3 border-t border-amber-500/20 text-xs text-amber-400 flex items-center gap-2">
                            <Shield className="w-3.5 h-3.5" /> Accept rules to view full profile
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                      <Button
                        variant={connected.includes(a.id) ? 'gold' : 'gold-ghost'}
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={(e) => { e.stopPropagation(); setConnected((c) => c.includes(a.id) ? c : [...c, a.id]); }}
                      >
                        {connected.includes(a.id) ? <><Check className="w-3 h-3 mr-1" /> Connected</> : 'Connect'}
                      </Button>
                      <Button variant="gold-ghost" size="sm" className="text-xs px-2" onClick={(e) => e.stopPropagation()}>
                        <ChevronDown className={`w-3 h-3 transition-transform ${expanded === a.id ? 'rotate-180' : ''}`} />
                      </Button>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Leaderboard */}
            <GlassCard>
              <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2 mb-3">
                <Trophy className="w-4 h-4 text-primary" /> Event Leaderboard
              </h3>
              <div className="space-y-2">
                {leaderboard.map((entry) => (
                  <div key={entry.rank} className={`flex items-center gap-3 p-2 rounded-lg ${entry.isYou ? 'bg-primary/10 border border-primary/20' : ''}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${entry.rank === 1 ? 'gold-gradient-bg text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{entry.rank}</span>
                    <span className={`text-sm flex-1 truncate ${entry.isYou ? 'text-primary font-medium' : 'text-foreground'}`}>{entry.name}</span>
                    <div className="text-right">
                      <p className="text-xs font-medium text-foreground">{entry.score}</p>
                      <p className="text-[10px] text-muted-foreground">{entry.connections} conn.</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Scavenger Hunt */}
            <GlassCard>
              <h3 className="font-display text-lg font-semibold text-foreground mb-3">Scavenger Hunt</h3>
              <div className="space-y-2">
                {scavengerHunt.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'gold-gradient-bg' : 'border border-border'}`}>
                      {item.done && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <span className={item.done ? 'text-muted-foreground line-through' : 'text-foreground'}>{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{scavengerHunt.filter((s) => s.done).length}/{scavengerHunt.length}</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full gold-gradient-bg rounded-full" style={{ width: `${(scavengerHunt.filter((s) => s.done).length / scavengerHunt.length) * 100}%` }} />
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Rules Modal */}
      <AnimatePresence>
        {showRules && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-md">
              <GlassCard className="relative">
                <button onClick={() => setShowRules(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
                <Shield className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-display text-2xl font-semibold text-foreground mb-2">Privacy & Sharing Rules</h3>
                <p className="text-sm text-muted-foreground mb-5">By accepting, you agree to the following data sharing terms for this event:</p>
                <div className="space-y-3 mb-6">
                  {[
                    'You may view other attendees\' full profiles after mutual acceptance',
                    'Contact info is shared only with people you connect with',
                    'Do not export or share others\' contact data without consent',
                    'Any harassment will result in immediate removal from the event',
                    'Your data is protected under FounderKey\'s privacy policy',
                  ].map((rule, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      {rule}
                    </div>
                  ))}
                </div>
                <Button variant="gold" className="w-full" size="lg" onClick={() => { handleRevealFull(); setShowRules(false); }}>
                  <Check className="w-4 h-4 mr-2" /> I Accept — Reveal Full Profiles
                </Button>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

export default EventDetailPage;
