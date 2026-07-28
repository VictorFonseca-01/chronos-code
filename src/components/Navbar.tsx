import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, ShieldCheck } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';

export const Navbar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand logo & status */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-wider text-white">
                CHRONOS <span className="text-blue-400 font-mono font-light">DEV</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300">
                <ShieldCheck className="w-3 h-3" /> v1.0.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono hidden md:block">
              {t('chronos_core_online')}
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
};
