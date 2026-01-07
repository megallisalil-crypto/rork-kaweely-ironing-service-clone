import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Alert, TextInput, Platform } from "react-native";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import { CheckCircle2, Sparkles, TrendingUp, ArrowRight, RefreshCw, Crown, XCircle, Tag, QrCode } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { usePromoCodes } from "@/contexts/PromoCodeContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";
import React from "react";
import Svg, { Rect } from "react-native-svg";

type SubscriptionPlanDetails = {
  id: string;
  title: string;
  duration: string;
  pieces: number;
  pickupsPerWeek: number;
  bgColor: string;
  accentColor: string;
  features: string[];
};

const subscriptionPlans: Record<string, SubscriptionPlanDetails> = {
  week: {
    id: "weekly",
    title: "Weekly Plan",
    duration: "7 Days",
    pieces: 10,
    pickupsPerWeek: 1,
    bgColor: "#E8F5E9",
    accentColor: "#4CAF50",
    features: ["10 garment pieces", "1 pickup/week", "Standard ironing", "24h delivery"],
  },
  month: {
    id: "monthly",
    title: "Monthly Plan",
    duration: "30 Days",
    pieces: 50,
    pickupsPerWeek: 2,
    bgColor: "#E3F2FD",
    accentColor: "#2196F3",
    features: ["50 garment pieces", "2 pickups/week", "Premium ironing", "12h express delivery", "Priority support"],
  },
  "3months": {
    id: "quarterly",
    title: "3 Months Plan",
    duration: "90 Days",
    pieces: 180,
    pickupsPerWeek: 3,
    bgColor: "#FFF3E0",
    accentColor: "#FF9800",
    features: ["180 garment pieces", "3 pickups/week", "Premium ironing & steaming", "6h ultra-fast delivery", "Dedicated support", "Free stain removal"],
  },
  "6months": {
    id: "biannual",
    title: "6 Months Plan",
    duration: "180 Days",
    pieces: 400,
    pickupsPerWeek: 4,
    bgColor: "#F3E5F5",
    accentColor: "#9C27B0",
    features: ["400 garment pieces", "4 pickups/week", "Premium service", "3h delivery", "VIP support", "Free alterations", "Quality guarantee"],
  },
  year: {
    id: "yearly",
    title: "Yearly Plan",
    duration: "365 Days",
    pieces: 1000,
    pickupsPerWeek: 5,
    bgColor: "#FBE9E7",
    accentColor: "#FF5722",
    features: ["1000 garment pieces", "5 pickups/week", "Luxury service", "2h delivery", "Concierge support", "All services included", "Lifetime warranty"],
  },
  none: {
    id: "none",
    title: "No Subscription",
    duration: "Pay as you go",
    pieces: 0,
    pickupsPerWeek: 0,
    bgColor: "#F5F5F5",
    accentColor: "#9E9E9E",
    features: ["Pay per order", "Standard delivery", "Basic support"],
  },
  student: {
    id: "student",
    title: "Student Package",
    duration: "30 Days",
    pieces: 35,
    pickupsPerWeek: 2,
    bgColor: "#E8F4F8",
    accentColor: "#00A8E8",
    features: ["35 garment pieces", "2 pickups/week", "30% student discount", "Free study-wear care", "Exam week priority", "Weekend express service", "Budget-friendly pricing", "Flexible scheduling"],
  },
  couples: {
    id: "couples",
    title: "Couples Package",
    duration: "30 Days",
    pieces: 100,
    pickupsPerWeek: 3,
    bgColor: "#FCE4EC",
    accentColor: "#E91E63",
    features: ["100 garment pieces (shared)", "3 pickups/week", "20% couple discount", "His & Hers premium care", "Matching scent options", "Date night express", "Dual pickup locations", "Anniversary bonus", "Free gift wrapping"],
  },
  mothers: {
    id: "mothers",
    title: "Mothers Package",
    duration: "30 Days",
    pieces: 80,
    pickupsPerWeek: 4,
    bgColor: "#FFF8E1",
    accentColor: "#FFC107",
    features: ["80 garment pieces", "4 pickups/week", "25% mom discount", "Kids clothes included", "Stain removal expert", "Baby-safe detergents", "Same-day service", "Flexible timing", "Emergency wash option", "Family care bundle"],
  },
};

const QR_SIZE = 140;

function SimpleQRCode({ data, size }: { data: string; size: number }) {
  const moduleSize = size / 29;
  
  const hash = (str: string): number => {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) - h) + str.charCodeAt(i);
      h = h & h;
    }
    return Math.abs(h);
  };

  const seed = hash(data);
  const random = (index: number) => {
    const x = Math.sin(seed + index) * 10000;
    return x - Math.floor(x);
  };

  const modules: boolean[][] = Array(29).fill(null).map(() => Array(29).fill(false));

  for (let row = 0; row < 29; row++) {
    for (let col = 0; col < 29; col++) {
      if (
        (row < 7 && col < 7) || 
        (row < 7 && col > 21) || 
        (row > 21 && col < 7)
      ) {
        const isFinderPattern = 
          (row === 0 || row === 6 || col === 0 || col === 6 || 
          (row >= 2 && row <= 4 && col >= 2 && col <= 4));
        modules[row][col] = isFinderPattern;
      } else {
        modules[row][col] = random(row * 29 + col) > 0.5;
      }
    }
  }

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {modules.map((row, rowIndex) =>
        row.map((isDark, colIndex) => 
          isDark ? (
            <Rect
              key={`${rowIndex}-${colIndex}`}
              x={colIndex * moduleSize}
              y={rowIndex * moduleSize}
              width={moduleSize}
              height={moduleSize}
              fill="#000000"
            />
          ) : null
        )
      )}
    </Svg>
  );
}

export default function SubscriptionStatusScreen() {
  const router = useRouter();
  const { colors, isAppActive } = useTheme();
  const { subscription, cancelSubscription } = useSubscription();
  const { applyPromoCode, validatePromoCode } = usePromoCodes();
  const { format } = useCurrency();
  const logoUrl = "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/8nlam6zuq1umfi1sxbk5q";
  const { user, regenerateQrToken } = useAuth();
  const [qrKey, setQrKey] = useState(0);
  
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [appliedPromoCode, setAppliedPromoCode] = useState<{ code: string; type: 'percentage' | 'free_order'; discountAmount: number; discountPercentage?: number } | null>(null);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      return;
    }

    try {
      const basePrice = 675;
      console.log('[SubscriptionStatus] Validating promo code:', promoCode);
      const validation = validatePromoCode(promoCode, basePrice);
      
      if (!validation.valid) {
        Alert.alert('Invalid Promo Code', validation.error || 'The promo code could not be applied.');
        return;
      }

      const result = await applyPromoCode(promoCode, basePrice);
      setAppliedPromoCode(result);
      setPromoApplied(true);
      console.log('[SubscriptionStatus] Promo code applied:', result);
      Alert.alert(
        'Promo Code Applied! 🎉',
        result.type === 'free_order' 
          ? `Your subscription is FREE with code "${result.code}"!`
          : `You're saving ${format(result.discountAmount)} with code "${result.code}"!`
      );
    } catch (error) {
      console.warn('[SubscriptionStatus] Promo code validation failed:', error);
      Alert.alert(
        'Invalid Promo Code',
        error instanceof Error ? error.message : 'The promo code could not be applied.'
      );
    }
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      "Cancel Subscription",
      "Are you sure you want to cancel your subscription? You will lose access to all premium features.",
      [
        {
          text: "Keep Plan",
          style: "cancel",
        },
        {
          text: "Cancel Plan",
          style: "destructive",
          onPress: () => {
            cancelSubscription();
            Alert.alert(
              "Subscription Cancelled",
              "Your subscription has been cancelled successfully."
            );
          },
        },
      ]
    );
  };

  const currentSubscription = subscription?.planType || "none";
  const planDetails = subscriptionPlans[currentSubscription] || subscriptionPlans.none;

  const usedPieces = subscription?.usedPieces || 0;
  const remainingPieces = subscription?.remainingPieces || planDetails.pieces;
  const usagePercentage = planDetails.pieces > 0 ? (usedPieces / planDetails.pieces) * 100 : 0;

  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(-100)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const qrData = React.useMemo(() => {
    if (!user) {
      console.log('[QR] No user found');
      return "";
    }
    
    if (!user.qrToken) {
      console.log('[QR] No qrToken found, waiting for generation');
      return "";
    }

    const data = {
      token: user.qrToken,
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      subscription: subscription ? {
        plan: subscription.planTitle,
        remainingPieces: subscription.remainingPieces,
        remainingPickups: subscription.remainingPickupsThisWeek,
        isActive: subscription.isActive,
      } : null,
      timestamp: Date.now(),
    };
    console.log('[QR] Generated qrData with token:', user.qrToken);
    return JSON.stringify(data);
  }, [user?.id, user?.qrToken, subscription?.isActive, subscription?.remainingPieces, subscription?.remainingPickupsThisWeek, subscription?.planTitle]);

  const handleRegenerateQr = async () => {
    console.log('[QRCode] Manual regeneration requested');
    try {
      await regenerateQrToken();
      setQrKey(prev => prev + 1);
      console.log('[QRCode] QR regenerated successfully');
    } catch (error) {
      console.error('[QRCode] Error regenerating:', error);
    }
  };

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: usagePercentage,
      duration: 1500,
      useNativeDriver: false,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 100,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [usagePercentage, progressAnim, pulseAnim, shimmerAnim, glowAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.5],
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 20,
      paddingBottom: 120,
    },
    heroCard: {
      borderRadius: 28,
      padding: 24,
      marginBottom: 20,
      shadowColor: planDetails.accentColor,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.4,
      shadowRadius: 24,
      elevation: 12,
      overflow: "hidden" as const,
      position: "relative" as const,
    },
    heroGradient: {
      position: "absolute" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    glowEffect: {
      position: "absolute" as const,
      top: -80,
      right: -80,
      width: 200,
      height: 200,
      borderRadius: 100,
    },
    glowEffectBottom: {
      position: "absolute" as const,
      bottom: -80,
      left: -80,
      width: 200,
      height: 200,
      borderRadius: 100,
    },
    shimmer: {
      position: "absolute" as const,
      top: 0,
      left: -100,
      right: 0,
      bottom: 0,
      width: "200%" as const,
    },
    shimmerGradient: {
      flex: 1,
      transform: [{ skewX: "-20deg" }],
    },
    heroContent: {
      position: "relative" as const,
      zIndex: 2,
    },
    planBadge: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 8,
      alignSelf: "flex-start" as const,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: "#FFFFFF40",
      borderWidth: 1.5,
      borderColor: "#FFFFFF60",
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    planBadgeText: {
      fontSize: 13,
      fontWeight: "800" as const,
      color: "#FFFFFF",
      letterSpacing: 0.5,
      flexShrink: 1,
    },
    planTitle: {
      fontSize: 32,
      fontWeight: "900" as const,
      color: "#FFFFFF",
      marginBottom: 8,
      letterSpacing: -0.5,
      flexShrink: 1,
    },
    planDuration: {
      fontSize: 16,
      fontWeight: "600" as const,
      color: "#FFFFFFCC",
      marginBottom: 24,
    },
    statsRow: {
      flexDirection: "row" as const,
      gap: 12,
      marginBottom: 16,
    },
    statCard: {
      flex: 1,
      backgroundColor: "#FFFFFF25",
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: "#FFFFFF40",
    },
    statValue: {
      fontSize: 24,
      fontWeight: "800" as const,
      color: "#FFFFFF",
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 11,
      fontWeight: "600" as const,
      color: "#FFFFFFCC",
      letterSpacing: 0.3,
    },
    progressSection: {
      marginBottom: 24,
    },
    progressHeader: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      marginBottom: 12,
    },
    progressTitle: {
      fontSize: 15,
      fontWeight: "700" as const,
      color: colors.text,
    },
    progressValue: {
      fontSize: 15,
      fontWeight: "800" as const,
    },
    progressBarContainer: {
      height: 12,
      backgroundColor: `${planDetails.accentColor}20`,
      borderRadius: 6,
      overflow: "hidden" as const,
      position: "relative" as const,
    },
    progressBar: {
      position: "absolute" as const,
      top: 0,
      left: 0,
      bottom: 0,
      borderRadius: 6,
      shadowColor: planDetails.accentColor,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 4,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "800" as const,
      color: colors.text,
      marginBottom: 16,
      marginTop: 8,
    },
    featuresGrid: {
      gap: 12,
      marginBottom: 24,
    },
    featureCard: {
      flexDirection: "row" as const,
      alignItems: "flex-start" as const,
      gap: 14,
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    featureIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      shadowColor: planDetails.accentColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
      flexShrink: 0,
    },
    featureText: {
      flex: 1,
      fontSize: 14,
      fontWeight: "600" as const,
      color: colors.text,
      lineHeight: 20,
      flexShrink: 1,
    },
    upgradeCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 20,
      padding: 20,
      borderWidth: 2,
      marginBottom: 24,
      shadowColor: planDetails.accentColor,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    upgradeHeader: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 12,
      marginBottom: 12,
    },
    upgradeIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      shadowColor: planDetails.accentColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 6,
    },
    upgradeTitle: {
      flex: 1,
      fontSize: 17,
      fontWeight: "800" as const,
      color: colors.text,
    },
    upgradeDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 16,
      lineHeight: 20,
      fontWeight: "500" as const,
    },
    upgradeButton: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      gap: 10,
      borderRadius: 14,
      paddingVertical: 16,
      shadowColor: planDetails.accentColor,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 6,
    },
    upgradeButtonText: {
      fontSize: 16,
      fontWeight: "800" as const,
      color: "#FFFFFF",
      letterSpacing: 0.3,
    },
    renewCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 20,
      padding: 20,
      borderWidth: 2,
      borderColor: planDetails.accentColor,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 6,
    },
    renewHeader: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 12,
      marginBottom: 16,
    },
    renewIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    renewTitle: {
      flex: 1,
      fontSize: 17,
      fontWeight: "800" as const,
      color: colors.text,
    },
    renewButton: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      gap: 10,
      borderRadius: 14,
      paddingVertical: 16,
      borderWidth: 2,
    },
    renewButtonText: {
      fontSize: 16,
      fontWeight: "800" as const,
      letterSpacing: 0.3,
    },
    cancelButton: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      gap: 10,
      borderRadius: 14,
      paddingVertical: 16,
      marginTop: 12,
      borderWidth: 2,
      backgroundColor: colors.background,
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: "800" as const,
      letterSpacing: 0.3,
    },
    datesContainer: {
      backgroundColor: "#FFFFFF25",
      borderRadius: 16,
      padding: 16,
      marginTop: 12,
      gap: 10,
      borderWidth: 1,
      borderColor: "#FFFFFF40",
    },
    dateRow: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
    },
    dateLabel: {
      fontSize: 13,
      fontWeight: "600" as const,
      color: "#FFFFFFCC",
    },
    dateValue: {
      fontSize: 14,
      fontWeight: "700" as const,
      color: "#FFFFFF",
    },
    emptyState: {
      flex: 1,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      paddingHorizontal: 32,
      paddingVertical: 80,
    },
    emptyIconContainer: {
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: colors.cardBackground,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      marginBottom: 24,
      borderWidth: 2,
      borderColor: colors.border,
      position: "relative" as const,
    },
    emptyStateTitle: {
      fontSize: 20,
      fontWeight: "800" as const,
      color: colors.text,
      marginBottom: 10,
      textAlign: "center" as const,
    },
    emptyStateText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center" as const,
      lineHeight: 20,
      fontWeight: "500" as const,
    },
    promoCard: {
      borderRadius: 24,
      padding: 24,
      borderWidth: 1,
      marginBottom: 20,
      marginTop: 12,
    },
    promoHeader: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 12,
      marginBottom: 16,
    },
    promoTitle: {
      fontSize: 16,
      fontWeight: "700" as const,
    },
    promoInputContainer: {
      flexDirection: "row" as const,
      gap: 12,
    },
    promoInput: {
      flex: 1,
      borderRadius: 16,
      paddingHorizontal: 20,
      paddingVertical: 16,
      fontSize: 16,
      borderWidth: 2,
      fontWeight: "600" as const,
    },
    applyButton: {
      paddingHorizontal: 28,
      paddingVertical: 16,
      borderRadius: 16,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      minWidth: 100,
    },
    applyButtonDisabled: {
      opacity: 0.5,
    },
    applyButtonSuccess: {
      backgroundColor: Colors.light.success,
    },
    applyButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "800" as const,
    },
    promoSuccessContainer: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 8,
      marginTop: 12,
      backgroundColor: `${Colors.light.success}20`,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
    },
    promoSuccessText: {
      fontSize: 14,
      color: Colors.light.success,
      fontWeight: "700" as const,
    },
    qrSection: {
      backgroundColor: "#FFFFFF25",
      borderRadius: 16,
      padding: 20,
      marginTop: 20,
      borderWidth: 1,
      borderColor: "#FFFFFF40",
      alignItems: "center" as const,
    },
    qrTitle: {
      fontSize: 14,
      fontWeight: "700" as const,
      color: "#FFFFFF",
      marginBottom: 12,
      textAlign: "center" as const,
      letterSpacing: 0.5,
    },
    qrContainer: {
      backgroundColor: "#FFFFFF",
      borderRadius: 16,
      padding: 16,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 6,
    },
    qrCodePlaceholder: {
      width: QR_SIZE,
      height: QR_SIZE,
      backgroundColor: "#F5F5F5",
      borderRadius: 12,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    qrSubtitle: {
      fontSize: 11,
      color: "#FFFFFFCC",
      textAlign: "center" as const,
      marginTop: 8,
      fontWeight: "600" as const,
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Subscription Status" }} />

      {!isAppActive ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            {logoUrl && logoUrl.trim().length > 0 && logoUrl.startsWith('http') && (
              <Image
                source={{ uri: logoUrl }}
                style={{ width: 50, height: 50, opacity: 0.7 }}
                resizeMode="contain"
                onError={(error) => console.log('[SubscriptionStatus] Logo error:', error)}
              />
            )}
            <Crown size={64} color={colors.textSecondary} strokeWidth={1.5} />
          </View>
          <Text style={styles.emptyStateTitle}>Kaweely is OFF</Text>
          <Text style={styles.emptyStateText}>
            Turn on Kaweely from the home screen to view your subscription status.
          </Text>
        </View>
      ) : (
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.heroCard}>
            <LinearGradient
              colors={[planDetails.accentColor, `${planDetails.accentColor}DD`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            />
            <Animated.View 
              style={[
                styles.glowEffect, 
                { 
                  backgroundColor: "#FFFFFF",
                  opacity: glowOpacity,
                  transform: [{ scale: pulseAnim }]
                }
              ]} 
            />
            <Animated.View 
              style={[
                styles.glowEffectBottom, 
                { 
                  backgroundColor: "#FFFFFF",
                  opacity: glowOpacity,
                }
              ]} 
            />
            <Animated.View
              style={[
                styles.shimmer,
                { transform: [{ translateX: shimmerAnim }] },
              ]}
            >
              <View
                style={[
                  styles.shimmerGradient,
                  { backgroundColor: "#FFFFFF15" },
                ]}
              />
            </Animated.View>

            <View style={styles.heroContent}>
              <View style={styles.planBadge}>
                <Crown size={16} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.planBadgeText}>ACTIVE PLAN</Text>
              </View>

              <Text style={styles.planTitle}>{planDetails.title}</Text>
              <Text style={styles.planDuration}>{planDetails.duration}</Text>

              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{remainingPieces}</Text>
                  <Text style={styles.statLabel}>Pieces Left</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    {subscription?.remainingPickupsThisWeek ?? planDetails.pickupsPerWeek}/{planDetails.pickupsPerWeek}
                  </Text>
                  <Text style={styles.statLabel}>Pickups Left</Text>
                </View>
              </View>

              <View style={styles.qrSection}>
                <Text style={styles.qrTitle}>🎫 Your Kaweely QR Code</Text>
                <View style={styles.qrContainer}>
                  {qrData ? (
                    <SimpleQRCode key={qrKey} data={qrData} size={QR_SIZE} />
                  ) : (
                    <View style={styles.qrCodePlaceholder}>
                      <QrCode size={60} color="#999" strokeWidth={1.5} />
                      <Text style={{ marginTop: 12, fontSize: 12, color: "#999", fontWeight: "600" as const }}>Generating...</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.qrSubtitle}>Scan at service points{user?.qrToken ? ` • ID: ${user.qrToken}` : ''}</Text>
              </View>

              {subscription?.startDate && (
                <View style={styles.datesContainer}>
                  <View style={styles.dateRow}>
                    <Text style={styles.dateLabel}>Started:</Text>
                    <Text style={styles.dateValue}>
                      {new Date(subscription.startDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </View>
                  {subscription?.endDate && (
                    <View style={styles.dateRow}>
                      <Text style={styles.dateLabel}>Expires:</Text>
                      <Text style={styles.dateValue}>
                        {new Date(subscription.endDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>

          {planDetails.pieces > 0 && (
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Usage Progress</Text>
                <Text style={[styles.progressValue, { color: planDetails.accentColor }]}>
                  {usedPieces} / {planDetails.pieces}
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <Animated.View
                  style={[
                    styles.progressBar,
                    {
                      width: progressWidth,
                      backgroundColor: planDetails.accentColor,
                    },
                  ]}
                />
              </View>
            </View>
          )}

          <Text style={styles.sectionTitle}>Plan Features</Text>
          <View style={styles.featuresGrid}>
            {planDetails.features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: `${planDetails.accentColor}25` }]}>
                  <CheckCircle2 size={22} color={planDetails.accentColor} strokeWidth={2.5} />
                </View>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {currentSubscription !== "year" && (
            <View style={[styles.upgradeCard, { borderColor: `${planDetails.accentColor}40` }]}>
              <View style={styles.upgradeHeader}>
                <View style={[styles.upgradeIconContainer, { backgroundColor: `${planDetails.accentColor}25` }]}>
                  <TrendingUp size={24} color={planDetails.accentColor} strokeWidth={2.5} />
                </View>
                <Text style={styles.upgradeTitle}>Upgrade Your Plan</Text>
              </View>
              <Text style={styles.upgradeDescription}>
                Get more pieces, faster delivery, and premium features by upgrading to a higher tier plan.
              </Text>
              <TouchableOpacity
                style={[styles.upgradeButton, { backgroundColor: planDetails.accentColor }]}
                activeOpacity={0.8}
                onPress={() => router.push("/subscribe")}
              >
                <Text style={styles.upgradeButtonText}>Explore Plans</Text>
                <Sparkles size={20} color="#FFFFFF" strokeWidth={2.5} fill="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}

          <View style={[styles.promoCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <View style={styles.promoHeader}>
              <Tag size={24} color={colors.accent} strokeWidth={2.5} />
              <Text style={[styles.promoTitle, { color: colors.text }]}>Have a Promo Code?</Text>
            </View>
            <View style={styles.promoInputContainer}>
              <TextInput
                style={[styles.promoInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="Enter promo code"
                placeholderTextColor={colors.textSecondary}
                value={promoCode}
                onChangeText={setPromoCode}
                autoCapitalize="characters"
              />
              <TouchableOpacity 
                style={[
                  styles.applyButton,
                  { backgroundColor: colors.tint },
                  !promoCode.trim() && [styles.applyButtonDisabled, { backgroundColor: colors.border }],
                  promoApplied && styles.applyButtonSuccess,
                ]}
                onPress={handleApplyPromo}
                disabled={!promoCode.trim()}
                activeOpacity={0.8}
              >
                <Text style={styles.applyButtonText}>
                  {promoApplied ? "✓" : "Apply"}
                </Text>
              </TouchableOpacity>
            </View>
            {promoApplied && appliedPromoCode && (
              <View style={styles.promoSuccessContainer}>
                <CheckCircle2 size={16} color={Colors.light.success} />
                <Text style={styles.promoSuccessText}>
                  {appliedPromoCode.type === 'free_order' 
                    ? `FREE subscription with code "${appliedPromoCode.code}"! 🎉`
                    : `You're saving ${format(appliedPromoCode.discountAmount)} with code "${appliedPromoCode.code}"! 💰`
                  }
                </Text>
              </View>
            )}
          </View>

          <View style={styles.renewCard}>
            <View style={styles.renewHeader}>
              <View style={[styles.renewIconContainer, { backgroundColor: `${planDetails.accentColor}25` }]}>
                <RefreshCw size={24} color={planDetails.accentColor} strokeWidth={2.5} />
              </View>
              <Text style={styles.renewTitle}>Manage Subscription</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.renewButton,
                { 
                  backgroundColor: colors.background,
                  borderColor: planDetails.accentColor
                }
              ]}
              activeOpacity={0.8}
              onPress={() => router.push("/subscribe")}
            >
              <Text style={[styles.renewButtonText, { color: planDetails.accentColor }]}>
                Renew Now
              </Text>
              <ArrowRight size={20} color={planDetails.accentColor} strokeWidth={2.5} />
            </TouchableOpacity>
            
            {currentSubscription !== "none" && (
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  { 
                    borderColor: "#EF4444"
                  }
                ]}
                activeOpacity={0.8}
                onPress={handleCancelSubscription}
              >
                <Text style={[styles.cancelButtonText, { color: "#EF4444" }]}>
                  Cancel Subscription
                </Text>
                <XCircle size={20} color="#EF4444" strokeWidth={2.5} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
      )}
    </View>
  );
}
