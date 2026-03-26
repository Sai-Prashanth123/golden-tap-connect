import { useState, useRef } from 'react';
import { OrganizerLayout } from '@/components/OrganizerLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useCreateEvent, usePublishEvent } from '@/hooks/useOrganizer';
import { EVENT_THEMES } from '@/lib/eventThemes';
import { apiUpload } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  ArrowRight, ArrowLeft, Calendar, Image, Tag, Check,
  MapPin, Upload, X, Plus, Trash2,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Basics',      icon: Calendar },
  { id: 2, label: 'Date & Place', icon: MapPin },
  { id: 3, label: 'Media',       icon: Image },
  { id: 4, label: 'Tickets',     icon: Tag },
  { id: 5, label: 'Publish',     icon: Check },
];

const CATEGORIES = ['Tech','Business','Design','Health','Social','Arts','Sports','Food','Startup','AI','Finance','Education'];

const TIMEZONES = [
  { value: 'UTC',                label: 'UTC (Coordinated Universal Time)' },
  { value: 'Asia/Kolkata',       label: 'IST — India (+05:30)' },
  { value: 'Asia/Dubai',         label: 'GST — Dubai (+04:00)' },
  { value: 'Asia/Singapore',     label: 'SGT — Singapore (+08:00)' },
  { value: 'Asia/Tokyo',         label: 'JST — Tokyo (+09:00)' },
  { value: 'Asia/Shanghai',      label: 'CST — Shanghai (+08:00)' },
  { value: 'Europe/London',      label: 'GMT — London (+00:00)' },
  { value: 'Europe/Paris',       label: 'CET — Paris (+01:00)' },
  { value: 'Europe/Berlin',      label: 'CET — Berlin (+01:00)' },
  { value: 'America/New_York',   label: 'EST — New York (-05:00)' },
  { value: 'America/Chicago',    label: 'CST — Chicago (-06:00)' },
  { value: 'America/Los_Angeles',label: 'PST — Los Angeles (-08:00)' },
  { value: 'Australia/Sydney',   label: 'AEDT — Sydney (+11:00)' },
];

const DEFAULT_TICKET_TYPES: TicketType[] = [
  {
    id: 'premium',
    name: 'Premium',
    price: 5000,
    count: 10,
    benefits: ['VIP seating', 'Networking dinner', 'Speaker meet & greet', 'Swag bag'],
    color: 'gold',
    isEnabled: true,
  },
  {
    id: 'silver',
    name: 'Silver',
    price: 2000,
    count: 30,
    benefits: ['Reserved seating', 'Lunch included', 'Networking session'],
    color: 'silver',
    isEnabled: true,
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 500,
    count: 60,
    benefits: ['General admission', 'Coffee breaks'],
    color: 'blue',
    isEnabled: true,
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface TicketType {
  id: string;
  name: string;
  price: number;
  count: number;
  benefits: string[];
  color: string;
  isEnabled: boolean;
}

interface FormState {
  title: string;
  description: string;
  category: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  timezone: string;
  locationType: 'IN_PERSON' | 'VIRTUAL' | 'HYBRID';
  address: string;
  city: string;
  country: string;
  meetingUrl: string;
  coverImage: string;
  theme: string;
  useTicketTypes: boolean;
  capacity: number;
  ticketPrice: string;
  ticketTypes: TicketType[];
  requiresApproval: boolean;
  waitlistEnabled: boolean;
  visibility: 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
  tags: string;
  slug: string;
}

const TICKET_COLORS: Record<string, string> = {
  gold:   'from-amber-500/20 to-yellow-500/20 border-amber-500/40',
  silver: 'from-slate-400/20 to-gray-300/20 border-slate-400/40',
  blue:   'from-blue-500/20 to-indigo-500/20 border-blue-500/40',
  green:  'from-emerald-500/20 to-teal-500/20 border-emerald-500/40',
  purple: 'from-purple-500/20 to-violet-500/20 border-purple-500/40',
};

// ─── Component ────────────────────────────────────────────────────────────────

const CreateEventPage = () => {
  const navigate = useNavigate();
  const createMutation = useCreateEvent();
  const publishMutation = usePublishEvent();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    category: '',
    startDate: '',
    startTime: '09:00',
    endDate: '',
    endTime: '18:00',
    timezone: 'Asia/Kolkata',
    locationType: 'IN_PERSON',
    address: '',
    city: '',
    country: '',
    meetingUrl: '',
    coverImage: '',
    theme: 'default',
    useTicketTypes: false,
    capacity: 100,
    ticketPrice: '',
    ticketTypes: DEFAULT_TICKET_TYPES,
    requiresApproval: false,
    waitlistEnabled: true,
    visibility: 'PUBLIC',
    tags: '',
    slug: '',
  });

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const allocateTicketSeats = (totalCapacity: number) => {
    const cap = Math.max(0, Math.floor(totalCapacity));
    const premiumCount = Math.floor(cap * 0.1);
    const silverCount = Math.floor(cap * 0.3);
    // Ensure all enabled tiers can never exceed the total due to rounding.
    const basicCount = Math.max(0, cap - premiumCount - silverCount);

    const counts: Record<string, number> = {
      premium: premiumCount,
      silver: silverCount,
      basic: basicCount,
    };

    // Preserve user edits (benefits/price/isEnabled) and only auto-update seat counts.
    return form.ticketTypes.map((t) => ({
      ...t,
      count: counts[t.id] ?? t.count,
    }));
  };

  const toISO = (date: string, time: string) =>
    date ? new Date(`${date}T${time}:00`).toISOString() : '';

  // ── Image upload ──────────────────────────────────────────────────────────

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);

    // Upload to backend
    setUploading(true);
    try {
      const res = await apiUpload<{ data: { url: string } }>('/media/upload', file);
      set('coverImage', res.data.url);
      toast.success('Image uploaded');
    } catch {
      // Keep local preview, store data URL as fallback
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        set('coverImage', dataUrl);
      };
      reader.readAsDataURL(file);
      toast.error('Upload failed — image will be embedded as data URL');
    } finally {
      setUploading(false);
    }
  };

  // ── Ticket type helpers ───────────────────────────────────────────────────

  const updateTicket = (id: string, patch: Partial<TicketType>) =>
    // Functional update avoids stale `form` values during rapid typing.
    setForm((prev) => ({
      ...prev,
      ticketTypes: prev.ticketTypes.map((t) =>
        t.id === id ? { ...t, ...patch } : t
      ),
    }));

  const addBenefit = (id: string) =>
    updateTicket(id, { benefits: [...(form.ticketTypes.find((t) => t.id === id)?.benefits ?? []), ''] });

  const updateBenefit = (ticketId: string, idx: number, val: string) =>
    updateTicket(ticketId, {
      benefits: (form.ticketTypes.find((t) => t.id === ticketId)?.benefits ?? []).map((b, i) => i === idx ? val : b),
    });

  const removeBenefit = (ticketId: string, idx: number) =>
    updateTicket(ticketId, {
      benefits: (form.ticketTypes.find((t) => t.id === ticketId)?.benefits ?? []).filter((_, i) => i !== idx),
    });

  // Capacity tracking for multi-tier mode
  const usedCapacity = form.ticketTypes.filter((t) => t.isEnabled).reduce((s, t) => s + t.count, 0);
  const remainingCapacity = form.capacity - usedCapacity;
  const totalCapacity = form.capacity;

  // Allow manual entry of seat counts even if the total exceeds capacity.
  // We block "Next" separately when `usedCapacity > form.capacity`.
  const handleTicketCountChange = (id: string, newCount: number) => {
    updateTicket(id, { count: Math.max(0, newCount) });
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleCreateOrUpdate = async (publish = false) => {
    // Client-side validation before hitting the backend
    const startISO = toISO(form.startDate, form.startTime);
    const endISO   = toISO(form.endDate, form.endTime);

    if (!startISO) { toast.error('Please set a start date.'); return; }
    if (!endISO)   { toast.error('Please set an end date.'); return; }

    const startDt = new Date(startISO);
    const endDt   = new Date(endISO);

    if (startDt <= new Date()) { toast.error('Start date must be in the future.'); return; }
    if (endDt <= startDt)     { toast.error('End date must be after the start date.'); return; }

    // Only send meetingUrl when applicable to the event type
    const meetingUrl = form.locationType !== 'IN_PERSON' ? (form.meetingUrl || undefined) : undefined;

    const activeTickets = form.useTicketTypes ? form.ticketTypes.filter((t) => t.isEnabled) : undefined;

    const payload = {
      title: form.title,
      description: form.description,
      category: form.category || undefined,
      startDate: startISO,
      endDate: endISO,
      type: form.locationType,
      location: {
        address: form.address || undefined,
        city: form.city || undefined,
        country: form.country || undefined,
        meetingUrl,
      },
      coverImage: form.coverImage || undefined,
      theme: form.theme,
      timezone: form.timezone,
      capacity: form.capacity,
      ticketPrice: (!form.useTicketTypes && form.ticketPrice) ? Number(form.ticketPrice) : undefined,
      ticketTypes: activeTickets,
      requiresApproval: form.requiresApproval,
      waitlistEnabled: form.waitlistEnabled,
      visibility: form.visibility,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      slug: form.slug || undefined,
    };

    try {
      const res = await createMutation.mutateAsync(payload);
      if (publish) await publishMutation.mutateAsync(res.data.id);
      navigate('/organizer/dashboard');
    } catch {
      // Error is already shown by the mutation's onError toast
    }
  };

  const canNext = () => {
    if (step === 1) return form.title.length >= 3 && form.description.length >= 10;
    if (step === 2) {
      if (!form.startDate || !form.endDate) return false;
      const start = new Date(`${form.startDate}T${form.startTime}:00`);
      const end   = new Date(`${form.endDate}T${form.endTime}:00`);
      return end > start && start > new Date();
    }
    if (step === 4) {
      // Capacity must be valid for both single and multi-tier modes.
      if (form.capacity < 1) return false;
      if (form.useTicketTypes) {
        const usedCapacity = form.ticketTypes
          .filter((t) => t.isEnabled)
          .reduce((s, t) => s + t.count, 0);
        return usedCapacity <= form.capacity;
      }
      return true;
    }
    return true;
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <OrganizerLayout>
      <div className="max-w-2xl mx-auto space-y-6 pb-10">
        <h1 className="font-display text-3xl font-semibold text-foreground">Create Event</h1>

        {/* Step indicator */}
        <div className="flex items-center gap-1">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div key={s.id} className="flex items-center gap-1">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-all ${
                  done ? 'gold-gradient-bg text-primary-foreground' :
                  active ? 'border-2 border-primary text-primary' :
                  'border border-border text-muted-foreground'
                }`}>
                  {done ? <Check className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <span className={`hidden md:block text-[11px] font-medium ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {s.label}
                </span>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-1 ${done ? 'bg-primary' : 'bg-border'}`} style={{ minWidth: 8 }} />
                )}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <GlassCard>

              {/* ── Step 1: Basics ─────────────────────────────────────────── */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="font-display text-xl font-semibold text-foreground">Event Basics</h2>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Event Name *</label>
                    <Input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. BLR Tech Week 2026" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Description *</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => set('description', e.target.value)}
                      placeholder="Tell attendees what to expect..."
                      rows={5}
                      className="w-full px-3 py-2 text-sm bg-muted/30 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => set('category', form.category === cat ? '' : cat)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                            form.category === cat ? 'gold-gradient-bg text-primary-foreground border-transparent' : 'border-border text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 2: Date & Location ────────────────────────────────── */}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="font-display text-xl font-semibold text-foreground">Date & Location</h2>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Start Date *</label>
                      <Input type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Start Time</label>
                      <Input type="time" value={form.startTime} onChange={(e) => set('startTime', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">End Date *</label>
                      <Input type="date" value={form.endDate} onChange={(e) => set('endDate', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">End Time</label>
                      <Input type="time" value={form.endTime} onChange={(e) => set('endTime', e.target.value)} />
                    </div>
                  </div>
                  {/* Show date validation hint */}
                  {form.startDate && form.endDate && (() => {
                    const s = new Date(`${form.startDate}T${form.startTime}:00`);
                    const e = new Date(`${form.endDate}T${form.endTime}:00`);
                    if (s <= new Date()) return <p className="text-xs text-red-400">Start date must be in the future.</p>;
                    if (e <= s) return <p className="text-xs text-red-400">End date/time must be after start date/time.</p>;
                    return null;
                  })()}

                  {/* Timezone */}
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Timezone</label>
                    <select
                      value={form.timezone}
                      onChange={(e) => set('timezone', e.target.value)}
                      className="w-full h-10 px-3 text-sm bg-muted/30 border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {TIMEZONES.map((tz) => (
                        <option key={tz.value} value={tz.value}>{tz.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Event type */}
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Event Type</label>
                    <div className="flex gap-2">
                      {(['IN_PERSON'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => set('locationType', type)}
                          className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${
                            form.locationType === type ? 'gold-gradient-bg text-primary-foreground border-transparent' : 'border-border text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          📍 In Person
                        </button>
                      ))}
                    </div>
                  </div>

                  {form.locationType !== 'VIRTUAL' && (
                    <div className="space-y-2">
                      <Input value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Venue address" />
                      <div className="grid grid-cols-2 gap-2">
                        <Input value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="City" />
                        <Input value={form.country} onChange={(e) => set('country', e.target.value)} placeholder="Country" />
                      </div>
                    </div>
                  )}
                  {form.locationType !== 'IN_PERSON' && (
                    <Input value={form.meetingUrl} onChange={(e) => set('meetingUrl', e.target.value)} placeholder="Meeting link (Zoom, Meet...)" />
                  )}
                </div>
              )}

              {/* ── Step 3: Media ──────────────────────────────────────────── */}
              {step === 3 && (
                <div className="space-y-5">
                  <h2 className="font-display text-xl font-semibold text-foreground">Media & Theme</h2>

                  {/* Cover image */}
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Cover Image</label>

                    {/* Upload area */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (file) void handleFileSelect(file);
                      }}
                      className="relative border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/40 hover:bg-muted/20 transition-all"
                    >
                      {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          <p className="text-xs text-muted-foreground">Uploading...</p>
                        </div>
                      ) : (imagePreview || form.coverImage) ? (
                        <div className="relative w-full">
                          <img
                            src={imagePreview || form.coverImage}
                            alt="Cover preview"
                            className="w-full h-36 object-cover rounded-lg"
                          />
                          <button
                            onClick={(e) => { e.stopPropagation(); set('coverImage', ''); setImagePreview(''); }}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
                          >
                            <X className="w-3.5 h-3.5 text-white" />
                          </button>
                          <p className="text-[11px] text-muted-foreground mt-2 text-center">Click to change image</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-muted-foreground" />
                          <p className="text-sm font-medium text-foreground">Drop image here or click to upload</p>
                          <p className="text-xs text-muted-foreground">JPG, PNG, WEBP — max 5MB</p>
                        </>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFileSelect(f); }}
                    />

                    {/* URL fallback */}
                    <div className="mt-3">
                      <label className="text-xs text-muted-foreground block mb-1">Or paste image URL</label>
                      <Input
                        value={form.coverImage.startsWith('data:') ? '' : form.coverImage}
                        onChange={(e) => { set('coverImage', e.target.value); setImagePreview(''); }}
                        placeholder="https://..."
                        className="text-xs"
                      />
                    </div>
                  </div>

                  {/* Theme picker */}
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Event Theme</label>
                    <div className="grid grid-cols-5 gap-2">
                      {Object.values(EVENT_THEMES).map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => set('theme', theme.id)}
                          className={`relative h-12 rounded-xl border-2 transition-all overflow-hidden ${
                            form.theme === theme.id ? 'border-primary scale-95' : 'border-transparent hover:border-border'
                          }`}
                          style={{ background: theme.gradient }}
                          title={theme.label}
                        >
                          {form.theme === theme.id && (
                            <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow" />
                          )}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Selected: {EVENT_THEMES[form.theme]?.label ?? 'Gold'}
                    </p>
                  </div>
                </div>
              )}

              {/* ── Step 4: Tickets ────────────────────────────────────────── */}
              {step === 4 && (
                <div className="space-y-5">
                  <h2 className="font-display text-xl font-semibold text-foreground">Tickets & Capacity</h2>

                  {/* ① Total Capacity — always shown first */}
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">
                      Total Capacity <span className="text-muted-foreground font-normal">(max attendees)</span>
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={form.capacity === 0 ? '' : form.capacity}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const cap = raw === '' ? 0 : (Number.isFinite(Number.parseInt(raw, 10)) ? Number.parseInt(raw, 10) : 0);
                        set('capacity', cap);
                        // Auto-allocate seats based on total capacity (10/30/60).
                        if (form.useTicketTypes) set('ticketTypes', allocateTicketSeats(cap));
                      }}
                      placeholder="100"
                    />
                  </div>

                  {/* ② Mode selector */}
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Ticket Type</label>
                    <div className="flex gap-2 p-1 bg-muted/40 rounded-xl">
                      {[
                        { value: false, label: '🎫 Single ticket type' },
                        { value: true,  label: '🏷️ Multiple ticket tiers' },
                      ].map(({ value, label }) => (
                        <button
                          key={String(value)}
                          onClick={() => {
                            set('useTicketTypes', value);
                            // When entering multi-tier mode, auto-allocate seats by capacity.
                            if (value) set('ticketTypes', allocateTicketSeats(form.capacity));
                          }}
                          className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-all ${
                            form.useTicketTypes === value
                              ? 'gold-gradient-bg text-primary-foreground shadow'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ③a Single tier — just price */}
                  {!form.useTicketTypes && (
                    <div className="p-4 rounded-xl border border-border bg-muted/10 space-y-3">
                      <p className="text-xs text-muted-foreground">
                        All <span className="font-semibold text-foreground">{form.capacity.toLocaleString()}</span> seats share one ticket price.
                      </p>
                      <div>
                        <label className="text-sm font-medium text-foreground block mb-1.5">Ticket Price (₹)</label>
                        <Input
                          type="number"
                          min={0}
                          value={form.ticketPrice}
                          onChange={(e) => set('ticketPrice', e.target.value)}
                          placeholder="Leave empty for free"
                        />
                      </div>
                    </div>
                  )}

                  {/* ③b Multi-tier */}
                  {form.useTicketTypes && (
                    <div className="space-y-4">
                      {/* Capacity usage bar */}
                      <div className="p-3 rounded-xl border border-border bg-muted/10 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            Allocated: <span className="font-semibold text-foreground">{usedCapacity.toLocaleString()}</span> / {form.capacity.toLocaleString()}
                          </span>
                          <span className={remainingCapacity < 0 ? 'text-red-400 font-semibold' : remainingCapacity === 0 ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                            {remainingCapacity < 0
                              ? `⚠ ${Math.abs(remainingCapacity)} over limit`
                              : remainingCapacity === 0
                              ? '✓ Fully allocated'
                              : `${remainingCapacity.toLocaleString()} unallocated`}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${remainingCapacity < 0 ? 'bg-red-500' : 'gold-gradient-bg'}`}
                            style={{ width: `${Math.min(100, form.capacity > 0 ? (usedCapacity / form.capacity) * 100 : 0)}%` }}
                          />
                        </div>
                      </div>

                      {/* Ticket type cards */}
                      {form.ticketTypes.map((ticket) => {
                        const otherUsed = form.ticketTypes
                          .filter((t) => t.id !== ticket.id && t.isEnabled)
                          .reduce((s, t) => s + t.count, 0);
                        const maxForThisTier = Math.max(0, form.capacity - otherUsed);

                        return (
                          <div
                            key={ticket.id}
                            className={`rounded-2xl border bg-gradient-to-br p-4 space-y-3 transition-all ${
                              ticket.isEnabled
                                ? TICKET_COLORS[ticket.color] ?? TICKET_COLORS.blue
                                : 'border-border/30 bg-muted/10 opacity-50'
                            }`}
                          >
                            {/* Header row */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateTicket(ticket.id, { isEnabled: !ticket.isEnabled })}
                                  className={`w-9 h-5 rounded-full relative transition-all flex-shrink-0 ${ticket.isEnabled ? 'gold-gradient-bg' : 'bg-muted'}`}
                                >
                                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${ticket.isEnabled ? 'right-0.5' : 'left-0.5'}`} />
                                </button>
                                <Input
                                  value={ticket.name}
                                  onChange={(e) => updateTicket(ticket.id, { name: e.target.value })}
                                  className="h-7 text-sm font-semibold bg-transparent border-none focus:ring-0 px-1 w-32"
                                  placeholder="Tier name"
                                />
                              </div>
                              <div className="flex gap-1">
                                {Object.keys(TICKET_COLORS).map((c) => (
                                  <button
                                    key={c}
                                    onClick={() => updateTicket(ticket.id, { color: c })}
                                    className={`w-4 h-4 rounded-full border-2 transition-all ${ticket.color === c ? 'border-foreground scale-125' : 'border-transparent'}`}
                                    style={{ background: c === 'gold' ? '#D4A853' : c === 'silver' ? '#9CA3AF' : c === 'blue' ? '#3B82F6' : c === 'green' ? '#10B981' : '#8B5CF6' }}
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Price + Count row */}
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-[11px] text-muted-foreground block mb-1">Price (₹)</label>
                                <Input
                                  type="text"
                                  inputMode="numeric"
                                  value={ticket.price === 0 ? '' : String(ticket.price)}
                                  onChange={(e) => {
                                    // Avoid <input type="number"> spinner/quirks while typing.
                                    const raw = e.target.value;
                                    if (raw === '') {
                                      updateTicket(ticket.id, { price: 0 });
                                      return;
                                    }

                                    // Keep digits only (prevents accidental locale/comma issues).
                                    const digitsOnly = raw.replace(/[^\d]/g, '');
                                    const nextPrice = digitsOnly === '' ? 0 : parseInt(digitsOnly, 10);
                                    updateTicket(ticket.id, { price: nextPrice });
                                  }}
                                  className="h-8 text-sm"
                                  placeholder="0 = free"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] text-muted-foreground block mb-1">
                                  Seats
                                </label>
                                <Input
                                  type="number"
                                  min={0}
                                    value={ticket.count === 0 ? '' : ticket.count}
                                    onChange={(e) => {
                                      const raw = e.target.value;
                                      const nextCount =
                                        raw === '' ? 0 : (Number.isFinite(Number.parseInt(raw, 10)) ? Number.parseInt(raw, 10) : 0);
                                      handleTicketCountChange(ticket.id, nextCount);
                                    }}
                                  className={`h-8 text-sm ${ticket.isEnabled && ticket.count > maxForThisTier ? 'border-red-400 focus:ring-red-400' : ''}`}
                                />
                                {ticket.isEnabled && ticket.count === maxForThisTier && maxForThisTier > 0 && (
                                  <p className="text-[10px] text-amber-400 mt-0.5">At capacity limit</p>
                                )}
                              </div>
                            </div>

                            {/* Benefits */}
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <label className="text-[11px] text-muted-foreground">Benefits / Inclusions</label>
                                <button
                                  onClick={() => addBenefit(ticket.id)}
                                  className="flex items-center gap-0.5 text-[11px] text-primary hover:text-primary/80 transition-colors"
                                >
                                  <Plus className="w-3 h-3" /> Add
                                </button>
                              </div>
                              <div className="space-y-1.5">
                                {ticket.benefits.map((benefit, idx) => (
                                  <div key={idx} className="flex items-center gap-1.5">
                                    <span className="text-primary text-xs">✓</span>
                                    <Input
                                      value={benefit}
                                      onChange={(e) => updateBenefit(ticket.id, idx, e.target.value)}
                                      className="h-7 text-xs flex-1"
                                      placeholder="e.g. VIP seating"
                                    />
                                    <button onClick={() => removeBenefit(ticket.id, idx)} className="text-muted-foreground hover:text-red-400 transition-colors">
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))}
                                {ticket.benefits.length === 0 && (
                                  <p className="text-[11px] text-muted-foreground italic">No benefits added yet</p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>
              )}

              {/* ── Step 5: Review & Publish ───────────────────────────────── */}
              {step === 5 && (
                <div className="space-y-4">
                  <h2 className="font-display text-xl font-semibold text-foreground">Review & Publish</h2>

                  <div
                    className="h-28 rounded-xl flex items-end p-4 relative overflow-hidden"
                    style={{ background: EVENT_THEMES[form.theme]?.bannerGradient ?? EVENT_THEMES.default.bannerGradient }}
                  >
                    {(imagePreview || form.coverImage) && (
                      <img src={imagePreview || form.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                    )}
                    <div className="relative z-10">
                      {form.category && <span className="text-[10px] text-white/60 block">{form.category}</span>}
                      <p className="font-display text-xl font-bold text-white">{form.title || 'Event Title'}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    {[
                      { label: 'Date',       value: form.startDate ? `${form.startDate} · ${form.startTime} (${form.timezone})` : 'Not set' },
                      { label: 'Location',   value: form.locationType === 'VIRTUAL' ? 'Virtual' : (form.city || 'Not set') },
                      { label: 'Capacity',   value: `${totalCapacity.toLocaleString()} attendees` },
                      { label: 'Tickets',    value: form.useTicketTypes ? `${form.ticketTypes.filter((t) => t.isEnabled).length} tiers` : (form.ticketPrice ? `₹${form.ticketPrice}` : 'Free') },
                      { label: 'Visibility', value: form.visibility },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between py-1 border-b border-border/50">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-medium text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>

                  {form.useTicketTypes && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Ticket Tiers</p>
                      {form.ticketTypes.filter((t) => t.isEnabled).map((t) => (
                        <div key={t.id} className="flex items-center justify-between p-2.5 rounded-xl border border-border/50 bg-muted/20">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{t.name}</p>
                            <p className="text-[11px] text-muted-foreground">{t.count} seats · {t.benefits.length} benefits</p>
                          </div>
                          <p className="text-sm font-bold text-primary">{t.price === 0 ? 'Free' : `₹${t.price.toLocaleString()}`}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="gold-ghost"
                      className="flex-1"
                      onClick={() => handleCreateOrUpdate(false)}
                      disabled={createMutation.isPending || publishMutation.isPending}
                    >
                      Save as Draft
                    </Button>
                    <Button
                      variant="gold"
                      className="flex-1"
                      onClick={() => handleCreateOrUpdate(true)}
                      disabled={createMutation.isPending || publishMutation.isPending}
                    >
                      {createMutation.isPending || publishMutation.isPending ? 'Publishing...' : 'Publish Now'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Navigation */}
              {step < 5 && (
                <div className="flex gap-3 mt-6 pt-4 border-t border-border">
                  {step > 1 && (
                    <Button variant="gold-ghost" onClick={() => setStep((s) => s - 1)}>
                      <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
                    </Button>
                  )}
                  <Button variant="gold" className="ml-auto" disabled={!canNext()} onClick={() => setStep((s) => s + 1)}>
                    Next <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              )}
              {step === 5 && (
                <div className="mt-2">
                  <Button variant="gold-ghost" size="sm" onClick={() => setStep((s) => s - 1)}>
                    <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
                  </Button>
                </div>
              )}

            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </div>
    </OrganizerLayout>
  );
};

export default CreateEventPage;
