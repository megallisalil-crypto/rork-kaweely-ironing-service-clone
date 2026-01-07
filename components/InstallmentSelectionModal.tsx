import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Animated, Platform } from "react-native";
import { X, CheckCircle, Clock, Shield, TrendingDown, ChevronRight, Info, Sparkles } from "lucide-react-native";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { InstallmentPlan } from "@/types/installment";
import { getInstallmentPlansForPrice } from "@/constants/installmentProviders";


type InstallmentSelectionModalProps = {
  visible: boolean;
  onClose: () => void;
  subscriptionPrice: number;
  subscriptionTitle: string;
  onSelectPlan: (plan: InstallmentPlan) => void;
};

export default function InstallmentSelectionModal({
  visible,
  onClose,
  subscriptionPrice,
  subscriptionTitle,
  onSelectPlan,
}: InstallmentSelectionModalProps) {
  const { colors } = useTheme();
  const [selectedPlan, setSelectedPlan] = useState<InstallmentPlan | null>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const availablePlans = getInstallmentPlansForPrice(subscriptionPrice);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleSelectPlan = (plan: InstallmentPlan) => {
    setSelectedPlan(plan);
  };

  const handleConfirm = () => {
    if (selectedPlan) {
      onSelectPlan(selectedPlan);
      onClose();
    }
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      justifyContent: "flex-end" as const,
    },
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      maxHeight: "90%" as const,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -8 },
      shadowOpacity: 0.3,
      shadowRadius: 24,
      elevation: 20,
    },
    modalHeader: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: "800" as const,
      color: colors.text,
      flex: 1,
    },
    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${colors.border}80`,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    scrollView: {
      maxHeight: 500,
    },
    content: {
      padding: 20,
    },
    headerCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 20,
      padding: 20,
      marginBottom: 20,
      borderWidth: 2,
      borderColor: colors.tint,
    },
    headerRow: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      marginBottom: 12,
    },
    headerLabel: {
      fontSize: 14,
      fontWeight: "600" as const,
      color: colors.textSecondary,
    },
    headerValue: {
      fontSize: 24,
      fontWeight: "900" as const,
      color: colors.tint,
    },
    planTitle: {
      fontSize: 16,
      fontWeight: "700" as const,
      color: colors.text,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "800" as const,
      color: colors.text,
      marginBottom: 16,
      marginTop: 8,
    },
    plansContainer: {
      gap: 12,
      marginBottom: 20,
    },
    planCard: {
      borderRadius: 20,
      padding: 20,
      borderWidth: 2,
      borderColor: colors.border,
      position: "relative" as const,
      overflow: "hidden" as const,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    planCardSelected: {
      borderWidth: 3,
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    planGlow: {
      position: "absolute" as const,
      top: -60,
      right: -60,
      width: 160,
      height: 160,
      borderRadius: 80,
      opacity: 0.15,
    },
    planHeader: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
      marginBottom: 16,
    },
    planLogoContainer: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 12,
    },
    planLogo: {
      fontSize: 32,
    },
    planInfo: {
      flex: 1,
    },
    providerName: {
      fontSize: 18,
      fontWeight: "800" as const,
      color: colors.text,
      marginBottom: 2,
    },
    planMonths: {
      fontSize: 13,
      fontWeight: "600" as const,
      color: colors.textSecondary,
    },
    selectionIndicator: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 2,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    priceSection: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "flex-end" as const,
      marginBottom: 16,
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 16,
    },
    priceLeft: {
      flex: 1,
    },
    monthlyLabel: {
      fontSize: 12,
      fontWeight: "600" as const,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    monthlyAmount: {
      fontSize: 28,
      fontWeight: "900" as const,
    },
    monthText: {
      fontSize: 14,
      fontWeight: "700" as const,
    },
    totalSection: {
      alignItems: "flex-end" as const,
    },
    totalLabel: {
      fontSize: 11,
      fontWeight: "600" as const,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    totalAmount: {
      fontSize: 15,
      fontWeight: "700" as const,
      color: colors.text,
    },
    featuresRow: {
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      gap: 10,
      marginBottom: 12,
    },
    featureBadge: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
    },
    featureText: {
      fontSize: 11,
      fontWeight: "700" as const,
    },
    approvalTime: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 6,
      paddingTop: 12,
      borderTopWidth: 1,
    },
    approvalText: {
      fontSize: 12,
      fontWeight: "600" as const,
      color: colors.textSecondary,
    },
    infoCard: {
      backgroundColor: `${colors.tint}15`,
      borderRadius: 16,
      padding: 16,
      flexDirection: "row" as const,
      gap: 12,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: `${colors.tint}30`,
    },
    infoContent: {
      flex: 1,
    },
    infoTitle: {
      fontSize: 14,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 4,
    },
    infoText: {
      fontSize: 12,
      fontWeight: "500" as const,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    footer: {
      padding: 20,
      paddingBottom: Platform.OS === "ios" ? 34 : 20,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.cardBackground,
    },
    confirmButton: {
      borderRadius: 16,
      paddingVertical: 18,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      flexDirection: "row" as const,
      gap: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    confirmButtonDisabled: {
      backgroundColor: colors.border,
      opacity: 0.5,
    },
    confirmButtonText: {
      fontSize: 17,
      fontWeight: "800" as const,
      color: "#FFFFFF",
      letterSpacing: 0.3,
    },
  });

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        <TouchableOpacity 
          style={{ flex: 1 }} 
          activeOpacity={1} 
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Pay in Installments</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={22} color={colors.text} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <View style={styles.headerCard}>
              <View style={styles.headerRow}>
                <Text style={styles.headerLabel}>Subscription Plan</Text>
              </View>
              <Text style={styles.planTitle}>{subscriptionTitle}</Text>
              <View style={[styles.headerRow, { marginTop: 12, marginBottom: 0 }]}>
                <Text style={styles.headerLabel}>Total Price</Text>
                <Text style={styles.headerValue}>EGP {subscriptionPrice}</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Info size={20} color={colors.tint} strokeWidth={2.5} />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Flexible Payment Options</Text>
                <Text style={styles.infoText}>
                  Choose your preferred installment plan and complete your subscription with easy monthly payments
                </Text>
              </View>
            </View>

            {availablePlans.length > 0 ? (
              <>
                <Text style={styles.sectionTitle}>Available Installment Plans</Text>
                <View style={styles.plansContainer}>
                  {availablePlans.map((plan) => {
                    const isSelected = selectedPlan?.id === plan.id;
                    const planColor = plan.color;
                    
                    return (
                      <TouchableOpacity
                        key={plan.id}
                        style={[
                          styles.planCard,
                          { backgroundColor: `${planColor}08` },
                          isSelected && [styles.planCardSelected, { borderColor: planColor }],
                        ]}
                        onPress={() => handleSelectPlan(plan)}
                        activeOpacity={0.7}
                      >
                        {isSelected && (
                          <View style={[styles.planGlow, { backgroundColor: planColor }]} />
                        )}
                        
                        <View style={styles.planHeader}>
                          <View style={styles.planLogoContainer}>
                            <Text style={styles.planLogo}>{plan.logo}</Text>
                            <View style={styles.planInfo}>
                              <Text style={styles.providerName}>{plan.providerName}</Text>
                              <Text style={styles.planMonths}>{plan.months} months plan</Text>
                            </View>
                          </View>
                          <View style={[
                            styles.selectionIndicator,
                            { 
                              borderColor: isSelected ? planColor : colors.border,
                              backgroundColor: isSelected ? planColor : "transparent",
                            }
                          ]}>
                            {isSelected && <CheckCircle size={20} color="#FFFFFF" strokeWidth={3} />}
                          </View>
                        </View>

                        <View style={[styles.priceSection, { backgroundColor: `${planColor}12` }]}>
                          <View style={styles.priceLeft}>
                            <Text style={styles.monthlyLabel}>Monthly Payment</Text>
                            <View style={{ flexDirection: "row", alignItems: "baseline", gap: 4 }}>
                              <Text style={[styles.monthlyAmount, { color: planColor }]}>
                                {plan.monthlyAmount.toFixed(0)}
                              </Text>
                              <Text style={[styles.monthText, { color: planColor }]}>EGP/mo</Text>
                            </View>
                          </View>
                          <View style={styles.totalSection}>
                            <Text style={styles.totalLabel}>Total Amount</Text>
                            <Text style={styles.totalAmount}>EGP {plan.totalAmount.toFixed(0)}</Text>
                          </View>
                        </View>

                        <View style={styles.featuresRow}>
                          {plan.interestRate === 0 && (
                            <View style={[styles.featureBadge, { backgroundColor: `${planColor}20` }]}>
                              <TrendingDown size={13} color={planColor} strokeWidth={2.5} />
                              <Text style={[styles.featureText, { color: planColor }]}>0% Interest</Text>
                            </View>
                          )}
                          {plan.adminFee === 0 && (
                            <View style={[styles.featureBadge, { backgroundColor: `${planColor}20` }]}>
                              <Sparkles size={13} color={planColor} strokeWidth={2.5} />
                              <Text style={[styles.featureText, { color: planColor }]}>No Fees</Text>
                            </View>
                          )}
                          <View style={[styles.featureBadge, { backgroundColor: `${planColor}20` }]}>
                            <Shield size={13} color={planColor} strokeWidth={2.5} />
                            <Text style={[styles.featureText, { color: planColor }]}>Secure</Text>
                          </View>
                        </View>

                        <View style={[styles.approvalTime, { borderTopColor: `${planColor}20` }]}>
                          <Clock size={14} color={colors.textSecondary} strokeWidth={2.5} />
                          <Text style={styles.approvalText}>Approval in {plan.approvalTime}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            ) : (
              <View style={styles.infoCard}>
                <Info size={20} color={colors.textSecondary} strokeWidth={2.5} />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoTitle, { color: colors.textSecondary }]}>
                    No installment plans available
                  </Text>
                  <Text style={styles.infoText}>
                    The subscription price does not meet the minimum requirements for installment plans.
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                { backgroundColor: selectedPlan ? selectedPlan.color : colors.border },
                !selectedPlan && styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={!selectedPlan}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>
                {selectedPlan 
                  ? `Continue with ${selectedPlan.providerName}` 
                  : "Select a Plan"}
              </Text>
              <ChevronRight size={20} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
