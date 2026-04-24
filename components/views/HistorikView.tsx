'use client';

import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';

import PriceRow from '@/components/PriceRow';
import {
  getPriceColor,
  getMinEntry,
  getMaxEntry,
  formatHour,
  formatDate,
  toInputDateValue,
  fromInputDateValue,
  applyVAT,
} from '@/lib/priceUtils';
import type { PriceEntry } from '@/lib/priceUtils';
import { fetchPrices } from '@/lib/api';
import { useSettings } from '@/context/SettingsContext';

export default function HistorikView() {
  const { settings } = useSettings();

  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [prices, setPrices] = useState<PriceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const minRaw = useMemo(() => getMinEntry(prices)?.DKK_per_kWh ?? 0, [prices]);
  const maxRaw = useMemo(() => getMaxEntry(prices)?.DKK_per_kWh ?? 0, [prices]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchPrices(selectedDate, settings.region)
      .then((data) => {
        if (!cancelled) setPrices(data);
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : 'Ukendt fejl');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDate, settings.region]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) setSelectedDate(fromInputDateValue(e.target.value));
  };

  const inputRef = (node: HTMLInputElement | null) => {
    // Keep input ref for calendar trigger
    if (node) node.dataset.ref = 'date-input';
  };

  return (
    <section className="flex flex-col pt-10 pb-6 px-6 min-h-[calc(100vh-56px)] md:min-h-0">
      <h1 className="text-xl font-bold tracking-[0.3em] text-price-muted mb-8 text-center">
        HISTORIK
      </h1>

      {/* Date picker */}
      <div className="relative mb-8">
        <div className="flex items-center justify-between rounded-lg border border-[#444649] bg-[#2E2F32] px-4 py-3">
          <label
            htmlFor="history-date"
            className="text-sm font-medium text-price-muted cursor-pointer select-none"
          >
            {formatDate(selectedDate)}
          </label>
          <label htmlFor="history-date" className="cursor-pointer text-price-green">
            <FontAwesomeIcon icon={faCalendarDays} />
          </label>
        </div>
        <input
          ref={inputRef}
          id="history-date"
          type="date"
          value={toInputDateValue(selectedDate)}
          onChange={handleDateChange}
          max={toInputDateValue(new Date())}
          min="2022-11-01"
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          aria-label="Vælg dato"
        />
      </div>

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
          {/* List header */}
          <p className="text-[10px] font-bold tracking-widest text-price-muted mb-3 text-center">
            ELPRISERNE D. {formatDate(selectedDate)}
          </p>

          {/* Price list */}
          <div className="flex flex-col gap-2">
            {prices.map((entry) => {
              const displayPrice = applyVAT(entry.DKK_per_kWh, settings.includeVAT);
              const color = getPriceColor(entry.DKK_per_kWh, minRaw, maxRaw);
              return (
                <PriceRow
                  key={entry.time_start}
                  time={formatHour(entry.time_start)}
                  price={displayPrice}
                  color={color}
                />
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
