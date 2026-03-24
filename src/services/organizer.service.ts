import { apiFetch } from './api';
import type { Event, Pagination } from './events.service';

export interface TicketTypePayload {
  id: string;
  name: string;
  price: number;
  count: number;
  benefits: string[];
  color: string;
  isEnabled: boolean;
}

export interface CreateEventPayload {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type?: 'IN_PERSON' | 'VIRTUAL' | 'HYBRID';
  location?: {
    address?: string;
    city?: string;
    country?: string;
    meetingUrl?: string;
  };
  capacity?: number;
  ticketPrice?: number;
  coverImage?: string;
  tags?: string[];
  category?: string;
  theme?: string;
  slug?: string;
  requiresApproval?: boolean;
  waitlistEnabled?: boolean;
  visibility?: 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
  timezone?: string;
  ticketTypes?: TicketTypePayload[];
}

export interface AttendeeItem {
  id: string;
  userId: string;
  status: string;
  checkedIn: boolean;
  checkedInAt?: string | null;
  registeredAt: string;
  email: string;
  event: { id: string; title: string; startDate: string };
  user: {
    id: string;
    email: string;
    tier: string;
    profile?: {
      firstName: string;
      lastName: string;
      avatar?: string;
      company?: string;
      position?: string;
      linkedin?: string;
      skills?: string[];
    };
    founderCard?: { status: string } | null;
    gamification?: { fkScore: number; level: number } | null;
  };
}

export interface Guest {
  id: string;
  userId: string;
  status: string;
  checkedIn: boolean;
  checkedInAt?: string | null;
  registeredAt: string;
  email: string;
  profile?: {
    firstName: string;
    lastName: string;
    avatar?: string;
    company?: string;
    position?: string;
  };
}

export interface EventAnalytics {
  event: { id: string; title: string; startDate: string; capacity: number };
  registrations: {
    total: number;
    attended: number;
    cancelled: number;
    waitlisted: number;
    active: number;
    conversionRate: number;
    capacityUtilization: number;
  };
  timeline: { registeredAt: string; _count: number }[];
  leads: Record<string, number>;
}

export const organizerService = {
  async getDashboardStats() {
    return apiFetch<{ data: {
      totalEvents: number;
      upcomingEvents: number;
      totalAttendees: number;
      totalLeads: number;
      recentEvents: (Event & { registeredCount: number })[];
    } }>('/organizer/dashboard');
  },

  async getMyEvents(page = 1, limit = 20) {
    // sendPaginated returns { data: [...], pagination: {...} }
    return apiFetch<{ data: (Event & { registeredCount: number })[]; pagination: Pagination }>(
      `/events/organizer?page=${page}&limit=${limit}`
    );
  },

  async createEvent(payload: CreateEventPayload) {
    return apiFetch<{ data: Event }>('/events', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateEvent(id: string, payload: Partial<CreateEventPayload>) {
    return apiFetch<{ data: Event }>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deleteEvent(id: string) {
    return apiFetch<{ data: null }>(`/events/${id}`, { method: 'DELETE' });
  },

  async publishEvent(id: string) {
    return apiFetch<{ data: Event }>(`/events/${id}/publish`, { method: 'POST' });
  },

  async cancelEvent(id: string) {
    return apiFetch<{ data: null }>(`/events/${id}/cancel`, { method: 'POST' });
  },

  async getEventGuests(id: string, params: { page?: number; limit?: number; search?: string; status?: string } = {}) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && qs.set(k, String(v)));
    const query = qs.toString() ? `?${qs.toString()}` : '';
    // sendPaginated returns { data: [...guests...], pagination: {...} }
    return apiFetch<{ data: Guest[]; pagination: Pagination }>(
      `/organizer/events/${id}/guests${query}`
    );
  },

  async getAttendees(params: { eventId?: string; search?: string; page?: number; limit?: number } = {}) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && qs.set(k, String(v)));
    const query = qs.toString() ? `?${qs.toString()}` : '';
    return apiFetch<{ data: AttendeeItem[]; pagination: Pagination }>(`/organizer/attendees${query}`);
  },

  async checkInAttendee(eventId: string, userId: string) {
    return apiFetch<{ data: Guest }>(`/organizer/events/${eventId}/checkin`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  async sendEventBlast(eventId: string, payload: { subject: string; body: string; audience: 'all' | 'registered' | 'waitlist' }) {
    return apiFetch<{ data: { sent: number; recipients: string[] } }>(
      `/organizer/events/${eventId}/blast`,
      { method: 'POST', body: JSON.stringify(payload) }
    );
  },

  async getEventAnalytics(id: string) {
    return apiFetch<{ data: EventAnalytics }>(`/organizer/events/${id}/analytics`);
  },

  async getLeads(params: { status?: string; eventId?: string; search?: string; page?: number; limit?: number } = {}) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && qs.set(k, String(v)));
    const query = qs.toString() ? `?${qs.toString()}` : '';
    return apiFetch<{ data: unknown[]; pagination: Pagination }>(`/organizer/leads${query}`);
  },

  async updateLeadStatus(leadId: string, status: string, notes?: string) {
    return apiFetch<{ data: unknown }>(`/organizer/leads/${leadId}`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  },
};
