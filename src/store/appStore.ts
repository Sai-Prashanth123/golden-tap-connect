import { create } from 'zustand';

export type UserRole = 'attendee' | 'organizer' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  designation?: string;
  company?: string;
  bio?: string;
  industry?: string;
  skills: string[];
  interests: string[];
  lookingFor: string[];
  linkedin?: string;
  twitter?: string;
  website?: string;
  location?: string;
  fkScore: number;
  hasFounderCard: boolean;
  connectionsCount: number;
  eventsAttended: number;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  activeRole: UserRole;
  setUser: (user: User | null) => void;
  setActiveRole: (role: UserRole) => void;
  login: (user: User) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  activeRole: 'attendee',
  setUser: (user) => set({ user }),
  setActiveRole: (role) => set({ activeRole: role }),
  login: (user) => set({ user, isAuthenticated: true, activeRole: user.role }),
  logout: () => set({ user: null, isAuthenticated: false, activeRole: 'attendee' }),
}));

// Mock user for demo
export const mockUser: User = {
  id: '1',
  name: 'Alex Chen',
  email: 'alex@founderkey.com',
  role: 'attendee',
  avatar: '',
  designation: 'Founder & CEO',
  company: 'NexusAI',
  bio: 'Building the future of AI-powered networking. Previously at Google and YC W22.',
  industry: 'AI / Machine Learning',
  skills: ['Product Strategy', 'Fundraising', 'AI/ML', 'Go-to-Market'],
  interests: ['B2B SaaS', 'Deep Tech', 'Climate Tech', 'Web3'],
  lookingFor: ['Co-founder', 'Investors', 'Advisors'],
  linkedin: 'https://linkedin.com/in/alexchen',
  twitter: '@alexchen',
  website: 'https://alexchen.dev',
  location: 'San Francisco, CA',
  fkScore: 87,
  hasFounderCard: true,
  connectionsCount: 142,
  eventsAttended: 23,
};
