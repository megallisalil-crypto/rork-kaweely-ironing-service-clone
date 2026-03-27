import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { Trophy, Zap, Users, DollarSign, Leaf, Target, Award, Medal } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useSocialChallenge } from '@/contexts/SocialChallengeContext';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { SocialChallenge } from '@/types/socialChallenge';

export default function ChallengesScreen() {

  const { colors } = useTheme();
  const { activeChallenges, completedChallenges, leaderboard } = useSocialChallenge();

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'sustainability': return Leaf;
      case 'frequency': return Zap;
      case 'savings': return DollarSign;
      case 'referrals': return Users;
      default: return Target;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return colors.success;
      case 'medium': return colors.warning;
      case 'hard': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const renderChallenge = (challenge: SocialChallenge) => {
    const IconComponent = getChallengeIcon(challenge.type);
    const progressPercentage = (challenge.progress / challenge.target) * 100;

    return (
      <TouchableOpacity
        key={challenge.id}
        style={styles.challengeCard}
        activeOpacity={0.7}
      >
        <ExpoLinearGradient
          colors={challenge.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.challengeGradient}
        />
        <View style={styles.challengeContent}>
          <View style={styles.challengeHeader}>
            <View style={styles.challengeIcon}>
              <IconComponent size={24} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <View style={styles.challengeBadges}>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(challenge.difficulty) }]}>
                <Text style={styles.difficultyBadgeText}>{challenge.difficulty.toUpperCase()}</Text>
              </View>
              <View style={styles.rewardBadge}>
                <Award size={12} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.rewardBadgeText}>{challenge.reward} pts</Text>
              </View>
            </View>
          </View>

          <Text style={styles.challengeTitle}>{challenge.title}</Text>
          <Text style={styles.challengeDescription}>{challenge.description}</Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {challenge.progress} / {challenge.target}
            </Text>
          </View>

          <View style={styles.challengeFooter}>
            <Text style={styles.challengeParticipants}>
              {challenge.participants.length} participants
            </Text>
            <Text style={styles.challengeEndDate}>
              Ends {challenge.endDate.toLocaleDateString()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 16,
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 16,
    },
    sectionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.accent,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: '800' as const,
      color: colors.text,
    },
    leaderboardCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    leaderboardTitle: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 16,
    },
    leaderboardItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    leaderboardItemLast: {
      borderBottomWidth: 0,
    },
    leaderboardRank: {
      width: 32,
      fontSize: 16,
      fontWeight: '800' as const,
      color: colors.textSecondary,
    },
    leaderboardName: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600' as const,
      color: colors.text,
    },
    leaderboardScore: {
      fontSize: 15,
      fontWeight: '700' as const,
      color: colors.accent,
    },
    leaderboardBadge: {
      marginLeft: 8,
      fontSize: 18,
    },
    currentUser: {
      backgroundColor: `${colors.accent}15`,
      marginHorizontal: -12,
      paddingHorizontal: 12,
      borderRadius: 8,
    },
    challengeCard: {
      borderRadius: 20,
      marginBottom: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
    },
    challengeGradient: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    challengeContent: {
      padding: 20,
    },
    challengeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    challengeIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    challengeBadges: {
      flexDirection: 'row',
      gap: 8,
    },
    difficultyBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },
    difficultyBadgeText: {
      fontSize: 10,
      fontWeight: '800' as const,
      color: '#FFFFFF',
      letterSpacing: 0.5,
    },
    rewardBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
    rewardBadgeText: {
      fontSize: 11,
      fontWeight: '700' as const,
      color: '#FFFFFF',
    },
    challengeTitle: {
      fontSize: 20,
      fontWeight: '800' as const,
      color: '#FFFFFF',
      marginBottom: 8,
    },
    challengeDescription: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.9)',
      marginBottom: 16,
      lineHeight: 20,
    },
    progressContainer: {
      marginBottom: 16,
    },
    progressBar: {
      height: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: 8,
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#FFFFFF',
      borderRadius: 4,
    },
    progressText: {
      fontSize: 13,
      fontWeight: '700' as const,
      color: 'rgba(255, 255, 255, 0.9)',
      textAlign: 'right',
    },
    challengeFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    challengeParticipants: {
      fontSize: 12,
      color: 'rgba(255, 255, 255, 0.8)',
      fontWeight: '600' as const,
    },
    challengeEndDate: {
      fontSize: 12,
      color: 'rgba(255, 255, 255, 0.8)',
      fontWeight: '600' as const,
    },
    emptyContainer: {
      alignItems: 'center',
      padding: 40,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      fontWeight: '600' as const,
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Challenges',
          headerStyle: { backgroundColor: colors.cardBackground },
          headerTintColor: colors.text,
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Trophy size={20} color="#FFFFFF" strokeWidth={2.5} />
              </View>
              <Text style={styles.sectionTitle}>Leaderboard</Text>
            </View>

            <View style={styles.leaderboardCard}>
              <Text style={styles.leaderboardTitle}>Top Players</Text>
              {leaderboard.slice(0, 8).map((player, index) => (
                <View
                  key={player.userId}
                  style={[
                    styles.leaderboardItem,
                    player.userName === 'You' && styles.currentUser,
                    index === leaderboard.length - 1 && styles.leaderboardItemLast,
                  ]}
                >
                  <Text style={styles.leaderboardRank}>#{player.rank}</Text>
                  <Text style={styles.leaderboardName}>{player.userName}</Text>
                  <Text style={styles.leaderboardScore}>{player.score}</Text>
                  {player.badge && <Text style={styles.leaderboardBadge}>{player.badge}</Text>}
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Target size={20} color="#FFFFFF" strokeWidth={2.5} />
              </View>
              <Text style={styles.sectionTitle}>Active Challenges</Text>
            </View>

            {activeChallenges.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Zap size={48} color={colors.textSecondary} style={styles.emptyIcon} />
                <Text style={styles.emptyText}>No active challenges at the moment</Text>
              </View>
            ) : (
              activeChallenges.map(renderChallenge)
            )}
          </View>

          {completedChallenges.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIcon, { backgroundColor: colors.success }]}>
                  <Medal size={20} color="#FFFFFF" strokeWidth={2.5} />
                </View>
                <Text style={styles.sectionTitle}>Completed</Text>
              </View>

              {completedChallenges.map(renderChallenge)}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
