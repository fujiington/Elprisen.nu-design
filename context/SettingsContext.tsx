'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Region = 'DK1' | 'DK2';

export interface Settings {
  includeVAT: boolean;
  lowestPriceAlarm: boolean;
  region: Region;
}

const defaultSettings: Settings = {
  includeVAT: false,
  lowestPriceAlarm: false,
  region: 'DK2',
};

interface SettingsContextValue {
  settings: Settings;
  setIncludeVAT: (v: boolean) => void;
  setLowestPriceAlarm: (v: boolean) => void;
  setRegion: (v: Region) => void;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: defaultSettings,
  setIncludeVAT: () => {},
  setLowestPriceAlarm: () => {},
  setRegion: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('elprisen-settings');
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<Settings>;
        setSettings((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem('elprisen-settings', JSON.stringify(settings));
  }, [settings, hydrated]);

  const setIncludeVAT = (v: boolean) => setSettings((s) => ({ ...s, includeVAT: v }));
  const setLowestPriceAlarm = (v: boolean) => setSettings((s) => ({ ...s, lowestPriceAlarm: v }));
  const setRegion = (v: Region) => setSettings((s) => ({ ...s, region: v }));

  return (
    <SettingsContext.Provider value={{ settings, setIncludeVAT, setLowestPriceAlarm, setRegion }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
