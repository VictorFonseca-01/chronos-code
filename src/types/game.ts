export type TrackType = 'backend' | 'frontend';

export type EraId = 'era_01' | 'era_02' | 'era_03' | 'era_04';

export interface TestCase {
  id: string;
  descriptionKey: string;
  testFn: (code: string) => boolean;
}

export interface Challenge {
  id: string;
  eraId: EraId;
  track: TrackType;
  titleKey: string;
  descriptionKey: string;
  contextKey: string;
  initialCodeKey: string;
  initialCode: string;
  hintsKeys: string[];
  xpReward: number;
  testCases: TestCase[];
}

export interface Era {
  id: EraId;
  titleKey: string;
  yearRange: string;
  iconName: string;
  descriptionKey: string;
  challenges: Challenge[];
}

export interface PlayerProgressState {
  track: TrackType;
  currentEra: EraId;
  xp: number;
  completedChallenges: string[];
}

export interface LeaderboardEntry {
  id?: string;
  username: string;
  track: TrackType;
  challenge_id: string;
  score: number;
  completion_time_seconds: number;
  created_at?: string;
}
