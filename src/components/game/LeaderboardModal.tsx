import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trophy, X, Zap, Cpu, Layout, RefreshCw } from 'lucide-react';
import { fetchTopLeaderboard } from '../../services/gameService';
import { LeaderboardEntry } from '../../types/game';

interface LeaderboardModalProps {
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadLeaderboard = async () => {
    setLoading(true);
    const data = await fetchTopLeaderboard();
    setEntries(data);
    setLoading(false);
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="max-w-lg w-full rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {t('leaderboard_title')}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                {t('leaderboard_subtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table / List */}
        <div className="min-h-[220px] max-h-[320px] overflow-y-auto space-y-2 pr-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3 text-slate-400 text-xs font-mono">
              <RefreshCw className="w-6 h-6 animate-spin text-purple-400" />
              <span>{t('leaderboard_loading')}</span>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12 space-y-2 text-slate-500 text-xs font-mono">
              <Trophy className="w-8 h-8 mx-auto text-slate-700" />
              <p>{t('leaderboard_empty')}</p>
              <p className="text-slate-600 text-[11px]">{t('leaderboard_empty_sub')}</p>
            </div>
          ) : (
            entries.map((item, idx) => (
              <div
                key={item.id || idx}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs font-mono hover:border-purple-500/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                      idx === 0
                        ? 'bg-amber-500 text-slate-950'
                        : idx === 1
                        ? 'bg-slate-300 text-slate-950'
                        : idx === 2
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </span>

                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-200 block">
                      {item.username}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      {item.track === 'backend' ? (
                        <Cpu className="w-3 h-3 text-blue-400" />
                      ) : (
                        <Layout className="w-3 h-3 text-purple-400" />
                      )}
                      <span className="uppercase">{item.track}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-0.5">
                  <div className="flex items-center justify-end gap-1 text-amber-400 font-bold">
                    <Zap className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{item.score} PTS</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    {item.completion_time_seconds}s
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>{t('realtime_ranking')}</span>
          <button
            onClick={loadLeaderboard}
            className="flex items-center gap-1 text-purple-400 hover:text-purple-300"
          >
            <RefreshCw className="w-3 h-3" />
            <span>{t('refresh')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
