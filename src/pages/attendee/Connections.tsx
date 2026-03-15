import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Search, MessageSquare, StickyNote, UserPlus, Download, Share2, GitBranch, List, X, Check } from 'lucide-react';

const connections = [
  { id: '1', name: 'Priya Sharma', role: 'CEO', company: 'TechVentures', event: 'BLR Tech Week', health: 'warm', lastSeen: '2 days ago', industry: 'Fintech', note: '', mutuals: 3, x: 0.55, y: 0.25 },
  { id: '2', name: 'James Liu', role: 'Partner', company: 'Sequoia', event: 'YC Demo Day', health: 'warm', lastSeen: '5 days ago', industry: 'VC', note: '', mutuals: 7, x: 0.75, y: 0.55 },
  { id: '3', name: 'Sarah Mitchell', role: 'Founder', company: 'GreenScale', event: 'Climate Summit', health: 'cold', lastSeen: '2 weeks ago', industry: 'Climate', note: '', mutuals: 1, x: 0.3, y: 0.65 },
  { id: '4', name: 'Raj Patel', role: 'CTO', company: 'Finova', event: 'BLR Tech Week', health: 'warm', lastSeen: '1 day ago', industry: 'Fintech', note: '', mutuals: 5, x: 0.45, y: 0.45 },
  { id: '5', name: 'Mika Tanaka', role: 'VP Eng', company: 'ByteDance', event: 'Asia Tech', health: 'cold', lastSeen: '3 weeks ago', industry: 'Social', note: '', mutuals: 2, x: 0.65, y: 0.78 },
  { id: '6', name: 'Elena Rossi', role: 'Founder', company: 'DataVault', event: 'SaaS Summit', health: 'warm', lastSeen: '3 days ago', industry: 'SaaS', note: '', mutuals: 4, x: 0.2, y: 0.35 },
];

const ConnectionGraph = ({ connections: conns }: { connections: typeof connections }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dims, setDims] = useState({ w: 600, h: 400 });

  useEffect(() => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      setDims({ w: rect.width || 600, h: rect.height || 400 });
    }
  }, []);

  const center = { x: dims.w / 2, y: dims.h / 2 };
  const r = Math.min(dims.w, dims.h) * 0.38;

  const nodePositions = conns.map((c, i) => {
    const angle = (i / conns.length) * Math.PI * 2 - Math.PI / 2;
    return {
      ...c,
      nx: center.x + Math.cos(angle) * r,
      ny: center.y + Math.sin(angle) * r,
    };
  });

  return (
    <div className="relative w-full h-72 md:h-96">
      <svg ref={svgRef} className="w-full h-full" viewBox={`0 0 ${dims.w} ${dims.h}`}>
        {/* Lines to center */}
        {nodePositions.map((n) => (
          <line
            key={n.id}
            x1={center.x} y1={center.y}
            x2={n.nx} y2={n.ny}
            stroke={n.health === 'warm' ? '#D4A853' : '#4B6BFB'}
            strokeWidth={n.health === 'warm' ? 1.5 : 1}
            strokeOpacity={0.35}
            strokeDasharray={n.health === 'cold' ? '4 3' : undefined}
          />
        ))}
        {/* Cross-connections between warm */}
        {nodePositions.filter((n) => n.health === 'warm').map((a, i, arr) =>
          arr.slice(i + 1).map((b) => (
            <line
              key={`${a.id}-${b.id}`}
              x1={a.nx} y1={a.ny}
              x2={b.nx} y2={b.ny}
              stroke="#D4A853"
              strokeWidth={0.8}
              strokeOpacity={0.15}
            />
          ))
        )}
        {/* Center node (you) */}
        <circle cx={center.x} cy={center.y} r={28} fill="url(#goldGrad)" />
        <circle cx={center.x} cy={center.y} r={28} fill="none" stroke="#D4A853" strokeWidth={2} strokeOpacity={0.6} />
        <text x={center.x} y={center.y + 5} textAnchor="middle" fill="#0D0D0D" fontSize={12} fontWeight="bold">You</text>
        {/* Connection nodes */}
        {nodePositions.map((n) => (
          <g key={n.id}>
            <circle
              cx={n.nx} cy={n.ny} r={22}
              fill={n.health === 'warm' ? 'rgba(212,168,83,0.15)' : 'rgba(75,107,251,0.1)'}
              stroke={n.health === 'warm' ? '#D4A853' : '#4B6BFB'}
              strokeWidth={1.5}
              strokeOpacity={0.5}
            />
            <text x={n.nx} y={n.ny + 4} textAnchor="middle" fill="#E8E0D0" fontSize={10}>{n.name.split(' ')[0][0]}{n.name.split(' ')[1]?.[0]}</text>
            <text x={n.nx} y={n.ny + 35} textAnchor="middle" fill="#9CA3AF" fontSize={9}>{n.name.split(' ')[0]}</text>
          </g>
        ))}
        <defs>
          <radialGradient id="goldGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4A853" />
            <stop offset="100%" stopColor="#B8892A" />
          </radialGradient>
        </defs>
      </svg>
      {/* Legend */}
      <div className="absolute bottom-2 right-2 flex gap-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-amber-500 inline-block" /> Warm</span>
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-500 inline-block border-dashed border-b" /> Cold</span>
      </div>
    </div>
  );
};

const ConnectionsPage = () => {
  const [tab, setTab] = useState<'all' | 'event' | 'suggested'>('all');
  const [view, setView] = useState<'list' | 'graph'>('list');
  const [search, setSearch] = useState('');
  const [noteFor, setNoteFor] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [exportDone, setExportDone] = useState(false);

  const filtered = connections.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    const vcards = connections.map((c) =>
      `BEGIN:VCARD\nVERSION:3.0\nFN:${c.name}\nORG:${c.company}\nTITLE:${c.role}\nNOTE:Met at ${c.event} via FounderKey\nEND:VCARD`
    ).join('\n\n');
    const blob = new Blob([vcards], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'founderkey-connections.vcf';
    a.click();
    URL.revokeObjectURL(url);
    setExportDone(true);
    setTimeout(() => setExportDone(false), 3000);
  };

  return (
    <AppLayout>
      <div className="space-y-6 pb-24 md:pb-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl font-semibold text-foreground">My Network</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{connections.length} connections · {connections.filter(c => c.health === 'warm').length} warm</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="gold-ghost"
              size="sm"
              onClick={() => setView(view === 'list' ? 'graph' : 'list')}
              className="flex items-center gap-1.5"
            >
              {view === 'list' ? <><GitBranch className="w-4 h-4" /> Graph</> : <><List className="w-4 h-4" /> List</>}
            </Button>
            <Button
              variant="gold-ghost"
              size="sm"
              onClick={handleExport}
              className="flex items-center gap-1.5"
            >
              {exportDone ? <><Check className="w-4 h-4 text-green-400" /> Exported!</> : <><Download className="w-4 h-4" /> Export Contacts</>}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(['all', 'event', 'suggested'] as const).map((t) => (
            <Button key={t} variant={tab === t ? 'gold' : 'gold-ghost'} size="sm" onClick={() => setTab(t)}>
              {t === 'all' ? 'All' : t === 'event' ? 'By Event' : 'Suggested'}
            </Button>
          ))}
        </div>

        {/* Graph View */}
        <AnimatePresence mode="wait">
          {view === 'graph' ? (
            <motion.div
              key="graph"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg font-semibold text-foreground">Connection Graph</h3>
                  <span className="text-xs text-muted-foreground">{connections.length} nodes</span>
                </div>
                <ConnectionGraph connections={filtered.length > 0 ? filtered : connections} />
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <GlassCard hover className="cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-full gold-gradient-bg flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0 ring-2 ring-primary/20">
                          {c.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground text-sm truncate">{c.name}</p>
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${c.health === 'warm' ? 'bg-yellow-500' : 'bg-blue-500'}`} title={c.health === 'warm' ? 'Warm connection' : 'Cold connection'} />
                          </div>
                          <p className="text-xs text-muted-foreground">{c.role} · {c.company}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="gold-pill text-[10px]">{c.event}</span>
                            <span className="text-[10px] text-muted-foreground">{c.lastSeen}</span>
                            <span className="text-[10px] text-muted-foreground">{c.mutuals} mutuals</span>
                          </div>
                          {notes[c.id] && (
                            <p className="text-[11px] text-muted-foreground mt-1.5 italic border-l-2 border-primary/30 pl-2">"{notes[c.id]}"</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                        <Button variant="gold-ghost" size="sm" className="flex-1 text-xs">
                          <MessageSquare className="w-3 h-3 mr-1" /> Message
                        </Button>
                        <Button
                          variant="gold-ghost"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => { setNoteFor(c.id); setNoteText(notes[c.id] || ''); }}
                        >
                          <StickyNote className="w-3 h-3 mr-1" /> Note
                        </Button>
                        <Button variant="gold-ghost" size="sm" className="flex-1 text-xs">
                          <UserPlus className="w-3 h-3 mr-1" /> Intro
                        </Button>
                        <Button variant="gold-ghost" size="sm" className="text-xs px-2">
                          <Share2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Note Modal */}
      <AnimatePresence>
        {noteFor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setNoteFor(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm"
            >
              <GlassCard className="relative">
                <button onClick={() => setNoteFor(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
                <h3 className="font-display text-lg font-semibold text-foreground mb-1">Add Note</h3>
                <p className="text-sm text-muted-foreground mb-4">{connections.find((c) => c.id === noteFor)?.name}</p>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="gold-input w-full h-24 resize-none text-sm mb-4"
                  placeholder="e.g. Met at their booth, interested in B2B SaaS demo..."
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button variant="gold-ghost" size="sm" onClick={() => setNoteFor(null)}>Cancel</Button>
                  <Button variant="gold" size="sm" className="flex-1" onClick={() => { setNotes((n) => ({ ...n, [noteFor!]: noteText })); setNoteFor(null); }}>
                    Save Note
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

export default ConnectionsPage;
