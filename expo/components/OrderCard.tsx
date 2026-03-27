import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { memo, useMemo, useCallback } from "react";
import { Order } from "@/types/order";
import { StatusBadge } from "./StatusBadge";
import { ExpressDeliveryTimer } from "./ExpressDeliveryTimer";
import Colors from "@/constants/colors";
import { Clock, Package, MapPin, ChevronRight, Calendar, AlertCircle, Zap } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";

type OrderCardProps = {
  order: Order;
};

export const OrderCard = memo(function OrderCard({ order }: OrderCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { format } = useCurrency();

  const formatDate = useCallback((date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }, []);

  const formatPrice = useCallback((price: number) => {
    return format(price, 'EGP');
  }, [format]);

  const totalItems = useMemo(() => 
    Array.isArray(order.items) 
      ? order.items.reduce((sum, item) => sum + item.quantity, 0)
      : 0,
    [order.items]
  );

  const handlePress = useCallback(() => {
    router.push(`/order/${order.id}`);
  }, [router, order.id]);

  const getStatusColor = (status: Order['status']) => {
    switch(status) {
      case 'completed': return '#E8F5E9';
      case 'processing': return '#FFF3E0';
      case 'ready': return '#E3F2FD';
      case 'delivery_in_progress': return '#F3E5F5';
      case 'pickup_in_progress': return '#FCE4EC';
      default: return '#FFF';
    }
  };

  const getClothIcon = () => {
    const status = order.status;
    if (status === 'completed' || status === 'ready') {
      return '👔';
    } else if (status === 'processing') {
      return '🧥';
    } else if (status === 'delivery_in_progress' || status === 'pickup_in_progress') {
      return '👕';
    }
    return '👗';
  };

  return (
    <View style={styles.hangingContainer}>
      <View style={styles.hangerContainer}>
        <View style={styles.hangerHook} />
        <View style={styles.hangerWire} />
        <View style={styles.hangerTop}>
          <View style={styles.hangerLeft} />
          <View style={styles.hangerRight} />
        </View>
      </View>
      
      <TouchableOpacity
        style={[styles.clothingItem, { backgroundColor: getStatusColor(order.status) }]}
        onPress={handlePress}
        activeOpacity={0.85}
      >
        <View style={styles.clothNeckline} />
        <View style={styles.clothShine} />
        
        <View style={styles.clothFabricTexture}>
          <View style={styles.clothTag}>
            <View style={styles.tagHole} />
            <Text style={styles.tagText}>{order.orderNumber}</Text>
          </View>
        </View>

        <View style={styles.clothBody}>
          <View style={styles.clothCenterSeam} />
          <View style={styles.ironedFoldLeft} />
          <View style={styles.ironedFoldRight} />

          <View style={styles.cardHeader}>
            <View style={styles.orderInfo}>
              <View style={styles.orderNumberContainer}>
                <Text style={styles.clothEmoji}>{getClothIcon()}</Text>
                <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                {order.isSOS && (
                  <View style={styles.sosBadge}>
                    <AlertCircle size={10} color="#FFFFFF" strokeWidth={2.5} />
                    <Text style={styles.sosBadgeText}>SOS</Text>
                  </View>
                )}
              </View>
              <Text style={styles.customerName}>{user?.name || order.customerName}</Text>
            </View>
            <StatusBadge status={order.status} size="small" />
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <View style={[styles.iconCircle, { backgroundColor: `${Colors.light.tint}20` }]}>
            <Calendar size={16} color={Colors.light.tint} strokeWidth={2.5} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Order Date</Text>
            <Text style={styles.detailValue}>{formatDate(order.createdAt)}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={[styles.iconCircle, { backgroundColor: `${Colors.light.accent}20` }]}>
            <Package size={16} color={Colors.light.accent} strokeWidth={2.5} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Items</Text>
            <Text style={styles.detailValue}>{totalItems} pieces</Text>
          </View>
        </View>

        {order.deliveryAddress && (
          <View style={styles.detailRow}>
            <View style={[styles.iconCircle, { backgroundColor: `${Colors.light.success}20` }]}>
              <MapPin size={16} color={Colors.light.success} strokeWidth={2.5} />
            </View>
            <View style={[styles.detailContent, { flex: 1 }]}>
              <Text style={styles.detailLabel}>Address</Text>
              <Text style={styles.detailValue} numberOfLines={1}>
                {order.deliveryAddress}
              </Text>
            </View>
          </View>
        )}
        
        {order.isSOS && order.sosDeliveryTime && (
          <View style={styles.detailRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Zap size={16} color="#F59E0B" strokeWidth={2.5} fill="#F59E0B" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>SOS Delivery</Text>
              <Text style={[styles.detailValue, { color: '#F59E0B', fontWeight: '700' }]}>
                {new Date(order.sosDeliveryTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        )}
          </View>

          <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total Amount</Text>
          <Text style={styles.priceValue}>{formatPrice(order.totalPrice)}</Text>
        </View>
        <View style={styles.viewDetailsContainer}>
          <Text style={styles.viewDetailsText}>View Details</Text>
          <ChevronRight size={18} color={Colors.light.tint} strokeWidth={2.5} />
        </View>
          </View>

          {order.estimatedArrival && (
            <View style={styles.etaContainer}>
          <Clock size={14} color={Colors.light.accent} strokeWidth={2.5} />
          <Text style={styles.etaText}>
            ETA: {formatDate(order.estimatedArrival)}
          </Text>
            </View>
          )}
          
          {order.isExpress && order.expressDeliveryTime && order.status !== 'completed' && order.status !== 'cancelled' && (
            <ExpressDeliveryTimer 
            deliveryTime={order.expressDeliveryTime} 
            orderNumber={order.orderNumber}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  hangingContainer: {
    marginBottom: 32,
    marginTop: 12,
    alignItems: 'center',
  },
  hangerContainer: {
    alignItems: 'center',
    zIndex: 10,
    marginBottom: 4,
  },
  hangerHook: {
    width: 8,
    height: 10,
    backgroundColor: '#C0A080',
    borderRadius: 4,
    borderTopWidth: 2,
    borderTopColor: '#D4B896',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  hangerWire: {
    width: 2,
    height: 16,
    backgroundColor: '#C0A080',
    marginTop: -2,
  },
  hangerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    marginTop: -2,
  },
  hangerLeft: {
    width: 55,
    height: 4,
    backgroundColor: '#D4B896',
    borderRadius: 2,
    transform: [{ rotate: '-25deg' }],
    marginRight: -8,
    borderTopWidth: 1,
    borderTopColor: '#E8D4B8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
  },
  hangerRight: {
    width: 55,
    height: 4,
    backgroundColor: '#D4B896',
    borderRadius: 2,
    transform: [{ rotate: '25deg' }],
    marginLeft: -8,
    borderTopWidth: 1,
    borderTopColor: '#E8D4B8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
  },
  clothingItem: {
    width: '92%',
    borderRadius: 28,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.08)',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  clothNeckline: {
    position: 'absolute' as const,
    top: 0,
    left: '50%' as any,
    marginLeft: -25,
    width: 50,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  clothShine: {
    position: 'absolute' as const,
    top: 0,
    right: 20,
    width: 80,
    height: '100%' as any,
    backgroundColor: 'rgba(255,255,255,0.15)',
    transform: [{ skewX: '-15deg' }],
  },
  clothFabricTexture: {
    position: 'absolute' as const,
    top: 8,
    left: 12,
    zIndex: 5,
  },
  clothTag: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tagHole: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.3)',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '800' as const,
    color: '#333',
    letterSpacing: 0.5,
  },
  clothBody: {
    position: 'relative' as const,
  },
  clothCenterSeam: {
    position: 'absolute' as const,
    top: 0,
    bottom: 0,
    left: '50%' as any,
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  ironedFoldLeft: {
    position: 'absolute' as const,
    top: 0,
    bottom: 0,
    left: '30%' as any,
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  ironedFoldRight: {
    position: 'absolute' as const,
    top: 0,
    bottom: 0,
    right: '30%' as any,
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
    marginRight: 12,
  },
  orderNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  clothEmoji: {
    fontSize: 20,
  },
  orderNumber: {
    fontSize: 17,
    fontWeight: "900" as const,
    color: '#2C1810',
    letterSpacing: 0.5,
  },
  customerName: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
    fontWeight: "700" as const,
    letterSpacing: 0.2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginBottom: 10,
    marginTop: 4,
  },
  detailsContainer: {
    gap: 10,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailContent: {
    flex: 0,
  },
  detailLabel: {
    fontSize: 10,
    color: 'rgba(0,0,0,0.45)',
    fontWeight: "800" as const,
    marginBottom: 4,
    textTransform: "uppercase" as const,
    letterSpacing: 1.2,
  },
  detailValue: {
    fontSize: 14,
    color: '#2C1810',
    fontWeight: "800" as const,
    letterSpacing: 0.3,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 10,
    color: 'rgba(0,0,0,0.45)',
    fontWeight: "800" as const,
    marginBottom: 6,
    textTransform: "uppercase" as const,
    letterSpacing: 1.2,
  },
  priceValue: {
    fontSize: 19,
    fontWeight: "900" as const,
    color: '#2C1810',
    letterSpacing: -0.2,
  },
  viewDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: `${Colors.light.tint}15`,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: `${Colors.light.tint}30`,
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  viewDetailsText: {
    fontSize: 14,
    color: Colors.light.tint,
    fontWeight: "900" as const,
    letterSpacing: 0.5,
  },
  etaContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: `${Colors.light.accent}20`,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    marginTop: 12,
  },
  etaText: {
    fontSize: 13,
    color: Colors.light.accent,
    fontWeight: "800" as const,
  },
  sosBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3,
  },
  sosBadgeText: {
    fontSize: 8,
    fontWeight: '900' as const,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
