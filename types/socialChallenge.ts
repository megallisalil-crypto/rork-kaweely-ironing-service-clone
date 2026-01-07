export type ChallengeType = 'sustainability' | 'frequency' | 'savings' | 'referrals' | 'streak';

export type ChallengeDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type ChallengeStatus = 'active' | 'completed' | 'failed' | 'expired';

export type SocialChallenge = {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  difficulty: ChallengeDifficulty;
  status: ChallengeStatus;
  startDate: Date;
  endDate: Date;
  progress: number;
  target: number;
  reward: number;
  participants: string[];
  createdBy: string;
  icon: string;
  gradient: [string, string];
};

export type ChallengeLeaderboard = {
  userId: string;
  userName: string;
  score: number;
  rank: number;
  badge?: string;
};

export type WeatherAlert = {
  id: string;
  type: 'rain' | 'snow' | 'heat' | 'cold' | 'storm';
  message: string;
  suggestedItems: string[];
  timestamp: Date;
  dismissed: boolean;
};
