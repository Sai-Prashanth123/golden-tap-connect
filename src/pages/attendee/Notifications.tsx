import { AppLayout } from '@/components/AppLayout';
import { GlassCard } from '@/components/GlassCard';
import { Bell, UserPlus, Calendar, Trophy, MessageSquare, Star, Zap } from 'lucide-react';

const notifications = [
  { type: 'connection', icon: UserPlus, title: 'New connection from Raj Patel', desc: 'CTO at Finova', time: '2 min ago', group: 'today' },
  { type: 'nudge', icon: MessageSquare, title: 'Follow up with Priya Sharma', desc: "It's been 3 days since you met", time: '1h ago', group: 'today' },
  { type: 'event', icon: Calendar, title: 'AI Founders Meetup tomorrow', desc: 'Wed 2:00 PM · Koramangala Hub', time: '3h ago', group: 'today' },
  { type: 'badge', icon: Trophy, title: 'Badge earned: Networker', desc: 'You connected with 100+ people', time: '1d ago', group: 'week' },
  { type: 'score', icon: Zap, title: 'FK Score updated', desc: 'Your score increased to 87', time: '2d ago', group: 'week' },
  { type: 'intro', icon: Star, title: 'Warm intro request from David Kim', desc: 'Wants to connect via James Liu', time: '3d ago', group: 'week' },
];

const NotificationsPage = () => (
  <AppLayout>
    <div className="max-w-2xl mx-auto space-y-6 pb-20 md:pb-0">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-foreground">Notifications</h1>
        <button className="text-xs text-primary hover:underline">Mark all read</button>
      </div>

      {['today', 'week'].map((group) => (
        <div key={group}>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
            {group === 'today' ? 'Today' : 'This Week'}
          </p>
          <div className="space-y-2">
            {notifications.filter((n) => n.group === group).map((n, i) => (
              <GlassCard key={i} hover className="flex items-start gap-3 p-4 cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <n.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.desc}</p>
                </div>
                <span className="text-[10px] text-muted-foreground flex-shrink-0">{n.time}</span>
              </GlassCard>
            ))}
          </div>
        </div>
      ))}
    </div>
  </AppLayout>
);

export default NotificationsPage;
