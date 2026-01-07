import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Modal, Dimensions, Animated, Alert } from "react-native";
import { useState, useRef, useEffect } from "react";
import { CreditCard, Wallet, Building2, User, Gift, Check, X, Search, Bitcoin } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useWallet } from "@/contexts/WalletContext";
import { WalletUser } from "@/types/wallet";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { isCryptoLegalForCurrency } from "@/constants/cryptoLegalCurrencies";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type PaymentMethod = {
  id: string;
  name: string;
  icon: typeof CreditCard;
  color: string;
  subtitle: string;
  currencies: string[];
};

type GiftCard = {
  id: string;
  amount: number;
  color: string;
  icon: string;
  label: string;
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
  { id: "crypto", name: "Digital Currency", icon: Bitcoin, color: "#F7931A", subtitle: "Bitcoin, Ethereum, USDT", currencies: ['USD', 'EUR', 'GBP', 'SAR', 'AED', 'TRY', 'CNY', 'INR'] },
];

function getPaymentMethodsForCurrency(currencyCode: string): PaymentMethod[] {
  return allPaymentMethods.filter(method => {
    if (method.id === 'crypto') {
      return method.currencies.includes(currencyCode) && isCryptoLegalForCurrency(currencyCode as any);
    }
    return method.currencies.includes(currencyCode);
  });
}

const quickAmounts = [50, 100, 200, 500, 1000];

const giftCards: GiftCard[] = [
  { id: "1", amount: 50, color: "#667eea", icon: "🎁", label: "Starter" },
  { id: "2", amount: 100, color: "#F59E0B", icon: "💝", label: "Classic" },
  { id: "3", amount: 200, color: "#10B981", icon: "🎀", label: "Premium" },
  { id: "4", amount: 500, color: "#EF4444", icon: "💎", label: "Deluxe" },
  { id: "5", amount: 1000, color: "#8B5CF6", icon: "👑", label: "Royale" },
  { id: "6", amount: 2000, color: "#EC4899", icon: "⭐", label: "Ultimate" },
];

const mockUsers: WalletUser[] = [
  { id: "1", name: "Ahmed Mohamed", email: "ahmed@example.com", phone: "+20 100 123 4567" },
  { id: "2", name: "Sara Hassan", email: "sara@example.com", phone: "+20 101 234 5678" },
  { id: "3", name: "Omar Ali", email: "omar@example.com", phone: "+20 102 345 6789" },
  { id: "4", name: "Fatma Ibrahim", email: "fatma@example.com", phone: "+20 103 456 7890" },
  { id: "5", name: "Youssef Mahmoud", email: "youssef@example.com", phone: "+20 104 567 8901" },
];

type AddMoneyModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function AddMoneyModal({ visible, onClose }: AddMoneyModalProps) {
  const { colors } = useTheme();
  const { addMoney } = useWallet();
  const { currentCurrency, currentCurrencyInfo, format, convert } = useCurrency();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [amount, setAmount] = useState<string>("");
  const [selectedMethod, setSelectedMethod] = useState<string>("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = getPaymentMethodsForCurrency(currentCurrency);

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT * 0.8, 0],
  });

  const backdropOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

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
        "Success! 🎉",
        `${format(parsedAmount, currentCurrency)} has been added to your wallet`,
        [
          {
            text: "Done",
            onPress: () => {
              setAmount("");
              setSelectedMethod("card");
              onClose();
            },
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
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
    },
    backdrop: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    panel: {
      height: SCREEN_HEIGHT * 0.8,
      backgroundColor: colors.background,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
    dragIndicator: {
      width: 40,
      height: 5,
      backgroundColor: colors.border,
      borderRadius: 3,
      alignSelf: "center",
      marginTop: 12,
      marginBottom: 8,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 20,
      fontWeight: "800" as const,
      color: colors.text,
    },
    closeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.cardBackground,
      alignItems: "center",
      justifyContent: "center",
    },
    scrollContent: {
      padding: 20,
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
      marginBottom: 28,
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
      marginBottom: 28,
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
      marginHorizontal: 20,
      marginBottom: 20,
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
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          style={{ flex: 1 }}
        >
          <Animated.View
            style={[
              styles.backdrop,
              { opacity: backdropOpacity },
            ]}
          />
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.panel,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          <View style={styles.dragIndicator} />
          
          <View style={styles.header}>
            <Text style={styles.title}>Top Up Wallet</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <X size={20} color={colors.text} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={[]}
            renderItem={null}
            ListHeaderComponent={
              <View style={styles.scrollContent}>
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
                      onPress={() => setAmount(quickAmount.toString())}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.quickAmountText}>+{quickAmount}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

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
                        onPress={() => setSelectedMethod(method.id)}
                        activeOpacity={0.7}
                      >
                        <View 
                          style={[
                            styles.paymentMethodIconContainer,
                            { backgroundColor: `${method.color}20` }
                          ]}
                        >
                          <Icon size={26} color={method.color} strokeWidth={2} />
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
            }
          />

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
              {isProcessing ? "Processing..." : "Top Up"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

type SendGiftCardModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function SendGiftCardModal({ visible, onClose }: SendGiftCardModalProps) {
  const { colors } = useTheme();
  const { balance, sendMoney } = useWallet();
  const { user: currentUser } = useAuth();
  const { currentCurrency, currentCurrencyInfo, format } = useCurrency();
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<WalletUser | null>(null);
  const [selectedGiftCard, setSelectedGiftCard] = useState<GiftCard | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredUsers = mockUsers.filter((u) => 
    u.id !== currentUser?.id &&
    (u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.phone.includes(searchQuery))
  );

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT * 0.85, 0],
  });

  const backdropOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleSendGiftCard = async () => {
    if (!selectedUser) {
      Alert.alert("No Recipient", "Please select a recipient");
      return;
    }

    if (!selectedGiftCard) {
      Alert.alert("No Gift Card", "Please select a gift card");
      return;
    }

    if (selectedGiftCard.amount > balance) {
      Alert.alert("Insufficient Balance", "You don't have enough balance for this gift card");
      return;
    }

    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await sendMoney(selectedGiftCard.amount, selectedUser);
      
      Alert.alert(
        "Success! 🎉",
        `Gift card of ${format(selectedGiftCard.amount, currentCurrency)} has been sent to ${selectedUser.name}${message ? `\n\nYour message: "${message}"` : ""}`,
        [
          {
            text: "Done",
            onPress: () => {
              setSearchQuery("");
              setSelectedUser(null);
              setSelectedGiftCard(null);
              setMessage("");
              onClose();
            },
          }
        ]
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send gift card. Please try again.";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
    },
    backdrop: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    panel: {
      height: SCREEN_HEIGHT * 0.85,
      backgroundColor: colors.background,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
    dragIndicator: {
      width: 40,
      height: 5,
      backgroundColor: colors.border,
      borderRadius: 3,
      alignSelf: "center",
      marginTop: 12,
      marginBottom: 8,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 20,
      fontWeight: "800" as const,
      color: colors.text,
    },
    closeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.cardBackground,
      alignItems: "center",
      justifyContent: "center",
    },
    scrollContent: {
      padding: 20,
    },
    balanceCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 18,
      borderWidth: 2,
      borderColor: colors.border,
      marginBottom: 24,
    },
    balanceLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: "600" as const,
      marginBottom: 6,
    },
    balanceAmount: {
      fontSize: 28,
      fontWeight: "800" as const,
      color: colors.accent,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: "800" as const,
      color: colors.text,
      marginBottom: 16,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.cardBackground,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 2,
      borderColor: colors.border,
      marginBottom: 16,
      gap: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      color: colors.text,
      fontWeight: "500" as const,
    },
    userItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.cardBackground,
      borderRadius: 14,
      padding: 16,
      marginBottom: 10,
      borderWidth: 2,
      borderColor: colors.border,
      gap: 14,
    },
    userItemSelected: {
      borderColor: colors.tint,
      backgroundColor: `${colors.tint}10`,
    },
    userAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 15,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 12,
      color: colors.textSecondary,
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
    giftCardsGrid: {
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      gap: 12,
      marginBottom: 24,
    },
    giftCardItem: {
      width: "31%",
      aspectRatio: 1,
      borderRadius: 16,
      padding: 12,
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 3,
      borderColor: "transparent",
    },
    giftCardItemSelected: {
      borderColor: "#FFFFFF",
      transform: [{ scale: 1.05 }],
    },
    giftCardIcon: {
      fontSize: 32,
      marginBottom: 4,
    },
    giftCardAmount: {
      fontSize: 18,
      fontWeight: "800" as const,
      color: "#FFFFFF",
      marginBottom: 2,
    },
    giftCardLabel: {
      fontSize: 11,
      fontWeight: "600" as const,
      color: "rgba(255, 255, 255, 0.8)",
    },
    checkMark: {
      position: "absolute" as const,
      top: 8,
      right: 8,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
    },
    messageInputContainer: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 16,
      borderWidth: 2,
      borderColor: colors.border,
      marginBottom: 24,
    },
    messageInput: {
      fontSize: 14,
      color: colors.text,
      fontWeight: "500" as const,
      minHeight: 80,
      textAlignVertical: "top" as const,
    },
    sendButton: {
      backgroundColor: colors.tint,
      borderRadius: 16,
      paddingVertical: 18,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 10,
      marginHorizontal: 20,
      marginBottom: 20,
      shadowColor: colors.tint,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    sendButtonDisabled: {
      opacity: 0.5,
    },
    sendButtonText: {
      fontSize: 17,
      fontWeight: "800" as const,
      color: "#FFFFFF",
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          style={{ flex: 1 }}
        >
          <Animated.View
            style={[
              styles.backdrop,
              { opacity: backdropOpacity },
            ]}
          />
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.panel,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          <View style={styles.dragIndicator} />
          
          <View style={styles.header}>
            <Text style={styles.title}>Send Gift Card</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <X size={20} color={colors.text} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={[]}
            renderItem={null}
            ListHeaderComponent={
              <View style={styles.scrollContent}>
                <View style={styles.balanceCard}>
                  <Text style={styles.balanceLabel}>Available Balance</Text>
                  <Text style={styles.balanceAmount}>{format(balance, currentCurrency)}</Text>
                </View>

                <Text style={styles.sectionTitle}>Select Recipient</Text>
                
                <View style={styles.searchContainer}>
                  <Search size={22} color={colors.textSecondary} strokeWidth={2} />
                  <TextInput
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search by name or email"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>

                {filteredUsers.slice(0, 3).map((item) => {
                  const isSelected = selectedUser?.id === item.id;
                  
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.userItem,
                        isSelected && styles.userItemSelected,
                      ]}
                      onPress={() => setSelectedUser(item)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.userAvatar}>
                        <User size={26} color={colors.tint} strokeWidth={2} />
                      </View>
                      
                      <View style={styles.userInfo}>
                        <Text style={styles.userName}>{item.name}</Text>
                        <Text style={styles.userEmail}>{item.email}</Text>
                      </View>
                      
                      <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}

                {selectedUser && (
                  <>
                    <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Select Gift Card</Text>
                    
                    <View style={styles.giftCardsGrid}>
                      {giftCards.map((card) => {
                        const isSelected = selectedGiftCard?.id === card.id;
                        
                        return (
                          <TouchableOpacity
                            key={card.id}
                            style={[
                              styles.giftCardItem,
                              { backgroundColor: card.color },
                              isSelected && styles.giftCardItemSelected,
                            ]}
                            onPress={() => setSelectedGiftCard(card)}
                            activeOpacity={0.8}
                          >
                            {isSelected && (
                              <View style={styles.checkMark}>
                                <Check size={16} color={card.color} strokeWidth={3} />
                              </View>
                            )}
                            <Text style={styles.giftCardIcon}>{card.icon}</Text>
                            <View style={{ alignItems: "center" }}>
                              <Text style={styles.giftCardAmount}>{currentCurrencyInfo?.symbol || currentCurrency} {card.amount}</Text>
                              <Text style={styles.giftCardLabel}>{card.label}</Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {selectedGiftCard && (
                      <>
                        <Text style={styles.sectionTitle}>Add a Message (Optional)</Text>
                        
                        <View style={styles.messageInputContainer}>
                          <TextInput
                            style={styles.messageInput}
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Write a personal message..."
                            placeholderTextColor={colors.textSecondary}
                            multiline
                            maxLength={200}
                          />
                        </View>
                      </>
                    )}
                  </>
                )}
              </View>
            }
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              (!selectedUser || !selectedGiftCard || isProcessing) && styles.sendButtonDisabled,
            ]}
            onPress={handleSendGiftCard}
            disabled={!selectedUser || !selectedGiftCard || isProcessing}
            activeOpacity={0.8}
          >
            <Gift size={22} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.sendButtonText}>
              {isProcessing ? "Sending..." : "Send Gift Card"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}
