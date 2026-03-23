import { useParams, Link } from 'react-router-dom';
import { OrganizerLayout } from '@/components/OrganizerLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { useEventAnalytics } from '@/hooks/useOrganizer';
import { ArrowLeft, Users, CheckCircle2, XCircle, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const AnalyticsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: analytics, isLoading } = useEventAnalytics(id!);

  if (isLoading) {
    return (
      <OrganizerLayout>
        <div className="space-y-4 animate-pulse">
          <div className="h-8 w-1/3 bg-muted/50 rounded" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-muted/50 rounded-xl" />)}
          </div>
        </div>
      </OrganizerLayout>
    );
  }

  if (!analytics) {
    return (
      <OrganizerLayout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Analytics not available.</p>
        </div>
      </OrganizerLayout>
    );
  }

  const { event, registrations, leads } = analytics;
  const leadStatusEntries = Object.entries(leads);

  return (
    <OrganizerLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="gold-ghost" size="sm" asChild>
            <Link to={`/organizer/events/${id}/manage`}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Link>
          </Button>
          <div>
            <h1 className="font-display text-2xl font-semibold text-foreground">Analytics</h1>
            <p className="text-sm text-muted-foreground">{event.title}</p>
          </div>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Registrations', value: registrations.total, icon: Users, color: '' },
            { label: 'Attended', value: registrations.attended, icon: CheckCircle2, color: 'text-emerald-400' },
            { label: 'Cancelled', value: registrations.cancelled, icon: XCircle, color: 'text-rose-400' },
            { label: 'Waitlisted', value: registrations.waitlisted, icon: Clock, color: 'text-amber-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <GlassCard key={label} padding="md" className="text-center">
              <Icon className={`w-4 h-4 mx-auto mb-2 ${color || 'text-muted-foreground'}`} />
              <p className={`font-display text-2xl font-bold mb-0.5 ${color || 'text-foreground'}`}>{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </GlassCard>
          ))}
        </div>

        {/* Conversion & capacity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-medium text-foreground">Conversion Rate</h2>
            </div>
            <div className="flex items-end gap-3 mb-3">
              <span className="font-display text-4xl font-bold text-foreground">{registrations.conversionRate}%</span>
              <span className="text-sm text-muted-foreground mb-1">attended</span>
            </div>
            <div className="h-2 rounded-full bg-muted/50">
              <motion.div
                className="h-full rounded-full gold-gradient-bg"
                initial={{ width: 0 }}
                animate={{ width: `${registrations.conversionRate}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-medium text-foreground">Capacity Utilization</h2>
            </div>
            <div className="flex items-end gap-3 mb-3">
              <span className="font-display text-4xl font-bold text-foreground">{registrations.capacityUtilization}%</span>
              <span className="text-sm text-muted-foreground mb-1">of {event.capacity}</span>
            </div>
            <div className="h-2 rounded-full bg-muted/50">
              <motion.div
                className="h-full rounded-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(registrations.capacityUtilization, 100)}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
          </GlassCard>
        </div>

        {/* Leads breakdown */}
        {leadStatusEntries.length > 0 && (
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-medium text-foreground">Leads Breakdown</h2>
            </div>
            <div className="space-y-3">
              {leadStatusEntries.map(([status, count]) => {
                const total = leadStatusEntries.reduce((sum, [, c]) => sum + (c as number), 0);
                const pct = total > 0 ? Math.round(((count as number) / total) * 100) : 0;
                return (
                  <div key={status} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-24">{status}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted/50">
                      <motion.div
                        className="h-full rounded-full gold-gradient-bg"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground w-8 text-right">{count as number}</span>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        )}
      </div>
    </OrganizerLayout>
  );
};

export default AnalyticsPage;
