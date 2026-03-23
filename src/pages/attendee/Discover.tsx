import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useSearchParams } from 'react-router-dom';
import { useEvents } from '@/hooks/useEvents';
import { getTheme } from '@/lib/eventThemes';
import { Calendar, MapPin, Users, Tag, Search, Sparkles } from 'lucide-react';

const CATEGORIES = [
  { id: 'tech', label: 'Tech', emoji: '💻', color: 'from-blue-600/30 to-blue-800/10' },
  { id: 'business', label: 'Business', emoji: '💼', color: 'from-amber-600/30 to-amber-800/10' },
  { id: 'design', label: 'Design', emoji: '🎨', color: 'from-purple-600/30 to-purple-800/10' },
  { id: 'health', label: 'Health', emoji: '🏃', color: 'from-emerald-600/30 to-emerald-800/10' },
  { id: 'social', label: 'Social', emoji: '🎉', color: 'from-rose-600/30 to-rose-800/10' },
  { id: 'arts', label: 'Arts', emoji: '🎭', color: 'from-pink-600/30 to-pink-800/10' },
  { id: 'sports', label: 'Sports', emoji: '⚽', color: 'from-orange-600/30 to-orange-800/10' },
  { id: 'food', label: 'Food', emoji: '🍽️', color: 'from-yellow-600/30 to-yellow-800/10' },
];

const DiscoverPage = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') ?? '');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useEvents({
    q: search || undefined,
    category: selectedCategory || undefined,
    status: 'PUBLISHED',
    limit: 30,
    orderBy: 'startDate',
    orderDir: 'asc',
  });

  const events = data?.events ?? [];

  return (
    <AppLayout>
      <div className="space-y-6 pb-24 md:pb-8">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h1 className="font-display text-3xl font-semibold text-foreground">Discover</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events, topics, venues..."
            className="pl-10"
          />
        </div>

        {/* Category grid */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Browse by Category</p>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? '' : cat.id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all bg-gradient-to-br ${cat.color} ${
                  selectedCategory === cat.id
                    ? 'border-primary scale-95'
                    : 'border-border hover:border-primary/40 hover:scale-95'
                }`}
              >
                <span className="text-xl">{cat.emoji}</span>
                <span className="text-[10px] font-medium text-foreground">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Events */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {selectedCategory
                ? `${CATEGORIES.find((c) => c.id === selectedCategory)?.label ?? selectedCategory} Events`
                : 'All Events'}
            </p>
            {(selectedCategory || search) && (
              <Button variant="ghost" size="sm" className="text-xs h-6 px-2"
                onClick={() => { setSelectedCategory(''); setSearch(''); }}>
                Clear
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <GlassCard key={i} className="h-40 animate-pulse" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No events found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((e, i) => {
                const theme = getTheme(e.theme);
                const price = e.ticketPrice ? `₹${Number(e.ticketPrice).toLocaleString('en-IN')}` : 'Free';
                return (
                  <motion.div key={e.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link to={`/event/${e.id}`}>
                      <GlassCard hover className="h-full flex flex-col p-0 overflow-hidden">
                        <div className="h-1.5 w-full" style={{ background: theme.gradient }} />
                        <div className="p-4 flex flex-col flex-1">
                          {e.category && (
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">{e.category}</span>
                          )}
                          <h3 className="font-display text-base font-semibold text-foreground leading-tight mb-2">{e.title}</h3>
                          <div className="space-y-1 mb-3 flex-1">
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <Calendar className="w-3 h-3 flex-shrink-0" />
                              {new Date(e.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                            {(e.city || e.address) && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                {e.locationType === 'VIRTUAL' ? 'Online' : (e.city || e.address)}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-border">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Users className="w-3 h-3" /> {e.registeredCount ?? 0}
                            </span>
                            <span className="text-xs font-medium text-primary">{price}</span>
                          </div>
                        </div>
                      </GlassCard>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default DiscoverPage;
