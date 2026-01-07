import { View, Text, StyleSheet, Animated } from "react-native";
import { useState, useEffect, useRef } from "react";
import { Clock, Zap, CheckCircle2 } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

type ExpressDeliveryTimerProps = {
  deliveryTime: Date;
  orderNumber: string;
};

export function ExpressDeliveryTimer({ deliveryTime, orderNumber }: ExpressDeliveryTimerProps) {
  const { colors } = useTheme();
  const [timeRemaining, setTimeRemaining] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
  }>({ hours: 0, minutes: 0, seconds: 0, total: 0 });
  const [isExpired, setIsExpired] = useState<boolean>(false);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const delivery = new Date(deliveryTime).getTime();
      const difference = delivery - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeRemaining({ hours: 0, minutes: 0, seconds: 0, total: 0 });
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({ hours, minutes, seconds, total: difference });
    };

    const startTime = Date.now();
    const deliveryTimestamp = new Date(deliveryTime).getTime();
    const totalDuration = deliveryTimestamp - startTime;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.max(0, Math.min(1, elapsed / totalDuration));
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 500,
        useNativeDriver: false,
      }).start();
    };

    calculateTimeRemaining();
    updateProgress();
    const interval = setInterval(() => {
      calculateTimeRemaining();
      updateProgress();
    }, 1000);

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => {
      clearInterval(interval);
      pulseAnimation.stop();
    };
  }, [deliveryTime, pulseAnim, progressAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 12,
      marginTop: 12,
      borderWidth: 2,
      borderColor: isExpired ? colors.success : "#EF4444",
      shadowColor: isExpired ? colors.success : "#EF4444",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
      overflow: "hidden" as const,
    },
    backgroundProgress: {
      position: "absolute" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: isExpired ? `${colors.success}10` : "#FEF2F2",
    },
    progressBar: {
      position: "absolute" as const,
      top: 0,
      left: 0,
      bottom: 0,
      backgroundColor: isExpired ? `${colors.success}25` : "#FEE2E2",
    },
    content: {
      position: "relative" as const,
      zIndex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      flex: 1,
    },
    iconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: isExpired ? `${colors.success}20` : "#FEE2E2",
      justifyContent: "center",
      alignItems: "center",
    },
    headerTextContainer: {
      flex: 1,
    },
    expressLabel: {
      fontSize: 12,
      fontWeight: "800" as const,
      color: isExpired ? colors.success : "#EF4444",
      textTransform: "uppercase" as const,
      letterSpacing: 0.5,
      marginBottom: 1,
    },
    orderNumber: {
      fontSize: 10,
      fontWeight: "600" as const,
      color: colors.textSecondary,
    },
    badge: {
      backgroundColor: isExpired ? colors.success : "#EF4444",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 10,
      shadowColor: isExpired ? colors.success : "#EF4444",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    badgeText: {
      color: "#FFFFFF",
      fontSize: 9,
      fontWeight: "900" as const,
      letterSpacing: 0.3,
    },
    timerContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 6,
      marginBottom: 8,
    },
    timeBlock: {
      alignItems: "center",
      backgroundColor: isExpired ? `${colors.success}15` : colors.background,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 10,
      minWidth: 55,
      borderWidth: 1.5,
      borderColor: isExpired ? colors.success : "#FEE2E2",
    },
    timeValue: {
      fontSize: 20,
      fontWeight: "900" as const,
      color: isExpired ? colors.success : "#EF4444",
      marginBottom: 2,
    },
    timeLabel: {
      fontSize: 8,
      fontWeight: "700" as const,
      color: colors.textSecondary,
      textTransform: "uppercase" as const,
      letterSpacing: 0.3,
    },
    separator: {
      fontSize: 18,
      fontWeight: "900" as const,
      color: isExpired ? colors.success : "#EF4444",
      marginTop: -4,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    footerIcon: {
      opacity: 0.8,
    },
    footerText: {
      fontSize: 10,
      fontWeight: "600" as const,
      color: colors.textSecondary,
      textAlign: "center",
      flexShrink: 1,
    },
    completedMessage: {
      fontSize: 13,
      fontWeight: "800" as const,
      color: colors.success,
      textAlign: "center",
    },
  });

  if (isExpired) {
    return (
      <View style={styles.container}>
        <View style={styles.backgroundProgress} />
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconContainer}>
                <CheckCircle2 size={20} color={colors.success} strokeWidth={2.5} />
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={styles.expressLabel}>Delivered</Text>
                <Text style={styles.orderNumber}>{orderNumber}</Text>
              </View>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>COMPLETED</Text>
            </View>
          </View>
          <Text style={styles.completedMessage}>
            🎉 Your express delivery has been completed!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.backgroundProgress} />
      <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Animated.View 
              style={[
                styles.iconContainer,
                { transform: [{ scale: pulseAnim }] }
              ]}
            >
              <Zap size={20} color="#EF4444" strokeWidth={2.5} fill="#EF4444" />
            </Animated.View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.expressLabel}>Express Delivery</Text>
              <Text style={styles.orderNumber}>{orderNumber}</Text>
            </View>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>ACTIVE</Text>
          </View>
        </View>

        <View style={styles.timerContainer}>
          <View style={styles.timeBlock}>
            <Text style={styles.timeValue}>{String(timeRemaining.hours).padStart(2, '0')}</Text>
            <Text style={styles.timeLabel}>Hours</Text>
          </View>
          
          <Text style={styles.separator}>:</Text>
          
          <View style={styles.timeBlock}>
            <Text style={styles.timeValue}>{String(timeRemaining.minutes).padStart(2, '0')}</Text>
            <Text style={styles.timeLabel}>Minutes</Text>
          </View>
          
          <Text style={styles.separator}>:</Text>
          
          <View style={styles.timeBlock}>
            <Text style={styles.timeValue}>{String(timeRemaining.seconds).padStart(2, '0')}</Text>
            <Text style={styles.timeLabel}>Seconds</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Clock size={14} color={colors.textSecondary} strokeWidth={2.5} style={styles.footerIcon} />
          <Text style={styles.footerText}>
            Estimated delivery time • Your order will arrive soon!
          </Text>
        </View>
      </View>
    </View>
  );
}
