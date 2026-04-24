'use client';

import { useMemo } from 'react';
import PriceGauge from '@/components/PriceGauge';
import PriceRow from '@/components/PriceRow';
import {
  getMinEntry,
  getMaxEntry,
  getCurrentEntry,
  getPriceColor,
  formatHour,
  applyVAT,
} from '@/lib/priceUtils';
import type { PriceEntry } from '@/lib/priceUtils';
import { useSettings } from '@/context/SettingsContext';

interface OversigViewProps {
  prices: PriceEntry[];
  loading: boolean;
  error: string | null;
}

export default function OversigView({ prices, loading, error }: OversigViewProps) {
  const { settings } = useSettings();

  const minEntry = useMemo(() => getMinEntry(prices), [prices]);
  const maxEntry = useMemo(() => getMaxEntry(prices), [prices]);
  const current = useMemo(() => getCurrentEntry(prices), [prices]);

  const minRaw = minEntry?.DKK_per_kWh ?? 0;
  const maxRaw = maxEntry?.DKK_per_kWh ?? 0;

  const minDisplay = minEntry ? applyVAT(minEntry.DKK_per_kWh, settings.includeVAT) : null;
  const maxDisplay = maxEntry ? applyVAT(maxEntry.DKK_per_kWh, settings.includeVAT) : null;

  const regionLabel = settings.region === 'DK2' ? 'ØST DANMARK' : 'VEST DANMARK';

  return (
    <section className="flex flex-col pt-10 pb-6 px-6 min-h-[calc(100vh-56px)] md:min-h-0">
      <h1 className="text-xl font-bold tracking-[0.3em] text-price-muted mb-8 text-center">
        OVERSIGT
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
          {/* Min / Max gauges */}
          <div className="flex items-end justify-center gap-8 mb-10">
            <div className="flex flex-col items-center gap-6">
              <PriceGauge price={minDisplay} size="sm" />
              <span className="text-[10px] font-bold tracking-widest text-price-muted">
                LAVESTE PRIS
              </span>
            </div>
            <div className="flex flex-col items-center gap-6">
              <PriceGauge price={maxDisplay} size="sm" />
              <span className="text-[10px] font-bold tracking-widest text-price-muted">
                HØJESTE PRIS
              </span>
            </div>
          </div>

          {/* Price list */}
          <div className="flex flex-col gap-2">
            {prices.map((entry) => {
              const displayPrice = applyVAT(entry.DKK_per_kWh, settings.includeVAT);
              const color = getPriceColor(entry.DKK_per_kWh, minRaw, maxRaw);
              const isCurrent = current?.time_start === entry.time_start;
              return (
                <PriceRow
                  key={entry.time_start}
                  time={formatHour(entry.time_start)}
                  price={displayPrice}
                  color={color}
                  highlight={isCurrent}
                />
              );
            })}
          </div>

          {/* Footer info */}
          <p className="mt-6 text-[10px] tracking-widest text-gray-500 leading-relaxed">
            ALLE PRISER ER {settings.includeVAT ? 'INKL.' : 'EKSKL.'} MOMS
            {settings.includeVAT ? '.' : ' OG AFGIFTER.'}
            <br />
            DU VISES LIGE NU PRISERNE FOR REGION{' '}
            <span className="text-price-green">{regionLabel}</span>.
          </p>
        </>
      )}
    </section>
  );
}
