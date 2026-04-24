export interface PriceEntry {
  DKK_per_kWh: number;
  EUR_per_kWh: number;
  EXR: number;
  time_start: string;
  time_end: string;
}

export function applyVAT(price: number, includeVAT: boolean): number {
  return includeVAT ? price * 1.25 : price;
}

export function getCurrentEntry(prices: PriceEntry[]): PriceEntry | null {
  const now = new Date();
  return (
    prices.find((p) => {
      const start = new Date(p.time_start);
      const end = new Date(p.time_end);
      return now >= start && now < end;
    }) ?? null
  );
}

export function getMinEntry(prices: PriceEntry[]): PriceEntry | null {
  if (!prices.length) return null;
  return prices.reduce((min, p) => (p.DKK_per_kWh < min.DKK_per_kWh ? p : min), prices[0]);
}

export function getMaxEntry(prices: PriceEntry[]): PriceEntry | null {
  if (!prices.length) return null;
  return prices.reduce((max, p) => (p.DKK_per_kWh > max.DKK_per_kWh ? p : max), prices[0]);
}

export function getPriceColor(price: number, min: number, max: number): string {
  if (max === min) return '#55EC20';
  const ratio = (price - min) / (max - min);

  if (ratio <= 0.25) return '#55EC20';
  if (ratio <= 0.5) return '#A0CE20';
  if (ratio <= 0.75) return '#E8A020';
  return '#E86020';
}

export function formatHour(timeString: string): string {
  const date = new Date(timeString);
  const h = String(date.getHours()).padStart(2, '0');
  return `kl. ${h}.00`;
}

export function formatTimeRange(timeStart: string, timeEnd: string): string {
  const start = new Date(timeStart);
  const end = new Date(timeEnd);
  const sh = String(start.getHours()).padStart(2, '0');
  const eh = String(end.getHours()).padStart(2, '0');
  return `${sh}.00 - ${eh}.00`;
}

export function formatPrice(price: number): string {
  return price.toFixed(3);
}

export function formatDate(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
}

export function toInputDateValue(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

export function fromInputDateValue(value: string): Date {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}
