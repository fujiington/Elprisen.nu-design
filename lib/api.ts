import type { PriceEntry } from './priceUtils';
import type { Region } from '@/context/SettingsContext';

export async function fetchPrices(date: Date, region: Region): Promise<PriceEntry[]> {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const params = new URLSearchParams({
    year: String(year),
    month,
    day,
    region,
  });

  const res = await fetch(`/api/prices?${params.toString()}`);

  if (!res.ok) {
    throw new Error(`Kunne ikke hente elpriser (${res.status})`);
  }

  return res.json() as Promise<PriceEntry[]>;
}
