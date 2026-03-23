import { apiFetch } from './api';

export interface Profile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  bio?: string | null;
  company?: string | null;
  position?: string | null;
  location?: string | null;
  avatar?: string | null;
  skills: string[];
  interests: string[];
  phone?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  website?: string | null;
  instagram?: string | null;
  email?: string | null;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  bio?: string;
  company?: string;
  position?: string;
  location?: string;
  avatar?: string;
  skills?: string[];
  interests?: string[];
  phone?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
  instagram?: string;
}

export const profileService = {
  async getMyProfile() {
    return apiFetch<{ data: { profile: Profile; email: string; role: string; tier: string } }>('/users/me');
  },

  async updateProfile(payload: UpdateProfilePayload) {
    return apiFetch<{ data: Profile }>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async getPublicProfile(userId: string) {
    return apiFetch<{ data: unknown }>(`/users/${userId}/profile`);
  },
};
