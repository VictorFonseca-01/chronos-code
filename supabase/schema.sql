-- Schema DDL para o Supabase - Chronos Code Evolution

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de Perfis de Jogadores (Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS para Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Perfis publicos sao visiveis para todos" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Usuarios podem atualizar seu proprio perfil" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- 2. Tabela de Progresso do Jogo (Player Progress)
CREATE TABLE IF NOT EXISTS public.player_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  track TEXT NOT NULL CHECK (track IN ('backend', 'frontend')),
  current_era TEXT NOT NULL DEFAULT 'era_01',
  xp INTEGER NOT NULL DEFAULT 0,
  completed_challenges TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, track)
);

-- RLS para Player Progress
ALTER TABLE public.player_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios podem ver seu proprio progresso" 
  ON public.player_progress FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios podem inserir seu proprio progresso" 
  ON public.player_progress FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios podem atualizar seu proprio progresso" 
  ON public.player_progress FOR UPDATE 
  USING (auth.uid() = user_id);

-- 3. Tabela de Ranking / Pontuações (Leaderboard)
CREATE TABLE IF NOT EXISTS public.leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  username TEXT NOT NULL,
  track TEXT NOT NULL,
  challenge_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  completion_time_seconds INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS para Leaderboard
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ranking visivel para todos" 
  ON public.leaderboard FOR SELECT 
  USING (true);

CREATE POLICY "Usuarios autenticados podem registrar pontuacao" 
  ON public.leaderboard FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
