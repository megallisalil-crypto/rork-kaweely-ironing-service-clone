import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useState, useEffect } from "react";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { MapPin, Clock, DollarSign, CheckCircle, XCircle } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useDriver } from "@/contexts/DriverContext";
import { OrderManager } from "@/utils/OrderManager";

export default function DriverOrderAcceptScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const { acceptOrder } = useDriver();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    const allOrders = await OrderManager.getAllOrders();
    const foundOrder = allOrders.find(o => o.id === id);
    setOrder(foundOrder);
  };

  const handleAccept = async () => {
    if (!order) return;
    
    setLoading(true);
    try {
      await acceptOrder(order.id);
      Alert.alert("Success", "Order accepted! Head to the location to begin.", [
        {
          text: "OK",
          onPress: () => router.replace("/driver-dashboard"),
        }
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to accept order");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = () => {
    Alert.alert(
      "Reject Order",
      "Are you sure you want to reject this order?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: () => router.back(),
        }
      ]
    );
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
      backgroundColor: '#10B981',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
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
    item: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    itemName: {
      fontSize: 14,
      color: colors.text,
      fontWeight: "600" as const,
    },
    itemQuantity: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    actions: {
      flexDirection: "row",
      gap: 12,
      padding: 20,
      paddingTop: 0,
    },
    acceptButton: {
      flex: 1,
      backgroundColor: '#10B981',
      borderRadius: 14,
      paddingVertical: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    rejectButton: {
      flex: 1,
      backgroundColor: colors.cardBackground,
      borderRadius: 14,
      paddingVertical: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderWidth: 2,
      borderColor: '#EF4444',
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "700" as const,
      color: "#FFFFFF",
    },
    rejectButtonText: {
      fontSize: 16,
      fontWeight: "700" as const,
      color: '#EF4444',
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Accept Order" }} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.orderNumber}>{order.orderNumber}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {order.status === 'pickup_scheduled' ? 'PICKUP' : 'DELIVERY'}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Details</Text>
            
            <View style={styles.infoRow}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
                <MapPin size={20} color="#6366F1" />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{order.deliveryAddress || 'Customer Address'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                <Clock size={20} color="#F59E0B" />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Estimated Time</Text>
                <Text style={styles.infoValue}>25-30 minutes</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <DollarSign size={20} color="#10B981" />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Earnings</Text>
                <Text style={styles.infoValue}>$25 - $50</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Items ({order.items.length})</Text>
            {order.items.map((item: any) => (
              <View key={item.id} style={styles.item}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>x{item.quantity}</Text>
              </View>
            ))}
          </View>

          {order.notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <Text style={{ fontSize: 14, color: colors.textSecondary }}>{order.notes}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={handleAccept}
          disabled={loading}
          activeOpacity={0.8}
        >
          <CheckCircle size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>{loading ? "Accepting..." : "Accept Order"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.rejectButton}
          onPress={handleReject}
          disabled={loading}
          activeOpacity={0.8}
        >
          <XCircle size={20} color="#EF4444" />
          <Text style={styles.rejectButtonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
