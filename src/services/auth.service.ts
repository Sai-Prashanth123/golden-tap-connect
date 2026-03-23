import { apiFetch, setTokens, clearTokens } from './api';
import type { User, UserRole, UserTier, CardStatus } from '@/store/appStore';

// ─── Backend shapes ───────────────────────────────────────────────────────────

export interface BackendUser {
  id: string;
  email: string;
  role: 'ATTENDEE' | 'ORGANIZER' | 'ADMIN';
  tier: 'FREE' | 'FOUNDER';
  isActive: boolean;
  isEmailVerified: boolean;
  profile: {
    firstName: string;
    lastName: string;
    avatar: string | null;
    company: string | null;
    position?: string | null;
    bio?: string | null;
    location?: string | null;
    linkedin?: string | null;
    twitter?: string | null;
    website?: string | null;
    skills?: string[];
    interests?: string[];
    lookingFor?: string[];
  } | null;
  founderCard?: {
    id: string;
    status: string;
    qrCodeUrl: string | null;
  } | null;
  gamification?: {
    fkScore: number;
    level: number;
  } | null;
}

export interface BackendTokens {
  accessToken: string;
  refreshToken: string;
}

export interface BackendAuthResponse {
  user: BackendUser;
  tokens: BackendTokens;
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

// ─── Role / tier mapping ──────────────────────────────────────────────────────

function mapRole(r: string): UserRole {
  return r.toLowerCase() as UserRole;
}

function mapTier(t: string): UserTier {
  return t.toLowerCase() as UserTier;
}

function mapCardStatus(status?: string): CardStatus {
  if (!status) return 'none';
  const map: Record<string, CardStatus> = {
    PENDING: 'pending',
    ACTIVE: 'active',
    DEACTIVATED: 'deactivated',
    APPROVED: 'active',
  };
  return map[status] ?? 'none';
}

/** Convert a backend user to the frontend User shape */
export function mapBackendUser(bu: BackendUser): User {
  const firstName = bu.profile?.firstName ?? '';
  const lastName = bu.profile?.lastName ?? '';
  const name = [firstName, lastName].filter(Boolean).join(' ') || bu.email;
  const cardStatus = mapCardStatus(bu.founderCard?.status);

  return {
    id: bu.id,
    email: bu.email,
    role: mapRole(bu.role),
    tier: mapTier(bu.tier),
    name,
    avatar: bu.profile?.avatar ?? undefined,
    designation: bu.profile?.position ?? undefined,
    company: bu.profile?.company ?? undefined,
    bio: bu.profile?.bio ?? undefined,
    location: bu.profile?.location ?? undefined,
    linkedin: bu.profile?.linkedin ?? undefined,
    twitter: bu.profile?.twitter ?? undefined,
    website: bu.profile?.website ?? undefined,
    skills: bu.profile?.skills ?? [],
    interests: bu.profile?.interests ?? [],
    lookingFor: bu.profile?.lookingFor ?? [],
    fkScore: bu.gamification?.fkScore ?? 0,
    hasFounderCard: !!bu.founderCard,
    cardStatus,
    cardQR: bu.founderCard?.qrCodeUrl ?? undefined,
    connectionsCount: 0,
    eventsAttended: 0,
  };
}

// ─── Auth API calls ───────────────────────────────────────────────────────────

export async function apiLogin(email: string, password: string): Promise<{ user: User; tokens: BackendTokens }> {
  const res = await apiFetch<ApiEnvelope<BackendAuthResponse>>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setTokens(res.data.tokens.accessToken, res.data.tokens.refreshToken);
  return { user: mapBackendUser(res.data.user), tokens: res.data.tokens };
}

export async function apiRegister(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
  company?: string;
}): Promise<{ user: User; tokens: BackendTokens }> {
  const res = await apiFetch<ApiEnvelope<BackendAuthResponse>>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      ...data,
      role: data.role?.toUpperCase() ?? 'ATTENDEE',
    }),
  });
  setTokens(res.data.tokens.accessToken, res.data.tokens.refreshToken);
  return { user: mapBackendUser(res.data.user), tokens: res.data.tokens };
}

export async function apiGoogleVerify(supabaseToken: string, role?: string): Promise<{ user: User; tokens: BackendTokens }> {
  const res = await apiFetch<ApiEnvelope<BackendAuthResponse>>('/auth/google/verify', {
    method: 'POST',
    body: JSON.stringify({
      supabaseToken,
      role: role?.toUpperCase() ?? 'ATTENDEE',
    }),
  });
  setTokens(res.data.tokens.accessToken, res.data.tokens.refreshToken);
  return { user: mapBackendUser(res.data.user), tokens: res.data.tokens };
}

export async function apiLogout(): Promise<void> {
  try {
    await apiFetch('/auth/logout', { method: 'POST' });
  } catch {
    // Ignore errors — clear local tokens regardless
  }
  clearTokens();
}

export async function apiGetMe(): Promise<User> {
  const res = await apiFetch<ApiEnvelope<BackendUser>>('/auth/me');
  return mapBackendUser(res.data);
}

export async function apiGetGoogleOAuthUrl(redirectTo: string): Promise<string> {
  const res = await apiFetch<ApiEnvelope<{ url: string }>>(
    `/auth/google/url?redirectTo=${encodeURIComponent(redirectTo)}`
  );
  return res.data.url;
}
