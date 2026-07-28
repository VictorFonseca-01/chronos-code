import React from 'react';
import { useTranslation } from 'react-i18next';
import { Trophy, Sparkles, Rocket, ArrowRight, Zap } from 'lucide-react';
import { Challenge } from '../../types/game';

interface VictoryModalProps {
  challenge: Challenge;
  timeSeconds: number;
  onNextChallenge: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  challenge,
  timeSeconds,
  onNextChallenge,
}) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fade-in">
      <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-slate-800 p-8 space-y-6 text-center shadow-2xl relative overflow-hidden">
        {/* Glow ambient background accent */}
        <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-blue-500/20 blur-3xl" />

        {/* Icon Header */}
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-[0_0_40px_rgba(16,185,129,0.4)] animate-bounce">
          <Trophy className="w-10 h-10 fill-current" />
        </div>

        {/* Title */}
        <div className="space-y-2 relative">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            {t('level_complete')}
          </h2>
          <p className="text-slate-400 text-sm">
            {t('challenge_completed_intro')}{' '}
            <span className="text-emerald-400 font-semibold">{t(challenge.titleKey)}</span>.
          </p>
        </div>

        {/* Rewards Summary Box */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left font-mono text-xs">
          <div className="space-y-1">
            <span className="text-slate-500 block uppercase tracking-wider">{t('xp_gained')}</span>
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-base">
              <Zap className="w-4 h-4 fill-amber-400" />
              <span>+{challenge.xpReward} XP</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-500 block uppercase tracking-wider">{t('completion_time')}</span>
            <div className="flex items-center gap-1.5 text-blue-400 font-bold text-base">
              <Sparkles className="w-4 h-4" />
              <span>{timeSeconds}s</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onNextChallenge}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl gradient-cyber text-white font-bold text-base shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          <Rocket className="w-5 h-5 animate-pulse" />
          <span>{t('next_challenge')}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
