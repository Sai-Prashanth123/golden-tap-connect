import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Keep mocks minimal: we only care that the correct event-type buttons render.
vi.mock('framer-motion', () => ({
  motion: {
    div: (props: unknown) => <div {...(props as React.HTMLAttributes<HTMLDivElement>)} />,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@/components/OrganizerLayout', () => ({
  OrganizerLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/GlassCard', () => ({
  GlassCard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) => (
    <button type="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/input', () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}));

vi.mock('@/hooks/useOrganizer', () => ({
  useCreateEvent: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  usePublishEvent: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Import after mocks so the module under test picks them up.
import CreateEventPage from './CreateEvent';

describe('CreateEvent - Event Type UI', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows only "In Person" (no "Virtual" or "Hybrid")', async () => {
    render(
      <MemoryRouter>
        <CreateEventPage />
      </MemoryRouter>,
    );

    // Step 1: satisfy canNext() to reach Step 2
    fireEvent.change(screen.getByPlaceholderText(/BLR Tech Week 2026/i), {
      target: { value: 'BLR Tech Week 2026' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Tell attendees what to expect/i), {
      target: { value: 'This event brings founders and builders together for practical sessions.' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    expect(await screen.findByText(/In Person/i)).toBeInTheDocument();
    expect(screen.queryByText(/Virtual/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Hybrid/i)).not.toBeInTheDocument();
  });

  it('allocates seats by capacity (10/30/60) for multiple tiers', async () => {
    const futureDate = (daysAhead: number) => {
      const d = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
      return d.toISOString().slice(0, 10); // YYYY-MM-DD
    };

    const { container } = render(
      <MemoryRouter>
        <CreateEventPage />
      </MemoryRouter>,
    );

    // Step 1: Basics
    fireEvent.change(screen.getByPlaceholderText(/BLR Tech Week 2026/i), {
      target: { value: 'BLR Tech Week 2026' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Tell attendees what to expect/i), {
      target: { value: 'This event brings founders and builders together for practical sessions.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 2: Date & Location
    const dateInputs = container.querySelectorAll('input[type="date"]');
    expect(dateInputs.length).toBeGreaterThanOrEqual(2);
    fireEvent.change(dateInputs[0], { target: { value: futureDate(10) } }); // start
    fireEvent.change(dateInputs[1], { target: { value: futureDate(20) } }); // end

    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 3: Media (Next always enabled)
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 4: Tickets
    const multiTierBtn = screen.getByRole('button', { name: /Multiple ticket tiers/i });
    fireEvent.click(multiTierBtn);

    // Default capacity is 100, so counts should be 10/30/60.
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    expect(screen.getByDisplayValue('30')).toBeInTheDocument();
    expect(screen.getByDisplayValue('60')).toBeInTheDocument();
    expect(screen.getByText(/Fully allocated/i)).toBeInTheDocument();
  });
});

