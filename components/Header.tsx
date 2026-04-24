'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faGear } from '@fortawesome/free-solid-svg-icons';

export type Tab = 'oversigt' | 'ligenu' | 'historik';

interface HeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onSettingsClick: () => void;
}

const navItems: { id: Tab; label: string }[] = [
  { id: 'oversigt', label: 'OVERSIGT' },
  { id: 'ligenu', label: 'LIGE NU' },
  { id: 'historik', label: 'HISTORIK' },
];

export default function Header({ activeTab, onTabChange, onSettingsClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-app-dark border-b border-[#333538] flex items-center justify-between px-4 py-3">
      {/* Logo */}
      <div className="flex-shrink-0">
        <div className="relative w-9 h-9">
          <svg viewBox="0 0 36 36" className="w-9 h-9 absolute inset-0">
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="#201E1E"
              stroke="#55EC20"
              strokeWidth="1.5"
              strokeDasharray="5 3"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <FontAwesomeIcon icon={faBolt} className="text-[#55EC20] text-sm" />
          </div>
        </div>
      </div>

      {/* Nav – hidden on desktop (all columns always visible) */}
      <nav className="flex items-center gap-4 md:hidden">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`text-xs md:text-sm font-bold tracking-widest transition-colors ${
              activeTab === item.id
                ? 'text-price-green'
                : 'text-price-muted hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Settings */}
      <button
        onClick={onSettingsClick}
        className="flex-shrink-0 text-price-green hover:text-white transition-colors text-lg"
        aria-label="Åbn indstillinger"
      >
        <FontAwesomeIcon icon={faGear} />
      </button>
    </header>
  );
}
