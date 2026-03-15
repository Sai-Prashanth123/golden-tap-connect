import { AdminLayout } from '@/components/AdminLayout';
import { GlassCard } from '@/components/GlassCard';
import { Users, Calendar, Zap, DollarSign, TrendingUp } from 'lucide-react';

const AdminDashboard = () => (
  <AdminLayout>
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-semibold text-foreground">Platform Overview</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bento-stagger">
        {[
          { label: 'Total Users', value: '12,840', icon: Users, change: '+12%' },
          { label: 'Total Events', value: '284', icon: Calendar, change: '+8%' },
          { label: 'Connections', value: '45.2K', icon: Zap, change: '+24%' },
          { label: 'MRR', value: '$18.4K', icon: DollarSign, change: '+15%' },
        ].map((s, i) => (
          <GlassCard key={i} hover>
            <div className="flex items-center justify-between mb-2">
              <s.icon className="w-5 h-5 text-primary" />
              <span className="text-xs text-green-500 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> {s.change}
              </span>
            </div>
            <p className="font-display text-2xl font-bold gold-gradient-text">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard>
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              'New user registration: Elena Rossi',
              'Event created: SaaS Summit 2026',
              'FounderCard order: James Liu',
              'Event completed: Startup Pitch Night',
              'Flagged content: Review needed',
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                <p className="text-sm text-foreground">{a}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {['Review flagged content', 'Approve pending events', 'Process card orders', 'View analytics report'].map((a, i) => (
              <div key={i} className="glass-card p-3 cursor-pointer hover:border-primary/30 transition-all">
                <p className="text-sm text-foreground">{a}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  </AdminLayout>
);

export default AdminDashboard;
