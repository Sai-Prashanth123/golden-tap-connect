import { AppLayout } from '@/components/AppLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, Users, MapPin, QrCode, Star, ChevronRight } from 'lucide-react';

const events = [
  { id: '1', name: 'BLR Tech Week 2026', date: 'Today, 10:00 AM', venue: 'Bangalore International Centre', attendees: 420, status: 'live' },
  { id: '2', name: 'AI Founders Meetup', date: 'Wed, Mar 18 · 2:00 PM', venue: 'Koramangala Hub', attendees: 85, status: 'upcoming' },
  { id: '3', name: 'Climate Summit', date: 'Fri, Mar 20 · 9:00 AM', venue: 'Convention Center', attendees: 200, status: 'upcoming' },
  { id: '4', name: 'SaaS Summit 2026', date: 'Mar 25 · 10:00 AM', venue: 'Hyatt Regency', attendees: 350, status: 'upcoming' },
  { id: '5', name: 'YC Demo Day Watch', date: 'Mar 10 · 5:00 PM', venue: 'Online', attendees: 120, status: 'past' },
];

const EventsPage = () => (
  <AppLayout>
    <div className="space-y-6 pb-20 md:pb-0">
      <h1 className="font-display text-3xl font-semibold text-foreground">Events</h1>

      {['live', 'upcoming', 'past'].map((status) => {
        const filtered = events.filter((e) => e.status === status);
        if (!filtered.length) return null;
        return (
          <div key={status}>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              {status === 'live' && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
              {status === 'live' ? 'Happening Now' : status === 'upcoming' ? 'Upcoming' : 'Past Events'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bento-stagger">
              {filtered.map((e) => (
                <GlassCard key={e.id} hover className={status === 'live' ? 'gold-border-glow' : ''}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-foreground">{e.name}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" /> {e.date}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {e.venue}
                      </p>
                    </div>
                    {status === 'live' && (
                      <span className="gold-pill text-[10px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Live
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="w-3 h-3" /> {e.attendees} attendees
                    </span>
                    {status !== 'past' && (
                      <Button variant="gold" size="sm" asChild>
                        <Link to={`/event/${e.id}`}>
                          {status === 'live' ? <><QrCode className="w-3 h-3 mr-1" /> Check In</> : <>View <ChevronRight className="w-3 h-3 ml-1" /></>}
                        </Link>
                      </Button>
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </AppLayout>
);

export default EventsPage;
