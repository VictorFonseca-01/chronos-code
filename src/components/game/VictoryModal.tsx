import React from 'react';
import { useTranslation } from 'react-i18next';
import { Trophy, Sparkles, Rocket, ArrowRight, Zap, CheckCircle } from 'lucide-react';
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
    <div className="fixed inset-0 w-screen h-screen z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-3xl animate-in fade-in zoom-in duration-500 overflow-hidden">
      {/* Background Ambient Glow & Neon Laser Particles */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/15 blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/15 blur-[120px] animate-pulse" />

      {/* Main RPG Codédex Victory Card */}
      <div className="max-w-2xl w-full rounded-3xl bg-slate-900/90 border border-slate-800 p-8 sm:p-12 space-y-8 text-center shadow-[0_0_100px_rgba(16,185,129,0.25)] relative overflow-hidden backdrop-blur-2xl">
        {/* Top Badge Banner */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold tracking-widest uppercase">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>SISTEMA RESTAURADO • MATRIZ ESTÁVEL</span>
        </div>

        {/* Icon Header */}
        <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-300 text-slate-950 shadow-[0_0_50px_rgba(16,185,129,0.5)] animate-bounce">
          <Trophy className="w-12 h-12 fill-current" />
        </div>

        {/* Giant Typography Title */}
        <div className="space-y-3 relative">
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase leading-none gradient-title">
            {t('level_complete')}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-lg mx-auto font-light">
            {t('challenge_completed_intro')}{' '}
            <span className="text-emerald-400 font-bold underline decoration-emerald-500/40">{t(challenge.titleKey)}</span>.
          </p>
        </div>

        {/* Reward Stats Grid Box */}
        <div className="grid grid-cols-2 gap-4 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-left font-mono">
          <div className="space-y-1">
            <span className="text-slate-500 block uppercase tracking-wider text-xs">{t('xp_gained')}</span>
            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-2xl sm:text-3xl">
              <Zap className="w-6 h-6 fill-amber-400" />
              <span>+{challenge.xpReward} XP</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-500 block uppercase tracking-wider text-xs">{t('completion_time')}</span>
            <div className="flex items-center gap-2 text-blue-400 font-extrabold text-2xl sm:text-3xl">
              <Sparkles className="w-6 h-6" />
              <span>{timeSeconds}s</span>
            </div>
          </div>
        </div>

        {/* Action Next Era Button */}
        <button
          onClick={onNextChallenge}
          className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl gradient-cyber text-white font-black text-lg sm:text-xl tracking-wide shadow-[0_0_40px_rgba(59,130,246,0.5)] hover:scale-105 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          <Rocket className="w-6 h-6 animate-bounce" />
          <span>{t('next_challenge')}</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
