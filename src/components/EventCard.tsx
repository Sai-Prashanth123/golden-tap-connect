import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users } from 'lucide-react';
import { getTheme } from '@/lib/eventThemes';
import type { Event } from '@/services/events.service';

interface EventCardProps {
  event: Event;
  /** Show a "Registered" badge if the user is already registered */
  registered?: boolean;
  /** Show a "Waitlisted" badge */
  waitlisted?: boolean;
  index?: number;
}

export const EventCard = ({ event, registered, waitlisted, index = 0 }: EventCardProps) => {
  const theme = getTheme(event.theme ?? 'default');

  const dateStr = event.startDate
    ? new Date(event.startDate).toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric',
      })
    : 'Date TBD';

  const timeStr = event.startDate
    ? new Date(event.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : '';

  const registeredCount = event.registeredCount ?? 0;
  const spotsLeft = event.capacity != null ? event.capacity - registeredCount : null;
  const locationStr = [event.address, event.city, event.country].filter(Boolean).join(', ') || (event.locationType === 'VIRTUAL' ? 'Online' : null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      <Link to={`/event/${event.id}`} className="block group">
        <div className="glass-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">

          {/* Theme banner / cover image */}
          <div className="relative h-36 overflow-hidden">
            {event.coverImage ? (
              <img
                src={event.coverImage}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div
                className="w-full h-full"
                style={{ background: theme.bannerGradient }}
              />
            )}

            {/* Status / spots badge */}
            <div className="absolute top-3 left-3 flex gap-2">
              {registered && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
                  Registered
                </span>
              )}
              {waitlisted && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-sm">
                  Waitlisted
                </span>
              )}
              {event.requiresApproval && !registered && !waitlisted && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 backdrop-blur-sm">
                  Approval
                </span>
              )}
            </div>

            {/* Category pill */}
            {event.category && (
              <div className="absolute top-3 right-3">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/40 text-white backdrop-blur-sm">
                  {event.category}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Host row */}
            {event.organizer && (
              <div className="flex items-center gap-2 mb-2.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                  style={{ background: theme.accent }}
                >
                  {(event.organizer.profile?.firstName?.[0] ?? event.organizer.email?.[0] ?? 'O').toUpperCase()}
                </div>
                <span className="text-xs text-muted-foreground truncate">
                  {event.organizer.profile
                    ? `${event.organizer.profile.firstName} ${event.organizer.profile.lastName}`
                    : event.organizer.email}
                </span>
              </div>
            )}

            <h3 className="font-display text-sm font-semibold text-foreground leading-snug mb-2.5 group-hover:text-primary transition-colors line-clamp-2">
              {event.title}
            </h3>

            {/* Date + location */}
            <div className="space-y-1 mb-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3 flex-shrink-0" />
                <span>{dateStr}{timeStr ? ` · ${timeStr}` : ''}</span>
              </div>
              {locationStr && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{locationStr}</span>
                </div>
              )}
            </div>

            {/* Footer: attendees + spots */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="w-3 h-3" />
                <span>{registeredCount} going</span>
              </div>
              {spotsLeft !== null && spotsLeft <= 20 && spotsLeft > 0 && (
                <span className="text-[10px] font-medium text-amber-400">
                  {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left
                </span>
              )}
              {spotsLeft === 0 && (
                <span className="text-[10px] font-medium text-red-400">Sold out</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
