import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { OrganizerLayout } from '@/components/OrganizerLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEventGuests, useCheckInAttendee } from '@/hooks/useOrganizer';
import { useEvent } from '@/hooks/useEvents';
import { ArrowLeft, CheckCircle2, Search, QrCode, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CheckInPage = () => {
  const { id } = useParams<{ id: string }>();
  const [search, setSearch] = useState('');
  const [lastCheckedIn, setLastCheckedIn] = useState<string | null>(null);

  const { data: event } = useEvent(id!);
  const { data: guestsData, isLoading } = useEventGuests(id!, { search: search || undefined });
  const checkInMutation = useCheckInAttendee(id!);

  const guests = guestsData?.guests ?? [];
  const notCheckedIn = guests.filter((g) => !g.checkedIn && g.status !== 'CANCELLED');
  const checkedIn = guests.filter((g) => g.checkedIn);

  const handleCheckIn = async (userId: string, name: string) => {
    await checkInMutation.mutateAsync(userId);
    setLastCheckedIn(name);
    setTimeout(() => setLastCheckedIn(null), 3000);
  };

  return (
    <OrganizerLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="gold-ghost" size="sm" asChild>
            <Link to={`/organizer/events/${id}/manage`}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Link>
          </Button>
          <div>
            <h1 className="font-display text-2xl font-semibold text-foreground">Check In</h1>
            <p className="text-sm text-muted-foreground">{event?.title}</p>
          </div>
        </div>

        {/* Live success toast */}
        <AnimatePresence>
          {lastCheckedIn && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <p className="text-sm font-medium text-emerald-400"><strong>{lastCheckedIn}</strong> checked in!</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total', value: guests.length, icon: Users },
            { label: 'Checked In', value: checkedIn.length, icon: CheckCircle2 },
            { label: 'Remaining', value: notCheckedIn.length, icon: QrCode },
          ].map(({ label, value, icon: Icon }) => (
            <GlassCard key={label} padding="md" className="text-center">
              <Icon className="w-4 h-4 text-muted-foreground mx-auto mb-2" />
              <p className="font-display text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </GlassCard>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-10"
            autoFocus
          />
        </div>

        {/* Guest list */}
        <GlassCard>
          <h2 className="text-sm font-medium text-foreground mb-3">Awaiting Check-in ({notCheckedIn.length})</h2>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-muted/50 rounded-xl animate-pulse" />)}
            </div>
          ) : notCheckedIn.length === 0 && !search ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-400/60 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Everyone is checked in!</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notCheckedIn.map((g) => {
                const name = g.profile ? `${g.profile.firstName} ${g.profile.lastName}` : g.email;
                return (
                  <div key={g.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/40 transition-colors">
                    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-sm font-semibold text-foreground flex-shrink-0">
                      {name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {g.profile?.company ?? g.email}
                      </p>
                    </div>
                    <Button
                      variant="gold"
                      size="sm"
                      className="flex-shrink-0"
                      onClick={() => handleCheckIn(g.userId, name)}
                      disabled={checkInMutation.isPending}
                    >
                      Check In
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {checkedIn.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Checked In ({checkedIn.length})
              </h3>
              <div className="space-y-1">
                {checkedIn.map((g) => {
                  const name = g.profile ? `${g.profile.firstName} ${g.profile.lastName}` : g.email;
                  return (
                    <div key={g.id} className="flex items-center gap-3 px-3 py-2 rounded-xl opacity-60">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{name}</p>
                      {g.checkedInAt && (
                        <span className="text-[10px] text-muted-foreground/60 ml-auto">
                          {new Date(g.checkedInAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </OrganizerLayout>
  );
};

export default CheckInPage;
