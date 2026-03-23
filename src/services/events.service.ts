import { apiFetch } from './api';

export interface EventLocation {
  address?: string;
  city?: string;
  country?: string;
  meetingUrl?: string;
}

export interface EventOrganizer {
  id: string;
  email: string;
  profile?: {
    firstName: string;
    lastName: string;
    avatar?: string;
    company?: string;
  };
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  locationType: 'IN_PERSON' | 'VIRTUAL' | 'HYBRID';
  address?: string;
  city?: string;
  country?: string;
  meetingUrl?: string;
  capacity: number;
  ticketPrice?: string | null;
  coverImage?: string | null;
  tags: string[];
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  category?: string | null;
  theme?: string;
  slug?: string | null;
  requiresApproval: boolean;
  waitlistEnabled: boolean;
  visibility: 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
  createdAt: string;
  updatedAt: string;
  organizerId: string;
  organizer?: EventOrganizer;
  registeredCount?: number;
  registrationStatus?: 'REGISTERED' | 'ATTENDED' | 'CANCELLED' | 'WAITLISTED' | null;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  status: 'REGISTERED' | 'ATTENDED' | 'CANCELLED' | 'WAITLISTED';
  checkedIn: boolean;
  checkedInAt?: string | null;
  registeredAt: string;
  event?: Event;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface EventsResponse {
  data: { events: Event[]; pagination: Pagination };
}

export interface EventResponse {
  data: Event;
}

export interface RegistrationsResponse {
  data: { registrations: EventRegistration[]; pagination: Pagination };
}

export interface SearchEventsParams {
  q?: string;
  category?: string;
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  tags?: string;
  city?: string;
  country?: string;
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
}

export const eventsService = {
  async listEvents(params: SearchEventsParams = {}) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') qs.set(k, String(v));
    });
    const query = qs.toString() ? `?${qs.toString()}` : '';
    return apiFetch<EventsResponse>(`/events${query}`);
  },

  async getEvent(id: string) {
    return apiFetch<EventResponse>(`/events/${id}`);
  },

  async registerForEvent(id: string) {
    return apiFetch<{ data: { registration: EventRegistration; message: string } }>(
      `/events/${id}/register`,
      { method: 'POST' }
    );
  },

  async cancelRegistration(id: string) {
    return apiFetch<{ data: null }>(`/events/${id}/register`, { method: 'DELETE' });
  },

  async getMyRegistrations(page = 1, limit = 20) {
    return apiFetch<RegistrationsResponse>(`/events/my?page=${page}&limit=${limit}`);
  },
};
