import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { ArrowLeft, Cpu, Layout, Radio, Shield, Sparkles, Terminal, Activity } from 'lucide-react';

export const GamePlaceholderPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const track = searchParams.get('track') || 'backend';
  const isBackend = track === 'backend';

  const TrackIcon = isBackend ? Cpu : Layout;
  const trackTitleKey = isBackend ? 'backend_track_title' : 'frontend_track_title';
  const trackEraKey = isBackend ? 'backend_track_era' : 'frontend_track_era';

  return (
    <div className="min-h-screen flex flex-col bg-grid-pattern relative">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col justify-center items-center">
        <div className="w-full rounded-3xl glass-panel p-8 sm:p-12 border border-slate-800 space-y-8 relative overflow-hidden shadow-2xl">
          {/* Top glowing ambient accent */}
          <div
            className={`absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-30 ${
              isBackend ? 'bg-blue-500' : 'bg-purple-500'
            }`}
          />

          {/* Header Status */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                <Radio className="w-6 h-6 animate-pulse text-blue-400" />
              </div>
              <div>
                <span className="text-xs font-mono text-slate-400 tracking-wider uppercase">
                  {t('temporal_coordinates')}
                </span>
                <h2 className="text-lg font-mono font-bold text-white flex items-center gap-2">
                  ERA_01 // <span className="text-blue-400">CHRONO_LEAP</span>
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
              <Activity className="w-3.5 h-3.5" />
              <span>{t('status_ready')}</span>
            </div>
          </div>

          {/* Main Title & Subtitle */}
          <div className="space-y-3 text-center sm:text-left">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight flex items-center justify-center sm:justify-start gap-3">
              <Sparkles className="w-8 h-8 text-blue-400" />
              <span>{t('game_placeholder_title')}</span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl font-light">
              {t('game_placeholder_subtitle')}
            </p>
          </div>

          {/* Chosen Track Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/80 rounded-2xl p-6 border border-slate-800">
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                {t('chosen_track_label')}
              </span>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${isBackend ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                  <TrackIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {t(trackTitleKey)}
                </h3>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                {t('era_briefing_label')}
              </span>
              <div className="flex items-center gap-2 text-slate-200 font-mono text-sm">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>{t(trackEraKey)}</span>
              </div>
            </div>
          </div>

          {/* Briefing Text Box */}
          <div className="bg-slate-950/80 rounded-2xl p-6 border border-slate-800/80 font-mono text-xs sm:text-sm text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-semibold mb-2">
              <Shield className="w-4 h-4" />
              <span>[CHRONOS LOG // INITIALIZATION]</span>
            </div>
            <p className="text-slate-400">
              &gt; Sincronização temporal estabelecida com sucesso.
            </p>
            <p className="text-slate-400">
              &gt; Módulo de jogo em carregamento ativo para a próxima etapa da jornada.
            </p>
            <p className="text-emerald-400">
              &gt; Sistema pronto para recepção dos primeiros desafios de código.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:border-slate-500 transition-all duration-200 font-medium text-sm shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('back_to_home')}</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
