import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cpu, Layout, Trophy, Zap, Shield, Globe } from 'lucide-react';
import { TrackType, EraId } from '../../types/game';
import { LanguageSelector } from '../LanguageSelector';

interface TemporalHeaderProps {
  track: TrackType;
  currentEraId: EraId;
  yearRange: string;
  xp: number;
  completedCount: number;
  totalCount: number;
  onOpenLeaderboard: () => void;
}

export const TemporalHeader: React.FC<TemporalHeaderProps> = ({
  track,
  yearRange,
  xp,
  completedCount,
  totalCount,
  onOpenLeaderboard,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isBackend = track === 'backend';
  const TrackIcon = isBackend ? Cpu : Layout;
  const progressPercent = Math.round((completedCount / (totalCount || 1)) * 100);

  return (
    <header className="w-full bg-slate-950/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-30 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Navigation & Track Badge */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all text-xs font-medium"
            title={t('back_to_home')}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t('back_to_home')}</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
            <div className={`p-1 rounded-md ${isBackend ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
              <TrackIcon className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono font-bold text-slate-200 uppercase">
              {isBackend ? t('backend_track_title') : t('frontend_track_title')}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono">
            <Globe className="w-3.5 h-3.5 animate-spin-slow" />
            <span>ERA: {yearRange}</span>
          </div>
        </div>

        {/* Right: XP, Leaderboard, Progress & Language */}
        <div className="flex items-center gap-3 sm:gap-6 w-full md:w-auto justify-between md:justify-end">
          {/* XP Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs sm:text-sm font-bold">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>{xp} XP</span>
          </div>

          {/* Leaderboard Button */}
          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-500/20 transition-all text-xs font-mono font-semibold"
          >
            <Trophy className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Ranking</span>
          </button>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <Shield className="w-4 h-4 text-emerald-400" />
            <div className="w-24 sm:w-32 bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-slate-400 text-[10px] sm:text-xs">{progressPercent}%</span>
          </div>

          <LanguageSelector />
        </div>
      </div>
    </header>
  );
};
