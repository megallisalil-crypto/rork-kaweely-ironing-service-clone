import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Stack } from "expo-router";
import { useLoyalty } from "@/contexts/LoyaltyContext";
import Colors from "@/constants/colors";
import {
  Award,
  Gift,
  Tag,
  Zap,
  Sparkles,
  Crown,
  TrendingUp,
  Clock,
} from "lucide-react-native";

const tierColors = {
  bronze: "#CD7F32",
  silver: "#C0C0C0",
  gold: "#FFD700",
  platinum: "#E5E4E2",
};

const tierNames = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
  platinum: "Platinum",
};

const iconMap: Record<string, any> = {
  tag: Tag,
  zap: Zap,
  sparkles: Sparkles,
  crown: Crown,
  gift: Gift,
};

export default function RewardsScreen() {
  const { loyalty, availableRewards, redeemPoints, pointsToNextTier } = useLoyalty();

  const handleRedeem = (pointsCost: number, title: string) => {
    if (loyalty.points < pointsCost) {
      Alert.alert("Insufficient Points", "You don't have enough points to redeem this reward.");
      return;
    }

    Alert.alert(
      "Redeem Reward",
      `Do you want to redeem ${title} for ${pointsCost} points?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Redeem",
          onPress: () => {
            const result = redeemPoints(pointsCost, `Redeemed: ${title}`);
            if (result) {
              Alert.alert("Success!", `${title} has been added to your account.`);
            }
          },
        },
      ]
    );
  };

  const progressToNextTier = () => {
    if (loyalty.tier === "platinum") return 100;
    const tierValues = Object.values({ bronze: 0, silver: 500, gold: 1500, platinum: 3000 });
    const currentIndex = Object.keys(tierNames).indexOf(loyalty.tier);
    const currentThreshold = tierValues[currentIndex];
    const nextThreshold = tierValues[currentIndex + 1];
    return ((loyalty.lifetimePoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Rewards & Loyalty",
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
          headerTintColor: Colors.light.text,
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.tierCard}>
            <View style={styles.tierHeader}>
              <View style={styles.tierIconContainer}>
                <Award size={32} color={tierColors[loyalty.tier]} strokeWidth={2} />
              </View>
              <View style={styles.tierInfo}>
                <Text style={styles.tierLabel}>Current Tier</Text>
                <Text style={[styles.tierName, { color: tierColors[loyalty.tier] }]}>
                  {tierNames[loyalty.tier]}
                </Text>
              </View>
            </View>

            <View style={styles.pointsSection}>
              <View style={styles.pointsRow}>
                <Sparkles size={20} color={Colors.light.tint} />
                <Text style={styles.pointsLabel}>Available Points</Text>
              </View>
              <Text style={styles.pointsValue}>{loyalty.points.toLocaleString()}</Text>
            </View>

            {loyalty.tier !== "platinum" && (
              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>
                    {pointsToNextTier} points to {tierNames[Object.keys(tierNames)[Object.keys(tierNames).indexOf(loyalty.tier) + 1] as keyof typeof tierNames]}
                  </Text>
                  <TrendingUp size={16} color={Colors.light.success} />
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[styles.progressFill, { width: `${progressToNextTier()}%` }]}
                  />
                </View>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Rewards</Text>
            <Text style={styles.sectionSubtitle}>
              Redeem your points for exclusive benefits
            </Text>

            <View style={styles.rewardsGrid}>
              {availableRewards.map((reward) => {
                const IconComponent = iconMap[reward.icon] || Gift;
                const canAfford = loyalty.points >= reward.pointsCost;

                return (
                  <View key={reward.id} style={styles.rewardCard}>
                    <View style={styles.rewardIconContainer}>
                      <IconComponent
                        size={28}
                        color={canAfford ? Colors.light.tint : Colors.light.tabIconDefault}
                        strokeWidth={2}
                      />
                    </View>

                    <Text style={styles.rewardTitle}>{reward.title}</Text>
                    <Text style={styles.rewardDescription}>{reward.description}</Text>

                    <View style={styles.rewardFooter}>
                      <View style={styles.costContainer}>
                        <Sparkles size={14} color={Colors.light.warning} />
                        <Text style={styles.costText}>{reward.pointsCost}</Text>
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.redeemButton,
                          !canAfford && styles.redeemButtonDisabled,
                        ]}
                        onPress={() => handleRedeem(reward.pointsCost, reward.title)}
                        disabled={!canAfford}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.redeemButtonText,
                            !canAfford && styles.redeemButtonTextDisabled,
                          ]}
                        >
                          {canAfford ? "Redeem" : "Locked"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            {loyalty.transactions.length === 0 ? (
              <View style={styles.emptyState}>
                <Clock size={48} color={Colors.light.textSecondary} />
                <Text style={styles.emptyText}>No activity yet</Text>
              </View>
            ) : (
              <View style={styles.transactionsList}>
                {loyalty.transactions.slice(0, 10).map((transaction) => (
                  <View key={transaction.id} style={styles.transactionCard}>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionDescription}>
                        {transaction.description}
                      </Text>
                      <Text style={styles.transactionDate}>
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }).format(transaction.date)}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.transactionPoints,
                        transaction.type === "earned"
                          ? styles.transactionPointsEarned
                          : styles.transactionPointsRedeemed,
                      ]}
                    >
                      {transaction.type === "earned" ? "+" : "-"}
                      {transaction.points}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  tierCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  tierHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 16,
  },
  tierIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.light.background,
    justifyContent: "center",
    alignItems: "center",
  },
  tierInfo: {
    flex: 1,
  },
  tierLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontWeight: "500" as const,
    marginBottom: 4,
  },
  tierName: {
    fontSize: 28,
    fontWeight: "700" as const,
  },
  pointsSection: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 20,
  },
  pointsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  pointsLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontWeight: "500" as const,
  },
  pointsValue: {
    fontSize: 36,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  progressSection: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    fontWeight: "500" as const,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.light.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.light.tint,
    borderRadius: 4,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 20,
  },
  rewardsGrid: {
    gap: 16,
  },
  rewardCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  rewardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 6,
  },
  rewardDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  rewardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  costContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  costText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.light.warning,
  },
  redeemButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  redeemButtonDisabled: {
    backgroundColor: Colors.light.border,
  },
  redeemButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  redeemButtonTextDisabled: {
    color: Colors.light.tabIconDefault,
  },
  transactionsList: {
    gap: 12,
  },
  transactionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  transactionInfo: {
    flex: 1,
    marginRight: 12,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  transactionPoints: {
    fontSize: 16,
    fontWeight: "700" as const,
  },
  transactionPointsEarned: {
    color: Colors.light.success,
  },
  transactionPointsRedeemed: {
    color: Colors.light.error,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 16,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
});
