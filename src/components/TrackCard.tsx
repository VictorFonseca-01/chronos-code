import React from 'react';
import { useTranslation } from 'react-i18next';
import { LucideIcon, CheckCircle2, Sparkles, Cpu, Layout } from 'lucide-react';

export type TrackType = 'backend' | 'frontend';

interface TrackCardProps {
  id: TrackType;
  titleKey: string;
  descKey: string;
  eraKey: string;
  isSelected: boolean;
  onSelect: (track: TrackType) => void;
}

export const TrackCard: React.FC<TrackCardProps> = ({
  id,
  titleKey,
  descKey,
  eraKey,
  isSelected,
  onSelect,
}) => {
  const { t } = useTranslation();

  const isBackend = id === 'backend';
  const Icon: LucideIcon = isBackend ? Cpu : Layout;

  const activeRing = isBackend
    ? 'ring-2 ring-blue-500 border-blue-500/50 bg-blue-950/20 shadow-[0_0_40px_rgba(59,130,246,0.25)]'
    : 'ring-2 ring-purple-500 border-purple-500/50 bg-purple-950/20 shadow-[0_0_40px_rgba(168,85,247,0.25)]';

  const iconBg = isBackend
    ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    : 'bg-purple-500/10 text-purple-400 border-purple-500/30';

  const eraBadgeBg = isBackend
    ? 'bg-blue-900/40 text-blue-300 border-blue-700/50'
    : 'bg-purple-900/40 text-purple-300 border-purple-700/50';

  return (
    <div
      onClick={() => onSelect(id)}
      className={`relative cursor-pointer rounded-3xl p-6 sm:p-8 transition-all duration-300 backdrop-blur-xl border glass-panel ${
        isSelected ? activeRing : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70 hover:-translate-y-1.5'
      }`}
    >
      {/* Top indicator & badge */}
      <div className="flex items-center justify-between mb-6">
        <div className={`p-4 rounded-2xl border ${iconBg} transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="w-8 h-8 animate-pulse-glow" />
        </div>

        {isSelected ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold tracking-wide">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t('selected_badge')}</span>
          </div>
        ) : (
          <span className="text-xs font-mono text-slate-500 tracking-wider">TRACK 0{isBackend ? '1' : '2'}</span>
        )}
      </div>

      {/* Card Content */}
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          {t(titleKey)}
        </h3>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          {t(descKey)}
        </p>
      </div>

      {/* Era Info Footer */}
      <div className="mt-8 pt-5 border-t border-slate-800/80 flex items-center justify-between">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono ${eraBadgeBg}`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t(eraKey)}</span>
        </div>
      </div>
    </div>
  );
};
