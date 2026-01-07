import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Animated, Platform } from "react-native";
import { useState, useRef, useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { 
  Power, 
  DollarSign, 
  Package, 
  Star, 
  TrendingUp, 
  Clock, 
  MapPin, 
  ChevronRight,
  Bell,
  User,
  Menu
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useDriver } from "@/contexts/DriverContext";
import { OrderManager } from "@/utils/OrderManager";
import * as Haptics from "expo-haptics";

export default function DriverDashboardScreen() {
  const { colors } = useTheme();
  const { 
    driverProfile, 
    updateDriverStatus, 
    activeOrders,
    unreadNotifications,
  } = useDriver();
  
  const router = useRouter();
  const [availableOrders, setAvailableOrders] = useState<any[]>([]);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  const isAvailable = driverProfile?.status === 'available';
  const isBusy = driverProfile?.status === 'busy';

  useEffect(() => {
    loadAvailableOrders();
    const interval = setInterval(loadAvailableOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAvailable) {
      Animated.loop(
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
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isAvailable]);

  const loadAvailableOrders = async () => {
    const allOrders = await OrderManager.getAllOrders();
    const available = allOrders.filter(
      o => (o.status === 'pickup_scheduled' || o.status === 'ready') && !o.assignedDriverId
    );
    setAvailableOrders(available.slice(0, 5));
  };

  const toggleStatus = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (!driverProfile) return;
    
    let newStatus: 'available' | 'busy' | 'offline';
    if (driverProfile.status === 'offline') {
      newStatus = 'available';
    } else if (driverProfile.status === 'available') {
      newStatus = 'busy';
    } else {
      newStatus = 'offline';
    }
    
    await updateDriverStatus(newStatus);
  };

  const getStatusColor = () => {
    switch (driverProfile?.status) {
      case 'available': return '#10B981';
      case 'busy': return '#F59E0B';
      case 'offline': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusText = () => {
    switch (driverProfile?.status) {
      case 'available': return 'Available';
      case 'busy': return 'Busy';
      case 'offline': return 'Offline';
      default: return 'Offline';
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingVertical: 20,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    greeting: {
      fontSize: 24,
      fontWeight: "800" as const,
      color: colors.text,
    },
    headerIcons: {
      flexDirection: "row",
      gap: 12,
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.cardBackground,
      alignItems: "center",
      justifyContent: "center",
      position: "relative" as const,
    },
    notificationBadge: {
      position: "absolute" as const,
      top: -4,
      right: -4,
      backgroundColor: "#EF4444",
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 6,
    },
    badgeText: {
      color: "#FFFFFF",
      fontSize: 11,
      fontWeight: "700" as const,
    },
    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.cardBackground,
      padding: 16,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: getStatusColor(),
    },
    statusLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    statusIndicator: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: getStatusColor(),
      alignItems: "center",
      justifyContent: "center",
    },
    statusTextContainer: {
      gap: 2,
    },
    statusLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "600" as const,
    },
    statusText: {
      fontSize: 18,
      fontWeight: "800" as const,
      color: getStatusColor(),
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 20,
    },
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      marginBottom: 24,
    },
    statCard: {
      flex: 1,
      minWidth: "47%",
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    statValue: {
      fontSize: 24,
      fontWeight: "800" as const,
      color: colors.text,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: "600" as const,
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "800" as const,
      color: colors.text,
    },
    sectionAction: {
      fontSize: 14,
      color: colors.tint,
      fontWeight: "600" as const,
    },
    orderCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    orderHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    orderNumber: {
      fontSize: 16,
      fontWeight: "800" as const,
      color: colors.text,
    },
    orderBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    orderBadgeText: {
      fontSize: 12,
      fontWeight: "700" as const,
      color: "#FFFFFF",
    },
    orderInfo: {
      gap: 8,
      marginBottom: 12,
    },
    orderRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    orderText: {
      fontSize: 14,
      color: colors.textSecondary,
      flex: 1,
    },
    orderActions: {
      flexDirection: "row",
      gap: 8,
    },
    acceptButton: {
      flex: 1,
      backgroundColor: colors.tint,
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 6,
    },
    acceptButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "700" as const,
    },
    viewButton: {
      backgroundColor: colors.background,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: colors.border,
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: 32,
    },
    emptyText: {
      fontSize: 15,
      color: colors.textSecondary,
      marginTop: 12,
    },
  });

  if (!driverProfile) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
          <Text style={{ color: colors.textSecondary }}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.greeting}>Hey, {driverProfile.name}! 👋</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => router.push("/driver-notifications")}
            >
              <Bell size={20} color={colors.text} />
              {unreadNotifications > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>{unreadNotifications}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => router.push("/driver-profile")}
            >
              <User size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View style={[styles.statusContainer, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.statusLeft}>
            <View style={styles.statusIndicator}>
              <Power size={24} color="#FFFFFF" />
            </View>
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusLabel}>Status</Text>
              <Text style={styles.statusText}>{getStatusText()}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={toggleStatus}>
            <View style={{
              width: 60,
              height: 34,
              borderRadius: 17,
              backgroundColor: getStatusColor(),
              padding: 2,
              justifyContent: 'center',
            }}>
              <View style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: '#FFFFFF',
                transform: [{ translateX: driverProfile.status === 'offline' ? 0 : 26 }],
              }} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <DollarSign size={22} color="#10B981" />
              </View>
              <Text style={styles.statValue}>${driverProfile.stats.todayEarnings.toFixed(0)}</Text>
              <Text style={styles.statLabel}>Today's Earnings</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                <Package size={22} color="#3B82F6" />
              </View>
              <Text style={styles.statValue}>{driverProfile.stats.todayDeliveries}</Text>
              <Text style={styles.statLabel}>Deliveries Today</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                <Star size={22} color="#F59E0B" />
              </View>
              <Text style={styles.statValue}>{driverProfile.rating.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
                <TrendingUp size={22} color="#8B5CF6" />
              </View>
              <Text style={styles.statValue}>{driverProfile.stats.completionRate}%</Text>
              <Text style={styles.statLabel}>Completion</Text>
            </View>
          </View>

          {activeOrders.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Active Orders ({activeOrders.length})</Text>
                <TouchableOpacity onPress={() => router.push("/driver-active-orders")}>
                  <Text style={styles.sectionAction}>View All</Text>
                </TouchableOpacity>
              </View>

              {activeOrders.slice(0, 2).map((order) => (
                <TouchableOpacity 
                  key={order.id}
                  style={styles.orderCard}
                  onPress={() => router.push(`/driver-order/${order.id}` as any)}
                >
                  <View style={styles.orderHeader}>
                    <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                    <View style={[styles.orderBadge, { backgroundColor: '#3B82F6' }]}>
                      <Text style={styles.orderBadgeText}>{order.type.toUpperCase()}</Text>
                    </View>
                  </View>
                  <View style={styles.orderInfo}>
                    <View style={styles.orderRow}>
                      <MapPin size={16} color={colors.textSecondary} />
                      <Text style={styles.orderText}>{order.address}</Text>
                    </View>
                    <View style={styles.orderRow}>
                      <Clock size={16} color={colors.textSecondary} />
                      <Text style={styles.orderText}>{order.estimatedTime} min away</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.acceptButton}>
                    <Text style={styles.acceptButtonText}>View Details</Text>
                    <ChevronRight size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {isAvailable && availableOrders.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Available Orders</Text>
              </View>

              {availableOrders.map((order) => (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                    <View style={[styles.orderBadge, { backgroundColor: '#10B981' }]}>
                      <Text style={styles.orderBadgeText}>
                        {order.status === 'pickup_scheduled' ? 'PICKUP' : 'DELIVERY'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.orderInfo}>
                    <View style={styles.orderRow}>
                      <MapPin size={16} color={colors.textSecondary} />
                      <Text style={styles.orderText}>{order.deliveryAddress || 'Customer Address'}</Text>
                    </View>
                    <View style={styles.orderRow}>
                      <DollarSign size={16} color={colors.textSecondary} />
                      <Text style={styles.orderText}>Earn $25-50</Text>
                    </View>
                  </View>
                  <View style={styles.orderActions}>
                    <TouchableOpacity 
                      style={styles.acceptButton}
                      onPress={() => router.push(`/driver-order-accept/${order.id}` as any)}
                    >
                      <Text style={styles.acceptButtonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.viewButton}>
                      <ChevronRight size={20} color={colors.text} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {isAvailable && availableOrders.length === 0 && (
            <View style={styles.emptyState}>
              <Package size={48} color={colors.textSecondary} />
              <Text style={styles.emptyText}>
                No orders available right now
              </Text>
            </View>
          )}

          {!isAvailable && (
            <View style={styles.emptyState}>
              <Power size={48} color={colors.textSecondary} />
              <Text style={styles.emptyText}>
                Turn on availability to start receiving orders
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
