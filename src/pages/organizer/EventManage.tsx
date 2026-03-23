import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { OrganizerLayout } from '@/components/OrganizerLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEventGuests, useCheckInAttendee, useSendBlast } from '@/hooks/useOrganizer';
import { useEvent } from '@/hooks/useEvents';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Search, CheckCircle2, Clock, X, Mail, Send, Users, BarChart3,
} from 'lucide-react';

const EventManagePage = () => {
  const { id } = useParams<{ id: string }>();
  const [search, setSearch] = useState('');
  const [blastOpen, setBlastOpen] = useState(false);
  const [blastForm, setBlastForm] = useState({ subject: '', body: '', audience: 'all' as 'all' | 'registered' | 'waitlist' });

  const { data: event } = useEvent(id!);
  const { data: guestsData, isLoading } = useEventGuests(id!, { search: search || undefined });
  const checkInMutation = useCheckInAttendee(id!);
  const blastMutation = useSendBlast(id!);

  const guests = guestsData?.guests ?? [];
  const checkedInCount = guests.filter((g) => g.checkedIn).length;

  return (
    <OrganizerLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4 flex-wrap">
          <Button variant="gold-ghost" size="sm" asChild>
            <Link to="/organizer/dashboard"><ArrowLeft className="w-4 h-4 mr-1" /> Dashboard</Link>
          </Button>
          <h1 className="font-display text-2xl font-semibold text-foreground flex-1">{event?.title ?? 'Event'}</h1>
          <div className="flex gap-2">
            <Button variant="gold-ghost" size="sm" asChild>
              <Link to={`/organizer/events/${id}/analytics`}>
                <BarChart3 className="w-3.5 h-3.5 mr-1.5" /> Analytics
              </Link>
            </Button>
            <Button variant="gold-ghost" size="sm" asChild>
              <Link to={`/organizer/events/${id}/checkin`}>
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Check In
              </Link>
            </Button>
            <Button variant="gold" size="sm" onClick={() => setBlastOpen(true)}>
              <Mail className="w-3.5 h-3.5 mr-1.5" /> Send Blast
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total', value: guests.length, icon: Users },
            { label: 'Checked In', value: checkedInCount, icon: CheckCircle2 },
            { label: 'Capacity', value: event?.capacity ?? 0, icon: Clock },
          ].map(({ label, value, icon: Icon }) => (
            <GlassCard key={label} padding="md" className="text-center">
              <Icon className="w-4 h-4 text-muted-foreground mx-auto mb-2" />
              <p className="font-display text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </GlassCard>
          ))}
        </div>

        {/* Guest list */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-display text-lg font-semibold text-foreground flex-1">Guest List</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search guests..." className="pl-9 h-8 text-sm w-44" />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-muted/50 rounded-xl animate-pulse" />)}
            </div>
          ) : guests.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No guests yet.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {guests.map((g) => {
                const name = g.profile ? `${g.profile.firstName} ${g.profile.lastName}` : g.email;
                return (
                  <div key={g.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/40 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-foreground flex-shrink-0">
                      {name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {g.profile?.company ?? g.email}
                      </p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                      g.checkedIn ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
                      g.status === 'WAITLISTED' ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' :
                      'border-border text-muted-foreground'
                    }`}>
                      {g.checkedIn ? 'Checked In' : g.status}
                    </span>
                    {!g.checkedIn && g.status === 'REGISTERED' && (
                      <Button
                        variant="gold-ghost"
                        size="sm"
                        className="text-xs h-7 px-2"
                        onClick={() => checkInMutation.mutate(g.userId)}
                        disabled={checkInMutation.isPending}
                      >
                        Check In
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>
      </div>

      {/* Blast Modal */}
      <AnimatePresence>
        {blastOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setBlastOpen(false)}
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }} className="w-full max-w-md">
              <GlassCard className="relative">
                <button onClick={() => setBlastOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
                <Mail className="w-7 h-7 text-primary mb-3" />
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">Send Email Blast</h2>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Audience</label>
                    <div className="flex gap-2">
                      {(['all', 'registered', 'waitlist'] as const).map((a) => (
                        <button
                          key={a}
                          onClick={() => setBlastForm((f) => ({ ...f, audience: a }))}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                            blastForm.audience === a ? 'gold-gradient-bg text-primary-foreground border-transparent' : 'border-border text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {a.charAt(0).toUpperCase() + a.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Subject</label>
                    <Input value={blastForm.subject} onChange={(e) => setBlastForm((f) => ({ ...f, subject: e.target.value }))} placeholder="Email subject" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Message</label>
                    <textarea
                      value={blastForm.body}
                      onChange={(e) => setBlastForm((f) => ({ ...f, body: e.target.value }))}
                      rows={4}
                      placeholder="Your message..."
                      className="w-full px-3 py-2 text-sm bg-muted/30 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    />
                  </div>
                  <Button
                    variant="gold"
                    className="w-full"
                    disabled={!blastForm.subject || !blastForm.body || blastMutation.isPending}
                    onClick={async () => {
                      await blastMutation.mutateAsync(blastForm);
                      setBlastOpen(false);
                    }}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {blastMutation.isPending ? 'Sending...' : 'Send Blast'}
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </OrganizerLayout>
  );
};

export default EventManagePage;
