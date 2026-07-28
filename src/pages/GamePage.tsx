import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ERAS_DATA } from '../data/gameData';
import { TrackType, EraId, Challenge } from '../types/game';
import { TemporalHeader } from '../components/game/TemporalHeader';
import { CodeEditorTerminal } from '../components/game/CodeEditorTerminal';
import { MissionHud } from '../components/game/MissionHud';
import { MatrixGrid } from '../components/game/MatrixGrid';
import { LivePreviewCanvas } from '../components/game/LivePreviewCanvas';
import { VictoryModal } from '../components/game/VictoryModal';
import { LeaderboardModal } from '../components/game/LeaderboardModal';
import { SupportedLanguage, stripComments } from '../utils/codeSandbox';
import { getStoredProgress, saveProgressLocally, syncProgressWithSupabase, submitLeaderboardScore } from '../services/gameService';
import { Navbar } from '../components/Navbar';
import { ChevronRight, Lock } from 'lucide-react';

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
  const [dronePos, setDronePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(
    trackParam === 'frontend' ? 'html' : 'javascript'
  );

  // Initialize progress from storage
  useEffect(() => {
    const saved = getStoredProgress();
    const activeTrack = trackParam || saved.track || 'backend';
    setTrack(activeTrack);
    setCurrentEraId(saved.currentEra || 'era_01');
    setXp(saved.xp || 0);
    setCompletedChallenges(saved.completedChallenges || []);
    setSelectedLanguage(activeTrack === 'frontend' ? 'html' : 'javascript');
  }, [trackParam]);

  // Reset drone position on challenge change
  useEffect(() => {
    setDronePos({ x: 0, y: 0 });
  }, [currentChallengeIndex, currentEraId]);

  const currentEra = ERAS_DATA.find((e) => e.id === currentEraId) || ERAS_DATA[0];
  const eraChallenges = currentEra.challenges.filter((c) => c.track === track);
  const activeChallenge: Challenge | undefined = eraChallenges[currentChallengeIndex] || eraChallenges[0];

  const handleChallengeSuccess = async (_userCode: string, timeSeconds: number) => {
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
      // Advance to next Sector if available
      const eraIndex = ERAS_DATA.findIndex((e) => e.id === currentEraId);
      if (eraIndex + 1 < ERAS_DATA.length) {
        const nextEra = ERAS_DATA[eraIndex + 1];
        setCurrentEraId(nextEra.id);
        setCurrentChallengeIndex(0);
      } else {
        // Reset to sector 1 for replay
        setCurrentEraId('era_01');
        setCurrentChallengeIndex(0);
      }
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 relative">
      {/* LAYER 0: Viewport Fullscreen Game World Background */}
      {track === 'backend' ? (
        <MatrixGrid dronePos={dronePos} gridSize={6} />
      ) : (
        <LivePreviewCanvas code={activeChallenge ? stripComments(activeChallenge.initialCodeKey) : ''} isFullscreen={true} />
      )}

      {/* LAYER 50: Header Bar & Navbar */}
      <div className="relative z-50">
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

        {/* Sectors Timeline Selector */}
        <div className="px-6 pt-3 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pointer-events-auto">
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
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all shrink-0 backdrop-blur-md ${
                  isActive
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                    : isUnlocked
                    ? 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    : 'bg-slate-950/40 border-slate-900 text-slate-600 cursor-not-allowed'
                }`}
              >
                <span>{t('era_label')} 0{idx + 1} ({era.yearRange})</span>
                {!isUnlocked && <Lock className="w-3 h-3 text-slate-600" />}
                {idx < ERAS_DATA.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-slate-700 ml-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* LAYER 30: Floating Mission HUD (Top-Left, below header & sectors) */}
      {activeChallenge && (
        <MissionHud
          challenge={activeChallenge}
          selectedLanguage={selectedLanguage}
        />
      )}

      {/* LAYER 40: Floating Code Editor Terminal (Bottom-Right) */}
      {activeChallenge && (
        <CodeEditorTerminal
          key={activeChallenge.id + selectedLanguage}
          challenge={activeChallenge}
          onSuccess={handleChallengeSuccess}
          selectedLanguage={selectedLanguage}
          onLanguageChange={(lang) => setSelectedLanguage(lang)}
          dronePos={dronePos}
          onDroneMove={(newPos) => setDronePos(newPos)}
        />
      )}

      {/* LAYER 100: Fullscreen Victory Modal Overlay */}
      {showVictoryModal && activeChallenge && (
        <VictoryModal
          challenge={activeChallenge}
          timeSeconds={lastVictoryTime}
          onNextChallenge={handleNextChallenge}
        />
      )}

      {/* LAYER 100: Leaderboard Modal */}
      {showLeaderboard && (
        <LeaderboardModal onClose={() => setShowLeaderboard(false)} />
      )}
    </div>
  );
};
