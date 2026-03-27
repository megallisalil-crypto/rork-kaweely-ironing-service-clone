import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { MapPin, Clock, DollarSign, CheckCircle, Navigation } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useDriver } from "@/contexts/DriverContext";

export default function DriverOrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const { driverOrders, updateOrderStatus } = useDriver();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const foundOrder = driverOrders.find(o => o.id === id);
    setOrder(foundOrder);
  }, [id, driverOrders]);

  const handleStatusUpdate = async (newStatus: 'en_route' | 'arrived' | 'completed') => {
    if (!order) return;
    await updateOrderStatus(order.id, newStatus);
  };

  if (!order) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <Stack.Screen options={{ title: "Order Details" }} />
        <Text style={{ color: colors.textSecondary }}>Loading...</Text>
      </View>
    );
  }

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
    header: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    orderNumber: {
      fontSize: 28,
      fontWeight: "800" as const,
      color: colors.text,
      marginBottom: 8,
    },
    badge: {
      alignSelf: "flex-start" as const,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: '#3B82F6',
    },
    badgeText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "700" as const,
    },
    section: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 16,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 12,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    infoText: {
      flex: 1,
      gap: 2,
    },
    infoLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "600" as const,
    },
    infoValue: {
      fontSize: 15,
      color: colors.text,
      fontWeight: "600" as const,
    },
    actions: {
      padding: 20,
      gap: 12,
    },
    button: {
      borderRadius: 14,
      paddingVertical: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    primaryButton: {
      backgroundColor: colors.tint,
    },
    secondaryButton: {
      backgroundColor: colors.cardBackground,
      borderWidth: 2,
      borderColor: colors.border,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "700" as const,
    },
    primaryButtonText: {
      color: "#FFFFFF",
    },
    secondaryButtonText: {
      color: colors.text,
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Order Details" }} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.orderNumber}>{order.orderNumber}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{order.type.toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Info</Text>
            
            <View style={styles.infoRow}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
                <MapPin size={20} color="#6366F1" />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{order.address}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                <Clock size={20} color="#F59E0B" />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Estimated Time</Text>
                <Text style={styles.infoValue}>{order.estimatedTime} minutes</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <DollarSign size={20} color="#10B981" />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Earnings</Text>
                <Text style={styles.infoValue}>${order.earnings.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        {order.status === 'assigned' && (
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => handleStatusUpdate('en_route')}
          >
            <Navigation size={20} color="#FFFFFF" />
            <Text style={[styles.buttonText, styles.primaryButtonText]}>Start Navigation</Text>
          </TouchableOpacity>
        )}

        {order.status === 'en_route' && (
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => handleStatusUpdate('arrived')}
          >
            <MapPin size={20} color="#FFFFFF" />
            <Text style={[styles.buttonText, styles.primaryButtonText]}>Mark as Arrived</Text>
          </TouchableOpacity>
        )}

        {order.status === 'arrived' && (
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => {
              handleStatusUpdate('completed');
              router.replace("/driver-dashboard");
            }}
          >
            <CheckCircle size={20} color="#FFFFFF" />
            <Text style={[styles.buttonText, styles.primaryButtonText]}>Complete Order</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
