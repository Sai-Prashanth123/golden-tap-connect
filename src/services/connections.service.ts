import { apiFetch } from './api';

export interface ConnectionProfile {
  firstName: string;
  lastName: string;
  avatar?: string;
  company?: string;
  position?: string;
  location?: string;
  bio?: string;
}

export interface Connection {
  id: string;
  requesterId: string;
  receiverId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  requester?: { id: string; email: string; profile?: ConnectionProfile };
  receiver?: { id: string; email: string; profile?: ConnectionProfile };
}

export interface UserSearchResult {
  id: string;
  email: string;
  profile?: ConnectionProfile;
  gamification?: { fkScore: number; level: number };
  founderCard?: { status: string };
}

export const connectionsService = {
  async getConnections(page = 1, limit = 20) {
    return apiFetch<{ data: { connections: Connection[]; pagination: unknown } }>(
      `/connections?page=${page}&limit=${limit}`
    );
  },

  async getPendingRequests() {
    return apiFetch<{ data: { received: Connection[]; sent: Connection[] } }>(
      '/connections/pending'
    );
  },

  async sendRequest(receiverId: string) {
    return apiFetch<{ data: Connection }>('/connections', {
      method: 'POST',
      body: JSON.stringify({ receiverId }),
    });
  },

  async acceptRequest(connectionId: string) {
    return apiFetch<{ data: Connection }>(`/connections/${connectionId}/accept`, {
      method: 'PUT',
    });
  },

  async rejectRequest(connectionId: string) {
    return apiFetch<{ data: Connection }>(`/connections/${connectionId}/reject`, {
      method: 'PUT',
    });
  },

  async removeConnection(connectionId: string) {
    return apiFetch<{ data: null }>(`/connections/${connectionId}`, { method: 'DELETE' });
  },

  async searchUsers(q: string, page = 1, limit = 20) {
    return apiFetch<{ data: { users: UserSearchResult[]; pagination: unknown } }>(
      `/users/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`
    );
  },
};
