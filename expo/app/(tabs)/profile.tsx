import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Image, Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { safeJsonParse, safeJsonStringify } from "@/utils/safeJsonParse";
import { clearCorruptedStorage } from "@/utils/clearCorruptedStorage";
import * as ImagePicker from 'expo-image-picker';
import { User, Globe, Settings, Bell, Moon, Shield, LogOut, Wallet, Plus, Gift, Calendar, Check, Edit3, Camera, ArrowUpRight, ChevronRight, AlertTriangle, Users, Palette, QrCode } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import { useAddress } from "@/contexts/AddressContext";
import { LanguageCode } from "@/types/language";
import { useCurrency } from "@/contexts/CurrencyContext";
import SlidingPanel from "@/components/SlidingPanel";
import { AddMoneyModal, SendGiftCardModal } from "@/components/WalletModals";
import UserQRCode from "@/components/UserQRCode";


const PROFILE_STORAGE_KEY = "kaweely_profile";

type UserProfile = {
  clientName: string;
  phoneNumber: string;
  email: string;
  address: string;
  birthday: string;
  notifications: boolean;
  avatarUri?: string;
  gender?: 'male' | 'female';
};



export default function ProfileScreen() {
  const { t, currentLanguage, changeLanguage, languages: supportedLanguages } = useLanguage();
  const { colors, isDark, toggleTheme, isAppActive } = useTheme();
  const { user, logout } = useAuth();
  const { balance, transactions } = useWallet();
  const { format } = useCurrency();
  const { address: savedAddress, saveAddress: saveDeliveryAddress } = useAddress();
  const router = useRouter();
  const logoUrl = "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/8nlam6zuq1umfi1sxbk5q";
  
  const [clientName, setClientName] = useState(user?.name || "Guest User");
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || "+20 123 456 7890");
  const [email, setEmail] = useState(user?.email || "guest@kaweely.com");
  const [address, setAddress] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState<'male' | 'female' | undefined>(user?.gender);
  const [isEditMode, setIsEditMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [avatarUri, setAvatarUri] = useState<string | undefined>(undefined);
  const [showClientInfoPanel, setShowClientInfoPanel] = useState(false);
  const [showLanguagePanel, setShowLanguagePanel] = useState(false);
  const [showWalletPanel, setShowWalletPanel] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [showGiftCardModal, setShowGiftCardModal] = useState(false);
  const [showCurrencyPanel, setShowCurrencyPanel] = useState(false);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const { currentCurrency, changeCurrency, currencies } = useCurrency();


  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fullAddress = savedAddress?.fullAddress || savedAddress?.street || "";
    if (fullAddress && fullAddress.trim().length > 0) {
      setAddress(fullAddress);
      console.log("Address synced from AddressContext:", fullAddress);
    }
  }, [savedAddress]);

  const loadProfile = async () => {
    try {
      const stored = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored && typeof stored === 'string' && stored.trim().length > 0) {
        const profile = safeJsonParse<UserProfile>(stored);
        if (profile && typeof profile === 'object') {
          setClientName(profile.clientName || user?.name || "Guest User");
          setPhoneNumber(profile.phoneNumber || user?.phone || "+20 123 456 7890");
          setEmail(profile.email || user?.email || "guest@kaweely.com");
          const savedFullAddress = savedAddress?.fullAddress || savedAddress?.street || "";
          setAddress(profile.address || savedFullAddress || "");
          setBirthday(profile.birthday || "");
          setGender(profile.gender);
          setNotifications(profile.notifications !== undefined ? profile.notifications : true);
          setAvatarUri(profile.avatarUri && profile.avatarUri.trim().length > 0 ? profile.avatarUri : undefined);
          console.log("Profile loaded successfully");
        } else {
          console.warn("Invalid profile data, clearing");
          await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      try {
        await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
      } catch (e) {
        console.error("Error clearing profile AsyncStorage:", e);
      }
    }
  };

  const saveProfile = useCallback(async () => {
    try {
      const profile: UserProfile = {
        clientName,
        phoneNumber,
        email,
        address,
        birthday,
        notifications,
        avatarUri: avatarUri && avatarUri.trim().length > 0 ? avatarUri : undefined,
        gender,
      };
      const jsonString = safeJsonStringify(profile);
      if (!jsonString) {
        console.error('Invalid JSON string generated for profile');
        return;
      }
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, jsonString);
      console.log("Profile saved successfully");

      if (address && address.trim().length > 0) {
        await saveDeliveryAddress({
          type: "home",
          street: address,
          building: "",
          floor: "",
          apartment: "",
          landmark: "",
          contactName: clientName,
          contactPhone: phoneNumber,
          fullAddress: address,
        });
        console.log("Delivery address synced");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  }, [clientName, phoneNumber, email, address, birthday, notifications, avatarUri, gender, saveDeliveryAddress]);

  const handleSaveProfile = () => {
    setIsEditMode(false);
    saveProfile();
  };

  const handleNotificationsToggle = async (value: boolean) => {
    setNotifications(value);
  };

  useEffect(() => {
    saveProfile();
  }, [notifications, saveProfile]);

  const handleDarkModeToggle = async () => {
    await toggleTheme();
    console.log("Dark mode toggled");
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photos to set a profile picture.",
          [{ text: "OK" }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setAvatarUri(uri);
        console.log("Avatar updated:", uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };

  useEffect(() => {
    if (avatarUri) {
      saveProfile();
    }
  }, [avatarUri, saveProfile]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 16,
      paddingBottom: 20,
    },
    profileHeader: {
      alignItems: "center",
      paddingTop: 70,
      paddingBottom: 20,
      marginBottom: 24,
      backgroundColor: colors.cardBackground,
      borderRadius: 24,
      borderWidth: 0,
      borderColor: colors.border,
      position: "relative" as const,
      overflow: "hidden" as const,
      minHeight: 200,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
    gradientBackground: {
      position: "absolute" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 18,
    },
    decorativeCircle1: {
      position: "absolute" as const,
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      top: -60,
      right: -40,
    },
    decorativeCircle2: {
      position: "absolute" as const,
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      bottom: -30,
      left: -30,
    },
    profileLogo: {
      width: 50,
      height: 50,
      position: "absolute" as const,
      top: 16,
      right: 16,
      opacity: 0.3,
      tintColor: "#FFFFFF",
    },
    avatarContainer: {
      position: "relative" as const,
      marginBottom: 12,
      marginTop: -40,
    },
    profileAvatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.cardBackground,
      borderWidth: 3,
      borderColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 4,
    },
    avatarImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      borderWidth: 3,
      borderColor: "#FFFFFF",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 4,
    },
    cameraIconContainer: {
      position: "absolute" as const,
      bottom: 2,
      right: 2,
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.tint,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2.5,
      borderColor: "#FFFFFF",
      shadowColor: colors.tint,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 4,
    },
    profileName: {
      fontSize: 18,
      fontWeight: "800" as const,
      color: colors.text,
      marginBottom: 4,
      maxWidth: "80%" as const,
      textAlign: "center" as const,
      letterSpacing: 0.3,
    },
    profileEmail: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "500" as const,
      maxWidth: "80%" as const,
      textAlign: "center" as const,
      numberOfLines: 1,
      ellipsizeMode: "tail" as const,
    },
    section: {
      marginBottom: 12,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    sectionTitleContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 12,
    },
    sectionIconBg: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: "center",
      justifyContent: "center",
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: "800" as const,
      color: colors.text,
    },
    editButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: colors.tint,
    },
    editButtonActive: {
      backgroundColor: colors.success,
    },
    editButtonText: {
      fontSize: 14,
      fontWeight: "700" as const,
      color: "#FFFFFF",
    },
    card: {
      backgroundColor: colors.cardBackground,
      borderRadius: 14,
      padding: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputGroup: {
      marginBottom: 12,
    },
    label: {
      fontSize: 11,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 6,
    },
    input: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 12,
      fontSize: 13,
      color: colors.text,
      borderWidth: 2,
      borderColor: colors.border,
      fontWeight: "500" as const,
    },
    inputDisabled: {
      backgroundColor: `${colors.cardBackground}80`,
      borderColor: "transparent",
    },
    languageOption: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 14,
      marginBottom: 8,
      borderWidth: 2,
      borderColor: "transparent",
      backgroundColor: colors.background,
    },
    languageOptionActive: {
      backgroundColor: `${colors.tint}15`,
      borderColor: colors.tint,
    },
    languageLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    flagContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    languageFlag: {
      fontSize: 22,
    },
    languageText: {
      fontSize: 13,
      fontWeight: "700" as const,
      color: colors.text,
    },
    languageTextActive: {
      color: colors.tint,
    },
    languageSubtext: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
      fontWeight: "500" as const,
    },
    checkIconContainer: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: `${colors.tint}25`,
      alignItems: "center",
      justifyContent: "center",
    },
    settingItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 14,
    },
    settingItemLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    settingIconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
    },
    settingText: {
      fontSize: 13,
      color: colors.text,
      fontWeight: "600" as const,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 4,
    },
    chevron: {
      fontSize: 28,
      color: colors.textSecondary,
      fontWeight: "300" as const,
    },
    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      backgroundColor: "#EF4444",
      borderRadius: 16,
      padding: 18,
      marginTop: 8,
      shadowColor: "#EF4444",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    logoutButtonText: {
      fontSize: 16,
      fontWeight: "800" as const,
      color: "#FFFFFF",
    },
    footer: {
      alignItems: "center",
      paddingVertical: 16,
      gap: 8,
    },
    footerLogo: {
      width: 50,
      height: 50,
      opacity: 0.7,
    },
    footerText: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: "600" as const,
    },
    emptyState: {
      flex: 1,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      paddingHorizontal: 32,
      paddingVertical: 80,
    },
    emptyIconContainer: {
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: colors.cardBackground,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      marginBottom: 24,
      borderWidth: 2,
      borderColor: colors.border,
      position: "relative" as const,
    },
    emptyStateTitle: {
      fontSize: 20,
      fontWeight: "800" as const,
      color: colors.text,
      marginBottom: 10,
      textAlign: "center" as const,
    },
    emptyStateText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center" as const,
      lineHeight: 20,
      fontWeight: "500" as const,
    },
    birthdayInputContainer: {
      position: "relative" as const,
    },
    birthdayIcon: {
      position: "absolute" as const,
      left: 16,
      top: 18,
      zIndex: 1,
    },
    birthdayInput: {
      paddingLeft: 48,
    },
    inputHint: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 6,
      fontWeight: "500" as const,
    },
    genderContainer: {
      flexDirection: "row" as const,
      gap: 12,
    },
    genderOption: {
      flex: 1,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      gap: 8,
      paddingVertical: 14,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.border,
      backgroundColor: colors.background,
    },
    genderOptionActive: {
      backgroundColor: `${colors.tint}15`,
      borderColor: colors.tint,
    },
    genderOptionText: {
      fontSize: 13,
      fontWeight: "700" as const,
      color: colors.text,
    },
    genderOptionTextActive: {
      color: colors.tint,
    },
    walletBalanceContainer: {
      alignItems: "center",
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      marginBottom: 12,
    },
    walletBalanceLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 10,
      fontWeight: "600" as const,
    },
    walletBalance: {
      fontSize: 28,
      fontWeight: "800" as const,
      color: colors.accent,
    },
    topUpButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: colors.accent,
      borderRadius: 14,
      paddingVertical: 16,
      marginBottom: 12,
      shadowColor: colors.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    topUpButtonText: {
      fontSize: 15,
      fontWeight: "800" as const,
      color: "#FFFFFF",
    },
    transactionsHeader: {
      marginTop: 4,
      marginBottom: 16,
    },
    transactionsTitle: {
      fontSize: 16,
      fontWeight: "700" as const,
      color: colors.text,
    },
    transactionItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    transactionLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      flex: 1,
    },
    transactionIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
    },
    transactionInfo: {
      flex: 1,
      minWidth: 0,
    },
    transactionTitle: {
      fontSize: 13,
      fontWeight: "600" as const,
      color: colors.text,
      flexShrink: 1,
    },
    transactionDate: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 3,
      fontWeight: "500" as const,
      flexShrink: 1,
    },
    transactionAmountPositive: {
      fontSize: 14,
      fontWeight: "800" as const,
      color: colors.success,
      textAlign: "right" as const,
      flexShrink: 0,
    },
    transactionAmountNegative: {
      fontSize: 14,
      fontWeight: "800" as const,
      color: colors.error,
      textAlign: "right" as const,
      flexShrink: 0,
    },
    menuCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 18,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 4,
      borderWidth: 0,
      borderColor: colors.border,
      overflow: "hidden" as const,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
    },
    menuItemLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    menuIconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    menuItemContent: {
      flex: 1,
    },
    menuItemTitle: {
      fontSize: 15,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 3,
      letterSpacing: 0.2,
    },
    menuItemSubtitle: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: "500" as const,
      letterSpacing: 0.1,
    },
    colorSchemeOption: {
      alignItems: "center" as const,
      justifyContent: "center" as const,
      marginBottom: 16,
      padding: 18,
      borderRadius: 16,
      borderWidth: 3,
      borderColor: "transparent",
      backgroundColor: colors.cardBackground,
    },
    colorSchemeOptionActive: {
      borderColor: colors.tint,
      backgroundColor: `${colors.tint}10`,
    },
    colorSchemeGradient: {
      width: "100%" as const,
      height: 80,
      borderRadius: 12,
      marginBottom: 12,
      overflow: "hidden" as const,
    },
    colorSchemeInfo: {
      alignItems: "center" as const,
      gap: 6,
    },
    colorSchemeEmoji: {
      fontSize: 32,
      marginBottom: 4,
    },
    colorSchemeName: {
      fontSize: 15,
      fontWeight: "700" as const,
      color: colors.text,
    },
    colorSchemeCheck: {
      position: "absolute" as const,
      top: 12,
      right: 12,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.tint,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      shadowColor: colors.tint,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 4,
    },
    qrCodeButton: {
      marginTop: 16,
      borderRadius: 20,
      overflow: "hidden" as const,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
      width: "100%" as const,
      maxWidth: 340,
    },
    qrCodeGradient: {
      flexDirection: "row" as const,
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 20,
      gap: 14,
    },
    qrCodeIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      alignItems: "center",
      justifyContent: "center",
    },
    qrCodeTextContainer: {
      flex: 1,
    },
    qrCodeTitle: {
      fontSize: 16,
      fontWeight: "800" as const,
      color: "#FFFFFF",
      marginBottom: 3,
      letterSpacing: 0.3,
    },
    qrCodeSubtitle: {
      fontSize: 12,
      color: "rgba(255, 255, 255, 0.85)",
      fontWeight: "600" as const,
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: t.profile.title }} />

      {!isAppActive ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            {logoUrl && logoUrl.trim().length > 0 && logoUrl.startsWith('http') && (
              <Image
                source={{ uri: logoUrl }}
                style={styles.footerLogo}
                resizeMode="contain"
                onError={(error) => console.log('[Profile] Logo error:', error.nativeEvent?.error || 'Unknown error')}
              />
            )}
            <User size={64} color={colors.textSecondary} strokeWidth={1.5} />
          </View>
          <Text style={styles.emptyStateTitle}>Kaweely is OFF</Text>
          <Text style={styles.emptyStateText}>
            Turn on Kaweely from the home screen to access your profile and settings.
          </Text>
        </View>
      ) : (
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.profileHeader}>
            <LinearGradient
              colors={isDark 
                ? ['#1a1a2e', '#16213e', '#0f3460', '#533483'] 
                : ['#667eea', '#764ba2', '#f093fb', '#4facfe']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBackground}
            >
              {logoUrl && logoUrl.trim().length > 0 && logoUrl.startsWith('http') && (
                <Image
                  source={{ uri: logoUrl }}
                  style={styles.profileLogo}
                  resizeMode="contain"
                  onError={(error) => console.log('[Profile] Logo error:', error.nativeEvent?.error || 'Unknown error')}
                />
              )}
              <View style={styles.decorativeCircle1} />
              <View style={styles.decorativeCircle2} />
            </LinearGradient>

            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={pickImage}
              activeOpacity={0.9}
            >
              {avatarUri && avatarUri.trim().length > 0 && (avatarUri.startsWith('http') || avatarUri.startsWith('file:')) ? (
                <Image
                  source={{ uri: avatarUri }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                  onError={(error) => {
                    console.log('[Profile] Avatar error:', error.nativeEvent?.error || 'Unknown error');
                    setAvatarUri(undefined);
                  }}
                />
              ) : (
                <View style={styles.profileAvatar}>
                  <User size={42} color={colors.tint} strokeWidth={2.5} />
                </View>
              )}
              <View style={styles.cameraIconContainer}>
                <Camera size={16} color="#FFFFFF" strokeWidth={2.5} />
              </View>
            </TouchableOpacity>

            <Text style={styles.profileName} numberOfLines={1} ellipsizeMode="tail">{clientName}</Text>
            <Text style={styles.profileEmail} numberOfLines={1} ellipsizeMode="tail">{email}</Text>
            
            <TouchableOpacity
              style={styles.qrCodeButton}
              onPress={() => setShowQRCodeModal(true)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={isDark ? ['#8B5CF6', '#7C3AED'] : ['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.qrCodeGradient}
              >
                <View style={styles.qrCodeIconContainer}>
                  <QrCode size={24} color="#FFFFFF" strokeWidth={2.5} />
                </View>
                <View style={styles.qrCodeTextContainer}>
                  <Text style={styles.qrCodeTitle}>My Kaweely ID</Text>
                  <Text style={styles.qrCodeSubtitle}>Quick scan for instant service</Text>
                </View>
                <ChevronRight size={20} color="rgba(255, 255, 255, 0.8)" strokeWidth={2.5} />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setShowClientInfoPanel(true)}
              activeOpacity={0.8}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconContainer, { backgroundColor: `${colors.tint}15` }]}>
                  <User size={24} color={colors.tint} strokeWidth={2.5} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>Personal Information</Text>
                  <Text style={styles.menuItemSubtitle}>Manage your personal details</Text>
                </View>
              </View>
              <ChevronRight size={22} color={colors.textSecondary} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setShowWalletPanel(true)}
              activeOpacity={0.8}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconContainer, { backgroundColor: `${colors.accent}15` }]}>
                  <Wallet size={24} color={colors.accent} strokeWidth={2.5} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>{t.profile.wallet}</Text>
                  <Text style={styles.menuItemSubtitle}>Balance: {format(balance, currentCurrency)}</Text>
                </View>
              </View>
              <ChevronRight size={22} color={colors.textSecondary} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setShowGiftCardModal(true)}
              activeOpacity={0.8}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconContainer, { backgroundColor: `${colors.success}15` }]}>
                  <Gift size={24} color={colors.success} strokeWidth={2.5} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>Gift Card</Text>
                  <Text style={styles.menuItemSubtitle}>Send gifts to your loved ones</Text>
                </View>
              </View>
              <ChevronRight size={22} color={colors.textSecondary} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setShowThemePanel(true)}
              activeOpacity={0.8}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconContainer, { backgroundColor: `${colors.tint}15` }]}>
                  <Palette size={24} color={colors.tint} strokeWidth={2.5} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>Appearance</Text>
                  <Text style={styles.menuItemSubtitle}>{isDark ? 'Dark Mode' : 'Light Mode'}</Text>
                </View>
              </View>
              <ChevronRight size={22} color={colors.textSecondary} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setShowLanguagePanel(true)}
              activeOpacity={0.8}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconContainer, { backgroundColor: `${colors.tint}15` }]}>
                  <Globe size={24} color={colors.tint} strokeWidth={2.5} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>{t.profile.language}</Text>
                  <Text style={styles.menuItemSubtitle}>{supportedLanguages.find(l => l.code === currentLanguage)?.nativeName}</Text>
                </View>
              </View>
              <ChevronRight size={22} color={colors.textSecondary} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setShowCurrencyPanel(true)}
              activeOpacity={0.8}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconContainer, { backgroundColor: `${colors.success}15` }]}>
                  <Wallet size={24} color={colors.success} strokeWidth={2.5} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>Currency</Text>
                  <Text style={styles.menuItemSubtitle}>{currencies.find(c => c.code === currentCurrency)?.name || currentCurrency}</Text>
                </View>
              </View>
              <ChevronRight size={22} color={colors.textSecondary} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setShowSettingsPanel(true)}
              activeOpacity={0.8}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconContainer, { backgroundColor: `${colors.accent}15` }]}>
                  <Settings size={24} color={colors.accent} strokeWidth={2.5} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>{t.profile.settings}</Text>
                  <Text style={styles.menuItemSubtitle}>App preferences and privacy</Text>
                </View>
              </View>
              <ChevronRight size={22} color={colors.textSecondary} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/admin-dashboard')}
              activeOpacity={0.8}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconContainer, { backgroundColor: `${colors.warning}15` }]}>
                  <Users size={24} color={colors.warning} strokeWidth={2.5} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>Admin Panel</Text>
                  <Text style={styles.menuItemSubtitle}>Manage orders, drivers & analytics</Text>
                </View>
              </View>
              <ChevronRight size={22} color={colors.textSecondary} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.logoutButton} 
            activeOpacity={0.8}
            onPress={async () => {
              await logout();
              router.replace("/auth");
            }}
          >
            <LogOut size={22} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.logoutButtonText}>{t.profile.logout}</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            {logoUrl && logoUrl.trim().length > 0 && logoUrl.startsWith('http') && (
              <Image
                source={{ uri: logoUrl }}
                style={styles.footerLogo}
                resizeMode="contain"
                onError={(error) => console.log('[Profile] Footer logo error:', error.nativeEvent?.error || 'Unknown error')}
              />
            )}
            <Text style={styles.footerText}>Kaweely v1.0.0</Text>
          </View>
        </View>
      </ScrollView>
      )}

      <SlidingPanel
        visible={showClientInfoPanel}
        onClose={() => setShowClientInfoPanel(false)}
        title="Personal Information"
      >
        <View style={styles.sectionHeader}>
          <TouchableOpacity
            onPress={() => isEditMode ? handleSaveProfile() : setIsEditMode(true)}
            style={[styles.editButton, isEditMode && styles.editButtonActive]}
            activeOpacity={0.8}
          >
            {isEditMode ? (
              <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
            ) : (
              <Edit3 size={18} color="#FFFFFF" strokeWidth={2.5} />
            )}
            <Text style={styles.editButtonText}>
              {isEditMode ? t.profile.save : t.profile.edit}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, !isEditMode && styles.inputDisabled]}
              value={clientName}
              onChangeText={setClientName}
              editable={isEditMode}
              placeholder="Enter your full name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[styles.genderOption, gender === 'male' && styles.genderOptionActive]}
                onPress={() => isEditMode && setGender('male')}
                activeOpacity={0.8}
                disabled={!isEditMode}
              >
                <Users size={18} color={gender === 'male' ? colors.tint : colors.text} strokeWidth={2.5} />
                <Text style={[styles.genderOptionText, gender === 'male' && styles.genderOptionTextActive]}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderOption, gender === 'female' && styles.genderOptionActive]}
                onPress={() => isEditMode && setGender('female')}
                activeOpacity={0.8}
                disabled={!isEditMode}
              >
                <Users size={18} color={gender === 'female' ? colors.tint : colors.text} strokeWidth={2.5} />
                <Text style={[styles.genderOptionText, gender === 'female' && styles.genderOptionTextActive]}>Female</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Birthday</Text>
            <View style={styles.birthdayInputContainer}>
              <Calendar size={20} color={colors.textSecondary} style={styles.birthdayIcon} />
              <TextInput
                style={[styles.input, styles.birthdayInput, !isEditMode && styles.inputDisabled]}
                value={birthday}
                onChangeText={setBirthday}
                editable={isEditMode}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={colors.tabIconDefault}
              />
            </View>
            <Text style={styles.inputHint}>Special offers on your birthday</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[styles.input, !isEditMode && styles.inputDisabled]}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              editable={isEditMode}
              placeholder="Enter your phone number"
              placeholderTextColor={colors.tabIconDefault}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={[styles.input, !isEditMode && styles.inputDisabled]}
              value={email}
              onChangeText={setEmail}
              editable={isEditMode}
              placeholder="Enter your email"
              placeholderTextColor={colors.tabIconDefault}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Delivery Address</Text>
            <TextInput
              style={[styles.input, !isEditMode && styles.inputDisabled]}
              value={address}
              onChangeText={setAddress}
              editable={isEditMode}
              placeholder="Enter your delivery address"
              placeholderTextColor={colors.tabIconDefault}
              multiline
            />
          </View>
        </View>
      </SlidingPanel>

      <SlidingPanel
        visible={showWalletPanel}
        onClose={() => setShowWalletPanel(false)}
        title={t.profile.wallet}
      >
        <View style={styles.card}>
          <View style={styles.walletBalanceContainer}>
            <Text style={styles.walletBalanceLabel}>{t.profile.currentBalance}</Text>
            <Text style={styles.walletBalance}>{format(balance, currentCurrency)}</Text>
          </View>

          <TouchableOpacity 
            style={styles.topUpButton} 
            activeOpacity={0.8}
            onPress={() => {
              setShowWalletPanel(false);
              setTimeout(() => setShowAddMoneyModal(true), 300);
            }}
          >
            <Plus size={22} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.topUpButtonText}>Top Up</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.transactionsHeader}>
            <Text style={styles.transactionsTitle}>{t.profile.recentTransactions}</Text>
          </View>

          {transactions.slice(0, 5).map((transaction) => {
            const isPositive = transaction.amount > 0;
            const formatDate = (date: Date) => {
              const now = new Date();
              const diffMs = now.getTime() - date.getTime();
              const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
              
              if (diffDays === 0) {
                return `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
              } else if (diffDays === 1) {
                return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
              } else if (diffDays < 7) {
                return `${diffDays} days ago`;
              } else {
                return date.toLocaleDateString();
              }
            };

            return (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <View style={[styles.transactionIcon, { backgroundColor: isPositive ? `${colors.success}25` : `${colors.error}25` }]}>
                    {isPositive ? (
                      <Plus size={18} color={colors.success} strokeWidth={2.5} />
                    ) : (
                      <ArrowUpRight size={18} color={colors.error} strokeWidth={2.5} />
                    )}
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionTitle} numberOfLines={1}>{transaction.description}</Text>
                    <Text style={styles.transactionDate} numberOfLines={1}>{formatDate(transaction.date)}</Text>
                  </View>
                </View>
                <Text style={isPositive ? styles.transactionAmountPositive : styles.transactionAmountNegative}>
                  {isPositive ? '+' : ''}{format(Math.abs(transaction.amount), currentCurrency)}
                </Text>
              </View>
            );
          })}
        </View>
      </SlidingPanel>

      <SlidingPanel
        visible={showLanguagePanel}
        onClose={() => setShowLanguagePanel(false)}
        title={t.profile.language}
      >
        <View style={styles.card}>
          {supportedLanguages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageOption,
                currentLanguage === lang.code && styles.languageOptionActive,
              ]}
              onPress={() => changeLanguage(lang.code as LanguageCode)}
              activeOpacity={0.8}
            >
              <View style={styles.languageLeft}>
                <View style={styles.flagContainer}>
                  <Text style={styles.languageFlag}>{lang.flag}</Text>
                </View>
                <View>
                  <Text
                    style={[
                      styles.languageText,
                      currentLanguage === lang.code && styles.languageTextActive,
                    ]}
                  >
                    {lang.nativeName}
                  </Text>
                  <Text style={styles.languageSubtext}>{lang.name}</Text>
                </View>
              </View>
              {currentLanguage === lang.code && (
                <View style={styles.checkIconContainer}>
                  <Check size={20} color={colors.tint} strokeWidth={3} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </SlidingPanel>

      <SlidingPanel
        visible={showSettingsPanel}
        onClose={() => setShowSettingsPanel(false)}
        title={t.profile.settings}
      >
        <View style={styles.card}>
          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <View style={styles.settingIconContainer}>
                <Bell size={22} color={colors.text} strokeWidth={2.5} />
              </View>
              <Text style={styles.settingText}>{t.profile.notifications}</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={handleNotificationsToggle}
              trackColor={{ false: colors.border, true: colors.tint }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <View style={styles.settingIconContainer}>
                <Moon size={22} color={colors.text} strokeWidth={2.5} />
              </View>
              <Text style={styles.settingText}>{t.profile.darkMode}</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={handleDarkModeToggle}
              trackColor={{ false: colors.border, true: colors.tint }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.settingItem} activeOpacity={0.8}>
            <View style={styles.settingItemLeft}>
              <View style={styles.settingIconContainer}>
                <Shield size={22} color={colors.text} strokeWidth={2.5} />
              </View>
              <Text style={styles.settingText}>{t.profile.privacyPolicy}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.settingItem} 
            activeOpacity={0.8}
            onPress={async () => {
              Alert.alert(
                "Clear Corrupted Data",
                "Scan and remove corrupted AsyncStorage entries?",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Scan & Clear",
                    onPress: async () => {
                      const count = await clearCorruptedStorage();
                      Alert.alert(
                        "Scan Complete",
                        `Found and cleared ${count} corrupted ${count === 1 ? 'entry' : 'entries'}.`
                      );
                    },
                  },
                ]
              );
            }}
          >
            <View style={styles.settingItemLeft}>
              <View style={styles.settingIconContainer}>
                <AlertTriangle size={22} color={colors.error} strokeWidth={2.5} />
              </View>
              <Text style={styles.settingText}>Fix Storage Errors</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.settingItem} activeOpacity={0.8}>
            <View style={styles.settingItemLeft}>
              <View style={styles.settingIconContainer}>
                <Settings size={22} color={colors.text} strokeWidth={2.5} />
              </View>
              <Text style={styles.settingText}>{t.profile.termsOfService}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>
      </SlidingPanel>

      <AddMoneyModal
        visible={showAddMoneyModal}
        onClose={() => setShowAddMoneyModal(false)}
      />

      <SendGiftCardModal
        visible={showGiftCardModal}
        onClose={() => setShowGiftCardModal(false)}
      />

      <SlidingPanel
        visible={showThemePanel}
        onClose={() => setShowThemePanel(false)}
        title="Appearance"
      >
        <View style={styles.card}>
          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <View style={styles.settingIconContainer}>
                <Moon size={22} color={colors.text} strokeWidth={2.5} />
              </View>
              <Text style={styles.settingText}>{t.profile.darkMode}</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={handleDarkModeToggle}
              trackColor={{ false: colors.border, true: colors.tint }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </SlidingPanel>

      <SlidingPanel
        visible={showCurrencyPanel}
        onClose={() => setShowCurrencyPanel(false)}
        title="Currency"
      >
        <View style={styles.card}>
          {currencies.map((currency) => (
            <TouchableOpacity
              key={currency.code}
              style={[
                styles.languageOption,
                currentCurrency === currency.code && styles.languageOptionActive,
              ]}
              onPress={() => changeCurrency(currency.code)}
              activeOpacity={0.8}
            >
              <View style={styles.languageLeft}>
                <View style={styles.flagContainer}>
                  <Text style={styles.languageFlag}>{currency.flag}</Text>
                </View>
                <View>
                  <Text
                    style={[
                      styles.languageText,
                      currentCurrency === currency.code && styles.languageTextActive,
                    ]}
                  >
                    {currency.name}
                  </Text>
                  <Text style={styles.languageSubtext}>{currency.symbol} - {currency.code}</Text>
                </View>
              </View>
              {currentCurrency === currency.code && (
                <View style={styles.checkIconContainer}>
                  <Check size={20} color={colors.tint} strokeWidth={3} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </SlidingPanel>

      <UserQRCode
        visible={showQRCodeModal}
        onClose={() => setShowQRCodeModal(false)}
      />
    </View>
  );
}
