import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { TrackCard, TrackType } from '../components/TrackCard';
import { Play, Sparkles, Compass, Terminal, Rocket } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedTrack, setSelectedTrack] = useState<TrackType | null>(null);

  const handleStartGame = () => {
    if (selectedTrack) {
      navigate(`/game?track=${selectedTrack}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-grid-pattern relative">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col justify-between">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-6 pt-4 sm:pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs sm:text-sm font-medium tracking-wide backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-blue-400 animate-spin-slow" />
            <span>{t('welcome_message')}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            <span className="gradient-title">{t('welcome_title')}</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 leading-relaxed font-light">
            {t('hero_tagline')}
          </p>
        </section>

        {/* Track Selection Section */}
        <section className="my-12 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
              <Compass className="w-6 h-6 text-purple-400" />
              <span>{t('select_track')}</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
              {t('select_track_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            <TrackCard
              id="backend"
              titleKey="backend_track_title"
              descKey="backend_track_desc"
              eraKey="backend_track_era"
              isSelected={selectedTrack === 'backend'}
              onSelect={(track) => setSelectedTrack(track)}
            />

            <TrackCard
              id="frontend"
              titleKey="frontend_track_title"
              descKey="frontend_track_desc"
              eraKey="frontend_track_era"
              isSelected={selectedTrack === 'frontend'}
              onSelect={(track) => setSelectedTrack(track)}
            />
          </div>
        </section>

        {/* CTA Launch Control */}
        <section className="text-center pb-8">
          <div className="inline-block p-1 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            <button
              onClick={handleStartGame}
              disabled={!selectedTrack}
              className={`flex items-center gap-3 px-8 sm:px-12 py-4 sm:py-5 rounded-2xl text-base sm:text-lg font-bold tracking-wide transition-all duration-300 ${
                selectedTrack
                  ? 'gradient-cyber text-white shadow-[0_0_35px_rgba(59,130,246,0.5)] hover:scale-105 hover:brightness-110 active:scale-95 cursor-pointer'
                  : 'bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              {selectedTrack ? (
                <>
                  <Rocket className="w-5 h-5 animate-bounce" />
                  <span>{t('start_game')}</span>
                  <Play className="w-5 h-5 fill-current ml-1" />
                </>
              ) : (
                <>
                  <Terminal className="w-5 h-5 text-slate-500" />
                  <span>{t('select_to_continue')}</span>
                </>
              )}
            </button>
          </div>
        </section>
      </main>

      {/* Footer minimal info */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500 font-mono">
        Chronos Code Evolution &copy; {new Date().getFullYear()} — Temporal Coding Odyssey
      </footer>
    </div>
  );
};
