import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Animated, Image, Dimensions, FlatList } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Calendar, Clock, Tag, CheckCircle2, Zap, Package, Truck, Sparkles, Shield, Headphones, GraduationCap, Heart, Baby, ChevronDown, ChevronUp, Users } from "lucide-react-native";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import Colors from "@/constants/colors";
import SlidingPanel from "@/components/SlidingPanel";

import { subscriptionPlans, type SubscriptionPlan } from "@/constants/subscriptionPlans";

const benefits = [
  { icon: "sparkles" as const, text: "Professional steam ironing service", gradient: ["#4CAF50", "#66BB6A"] },
  { icon: "truck" as const, text: "Priority pickup and delivery", gradient: ["#2196F3", "#42A5F5"] },
  { icon: "shield" as const, text: "Quality guarantee on all items", gradient: ["#9C27B0", "#BA68C8"] },
  { icon: "zap" as const, text: "Express 2-hour delivery available", gradient: ["#FF9800", "#FFB74D"] },
  { icon: "headphones" as const, text: "Dedicated customer support", gradient: ["#F44336", "#EF5350"] },
  { icon: "tag" as const, text: "Exclusive member discounts", gradient: ["#FF5722", "#FF7043"] },
];

export default function SubscribeScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { colors, isAppActive } = useTheme();
  const { format } = useCurrency();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [activeIndex, setActiveIndex] = useState(1);
  const flatListRef = useRef<FlatList>(null);
  const [benefitsExpanded, setBenefitsExpanded] = useState(false);
  const logoUrl = "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/8nlam6zuq1umfi1sxbk5q";

  const logoGlowAnim = useRef(new Animated.Value(0)).current;
  const logoScaleAnim = useRef(new Animated.Value(1)).current;

  const planColors = subscriptionPlans.map(plan => plan.accentColor);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoGlowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(logoGlowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(logoScaleAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(logoScaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const [currentLogoColor, setCurrentLogoColor] = useState(planColors[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLogoColor((prevIndex) => {
        const currentIndex = planColors.indexOf(prevIndex);
        const nextIndex = (currentIndex + 1) % planColors.length;
        return planColors[nextIndex];
      });
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [planColors]);

  const handleSelectPlan = (planId: string) => {
    console.log("Selected plan:", planId);
    const promoParam = promoCode ? `&promo=${promoCode}` : "";
    router.push(`/delivery-schedule?plan=${planId}${promoParam}`);
  };

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      setPromoApplied(true);
      console.log("Promo code applied:", promoCode);
    }
  };

  const activePlan = subscriptionPlans[activeIndex];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 16,
      paddingBottom: 32,
      backgroundColor: colors.background,
    },
    header: {
      alignItems: "center",
      marginBottom: 32,
      paddingVertical: 16,
    },
    ironContainer: {
      position: "relative" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      marginBottom: 32,
      height: 240,
      width: "100%" as const,
    },
    steamContainer: {
      position: "absolute" as const,
      top: 0,
      left: "50%" as const,
      marginLeft: -20,
      zIndex: 1,
    },
    steamParticle: {
      position: "absolute" as const,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#E3F2FD",
    },
    ironGlow: {
      position: "absolute" as const,
      width: 180,
      height: 180,
      borderRadius: 90,
      zIndex: 0,
    },
    ironBody: {
      position: "relative" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      zIndex: 10,
    },
    ironHandle: {
      width: 100,
      height: 60,
      backgroundColor: "transparent",
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      borderWidth: 4,
      borderColor: "#37474F",
      marginBottom: -20,
      zIndex: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 8,
    },
    ironHandleInner: {
      position: "absolute" as const,
      top: 8,
      left: 8,
      right: 8,
      height: 30,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      opacity: 0.3,
    },
    ironMain: {
      width: 140,
      borderRadius: 20,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      overflow: "hidden" as const,
      borderWidth: 3,
      borderColor: "#37474F",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.4,
      shadowRadius: 20,
      elevation: 15,
    },
    ironTop: {
      height: 80,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      borderBottomWidth: 2,
    },
    ironLogo: {
      width: 50,
      height: 50,
      borderRadius: 25,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    ironPlate: {
      height: 70,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      paddingVertical: 12,
    },
    ironHoles: {
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      gap: 12,
      width: "80%" as const,
      justifyContent: "center" as const,
    },
    ironHole: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    ironTip: {
      height: 60,
      backgroundColor: "#37474F",
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      position: "relative" as const,
      overflow: "hidden" as const,
    },
    ironTipGlow: {
      width: "100%" as const,
      height: "100%" as const,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
    },
    sparkleEffect: {
      position: "absolute" as const,
      zIndex: 15,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "800" as const,
      marginBottom: 4,
      textAlign: "center",
      letterSpacing: -0.5,
      color: colors.text,
      paddingHorizontal: 20,
    },
    headerSubtitle: {
      fontSize: 12,
      lineHeight: 16,
      textAlign: "center",
      fontWeight: "600" as const,
      color: colors.textSecondary,
      paddingHorizontal: 20,
    },
    plansContainer: {
      gap: 10,
      marginBottom: 16,
    },
    planCard: {
      borderRadius: 24,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
      position: "relative" as const,
      overflow: "hidden" as const,
      borderWidth: 2,
      borderColor: "transparent",
    },
    planCardPopular: {
      shadowOpacity: 0.35,
      shadowRadius: 24,
      elevation: 12,
      transform: [{ scale: 1.02 }],
    },
    glowEffect: {
      position: "absolute" as const,
      top: -60,
      right: -60,
      width: 180,
      height: 180,
      borderRadius: 90,
    },
    glowEffectBottom: {
      position: "absolute" as const,
      bottom: -60,
      left: -60,
      width: 180,
      height: 180,
      borderRadius: 90,
    },
    glowPulse1: {
      position: "absolute" as const,
      top: "50%" as const,
      left: "50%" as const,
      width: 120,
      height: 120,
      borderRadius: 60,
      marginLeft: -60,
      marginTop: -60,
    },
    glowPulse2: {
      position: "absolute" as const,
      top: "50%" as const,
      right: -40,
      width: 100,
      height: 100,
      borderRadius: 50,
      marginTop: -50,
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
    backCard: {
      justifyContent: "space-between",
    },
    badge: {
      position: "absolute" as const,
      top: 16,
      right: 16,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 4,
      borderWidth: 1.5,
      borderColor: "#FFFFFF40",
      maxWidth: 140,
    },
    badgePopular: {
      shadowOpacity: 0.4,
      shadowRadius: 12,
    },
    badgeText: {
      fontSize: 9,
      fontWeight: "800" as const,
      letterSpacing: 0.3,
      flexShrink: 1,
      flexWrap: "wrap" as const,
    },
    badgeGlow: {
      position: "absolute" as const,
      top: -2,
      left: -2,
      right: -2,
      bottom: -2,
      borderRadius: 22,
      opacity: 0.4,
    },
    planHeader: {
      flexDirection: "row" as const,
      alignItems: "center",
      marginBottom: 12,
      gap: 12,
    },
    planIconContainer: {
      width: 52,
      height: 52,
      borderRadius: 26,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
      borderWidth: 2,
      borderColor: "#FFFFFF40",
    },
    iconGlow: {
      position: "absolute" as const,
      width: 64,
      height: 64,
      borderRadius: 32,
    },
    iconGlowPulse: {
      position: "absolute" as const,
      width: 52,
      height: 52,
      borderRadius: 26,
    },
    planTitleContainer: {
      flex: 1,
      paddingRight: 150,
    },
    planTitle: {
      fontSize: 16,
      fontWeight: "800" as const,
      marginBottom: 2,
      flexShrink: 1,
      flexWrap: "wrap" as const,
    },
    planDuration: {
      fontSize: 11,
      fontWeight: "600" as const,
      flexShrink: 1,
      flexWrap: "wrap" as const,
    },
    discountBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    discountBadgeText: {
      fontSize: 10,
      fontWeight: "800" as const,
      color: "#FFFFFF",
    },
    priceBreakdown: {
      gap: 8,
      marginBottom: 0,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
    },
    priceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    priceLabel: {
      fontSize: 13,
      fontWeight: "500" as const,
    },
    priceValue: {
      fontSize: 13,
      fontWeight: "600" as const,
    },
    discountLabel: {},
    discountValue: {},
    divider: {
      height: 2,
      marginVertical: 8,
    },
    finalPriceContainer: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 6,
    },
    finalPriceLabel: {
      fontSize: 11,
      fontWeight: "600" as const,
    },
    savingsText: {
      fontSize: 10,
      fontWeight: "700" as const,
    },
    priceRight: {
      alignItems: "flex-end" as const,
    },
    originalPrice: {
      fontSize: 11,
      textDecorationLine: "line-through" as const,
      marginBottom: 2,
    },
    finalPrice: {
      fontSize: 26,
      fontWeight: "800" as const,
    },
    finalPricePopular: {},
    installmentBadge: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      gap: 6,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 12,
      borderWidth: 1.5,
    },
    installmentBadgeText: {
      fontSize: 12,
      fontWeight: "700" as const,
      letterSpacing: 0.3,
    },
    selectButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderRadius: 16,
      paddingVertical: 14,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 6,
      borderWidth: 1.5,
      borderColor: "#FFFFFF40",
    },
    selectButtonPopular: {},
    selectButtonText: {
      fontSize: 15,
      fontWeight: "800" as const,
      letterSpacing: 0.3,
    },
    selectButtonTextPopular: {},
    panelHeader: {
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 16,
      marginBottom: 20,
      alignItems: "center",
    },
    panelTitle: {
      fontSize: 22,
      fontWeight: "800" as const,
      color: "#FFFFFF",
      marginBottom: 4,
    },
    panelSubtitle: {
      fontSize: 13,
      color: "#FFFFFFCC",
      fontWeight: "600" as const,
    },
    detailsContainer: {
      gap: 8,
    },
    summaryRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 8,
    },
    summaryLabel: {
      fontSize: 13,
      fontWeight: "500" as const,
      opacity: 0.7,
    },
    summaryValue: {
      fontSize: 16,
      fontWeight: "700" as const,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 12,
    },
    detailLabel: {
      fontSize: 14,
      fontWeight: "700" as const,
    },
    featuresTitle: {
      fontSize: 15,
      fontWeight: "800" as const,
      marginBottom: 12,
    },
    featuresList: {
      gap: 10,
    },
    featureItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    featureText: {
      fontSize: 12,
      fontWeight: "600" as const,
      flex: 1,
      flexShrink: 1,
    },
    selectButtonPanel: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderRadius: 16,
      paddingVertical: 18,
      marginTop: 24,
    },
    selectButtonPanelText: {
      fontSize: 16,
      fontWeight: "700" as const,
      color: "#FFFFFF",
    },
    benefitsCard: {
      borderRadius: 24,
      padding: 0,
      borderWidth: 2,
      marginBottom: 32,
      overflow: "hidden" as const,
      shadowColor: "#4CAF50",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },
    benefitsHeader: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 16,
      paddingVertical: 24,
      paddingHorizontal: 24,
      borderBottomWidth: 0,
    },
    benefitsIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      shadowColor: "#4CAF50",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 6,
    },
    benefitsTitle: {
      fontSize: 20,
      fontWeight: "800" as const,
      letterSpacing: 0.5,
      flex: 1,
    },
    benefitsList: {
      padding: 24,
      gap: 0,
    },
    benefitItem: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 16,
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 16,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 5,
    },
    benefitText: {
      fontSize: 14,
      fontWeight: "600" as const,
      flex: 1,
      lineHeight: 20,
    },
    promoCard: {
      borderRadius: 24,
      padding: 24,
      borderWidth: 1,
      marginBottom: 20,
      marginTop: 12,
    },
    promoHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 16,
    },
    promoTitle: {
      fontSize: 16,
      fontWeight: "700" as const,
    },
    promoInputContainer: {
      flexDirection: "row",
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
      justifyContent: "center",
      alignItems: "center",
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
      flexDirection: "row",
      alignItems: "center",
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
    wheelContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 40,
      position: "relative" as const,
    },
    wheelCircle: {
      width: 320,
      height: 320,
      borderRadius: 160,
      borderWidth: 3,
      borderColor: "#FFFFFF20",
      alignItems: "center",
      justifyContent: "center",
      position: "relative" as const,
    },
    wheelCenter: {
      width: 140,
      height: 140,
      borderRadius: 70,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 10,
      zIndex: 10,
    },
    wheelCenterTitle: {
      fontSize: 11,
      fontWeight: "800" as const,
      color: "#FFFFFF",
      marginTop: 6,
      textAlign: "center",
      paddingHorizontal: 4,
    },
    wheelCenterPrice: {
      fontSize: 24,
      fontWeight: "900" as const,
      color: "#FFFFFF",
      textAlign: "center",
    },
    wheelCenterSubtitle: {
      fontSize: 10,
      fontWeight: "600" as const,
      color: "#FFFFFFCC",
      textAlign: "center",
    },
    wheelItem: {
      position: "absolute" as const,
      width: 90,
      height: 90,
      borderRadius: 45,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 6,
      borderWidth: 2,
      borderColor: "#FFFFFF40",
    },
    wheelItemActive: {
      transform: [{ scale: 1.15 }],
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 12,
      borderWidth: 3,
      borderColor: "#FFFFFF",
    },
    wheelItemIcon: {
      marginBottom: 4,
    },
    wheelItemText: {
      fontSize: 9,
      fontWeight: "700" as const,
      color: "#FFFFFF",
      textAlign: "center",
    },
    wheelNavigation: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 20,
      marginTop: 30,
    },
    wheelNavButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
      borderWidth: 2,
      borderColor: "#FFFFFF40",
      position: "relative" as const,
      overflow: "hidden" as const,
    },
    wheelNavButtonGlow: {
      position: "absolute" as const,
      width: "100%" as const,
      height: "100%" as const,
      borderRadius: 28,
      opacity: 0.3,
    },
    planNameDisplay: {
      marginTop: 20,
      marginBottom: 10,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 20,
      alignItems: "center" as const,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 6,
      borderWidth: 2,
      borderColor: "#FFFFFF40",
    },
    planNameText: {
      fontSize: 18,
      fontWeight: "800" as const,
      color: "#FFFFFF",
      letterSpacing: 0.5,
      marginBottom: 4,
      textAlign: "center" as const,
      paddingHorizontal: 12,
    },
    planNameSubtext: {
      fontSize: 13,
      fontWeight: "600" as const,
      color: "#FFFFFFCC",
      textAlign: "center" as const,
      paddingHorizontal: 12,
    },
    sectionHeader: {
      fontSize: 20,
      fontWeight: "800" as const,
      marginBottom: 24,
      marginTop: 16,
      textAlign: "center",
      letterSpacing: 0.5,
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
    cardStackContainer: {
      alignItems: "center" as const,
      paddingVertical: 30,
      position: "relative" as const,
    },
    swipeHint: {
      fontSize: 14,
      fontWeight: "600" as const,
      marginBottom: 20,
      textAlign: "center" as const,
    },
    cardsWrapper: {
      width: "100%" as const,
      height: 600,
    },
    planCardSwipeable: {
      borderRadius: 32,
      padding: 24,
      marginHorizontal: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.4,
      shadowRadius: 32,
      elevation: 20,
      borderWidth: 3,
      borderColor: "#FFFFFF40",
    },
    cardGlow: {
      position: "absolute" as const,
      top: -10,
      left: -10,
      right: -10,
      bottom: -10,
      borderRadius: 40,
      overflow: "hidden" as const,
    },
    cardGlowPulse: {
      width: "100%" as const,
      height: "100%" as const,
      borderRadius: 40,
    },
    cardContent: {
      alignItems: "center" as const,
      gap: 12,
    },
    cardIconContainer: {
      width: 96,
      height: 96,
      borderRadius: 48,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      backgroundColor: "#FFFFFF25",
      marginBottom: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 10,
      position: "relative" as const,
    },
    cardIconGlow: {
      position: "absolute" as const,
      width: 110,
      height: 110,
      borderRadius: 55,
    },
    cardTitle: {
      fontSize: 28,
      fontWeight: "900" as const,
      color: "#FFFFFF",
      textAlign: "center" as const,
      letterSpacing: 0.5,
    },
    cardDuration: {
      fontSize: 15,
      fontWeight: "600" as const,
      color: "#FFFFFFCC",
      textAlign: "center" as const,
    },
    cardDivider: {
      width: "100%" as const,
      height: 2,
      backgroundColor: "#FFFFFF30",
      marginVertical: 16,
    },
    cardPriceContainer: {
      flexDirection: "row" as const,
      justifyContent: "space-around" as const,
      width: "100%" as const,
      marginBottom: 16,
    },
    cardPriceRow: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 8,
    },
    cardPieceText: {
      fontSize: 14,
      fontWeight: "700" as const,
      color: "#FFFFFF",
    },
    cardPriceBig: {
      alignItems: "center" as const,
      marginBottom: 16,
    },
    cardPrice: {
      fontSize: 42,
      fontWeight: "900" as const,
      color: "#FFFFFF",
      textAlign: "center" as const,
      marginBottom: 4,
    },
    cardSavings: {
      fontSize: 13,
      fontWeight: "700" as const,
      color: "#FFFFFF",
      backgroundColor: "#FFFFFF25",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    cardFeatures: {
      width: "100%" as const,
      gap: 8,
      marginBottom: 16,
    },
    cardFeatureRow: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 8,
    },
    cardFeatureText: {
      fontSize: 13,
      fontWeight: "600" as const,
      color: "#FFFFFF",
      flex: 1,
    },
    cardMoreFeatures: {
      fontSize: 12,
      fontWeight: "700" as const,
      color: "#FFFFFFCC",
      textAlign: "center" as const,
      fontStyle: "italic" as const,
    },
    cardSelectButton: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      gap: 8,
      paddingVertical: 16,
      borderRadius: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 10,
    },
    cardSelectButtonText: {
      fontSize: 17,
      fontWeight: "800" as const,
      letterSpacing: 0.3,
    },
    cardNavigationDots: {
      flexDirection: "row" as const,
      gap: 8,
      marginTop: 24,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },
    cardDot: {
      height: 8,
      borderRadius: 4,
      transition: "all 0.3s ease" as const,
    },
  });



  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: t.subscribe.title }} />

      {!isAppActive ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            {logoUrl && logoUrl.trim().length > 0 && logoUrl.startsWith('http') && (
              <Image
                source={{ uri: logoUrl }}
                style={{ width: 50, height: 50, opacity: 0.7 }}
                resizeMode="contain"
                onError={(error) => console.log('[Subscribe] Logo error:', error.nativeEvent?.error || 'Unknown error')}
              />
            )}
            <Package size={64} color={colors.textSecondary} strokeWidth={1.5} />
          </View>
          <Text style={styles.emptyStateTitle}>Kaweely is OFF</Text>
          <Text style={styles.emptyStateText}>
            Turn on Kaweely from the home screen to subscribe and access premium features.
          </Text>
        </View>
      ) : (
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.ironContainer}>
              
              <Animated.View style={[
                styles.ironGlow,
                {
                  backgroundColor: currentLogoColor,
                  opacity: logoGlowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 0.6],
                  }),
                  transform: [
                    { scale: logoGlowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.1],
                    })},
                  ],
                }
              ]} />
              
              <Animated.View style={[
                styles.ironBody,
                {
                  transform: [
                    { scale: logoScaleAnim },
                    { rotate: '-25deg' },
                  ],
                }
              ]}>
                <View style={styles.ironHandle}>
                  <Animated.View style={[
                    styles.ironHandleInner,
                    { backgroundColor: currentLogoColor }
                  ]} />
                </View>
                
                <View style={[styles.ironMain, { backgroundColor: colors.cardBackground }]}>
                  <View style={[styles.ironTop, { borderBottomColor: colors.border }]}>
                    <Animated.View style={[
                      styles.ironLogo,
                      {
                        backgroundColor: currentLogoColor,
                        opacity: logoGlowAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1],
                        }),
                      }
                    ]}>
                      {logoUrl && logoUrl.trim().length > 0 && logoUrl.startsWith('http') ? (
                        <Image
                          source={{ uri: logoUrl }}
                          style={{ width: 40, height: 40, borderRadius: 20 }}
                          resizeMode="cover"
                        />
                      ) : (
                        <Sparkles size={24} color="#FFFFFF" strokeWidth={2.5} fill="#FFFFFF" />
                      )}
                    </Animated.View>
                  </View>
                  
                  <View style={[styles.ironPlate, { backgroundColor: colors.border }]}>
                    <View style={styles.ironHoles}>
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <View
                          key={i}
                          style={[
                            styles.ironHole,
                            {
                              backgroundColor: colors.background,
                              opacity: 0.4,
                            }
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                  
                  <View style={styles.ironTip}>
                    <Animated.View style={[
                      styles.ironTipGlow,
                      {
                        backgroundColor: currentLogoColor,
                        opacity: logoGlowAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.5, 0.9],
                        }),
                      }
                    ]} />
                  </View>
                </View>
              </Animated.View>
            </View>
            
            <Text style={styles.headerTitle}>{t.subscribe.chooseYourPlan}</Text>
            <Text style={styles.headerSubtitle}>
              Unlock premium garment care with Kaweely
            </Text>
          </View>
          
          <View style={styles.cardStackContainer}>
            <Text style={[styles.swipeHint, { color: colors.textSecondary }]}>👈 Swipe to explore plans 👉</Text>
            
            <FlatList
              ref={flatListRef}
              data={subscriptionPlans}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToAlignment="center"
              snapToInterval={Dimensions.get('window').width}
              onMomentumScrollEnd={(event) => {
                const newIndex = Math.round(event.nativeEvent.contentOffset.x / Dimensions.get('window').width);
                setActiveIndex(newIndex);
              }}
              style={styles.cardsWrapper}
              keyExtractor={(item) => item.id}
              initialScrollIndex={1}
              getItemLayout={(_, index) => ({
                length: Dimensions.get('window').width,
                offset: Dimensions.get('window').width * index,
                index,
              })}
              renderItem={({ item: plan }) => {
                const IconComponent = 
                  plan.icon === "weekly" ? Clock :
                  plan.icon === "student" ? GraduationCap :
                  plan.icon === "couples" ? Heart :
                  plan.icon === "mothers" ? Baby :
                  plan.icon === "family" ? Users :
                  Calendar;
                
                return (
                  <View style={{ width: Dimensions.get('window').width }}>
                    <View
                      style={[
                        styles.planCardSwipeable,
                        { backgroundColor: plan.accentColor },
                      ]}
                    >
                      <View style={styles.cardGlow}>
                        <Animated.View style={[
                          styles.cardGlowPulse,
                          {
                            backgroundColor: '#FFFFFF',
                            opacity: logoGlowAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.1, 0.3],
                            }),
                          }
                        ]} />
                      </View>
                      
                      {plan.badge && (
                        <View style={[styles.badge, { backgroundColor: `${plan.accentColor}CC` }]}>
                          <Sparkles size={10} color="#FFFFFF" strokeWidth={2.5} fill="#FFFFFF" />
                          <Text style={[styles.badgeText, { color: "#FFFFFF" }]}>{plan.badge}</Text>
                        </View>
                      )}
                      
                      <View style={styles.cardContent}>
                        <View style={styles.cardIconContainer}>
                          <Animated.View style={[
                            styles.cardIconGlow,
                            {
                              backgroundColor: '#FFFFFF',
                              opacity: logoGlowAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.2, 0.4],
                              }),
                            }
                          ]} />
                          <IconComponent size={48} color="#FFFFFF" strokeWidth={2.5} />
                        </View>
                        
                        <Text style={styles.cardTitle}>{plan.title}</Text>
                        <Text style={styles.cardDuration}>{plan.duration}</Text>
                        
                        <View style={styles.cardDivider} />
                        
                        <View style={styles.cardPriceContainer}>
                          <View style={styles.cardPriceRow}>
                            <Package size={20} color="#FFFFFFCC" strokeWidth={2.5} />
                            <Text style={styles.cardPieceText}>{plan.pieces} Pieces</Text>
                          </View>
                          <View style={styles.cardPriceRow}>
                            <Truck size={20} color="#FFFFFFCC" strokeWidth={2.5} />
                            <Text style={styles.cardPieceText}>{plan.pickupsPerWeek}x/week</Text>
                          </View>
                        </View>
                        
                        <View style={styles.cardPriceBig}>
                          <Text style={styles.cardPrice}>{format(plan.finalPrice)}</Text>
                          {plan.savings && plan.savings > 0 && (
                            <Text style={styles.cardSavings}>Save {format(plan.savings)}!</Text>
                          )}
                        </View>
                        
                        <View style={styles.cardFeatures}>
                          {plan.features.slice(0, 3).map((feature: string, idx: number) => (
                            <View key={idx} style={styles.cardFeatureRow}>
                              <CheckCircle2 size={14} color="#FFFFFF" strokeWidth={2.5} />
                              <Text style={styles.cardFeatureText} numberOfLines={1}>{feature}</Text>
                            </View>
                          ))}
                          {plan.features.length > 3 && (
                            <Text style={styles.cardMoreFeatures}>+{plan.features.length - 3} more benefits</Text>
                          )}
                        </View>
                      </View>
                      
                      <TouchableOpacity
                        style={[styles.cardSelectButton, { backgroundColor: '#FFFFFF' }]}
                        onPress={() => setSelectedPlan(plan)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.cardSelectButtonText, { color: plan.accentColor }]}>View Details</Text>
                        <Zap size={20} color={plan.accentColor} strokeWidth={2.5} fill={plan.accentColor} />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
            />
            
            <View style={styles.cardNavigationDots}>
              {subscriptionPlans.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    flatListRef.current?.scrollToIndex({ index, animated: true });
                    setActiveIndex(index);
                  }}
                  style={[
                    styles.cardDot,
                    {
                      backgroundColor: index === activeIndex ? activePlan.accentColor : `${colors.textSecondary}40`,
                      width: index === activeIndex ? 32 : 8,
                    }
                  ]}
                />
              ))}
            </View>
          </View>

          {selectedPlan && (
            <SlidingPanel
              visible={selectedPlan !== null}
              onClose={() => setSelectedPlan(null)}
              title={`${selectedPlan.title} Plan`}
            >
              <View style={[styles.panelHeader, { backgroundColor: selectedPlan.accentColor }]}>
                <Text style={styles.panelTitle}>{selectedPlan.title} Subscription</Text>
                <Text style={styles.panelSubtitle}>{selectedPlan.duration} • {selectedPlan.pieces} Pieces</Text>
              </View>

              <View style={styles.detailsContainer}>
                <View style={styles.summaryRow}>
                  <Package size={24} color={selectedPlan.accentColor} strokeWidth={2.5} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Pieces</Text>
                    <Text style={[styles.summaryValue, { color: colors.text }]}>{selectedPlan.pieces} garments</Text>
                  </View>
                </View>

                <View style={styles.summaryRow}>
                  <Truck size={24} color={selectedPlan.accentColor} strokeWidth={2.5} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Pickups per Week</Text>
                    <Text style={[styles.summaryValue, { color: colors.text }]}>{selectedPlan.pickupsPerWeek}x pickup service</Text>
                  </View>
                </View>



                <View style={[styles.divider, { backgroundColor: colors.border, marginVertical: 20 }]} />

                <Text style={[styles.featuresTitle, { color: colors.text }]}>What&apos;s Included:</Text>
                <View style={styles.featuresList}>
                  {selectedPlan.features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <CheckCircle2 size={18} color={selectedPlan.accentColor} strokeWidth={2.5} />
                      <Text style={[styles.featureText, { color: colors.text }]}>{feature}</Text>
                    </View>
                  ))}
                </View>

                <View style={[styles.divider, { backgroundColor: colors.border, marginVertical: 20 }]} />

                <View style={{ gap: 12, paddingVertical: 12, paddingHorizontal: 16, backgroundColor: `${selectedPlan.accentColor}15`, borderRadius: 16 }}>
                  <View style={styles.priceRow}>
                    <Text style={[styles.priceLabel, { color: colors.text }]}>Base Price</Text>
                    <Text style={[styles.priceValue, { color: colors.text }]}>{format(selectedPlan.basePrice)}</Text>
                  </View>
                  
                  <View style={styles.priceRow}>
                    <Text style={[styles.priceLabel, { color: colors.text }]}>Delivery Fee</Text>
                    <Text style={[styles.priceValue, { color: colors.text }]}>{format(selectedPlan.deliveryFee)}</Text>
                  </View>

                  {selectedPlan.discount > 0 && (
                    <View style={styles.priceRow}>
                      <Text style={[styles.priceLabel, { color: selectedPlan.accentColor }]}>Discount ({selectedPlan.discount}%)</Text>
                      <Text style={[styles.priceValue, { color: selectedPlan.accentColor }]}>
                        -{format((selectedPlan.basePrice + selectedPlan.deliveryFee) * selectedPlan.discount / 100)}
                      </Text>
                    </View>
                  )}

                  <View style={[styles.divider, { backgroundColor: colors.border }]} />

                  <View style={styles.priceRow}>
                    <Text style={[styles.finalPriceLabel, { color: colors.text, fontSize: 16 }]}>Final Price</Text>
                    <Text style={[styles.finalPrice, { color: selectedPlan.accentColor, fontSize: 26 }]}>
                      {format(selectedPlan.finalPrice)}
                    </Text>
                  </View>
                  
                  {selectedPlan.savings && selectedPlan.savings > 0 && (
                    <Text style={[styles.savingsText, { color: selectedPlan.accentColor, textAlign: "center" }]}>💰 You save {format(selectedPlan.savings)}!</Text>
                  )}
                </View>
              </View>

              <TouchableOpacity
                style={[styles.selectButtonPanel, { backgroundColor: selectedPlan.accentColor }]}
                onPress={() => {
                  handleSelectPlan(selectedPlan.id);
                  setSelectedPlan(null);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.selectButtonPanelText}>Select This Plan</Text>
                <Zap size={20} color="#FFFFFF" strokeWidth={2.5} fill="#FFFFFF" />
              </TouchableOpacity>
            </SlidingPanel>
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
            {promoApplied && (
              <View style={styles.promoSuccessContainer}>
                <CheckCircle2 size={16} color={Colors.light.success} />
                <Text style={styles.promoSuccessText}>Promo code applied!</Text>
              </View>
            )}
          </View>

          <View style={[styles.benefitsCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <TouchableOpacity 
              style={[styles.benefitsHeader, { borderBottomColor: `${colors.success}30`, borderBottomWidth: benefitsExpanded ? 1 : 0 }]}
              onPress={() => setBenefitsExpanded(!benefitsExpanded)}
              activeOpacity={0.7}
            >
              <View style={[styles.benefitsIconContainer, { backgroundColor: `${colors.success}25` }]}>
                <CheckCircle2 size={28} color={colors.success} strokeWidth={2.5} />
              </View>
              <Text style={[styles.benefitsTitle, { color: colors.text }]}>{t.subscribe.features}</Text>
              {benefitsExpanded ? (
                <ChevronUp size={24} color={colors.text} strokeWidth={2.5} />
              ) : (
                <ChevronDown size={24} color={colors.text} strokeWidth={2.5} />
              )}
            </TouchableOpacity>
            {benefitsExpanded && <View style={styles.benefitsList}>
              {benefits.map((benefit, index) => {
                const IconComponent = 
                  benefit.icon === "sparkles" ? Sparkles :
                  benefit.icon === "truck" ? Truck :
                  benefit.icon === "shield" ? Shield :
                  benefit.icon === "zap" ? Zap :
                  benefit.icon === "headphones" ? Headphones :
                  Tag;
                const gradientColor = benefit.gradient[0];
                
                return (
                  <View 
                    key={index} 
                    style={[
                      styles.benefitItem,
                      { backgroundColor: `${gradientColor}15` }
                    ]}
                  >
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: `${gradientColor}30`,
                      alignItems: "center" as const,
                      justifyContent: "center" as const,
                    }}>
                      <IconComponent size={20} color={gradientColor} strokeWidth={2.5} />
                    </View>
                    <Text style={[styles.benefitText, { color: colors.text }]}>{benefit.text}</Text>
                  </View>
                );
              })}
            </View>}
          </View>
        </View>
      </ScrollView>
      )}
    </View>
  );
}
