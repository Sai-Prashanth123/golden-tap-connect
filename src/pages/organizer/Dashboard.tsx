import { OrganizerLayout } from '@/components/OrganizerLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, Users, Zap, BarChart3, Plus, ChevronRight } from 'lucide-react';

const OrganizerDashboard = () => (
  <OrganizerLayout>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-foreground">Organizer Dashboard</h1>
        <Button variant="gold" asChild>
          <Link to="/organizer/events/create"><Plus className="w-4 h-4 mr-1" /> Create Event</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bento-stagger">
        {[
          { label: 'Total Events', value: '12', icon: Calendar },
          { label: 'Total Attendees', value: '2,840', icon: Users },
          { label: 'Connections Made', value: '8,420', icon: Zap },
          { label: 'Avg Engagement', value: '76%', icon: BarChart3 },
        ].map((s, i) => (
          <GlassCard key={i} hover>
            <s.icon className="w-5 h-5 text-primary mb-2" />
            <p className="font-display text-2xl font-bold gold-gradient-text">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Events */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-foreground">Your Events</h2>
        </div>
        <div className="space-y-3">
          {[
            { name: 'BLR Tech Week 2026', date: 'Mar 15', attendees: 420, connections: 1240, status: 'live' },
            { name: 'AI Founders Meetup', date: 'Mar 18', attendees: 85, connections: 0, status: 'upcoming' },
            { name: 'SaaS Summit', date: 'Mar 25', attendees: 350, connections: 0, status: 'upcoming' },
            { name: 'Startup Pitch Night', date: 'Mar 5', attendees: 120, connections: 340, status: 'past' },
          ].map((e, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${e.status === 'live' ? 'bg-green-500 animate-pulse' : e.status === 'upcoming' ? 'bg-primary' : 'bg-muted-foreground'}`} />
                <div>
                  <p className="text-sm font-medium text-foreground">{e.name}</p>
                  <p className="text-xs text-muted-foreground">{e.date} · {e.attendees} attendees · {e.connections} connections</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  </OrganizerLayout>
);

export default OrganizerDashboard;
