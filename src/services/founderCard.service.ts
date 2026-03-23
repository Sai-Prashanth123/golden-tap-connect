import { apiFetch } from './api';

export interface FounderCard {
  id: string;
  userId: string;
  status: 'PENDING' | 'ACTIVE' | 'DEACTIVATED' | 'REJECTED';
  qrCode?: string | null;
  qrCodeUrl?: string | null;
  message?: string | null;
  reason?: string | null;
  appliedAt: string;
  reviewedAt?: string | null;
}

export const founderCardService = {
  async getMyCard() {
    return apiFetch<{ data: FounderCard | null }>('/founder-cards/me');
  },

  async applyForCard(message?: string) {
    return apiFetch<{ data: FounderCard }>('/founder-cards/apply', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  async getPublicCard(userId: string) {
    return apiFetch<{ data: FounderCard }>(`/founder-cards/user/${userId}`);
  },
};
