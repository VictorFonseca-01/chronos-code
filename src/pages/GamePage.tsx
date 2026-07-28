import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ERAS_DATA } from '../data/gameData';
import { TrackType, EraId, Challenge } from '../types/game';
import { TemporalHeader } from '../components/game/TemporalHeader';
import { CodeEditorTerminal } from '../components/game/CodeEditorTerminal';
import { VictoryModal } from '../components/game/VictoryModal';
import { LeaderboardModal } from '../components/game/LeaderboardModal';
import { getStoredProgress, saveProgressLocally, syncProgressWithSupabase, submitLeaderboardScore } from '../services/gameService';
import { Navbar } from '../components/Navbar';
import { Terminal, ChevronRight, Lock } from 'lucide-react';

export const GamePage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const trackParam = (searchParams.get('track') as TrackType) || 'backend';

  const [track, setTrack] = useState<TrackType>(trackParam);
  const [currentEraId, setCurrentEraId] = useState<EraId>('era_01');
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState<number>(0);
  const [xp, setXp] = useState<number>(0);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [lastVictoryTime, setLastVictoryTime] = useState<number>(0);

  // Initialize progress from storage
  useEffect(() => {
    const saved = getStoredProgress();
    setTrack(trackParam || saved.track || 'backend');
    setCurrentEraId(saved.currentEra || 'era_01');
    setXp(saved.xp || 0);
    setCompletedChallenges(saved.completedChallenges || []);
  }, [trackParam]);

  const currentEra = ERAS_DATA.find((e) => e.id === currentEraId) || ERAS_DATA[0];
  const eraChallenges = currentEra.challenges.filter((c) => c.track === track);

  const activeChallenge: Challenge | undefined = eraChallenges[currentChallengeIndex] || eraChallenges[0];

  const handleChallengeSuccess = async (_code: string, timeSeconds: number) => {
    if (!activeChallenge) return;

    setLastVictoryTime(timeSeconds);

    const isAlreadyCompleted = completedChallenges.includes(activeChallenge.id);
    const newXp = isAlreadyCompleted ? xp : xp + activeChallenge.xpReward;
    const newCompleted = isAlreadyCompleted
      ? completedChallenges
      : [...completedChallenges, activeChallenge.id];

    setXp(newXp);
    setCompletedChallenges(newCompleted);

    const newProgressState = {
      track,
      currentEra: currentEraId,
      xp: newXp,
      completedChallenges: newCompleted,
    };

    saveProgressLocally(newProgressState);
    syncProgressWithSupabase('guest_user_id', newProgressState);

    // Save to leaderboard
    submitLeaderboardScore({
      username: 'ChronoCoder',
      track,
      challenge_id: activeChallenge.id,
      score: newXp,
      completion_time_seconds: timeSeconds,
    });

    setShowVictoryModal(true);
  };

  const handleNextChallenge = () => {
    setShowVictoryModal(false);

    if (currentChallengeIndex + 1 < eraChallenges.length) {
      setCurrentChallengeIndex((prev) => prev + 1);
    } else {
      // Advance to next Era if available
      const eraIndex = ERAS_DATA.findIndex((e) => e.id === currentEraId);
      if (eraIndex + 1 < ERAS_DATA.length) {
        const nextEra = ERAS_DATA[eraIndex + 1];
        setCurrentEraId(nextEra.id);
        setCurrentChallengeIndex(0);
      } else {
        // Loop or reset to era 1 for replay
        setCurrentEraId('era_01');
        setCurrentChallengeIndex(0);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-grid-pattern relative">
      <Navbar />

      <TemporalHeader
        track={track}
        currentEraId={currentEraId}
        yearRange={currentEra.yearRange}
        xp={xp}
        completedCount={completedChallenges.length}
        totalCount={ERAS_DATA.flatMap((e) => e.challenges).filter((c) => c.track === track).length}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Eras Timeline Selector */}
        <section className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {ERAS_DATA.map((era, idx) => {
            const isActive = era.id === currentEraId;
            const isUnlocked = idx === 0 || completedChallenges.length >= idx;

            return (
              <button
                key={era.id}
                onClick={() => {
                  if (isUnlocked) {
                    setCurrentEraId(era.id);
                    setCurrentChallengeIndex(0);
                  }
                }}
                disabled={!isUnlocked}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border text-xs font-mono transition-all shrink-0 ${
                  isActive
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                    : isUnlocked
                    ? 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    : 'bg-slate-950/40 border-slate-900 text-slate-600 cursor-not-allowed'
                }`}
              >
                <span>{t('era_label')} 0{idx + 1} ({era.yearRange})</span>
                {!isUnlocked && <Lock className="w-3.5 h-3.5 text-slate-600" />}
                {idx < ERAS_DATA.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-700 ml-1" />
                )}
              </button>
            );
          })}
        </section>

        {/* Active Challenge Editor */}
        {activeChallenge ? (
          <CodeEditorTerminal
            key={activeChallenge.id}
            challenge={activeChallenge}
            onSuccess={handleChallengeSuccess}
          />
        ) : (
          <div className="text-center py-16 space-y-4">
            <Terminal className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-slate-400 font-mono text-sm">
              {t('no_challenges_found')}
            </p>
          </div>
        )}
      </main>

      {/* Victory Modal */}
      {showVictoryModal && activeChallenge && (
        <VictoryModal
          challenge={activeChallenge}
          timeSeconds={lastVictoryTime}
          onNextChallenge={handleNextChallenge}
        />
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <LeaderboardModal onClose={() => setShowLeaderboard(false)} />
      )}
    </div>
  );
};
