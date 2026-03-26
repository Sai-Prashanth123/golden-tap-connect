import type { Event } from '@/services/events.service';

export type TicketTierDisplay = {
  id: string;
  name: string;
  seats: number;
  price: number;
  priceLabel: string;
};

function formatINR(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function getEnabledTicketTiers(event: Pick<Event, 'ticketTypes'>) {
  const tiers = event.ticketTypes ?? [];
  return tiers.filter((t) => t.isEnabled ?? true);
}

export function getRegistrationPricing(event: Pick<Event, 'ticketPrice' | 'ticketTypes'>) {
  const enabledTiers = getEnabledTicketTiers(event);

  // Multi-tier: show tiers list and derive a "top" label.
  if (enabledTiers.length > 0) {
    const tiers: TicketTierDisplay[] = enabledTiers.map((t) => {
      const priceNum = Number(t.price) || 0;
      return {
        id: t.id,
        name: t.name,
        seats: t.count,
        price: priceNum,
        priceLabel: priceNum > 0 ? formatINR(priceNum) : 'Free',
      };
    });

    const positivePrices = tiers.map((t) => t.price).filter((p) => p > 0);
    const topLabel = positivePrices.length > 0 ? formatINR(Math.min(...positivePrices)) : 'Free';

    return { topLabel, tiers, isMultiTier: true };
  }

  // Single-tier: use ticketPrice.
  const priceNum = event.ticketPrice == null ? 0 : Number(event.ticketPrice);
  const topLabel = priceNum > 0 ? formatINR(priceNum) : 'Free';
  return { topLabel, tiers: [] as TicketTierDisplay[], isMultiTier: false };
}

