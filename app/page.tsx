'use client';

import { useEffect, useMemo, useState } from 'react';
import Header, { type Tab } from '@/components/Header';
import SettingsModal from '@/components/SettingsModal';
import LigeNuView from '@/components/views/LigeNuView';
import OversigView from '@/components/views/OversigView';
import HistorikView from '@/components/views/HistorikView';
import { fetchPrices } from '@/lib/api';
import type { PriceEntry } from '@/lib/priceUtils';
import { useSettings } from '@/context/SettingsContext';

export default function HomePage() {
  const { settings } = useSettings();
  const [activeTab, setActiveTab] = useState<Tab>('ligenu');
  const [showSettings, setShowSettings] = useState(false);

  const [prices, setPrices] = useState<PriceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchPrices(new Date(), settings.region)
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
  }, [settings.region]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchPrices(new Date(), settings.region)
        .then(setPrices)
        .catch(() => {});
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [settings.region]);

  const sharedProps = useMemo(
    () => ({ prices, loading, error }),
    [prices, loading, error]
  );

  return (
    <>
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSettingsClick={() => setShowSettings(true)}
      />

      <main className="md:hidden">
        {activeTab === 'ligenu' && <LigeNuView {...sharedProps} />}
        {activeTab === 'oversigt' && <OversigView {...sharedProps} />}
        {activeTab === 'historik' && <HistorikView />}
      </main>

      <main className="hidden md:grid md:grid-cols-3 md:divide-x md:divide-[#333538] md:min-h-[calc(100vh-56px)]">
        <div className="overflow-y-auto">
          <LigeNuView {...sharedProps} />
        </div>

        <div className="overflow-y-auto">
          <OversigView {...sharedProps} />
        </div>

        <div className="overflow-y-auto">
          <HistorikView />
        </div>
      </main>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
}
