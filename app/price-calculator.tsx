import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useState, useMemo, useEffect } from "react";
import { GarmentCounter } from "@/components/GarmentCounter";
import Colors from "@/constants/colors";
import { Calculator, Sparkles, Zap, MapPin, Navigation, Plus, Shirt, Award, Package, CheckCircle } from "lucide-react-native";
import { GarmentSelectorModal } from "@/components/GarmentSelectorModal";
import { GarmentType } from "@/constants/garmentTypes";
import { useCart } from "@/contexts/CartContext";
import { useOrders } from "@/contexts/OrderContext";
import { useAddress } from "@/contexts/AddressContext";
import { SubscriptionType } from "@/types/order";
import { useSubscription } from "@/contexts/SubscriptionContext";



const subscriptionDiscounts: Record<SubscriptionType, number> = {
  none: 0,
  week: 5,
  month: 10,
  "3months": 15,
  "6months": 20,
  year: 25,
  student: 10,
  couples: 15,
  mothers: 15,
};

const deliveryZones = [
  { name: "Zone 1 - Central Cairo", areas: ["Downtown", "Zamalek", "Garden City", "Dokki"], cost: 30 },
  { name: "Zone 2 - Greater Cairo", areas: ["Maadi", "Heliopolis", "Nasr City", "Mohandessin"], cost: 50 },
  { name: "Zone 3 - New Cairo & 6th October", areas: ["New Cairo", "5th Settlement", "6th October", "Sheikh Zayed"], cost: 70 },
  { name: "Zone 4 - Outer Areas", areas: ["10th of Ramadan", "Shorouk", "Obour", "Other Areas"], cost: 100 },
];

function calculateDeliveryCost(address: string): number {
  if (!address.trim()) return 0;
  
  const lowerAddress = address.toLowerCase();
  
  for (const zone of deliveryZones) {
    for (const area of zone.areas) {
      if (lowerAddress.includes(area.toLowerCase())) {
        return zone.cost;
      }
    }
  }
  
  return deliveryZones[deliveryZones.length - 1].cost;
}

export default function PriceCalculatorScreen() {
  const router = useRouter();
  const { addToCart, setPremiumServicesFromSelection, setIsExpressDelivery: setCartExpressDelivery, setDeliveryAddress: setCartDeliveryAddress } = useCart();
  const { orders } = useOrders();
  const { subscription, deductPieces } = useSubscription();
  const { address: savedAddress, getFullAddress } = useAddress();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [isExpress, setIsExpress] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [showGarmentSelector, setShowGarmentSelector] = useState(false);
  const [selectedGarments, setSelectedGarments] = useState<GarmentType[]>([]);
  const [useSubscriptionPieces, setUseSubscriptionPieces] = useState(false);
  const [addPerfume] = useState<boolean>(false);
  const [addVIP] = useState<boolean>(false);

  useEffect(() => {
    const fullAddress = getFullAddress();
    if (fullAddress && fullAddress.trim().length > 0) {
      console.log("[PriceCalculator] Loading saved address:", fullAddress);
      setDeliveryAddress(fullAddress);
    }
  }, [savedAddress, getFullAddress]);

  const currentSubscription: SubscriptionType = useMemo(() => {
    const sortedOrders = [...orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const activeOrder = sortedOrders.find(order => order.subscription && order.subscription !== "none");
    return activeOrder?.subscription || "none";
  }, [orders]);

  const handleGarmentSelect = (garment: GarmentType) => {
    if (!selectedGarments.find(g => g.id === garment.id)) {
      setSelectedGarments([...selectedGarments, garment]);
      setCounts((prev) => ({ ...prev, [garment.id]: 1 }));
    }
    setShowGarmentSelector(false);
  };

  const handleIncrement = (id: string) => {
    setCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleDecrement = (id: string) => {
    setCounts((prev) => {
      const newCount = Math.max(0, (prev[id] || 0) - 1);
      if (newCount === 0) {
        const { [id]: _, ...rest } = prev;
        setSelectedGarments(selectedGarments.filter(g => g.id !== id));
        return rest;
      }
      return { ...prev, [id]: newCount };
    });
  };

  const subtotal = selectedGarments.reduce((sum, garment) => {
    const count = counts[garment.id] || 0;
    return sum + garment.price * count;
  }, 0);

  const EXPRESS_MINIMUM = 100;
  const canUseExpress = subtotal >= EXPRESS_MINIMUM;

  const expressCharge = isExpress ? subtotal * 0.3 : 0;
  const perfumeCharge = addPerfume ? 30 : 0;
  const vipCharge = addVIP ? 50 : 0;
  const discount = subtotal * (subscriptionDiscounts[currentSubscription] / 100);
  const deliveryCost = calculateDeliveryCost(deliveryAddress);
  const actualDeliveryCost = isExpress ? 0 : deliveryCost;
  const total = subtotal + expressCharge + perfumeCharge + vipCharge + actualDeliveryCost - discount;
  const totalItems = Object.values(counts).reduce((sum, count) => sum + count, 0);

  console.log("[PriceCalculator] ===== CALCULATION DEBUG =====");
  console.log("[PriceCalculator] isExpress:", isExpress);
  console.log("[PriceCalculator] subtotal:", subtotal);
  console.log("[PriceCalculator] expressCharge:", expressCharge);
  console.log("[PriceCalculator] deliveryCost:", deliveryCost);
  console.log("[PriceCalculator] actualDeliveryCost:", actualDeliveryCost);
  console.log("[PriceCalculator] total:", total);
  console.log("[PriceCalculator] deliveryAddress:", deliveryAddress);
  console.log("[PriceCalculator] Should show delivery row:", actualDeliveryCost > 0 && deliveryAddress.trim());
  console.log("[PriceCalculator] =========================");

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Order & Cost Calculator",
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
          headerTintColor: Colors.light.text,
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {subscription && subscription.isActive && subscription.planType !== "none" && (
            <View style={styles.subscriptionInfoBanner}>
              <Package size={16} color={Colors.light.tint} strokeWidth={2.5} />
              <Text style={styles.subscriptionInfoText}>
                {subscription.planTitle} • {subscription.remainingPieces} pieces remaining
              </Text>
            </View>
          )}
          
          <View style={styles.headerSection}>
            <View style={styles.iconContainer}>
              <Calculator size={28} color={Colors.light.tint} strokeWidth={2} />
            </View>
            <Text style={styles.title}>Estimate Your Order Cost</Text>
            <Text style={styles.subtitle}>
              Select your garments below and see real-time pricing
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Select Garments</Text>
              <TouchableOpacity
                style={styles.addGarmentButton}
                onPress={() => setShowGarmentSelector(true)}
                activeOpacity={0.7}
              >
                <Plus size={18} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.addGarmentButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
            {selectedGarments.length === 0 ? (
              <TouchableOpacity
                style={styles.emptyGarmentsCard}
                onPress={() => setShowGarmentSelector(true)}
                activeOpacity={0.7}
              >
                <View style={styles.emptyIconContainer}>
                  <Shirt size={40} color={Colors.light.tint} strokeWidth={2} />
                </View>
                <Text style={styles.emptyGarmentsTitle}>No garments selected</Text>
                <Text style={styles.emptyGarmentsDesc}>Tap to browse and add garments</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.garmentsListContainer}>
                {selectedGarments.map((garment) => (
                  <GarmentCounter
                    key={garment.id}
                    name={garment.name}
                    count={counts[garment.id] || 0}
                    price={garment.price}
                    onIncrement={() => handleIncrement(garment.id)}
                    onDecrement={() => handleDecrement(garment.id)}
                  />
                ))}
              </View>
            )}
          </View>

          {subscription && subscription.isActive && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Use Subscription Plan</Text>
              <TouchableOpacity
                style={[styles.subscriptionOptionCard, useSubscriptionPieces && styles.subscriptionOptionCardActive]}
                onPress={() => {
                  if (totalItems > (subscription.remainingPieces || 0)) {
                    Alert.alert(
                      "Insufficient Pieces",
                      `You have ${subscription.remainingPieces} pieces remaining in your plan, but you're trying to order ${totalItems} items. Please reduce the quantity or uncheck this option.`
                    );
                    return;
                  }
                  setUseSubscriptionPieces(!useSubscriptionPieces);
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.subscriptionOptionIcon, useSubscriptionPieces && styles.subscriptionOptionIconActive]}>
                  <Package
                    size={26}
                    color={useSubscriptionPieces ? "#FFFFFF" : Colors.light.tint}
                    strokeWidth={2}
                  />
                </View>
                <View style={styles.subscriptionOptionInfo}>
                  <Text style={[styles.subscriptionOptionTitle, useSubscriptionPieces && styles.subscriptionOptionTitleActive]}>
                    Deduct from Subscription Plan
                  </Text>
                  <Text style={[styles.subscriptionOptionDesc, useSubscriptionPieces && styles.subscriptionOptionDescActive]}>
                    {useSubscriptionPieces 
                      ? `${totalItems} pieces will be deducted from your plan`
                      : `You have ${subscription.remainingPieces} pieces remaining`}
                  </Text>
                </View>
                <View style={[styles.checkboxLarge, useSubscriptionPieces && styles.checkboxLargeActive]}>
                  {useSubscriptionPieces && <CheckCircle size={28} color={"#FFFFFF"} strokeWidth={2.5} />}
                </View>
              </TouchableOpacity>
              
              {useSubscriptionPieces && (
                <View style={styles.piecesInfoCard}>
                  <View style={styles.piecesInfoRow}>
                    <Text style={styles.piecesInfoLabel}>Current Pieces:</Text>
                    <Text style={styles.piecesInfoValue}>{subscription.remainingPieces}</Text>
                  </View>
                  <View style={styles.piecesInfoRow}>
                    <Text style={styles.piecesInfoLabel}>To Deduct:</Text>
                    <Text style={styles.piecesInfoValueHighlight}>-{totalItems}</Text>
                  </View>
                  <View style={styles.piecesInfoDivider} />
                  <View style={styles.piecesInfoRow}>
                    <Text style={styles.piecesInfoLabelBold}>Remaining After Order:</Text>
                    <Text style={styles.piecesInfoValueBold}>{subscription.remainingPieces - totalItems}</Text>
                  </View>
                </View>
              )}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Express Delivery</Text>
            <TouchableOpacity
              style={[
                styles.expressCard, 
                isExpress && styles.expressCardActive,
                !canUseExpress && styles.expressCardDisabled,
              ]}
              onPress={() => {
                if (!canUseExpress) {
                  Alert.alert(
                    "Express Delivery Unavailable",
                    `Express delivery is only available for orders over EGP ${EXPRESS_MINIMUM}. Your current order is EGP ${subtotal}.`
                  );
                  return;
                }
                setIsExpress(!isExpress);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.expressIcon}>
                <Zap
                  size={24}
                  color={isExpress ? "#FFFFFF" : Colors.light.tint}
                  fill={isExpress ? "#FFFFFF" : "transparent"}
                />
              </View>
              <View style={styles.expressInfo}>
                <Text style={[styles.expressTitle, isExpress && styles.expressTitleActive]}>
                  Express Service
                </Text>
                <Text style={[styles.expressDesc, isExpress && styles.expressDescActive]}>
                  {canUseExpress 
                    ? "Delivery in 120 minutes only (+30% charge)" 
                    : `Minimum order EGP ${EXPRESS_MINIMUM} required`}
                </Text>
              </View>
              <View style={[styles.checkbox, isExpress && styles.checkboxActive]}>
                {isExpress && <View style={styles.checkmark} />}
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <Text style={styles.sectionDescription}>
              Enter your address to estimate delivery cost
            </Text>
            <View style={styles.addressInputContainer}>
              <MapPin size={20} color={Colors.light.tint} style={styles.addressIcon} />
              <TextInput
                style={styles.addressInput}
                placeholder="Enter your area or district (e.g., Maadi, Zamalek, New Cairo)"
                placeholderTextColor={Colors.light.textSecondary}
                value={deliveryAddress}
                onChangeText={setDeliveryAddress}
                multiline
                numberOfLines={2}
              />
            </View>
            {deliveryAddress.trim() && (
              <View style={styles.deliveryCostCard}>
                <Navigation size={20} color={Colors.light.tint} />
                <View style={styles.deliveryCostInfo}>
                  <Text style={styles.deliveryCostLabel}>Estimated Delivery Cost</Text>
                  <Text style={styles.deliveryCostValue}>EGP {deliveryCost.toFixed(2)}</Text>
                </View>
              </View>
            )}
            <View style={styles.zonesList}>
              <Text style={styles.zonesTitle}>Delivery Zones:</Text>
              {deliveryZones.map((zone, index) => (
                <View key={index} style={styles.zoneItem}>
                  <Text style={styles.zoneName}>{zone.name}</Text>
                  <Text style={styles.zoneCost}>EGP {zone.cost}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Subscription</Text>
            <View style={styles.subscriptionStatusCard}>
              <View style={styles.subscriptionStatusIcon}>
                {!subscription || subscription.planType === "none" || !subscription.isActive ? (
                  <Award size={28} color={Colors.light.textSecondary} strokeWidth={2} />
                ) : (
                  <Award size={28} color={Colors.light.tint} strokeWidth={2} />
                )}
              </View>
              <View style={styles.subscriptionStatusInfo}>
                {!subscription || subscription.planType === "none" || !subscription.isActive ? (
                  <>
                    <Text style={styles.subscriptionStatusTitle}>No Active Subscription</Text>
                    <Text style={styles.subscriptionStatusDesc}>Subscribe to get exclusive discounts</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.subscriptionStatusTitle}>
                      {subscription.planTitle}
                    </Text>
                    <Text style={styles.subscriptionStatusDesc}>
                      You get {subscriptionDiscounts[subscription.planType as keyof typeof subscriptionDiscounts]}% discount on all orders
                    </Text>
                  </>
                )}
              </View>
              {subscription && subscription.planType !== "none" && subscription.isActive && (
                <View style={styles.subscriptionDiscountBadge}>
                  <Sparkles size={16} color={Colors.light.warning} />
                  <Text style={styles.subscriptionDiscountText}>{subscriptionDiscounts[subscription.planType as keyof typeof subscriptionDiscounts]}%</Text>
                </View>
              )}
            </View>
            {(!subscription || subscription.planType === "none" || !subscription.isActive) && (
              <TouchableOpacity
                style={styles.subscribeButton}
                onPress={() => router.push("/(tabs)/subscribe")}
                activeOpacity={0.8}
              >
                <Text style={styles.subscribeButtonText}>View Subscription Plans</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Cost Breakdown</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal ({totalItems} items)</Text>
              <Text style={styles.summaryValue}>EGP {subtotal.toFixed(2)}</Text>
            </View>

            {isExpress && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Express Charge (30%)</Text>
                <Text style={styles.summaryValueExpress}>
                  +EGP {expressCharge.toFixed(2)}
                </Text>
              </View>
            )}

            {actualDeliveryCost > 0 && deliveryAddress.trim() && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Cost</Text>
                <Text style={styles.summaryValueDelivery}>
                  +EGP {actualDeliveryCost.toFixed(2)}
                </Text>
              </View>
            )}

            {discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Subscription Discount ({subscriptionDiscounts[currentSubscription]}%)
                </Text>
                <Text style={styles.summaryValueDiscount}>
                  -EGP {discount.toFixed(2)}
                </Text>
              </View>
            )}

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Estimated Total</Text>
              <Text style={styles.totalValue}>EGP {total.toFixed(2)}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.ctaButton, selectedGarments.length === 0 && styles.ctaButtonDisabled]}
            onPress={() => {
              if (selectedGarments.length === 0) {
                Alert.alert("No Items", "Please add garments to continue");
                return;
              }

              if (useSubscriptionPieces) {
                if (!subscription || !subscription.isActive) {
                  Alert.alert("No Active Subscription", "You need an active subscription to use this feature.");
                  return;
                }
                if (totalItems > subscription.remainingPieces) {
                  Alert.alert(
                    "Insufficient Pieces",
                    `You have ${subscription.remainingPieces} pieces remaining in your plan, but you're trying to order ${totalItems} items.`
                  );
                  return;
                }
                console.log("[PriceCalculator] Deducting", totalItems, "pieces from subscription");
                const success = deductPieces(totalItems);
                if (!success) {
                  Alert.alert("Error", "Failed to deduct pieces from your subscription. Please try again.");
                  return;
                }
              }

              console.log("[PriceCalculator] Adding garments to cart:", selectedGarments.length);
              selectedGarments.forEach((garment) => {
                const count = counts[garment.id] || 0;
                for (let i = 0; i < count; i++) {
                  addToCart({
                    id: garment.id,
                    name: garment.name,
                    price: garment.price,
                    image: garment.icon,
                    type: 'service',
                  });
                }
              });
              
              setPremiumServicesFromSelection(addPerfume, addVIP);
              setCartExpressDelivery(isExpress && canUseExpress);
              setCartDeliveryAddress(deliveryAddress);
              
              router.push("/cart");
            }}
            activeOpacity={0.8}
            disabled={selectedGarments.length === 0}
          >
            <Text style={styles.ctaButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <GarmentSelectorModal
        visible={showGarmentSelector}
        onClose={() => setShowGarmentSelector(false)}
        onSelect={handleGarmentSelect}
      />
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
    padding: 20,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 32,
    paddingTop: 8,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${Colors.light.tint}20`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  addGarmentButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addGarmentButtonText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  emptyGarmentsCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderStyle: "dashed" as const,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${Colors.light.tint}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyGarmentsTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  emptyGarmentsDesc: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: "center",
  },
  garmentsListContainer: {
    gap: 12,
  },
  expressCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.light.border,
    gap: 12,
  },
  expressCardActive: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  expressCardDisabled: {
    opacity: 0.5,
  },
  expressIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${Colors.light.tint}20`,
    justifyContent: "center",
    alignItems: "center",
  },
  expressInfo: {
    flex: 1,
  },
  expressTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  expressTitleActive: {
    color: "#FFFFFF",
  },
  expressDesc: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  expressDescActive: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
  },
  checkmark: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.light.tint,
  },
  subscriptionStatusCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.light.border,
    gap: 12,
  },
  subscriptionStatusIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${Colors.light.tint}15`,
    justifyContent: "center",
    alignItems: "center",
  },
  subscriptionStatusInfo: {
    flex: 1,
  },
  subscriptionStatusTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  subscriptionStatusDesc: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  subscriptionDiscountBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: `${Colors.light.warning}20`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  subscriptionDiscountText: {
    fontSize: 16,
    fontWeight: "800" as const,
    color: Colors.light.warning,
  },
  subscribeButton: {
    backgroundColor: Colors.light.tint,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 12,
  },
  subscribeButtonText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  summaryCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontWeight: "500" as const,
    flex: 1,
  },
  summaryValue: {
    fontSize: 15,
    color: Colors.light.text,
    fontWeight: "600" as const,
  },
  summaryValueExpress: {
    fontSize: 15,
    color: Colors.light.warning,
    fontWeight: "600" as const,
  },
  summaryValueDiscount: {
    fontSize: 15,
    color: Colors.light.success,
    fontWeight: "600" as const,
  },
  summaryValueDelivery: {
    fontSize: 15,
    color: Colors.light.tint,
    fontWeight: "600" as const,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  addressInputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.light.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  addressIcon: {
    marginTop: 4,
  },
  addressInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.light.text,
    minHeight: 44,
    textAlignVertical: "top",
  },
  deliveryCostCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${Colors.light.tint}12`,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.light.tint,
  },
  deliveryCostInfo: {
    flex: 1,
  },
  deliveryCostLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  deliveryCostValue: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.tint,
  },
  zonesList: {
    marginTop: 16,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  zonesTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  zoneItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  zoneName: {
    fontSize: 13,
    color: Colors.light.text,
    flex: 1,
  },
  zoneCost: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.tint,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: Colors.light.tint,
  },
  ctaButton: {
    backgroundColor: Colors.light.tint,
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
  },
  ctaButtonDisabled: {
    backgroundColor: Colors.light.border,
    opacity: 0.5,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  subscriptionOptionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 18,
    padding: 18,
    borderWidth: 3,
    borderColor: Colors.light.tint,
    gap: 14,
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  subscriptionOptionCardActive: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
    shadowOpacity: 0.3,
  },
  subscriptionOptionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${Colors.light.tint}20`,
    justifyContent: "center",
    alignItems: "center",
  },
  subscriptionOptionIconActive: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  subscriptionOptionInfo: {
    flex: 1,
  },
  subscriptionOptionTitle: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 6,
  },
  subscriptionOptionTitleActive: {
    color: "#FFFFFF",
  },
  subscriptionOptionDesc: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 19,
  },
  subscriptionOptionDescActive: {
    color: "rgba(255, 255, 255, 0.9)",
  },
  checkboxLarge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: Colors.light.tint,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxLargeActive: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderColor: "#FFFFFF",
  },
  piecesInfoCard: {
    backgroundColor: `${Colors.light.tint}10`,
    borderRadius: 16,
    padding: 18,
    marginTop: 14,
    borderWidth: 2,
    borderColor: `${Colors.light.tint}30`,
  },
  piecesInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  piecesInfoLabel: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    fontWeight: "500" as const,
  },
  piecesInfoLabelBold: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: "700" as const,
  },
  piecesInfoValue: {
    fontSize: 15,
    color: Colors.light.text,
    fontWeight: "600" as const,
  },
  piecesInfoValueHighlight: {
    fontSize: 15,
    color: Colors.light.warning,
    fontWeight: "700" as const,
  },
  piecesInfoValueBold: {
    fontSize: 18,
    color: Colors.light.tint,
    fontWeight: "800" as const,
  },
  piecesInfoDivider: {
    height: 1,
    backgroundColor: `${Colors.light.tint}30`,
    marginVertical: 10,
  },
  subscriptionInfoBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${Colors.light.tint}15`,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: `${Colors.light.tint}40`,
  },
  subscriptionInfoText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.tint,
    flex: 1,
  },
});
