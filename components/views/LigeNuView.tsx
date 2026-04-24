'use client';

import { useEffect, useMemo } from 'react';
import PriceGauge from '@/components/PriceGauge';
import {
  getCurrentEntry,
  formatTimeRange,
  applyVAT,
} from '@/lib/priceUtils';
import type { PriceEntry } from '@/lib/priceUtils';
import { useSettings } from '@/context/SettingsContext';

interface LigeNuViewProps {
  prices: PriceEntry[];
  loading: boolean;
  error: string | null;
}

export default function LigeNuView({ prices, loading, error }: LigeNuViewProps) {
  const { settings } = useSettings();

  const current = useMemo(() => getCurrentEntry(prices), [prices]);

  const displayPrice = current
    ? applyVAT(current.DKK_per_kWh, settings.includeVAT)
    : null;

  const timeRange = current ? formatTimeRange(current.time_start, current.time_end) : null;

  useEffect(() => {
    if (!settings.lowestPriceAlarm || !prices.length) return;
    if (Notification.permission !== 'granted') return;

    const cheapest = prices.reduce((min, p) =>
      p.DKK_per_kWh < min.DKK_per_kWh ? p : min,
      prices[0]
    );

    const now = new Date();
    const start = new Date(cheapest.time_start);
    const end = new Date(cheapest.time_end);
    const notifiedKey = `alarm-notified-${cheapest.time_start}`;

    if (now >= start && now < end && !sessionStorage.getItem(notifiedKey)) {
      new Notification('Laveste elpris!', {
        body: `Det billigste tidspunkt er nu: ${cheapest.DKK_per_kWh.toFixed(3)} kr/kWh`,
        icon: '/icons/android/android-launchericon-192-192.png',
      });
      sessionStorage.setItem(notifiedKey, '1');
      return;
    }

    if (start > now) {
      const ms = start.getTime() - now.getTime();
      const timer = setTimeout(() => {
        if (!sessionStorage.getItem(notifiedKey)) {
          new Notification('Laveste elpris!', {
            body: `Det billigste tidspunkt er nu: ${cheapest.DKK_per_kWh.toFixed(3)} kr/kWh`,
            icon: '/icons/android/android-launchericon-192-192.png',
          });
          sessionStorage.setItem(notifiedKey, '1');
        }
      }, ms);
      return () => clearTimeout(timer);
    }
  }, [prices, settings.lowestPriceAlarm]);

  return (
    <section className="flex flex-col items-center pt-10 pb-6 px-6 min-h-[calc(100vh-56px)] md:min-h-0">
      <h1 className="text-xl font-bold tracking-[0.3em] text-price-muted mb-10 text-center">
        ELPRISEN LIGE NU
      </h1>

      {loading && (
        <div className="flex flex-1 items-center justify-center">
          <span className="text-price-muted animate-pulse">Henter priser…</span>
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-red-400 text-sm text-center">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <PriceGauge price={displayPrice} size="lg" />

          <p className="mt-8 text-price-green text-sm tracking-widest font-medium">
            {timeRange ?? '—'}
          </p>
        </>
      )}
    </section>
  );
}
