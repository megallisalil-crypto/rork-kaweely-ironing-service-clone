import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import { MapPin, Clock, DollarSign, ChevronRight } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useDriver } from "@/contexts/DriverContext";

export default function DriverActiveOrdersScreen() {
  const { colors } = useTheme();
  const { activeOrders } = useDriver();
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return '#6B7280';
      case 'en_route': return '#3B82F6';
      case 'arrived': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'assigned': return 'Assigned';
      case 'en_route': return 'En Route';
      case 'arrived': return 'Arrived';
      default: return status;
    }
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
      padding: 20,
    },
    orderCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
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
      fontSize: 18,
      fontWeight: "800" as const,
      color: colors.text,
    },
    badge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: "700" as const,
      color: "#FFFFFF",
    },
    orderInfo: {
      gap: 8,
      marginBottom: 16,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    infoText: {
      fontSize: 14,
      color: colors.textSecondary,
      flex: 1,
    },
    viewButton: {
      backgroundColor: colors.tint,
      borderRadius: 12,
      paddingVertical: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },
    viewButtonText: {
      fontSize: 14,
      fontWeight: "700" as const,
      color: "#FFFFFF",
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: 64,
    },
    emptyText: {
      fontSize: 15,
      color: colors.textSecondary,
      marginTop: 12,
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Active Orders (${activeOrders.length})` }} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {activeOrders.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No active orders</Text>
            </View>
          ) : (
            activeOrders.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                  <View style={[styles.badge, { backgroundColor: getStatusColor(order.status) }]}>
                    <Text style={styles.badgeText}>{getStatusText(order.status)}</Text>
                  </View>
                </View>

                <View style={styles.orderInfo}>
                  <View style={styles.infoRow}>
                    <MapPin size={16} color={colors.textSecondary} />
                    <Text style={styles.infoText}>{order.address}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Clock size={16} color={colors.textSecondary} />
                    <Text style={styles.infoText}>{order.estimatedTime} min away</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <DollarSign size={16} color={colors.textSecondary} />
                    <Text style={styles.infoText}>${order.earnings.toFixed(2)}</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.viewButton}
                  onPress={() => router.push(`/driver-order/${order.id}` as any)}
                >
                  <Text style={styles.viewButtonText}>Manage Order</Text>
                  <ChevronRight size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
