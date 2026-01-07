import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from "react-native";
import { Stack } from "expo-router";
import { useState } from "react";
import Colors from "@/constants/colors";
import {
  Gift,
  Users,
  Copy,
  Share2,
  Sparkles,
  CheckCircle2,
} from "lucide-react-native";

export default function ReferralsScreen() {
  const [referralCode] = useState("KAWEELY2024");
  const [referralCount] = useState(3);
  const [pendingRewards] = useState(150);

  const handleCopyCode = async () => {
    Alert.alert("Code Copied!", "Your referral code has been copied to clipboard.");
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join Kaweely and get your clothes professionally ironed! Use my referral code ${referralCode} and get 20% off your first order. Download now!`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const benefits = [
    {
      icon: Gift,
      title: "You Get 200 Points",
      description: "When your friend completes their first order",
    },
    {
      icon: Sparkles,
      title: "Friend Gets 20% Off",
      description: "On their first order with Kaweely",
    },
    {
      icon: Users,
      title: "Unlimited Referrals",
      description: "Refer as many friends as you want",
    },
  ];

  const recentReferrals = [
    { name: "Ahmed M.", status: "completed", points: 200, date: "2 days ago" },
    { name: "Sara K.", status: "pending", points: 200, date: "5 days ago" },
    { name: "Mohamed A.", status: "completed", points: 200, date: "1 week ago" },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Referral Program",
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
          headerTintColor: Colors.light.text,
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.heroCard}>
            <View style={styles.heroIconContainer}>
              <Gift size={48} color={Colors.light.tint} strokeWidth={2} />
            </View>
            <Text style={styles.heroTitle}>Refer Friends, Get Rewarded</Text>
            <Text style={styles.heroDescription}>
              Share Kaweely with your friends and earn loyalty points for every successful referral
            </Text>
          </View>

          <View style={styles.codeCard}>
            <Text style={styles.codeLabel}>Your Referral Code</Text>
            <View style={styles.codeContainer}>
              <Text style={styles.codeText}>{referralCode}</Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={handleCopyCode}
                activeOpacity={0.7}
              >
                <Copy size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>Copy Code</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareButton}
                onPress={handleShare}
                activeOpacity={0.7}
              >
                <Share2 size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{referralCount}</Text>
              <Text style={styles.statLabel}>Successful Referrals</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{pendingRewards}</Text>
              <Text style={styles.statLabel}>Pending Points</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How It Works</Text>
            <View style={styles.benefitsList}>
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <View key={index} style={styles.benefitCard}>
                    <View style={styles.benefitIconContainer}>
                      <IconComponent size={24} color={Colors.light.tint} strokeWidth={2} />
                    </View>
                    <View style={styles.benefitContent}>
                      <Text style={styles.benefitTitle}>{benefit.title}</Text>
                      <Text style={styles.benefitDescription}>{benefit.description}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Referrals</Text>
            {recentReferrals.length === 0 ? (
              <View style={styles.emptyState}>
                <Users size={48} color={Colors.light.textSecondary} />
                <Text style={styles.emptyText}>No referrals yet</Text>
                <Text style={styles.emptySubtext}>
                  Start sharing your code to earn rewards
                </Text>
              </View>
            ) : (
              <View style={styles.referralsList}>
                {recentReferrals.map((referral, index) => (
                  <View key={index} style={styles.referralCard}>
                    <View style={styles.referralInfo}>
                      <Text style={styles.referralName}>{referral.name}</Text>
                      <Text style={styles.referralDate}>{referral.date}</Text>
                    </View>
                    <View style={styles.referralStatus}>
                      {referral.status === "completed" ? (
                        <>
                          <CheckCircle2 size={16} color={Colors.light.success} />
                          <Text style={styles.referralPointsEarned}>
                            +{referral.points}
                          </Text>
                        </>
                      ) : (
                        <Text style={styles.referralPointsPending}>Pending</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.termsCard}>
            <Text style={styles.termsTitle}>Terms & Conditions</Text>
            <Text style={styles.termsText}>
              • Referral points are awarded when your friend completes their first paid order{"\n"}
              • Referred friends must use your code at signup{"\n"}
              • Points are added within 24 hours of order completion{"\n"}
              • Cannot be combined with other promotional offers
            </Text>
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
  heroCard: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  heroIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: `${Colors.light.tint}20`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 12,
    textAlign: "center",
  },
  heroDescription: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  codeCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: "center",
  },
  codeLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontWeight: "500" as const,
    marginBottom: 12,
  },
  codeContainer: {
    backgroundColor: Colors.light.background,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.light.tint,
    borderStyle: "dashed" as const,
  },
  codeText: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.light.tint,
    letterSpacing: 2,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  copyButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.tint,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  shareButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.success,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: Colors.light.tint,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: "center",
    fontWeight: "500" as const,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  benefitsList: {
    gap: 12,
  },
  benefitCard: {
    flexDirection: "row",
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  benefitIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${Colors.light.tint}20`,
    justifyContent: "center",
    alignItems: "center",
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  referralsList: {
    gap: 12,
  },
  referralCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  referralInfo: {
    flex: 1,
  },
  referralName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  referralDate: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  referralStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  referralPointsEarned: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.light.success,
  },
  referralPointsPending: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.warning,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  termsCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  termsText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
});
