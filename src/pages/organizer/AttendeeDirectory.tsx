import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OrganizerLayout } from '@/components/OrganizerLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Search, Filter, Download, Eye, Mail, Users, Star, Crown } from 'lucide-react';

const attendees = [
  { id: '1', name: 'Alex Chen', designation: 'Founder & CEO', company: 'NexusAI', industry: 'AI/ML', event: 'BLR Tech Week', tier: 'founder', connections: 12, fkScore: 87, status: 'checked-in', email: 'alex@nexusai.com', phone: '+91 9876543210' },
  { id: '2', name: 'Priya Sharma', designation: 'CTO', company: 'Finova', industry: 'Fintech', event: 'BLR Tech Week', tier: 'free', connections: 5, fkScore: 62, status: 'registered', email: 'priya@finova.in', phone: '+91 9123456789' },
  { id: '3', name: 'Rahul Mehta', designation: 'Investor', company: 'Kalaari Capital', industry: 'VC', event: 'AI Founders Meetup', tier: 'founder', connections: 28, fkScore: 94, status: 'checked-in', email: 'rahul@kalaari.com', phone: '+91 9000000002' },
  { id: '4', name: 'Sarah Johnson', designation: 'Head of Growth', company: 'GrowthOS', industry: 'SaaS', event: 'SaaS Summit', tier: 'free', connections: 3, fkScore: 45, status: 'registered', email: 'sarah@growthos.io', phone: '+91 9988776655' },
  { id: '5', name: 'Vikram Singh', designation: 'Co-Founder', company: 'ClimateFirst', industry: 'Climate', event: 'Climate Summit', tier: 'founder', connections: 19, fkScore: 81, status: 'checked-in', email: 'vikram@climatefirst.co', phone: '+91 9871234560' },
  { id: '6', name: 'Aisha Nair', designation: 'Product Manager', company: 'TechStartup', industry: 'Product', event: 'BLR Tech Week', tier: 'free', connections: 8, fkScore: 55, status: 'pending', email: 'aisha@techstartup.com', phone: '+91 9654321098' },
];

const statusConfig = {
  'checked-in': { label: 'Checked In', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  'registered': { label: 'Registered', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  'pending': { label: 'Pending', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
};

const AttendeeDirectoryPage = () => {
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedAttendee, setSelectedAttendee] = useState<typeof attendees[0] | null>(null);

  const events = ['all', ...Array.from(new Set(attendees.map((a) => a.event)))];

  const filtered = attendees.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.company.toLowerCase().includes(search.toLowerCase());
    const matchEvent = selectedEvent === 'all' || a.event === selectedEvent;
    const matchTier = selectedTier === 'all' || a.tier === selectedTier;
    return matchSearch && matchEvent && matchTier;
  });

  const handleExport = () => {
    const csv = ['Name,Company,Designation,Industry,Event,Tier,FK Score,Connections,Email,Status']
      .concat(filtered.map((a) => `${a.name},${a.company},${a.designation},${a.industry},${a.event},${a.tier},${a.fkScore},${a.connections},${a.email},${a.status}`))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendee-directory.csv';
    a.click();
  };

  return (
    <OrganizerLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl font-semibold text-foreground">Attendee Directory</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{filtered.length} of {attendees.length} attendees</p>
          </div>
          <Button variant="gold" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-1.5" /> Export CSV
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Registered', value: attendees.length, icon: Users },
            { label: 'Checked In', value: attendees.filter((a) => a.status === 'checked-in').length, icon: Star },
            { label: 'FounderCard', value: attendees.filter((a) => a.tier === 'founder').length, icon: Crown },
            { label: 'Avg FK Score', value: Math.round(attendees.reduce((s, a) => s + a.fkScore, 0) / attendees.length), icon: Star },
          ].map(({ label, value, icon: Icon }, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <GlassCard className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl gold-gradient-bg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-display text-xl font-bold gold-gradient-text">{value}</p>
                  <p className="text-[11px] text-muted-foreground">{label}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <GlassCard className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="gold-input w-full pl-10 text-sm" placeholder="Search name or company..." />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} className="gold-input text-sm py-1.5 pr-8">
              {events.map((ev) => <option key={ev} value={ev}>{ev === 'all' ? 'All Events' : ev}</option>)}
            </select>
            <select value={selectedTier} onChange={(e) => setSelectedTier(e.target.value)} className="gold-input text-sm py-1.5 pr-8">
              <option value="all">All Tiers</option>
              <option value="founder">FounderCard</option>
              <option value="free">Free</option>
            </select>
          </div>
        </GlassCard>

        {/* Table */}
        <GlassCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Attendee', 'Industry', 'Event', 'Tier', 'FK Score', 'Connections', 'Status', ''].map((h) => (
                    <th key={h} className="text-left text-xs text-muted-foreground font-medium px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((a, i) => (
                    <motion.tr
                      key={a.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full gold-gradient-bg flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                            {a.name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground whitespace-nowrap">{a.name}</p>
                            <p className="text-[11px] text-muted-foreground">{a.designation}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{a.industry}</td>
                      <td className="px-4 py-3"><span className="gold-pill text-[10px] whitespace-nowrap">{a.event}</span></td>
                      <td className="px-4 py-3">
                        {a.tier === 'founder' ? (
                          <span className="flex items-center gap-1 text-[10px] text-primary"><Crown className="w-3 h-3" /> FounderCard</span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">Free</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-display text-sm font-bold gold-gradient-text">{a.fkScore}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{a.connections}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusConfig[a.status as keyof typeof statusConfig].color}`}>
                          {statusConfig[a.status as keyof typeof statusConfig].label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="gold-ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setSelectedAttendee(a)}>
                          <Eye className="w-3 h-3 mr-1" /> View
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      {/* Attendee Detail Modal */}
      <AnimatePresence>
        {selectedAttendee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setSelectedAttendee(null)}
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-sm">
              <GlassCard className="relative">
                <button onClick={() => setSelectedAttendee(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-xs">✕</button>
                <div className="text-center mb-5">
                  <div className="w-16 h-16 rounded-full gold-gradient-bg flex items-center justify-center text-primary-foreground text-xl font-bold mx-auto mb-3">
                    {selectedAttendee.name[0]}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground">{selectedAttendee.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedAttendee.designation} · {selectedAttendee.company}</p>
                  <div className="flex justify-center gap-2 mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusConfig[selectedAttendee.status as keyof typeof statusConfig].color}`}>
                      {statusConfig[selectedAttendee.status as keyof typeof statusConfig].label}
                    </span>
                    {selectedAttendee.tier === 'founder' && (
                      <span className="flex items-center gap-1 text-[10px] text-primary gold-pill"><Crown className="w-3 h-3" /> FounderCard</span>
                    )}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  {[
                    { label: 'Email', value: selectedAttendee.email, icon: Mail },
                    { label: 'Event', value: selectedAttendee.event, icon: Star },
                    { label: 'FK Score', value: selectedAttendee.fkScore, icon: Star },
                    { label: 'Event Connections', value: selectedAttendee.connections, icon: Users },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground flex items-center gap-2"><Icon className="w-3.5 h-3.5" /> {label}</span>
                      <span className="text-foreground font-medium text-xs">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="gold-ghost" size="sm" className="flex-1 text-xs"><Mail className="w-3 h-3 mr-1" /> Email</Button>
                  <Button variant="gold" size="sm" className="flex-1 text-xs">View Profile</Button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </OrganizerLayout>
  );
};

export default AttendeeDirectoryPage;
