import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Challenge, MultiLanguageMap } from '../../types/game';
import { SupportedLanguage } from '../../utils/codeSandbox';

interface MissionHudProps {
  challenge: Challenge;
  selectedLanguage: SupportedLanguage;
}

export const MissionHud: React.FC<MissionHudProps> = ({
  challenge,
  selectedLanguage,
}) => {
  const { t } = useTranslation();
  const [showHint, setShowHint] = useState<boolean>(false);
  const [activeHintIndex, setActiveHintIndex] = useState<number>(0);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const getTranslatedDescription = () => {
    if (typeof challenge.descriptionKey === 'object' && challenge.descriptionKey[selectedLanguage]) {
      const key = challenge.descriptionKey[selectedLanguage]!;
      return t(key);
    }
    return t(challenge.descriptionKey as string);
  };

  const getActiveHints = (): string[] => {
    if (typeof challenge.hintsKeys === 'object' && !Array.isArray(challenge.hintsKeys) && (challenge.hintsKeys as MultiLanguageMap<string[]>)[selectedLanguage]) {
      return (challenge.hintsKeys as MultiLanguageMap<string[]>)[selectedLanguage]!;
    }
    return Array.isArray(challenge.hintsKeys) ? challenge.hintsKeys : [];
  };

  const activeHints = getActiveHints();

  return (
    <div className="fixed top-28 left-6 max-w-md w-[calc(100vw-3rem)] sm:w-full backdrop-blur-xl bg-slate-950/85 p-5 border border-slate-800/90 rounded-2xl z-30 shadow-2xl space-y-3 transition-all duration-300">
      {/* Header bar with minimize toggle */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-white tracking-tight">
            {t(challenge.titleKey)}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
            +{challenge.xpReward} XP
          </span>

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title={isMinimized ? "Expandir HUD" : "Minimizar HUD"}
          >
            {isMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="space-y-3 animate-fade-in">
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
            {getTranslatedDescription()}
          </p>

          {/* Context Briefing box */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-400 space-y-1">
            <span className="text-blue-400 font-semibold block uppercase tracking-wider text-[10px]">
              [CHRONO BRIEFING]
            </span>
            <p className="text-slate-300 leading-normal">
              {t(challenge.contextKey as string)}
            </p>
          </div>

          {/* Hints Accordion */}
          <div className="pt-1">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1.5 text-xs font-mono text-purple-400 hover:text-purple-300 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHint ? t('hide_hint') : t('show_hint')}</span>
            </button>

            {showHint && activeHints.length > 0 && (
              <div className="mt-2 p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs font-mono text-purple-200 space-y-1.5">
                <p className="text-purple-300 font-semibold text-[11px]">
                  💡 {t('hint_label')} #{activeHintIndex + 1}:
                </p>
                <p>{t(activeHints[activeHintIndex])}</p>
                {activeHints.length > 1 && (
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() =>
                        setActiveHintIndex((prev) => (prev + 1) % activeHints.length)
                      }
                      className="px-2 py-0.5 rounded bg-purple-900/50 hover:bg-purple-800 text-[10px] text-purple-200"
                    >
                      {t('next_hint')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
