import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Bell, UserPlus, Calendar, Trophy, MessageSquare, Star, Zap, Mail, Wallet, X, Check, Settings } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

const allNotifications = [
  { id: '1', type: 'connection', icon: UserPlus, title: 'New connection from Raj Patel', desc: 'CTO at Finova · BLR Tech Week', time: '2 min ago', group: 'today', read: false, color: 'bg-blue-500/10 text-blue-400' },
  { id: '2', type: 'nudge', icon: MessageSquare, title: 'Follow up with Priya Sharma', desc: "It's been 3 days since you met at BLR Tech Week", time: '1h ago', group: 'today', read: false, color: 'bg-amber-500/10 text-amber-400' },
  { id: '3', type: 'event', icon: Calendar, title: 'AI Founders Meetup tomorrow', desc: 'Wed 2:00 PM · Koramangala Hub · You\'re registered', time: '3h ago', group: 'today', read: true, color: 'bg-purple-500/10 text-purple-400' },
  { id: '4', type: 'email', icon: Mail, title: 'Event QR sent to your email', desc: 'BLR Tech Week QR code ready. Check your inbox at alex@founderkey.com', time: '5h ago', group: 'today', read: false, color: 'bg-emerald-500/10 text-emerald-400' },
  { id: '5', type: 'badge', icon: Trophy, title: 'Badge earned: Networker', desc: 'You connected with 100+ people across events', time: '1d ago', group: 'week', read: true, color: 'bg-amber-500/10 text-amber-400' },
  { id: '6', type: 'score', icon: Zap, title: 'FK Score updated to 87', desc: '+5 points from BLR Tech Week activity', time: '2d ago', group: 'week', read: true, color: 'bg-primary/10 text-primary' },
  { id: '7', type: 'intro', icon: Star, title: 'Warm intro request from David Kim', desc: 'Wants to connect you with James Liu at Sequoia', time: '3d ago', group: 'week', read: false, color: 'bg-rose-500/10 text-rose-400' },
];

const prefs = [
  { id: 'connections', label: 'New connections', desc: 'When someone connects with you' },
  { id: 'events', label: 'Event reminders', desc: '24h before registered events' },
  { id: 'nudges', label: 'AI follow-up nudges', desc: 'Suggestions to reconnect' },
  { id: 'badges', label: 'Badges & scores', desc: 'Gamification updates' },
  { id: 'intros', label: 'Warm intro requests', desc: 'Mutual connection introductions' },
];

const NotificationsPage = () => {
  const { user, updateUser } = useAppStore();
  const [notifications, setNotifications] = useState(allNotifications);
  const [tab, setTab] = useState<'all' | 'settings'>('all');
  const [emailPrefs, setEmailPrefs] = useState<Record<string, boolean>>(Object.fromEntries(prefs.map((p) => [p.id, true])));

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));
  const dismiss = (id: string) => setNotifications((ns) => ns.filter((n) => n.id !== id));
  const markRead = (id: string) => setNotifications((ns) => ns.map((n) => n.id === id ? { ...n, read: true } : n));

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6 pb-24 md:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-foreground flex items-center gap-3">
              Notifications
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 rounded-full gold-gradient-bg text-primary-foreground text-xs flex items-center justify-center font-medium"
                >
                  {unreadCount}
                </motion.span>
              )}
            </h1>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-primary hover:underline">Mark all read</button>
            )}
            <Button
              variant="gold-ghost"
              size="sm"
              onClick={() => setTab(tab === 'all' ? 'settings' : 'all')}
              className="text-xs"
            >
              <Settings className="w-3.5 h-3.5 mr-1" /> Preferences
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {tab === 'all' ? (
            <motion.div key="notifs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {(['today', 'week'] as const).map((group) => {
                const grouped = notifications.filter((n) => n.group === group);
                if (!grouped.length) return null;
                return (
                  <div key={group}>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-medium">
                      {group === 'today' ? 'Today' : 'This Week'}
                    </p>
                    <div className="space-y-2">
                      <AnimatePresence>
                        {grouped.map((n, i) => (
                          <motion.div
                            key={n.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20, height: 0 }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <GlassCard
                              hover
                              className={`flex items-start gap-3 cursor-pointer relative transition-all ${!n.read ? 'border-primary/20' : ''}`}
                              onClick={() => markRead(n.id)}
                            >
                              {!n.read && (
                                <div className="absolute top-3 right-10 w-2 h-2 rounded-full bg-primary" />
                              )}
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${n.color}`}>
                                <n.icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${n.read ? 'text-muted-foreground' : 'text-foreground'}`}>{n.title}</p>
                                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.desc}</p>
                                <span className="text-[10px] text-muted-foreground/70 mt-1 block">{n.time}</span>
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                                className="text-muted-foreground hover:text-foreground flex-shrink-0 mt-0.5"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </GlassCard>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {/* Email notifications */}
              <GlassCard>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl gold-gradient-bg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">Email Notifications</h3>
                    <p className="text-xs text-muted-foreground">Sent to {user?.email}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {prefs.map((pref) => (
                    <div key={pref.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-foreground">{pref.label}</p>
                        <p className="text-xs text-muted-foreground">{pref.desc}</p>
                      </div>
                      <button
                        onClick={() => setEmailPrefs((p) => ({ ...p, [pref.id]: !p[pref.id] }))}
                        className={`w-11 h-6 rounded-full relative transition-all duration-300 ${emailPrefs[pref.id] ? 'gold-gradient-bg' : 'bg-muted'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-300 ${emailPrefs[pref.id] ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Wallet */}
              <GlassCard className={user?.walletAdded ? 'gold-border-glow' : ''}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl gold-gradient-bg flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">Digital Wallet</h3>
                    <p className="text-xs text-muted-foreground">Add your FounderCard to your device wallet</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Apple Wallet', icon: '🍎' },
                    { label: 'Google Wallet', icon: '🔵' },
                  ].map((w) => (
                    <Button
                      key={w.label}
                      variant="gold-ghost"
                      className="w-full justify-between"
                      onClick={() => updateUser({ walletAdded: true })}
                      disabled={!user?.hasFounderCard}
                    >
                      <span className="flex items-center gap-2">
                        <span>{w.icon}</span> {w.label}
                      </span>
                      {user?.walletAdded ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-400"><Check className="w-3 h-3" /> Added</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">{user?.hasFounderCard ? 'Add' : 'Requires FounderCard'}</span>
                      )}
                    </Button>
                  ))}
                </div>
              </GlassCard>

              <Button variant="gold" className="w-full" onClick={() => setTab('all')}>
                <Check className="w-4 h-4 mr-1" /> Save Preferences
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default NotificationsPage;
