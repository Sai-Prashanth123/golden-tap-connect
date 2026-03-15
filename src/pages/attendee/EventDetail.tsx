import { AppLayout } from '@/components/AppLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Users, Trophy, QrCode, Sparkles, Star, CheckCircle2 } from 'lucide-react';

const EventDetailPage = () => {
  const { id } = useParams();

  const attendees = [
    { name: 'Priya Sharma', role: 'CEO, TechVentures', match: 94, speaker: false },
    { name: 'Dr. Arun Mehta', role: 'Keynote Speaker', match: 88, speaker: true },
    { name: 'James Liu', role: 'Partner, Sequoia', match: 85, speaker: true },
    { name: 'Sarah Mitchell', role: 'Founder, GreenScale', match: 82, speaker: false },
    { name: 'Raj Patel', role: 'CTO, Finova', match: 79, speaker: false },
    { name: 'Lisa Wang', role: 'CTO, CloudSync', match: 76, speaker: false },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 pb-20 md:pb-0">
        {/* Event Header */}
        <GlassCard className="gold-border-glow">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="gold-pill text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Live Now
                </span>
                <span className="gold-pill text-[10px]">Premium Seat</span>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">BLR Tech Week 2026</h1>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Today, 10:00 AM – 6:00 PM
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Bangalore International Centre
              </p>
            </div>
            <Button variant="gold" size="lg">
              <QrCode className="w-5 h-5 mr-2" /> Check In
            </Button>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* People to Meet */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> People to Meet
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bento-stagger">
              {attendees.map((a, i) => (
                <GlassCard key={i} hover className={a.speaker ? 'gold-border-glow' : ''}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gold-gradient-bg flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0">
                      {a.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground truncate">{a.name}</p>
                        {a.speaker && <Star className="w-3 h-3 text-primary flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{a.role}</p>
                    </div>
                    <div className="gold-pill text-[10px] font-semibold">{a.match}%</div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Leaderboard */}
            <GlassCard>
              <h3 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" /> Leaderboard
              </h3>
              <div className="space-y-2">
                {[
                  { name: 'Priya S.', connections: 12, rank: 1 },
                  { name: 'You', connections: 8, rank: 2, isUser: true },
                  { name: 'James L.', connections: 7, rank: 3 },
                ].map((l, i) => (
                  <div key={i} className={`flex items-center gap-2 p-2 rounded-lg text-sm ${l.isUser ? 'gold-border-glow' : ''}`}>
                    <span className="w-5 text-center text-xs font-bold gold-gradient-text">#{l.rank}</span>
                    <span className="text-foreground flex-1">{l.name}</span>
                    <span className="text-xs text-muted-foreground">{l.connections} connects</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Scavenger Hunt */}
            <GlassCard>
              <h3 className="font-display text-lg font-semibold text-foreground mb-3">Scavenger Hunt</h3>
              <div className="space-y-2">
                {[
                  { task: 'Tap a speaker', done: true },
                  { task: 'Meet 3 fintech founders', done: false },
                  { task: 'Find the mystery guest', done: false },
                ].map((q, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${q.done ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={q.done ? 'text-foreground line-through' : 'text-foreground'}>{q.task}</span>
                  </div>
                ))}
              </div>
              <div className="w-full h-2 rounded-full bg-muted mt-3">
                <div className="h-full rounded-full gold-gradient-bg" style={{ width: '33%' }} />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">1/3 · Unlock VIP lounge</p>
            </GlassCard>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default EventDetailPage;
