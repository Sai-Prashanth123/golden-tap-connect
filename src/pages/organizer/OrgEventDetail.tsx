import { useParams, Link } from 'react-router-dom';
import { OrganizerLayout } from '@/components/OrganizerLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { useEvent } from '@/hooks/useEvents';
import { useEventGuests, usePublishEvent, useDeleteEvent } from '@/hooks/useOrganizer';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Calendar, MapPin, Video, Users, BarChart3, CheckCircle2,
  Clock, Tag, Globe, Pencil, Trash2, Send, Crown, Copy, Share2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const OrgEventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: event, isLoading: eventLoading } = useEvent(id!);
  const { data: guestsData, isLoading: guestsLoading } = useEventGuests(id!);
  const publishMutation = usePublishEvent();
  const deleteMutation  = useDeleteEvent();

  const guests       = guestsData?.guests ?? [];
  const checkedIn    = guests.filter((g) => g.checkedIn).length;
  const waitlisted   = guests.filter((g) => g.status === 'WAITLISTED').length;

  const handleShare = () => {
    const link = `${window.location.origin}/e/${id}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.success('Event link copied to clipboard!');
    }).catch(() => {
      prompt('Copy this link to share the event:', link);
    });
  };

  const handlePublish = async () => {
    if (!id) return;
    await publishMutation.mutateAsync(id);
    toast.success('Event published!');
  };

  const handleDelete = async () => {
    if (!id || !confirm('Delete this event? This cannot be undone.')) return;
    await deleteMutation.mutateAsync(id);
    navigate('/organizer/dashboard');
  };

  if (eventLoading) {
    return (
      <OrganizerLayout>
        <div className="space-y-4 animate-pulse">
          <div className="h-48 bg-muted/40 rounded-2xl" />
          <div className="h-8 bg-muted/40 rounded w-1/2" />
          <div className="h-4 bg-muted/40 rounded w-1/3" />
        </div>
      </OrganizerLayout>
    );
  }

  if (!event) {
    return (
      <OrganizerLayout>
        <div className="text-center py-16">
          <p className="text-muted-foreground">Event not found.</p>
          <Button variant="gold" className="mt-4" asChild>
            <Link to="/organizer/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </OrganizerLayout>
    );
  }

  const startDate = new Date(event.startDate);
  const endDate   = new Date(event.endDate);
  const isPast    = endDate < new Date();

  return (
    <OrganizerLayout>
      <div className="space-y-6 pb-10 max-w-4xl mx-auto">

        {/* Back + Actions row */}
        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="gold-ghost" size="sm" asChild>
            <Link to="/organizer/dashboard"><ArrowLeft className="w-4 h-4 mr-1" /> Dashboard</Link>
          </Button>
          <div className="flex-1" />
          <Button variant="gold-ghost" size="sm" onClick={handleShare}>
            <Share2 className="w-3.5 h-3.5 mr-1.5" /> Share
          </Button>
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
          <Button variant="gold-ghost" size="sm" asChild>
            <Link to={`/organizer/events/${id}/manage`}>
              <Pencil className="w-3.5 h-3.5 mr-1.5" /> Manage
            </Link>
          </Button>
          {event.status === 'DRAFT' && (
            <Button variant="gold" size="sm" onClick={handlePublish} disabled={publishMutation.isPending}>
              <Send className="w-3.5 h-3.5 mr-1.5" />
              {publishMutation.isPending ? 'Publishing…' : 'Publish'}
            </Button>
          )}
        </div>

        {/* Cover Image */}
        {event.coverImage && (
          <div className="w-full h-52 rounded-2xl overflow-hidden">
            <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Title + Status */}
        <div className="flex items-start gap-3 flex-wrap">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium border ${
                event.status === 'PUBLISHED'  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
                event.status === 'DRAFT'      ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' :
                event.status === 'CANCELLED'  ? 'border-red-500/30 bg-red-500/10 text-red-400' :
                'border-border text-muted-foreground'
              }`}>{event.status}</span>
              {event.category && (
                <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-border text-muted-foreground">
                  {event.category}
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl font-semibold text-foreground">{event.title}</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Registered',  value: guests.length,        icon: Users },
            { label: 'Checked In',  value: checkedIn,            icon: CheckCircle2 },
            { label: 'Waitlisted',  value: waitlisted,           icon: Clock },
            { label: 'Capacity',    value: event.capacity ?? 0,  icon: Users },
          ].map(({ label, value, icon: Icon }) => (
            <GlassCard key={label} padding="md" className="text-center">
              <Icon className="w-4 h-4 text-muted-foreground mx-auto mb-1.5" />
              <p className="font-display text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </GlassCard>
          ))}
        </div>

        {/* Details */}
        <GlassCard>
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Event Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-foreground font-medium">
                  {startDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-muted-foreground text-xs">
                  {startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  {' — '}
                  {endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  {isPast && <span className="ml-2 text-red-400">(Past)</span>}
                </p>
              </div>
            </div>

            {(event.locationType === 'IN_PERSON' || event.locationType === 'HYBRID') && (event.address || event.city) && (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-foreground font-medium">{event.address ?? event.city}</p>
                  {event.city && event.address && (
                    <p className="text-muted-foreground text-xs">{[event.city, event.country].filter(Boolean).join(', ')}</p>
                  )}
                </div>
              </div>
            )}

            {(event.locationType === 'VIRTUAL' || event.locationType === 'HYBRID') && event.meetingUrl && (
              <div className="flex items-start gap-3">
                <Video className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <a href={event.meetingUrl} target="_blank" rel="noopener noreferrer"
                  className="text-primary hover:underline truncate">{event.meetingUrl}</a>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-muted-foreground capitalize">{event.locationType?.toLowerCase().replace('_', ' ')}</span>
              <span className="text-border">·</span>
              <span className="text-muted-foreground capitalize">{event.visibility?.toLowerCase()}</span>
            </div>

            {event.ticketPrice && Number(event.ticketPrice) > 0 && (
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-foreground font-medium">₹{Number(event.ticketPrice).toLocaleString()}</span>
              </div>
            )}

            {event.tags && event.tags.length > 0 && (
              <div className="flex items-start gap-3">
                <Tag className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex flex-wrap gap-1.5">
                  {event.tags.map((tag) => (
                    <span key={tag} className="gold-pill text-[11px]">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Shareable link */}
            <div className="pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-2">Attendee registration link</p>
              <div className="flex items-center gap-2 bg-muted/30 rounded-xl px-3 py-2">
                <span className="text-xs text-muted-foreground flex-1 truncate">
                  {window.location.origin}/e/{id}
                </span>
                <button
                  onClick={handleShare}
                  className="text-primary hover:text-primary/80 transition-colors flex-shrink-0"
                  title="Copy link"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5">
                Share this link with attendees so they can view and register for the event.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Description */}
        <GlassCard>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">Description</h2>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{event.description}</p>
        </GlassCard>

        {/* Attendees */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-foreground">Attendees</h2>
            <Button variant="gold-ghost" size="sm" asChild>
              <Link to={`/organizer/events/${id}/manage`}>View All</Link>
            </Button>
          </div>

          {guestsLoading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-muted/50 rounded-xl animate-pulse" />)}
            </div>
          ) : guests.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No registrations yet.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {guests.slice(0, 8).map((g, i) => {
                const name = g.profile
                  ? `${g.profile.firstName} ${g.profile.lastName}`.trim()
                  : g.email;
                return (
                  <motion.div
                    key={g.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/40 transition-colors"
                  >
                    {g.profile?.avatar ? (
                      <img src={g.profile.avatar} alt={name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-foreground flex-shrink-0">
                        {name[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{g.profile?.company ?? g.email}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                      g.checkedIn                   ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
                      g.status === 'WAITLISTED'     ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' :
                      'border-border text-muted-foreground'
                    }`}>
                      {g.checkedIn ? 'Checked In' : g.status}
                    </span>
                  </motion.div>
                );
              })}
              {guests.length > 8 && (
                <p className="text-xs text-muted-foreground text-center pt-2">
                  +{guests.length - 8} more ·{' '}
                  <Link to={`/organizer/events/${id}/manage`} className="text-primary hover:underline">View all</Link>
                </p>
              )}
            </div>
          )}
        </GlassCard>

      </div>
    </OrganizerLayout>
  );
};

export default OrgEventDetail;
