import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { useEvents, useRegisterForEvent, useMyRegistrations } from '@/hooks/useEvents';
import { getTheme } from '@/lib/eventThemes';
import { QRCodeSVG } from 'qrcode.react';
import type { Event } from '@/services/events.service';
import {
  Calendar, Users, MapPin, CheckCircle2, X,
  Clock, Tag, Ticket, Search,
} from 'lucide-react';

const CATEGORIES = ['All', 'Tech', 'Business', 'Design', 'Health', 'Social', 'Arts', 'Sports', 'Food', 'Startup', 'AI'];

const EventsPage = () => {
  const user = useAppStore((s) => s.user);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [registerModal, setRegisterModal] = useState<Event | null>(null);
  const [regStep, setRegStep] = useState<'confirm' | 'success'>('confirm');
  const [registrationId, setRegistrationId] = useState<string | null>(null);

  const { data, isLoading } = useEvents({
    q: search || undefined,
    category: category !== 'All' ? category : undefined,
    status: 'PUBLISHED',
    limit: 50,
  });

  const { data: myRegsData } = useMyRegistrations();

  const registerMutation = useRegisterForEvent();
  const events = data?.events ?? [];

  // Build a set of registered event IDs from the user's registrations
  const registeredEventIds = new Set(
    (myRegsData?.registrations ?? [])
      .filter((r) => r.status === 'REGISTERED' || r.status === 'ATTENDED' || r.status === 'WAITLISTED')
      .map((r) => r.eventId)
  );
  const waitlistedEventIds = new Set(
    (myRegsData?.registrations ?? [])
      .filter((r) => r.status === 'WAITLISTED')
      .map((r) => r.eventId)
  );

  const handleRegister = async () => {
    if (!registerModal) return;
    const res = await registerMutation.mutateAsync(registerModal.id);
    const regId = (res as { data?: { registration?: { id?: string } } })?.data?.registration?.id ?? null;
    setRegistrationId(regId);
    setRegStep('success');
  };

  const openModal = (e: Event) => { setRegisterModal(e); setRegStep('confirm'); setRegistrationId(null); };
  const closeModal = () => setRegisterModal(null);

  const qrValue = registrationId
    ? `founderkey://registration/${registrationId}`
    : `founderkey://event/${registerModal?.id}/user/${user?.id}`;

  return (
    <AppLayout>
      <div className="space-y-6 pb-24 md:pb-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="font-display text-3xl font-semibold text-foreground">Events</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events..."
                className="pl-9 h-8 text-sm w-48"
              />
            </div>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                category === cat
                  ? 'gold-gradient-bg text-primary-foreground'
                  : 'glass-card text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <GlassCard key={i} className="h-48 animate-pulse">
                <div className="h-4 bg-muted/50 rounded w-1/3 mb-3" />
                <div className="h-6 bg-muted/50 rounded w-2/3 mb-2" />
                <div className="h-3 bg-muted/50 rounded w-1/2" />
              </GlassCard>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">No events found.</p>
            {search || category !== 'All' ? (
              <Button variant="gold-ghost" size="sm" className="mt-3"
                onClick={() => { setSearch(''); setCategory('All'); }}>
                Clear filters
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((e, i) => {
              const theme = getTheme(e.theme);
              // Prefer backend registrationStatus, fall back to local registration data
              const isRegistered =
                e.registrationStatus === 'REGISTERED' || e.registrationStatus === 'ATTENDED' ||
                (e.registrationStatus == null && registeredEventIds.has(e.id) && !waitlistedEventIds.has(e.id));
              const isWaitlisted =
                e.registrationStatus === 'WAITLISTED' ||
                (e.registrationStatus == null && waitlistedEventIds.has(e.id));
              const price = e.ticketPrice ? `₹${Number(e.ticketPrice).toLocaleString('en-IN')}` : 'Free';
              const isFull = e.registeredCount !== undefined && e.registeredCount >= e.capacity;

              return (
                <motion.div key={e.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <GlassCard hover className="h-full flex flex-col overflow-hidden p-0">
                    {/* Theme banner */}
                    <div className="h-2 w-full" style={{ background: theme.gradient }} />
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {e.category && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium border border-border text-muted-foreground">
                                {e.category}
                              </span>
                            )}
                            {isRegistered && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Registered
                              </span>
                            )}
                            {isWaitlisted && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium border border-amber-500/30 bg-amber-500/10 text-amber-400">
                                Waitlisted
                              </span>
                            )}
                          </div>
                          <h3 className="font-display text-lg font-semibold text-foreground leading-tight">{e.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3 flex-shrink-0" />
                            {new Date(e.startDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {(e.city || e.address) && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              {e.locationType === 'VIRTUAL' ? 'Online' : (e.city || e.address)}
                            </p>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed mb-3 flex-1 line-clamp-2">
                        {e.description}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Users className="w-3 h-3" /> {e.registeredCount ?? 0}/{e.capacity}
                          </span>
                          <span className="text-xs font-medium text-primary flex items-center gap-1">
                            <Tag className="w-3 h-3" /> {price}
                          </span>
                        </div>
                        {isRegistered ? (
                          <Button variant="gold-ghost" size="sm" asChild>
                            <Link to={`/event/${e.id}`}>View Ticket</Link>
                          </Button>
                        ) : isWaitlisted ? (
                          <Button variant="ghost" size="sm" disabled>
                            <Clock className="w-3 h-3 mr-1" /> Waitlisted
                          </Button>
                        ) : (
                          <Button
                            variant="gold"
                            size="sm"
                            disabled={isFull && !e.waitlistEnabled}
                            onClick={() => openModal(e)}
                          >
                            <Ticket className="w-3 h-3 mr-1" />
                            {isFull ? (e.waitlistEnabled ? 'Waitlist' : 'Full') : 'Register'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {registerModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && !registerMutation.isPending && closeModal()}
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-md">
              <GlassCard className="relative">
                {!registerMutation.isPending && (
                  <button onClick={closeModal} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                    <X className="w-5 h-5" />
                  </button>
                )}

                <AnimatePresence mode="wait">
                  {regStep === 'confirm' && (
                    <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Ticket className="w-8 h-8 text-primary mb-4" />
                      <h2 className="font-display text-2xl font-semibold text-foreground mb-1">Register for Event</h2>
                      <p className="text-muted-foreground text-sm mb-5">{registerModal.title}</p>
                      <div className="space-y-2 mb-6">
                        {[
                          { icon: Calendar, text: new Date(registerModal.startDate).toLocaleString() },
                          { icon: MapPin, text: registerModal.locationType === 'VIRTUAL' ? 'Online' : (registerModal.city || registerModal.address || 'Venue TBD') },
                          { icon: Tag, text: `Price: ${registerModal.ticketPrice ? `₹${Number(registerModal.ticketPrice).toLocaleString('en-IN')}` : 'Free'}` },
                          { icon: Users, text: `${registerModal.registeredCount ?? 0} of ${registerModal.capacity} registered` },
                        ].map(({ icon: Icon, text }, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                            {text}
                          </div>
                        ))}
                      </div>
                      <Button variant="gold" className="w-full" size="lg" onClick={handleRegister} disabled={registerMutation.isPending}>
                        {registerMutation.isPending ? (
                          <span className="flex items-center gap-2">
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                              className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                            Processing...
                          </span>
                        ) : 'Confirm Registration'}
                      </Button>
                    </motion.div>
                  )}

                  {regStep === 'success' && (
                    <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                        className="w-16 h-16 rounded-full gold-gradient-bg flex items-center justify-center mx-auto mb-4 gold-glow">
                        <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
                      </motion.div>
                      <h2 className="font-display text-2xl font-semibold text-foreground mb-1">You're registered!</h2>
                      <p className="text-sm text-muted-foreground mb-4">Show your QR code at the gate.</p>
                      <div className="bg-white p-4 rounded-2xl inline-block mb-5">
                        <QRCodeSVG
                          value={qrValue}
                          size={140}
                          bgColor="#ffffff"
                          fgColor="#0D0D0D"
                          level="M"
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground mb-5">
                        Registration ID: {registrationId ?? 'saved'}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="gold-ghost" className="flex-1" onClick={closeModal}>Close</Button>
                        <Button variant="gold" className="flex-1" asChild>
                          <Link to={`/event/${registerModal.id}`}>View Ticket</Link>
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

export default EventsPage;
