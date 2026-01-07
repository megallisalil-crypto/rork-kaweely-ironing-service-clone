import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, FlatList } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Search, User, Gift, Check } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useWallet } from "@/contexts/WalletContext";
import { WalletUser } from "@/types/wallet";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";

type GiftCard = {
  id: string;
  amount: number;
  color: string;
  icon: string;
  label: string;
};

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

export default function SendGiftCardScreen() {
  const { colors } = useTheme();
  const { balance, sendMoney } = useWallet();
  const { user: currentUser } = useAuth();
  const { currentCurrency, currentCurrencyInfo, format } = useCurrency();
  const router = useRouter();
  
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
            text: "OK",
            onPress: () => router.back(),
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
    balanceCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 18,
      borderWidth: 2,
      borderColor: colors.border,
      marginBottom: 28,
    },
    balanceLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: "600" as const,
      marginBottom: 6,
    },
    balanceAmount: {
      fontSize: 32,
      fontWeight: "800" as const,
      color: colors.accent,
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
    usersList: {
      maxHeight: 280,
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
    emptyState: {
      alignItems: "center",
      paddingVertical: 40,
    },
    emptyStateText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500" as const,
      textAlign: "center" as const,
    },
    giftCardsGrid: {
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      gap: 12,
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
    },
    messageInput: {
      fontSize: 14,
      color: colors.text,
      fontWeight: "500" as const,
      minHeight: 80,
      textAlignVertical: "top" as const,
    },
    messageHint: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 8,
      fontWeight: "500" as const,
    },
    sendButton: {
      backgroundColor: colors.tint,
      borderRadius: 16,
      paddingVertical: 18,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 10,
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
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: "Send Gift Card",
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
            <Text style={styles.title}>Send Gift Card</Text>
            <Text style={styles.subtitle}>Send a prepaid gift card to friends & family</Text>
          </View>

          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>{format(balance, currentCurrency)}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Recipient</Text>
            
            <View style={styles.searchContainer}>
              <Search size={22} color={colors.textSecondary} strokeWidth={2} />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search by name, email, or phone"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.usersList}>
              {filteredUsers.length > 0 ? (
                <FlatList
                  data={filteredUsers}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  renderItem={({ item }) => {
                    const isSelected = selectedUser?.id === item.id;
                    
                    return (
                      <TouchableOpacity
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
                  }}
                />
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    {searchQuery ? "No users found" : "Start typing to search for users"}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {selectedUser && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Select Gift Card</Text>
                
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
              </View>

              {selectedGiftCard && (
                <View style={styles.section}>
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
                    <Text style={styles.messageHint}>{message.length}/200 characters</Text>
                  </View>
                </View>
              )}
            </>
          )}

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
        </View>
      </ScrollView>
    </View>
  );
}
