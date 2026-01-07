import createContextHook from "@nkzw/create-context-hook";
import { useState, useCallback, useMemo, useEffect } from "react";
import { SocialChallenge, ChallengeLeaderboard, WeatherAlert, ChallengeStatus } from "@/types/socialChallenge";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "socialChallenges";
const WEATHER_KEY = "weatherAlerts";

export const [SocialChallengeProvider, useSocialChallenge] = createContextHook(() => {
  const [challenges, setChallenges] = useState<SocialChallenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<ChallengeLeaderboard[]>([]);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);

  const saveChallenges = useCallback(async (updatedChallenges: SocialChallenge[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedChallenges));
    } catch (error) {
      console.error("[SocialChallenge] Error saving challenges:", error);
    }
  }, []);

  const generateDefaultChallenges = useCallback(() => {
    const now = new Date();
    const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const monthLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const defaultChallenges: SocialChallenge[] = [
      {
        id: '1',
        title: 'Eco Warrior',
        description: 'Reduce your carbon footprint by using our eco-friendly services 10 times',
        type: 'sustainability',
        difficulty: 'medium',
        status: 'active',
        startDate: now,
        endDate: monthLater,
        progress: 0,
        target: 10,
        reward: 500,
        participants: ['user1', 'user2', 'user3'],
        createdBy: 'system',
        icon: 'leaf',
        gradient: ['#10B981', '#059669'],
      },
      {
        id: '2',
        title: 'Weekly Warrior',
        description: 'Complete 3 orders this week',
        type: 'frequency',
        difficulty: 'easy',
        status: 'active',
        startDate: now,
        endDate: weekLater,
        progress: 0,
        target: 3,
        reward: 200,
        participants: ['user1', 'user2'],
        createdBy: 'system',
        icon: 'zap',
        gradient: ['#3B82F6', '#2563EB'],
      },
      {
        id: '3',
        title: 'Savings Master',
        description: 'Save $100 using subscription discounts',
        type: 'savings',
        difficulty: 'hard',
        status: 'active',
        startDate: now,
        endDate: monthLater,
        progress: 0,
        target: 100,
        reward: 1000,
        participants: ['user1'],
        createdBy: 'system',
        icon: 'dollar-sign',
        gradient: ['#F59E0B', '#D97706'],
      },
      {
        id: '4',
        title: 'Referral Champion',
        description: 'Refer 5 friends to join Kaweely',
        type: 'referrals',
        difficulty: 'medium',
        status: 'active',
        startDate: now,
        endDate: monthLater,
        progress: 0,
        target: 5,
        reward: 750,
        participants: ['user1'],
        createdBy: 'system',
        icon: 'users',
        gradient: ['#EC4899', '#DB2777'],
      },
    ];

    setChallenges(defaultChallenges);
    saveChallenges(defaultChallenges);
  }, [saveChallenges]);

  const loadChallenges = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const formatted = parsed.map((c: any) => ({
          ...c,
          startDate: new Date(c.startDate),
          endDate: new Date(c.endDate),
        }));
        setChallenges(formatted);
      } else {
        generateDefaultChallenges();
      }
    } catch (error) {
      console.error("[SocialChallenge] Error loading challenges:", error);
      generateDefaultChallenges();
    }
  }, [generateDefaultChallenges]);

  useEffect(() => {
    loadChallenges();
    loadWeatherAlerts();
    generateMockLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadWeatherAlerts = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(WEATHER_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const formatted = parsed.map((a: any) => ({
          ...a,
          timestamp: new Date(a.timestamp),
        }));
        setWeatherAlerts(formatted);
      }
    } catch (error) {
      console.error("[SocialChallenge] Error loading weather alerts:", error);
    }
  }, []);



  const generateMockLeaderboard = useCallback(() => {
    const mockLeaders: ChallengeLeaderboard[] = [
      { userId: 'user1', userName: 'You', score: 0, rank: 1 },
      { userId: 'user2', userName: 'Sarah M.', score: 1250, rank: 2, badge: '🥇' },
      { userId: 'user3', userName: 'John D.', score: 980, rank: 3, badge: '🥈' },
      { userId: 'user4', userName: 'Emma W.', score: 875, rank: 4, badge: '🥉' },
      { userId: 'user5', userName: 'Mike R.', score: 720, rank: 5 },
      { userId: 'user6', userName: 'Lisa K.', score: 650, rank: 6 },
      { userId: 'user7', userName: 'Tom S.', score: 590, rank: 7 },
      { userId: 'user8', userName: 'Anna L.', score: 530, rank: 8 },
    ];
    setLeaderboard(mockLeaders);
  }, []);

  const saveWeatherAlerts = useCallback(async (alerts: WeatherAlert[]) => {
    try {
      await AsyncStorage.setItem(WEATHER_KEY, JSON.stringify(alerts));
    } catch (error) {
      console.error("[SocialChallenge] Error saving weather alerts:", error);
    }
  }, []);

  const updateProgress = useCallback((challengeId: string, amount: number) => {
    const updated = challenges.map(challenge => {
      if (challenge.id === challengeId && challenge.status === 'active') {
        const newProgress = Math.min(challenge.progress + amount, challenge.target);
        const newStatus: ChallengeStatus = newProgress >= challenge.target ? 'completed' : 'active';
        return {
          ...challenge,
          progress: newProgress,
          status: newStatus,
        };
      }
      return challenge;
    });
    setChallenges(updated);
    saveChallenges(updated);
  }, [challenges, saveChallenges]);

  const addWeatherAlert = useCallback((type: WeatherAlert['type'], message: string, suggestedItems: string[]) => {
    const alert: WeatherAlert = {
      id: Date.now().toString(),
      type,
      message,
      suggestedItems,
      timestamp: new Date(),
      dismissed: false,
    };
    const updated = [alert, ...weatherAlerts];
    setWeatherAlerts(updated);
    saveWeatherAlerts(updated);
  }, [weatherAlerts, saveWeatherAlerts]);

  const dismissAlert = useCallback((alertId: string) => {
    const updated = weatherAlerts.map(alert =>
      alert.id === alertId ? { ...alert, dismissed: true } : alert
    );
    setWeatherAlerts(updated);
    saveWeatherAlerts(updated);
  }, [weatherAlerts, saveWeatherAlerts]);

  const activeChallenges = useMemo(() => 
    challenges.filter(c => c.status === 'active'),
    [challenges]
  );

  const completedChallenges = useMemo(() => 
    challenges.filter(c => c.status === 'completed'),
    [challenges]
  );

  const activeAlerts = useMemo(() => 
    weatherAlerts.filter(a => !a.dismissed),
    [weatherAlerts]
  );

  return useMemo(
    () => ({
      challenges,
      activeChallenges,
      completedChallenges,
      leaderboard,
      weatherAlerts,
      activeAlerts,
      updateProgress,
      addWeatherAlert,
      dismissAlert,
      loadChallenges,
    }),
    [challenges, activeChallenges, completedChallenges, leaderboard, weatherAlerts, activeAlerts, updateProgress, addWeatherAlert, dismissAlert, loadChallenges]
  );
});
