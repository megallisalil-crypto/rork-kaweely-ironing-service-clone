import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert } from "react-native";
import { memo, useEffect, useState, useRef } from "react";
import Colors from "@/constants/colors";
import { XCircle, Clock } from "lucide-react-native";
import { useOrders } from "@/contexts/OrderContext";
import { useRouter } from "expo-router";

type CancelOrderTimerProps = {
  orderId: string;
  orderNumber: string;
  createdAt: Date;
  cancelWindowMinutes?: number;
};

export const CancelOrderTimer = memo(function CancelOrderTimer({ 
  orderId, 
  orderNumber,
  createdAt,
  cancelWindowMinutes = 1
}: CancelOrderTimerProps) {
  const { cancelOrder } = useOrders();
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const cancelWindowMs = cancelWindowMinutes * 60 * 1000;
    const endTime = new Date(createdAt).getTime() + cancelWindowMs;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      
      setTimeLeft(remaining);
      
      if (remaining === 0) {
        setIsExpired(true);
      }

      const progress = remaining / cancelWindowMs;
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 100,
        useNativeDriver: false,
      }).start();
    };

    updateTimer();
    const interval = setInterval(updateTimer, 100);

    return () => clearInterval(interval);
  }, [createdAt, cancelWindowMinutes, progressAnim]);

  useEffect(() => {
    if (!isExpired && timeLeft > 0 && timeLeft < 30000) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [timeLeft, isExpired, pulseAnim]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancel Order",
      `Are you sure you want to cancel order ${orderNumber}?\n\nThis action cannot be undone.`,
      [
        {
          text: "No, Keep Order",
          style: "cancel",
        },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => {
            cancelOrder(orderId);
            Alert.alert(
              "Order Cancelled",
              `Order ${orderNumber} has been cancelled successfully.`,
              [
                {
                  text: "OK",
                  onPress: () => router.back(),
                }
              ]
            );
          },
        },
      ]
    );
  };

  if (isExpired) {
    return null;
  }

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const isUrgent = timeLeft < 30000;

  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ scale: pulseAnim }] }
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconCircle, isUrgent && styles.iconCircleUrgent]}>
            <Clock 
              size={18} 
              color={isUrgent ? Colors.light.error : Colors.light.warning} 
              strokeWidth={2.5} 
            />
          </View>
          <View>
            <Text style={styles.title}>Cancel Order Available</Text>
            <Text style={styles.subtitle}>Free cancellation window</Text>
          </View>
        </View>
      </View>

      <View style={styles.timerContainer}>
        <View style={styles.timerBox}>
          <Text style={[styles.timerText, isUrgent && styles.timerTextUrgent]}>
            {formatTime(timeLeft)}
          </Text>
          <Text style={styles.timerLabel}>remaining</Text>
        </View>
        
        <View style={styles.progressBarContainer}>
          <Animated.View 
            style={[
              styles.progressBar,
              {
                width: progressWidth,
                backgroundColor: isUrgent ? Colors.light.error : Colors.light.warning,
              }
            ]} 
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.cancelButton, isUrgent && styles.cancelButtonUrgent]}
        onPress={handleCancel}
        activeOpacity={0.85}
      >
        <XCircle size={20} color="#FFFFFF" strokeWidth={2.5} />
        <Text style={styles.cancelButtonText}>Cancel Order</Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 2,
    borderColor: Colors.light.warning + '30',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.warning + '20',
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircleUrgent: {
    backgroundColor: Colors.light.error + '20',
  },
  title: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontWeight: "600" as const,
  },
  timerContainer: {
    marginBottom: 16,
  },
  timerBox: {
    alignItems: "center",
    paddingVertical: 12,
  },
  timerText: {
    fontSize: 42,
    fontWeight: "800" as const,
    color: Colors.light.warning,
    letterSpacing: 2,
  },
  timerTextUrgent: {
    color: Colors.light.error,
  },
  timerLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    fontWeight: "600" as const,
    marginTop: 4,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: Colors.light.border,
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 8,
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.light.warning,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: Colors.light.warning,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  cancelButtonUrgent: {
    backgroundColor: Colors.light.error,
    shadowColor: Colors.light.error,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
});
