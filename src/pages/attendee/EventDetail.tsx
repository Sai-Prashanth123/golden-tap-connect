import { useEffect, useRef } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { useParams, Link } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { useEvent, useRegisterForEvent, useCancelRegistration } from '@/hooks/useEvents';
import { injectThemeVars, getTheme } from '@/lib/eventThemes';
import {
  Calendar, MapPin, Users, Tag, ArrowLeft, Globe, ExternalLink,
  CheckCircle2, Clock, Share2,
} from 'lucide-react';

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const user = useAppStore((s) => s.user);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: event, isLoading } = useEvent(id!);
  const registerMutation = useRegisterForEvent();
  const cancelMutation = useCancelRegistration();

  const theme = getTheme(event?.theme);

  useEffect(() => {
    if (containerRef.current && event) {
      injectThemeVars(containerRef.current, event.theme);
    }
  }, [event]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-4 animate-pulse pb-20">
          <div className="h-48 rounded-2xl bg-muted/50" />
          <div className="h-8 w-2/3 rounded bg-muted/50" />
          <div className="h-4 w-1/3 rounded bg-muted/50" />
        </div>
      </AppLayout>
    );
  }

  if (!event) {
    return (
      <AppLayout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Event not found.</p>
          <Button variant="gold-ghost" className="mt-4" asChild>
            <Link to="/events">← Back to Events</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  const isRegistered = event.registrationStatus === 'REGISTERED' || event.registrationStatus === 'ATTENDED';
  const isWaitlisted = event.registrationStatus === 'WAITLISTED';
  const isFull = (event.registeredCount ?? 0) >= event.capacity;
  const price = event.ticketPrice ? `₹${Number(event.ticketPrice).toLocaleString('en-IN')}` : 'Free';
  const spotsLeft = event.capacity - (event.registeredCount ?? 0);
  const organizerName = event.organizer?.profile
    ? `${event.organizer.profile.firstName} ${event.organizer.profile.lastName}`
    : event.organizer?.email ?? 'Organizer';

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: event.title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <AppLayout>
      <div ref={containerRef} className="pb-20">
        <Button variant="gold-ghost" size="sm" className="mb-4" asChild>
          <Link to="/events"><ArrowLeft className="w-4 h-4 mr-1" /> Events</Link>
        </Button>

        {/* Banner */}
        <div
          className="w-full h-48 md:h-64 rounded-2xl mb-6 relative overflow-hidden flex items-end"
          style={{ background: event.coverImage ? `url(${event.coverImage}) center/cover no-repeat` : theme.bannerGradient }}
        >
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
          <div className="relative z-10 p-6">
            {event.category && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium border border-white/30 bg-white/10 text-white mb-2 inline-block">
                {event.category}
              </span>
            )}
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">{event.title}</h1>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: Content */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">
                      {new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      {' – '}
                      {new Date(event.endDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {event.locationType !== 'VIRTUAL' && (event.address || event.city) && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">{event.address || event.city}</p>
                      {event.city && event.address && (
                        <p className="text-xs text-muted-foreground">{event.city}{event.country ? `, ${event.country}` : ''}</p>
                      )}
                    </div>
                  </div>
                )}

                {event.locationType !== 'IN_PERSON' && event.meetingUrl && (
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="w-4 h-4 text-primary flex-shrink-0" />
                    <a href={event.meetingUrl} target="_blank" rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1">
                      Join Online <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-3 text-sm pt-2 border-t border-border">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground text-xs font-semibold flex-shrink-0">
                    {organizerName[0]}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Hosted by</p>
                    <p className="font-medium text-foreground">{organizerName}</p>
                    {event.organizer?.profile?.company && (
                      <p className="text-xs text-muted-foreground">{event.organizer.profile.company}</p>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">About</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </GlassCard>

            {event.tags.length > 0 && (
              <GlassCard>
                <h2 className="font-display text-lg font-semibold text-foreground mb-3">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs border border-border text-muted-foreground bg-muted/30">
                      #{tag}
                    </span>
                  ))}
                </div>
              </GlassCard>
            )}
          </div>

          {/* RIGHT: Sticky registration */}
          <div>
            <div className="lg:sticky lg:top-6 space-y-4">
              <GlassCard>
                <div className="text-center mb-4">
                  <p className="font-display text-3xl font-bold text-foreground mb-0.5">{price}</p>
                  <p className="text-xs text-muted-foreground">per person</p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" /> Registered
                    </span>
                    <span className="font-medium text-foreground">{event.registeredCount ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" /> Capacity
                    </span>
                    <span className="font-medium text-foreground">{event.capacity}</span>
                  </div>
                  {spotsLeft > 0 && !isFull && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Spots left</span>
                      <span className="font-medium text-emerald-400">{spotsLeft}</span>
                    </div>
                  )}
                </div>

                <div className="h-1.5 rounded-full bg-muted/50 mb-4">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, ((event.registeredCount ?? 0) / event.capacity) * 100)}%`,
                      background: theme.gradient,
                    }}
                  />
                </div>

                {isRegistered ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-medium text-emerald-400">You're registered!</span>
                    </div>
                    <Button
                      variant="gold-ghost"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => cancelMutation.mutate(event.id)}
                      disabled={cancelMutation.isPending}
                    >
                      Cancel Registration
                    </Button>
                  </div>
                ) : isWaitlisted ? (
                  <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-medium text-amber-400">You're on the waitlist</span>
                  </div>
                ) : event.status !== 'PUBLISHED' ? (
                  <Button className="w-full" disabled>Event Unavailable</Button>
                ) : isFull && !event.waitlistEnabled ? (
                  <Button className="w-full" disabled>Event Full</Button>
                ) : (
                  <Button
                    variant="gold"
                    className="w-full"
                    size="lg"
                    onClick={() => registerMutation.mutate(event.id)}
                    disabled={registerMutation.isPending}
                    style={{ background: theme.gradient }}
                  >
                    {registerMutation.isPending ? 'Registering...' : isFull ? 'Join Waitlist' : 'Register Now'}
                  </Button>
                )}

                <Button variant="gold-ghost" size="sm" className="w-full mt-2" onClick={handleShare}>
                  <Share2 className="w-3.5 h-3.5 mr-1.5" /> Share Event
                </Button>
              </GlassCard>

              {event.locationType !== 'VIRTUAL' && event.city && (
                <GlassCard>
                  <h3 className="text-sm font-medium text-foreground mb-2">Location</h3>
                  <p className="text-sm text-muted-foreground">
                    {[event.address, event.city, event.country].filter(Boolean).join(', ')}
                  </p>
                </GlassCard>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default EventDetailPage;
