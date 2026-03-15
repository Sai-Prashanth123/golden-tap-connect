import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminLayout } from '@/components/AdminLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Search, Calendar, Users, MapPin, Eye, Pause, Play, Trash2, Filter, CheckCircle2, Clock, Circle } from 'lucide-react';

const events = [
  { id: '1', name: 'BLR Tech Week 2026', organizer: 'Priya Sharma', date: 'Mar 15, 2026', venue: 'Bangalore Intl Centre', attendees: 420, maxAttendees: 500, status: 'live', category: 'Tech', revenue: '₹2.1L' },
  { id: '2', name: 'AI Founders Meetup', organizer: 'Rahul Events', date: 'Mar 18, 2026', venue: 'Koramangala Hub', attendees: 85, maxAttendees: 100, status: 'upcoming', category: 'AI', revenue: '₹42.5K' },
  { id: '3', name: 'Climate Summit', organizer: 'GreenConf', date: 'Mar 20, 2026', venue: 'Convention Center', attendees: 200, maxAttendees: 250, status: 'upcoming', category: 'Climate', revenue: '₹2.0L' },
  { id: '4', name: 'SaaS Summit 2026', organizer: 'SaaS India', date: 'Mar 25, 2026', venue: 'Hyatt Regency', attendees: 350, maxAttendees: 400, status: 'upcoming', category: 'SaaS', revenue: '₹5.25L' },
  { id: '5', name: 'YC Demo Day Watch', organizer: 'YC Community India', date: 'Mar 10, 2026', venue: 'Online', attendees: 120, maxAttendees: 500, status: 'completed', category: 'Startup', revenue: 'Free' },
  { id: '6', name: 'Blockchain Fest', organizer: 'Web3 India', date: 'Feb 28, 2026', venue: 'Mumbai Hub', attendees: 180, maxAttendees: 200, status: 'suspended', category: 'Web3', revenue: '₹2.7L' },
];

const statusConfig = {
  live: { label: 'Live', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: Circle },
  upcoming: { label: 'Upcoming', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Clock },
  completed: { label: 'Completed', color: 'bg-muted/30 text-muted-foreground border-border', icon: CheckCircle2 },
  suspended: { label: 'Suspended', color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: Pause },
};

const AdminEventsPage = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [eventStatuses, setEventStatuses] = useState<Record<string, string>>({});

  const getStatus = (e: typeof events[0]) => eventStatuses[e.id] || e.status;

  const filtered = events.filter((e) => {
    const s = getStatus(e);
    return (
      (e.name.toLowerCase().includes(search.toLowerCase()) || e.organizer.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === 'all' || s === statusFilter)
    );
  });

  const toggleSuspend = (id: string) => {
    setEventStatuses((prev) => {
      const cur = prev[id] || events.find((e) => e.id === id)?.status;
      return { ...prev, [id]: cur === 'suspended' ? 'upcoming' : 'suspended' };
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl font-semibold text-foreground">Platform Events</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{events.length} events across all organizers</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Events', value: events.length, color: 'text-foreground' },
            { label: 'Live Now', value: events.filter((e) => e.status === 'live').length, color: 'text-emerald-400' },
            { label: 'Upcoming', value: events.filter((e) => e.status === 'upcoming').length, color: 'text-blue-400' },
            { label: 'Total Attendees', value: events.reduce((s, e) => s + e.attendees, 0).toLocaleString(), color: 'text-primary' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <GlassCard className="text-center py-4">
                <p className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{s.label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <GlassCard className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="gold-input w-full pl-10 text-sm" placeholder="Search events or organizers..." />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <div className="flex gap-1 p-1 glass-card rounded-xl">
              {(['all', 'live', 'upcoming', 'completed', 'suspended'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all capitalize ${statusFilter === s ? 'gold-gradient-bg text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Events Table */}
        <GlassCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Event', 'Organizer', 'Date', 'Venue', 'Attendees', 'Revenue', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-xs text-muted-foreground font-medium px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((e, i) => {
                    const s = getStatus(e);
                    const cfg = statusConfig[s as keyof typeof statusConfig] || statusConfig.upcoming;
                    const fillPct = (e.attendees / e.maxAttendees) * 100;
                    return (
                      <motion.tr
                        key={e.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg gold-gradient-bg flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                              <Calendar className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground whitespace-nowrap">{e.name}</p>
                              <span className="text-[10px] text-muted-foreground">{e.category}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{e.organizer}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{e.date}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap max-w-32 truncate">{e.venue}</td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-xs text-foreground">{e.attendees} / {e.maxAttendees}</p>
                            <div className="w-16 h-1 bg-muted rounded-full mt-1">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${fillPct}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs font-medium text-primary">{e.revenue}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border inline-flex items-center gap-1 ${cfg.color}`}>
                            {s === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <Button variant="gold-ghost" size="sm" className="h-7 px-2 text-xs">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="gold-ghost"
                              size="sm"
                              className={`h-7 px-2 text-xs ${s === 'suspended' ? 'text-emerald-400 hover:text-emerald-300' : 'text-amber-400 hover:text-amber-300'}`}
                              onClick={() => toggleSuspend(e.id)}
                              title={s === 'suspended' ? 'Reinstate' : 'Suspend'}
                            >
                              {s === 'suspended' ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                            </Button>
                            <Button variant="gold-ghost" size="sm" className="h-7 px-2 text-xs text-red-400 hover:text-red-300">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </AdminLayout>
  );
};

export default AdminEventsPage;
