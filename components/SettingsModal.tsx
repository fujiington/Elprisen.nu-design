'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

import { useSettings } from '@/context/SettingsContext';
import Toggle from './Toggle';
import type { Region } from '@/context/SettingsContext';

interface SettingsModalProps {
  onClose: () => void;
}

const regionOptions: { value: Region; label: string }[] = [
  { value: 'DK2', label: 'REGION ØST' },
  { value: 'DK1', label: 'REGION VEST' },
];

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const { settings, setIncludeVAT, setLowestPriceAlarm, setRegion } = useSettings();
  const [regionOpen, setRegionOpen] = useState(false);

  const handleAlarmToggle = async (val: boolean) => {
    if (val && 'Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') return;
    }
    setLowestPriceAlarm(val);
  };

  const selectedRegionLabel =
    regionOptions.find((o) => o.value === settings.region)?.label ?? 'VÆLG REGION';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-sm rounded-2xl bg-[#2A2B2E] p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-price-green hover:text-white text-xl transition-colors"
          aria-label="Luk indstillinger"
        >
          <FontAwesomeIcon icon={faCircleXmark} />
        </button>

        <h2 className="text-center text-lg font-bold tracking-[0.25em] text-price-muted mb-10">
          INDSTILLINGER
        </h2>

        <div className="flex items-center justify-between mb-8">
          <span className="text-xs font-bold tracking-widest text-price-muted">PRISER INKL. MOMS</span>
          <Toggle
            checked={settings.includeVAT}
            onChange={setIncludeVAT}
            dashed
            id="toggle-vat"
          />
        </div>

        <div className="flex items-center justify-between mb-10">
          <span className="text-xs font-bold tracking-widest text-price-muted">LAVESTE PRIS ALARM</span>
          <Toggle
            checked={settings.lowestPriceAlarm}
            onChange={handleAlarmToggle}
            id="toggle-alarm"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-widest text-price-muted">VÆLG REGION</span>

          <div className="relative">
            <button
              onClick={() => setRegionOpen((o) => !o)}
              className="flex items-center gap-2 rounded-md border border-[#444649] bg-[#333538] px-3 py-2 text-xs font-bold tracking-widest text-price-muted hover:border-price-green transition-colors min-w-[130px] justify-between"
            >
              {selectedRegionLabel}
              <FontAwesomeIcon
                icon={regionOpen ? faChevronUp : faChevronDown}
                className="text-price-muted text-xs"
              />
            </button>

            {regionOpen && (
              <div className="absolute right-0 top-full mt-1 w-full rounded-md border border-[#444649] bg-[#333538] overflow-hidden z-10 shadow-lg">
                {regionOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setRegion(opt.value);
                      setRegionOpen(false);
                    }}
                    className={`block w-full px-3 py-2 text-left text-xs font-bold tracking-widest transition-colors ${
                      settings.region === opt.value
                        ? 'text-price-green'
                        : 'text-price-muted hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
