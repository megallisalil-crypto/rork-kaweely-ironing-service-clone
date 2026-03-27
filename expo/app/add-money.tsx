import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { CreditCard, Wallet, Building2, Bitcoin, Sparkles } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useWallet } from "@/contexts/WalletContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { isCryptoLegalForCurrency } from "@/constants/cryptoLegalCurrencies";

type PaymentMethod = {
  id: string;
  name: string;
  icon: typeof CreditCard;
  color: string;
  subtitle: string;
  currencies: string[];
};

const allPaymentMethods: PaymentMethod[] = [
  { id: "card", name: "Credit/Debit Card", icon: CreditCard, color: "#667eea", subtitle: "Visa, Mastercard, Amex", currencies: ['EGP', 'USD', 'EUR', 'GBP', 'SAR', 'AED', 'TRY', 'RUB', 'CNY', 'INR'] },
  { id: "fawry", name: "Fawry", icon: Wallet, color: "#FF6B35", subtitle: "Pay with Fawry", currencies: ['EGP'] },
  { id: "vodafone", name: "Vodafone Cash", icon: Wallet, color: "#E60000", subtitle: "Vodafone mobile wallet", currencies: ['EGP'] },
  { id: "etisalat", name: "Etisalat Cash", icon: Wallet, color: "#00B140", subtitle: "Etisalat mobile wallet", currencies: ['EGP'] },
  { id: "paypal", name: "PayPal", icon: Wallet, color: "#0070BA", subtitle: "Pay with PayPal", currencies: ['USD', 'EUR', 'GBP'] },
  { id: "stripe", name: "Stripe", icon: CreditCard, color: "#635BFF", subtitle: "Fast and secure", currencies: ['USD', 'EUR', 'GBP'] },
  { id: "stcpay", name: "STC Pay", icon: Wallet, color: "#4B0082", subtitle: "STC mobile wallet", currencies: ['SAR'] },
  { id: "mada", name: "Mada", icon: CreditCard, color: "#00A651", subtitle: "Saudi payment network", currencies: ['SAR'] },
  { id: "payfort", name: "PayFort", icon: CreditCard, color: "#1E3A8A", subtitle: "Secure payment gateway", currencies: ['AED', 'SAR'] },
  { id: "paytm", name: "Paytm", icon: Wallet, color: "#00BAF2", subtitle: "Paytm wallet", currencies: ['INR'] },
  { id: "upi", name: "UPI", icon: Wallet, color: "#097939", subtitle: "Unified Payments Interface", currencies: ['INR'] },
  { id: "alipay", name: "Alipay", icon: Wallet, color: "#1677FF", subtitle: "Alipay wallet", currencies: ['CNY'] },
  { id: "wechat", name: "WeChat Pay", icon: Wallet, color: "#09B83E", subtitle: "WeChat payment", currencies: ['CNY'] },
  { id: "yandex", name: "Yandex Money", icon: Wallet, color: "#FC3F1D", subtitle: "Yandex payment", currencies: ['RUB'] },
  { id: "qiwi", name: "QIWI", icon: Wallet, color: "#FF8C00", subtitle: "QIWI wallet", currencies: ['RUB'] },
  { id: "papara", name: "Papara", icon: Wallet, color: "#00D084", subtitle: "Papara wallet", currencies: ['TRY'] },
  { id: "bank", name: "Bank Transfer", icon: Building2, color: "#4ade80", subtitle: "Direct bank transfer", currencies: ['EGP', 'USD', 'EUR', 'GBP', 'SAR', 'AED', 'TRY', 'RUB', 'CNY', 'INR'] },
  { id: "crypto", name: "Digital Currency", icon: Bitcoin, color: "#F7931A", subtitle: "Bitcoin, USDT, ETH & more", currencies: ['USD', 'EUR', 'GBP', 'SAR', 'AED', 'TRY', 'CNY', 'INR'] },
];

function getPaymentMethodsForCurrency(currencyCode: string): PaymentMethod[] {
  return allPaymentMethods.filter(method => {
    if (method.id === 'crypto') {
      return isCryptoLegalForCurrency(currencyCode as any);
    }
    return method.currencies.includes(currencyCode);
  });
}

const quickAmounts = [50, 100, 200, 500, 1000];

export default function AddMoneyScreen() {
  const { colors } = useTheme();
  const { addMoney } = useWallet();
  const { currentCurrency, currentCurrencyInfo, format, convert } = useCurrency();
  const router = useRouter();
  
  const [amount, setAmount] = useState<string>("");
  const [selectedMethod, setSelectedMethod] = useState<string>("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = getPaymentMethodsForCurrency(currentCurrency);

  const handleAddMoney = async () => {
    const parsedAmount = parseFloat(amount);
    
    if (!amount || parsedAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount");
      return;
    }

    const maxAmount = convert(10000, 'EGP');
    if (parsedAmount > maxAmount) {
      Alert.alert("Limit Exceeded", `Maximum amount per transaction is ${format(maxAmount, currentCurrency)}`);
      return;
    }

    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const method = paymentMethods.find(m => m.id === selectedMethod)?.name || "Card";
      await addMoney(parsedAmount, method);
      
      Alert.alert(
        "Success",
        `${format(parsedAmount, currentCurrency)} has been added to your wallet`,
        [
          {
            text: "OK",
            onPress: () => router.back(),
          }
        ]
      );
    } catch {
      Alert.alert("Error", "Failed to add money. Please try again.");
    } finally {
      setIsProcessing(false);
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
    header: {
      marginBottom: 28,
    },
    title: {
      fontSize: 26,
      fontWeight: "800" as const,
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500" as const,
    },
    section: {
      marginBottom: 28,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: "800" as const,
      color: colors.text,
      marginBottom: 16,
    },
    amountInputContainer: {
      backgroundColor: colors.cardBackground,
      borderRadius: 20,
      padding: 24,
      alignItems: "center",
      borderWidth: 2,
      borderColor: colors.border,
      marginBottom: 20,
    },
    currencyLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "700" as const,
      marginBottom: 8,
    },
    amountInput: {
      fontSize: 48,
      fontWeight: "800" as const,
      color: colors.text,
      textAlign: "center" as const,
      minWidth: 200,
      padding: 0,
    },
    quickAmountsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginBottom: 12,
    },
    quickAmountButton: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 14,
      backgroundColor: colors.cardBackground,
      borderWidth: 2,
      borderColor: colors.border,
    },
    quickAmountText: {
      fontSize: 14,
      fontWeight: "700" as const,
      color: colors.text,
    },
    paymentMethodsContainer: {
      gap: 12,
    },
    paymentMethod: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 18,
      borderWidth: 2,
      borderColor: colors.border,
      gap: 16,
    },
    paymentMethodSelected: {
      borderColor: colors.tint,
      backgroundColor: `${colors.tint}10`,
    },
    paymentMethodIconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      alignItems: "center",
      justifyContent: "center",
    },
    paymentMethodInfo: {
      flex: 1,
    },
    paymentMethodName: {
      fontSize: 15,
      fontWeight: "700" as const,
      color: colors.text,
    },
    paymentMethodSubtext: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
      fontWeight: "500" as const,
    },
    radioOuter: {
      width: 26,
      height: 26,
      borderRadius: 13,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    radioOuterSelected: {
      borderColor: colors.tint,
    },
    radioInner: {
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: colors.tint,
    },
    addButton: {
      backgroundColor: colors.tint,
      borderRadius: 16,
      paddingVertical: 18,
      alignItems: "center",
      shadowColor: colors.tint,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    addButtonDisabled: {
      opacity: 0.5,
    },
    addButtonText: {
      fontSize: 17,
      fontWeight: "800" as const,
      color: "#FFFFFF",
    },
    note: {
      backgroundColor: `${colors.tint}15`,
      borderRadius: 14,
      padding: 16,
      marginTop: 20,
    },
    noteText: {
      fontSize: 13,
      color: colors.text,
      lineHeight: 20,
      fontWeight: "500" as const,
    },
    cryptoIconContainer: {
      backgroundColor: `${colors.tint}10`,
      position: "relative" as const,
    },
    cryptoIconWrapper: {
      position: "relative" as const,
      alignItems: "center",
      justifyContent: "center",
    },
    sparkleIcon: {
      position: "absolute" as const,
      top: -6,
      right: -6,
      shadowColor: "#FFD700",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 4,
      elevation: 2,
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: "Add Money",
          headerStyle: { backgroundColor: colors.cardBackground },
          headerTintColor: colors.text,
          presentation: "modal",
        }}
      />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Money</Text>
            <Text style={styles.subtitle}>Top up your wallet to use for orders and transfers</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Enter Amount</Text>
            
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencyLabel}>{currentCurrencyInfo?.symbol || currentCurrency}</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.border}
                maxLength={6}
              />
            </View>

            <View style={styles.quickAmountsContainer}>
              {quickAmounts.map((quickAmount) => (
                <TouchableOpacity
                  key={quickAmount}
                  style={styles.quickAmountButton}
                  onPress={() => {
                    if (!isProcessing) {
                      setAmount(quickAmount.toString());
                    }
                  }}
                  activeOpacity={0.7}
                  disabled={isProcessing}
                >
                  <Text style={styles.quickAmountText}>+{quickAmount}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            
            <View style={styles.paymentMethodsContainer}>
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.id;
                
                return (
                  <TouchableOpacity
                    key={method.id}
                    style={[
                      styles.paymentMethod,
                      isSelected && styles.paymentMethodSelected,
                    ]}
                    onPress={() => {
                      if (!isProcessing) {
                        setSelectedMethod(method.id);
                      }
                    }}
                    activeOpacity={0.7}
                    disabled={isProcessing}
                  >
                    <View 
                      style={[
                        styles.paymentMethodIconContainer,
                        { backgroundColor: `${method.color}20` },
                        method.id === 'crypto' && styles.cryptoIconContainer
                      ]}
                    >
                      {method.id === 'crypto' ? (
                        <View style={styles.cryptoIconWrapper}>
                          <Icon size={26} color={method.color} strokeWidth={2.5} />
                          <View style={styles.sparkleIcon}>
                            <Sparkles size={14} color="#FFD700" fill="#FFD700" />
                          </View>
                        </View>
                      ) : (
                        <Icon size={26} color={method.color} strokeWidth={2} />
                      )}
                    </View>
                    
                    <View style={styles.paymentMethodInfo}>
                      <Text style={styles.paymentMethodName}>{method.name}</Text>
                      <Text style={styles.paymentMethodSubtext}>
                        {method.subtitle}
                      </Text>
                    </View>
                    
                    <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.addButton,
              (!amount || isProcessing) && styles.addButtonDisabled,
            ]}
            onPress={handleAddMoney}
            disabled={!amount || isProcessing}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>
              {isProcessing ? "Processing..." : "Add Money"}
            </Text>
          </TouchableOpacity>

          <View style={styles.note}>
            <Text style={styles.noteText}>
              Your payment information is encrypted and secure. We never store your card details.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
