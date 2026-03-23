export interface EventTheme {
  id: string;
  label: string;
  bg: string;
  accent: string;
  accentHover: string;
  text: string;
  gradient: string;
  bannerGradient: string;
  cssVars: Record<string, string>;
}

export const EVENT_THEMES: Record<string, EventTheme> = {
  default: {
    id: 'default',
    label: 'Gold',
    bg: '#1a1400',
    accent: '#D4AF37',
    accentHover: '#b8960c',
    text: '#F5E6A3',
    gradient: 'linear-gradient(135deg, #D4AF37 0%, #b8960c 100%)',
    bannerGradient: 'linear-gradient(135deg, #1a1400 0%, #2d2200 50%, #1a1000 100%)',
    cssVars: {
      '--event-accent': '#D4AF37',
      '--event-accent-hover': '#b8960c',
      '--event-bg': '#1a1400',
      '--event-text': '#F5E6A3',
      '--event-banner': 'linear-gradient(135deg, #1a1400 0%, #2d2200 100%)',
    },
  },
  ocean: {
    id: 'ocean',
    label: 'Ocean',
    bg: '#001a2e',
    accent: '#00b4d8',
    accentHover: '#0096c7',
    text: '#caf0f8',
    gradient: 'linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)',
    bannerGradient: 'linear-gradient(135deg, #001a2e 0%, #023e8a 50%, #001a2e 100%)',
    cssVars: {
      '--event-accent': '#00b4d8',
      '--event-accent-hover': '#0096c7',
      '--event-bg': '#001a2e',
      '--event-text': '#caf0f8',
      '--event-banner': 'linear-gradient(135deg, #001a2e 0%, #023e8a 100%)',
    },
  },
  forest: {
    id: 'forest',
    label: 'Forest',
    bg: '#0a1f0a',
    accent: '#52b788',
    accentHover: '#40916c',
    text: '#d8f3dc',
    gradient: 'linear-gradient(135deg, #52b788 0%, #1b4332 100%)',
    bannerGradient: 'linear-gradient(135deg, #0a1f0a 0%, #1b4332 50%, #0a1f0a 100%)',
    cssVars: {
      '--event-accent': '#52b788',
      '--event-accent-hover': '#40916c',
      '--event-bg': '#0a1f0a',
      '--event-text': '#d8f3dc',
      '--event-banner': 'linear-gradient(135deg, #0a1f0a 0%, #1b4332 100%)',
    },
  },
  sunset: {
    id: 'sunset',
    label: 'Sunset',
    bg: '#1a0a00',
    accent: '#f77f00',
    accentHover: '#d62828',
    text: '#ffd60a',
    gradient: 'linear-gradient(135deg, #f77f00 0%, #d62828 100%)',
    bannerGradient: 'linear-gradient(135deg, #1a0a00 0%, #7f1d1d 50%, #1a0a00 100%)',
    cssVars: {
      '--event-accent': '#f77f00',
      '--event-accent-hover': '#d62828',
      '--event-bg': '#1a0a00',
      '--event-text': '#ffd60a',
      '--event-banner': 'linear-gradient(135deg, #1a0500 0%, #7f1d1d 100%)',
    },
  },
  midnight: {
    id: 'midnight',
    label: 'Midnight',
    bg: '#0d0d1a',
    accent: '#7c3aed',
    accentHover: '#6d28d9',
    text: '#ede9fe',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
    bannerGradient: 'linear-gradient(135deg, #0d0d1a 0%, #1e1b4b 50%, #0d0d1a 100%)',
    cssVars: {
      '--event-accent': '#7c3aed',
      '--event-accent-hover': '#6d28d9',
      '--event-bg': '#0d0d1a',
      '--event-text': '#ede9fe',
      '--event-banner': 'linear-gradient(135deg, #0d0d1a 0%, #1e1b4b 100%)',
    },
  },
  rose: {
    id: 'rose',
    label: 'Rose',
    bg: '#1a0010',
    accent: '#f43f5e',
    accentHover: '#e11d48',
    text: '#fecdd3',
    gradient: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
    bannerGradient: 'linear-gradient(135deg, #1a0010 0%, #4c0519 50%, #1a0010 100%)',
    cssVars: {
      '--event-accent': '#f43f5e',
      '--event-accent-hover': '#e11d48',
      '--event-bg': '#1a0010',
      '--event-text': '#fecdd3',
      '--event-banner': 'linear-gradient(135deg, #1a0010 0%, #4c0519 100%)',
    },
  },
  arctic: {
    id: 'arctic',
    label: 'Arctic',
    bg: '#0a1628',
    accent: '#38bdf8',
    accentHover: '#0284c7',
    text: '#e0f2fe',
    gradient: 'linear-gradient(135deg, #38bdf8 0%, #0369a1 100%)',
    bannerGradient: 'linear-gradient(135deg, #0a1628 0%, #0c4a6e 50%, #0a1628 100%)',
    cssVars: {
      '--event-accent': '#38bdf8',
      '--event-accent-hover': '#0284c7',
      '--event-bg': '#0a1628',
      '--event-text': '#e0f2fe',
      '--event-banner': 'linear-gradient(135deg, #0a1628 0%, #0c4a6e 100%)',
    },
  },
  ember: {
    id: 'ember',
    label: 'Ember',
    bg: '#1a0800',
    accent: '#fb923c',
    accentHover: '#ea580c',
    text: '#ffedd5',
    gradient: 'linear-gradient(135deg, #fb923c 0%, #c2410c 100%)',
    bannerGradient: 'linear-gradient(135deg, #1a0800 0%, #7c2d12 50%, #1a0800 100%)',
    cssVars: {
      '--event-accent': '#fb923c',
      '--event-accent-hover': '#ea580c',
      '--event-bg': '#1a0800',
      '--event-text': '#ffedd5',
      '--event-banner': 'linear-gradient(135deg, #1a0800 0%, #7c2d12 100%)',
    },
  },
  violet: {
    id: 'violet',
    label: 'Violet',
    bg: '#0f0a1a',
    accent: '#a78bfa',
    accentHover: '#8b5cf6',
    text: '#f5f3ff',
    gradient: 'linear-gradient(135deg, #a78bfa 0%, #6d28d9 100%)',
    bannerGradient: 'linear-gradient(135deg, #0f0a1a 0%, #2e1065 50%, #0f0a1a 100%)',
    cssVars: {
      '--event-accent': '#a78bfa',
      '--event-accent-hover': '#8b5cf6',
      '--event-bg': '#0f0a1a',
      '--event-text': '#f5f3ff',
      '--event-banner': 'linear-gradient(135deg, #0f0a1a 0%, #2e1065 100%)',
    },
  },
  slate: {
    id: 'slate',
    label: 'Slate',
    bg: '#0f172a',
    accent: '#64748b',
    accentHover: '#475569',
    text: '#f1f5f9',
    gradient: 'linear-gradient(135deg, #64748b 0%, #1e293b 100%)',
    bannerGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    cssVars: {
      '--event-accent': '#64748b',
      '--event-accent-hover': '#475569',
      '--event-bg': '#0f172a',
      '--event-text': '#f1f5f9',
      '--event-banner': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    },
  },
};

export function getTheme(themeId?: string | null): EventTheme {
  return EVENT_THEMES[themeId ?? 'default'] ?? EVENT_THEMES.default;
}

export function injectThemeVars(el: HTMLElement, themeId?: string | null): void {
  const theme = getTheme(themeId);
  Object.entries(theme.cssVars).forEach(([k, v]) => {
    el.style.setProperty(k, v);
  });
}
