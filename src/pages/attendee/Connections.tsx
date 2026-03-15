import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Search, MessageSquare, StickyNote, UserPlus, ChevronRight } from 'lucide-react';

const connections = [
  { name: 'Priya Sharma', role: 'CEO', company: 'TechVentures', event: 'BLR Tech Week', health: 'warm', lastSeen: '2 days ago', industry: 'Fintech' },
  { name: 'James Liu', role: 'Partner', company: 'Sequoia', event: 'YC Demo Day', health: 'warm', lastSeen: '5 days ago', industry: 'VC' },
  { name: 'Sarah Mitchell', role: 'Founder', company: 'GreenScale', event: 'Climate Summit', health: 'cold', lastSeen: '2 weeks ago', industry: 'Climate' },
  { name: 'Raj Patel', role: 'CTO', company: 'Finova', event: 'BLR Tech Week', health: 'warm', lastSeen: '1 day ago', industry: 'Fintech' },
  { name: 'Mika Tanaka', role: 'VP Eng', company: 'ByteDance', event: 'Asia Tech', health: 'cold', lastSeen: '3 weeks ago', industry: 'Social' },
  { name: 'Elena Rossi', role: 'Founder', company: 'DataVault', event: 'SaaS Summit', health: 'warm', lastSeen: '3 days ago', industry: 'SaaS' },
];

const ConnectionsPage = () => {
  const [tab, setTab] = useState<'all' | 'event' | 'suggested'>('all');
  const [search, setSearch] = useState('');

  const filtered = connections.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6 pb-20 md:pb-0">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-semibold text-foreground">My Network</h1>
          <span className="gold-pill">{connections.length} connections</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(['all', 'event', 'suggested'] as const).map((t) => (
            <Button key={t} variant={tab === t ? 'gold' : 'gold-ghost'} size="sm" onClick={() => setTab(t)}>
              {t === 'all' ? 'All' : t === 'event' ? 'By Event' : 'Suggested'}
            </Button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="gold-input w-full pl-10"
            placeholder="Search connections..."
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bento-stagger">
          {filtered.map((c, i) => (
            <GlassCard key={i} hover className="cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full gold-gradient-bg flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0">
                  {c.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground text-sm truncate">{c.name}</p>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${c.health === 'warm' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                  </div>
                  <p className="text-xs text-muted-foreground">{c.role} · {c.company}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="gold-pill text-[10px]">{c.event}</span>
                    <span className="text-[10px] text-muted-foreground">{c.lastSeen}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <Button variant="gold-ghost" size="sm" className="flex-1 text-xs">
                  <MessageSquare className="w-3 h-3 mr-1" /> Message
                </Button>
                <Button variant="gold-ghost" size="sm" className="flex-1 text-xs">
                  <StickyNote className="w-3 h-3 mr-1" /> Note
                </Button>
                <Button variant="gold-ghost" size="sm" className="flex-1 text-xs">
                  <UserPlus className="w-3 h-3 mr-1" /> Intro
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default ConnectionsPage;
