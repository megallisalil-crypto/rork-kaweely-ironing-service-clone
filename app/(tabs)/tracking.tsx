import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Alert, Animated, Dimensions } from "react-native";
import { Stack } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Clock, Package, CheckCircle, Truck, Phone, Gamepad2, AlertCircle, Zap } from "lucide-react-native";
import Svg, { Path, Circle as SvgCircle, G } from "react-native-svg";
import * as Notifications from "expo-notifications";
import { useOrders } from "@/contexts/OrderContext";
import { useFeedback } from "@/contexts/FeedbackContext";
import { useAuth } from "@/contexts/AuthContext";
import { Order } from "@/types/order";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { LaundryGame } from "@/components/LaundryGame";
import FeedbackPanel from "@/components/FeedbackPanel";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

type TrackingStatus = {
  title: string;
  description: string;
  icon: "scheduled" | "pickup" | "processing" | "delivery" | "completed";
  timestamp?: Date;
  completed: boolean;
};

const { width } = Dimensions.get("window");
const CIRCLE_SIZE = Math.min(width * 0.5, 220);
const STROKE_WIDTH = 12;

function IroningIcon({ size = 36 }: { size?: number }) {
  const steamOpacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(steamOpacity, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(steamOpacity, {
          toValue: 0.3,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [steamOpacity]);

  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <Svg width={size} height={size} viewBox="0 0 48 48">
        <G>
          <Path
            d="M20 12 L16 28 L26 28 L30 12 Z"
            fill="#FFFFFF"
            opacity={0.9}
          />
          <SvgCircle cx="23" cy="10" r="3.5" fill="#FFFFFF" opacity={0.9} />
          <Path
            d="M17 15 L16 16 L18 16 Z"
            fill="#FFFFFF"
            opacity={0.7}
          />
          <Path
            d="M28 15 L30 16 L28 16 Z"
            fill="#FFFFFF"
            opacity={0.7}
          />
          <Path
            d="M10 30 L36 30 L34 36 L12 36 Z"
            fill="#FFFFFF"
            opacity={1}
          />
          <Path
            d="M13 36 L15 40 L31 40 L33 36 Z"
            fill="#FFFFFF"
            opacity={0.85}
          />
          <Path
            d="M16 32 L18 33 L20 32 L22 33 L24 32 L26 33 L28 32 L30 33"
            stroke="#B0C4DE"
            strokeWidth="0.8"
            fill="none"
            opacity={0.5}
          />
        </G>
      </Svg>
      <Animated.View
        style={{
          position: 'absolute',
          top: -8,
          left: size * 0.15,
          opacity: steamOpacity,
        }}
      >
        <Svg width={size * 0.7} height={size * 0.4} viewBox="0 0 24 16">
          <Path
            d="M4 12 Q 4 8, 6 6 Q 8 4, 10 6 Q 12 8, 12 12"
            stroke="#FFFFFF"
            strokeWidth="2"
            fill="none"
            opacity={0.6}
            strokeLinecap="round"
          />
          <Path
            d="M10 12 Q 10 9, 12 7 Q 14 5, 16 7 Q 18 9, 18 12"
            stroke="#FFFFFF"
            strokeWidth="2"
            fill="none"
            opacity={0.5}
            strokeLinecap="round"
          />
          <Path
            d="M16 12 Q 16 10, 17 9 Q 18 8, 19 9 Q 20 10, 20 12"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            fill="none"
            opacity={0.4}
            strokeLinecap="round"
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

export default function TrackingScreen() {
  const insets = useSafeAreaInsets();
  const { orders, pendingFeedback, clearPendingFeedback } = useOrders();
  const { addFeedback, hasFeedback } = useFeedback();
  const { t } = useLanguage();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const buttonBounce = useRef(new Animated.Value(1)).current;
  const journeyOpacity = useRef(new Animated.Value(0)).current;
  const journeySlide = useRef(new Animated.Value(30)).current;
  const [showGame, setShowGame] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackOrder, setFeedbackOrder] = useState<{ orderId: string; orderNumber: string } | null>(null);

  useEffect(() => {
    if (!Array.isArray(orders)) {
      setActiveOrder(null);
      return;
    }
    const active = orders.filter(
      (order) =>
        order.status === "pickup_scheduled" ||
        order.status === "pickup_in_progress" ||
        order.status === "processing" ||
        order.status === "ready" ||
        order.status === "delivery_in_progress"
    );
    
    const sosOrders = active.filter(order => order.isSOS);
    const regularOrders = active.filter(order => !order.isSOS);
    
    const sortedOrders = [...sosOrders, ...regularOrders];
    setActiveOrder(sortedOrders.length > 0 ? sortedOrders[0] : null);
  }, [orders]);

  useEffect(() => {
    if (pendingFeedback && !hasFeedback(pendingFeedback.orderId)) {
      setFeedbackOrder(pendingFeedback);
      setShowFeedback(true);
    }
  }, [pendingFeedback, hasFeedback]);

  useEffect(() => {
    if (Platform.OS !== "web") {
      registerForPushNotificationsAsync();
    }
  }, []);

  useEffect(() => {
    if (activeOrder) {
      const progress = calculateProgress(activeOrder.status);
      
      Animated.spring(progressAnim, {
        toValue: progress,
        useNativeDriver: true,
        tension: 40,
        friction: 7,
      }).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        })
      ).start();
    }

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.spring(buttonBounce, {
          toValue: 1.05,
          useNativeDriver: true,
          tension: 30,
          friction: 5,
        }),
        Animated.spring(buttonBounce, {
          toValue: 1,
          useNativeDriver: true,
          tension: 30,
          friction: 5,
        }),
      ])
    ).start();

    Animated.parallel([
      Animated.timing(journeyOpacity, {
        toValue: 1,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.spring(journeySlide, {
        toValue: 0,
        tension: 40,
        friction: 8,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeOrder, progressAnim, pulseAnim, rotateAnim, glowAnim, buttonBounce, journeyOpacity, journeySlide]);

  const registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return;
    }
  };

  const calculateProgress = (status: string): number => {
    const statusMap: { [key: string]: number } = {
      pickup_scheduled: 0,
      pickup_in_progress: 0.2,
      processing: 0.5,
      ready: 0.75,
      delivery_in_progress: 0.9,
      completed: 1,
    };
    return statusMap[status] || 0;
  };

  const getTrackingSteps = (order: Order): TrackingStatus[] => {
    const steps: TrackingStatus[] = [
      {
        title: "Pickup Scheduled",
        description: `${order.pickupDate ? new Date(order.pickupDate).toLocaleDateString() : "Soon"}`,
        icon: "scheduled",
        completed: ["pickup_in_progress", "processing", "ready", "delivery_in_progress", "completed"].includes(order.status),
        timestamp: order.statusHistory.find((h) => h.status === "pickup_scheduled")?.timestamp,
      },
      {
        title: "Driver Picking Up",
        description: "Clothes being collected",
        icon: "pickup",
        completed: ["processing", "ready", "delivery_in_progress", "completed"].includes(order.status),
        timestamp: order.statusHistory.find((h) => h.status === "pickup_in_progress")?.timestamp,
      },
      {
        title: "Being Ironed",
        description: "Professional care in progress",
        icon: "processing",
        completed: ["ready", "delivery_in_progress", "completed"].includes(order.status),
        timestamp: order.statusHistory.find((h) => h.status === "processing")?.timestamp,
      },
      {
        title: "Ready",
        description: "Prepared for delivery",
        icon: "delivery",
        completed: ["delivery_in_progress", "completed"].includes(order.status),
        timestamp: order.statusHistory.find((h) => h.status === "ready")?.timestamp,
      },
      {
        title: "Out for Delivery",
        description: "On the way to you",
        icon: "delivery",
        completed: order.status === "completed",
        timestamp: order.statusHistory.find((h) => h.status === "delivery_in_progress")?.timestamp,
      },
    ];
    return steps;
  };

  const renderStatusIcon = (icon: string, size: number = 32) => {
    const iconColor = "#FFFFFF";

    switch (icon) {
      case "scheduled":
        return <Clock size={size} color={iconColor} />;
      case "pickup":
        return <Truck size={size} color={iconColor} />;
      case "processing":
        return <IroningIcon size={size} />;
      case "delivery":
        return <Truck size={size} color={iconColor} />;
      case "completed":
        return <CheckCircle size={size} color={iconColor} />;
      default:
        return <Package size={size} color={iconColor} />;
    }
  };

  const handleCallDriver = (order: Order) => {
    Alert.alert(
      "Call Driver",
      "Would you like to call the driver?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Call", onPress: () => console.log("Calling driver for order", order.orderNumber) },
      ]
    );
  };

  const getCurrentStepIndex = (order: Order): number => {
    const statusMap: { [key: string]: number } = {
      pickup_scheduled: 0,
      pickup_in_progress: 1,
      processing: 2,
      ready: 3,
      delivery_in_progress: 4,
      completed: 4,
    };
    return statusMap[order.status] || 0;
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
      paddingTop: insets.top + 16,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    orderNumber: {
      fontSize: 20,
      fontWeight: "800" as const,
      color: colors.tint,
      marginBottom: 2,
    },
    customerName: {
      fontSize: 12,
      color: colors.tabIconDefault,
      fontWeight: "500" as const,
    },
    callButton: {
      backgroundColor: colors.tint,
      width: 52,
      height: 52,
      borderRadius: 26,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.tint,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    driverAlert: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.cardBackground,
      padding: 14,
      borderRadius: 16,
      marginBottom: 16,
      gap: 12,
      borderWidth: 2,
      borderColor: colors.tint,
    },
    driverAlertText: {
      flex: 1,
      fontSize: 12,
      fontWeight: "700" as const,
      color: colors.text,
      lineHeight: 17,
    },
    circleContainer: {
      marginVertical: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    trackingColumn: {
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      marginBottom: 24,
    },
    gameColumn: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 16,
    },
    circleWrapper: {
      width: CIRCLE_SIZE,
      height: CIRCLE_SIZE,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },
    circleBackground: {
      position: "absolute",
      width: CIRCLE_SIZE,
      height: CIRCLE_SIZE,
      borderRadius: CIRCLE_SIZE / 2,
      borderWidth: STROKE_WIDTH,
      borderColor: colors.border,
    },
    progressCircle: {
      position: "absolute",
      width: CIRCLE_SIZE,
      height: CIRCLE_SIZE,
    },
    progressFill: {
      borderTopColor: "transparent",
      borderRightColor: "transparent",
      borderBottomColor: "transparent",
    },
    centerContent: {
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10,
      paddingHorizontal: 20,
      maxWidth: CIRCLE_SIZE - 40,
    },
    iconCircle: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: colors.tint,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.tint,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 8,
      marginBottom: 12,
    },
    stepTitle: {
      fontSize: 16,
      fontWeight: "900" as const,
      color: colors.text,
      textAlign: "center",
      marginBottom: 4,
      lineHeight: 20,
      letterSpacing: 0.3,
    },
    stepDesc: {
      fontSize: 11,
      color: colors.tabIconDefault,
      textAlign: "center",
      fontWeight: "600" as const,
      lineHeight: 15,
    },
    progressBadge: {
      backgroundColor: colors.tint,
      paddingHorizontal: 14,
      paddingVertical: 5,
      borderRadius: 14,
      marginTop: 8,
      shadowColor: colors.tint,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    progressText: {
      fontSize: 13,
      fontWeight: "900" as const,
      color: "#FFFFFF",
      letterSpacing: 0.5,
    },
    stepsCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 20,
      padding: 20,
      marginTop: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    stepsHeader: {
      fontSize: 18,
      fontWeight: "900" as const,
      color: colors.text,
      marginBottom: 16,
      letterSpacing: 0.3,
    },
    stepRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
      paddingVertical: 4,
      position: "relative",
    },
    stepDot: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: `${colors.border}30`,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 14,
      borderWidth: 3,
      borderColor: colors.border,
      zIndex: 2,
    },
    stepDotCompleted: {
      backgroundColor: colors.tint,
      borderColor: colors.tint,
      shadowColor: colors.tint,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    stepDotActive: {
      backgroundColor: colors.tint,
      borderColor: colors.tint,
      transform: [{ scale: 1.15 }],
      shadowColor: colors.tint,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 6,
    },
    stepDotInner: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.tabIconDefault,
    },
    stepConnector: {
      position: "absolute" as const,
      left: 15,
      top: 32,
      width: 2,
      height: 20,
      backgroundColor: colors.border,
      zIndex: 1,
    },
    stepConnectorCompleted: {
      backgroundColor: colors.tint,
    },
    stepInfo: {
      flex: 1,
    },
    stepRowTitle: {
      fontSize: 13,
      fontWeight: "700" as const,
      color: colors.tabIconDefault,
      marginBottom: 2,
    },
    stepRowTitleCompleted: {
      color: colors.text,
      fontWeight: "700" as const,
    },
    stepRowTitleActive: {
      color: colors.tint,
      fontSize: 14,
      fontWeight: "900" as const,
    },
    stepRowDesc: {
      fontSize: 11,
      color: colors.tabIconDefault,
      fontWeight: "500" as const,
    },
    stepRowTime: {
      fontSize: 9,
      color: colors.tabIconDefault,
      opacity: 0.7,
      marginTop: 1,
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 40,
    },
    emptyIconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: `${colors.tint}15`,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    emptyStateTitle: {
      fontSize: 17,
      fontWeight: "800" as const,
      color: colors.text,
      marginBottom: 6,
      textAlign: "center",
    },
    emptyStateText: {
      fontSize: 12,
      color: colors.tabIconDefault,
      textAlign: "center",
      lineHeight: 17,
      maxWidth: 280,
    },
    sosBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#EF4444',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      gap: 4,
      shadowColor: '#EF4444',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 4,
    },
    sosBadgeText: {
      fontSize: 10,
      fontWeight: '900' as const,
      color: '#FFFFFF',
      letterSpacing: 0.5,
    },
    sosDeliveryInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 4,
    },
    sosDeliveryText: {
      fontSize: 11,
      fontWeight: '700' as const,
      color: colors.warning,
    },
    bottomSpacer: {
      height: 20,
    },
    playButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderRadius: 30,
      backgroundColor: colors.tint,
      position: "relative" as const,
      overflow: "hidden" as const,
      gap: 8,
      shadowColor: colors.tint,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    },
    playButtonGlow: {
      position: "absolute" as const,
      top: -4,
      left: -4,
      right: -4,
      bottom: -4,
      borderRadius: 34,
      backgroundColor: colors.tint,
    },
    playButtonInner: {
      zIndex: 2,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    playButtonText: {
      fontSize: 14,
      fontWeight: "900" as const,
      color: "#FFFFFF",
      letterSpacing: 0.5,
    },
    playButtonIcon: {
      marginLeft: 2,
    },
    gameFullContainer: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 20,
      minHeight: 300,
    },
  });

  if (!activeOrder) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: t.tracking.title, headerShown: false }} />
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <Package size={60} color={colors.tint} />
          </View>
          <Text style={styles.emptyStateTitle}>No Active Orders</Text>
          <Text style={styles.emptyStateText}>
            Your active orders will appear here once you place an order
          </Text>
        </View>
      </View>
    );
  }

  const trackingSteps = getTrackingSteps(activeOrder);
  const currentStepIndex = getCurrentStepIndex(activeOrder);
  const progress = calculateProgress(activeOrder.status);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: t.tracking.title, headerShown: false }} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={styles.orderNumber}>{activeOrder.orderNumber}</Text>
                {activeOrder.isSOS && (
                  <View style={styles.sosBadge}>
                    <AlertCircle size={14} color="#FFFFFF" strokeWidth={2.5} />
                    <Text style={styles.sosBadgeText}>SOS</Text>
                  </View>
                )}
              </View>
              <Text style={styles.customerName}>{user?.name || activeOrder.customerName}</Text>
              {activeOrder.isSOS && activeOrder.sosDeliveryTime && (
                <View style={styles.sosDeliveryInfo}>
                  <Zap size={12} color={colors.warning} fill={colors.warning} />
                  <Text style={styles.sosDeliveryText}>
                    Expected: {new Date(activeOrder.sosDeliveryTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              )}
            </View>
            {(activeOrder.status === "pickup_in_progress" || activeOrder.status === "delivery_in_progress") && (
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => handleCallDriver(activeOrder)}
              >
                <Phone size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>

          {(activeOrder.status === "pickup_in_progress" || activeOrder.status === "delivery_in_progress") && (
            <View style={styles.driverAlert}>
              <Truck size={22} color={colors.tint} />
              <Text style={styles.driverAlertText}>
                {activeOrder.status === "pickup_in_progress"
                  ? "Driver is on the way to pick up your clothes"
                  : "Your order is being delivered now"}
              </Text>
            </View>
          )}

          <View style={styles.circleContainer}>
            <View style={styles.trackingColumn}>
              <View style={styles.circleWrapper}>
                <Animated.View
                  style={{
                    position: 'absolute',
                    width: CIRCLE_SIZE,
                    height: CIRCLE_SIZE,
                    transform: [{ rotate: spin }]
                  }}
                >
                  <View style={styles.circleBackground} />
                  <View style={styles.progressCircle}>
                    <View style={[styles.progressFill, {
                      width: CIRCLE_SIZE,
                      height: CIRCLE_SIZE,
                      borderRadius: CIRCLE_SIZE / 2,
                      borderWidth: STROKE_WIDTH,
                      borderColor: colors.tint,
                      transform: [{ rotate: `${progress * 360}deg` }],
                    }]} />
                  </View>
                </Animated.View>

                <Animated.View 
                  style={[
                    styles.centerContent,
                    {
                      transform: [{ scale: pulseAnim }]
                    }
                  ]}
                >
                  <View style={styles.iconCircle}>
                    {renderStatusIcon(trackingSteps[currentStepIndex].icon, 36)}
                  </View>
                  <Text style={styles.stepTitle}>{trackingSteps[currentStepIndex].title}</Text>
                  <Text style={styles.stepDesc}>{trackingSteps[currentStepIndex].description}</Text>
                  <View style={styles.progressBadge}>
                    <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
                  </View>
                </Animated.View>
              </View>
            </View>
          </View>

          <View style={styles.gameColumn}>
            <Animated.View style={{ transform: [{ scale: buttonBounce }] }}>
              <TouchableOpacity 
                style={styles.playButton}
                onPress={() => setShowGame(true)}
                activeOpacity={0.85}
              >
                <Animated.View 
                  style={[
                    styles.playButtonGlow,
                    {
                      opacity: glowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3, 0.7],
                      }),
                      transform: [
                        {
                          scale: glowAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.15],
                          }),
                        },
                      ],
                    },
                  ]}
                />
                <View style={styles.playButtonInner}>
                  <Gamepad2 size={18} color="#FFFFFF" style={styles.playButtonIcon} />
                  <Text style={styles.playButtonText}>Play a Game</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>

          <Animated.View 
            style={[
              styles.stepsCard,
              {
                opacity: journeyOpacity,
                transform: [{ translateY: journeySlide }],
              },
            ]}
          >
            <Text style={styles.stepsHeader}>Order Journey</Text>
            {trackingSteps.map((step, index) => (
              <View key={index} style={styles.stepRow}>
                {index < trackingSteps.length - 1 && (
                  <View style={[
                    styles.stepConnector,
                    step.completed && styles.stepConnectorCompleted,
                  ]} />
                )}
                <View style={[
                  styles.stepDot,
                  step.completed && styles.stepDotCompleted,
                  index === currentStepIndex && styles.stepDotActive,
                ]}>
                  {step.completed ? (
                    <CheckCircle size={14} color="#FFFFFF" />
                  ) : (
                    <View style={styles.stepDotInner} />
                  )}
                </View>
                <View style={styles.stepInfo}>
                  <Text style={[
                    styles.stepRowTitle,
                    step.completed && styles.stepRowTitleCompleted,
                    index === currentStepIndex && styles.stepRowTitleActive,
                  ]}>
                    {step.title}
                  </Text>
                  <Text style={styles.stepRowDesc}>{step.description}</Text>
                  {step.timestamp && (
                    <Text style={styles.stepRowTime}>
                      {new Date(step.timestamp).toLocaleString()}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </Animated.View>

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {feedbackOrder && (
        <FeedbackPanel
          visible={showFeedback}
          onClose={() => {
            setShowFeedback(false);
            clearPendingFeedback();
          }}
          orderNumber={feedbackOrder.orderNumber}
          onSubmit={(feedback) => {
            addFeedback({
              orderId: feedbackOrder.orderId,
              orderNumber: feedbackOrder.orderNumber,
              ...feedback,
            });
            clearPendingFeedback();
          }}
          colors={colors}
        />
      )}

      <LaundryGame 
        visible={showGame}
        onClose={() => setShowGame(false)}
        colors={colors}
      />
    </View>
  );
}
