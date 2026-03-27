import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useSubscription, SubscriptionPlanType } from "@/contexts/SubscriptionContext";
import { useWallet } from "@/contexts/WalletContext";
import {
  Wallet,
  AlertCircle,
  CreditCard,
  DollarSign,
  Banknote,
  CheckCircle2,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import React, { useState } from "react";
import InstallmentSelectionModal from "@/components/InstallmentSelectionModal";
import { InstallmentPlan } from "@/types/installment";
import { useInstallment } from "@/contexts/InstallmentContext";
import { usePromoCodes } from "@/contexts/PromoCodeContext";
import { useCurrency } from "@/contexts/CurrencyContext";



const timeSlots: { id: string; label: string; }[] = [
  { id: "morning-early", label: "Early Morning (8-10 AM)" },
  { id: "morning-late", label: "Late Morning (10-12 PM)" },
  { id: "afternoon", label: "Afternoon (12-3 PM)" },
  { id: "evening", label: "Evening (3-6 PM)" },
  { id: "night", label: "Night (6-9 PM)" },
];



const subscriptionTitles: Record<string, string> = {
  weekly: "Weekly Plan",
  monthly: "1 Month Plan",
  "3months": "3 Months Plan",
  "6months": "6 Months Plan",
  yearly: "1 Year Plan",
  student: "Student Package",
  couples: "Couples Package",
  mothers: "Mothers Package",
};

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const { plan, days, time, promo } = useLocalSearchParams<{ 
    plan: string; 
    days?: string; 
    time?: string;
    promo?: string;
  }>();
  const { activateSubscription } = useSubscription();
  const { balance, deductPayment } = useWallet();
  const { applyForInstallment } = useInstallment();
  const { applyPromoCode } = usePromoCodes();
  const { format } = useCurrency();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showInstallmentModal, setShowInstallmentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"wallet" | "installment" | null>(null);
  const [appliedPromoCode, setAppliedPromoCode] = useState<{ code: string; type: 'percentage' | 'free_order'; discountAmount: number; discountPercentage?: number } | null>(null);



  const handleSelectInstallmentPlan = async (installmentPlan: InstallmentPlan) => {
    if (isProcessing) {
      return;
    }

    const planTitle = subscriptionTitles[plan || ""] || "the selected plan";
    const basePrice = getSubscriptionPrice(plan || "month");
    const subscriptionPrice = appliedPromoCode 
      ? Math.max(0, basePrice - appliedPromoCode.discountAmount)
      : basePrice;

    Alert.alert(
      "Confirm Installment Application",
      `Plan: ${planTitle}\nTotal Price: ${format(subscriptionPrice)}\n\nInstallment Provider: ${installmentPlan.providerName}\nMonthly Payment: ${format(installmentPlan.monthlyAmount)}\nDuration: ${installmentPlan.months} months\n\nApply for installment plan?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Apply Now",
          onPress: async () => {
            setIsProcessing(true);
            try {
              console.log("Applying for installment:", {
                plan,
                installmentPlan,
              });

              const subscriptionTypeMap: Record<string, SubscriptionPlanType> = {
                weekly: "week",
                monthly: "month",
                "3months": "3months",
                "6months": "6months",
                yearly: "year",
                student: "student",
                couples: "couples",
                mothers: "mothers",
              };

              const subscriptionType: SubscriptionPlanType = subscriptionTypeMap[plan || "month"] || "month";
              const totalPieces = getSubscriptionPieces(plan || "monthly");
              const totalPickupsPerWeek = getSubscriptionPickupsPerWeek(plan || "monthly");

              const installmentApplication = applyForInstallment({
                provider: installmentPlan.provider,
                planId: installmentPlan.id,
                subscriptionPlanId: plan || "month",
                subscriptionPlanTitle: planTitle,
                subscriptionPrice: subscriptionPrice,
                installmentMonths: installmentPlan.months,
                monthlyPayment: installmentPlan.monthlyAmount,
                downPayment: installmentPlan.downPayment,
                totalAmount: installmentPlan.totalAmount,
              });

              console.log("Installment application submitted:", installmentApplication);

              setTimeout(() => {
                const newSubscription = activateSubscription({
                  planType: subscriptionType,
                  planId: plan || "month",
                  planTitle: planTitle,
                  price: subscriptionPrice,
                  totalPieces: totalPieces,
                  totalPickupsPerWeek: totalPickupsPerWeek,
                  deliveryDays: days ? days.split(",") : undefined,
                  deliveryTime: time,
                  paymentMethod: `${installmentPlan.providerName} Installments`,
                });

                console.log("Subscription activated:", newSubscription);

                Alert.alert(
                  "Installment Application Approved!",
                  `Your application with ${installmentPlan.providerName} has been approved!\n\nYour ${planTitle} is now active.\n\nFirst payment of ${format(installmentPlan.monthlyAmount)} is due next month.`,
                  [
                    {
                      text: "View Subscription",
                      onPress: () => {
                        router.push("/(tabs)/subscription-status");
                      },
                    },
                    {
                      text: "Go Home",
                      onPress: () => {
                        router.push("/(tabs)");
                      },
                    },
                  ]
                );
              }, 2000);
            } catch (error) {
              console.error("Error processing installment:", error);
              Alert.alert(
                "Application Failed",
                error instanceof Error ? error.message : "There was an error processing your installment application. Please try again."
              );
            } finally {
              setIsProcessing(false);
            }
          },
        },
      ]
    );
  };

  const handleConfirmPayment = async () => {
    if (isProcessing) {
      return;
    }

    const planTitle = subscriptionTitles[plan || ""] || "the selected plan";
    const basePrice = getSubscriptionPrice(plan || "month");
    const subscriptionPrice = appliedPromoCode 
      ? Math.max(0, basePrice - appliedPromoCode.discountAmount)
      : basePrice;

    if (balance < subscriptionPrice) {
      Alert.alert(
        "Insufficient Balance",
        `Your wallet balance is ${format(balance)}, but ${planTitle} costs ${format(subscriptionPrice)}.\n\nPlease add money to your wallet first.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Add Money",
            onPress: () => {
              setIsProcessing(false);
              router.push("/add-money");
            },
          },
        ]
      );
      return;
    }

    Alert.alert(
      "Confirm Subscription Payment",
      `Plan: ${planTitle}\nPrice: ${format(subscriptionPrice)}\nWallet Balance: ${format(balance)}\n\nPay from wallet?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            setIsProcessing(true);
            try {
              console.log("Processing subscription payment:", {
                plan,
                days,
                time,
                promo,
              });

              const subscriptionTypeMap: Record<string, SubscriptionPlanType> = {
                weekly: "week",
                monthly: "month",
                "3months": "3months",
                "6months": "6months",
                yearly: "year",
                student: "student",
                couples: "couples",
                mothers: "mothers",
              };

              const subscriptionType: SubscriptionPlanType = subscriptionTypeMap[plan || "month"] || "month";
              const totalPieces = getSubscriptionPieces(plan || "monthly");
              const totalPickupsPerWeek = getSubscriptionPickupsPerWeek(plan || "monthly");

              const newSubscription = activateSubscription({
                planType: subscriptionType,
                planId: plan || "month",
                planTitle: planTitle,
                price: subscriptionPrice,
                totalPieces: totalPieces,
                totalPickupsPerWeek: totalPickupsPerWeek,
                deliveryDays: days ? days.split(",") : undefined,
                deliveryTime: time,
                paymentMethod: "Wallet",
              });

              await deductPayment(subscriptionPrice, `Subscription: ${planTitle}`);

              console.log("Subscription activated:", newSubscription);

              Alert.alert(
                "Subscription Activated!",
                `${format(subscriptionPrice)} deducted from wallet!\n\nYour ${planTitle} has been successfully activated.\n\nNew Balance: ${format(balance - subscriptionPrice)}`,
                [
                  {
                    text: "View Status",
                    onPress: () => {
                      router.push("/(tabs)/subscription-status");
                    },
                  },
                  {
                    text: "Go Home",
                    onPress: () => {
                      router.push("/(tabs)");
                    },
                  },
                ]
              );
            } catch (error) {
              console.error("Error processing subscription:", error);
              Alert.alert(
                "Payment Failed",
                error instanceof Error ? error.message : "There was an error processing your subscription. Please try again."
              );
            } finally {
              setIsProcessing(false);
            }
          },
        },
      ]
    );
  };

  const getSubscriptionPrice = (planId: string): number => {
    const prices: Record<string, number> = {
      weekly: 180,
      monthly: 675,
      "3months": 1913,
      "6months": 3560,
      yearly: 6600,
      student: 315,
      couples: 1080,
      mothers: 750,
    };
    return prices[planId] || 675;
  };

  const getSubscriptionPieces = (planId: string): number => {
    const pieces: Record<string, number> = {
      weekly: 10,
      monthly: 50,
      "3months": 180,
      "6months": 400,
      yearly: 1000,
      student: 35,
      couples: 100,
      mothers: 80,
    };
    return pieces[planId] || 50;
  };

  const getSubscriptionPickupsPerWeek = (planId: string): number => {
    const pickups: Record<string, number> = {
      weekly: 1,
      monthly: 2,
      "3months": 3,
      "6months": 4,
      yearly: 5,
      student: 2,
      couples: 3,
      mothers: 4,
    };
    return pickups[planId] || 2;
  };

  const subscriptionPrice = getSubscriptionPrice(plan || "month");
  
  React.useEffect(() => {
    const validatePromoCode = async () => {
      if (promo && promo.trim()) {
        try {
          console.log('[PaymentMethods] Validating promo code:', promo);
          const result = await applyPromoCode(promo, subscriptionPrice);
          setAppliedPromoCode(result);
          console.log('[PaymentMethods] Promo code applied:', result);
        } catch (error) {
          console.warn('[PaymentMethods] Promo code validation failed:', error);
          Alert.alert(
            'Invalid Promo Code',
            error instanceof Error ? error.message : 'The promo code could not be applied.',
            [
              { text: 'OK' }
            ]
          );
        }
      }
    };
    validatePromoCode();
  }, [promo, subscriptionPrice]);

  const finalPrice = appliedPromoCode 
    ? Math.max(0, subscriptionPrice - appliedPromoCode.discountAmount)
    : subscriptionPrice;
  const hasEnoughBalance = balance >= finalPrice;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Payment Method",
          headerStyle: {
            backgroundColor: Colors.light.cardBackground,
          },
        }}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Payment Method</Text>
            <Text style={styles.headerSubtitle}>
              Choose how you want to pay for your subscription
            </Text>
          </View>

          <View style={styles.paymentMethodsContainer}>
            <TouchableOpacity
              style={[
                styles.paymentMethodCard,
                selectedPaymentMethod === "wallet" && styles.paymentMethodCardSelected,
              ]}
              onPress={() => setSelectedPaymentMethod("wallet")}
              activeOpacity={0.7}
            >
              <View style={[
                styles.methodIconContainer,
                selectedPaymentMethod === "wallet" && styles.methodIconContainerSelected,
              ]}>
                <Wallet size={28} color={selectedPaymentMethod === "wallet" ? "#FFFFFF" : Colors.light.tint} strokeWidth={2.5} />
              </View>
              <View style={styles.methodContent}>
                <Text style={[
                  styles.methodTitle,
                  selectedPaymentMethod === "wallet" && styles.methodTitleSelected,
                ]}>Pay from Wallet</Text>
                <Text style={[
                  styles.methodDescription,
                  selectedPaymentMethod === "wallet" && styles.methodDescriptionSelected,
                ]}>Instant payment from your Kaweely Wallet</Text>
              </View>
              {selectedPaymentMethod === "wallet" && (
                <View style={styles.selectedIndicator}>
                  <DollarSign size={20} color="#FFFFFF" strokeWidth={3} />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentMethodCard,
                selectedPaymentMethod === "installment" && styles.paymentMethodCardSelected,
              ]}
              onPress={() => {
                setSelectedPaymentMethod("installment");
                setShowInstallmentModal(true);
              }}
              activeOpacity={0.7}
            >
              <View style={[
                styles.methodIconContainer,
                selectedPaymentMethod === "installment" && styles.methodIconContainerSelected,
              ]}>
                <CreditCard size={28} color={selectedPaymentMethod === "installment" ? "#FFFFFF" : "#9C27B0"} strokeWidth={2.5} />
              </View>
              <View style={styles.methodContent}>
                <Text style={[
                  styles.methodTitle,
                  selectedPaymentMethod === "installment" && styles.methodTitleSelected,
                ]}>Pay in Installments</Text>
                <Text style={[
                  styles.methodDescription,
                  selectedPaymentMethod === "installment" && styles.methodDescriptionSelected,
                ]}>Flexible monthly payments via valU, Souhoola, and more</Text>
              </View>
              {selectedPaymentMethod === "installment" && (
                <View style={styles.selectedIndicator}>
                  <Banknote size={20} color="#FFFFFF" strokeWidth={3} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.walletCard}>
            <View style={styles.walletHeader}>
              <View style={styles.walletIconContainer}>
                <Wallet size={32} color={Colors.light.tint} strokeWidth={2.5} />
              </View>
              <View style={styles.walletInfo}>
                <Text style={styles.walletLabel}>Current Balance</Text>
                <Text style={styles.walletBalance}>{format(balance)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.paymentDetailsCard}>
            <Text style={styles.detailsTitle}>Payment Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Subscription Plan</Text>
              <Text style={styles.detailValue}>{subscriptionTitles[plan || ""] || "Unknown"}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Base Price</Text>
              <Text style={styles.detailValue}>{format(subscriptionPrice)}</Text>
            </View>
            {appliedPromoCode && (
              <>
                <View style={styles.detailRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={[styles.detailLabel, { color: Colors.light.success }]}>Promo Code</Text>
                    <View style={{
                      backgroundColor: `${Colors.light.success}20`,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 6,
                    }}>
                      <Text style={{ fontSize: 10, fontWeight: '700' as const, color: Colors.light.success }}>
                        {appliedPromoCode.code}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.detailValue, { color: Colors.light.success }]}>
                    -{appliedPromoCode.type === 'free_order' ? 'FREE' : format(appliedPromoCode.discountAmount)}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabelBold}>Final Price</Text>
                  <Text style={[styles.detailValueBold, { color: Colors.light.success }]}>
                    {format(finalPrice)}
                  </Text>
                </View>
              </>
            )}
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabelBold}>Wallet After Payment</Text>
              <Text style={[styles.detailValueBold, !hasEnoughBalance && styles.detailValueError]}>
                {format(balance - finalPrice)}
              </Text>
            </View>
          </View>

          {!hasEnoughBalance && (
            <View style={styles.warningCard}>
              <AlertCircle size={24} color="#EF4444" strokeWidth={2.5} />
              <View style={styles.warningContent}>
                <Text style={styles.warningTitle}>Insufficient Balance</Text>
                <Text style={styles.warningText}>
                  You need {format(finalPrice - balance)} more to complete this subscription. Please top up your wallet from the Profile tab.
                </Text>
              </View>
            </View>
          )}

          {appliedPromoCode && (
            <View style={[styles.warningCard, { backgroundColor: `${Colors.light.success}10`, borderColor: Colors.light.success }]}>
              <CheckCircle2 size={24} color={Colors.light.success} strokeWidth={2.5} />
              <View style={styles.warningContent}>
                <Text style={[styles.warningTitle, { color: Colors.light.success }]}>Promo Code Applied!</Text>
                <Text style={[styles.warningText, { color: Colors.light.success }]}>
                  {appliedPromoCode.type === 'free_order' 
                    ? `Your subscription is FREE with code "${appliedPromoCode.code}"! 🎉`
                    : `You're saving ${format(appliedPromoCode.discountAmount)} with code "${appliedPromoCode.code}"! 💰`
                  }
                </Text>
              </View>
            </View>
          )}

          {days && time && (
            <View style={styles.scheduleCard}>
              <Text style={styles.scheduleTitle}>Delivery Schedule</Text>
              <View style={styles.scheduleInfo}>
                <Text style={styles.scheduleLabel}>Days:</Text>
                <Text style={styles.scheduleValue}>
                  {days.split(",").map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(", ")}
                </Text>
              </View>
              <View style={styles.scheduleInfo}>
                <Text style={styles.scheduleLabel}>Time:</Text>
                <Text style={styles.scheduleValue}>
                  {timeSlots.find(t => t.id === time)?.label || time}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Secure Payment</Text>
            <Text style={styles.infoText}>
              All transactions are encrypted and secure. Your payment information
              is protected.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            ((!hasEnoughBalance && selectedPaymentMethod === "wallet") || isProcessing || !selectedPaymentMethod) && styles.confirmButtonDisabled,
          ]}
          onPress={() => {
            if (selectedPaymentMethod === "wallet") {
              handleConfirmPayment();
            } else if (selectedPaymentMethod === "installment") {
              setShowInstallmentModal(true);
            }
          }}
          disabled={(selectedPaymentMethod === "wallet" && !hasEnoughBalance) || isProcessing || !selectedPaymentMethod}
        >
          <Text style={styles.confirmButtonText}>
            {isProcessing 
              ? "Processing..." 
              : !selectedPaymentMethod
              ? "Select Payment Method"
              : selectedPaymentMethod === "wallet"
              ? `Pay ${format(finalPrice)} from Wallet`
              : "Choose Installment Plan"}
          </Text>
        </TouchableOpacity>
      </View>

      <InstallmentSelectionModal
        visible={showInstallmentModal}
        onClose={() => setShowInstallmentModal(false)}
        subscriptionPrice={subscriptionPrice}
        subscriptionTitle={subscriptionTitles[plan || ""] || "Subscription"}
        onSelectPlan={handleSelectInstallmentPlan}
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
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    lineHeight: 24,
  },
  methodsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  paymentMethodsContainer: {
    gap: 14,
    marginBottom: 24,
  },
  paymentMethodCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    borderWidth: 2,
    borderColor: Colors.light.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  paymentMethodCardSelected: {
    borderWidth: 3,
    borderColor: Colors.light.tint,
    backgroundColor: Colors.light.tint,
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  methodIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${Colors.light.tint}15`,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 16,
  },
  methodIconContainerSelected: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  methodContent: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: Colors.light.text,
    marginBottom: 6,
  },
  methodTitleSelected: {
    color: "#FFFFFF",
  },
  methodDescription: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  methodDescriptionSelected: {
    color: "rgba(255, 255, 255, 0.95)",
  },
  selectedIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  methodCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.light.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  methodCardSelected: {
    borderColor: Colors.light.tint,
    backgroundColor: Colors.light.tint,
  },
  infoCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    color: Colors.light.text,
    lineHeight: 22,
  },
  scheduleCard: {
    backgroundColor: `${Colors.light.tint}08`,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.light.tint,
    marginBottom: 24,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  scheduleInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  scheduleLabel: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
    width: 60,
  },
  scheduleValue: {
    fontSize: 15,
    color: Colors.light.text,
    flex: 1,
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
  confirmButton: {
    backgroundColor: Colors.light.tint,
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.light.tint,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonDisabled: {
    backgroundColor: Colors.light.border,
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#fff",
  },
  walletCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: Colors.light.tint,
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  walletHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 16,
  },
  walletIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${Colors.light.tint}20`,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  walletInfo: {
    flex: 1,
  },
  walletLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  walletBalance: {
    fontSize: 32,
    fontWeight: "900" as const,
    color: Colors.light.tint,
  },
  paymentDetailsCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 24,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  detailLabelBold: {
    fontSize: 17,
    fontWeight: "800" as const,
    color: Colors.light.text,
  },
  detailValueBold: {
    fontSize: 20,
    fontWeight: "900" as const,
    color: Colors.light.tint,
  },
  detailValueError: {
    color: "#EF4444",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: 12,
  },
  warningCard: {
    backgroundColor: "#FEE2E2",
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "#EF4444",
    marginBottom: 24,
    flexDirection: "row" as const,
    gap: 12,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#DC2626",
    marginBottom: 6,
  },
  warningText: {
    fontSize: 14,
    color: "#991B1B",
    lineHeight: 20,
    marginBottom: 12,
  },

});
