import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useOrders } from "@/contexts/OrderContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { StatusBadge } from "@/components/StatusBadge";
import { ExpressDeliveryTimer } from "@/components/ExpressDeliveryTimer";
import { CancelOrderTimer } from "@/components/CancelOrderTimer";
import { OrderStatus } from "@/types/order";
import Colors from "@/constants/colors";
import {
  Phone,
  MapPin,
  Calendar,
  FileText,
  Package,
  CheckCircle2,
  Clock,
  PlayCircle,
  XCircle,
  Truck,
  AlertCircle,
  Zap,
} from "lucide-react-native";
import { useEffect } from "react";



const statusIcons: Record<OrderStatus, typeof Clock> = {
  pending: Clock,
  pickup_scheduled: Calendar,
  pickup_in_progress: Truck,
  processing: PlayCircle,
  ready: Package,
  delivery_in_progress: Truck,
  completed: CheckCircle2,
  cancelled: XCircle,
};

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getOrderById, updateOrderStatus } = useOrders();
  const { format } = useCurrency();

  const order = id ? getOrderById(id) : null;

  useEffect(() => {
    if (!order || order.status === "completed" || order.status === "cancelled") {
      return;
    }

    const statusProgression: Record<OrderStatus, { next: OrderStatus; delayMinutes: number } | null> = {
      pending: { next: "pickup_scheduled", delayMinutes: 0.5 },
      pickup_scheduled: { next: "pickup_in_progress", delayMinutes: 1 },
      pickup_in_progress: { next: "processing", delayMinutes: 1.5 },
      processing: { next: "ready", delayMinutes: 2 },
      ready: { next: "delivery_in_progress", delayMinutes: 1 },
      delivery_in_progress: { next: "completed", delayMinutes: 1.5 },
      completed: null,
      cancelled: null,
    };

    const progression = statusProgression[order.status];
    if (!progression) return;

    const lastStatusChange = order.statusHistory[order.statusHistory.length - 1];
    const timeSinceLastChange = Date.now() - new Date(lastStatusChange.timestamp).getTime();
    const delayMs = progression.delayMinutes * 60 * 1000;

    const remainingTime = delayMs - timeSinceLastChange;

    if (remainingTime <= 0) {
      updateOrderStatus(order.id, progression.next);
      return;
    }

    const timer = setTimeout(() => {
      updateOrderStatus(order.id, progression.next);
    }, remainingTime);

    return () => clearTimeout(timer);
  }, [order, updateOrderStatus]);

  if (!order) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Order Details" }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Order not found</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => router.back()}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: order.orderNumber,
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {(order.status === "pending" || order.status === "pickup_scheduled") && (
            <CancelOrderTimer
              orderId={order.id}
              orderNumber={order.orderNumber}
              createdAt={order.createdAt}
              cancelWindowMinutes={1}
            />
          )}

          <View style={styles.headerCard}>
            <View style={styles.headerTop}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                  {order.isSOS && (
                    <View style={styles.sosBadge}>
                      <AlertCircle size={14} color="#FFFFFF" strokeWidth={2.5} />
                      <Text style={styles.sosBadgeText}>SOS</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.customerName}>{order.customerName}</Text>
              </View>
              <StatusBadge status={order.status} />
            </View>

            {order.isSOS && order.sosDeliveryTime && (
              <View style={styles.sosAlert}>
                <View style={styles.sosAlertIcon}>
                  <Zap size={20} color="#F59E0B" strokeWidth={2.5} fill="#F59E0B" />
                </View>
                <View style={styles.sosAlertContent}>
                  <Text style={styles.sosAlertTitle}>SOS Emergency Service</Text>
                  <Text style={styles.sosAlertText}>
                    Expected delivery: {new Date(order.sosDeliveryTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  {order.sosMultiplier && (
                    <Text style={styles.sosAlertMultiplier}>
                      Speed multiplier: {order.sosMultiplier}x
                    </Text>
                  )}
                </View>
              </View>
            )}

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Phone size={18} color={Colors.light.tabIconDefault} />
              <Text style={styles.infoText}>{order.phoneNumber}</Text>
            </View>

            <View style={styles.infoRow}>
              <MapPin size={18} color={Colors.light.tabIconDefault} />
              <Text style={styles.infoText}>
                {order.deliveryAddress || "No delivery address provided"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Calendar size={18} color={Colors.light.tabIconDefault} />
              <Text style={styles.infoText}>
                Created: {formatDate(order.createdAt)}
              </Text>
            </View>

            {order.pickupDate && (
              <View style={styles.infoRow}>
                <Package size={18} color={Colors.light.tabIconDefault} />
                <Text style={styles.infoText}>
                  Pickup: {formatDate(order.pickupDate)}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Items ({totalItems})</Text>
            <View style={styles.itemsList}>
              {order.items.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                  </View>
                  <Text style={styles.itemPrice}>
                    {format(item.price * item.quantity)}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                {format(order.totalPrice)}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subscription</Text>
            <View style={styles.subscriptionCard}>
              <Text style={styles.subscriptionText}>
                {order.subscription === "none"
                  ? "No Subscription"
                  : order.subscription === "week"
                  ? "Weekly Subscription"
                  : order.subscription === "month"
                  ? "Monthly Subscription"
                  : order.subscription === "3months"
                  ? "3 Months Subscription"
                  : order.subscription === "6months"
                  ? "6 Months Subscription"
                  : "1 Year Subscription"}
              </Text>
            </View>
          </View>

          {order.notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <View style={styles.notesCard}>
                <FileText size={18} color={Colors.light.tabIconDefault} />
                <Text style={styles.notesText}>{order.notes}</Text>
              </View>
            </View>
          )}

          {order.isExpress && order.expressDeliveryTime && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Express Delivery</Text>
              <ExpressDeliveryTimer 
                deliveryTime={order.expressDeliveryTime} 
                orderNumber={order.orderNumber}
              />
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status Timeline</Text>
            <View style={styles.timeline}>
              {order.statusHistory.map((history, index) => {
                const Icon = statusIcons[history.status];
                const isLast = index === order.statusHistory.length - 1;

                return (
                  <View key={index} style={styles.timelineItem}>
                    <View style={styles.timelineLeft}>
                      <View
                        style={[
                          styles.timelineIcon,
                          {
                            backgroundColor: Colors.light[history.status],
                          },
                        ]}
                      >
                        <Icon size={16} color="#FFFFFF" />
                      </View>
                      {!isLast && <View style={styles.timelineLine} />}
                    </View>

                    <View style={styles.timelineRight}>
                      <Text style={styles.timelineStatus}>
                        {history.status.charAt(0).toUpperCase() +
                          history.status.slice(1)}
                      </Text>
                      <Text style={styles.timelineDate}>
                        {formatDate(history.timestamp)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
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
    padding: 16,
    paddingBottom: 100,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  errorButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.light.tint,
    borderRadius: 12,
  },
  errorButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600" as const,
  },
  headerCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  orderNumber: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  customerName: {
    fontSize: 16,
    color: Colors.light.tabIconDefault,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.text,
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  itemsList: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.tint,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.light.tint,
  },
  notesCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  notesText: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
  },
  timeline: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  timelineItem: {
    flexDirection: "row",
    gap: 16,
  },
  timelineLeft: {
    alignItems: "center",
  },
  timelineIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.light.border,
    marginVertical: 4,
  },
  timelineRight: {
    flex: 1,
    paddingBottom: 24,
  },
  timelineStatus: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: Colors.light.cardBackground,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  updateButton: {
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.tint,
    alignItems: "center",
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  cancelButton: {
    backgroundColor: Colors.light.error,
  },
  cancelButtonText: {
    color: "#FFFFFF",
  },
  subscriptionCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  subscriptionText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.tint,
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
  sosAlert: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  sosAlertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosAlertContent: {
    flex: 1,
  },
  sosAlertTitle: {
    fontSize: 14,
    fontWeight: '800' as const,
    color: '#92400E',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  sosAlertText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#92400E',
    marginBottom: 2,
  },
  sosAlertMultiplier: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#B45309',
  },
});
