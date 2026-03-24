import { useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { getAccessToken } from '@/services/api';
import { useEvent, useRegisterForEvent, useCancelRegistration, useMyRegistrations } from '@/hooks/useEvents';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { injectThemeVars } from '@/lib/eventThemes';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  Calendar, MapPin, Globe, ExternalLink, Users, CheckCircle2,
  Clock, Share2, Tag, ArrowUpRight, QrCode,
} from 'lucide-react';

const PublicEventPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated, logout } = useAppStore();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: event, isLoading } = useEvent(id!);
  const { data: myRegsData } = useMyRegistrations();
  const registerMutation = useRegisterForEvent();
  const cancelMutation   = useCancelRegistration();

  // Find the registration record for this event (for QR)
  const myRegistration = (myRegsData?.registrations ?? []).find((r) => r.eventId === id);

  useEffect(() => {
    if (containerRef.current && event) {
      injectThemeVars(containerRef.current, event.theme);
    }
  }, [event]);

  const handleRegister = () => {
    // Detect stale auth: Zustand says authenticated but no JWT in localStorage
    if (isAuthenticated && !getAccessToken()) {
      logout();
      navigate('/login', { state: { from: { pathname: `/e/${id}` } } });
      return;
    }
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/e/${id}` } } });
      return;
    }
    if (user?.role !== 'attendee') {
      toast.error('Please sign in as an Attendee to register for events');
      return;
    }
    registerMutation.mutate(event!.id);
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: event?.title ?? 'Event', url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => toast.success('Link copied!'));
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <PublicNav />
        <main className="max-w-5xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 animate-pulse">
            <div className="md:col-span-2 space-y-4">
              <div className="aspect-square rounded-2xl bg-muted/40" />
              <div className="h-4 bg-muted/40 rounded w-2/3" />
              <div className="h-4 bg-muted/40 rounded w-1/2" />
            </div>
            <div className="md:col-span-3 space-y-4">
              <div className="h-10 bg-muted/40 rounded w-3/4" />
              <div className="h-4 bg-muted/40 rounded w-1/2" />
              <div className="h-4 bg-muted/40 rounded w-1/3" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <PublicNav />
        <main className="max-w-5xl mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground text-lg mb-4">This event could not be found.</p>
          <Button variant="gold" asChild>
            <Link to="/login">Browse Events</Link>
          </Button>
        </main>
      </div>
    );
  }

  // ── Derived state ──────────────────────────────────────────────────────────

  const startDate    = new Date(event.startDate);
  const endDate      = new Date(event.endDate);
  const isPast       = endDate < new Date();
  const isFull       = (event.registeredCount ?? 0) >= event.capacity;
  const spotsLeft    = event.capacity - (event.registeredCount ?? 0);
  const price        = event.ticketPrice && Number(event.ticketPrice) > 0
    ? `₹${Number(event.ticketPrice).toLocaleString('en-IN')}`
    : 'Free';
  const isRegistered =
    event.registrationStatus === 'REGISTERED' || event.registrationStatus === 'ATTENDED' ||
    (event.registrationStatus == null && (myRegistration?.status === 'REGISTERED' || myRegistration?.status === 'ATTENDED'));
  const isWaitlisted =
    event.registrationStatus === 'WAITLISTED' ||
    (event.registrationStatus == null && myRegistration?.status === 'WAITLISTED');

  const qrValue = myRegistration?.id
    ? `founderkey://registration/${myRegistration.id}`
    : `founderkey://event/${event.id}/user/${user?.id}`;

  const organizerName = event.organizer?.profile
    ? `${event.organizer.profile.firstName} ${event.organizer.profile.lastName}`.trim()
    : event.organizer?.email ?? 'Organizer';
  const organizerAvatar  = event.organizer?.profile?.avatar;
  const organizerCompany = event.organizer?.profile?.company;

  const monthLabel = startDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const dayLabel   = startDate.getDate();

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background" ref={containerRef}>
      <PublicNav isAuthenticated={isAuthenticated} userRole={user?.role} />

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">

          {/* ── LEFT column: image + hosted by ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="md:col-span-2 space-y-6"
          >
            {/* Cover image */}
            <div className="aspect-square rounded-2xl overflow-hidden border border-border/50">
              {event.coverImage ? (
                <img
                  src={event.coverImage}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #d4a847 0%, #f5c842 50%, #a07830 100%)' }}
                >
                  <span className="text-5xl font-display font-bold text-black/30">
                    {event.title[0]?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Hosted By */}
            <GlassCard padding="md">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Hosted By</p>
              <div className="flex items-center gap-3">
                {organizerAvatar ? (
                  <img src={organizerAvatar} alt={organizerName}
                    className="w-10 h-10 rounded-full object-cover border border-border/50" />
                ) : (
                  <div className="w-10 h-10 rounded-full gold-gradient-bg flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0">
                    {organizerName[0]?.toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{organizerName}</p>
                  {organizerCompany && (
                    <p className="text-xs text-muted-foreground truncate">{organizerCompany}</p>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* ── RIGHT column: details + registration ───────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="md:col-span-3 space-y-5"
          >
            {/* Title + category */}
            <div>
              {event.category && (
                <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-primary/30 text-primary bg-primary/5 mb-2 inline-block">
                  {event.category}
                </span>
              )}
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight">
                {event.title}
              </h1>
            </div>

            {/* Date / time */}
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 rounded-xl border border-border overflow-hidden text-center">
                <div className="bg-primary/10 text-primary text-[10px] font-bold uppercase py-0.5">{monthLabel}</div>
                <div className="text-foreground font-display text-xl font-bold py-1">{dayLabel}</div>
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {startDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  {' – '}
                  {endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  {event.timezone && event.timezone !== 'UTC' ? ` (${event.timezone})` : ''}
                </p>
              </div>
            </div>

            {/* Location */}
            {event.locationType !== 'VIRTUAL' && (event.address || event.city) ? (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{event.address || event.city}</p>
                  {event.address && event.city && (
                    <p className="text-xs text-muted-foreground">{[event.city, event.country].filter(Boolean).join(', ')}</p>
                  )}
                </div>
              </div>
            ) : event.locationType !== 'IN_PERSON' ? (
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-primary flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  {isRegistered && event.meetingUrl ? (
                    <a href={event.meetingUrl} target="_blank" rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1">
                      Join Online <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : 'Online Event — Register to get the link'}
                </p>
              </div>
            ) : null}

            {/* ── Registration box ──────────────────────────────────────────── */}
            <GlassCard>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Registration</span>
                <span className="font-display text-lg font-bold text-foreground">{price}</span>
              </div>

              {/* Capacity bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {event.registeredCount ?? 0} registered</span>
                  <span>{event.capacity} capacity</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted/50">
                  <div
                    className="h-full rounded-full transition-all gold-gradient-bg"
                    style={{ width: `${Math.min(100, ((event.registeredCount ?? 0) / event.capacity) * 100)}%` }}
                  />
                </div>
                {!isFull && spotsLeft <= 20 && spotsLeft > 0 && (
                  <p className="text-xs text-amber-400 mt-1">Only {spotsLeft} spots left!</p>
                )}
              </div>

              {/* Status / action */}
              {isPast ? (
                <div className="flex items-center gap-2 py-3 px-4 rounded-xl bg-muted/30 border border-border">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Past Event</p>
                    <p className="text-xs text-muted-foreground">This event has already ended.</p>
                  </div>
                </div>
              ) : event.status !== 'PUBLISHED' ? (
                <Button className="w-full" size="lg" disabled>Event Unavailable</Button>
              ) : isRegistered ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-400">You're registered!</span>
                  </div>
                  <Button variant="gold-ghost" size="sm" className="w-full text-xs"
                    onClick={() => cancelMutation.mutate(event.id)} disabled={cancelMutation.isPending}>
                    Cancel Registration
                  </Button>
                </div>
              ) : isWaitlisted ? (
                <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium text-amber-400">You're on the waitlist</span>
                </div>
              ) : isFull && !event.waitlistEnabled ? (
                <Button className="w-full" size="lg" disabled>Event Full</Button>
              ) : !isAuthenticated ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground text-center mb-2">
                    Sign in to register for this event
                  </p>
                  <Button variant="gold" className="w-full" size="lg" onClick={handleRegister}>
                    Sign In to Register <ArrowUpRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              ) : user?.role !== 'attendee' ? (
                <div className="text-center py-3">
                  <p className="text-xs text-muted-foreground">Sign in as an Attendee to register for events.</p>
                </div>
              ) : (
                <Button variant="gold" className="w-full" size="lg"
                  onClick={handleRegister} disabled={registerMutation.isPending}>
                  {registerMutation.isPending ? 'Registering…' : isFull ? 'Join Waitlist' : 'Register Now'}
                </Button>
              )}

              <Button variant="gold-ghost" size="sm" className="w-full mt-3" onClick={handleShare}>
                <Share2 className="w-3.5 h-3.5 mr-1.5" /> Share Event
              </Button>
            </GlassCard>

            {/* QR Entry Ticket — shown when registered */}
            {isRegistered && (
              <GlassCard>
                <div className="flex items-center gap-2 mb-4">
                  <QrCode className="w-4 h-4 text-primary" />
                  <h2 className="font-display text-lg font-semibold text-foreground">Your Entry Ticket</h2>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-white p-4 rounded-2xl">
                    <QRCodeSVG
                      value={qrValue}
                      size={160}
                      bgColor="#ffffff"
                      fgColor="#0D0D0D"
                      level="M"
                    />
                  </div>
                  <div className="text-center space-y-1">
                    <div className="flex items-center justify-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm font-semibold">Registered</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{event.title}</p>
                    {myRegistration?.id && (
                      <p className="text-[11px] text-muted-foreground font-mono">
                        ID: {myRegistration.id.slice(0, 8)}…
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground pt-1">
                      Show this QR at the entrance for check-in.
                    </p>
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Description */}
            <GlassCard>
              <h2 className="font-display text-lg font-semibold text-foreground mb-2">About this event</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </GlassCard>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs border border-border text-muted-foreground bg-muted/30">
                    <Tag className="w-3 h-3" /> {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

// ── Minimal public navbar ────────────────────────────────────────────────────

function PublicNav({ isAuthenticated, userRole }: { isAuthenticated?: boolean; userRole?: string }) {
  const dashPath = userRole === 'organizer' ? '/organizer/dashboard'
    : userRole === 'admin' ? '/admin/dashboard'
    : '/dashboard';

  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Button variant="gold-ghost" size="sm" asChild>
              <Link to={dashPath}>Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="gold-ghost" size="sm" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button variant="gold" size="sm" asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default PublicEventPage;
