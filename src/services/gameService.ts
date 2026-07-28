import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { PlayerProgressState, LeaderboardEntry } from '../types/game';

const LOCAL_STORAGE_KEY = 'chronos_player_progress';

export const getStoredProgress = (): PlayerProgressState => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Erro ao ler progresso do localStorage:', err);
  }

  return {
    track: 'backend',
    currentEra: 'era_01',
    xp: 0,
    completedChallenges: [],
  };
};

export const saveProgressLocally = (progress: PlayerProgressState): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.warn('Erro ao salvar no localStorage:', err);
  }
};

export const syncProgressWithSupabase = async (
  userId: string,
  progress: PlayerProgressState
): Promise<boolean> => {
  saveProgressLocally(progress);

  if (!isSupabaseConfigured || !supabase) {
    return false;
  }

  try {
    const { error } = await supabase
      .from('player_progress')
      .upsert(
        {
          user_id: userId,
          track: progress.track,
          current_era: progress.currentEra,
          xp: progress.xp,
          completed_challenges: progress.completedChallenges,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,track' }
      );

    if (error) {
      console.error('Erro ao sincronizar com o Supabase:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Exceção ao sincronizar com o Supabase:', err);
    return false;
  }
};

export const submitLeaderboardScore = async (entry: LeaderboardEntry): Promise<boolean> => {
  if (!isSupabaseConfigured || !supabase) {
    return false;
  }

  try {
    const { error } = await supabase.from('leaderboard').insert([
      {
        username: entry.username || 'ChronoCoder',
        track: entry.track,
        challenge_id: entry.challenge_id,
        score: entry.score,
        completion_time_seconds: entry.completion_time_seconds,
      },
    ]);

    if (error) {
      console.error('Erro ao enviar pontuação para o leaderboard:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Exceção no leaderboard:', err);
    return false;
  }
};

export const fetchTopLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Erro ao carregar leaderboard:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Exceção ao buscar leaderboard:', err);
    return [];
  }
};
