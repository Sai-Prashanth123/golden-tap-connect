import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { QRCodeSVG } from 'qrcode.react';
import {
  Calendar, Users, MapPin, QrCode, ChevronRight, CheckCircle2, X,
  Clock, Tag, Star, Mail, Ticket,
} from 'lucide-react';

const events = [
  { id: '1', name: 'BLR Tech Week 2026', date: 'Today, 10:00 AM', venue: 'Bangalore International Centre', attendees: 420, status: 'live', category: 'Tech', price: 'Free', description: 'The largest annual tech conference in Bangalore, featuring 80+ speakers across AI, climate, and SaaS.' },
  { id: '2', name: 'AI Founders Meetup', date: 'Wed, Mar 18 · 2:00 PM', venue: 'Koramangala Hub', attendees: 85, status: 'upcoming', category: 'AI', price: '₹499', description: 'Intimate meetup for founders building with AI. Pitch, network, and learn.' },
  { id: '3', name: 'Climate Summit', date: 'Fri, Mar 20 · 9:00 AM', venue: 'Convention Center', attendees: 200, status: 'upcoming', category: 'Climate', price: '₹999', description: 'Global climate tech founders converging to solve the world\'s hardest problems.' },
  { id: '4', name: 'SaaS Summit 2026', date: 'Mar 25 · 10:00 AM', venue: 'Hyatt Regency', attendees: 350, status: 'upcoming', category: 'SaaS', price: '₹1,499', description: 'India\'s premier SaaS conference with 350+ founders, investors, and operators.' },
  { id: '5', name: 'YC Demo Day Watch', date: 'Mar 10 · 5:00 PM', venue: 'Online', attendees: 120, status: 'past', category: 'Startup', price: 'Free', description: 'Watch the latest YC batch demo with live commentary and discussion.' },
];

const categoryColors: Record<string, string> = {
  Tech: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  AI: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Climate: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  SaaS: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Startup: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

const EventsPage = () => {
  const { user, registerForEvent } = useAppStore();
  const [registeringFor, setRegisteringFor] = useState<string | null>(null);
  const [registrationStep, setRegistrationStep] = useState<'confirm' | 'processing' | 'success'>('confirm');
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming' | 'past'>('all');

  const registered = user?.registeredEvents || [];

  const openRegistration = (id: string) => {
    setRegisteringFor(id);
    setRegistrationStep('confirm');
  };

  const handleRegister = async () => {
    if (!registeringFor) return;
    setRegistrationStep('processing');
    await new Promise((r) => setTimeout(r, 1500));
    registerForEvent(registeringFor);
    setRegistrationStep('success');
  };

  const filteredEvents = events.filter((e) => filter === 'all' || e.status === filter);

  const event = events.find((e) => e.id === registeringFor);

  return (
    <AppLayout>
      <div className="space-y-6 pb-24 md:pb-8">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-semibold text-foreground">Events</h1>
          <div className="flex gap-1 p-1 glass-card rounded-xl">
            {(['all', 'live', 'upcoming', 'past'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f ? 'gold-gradient-bg text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {(['live', 'upcoming', 'past'] as const).map((status) => {
          const filtered = filteredEvents.filter((e) => e.status === status);
          if (!filtered.length) return null;
          return (
            <div key={status}>
              <div className="flex items-center gap-2 mb-3">
                {status === 'live' && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                  {status === 'live' ? 'Happening Now' : status === 'upcoming' ? 'Upcoming' : 'Past Events'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((e, i) => {
                  const isRegistered = registered.includes(e.id);
                  return (
                    <motion.div
                      key={e.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <GlassCard hover className={`${status === 'live' ? 'gold-border-glow' : ''} h-full flex flex-col`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${categoryColors[e.category] || 'border-border text-muted-foreground'}`}>
                                {e.category}
                              </span>
                              {status === 'live' && (
                                <span className="gold-pill text-[10px] flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live
                                </span>
                              )}
                              {isRegistered && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Registered
                                </span>
                              )}
                            </div>
                            <h3 className="font-display text-lg font-semibold text-foreground leading-tight">{e.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <Calendar className="w-3 h-3 flex-shrink-0" /> {e.date}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3 flex-shrink-0" /> {e.venue}
                            </p>
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed mb-3 flex-1">{e.description}</p>

                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Users className="w-3 h-3" /> {e.attendees}
                            </span>
                            <span className="text-xs font-medium text-primary flex items-center gap-1">
                              <Tag className="w-3 h-3" /> {e.price}
                            </span>
                          </div>
                          {status === 'live' ? (
                            <Button variant="gold" size="sm" asChild>
                              <Link to={`/event/${e.id}`}><QrCode className="w-3 h-3 mr-1" /> Check In</Link>
                            </Button>
                          ) : status === 'upcoming' ? (
                            isRegistered ? (
                              <Button variant="gold-ghost" size="sm" asChild>
                                <Link to={`/event/${e.id}`}>View <ChevronRight className="w-3 h-3 ml-1" /></Link>
                              </Button>
                            ) : (
                              <Button variant="gold" size="sm" onClick={() => openRegistration(e.id)}>
                                <Ticket className="w-3 h-3 mr-1" /> Register
                              </Button>
                            )
                          ) : (
                            <Button variant="gold-ghost" size="sm" asChild>
                              <Link to={`/event/${e.id}`}>View <ChevronRight className="w-3 h-3 ml-1" /></Link>
                            </Button>
                          )}
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {registeringFor && event && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && registrationStep !== 'processing' && setRegisteringFor(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md"
            >
              <GlassCard className="relative">
                {registrationStep !== 'processing' && (
                  <button onClick={() => setRegisteringFor(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                    <X className="w-5 h-5" />
                  </button>
                )}

                <AnimatePresence mode="wait">
                  {registrationStep === 'confirm' && (
                    <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Ticket className="w-8 h-8 text-primary mb-4" />
                      <h2 className="font-display text-2xl font-semibold text-foreground mb-1">Register for Event</h2>
                      <p className="text-muted-foreground text-sm mb-5">{event.name}</p>

                      <div className="space-y-2 mb-6">
                        {[
                          { icon: Calendar, text: event.date },
                          { icon: MapPin, text: event.venue },
                          { icon: Tag, text: `Price: ${event.price}` },
                          { icon: Users, text: `${event.attendees} attendees registered` },
                        ].map(({ icon: Icon, text }, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                            {text}
                          </div>
                        ))}
                      </div>

                      <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 mb-6">
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                          Your event QR code will be sent to <span className="text-foreground font-medium">{user?.email}</span>
                        </p>
                      </div>

                      <Button variant="gold" className="w-full" size="lg" onClick={handleRegister}>
                        Confirm Registration
                      </Button>
                    </motion.div>
                  )}

                  {registrationStep === 'processing' && (
                    <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"
                      />
                      <p className="text-foreground font-medium">Processing registration...</p>
                      <p className="text-xs text-muted-foreground mt-1">Sending confirmation email</p>
                    </motion.div>
                  )}

                  {registrationStep === 'success' && (
                    <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="w-16 h-16 rounded-full gold-gradient-bg flex items-center justify-center mx-auto mb-4 gold-glow"
                      >
                        <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
                      </motion.div>
                      <h2 className="font-display text-2xl font-semibold text-foreground mb-2">You're registered!</h2>
                      <p className="text-sm text-muted-foreground mb-5">Event QR code sent to your email. Show it at the gate.</p>
                      <div className="bg-foreground p-4 rounded-2xl inline-block mb-5">
                        <QRCodeSVG value={`founderkey://event/${event.id}/user/${user?.id}`} size={140} bgColor="#E8E0D0" fgColor="#0D0D0D" />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="gold-ghost" className="flex-1" onClick={() => setRegisteringFor(null)}>Close</Button>
                        <Button variant="gold" className="flex-1" asChild>
                          <Link to={`/event/${event.id}`}>View Event</Link>
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
