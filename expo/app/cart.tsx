import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import Colors from "@/constants/colors";
import { useCart } from "@/contexts/CartContext";
import { useWallet } from "@/contexts/WalletContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingCart, 
  Wallet, 
  Map, 
  Zap, 
  CreditCard, 
  Check, 
  Heart, 
  Tag, 
  X,
  Sparkles,
  Gift
} from "lucide-react-native";
import { MapAddressPickerModal, MapPickedAddress } from "@/components/MapAddressPickerModal";
import { useState, useMemo, useEffect } from "react";

export default function CartScreen() {
  const router = useRouter();
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    totalItems, 
    premiumServices, 
    togglePremiumService, 
    premiumServicesTotal,
    isExpressDelivery,
    setIsExpressDelivery,
    isSubscriptionUsed,
    setIsSubscriptionUsed,
    deliveryAddress: contextDeliveryAddress,
  } = useCart();
  const { format } = useCurrency();
  const { balance, deductPayment } = useWallet();
  const { subscription, deductPieces } = useSubscription();
  
  const [deliveryAddress, setDeliveryAddress] = useState(contextDeliveryAddress || "");
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [specialNotes, setSpecialNotes] = useState("");
  
  const [tipAmount, setTipAmount] = useState(0);
  const [showTipSelector, setShowTipSelector] = useState(false);
  const [customTip, setCustomTip] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);

  const serviceItems = useMemo(() => items.filter(item => item.type === 'service'), [items]);
  const productItems = useMemo(() => items.filter(item => item.type === 'product'), [items]);
  const hasServiceItems = serviceItems.length > 0;
  const hasProductItems = productItems.length > 0;
  const serviceItemsTotal = useMemo(() => serviceItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [serviceItems]);
  const productItemsTotal = useMemo(() => productItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [productItems]);
  const serviceItemsCount = useMemo(() => serviceItems.reduce((sum, item) => sum + item.quantity, 0), [serviceItems]);

  useEffect(() => {
    if (contextDeliveryAddress && contextDeliveryAddress !== deliveryAddress) {
      setDeliveryAddress(contextDeliveryAddress);
    }
  }, [contextDeliveryAddress, deliveryAddress]);

  const deliveryFee = isExpressDelivery ? 50 : 30;

  const isSubscriptionEligible = useMemo(() => {
    return (
      subscription?.isActive && 
      subscription.remainingPieces >= serviceItemsCount && 
      subscription.remainingPickupsThisWeek > 0 &&
      hasServiceItems
    );
  }, [subscription, serviceItemsCount, hasServiceItems]);

  const shouldDeductFromSubscription = isSubscriptionUsed && isSubscriptionEligible;
  
  const effectiveServicePrice = shouldDeductFromSubscription ? 0 : serviceItemsTotal;
  const effectiveDeliveryFee = shouldDeductFromSubscription && !hasProductItems ? 0 : deliveryFee;
  const effectivePremiumServices = hasServiceItems ? premiumServicesTotal : 0;
  const effectiveTotal = effectiveServicePrice + productItemsTotal + effectiveDeliveryFee + tipAmount + effectivePremiumServices - (appliedPromo?.discount || 0);
  const finalTotal = Math.max(0, effectiveTotal);

  const handleApplyPromo = () => {
    if (promoCode.trim().toLowerCase() === "save10") {
      setAppliedPromo({ code: "SAVE10", discount: 10 });
      setPromoCode("");
      Alert.alert("Success", "Promo code applied!");
    } else {
      Alert.alert("Invalid Code", "This promo code is not valid.");
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      Alert.alert("Cart Empty", "Please add items to your cart before checkout.");
      return;
    }
    
    if (!deliveryAddress.trim()) {
      Alert.alert("Address Required", "Please enter your delivery address.");
      return;
    }

    if (isSubscriptionUsed && hasServiceItems) {
        if (!subscription?.isActive) {
            Alert.alert("Subscription Inactive", "You don't have an active subscription.");
            setIsSubscriptionUsed(false);
            return;
        }
        if (subscription.remainingPieces < serviceItemsCount) {
            Alert.alert("Insufficient Balance", `You only have ${subscription.remainingPieces} pieces left in your subscription.`);
            return;
        }
        if (subscription.remainingPickupsThisWeek <= 0) {
             Alert.alert("No Pickups Left", "You have used all your pickups for this week.");
             return;
        }
    }
    
    if (!(isSubscriptionUsed && hasServiceItems && !hasProductItems) && balance < finalTotal) {
      Alert.alert(
        "Insufficient Balance",
        `Your wallet balance is ${format(balance)}, but the total is ${format(finalTotal)}.\n\nPlease add money to your wallet first.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Add Money",
            onPress: () => router.push("/add-money"),
          },
        ]
      );
      return;
    }

    const message = shouldDeductFromSubscription && !hasProductItems
      ? `Deduct ${serviceItemsCount} ironing items from subscription?\n\nTip: ${format(tipAmount)}`
      : `Total: ${format(finalTotal)}\n\nIroning: ${format(serviceItemsTotal)}\nProducts: ${format(productItemsTotal)}\nDelivery: ${format(deliveryFee)}\nTip: ${format(tipAmount)}`;

    Alert.alert(
      "Confirm Order",
      message,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: shouldDeductFromSubscription && !hasProductItems ? "Place Order" : "Pay Now",
          onPress: async () => {
            try {
              console.log('[Cart] 💰 Processing order:', {
                useSubscription: shouldDeductFromSubscription,
                serviceItems: serviceItemsCount,
                productItems: productItems.length,
                total: finalTotal,
                deliveryAddress
              });

              if (shouldDeductFromSubscription && hasServiceItems) {
                 const success = deductPieces(serviceItemsCount);
                 if (!success) {
                     throw new Error("Failed to deduct from subscription");
                 }
              }
              
              if (finalTotal > 0) {
                 const description = hasServiceItems && hasProductItems 
                   ? `Ironing & Store Purchase - ${totalItems} items`
                   : hasServiceItems 
                     ? `Ironing Order - ${serviceItemsCount} items`
                     : `Store Purchase - ${productItems.length} items`;
                 await deductPayment(finalTotal, description);
              }
              
              Alert.alert(
                "Order Placed!", 
                `Your order has been placed successfully!\n\nDelivery to:\n${deliveryAddress}`,
                [
                  {
                    text: "OK",
                    onPress: () => {
                      clearCart();
                      router.back();
                    },
                  },
                ]
              );
            } catch (error) {
              console.error("Payment error:", error);
              Alert.alert(
                "Order Failed",
                error instanceof Error ? error.message : "An error occurred during processing"
              );
            }
          },
        },
      ]
    );
  };

  const handleRemoveItem = (id: string, name: string) => {
    Alert.alert(
      "Remove Item",
      `Remove ${name} from cart?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: () => removeFromCart(id) },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Remove all items from cart?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear All", style: "destructive", onPress: clearCart },
      ]
    );
  };

  const handleMapPicked = (picked: MapPickedAddress) => {
    setDeliveryAddress(picked.formattedAddress);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Shopping Cart",
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
          headerTintColor: Colors.light.tint,
          headerRight: () =>
            items.length > 0 ? (
              <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
            ) : null,
        }}
      />

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <ShoppingCart size={80} color={Colors.light.border} strokeWidth={1.5} />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add items from the store to get started</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => router.push("/store")}
            activeOpacity={0.8}
          >
            <Text style={styles.shopButtonText}>Go to Store</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} bounces={true}>
          <View style={styles.content}>
            
            <View style={styles.itemsHeader}>
              <Text style={styles.itemsCount}>
                {totalItems} {totalItems === 1 ? "Item" : "Items"}
              </Text>
            </View>

            {items.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.itemImage}
                  resizeMode="cover"
                />
                
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemPrice}>{format(item.price)}</Text>
                  
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, item.quantity - 1)}
                      activeOpacity={0.7}
                    >
                      <Minus size={18} color={Colors.light.tint} strokeWidth={3} />
                    </TouchableOpacity>
                    
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                      activeOpacity={0.7}
                    >
                      <Plus size={18} color={Colors.light.tint} strokeWidth={3} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.itemRight}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleRemoveItem(item.id, item.name)}
                    activeOpacity={0.7}
                  >
                    <Trash2 size={20} color="#EF4444" strokeWidth={2.5} />
                  </TouchableOpacity>
                  
                  <Text style={styles.itemTotal}>
                    {format(item.price * item.quantity)}
                  </Text>
                </View>
              </View>
            ))}
            
            {/* Express Delivery Option */}
            <TouchableOpacity 
              style={[
                styles.expressToggle, 
                isExpressDelivery && styles.expressToggleActive
              ]}
              onPress={() => setIsExpressDelivery(!isExpressDelivery)}
              activeOpacity={0.8}
            >
              <View style={styles.expressToggleLeft}>
                <View style={[styles.expressIcon, isExpressDelivery && styles.expressIconActive]}>
                  <Zap size={20} color={isExpressDelivery ? "#FFF" : "#EF4444"} fill={isExpressDelivery ? "#FFF" : "none"} />
                </View>
                <View>
                  <Text style={[styles.expressText, isExpressDelivery && styles.expressTextActive]}>Express Delivery</Text>
                  <Text style={styles.expressSubtext}>Get it within 2 hours (+{format(20)})</Text>
                </View>
              </View>
              <View style={[styles.checkbox, isExpressDelivery && styles.checkboxActive]}>
                {isExpressDelivery && <Check size={16} color="#FFF" strokeWidth={3} />}
              </View>
            </TouchableOpacity>

            <View style={{ height: 16 }} />

            {/* Premium Services - Only for ironing items */}
            {hasServiceItems && premiumServices.map((service) => (
              <View key={service.id} style={{ marginBottom: 16 }}>
                <TouchableOpacity 
                  style={[
                    styles.expressToggle, 
                    service.enabled && { backgroundColor: `${Colors.light.tint}10`, borderColor: Colors.light.tint }
                  ]}
                  onPress={() => togglePremiumService(service.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.expressToggleLeft}>
                    <View style={[styles.expressIcon, service.enabled && { backgroundColor: Colors.light.tint }]}>
                      {service.id === 'perfume' ? (
                        <Sparkles size={20} color={service.enabled ? "#FFF" : Colors.light.tint} />
                      ) : (
                        <Gift size={20} color={service.enabled ? "#FFF" : Colors.light.tint} />
                      )}
                    </View>
                    <View>
                      <Text style={[styles.expressText, service.enabled && { color: Colors.light.tint }]}>{service.name}</Text>
                      <Text style={styles.expressSubtext}>+{format(service.price)}</Text>
                    </View>
                  </View>
                  <View style={[styles.checkbox, service.enabled && { backgroundColor: Colors.light.tint, borderColor: Colors.light.tint }]}>
                    {service.enabled && <Check size={16} color="#FFF" strokeWidth={3} />}
                  </View>
                </TouchableOpacity>
              </View>
            ))}

            {/* Subscription Option - Only for ironing items */}
            {subscription?.isActive && hasServiceItems && (
              <>
                <TouchableOpacity 
                  style={[
                    styles.subscriptionToggle, 
                    isSubscriptionUsed && styles.subscriptionToggleActive,
                    (!isSubscriptionEligible) && styles.subscriptionToggleDisabled
                  ]}
                  onPress={() => {
                    if (isSubscriptionEligible) {
                      setIsSubscriptionUsed(!isSubscriptionUsed);
                    } else {
                      Alert.alert("Unavailable", "You don't have enough pieces or pickups in your subscription.");
                    }
                  }}
                  activeOpacity={0.8}
                  disabled={!isSubscriptionEligible && !isSubscriptionUsed}
                >
                  <View style={styles.subscriptionToggleLeft}>
                    <View style={[styles.subscriptionIcon, isSubscriptionUsed && styles.subscriptionIconActive]}>
                      <CreditCard size={20} color={isSubscriptionUsed ? "#FFF" : Colors.light.tint} />
                    </View>
                    <View>
                      <Text style={[styles.subscriptionText, isSubscriptionUsed && styles.subscriptionTextActive]}>Use Subscription Plan</Text>
                      <Text style={styles.subscriptionSubtext}>
                        {subscription.remainingPieces} pieces • {subscription.remainingPickupsThisWeek} pickups left
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.checkbox, isSubscriptionUsed && styles.checkboxActiveSubscription]}>
                     {isSubscriptionUsed && <Check size={16} color="#FFF" strokeWidth={3} />}
                  </View>
                </TouchableOpacity>
                <View style={{ height: 16 }} />
              </>
            )}

            <View style={styles.deliverySection}>
              <Text style={styles.deliverySectionTitle}>Delivery Details</Text>
              <View style={styles.addressRow}>
                <TextInput
                  style={[styles.addressInput, { flex: 1, marginBottom: 0 }]}
                  placeholder="Enter your delivery address"
                  placeholderTextColor={Colors.light.textTertiary}
                  value={deliveryAddress}
                  onChangeText={setDeliveryAddress}
                  multiline
                  numberOfLines={2}
                  textAlignVertical="top"
                />
                <TouchableOpacity
                  style={styles.mapButton}
                  onPress={() => setShowMapPicker(true)}
                  activeOpacity={0.7}
                >
                  <Map size={20} color={Colors.light.tint} strokeWidth={2.5} />
                  <Text style={styles.mapButtonText}>Map</Text>
                </TouchableOpacity>
              </View>
              
              <TextInput
                style={styles.notesInput}
                placeholder="Special notes (optional)"
                placeholderTextColor={Colors.light.textTertiary}
                value={specialNotes}
                onChangeText={setSpecialNotes}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>
            
            <View style={{ height: 20 }} />

            {/* Promo Code Section */}
            <View style={styles.promoCodeSection}>
              <Text style={styles.promoCodeLabel}>Promo Code</Text>
              
              {appliedPromo ? (
                <View style={styles.promoAppliedBanner}>
                  <View style={styles.promoAppliedLeft}>
                    <View style={styles.promoIconContainer}>
                      <Tag size={18} color="#047857" fill="#047857" />
                    </View>
                    <View>
                      <Text style={styles.promoAppliedTitle}>Code Applied: {appliedPromo.code}</Text>
                      <Text style={styles.promoAppliedSubtitle}>You saved {format(appliedPromo.discount)}</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.promoRemoveButton}
                    onPress={() => setAppliedPromo(null)}
                  >
                    <X size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.promoCodeInputRow}>
                  <TextInput
                    style={styles.promoCodeInput}
                    placeholder="Enter code"
                    placeholderTextColor={Colors.light.textTertiary}
                    value={promoCode}
                    onChangeText={setPromoCode}
                    autoCapitalize="characters"
                  />
                  <TouchableOpacity 
                    style={[styles.promoApplyButton, !promoCode && styles.promoApplyButtonDisabled]}
                    onPress={handleApplyPromo}
                    disabled={!promoCode}
                  >
                    <Text style={styles.promoApplyButtonText}>Apply</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={{ height: 20 }} />

            {/* Tip Section */}
            <View>
              <TouchableOpacity 
                style={[styles.tipButton, showTipSelector && { borderColor: "#EC4899", backgroundColor: "#FDF2F8" }]}
                onPress={() => setShowTipSelector(!showTipSelector)}
                activeOpacity={0.8}
              >
                <View style={styles.tipButtonLeft}>
                  <View style={[styles.tipIcon, (tipAmount > 0 || showTipSelector) && styles.tipIconActive]}>
                    <Heart size={20} color={(tipAmount > 0 || showTipSelector) ? "#FFF" : "#EC4899"} fill={(tipAmount > 0 || showTipSelector) ? "#FFF" : "none"} />
                  </View>
                  <View>
                    <Text style={[styles.tipText, (tipAmount > 0 || showTipSelector) && styles.tipTextActive]}>Add a Tip</Text>
                    <Text style={styles.tipSubtext}>
                      {tipAmount > 0 ? `You added ${format(tipAmount)}` : "Show your appreciation"}
                    </Text>
                  </View>
                </View>
                <View style={[styles.checkbox, (tipAmount > 0) && styles.checkboxActiveTip]}>
                   {tipAmount > 0 && <Check size={16} color="#FFF" strokeWidth={3} />}
                </View>
              </TouchableOpacity>

              {showTipSelector && (
                <View style={[styles.tipSelectorContainer, { marginTop: 12 }]}>
                   <Text style={styles.tipSelectorTitle}>Select Tip Amount</Text>
                   <View style={styles.tipOptionsRow}>
                      {[10, 20, 50].map(amount => (
                        <TouchableOpacity 
                          key={amount}
                          style={[styles.tipOption, tipAmount === amount && styles.tipOptionActive]}
                          onPress={() => {
                             setTipAmount(amount);
                             setCustomTip("");
                          }}
                        >
                          <Text style={[styles.tipOptionText, tipAmount === amount && styles.tipOptionTextActive]}>
                            {format(amount)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                   </View>
                   
                   <View style={styles.customTipContainer}>
                     <TextInput
                       style={styles.customTipInput}
                       placeholder="Custom amount"
                       placeholderTextColor={Colors.light.textTertiary}
                       keyboardType="numeric"
                       value={customTip}
                       onChangeText={(text) => {
                          setCustomTip(text);
                          const val = parseFloat(text);
                          if (!isNaN(val)) setTipAmount(val);
                          else setTipAmount(0);
                       }}
                     />
                     {tipAmount > 0 && (
                       <TouchableOpacity 
                         style={styles.clearTipButton}
                         onPress={() => {
                           setTipAmount(0);
                           setCustomTip("");
                         }}
                       >
                         <X size={18} color="#EF4444" />
                       </TouchableOpacity>
                     )}
                   </View>
                   <Text style={styles.tipNote}>100% of the tip goes to your driver</Text>
                </View>
              )}
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.totalContainer}>
                {hasServiceItems && (
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Ironing ({serviceItemsCount} items)</Text>
                    <Text style={[styles.totalValue, shouldDeductFromSubscription && { textDecorationLine: 'line-through', color: Colors.light.textTertiary }]}>
                      {format(serviceItemsTotal)}
                    </Text>
                  </View>
                )}
                
                {hasProductItems && (
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Products ({productItems.length} items)</Text>
                    <Text style={styles.totalValue}>
                      {format(productItemsTotal)}
                    </Text>
                  </View>
                )}
                
                {shouldDeductFromSubscription && hasServiceItems && (
                   <View style={styles.totalRow}>
                     <Text style={[styles.totalLabel, { color: Colors.light.tint }]}>Subscription Cover</Text>
                     <Text style={[styles.totalValue, { color: Colors.light.tint }]}>-{format(serviceItemsTotal)}</Text>
                   </View>
                )}
                
                {effectivePremiumServices > 0 && (
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Premium Services</Text>
                    <Text style={[styles.totalValue, { color: Colors.light.tint }]}>+{format(effectivePremiumServices)}</Text>
                  </View>
                )}

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Delivery Fee</Text>
                  <Text style={[styles.totalValue, (shouldDeductFromSubscription && !hasProductItems) ? { textDecorationLine: 'line-through', color: Colors.light.textTertiary } : { color: Colors.light.tint }]}>
                    {(shouldDeductFromSubscription && !hasProductItems) ? format(deliveryFee) : `+${format(deliveryFee)}`}
                  </Text>
                </View>

                {shouldDeductFromSubscription && !hasProductItems && (
                   <View style={styles.totalRow}>
                     <Text style={[styles.totalLabel, { color: Colors.light.tint }]}>Subscription Delivery</Text>
                     <Text style={[styles.totalValue, { color: Colors.light.tint }]}>Free</Text>
                   </View>
                )}

                {tipAmount > 0 && (
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Driver Tip</Text>
                    <Text style={[styles.totalValue, { color: "#EC4899" }]}>+{format(tipAmount)}</Text>
                  </View>
                )}

                {appliedPromo && (
                  <View style={styles.totalRow}>
                    <Text style={[styles.totalLabel, { color: "#059669" }]}>Promo ({appliedPromo.code})</Text>
                    <Text style={[styles.totalValue, { color: "#059669" }]}>-{format(appliedPromo.discount)}</Text>
                  </View>
                )}
                
                <View style={styles.divider} />
                
                <View style={styles.totalRow}>
                  <Text style={styles.grandTotalLabel}>Total</Text>
                  <Text style={styles.grandTotalValue}>
                    {format(finalTotal)}
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={handleCheckout}
                activeOpacity={0.9}
              >
                <Wallet size={24} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.checkoutButtonText}>
                   {shouldDeductFromSubscription && !hasProductItems && finalTotal === 0 
                     ? "Place Order (Free)" 
                     : `Pay ${format(finalTotal)}`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
      <MapAddressPickerModal
        visible={showMapPicker}
        onClose={() => setShowMapPicker(false)}
        onPick={handleMapPicked}
        accentColor={Colors.light.tint}
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
  deliverySection: {
    marginTop: 24,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 20,
    padding: 18,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  deliverySectionTitle: {
    fontSize: 17,
    fontWeight: "800" as const,
    color: Colors.light.text,
    marginBottom: 14,
  },
  addressRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
    alignItems: "flex-start",
  },
  mapButton: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: `${Colors.light.tint}15`,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: `${Colors.light.tint}30`,
  },
  mapButtonText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.light.tint,
    marginTop: 4,
  },
  addressInput: {
    backgroundColor: Colors.light.background,
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
    borderWidth: 2,
    borderColor: Colors.light.border,
    minHeight: 60,
    marginBottom: 12,
  },
  notesInput: {
    backgroundColor: Colors.light.background,
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
    borderWidth: 2,
    borderColor: Colors.light.border,
    minHeight: 60,
  },
  summaryCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 24,
    marginTop: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: Colors.light.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  clearButton: {
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearButtonText: {
    color: "#EF4444",
    fontSize: 15,
    fontWeight: "700" as const,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: `${Colors.light.border}40`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: "900" as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  shopButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  shopButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800" as const,
  },
  itemsHeader: {
    marginBottom: 16,
  },
  itemsCount: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: Colors.light.text,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  itemPrice: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontWeight: "600" as const,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${Colors.light.tint}20`,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.light.tint,
  },
  quantityText: {
    fontSize: 15,
    fontWeight: "800" as const,
    color: Colors.light.text,
    minWidth: 24,
    textAlign: "center",
  },
  itemRight: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginLeft: 8,
  },
  deleteButton: {
    padding: 6,
  },
  itemTotal: {
    fontSize: 17,
    fontWeight: "900" as const,
    color: Colors.light.tint,
  },
  totalContainer: {
    marginBottom: 20,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    fontWeight: "600" as const,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  divider: {
    height: 1.5,
    backgroundColor: Colors.light.border,
    marginVertical: 16,
  },
  grandTotalLabel: {
    fontSize: 20,
    fontWeight: "900" as const,
    color: Colors.light.text,
  },
  grandTotalValue: {
    fontSize: 24,
    fontWeight: "900" as const,
    color: Colors.light.tint,
  },
  expressToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.light.background,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  expressToggleActive: {
    backgroundColor: "#FEE2E2",
    borderColor: "#EF4444",
  },
  expressToggleDisabled: {
    opacity: 0.5,
  },
  expressToggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  expressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  expressIconActive: {
    backgroundColor: "#EF4444",
  },
  expressText: {
    fontSize: 15,
    fontWeight: "800" as const,
    color: Colors.light.text,
  },
  expressTextActive: {
    color: "#EF4444",
  },
  expressSubtext: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.background,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: "#EF4444",
    borderColor: "#EF4444",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900" as const,
  },
  subscriptionToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.light.background,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  subscriptionToggleActive: {
    backgroundColor: `${Colors.light.tint}15`,
    borderColor: Colors.light.tint,
  },
  subscriptionToggleDisabled: {
    opacity: 0.6,
  },
  subscriptionToggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  subscriptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.light.tint}20`,
    justifyContent: "center",
    alignItems: "center",
  },
  subscriptionIconActive: {
    backgroundColor: Colors.light.tint,
  },
  subscriptionText: {
    fontSize: 15,
    fontWeight: "800" as const,
    color: Colors.light.text,
  },
  subscriptionTextActive: {
    color: Colors.light.tint,
  },
  subscriptionSubtext: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
    marginTop: 3,
    lineHeight: 16,
  },
  checkboxActiveSubscription: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  checkoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: Colors.light.tint,
    paddingVertical: 18,
    borderRadius: 20,
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  checkoutButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900" as const,
    letterSpacing: 0.5,
  },
  subscriptionInfoBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${Colors.light.tint}15`,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: `${Colors.light.tint}40`,
  },
  subscriptionInfoText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.light.tint,
    flex: 1,
  },
  promoCodeSection: {
    backgroundColor: `${Colors.light.tint}10`,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: `${Colors.light.tint}30`,
  },
  promoCodeLabel: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 10,
  },
  promoCodeInputRow: {
    flexDirection: "row",
    gap: 10,
  },
  promoCodeInput: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 14,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: "700" as const,
    borderWidth: 2,
    borderColor: Colors.light.border,
    color: Colors.light.text,
  },
  promoApplyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 12,
  },
  promoApplyButtonDisabled: {
    opacity: 0.6,
  },
  promoApplyButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "800" as const,
  },
  promoAppliedBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#D1FAE5",
    padding: 14,
    borderRadius: 14,
    marginTop: 12,
    marginBottom: 4,
    borderWidth: 2,
    borderColor: "#10B981",
  },
  promoAppliedLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  promoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  promoAppliedTitle: {
    fontSize: 14,
    fontWeight: "800" as const,
    color: "#065F46",
  },
  promoAppliedSubtitle: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#047857",
    marginTop: 2,
  },
  promoRemoveButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  tipButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FDF2F8",
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#EC4899",
  },
  tipButtonLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#EC4899",
  },
  tipIconActive: {
    backgroundColor: "#EC4899",
  },
  tipText: {
    fontSize: 15,
    fontWeight: "800" as const,
    color: Colors.light.text,
  },
  tipTextActive: {
    color: "#EC4899",
  },
  tipSubtext: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
    marginTop: 3,
  },
  checkboxActiveTip: {
    backgroundColor: "#EC4899",
    borderColor: "#EC4899",
  },
  tipSelectorContainer: {
    backgroundColor: "#FFF",
    padding: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#EC4899",
  },
  tipSelectorTitle: {
    fontSize: 15,
    fontWeight: "800" as const,
    color: Colors.light.text,
    marginBottom: 14,
    textAlign: "center",
  },
  tipOptionsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  tipOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    borderWidth: 2,
    borderColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  tipOptionActive: {
    backgroundColor: "#FDF2F8",
    borderColor: "#EC4899",
  },
  tipOptionText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.light.textSecondary,
  },
  tipOptionTextActive: {
    color: "#EC4899",
    fontWeight: "900" as const,
  },
  customTipContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  customTipInput: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 12,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: "700" as const,
    borderWidth: 2,
    borderColor: "#F3F4F6",
    color: Colors.light.text,
  },
  clearTipButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  tipNote: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
    textAlign: "center",
  },
  specialInstructionsSection: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  instructionsHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
    marginBottom: 12,
  },
  instructionsIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${Colors.light.tint}20`,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  instructionsLabel: {
    fontSize: 15,
    fontWeight: "800" as const,
    color: Colors.light.text,
    letterSpacing: 0.2,
  },
  instructionsInput: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    minHeight: 90,
    maxHeight: 140,
  },
  characterCount: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
    marginTop: 8,
    textAlign: "right" as const,
  },
});
