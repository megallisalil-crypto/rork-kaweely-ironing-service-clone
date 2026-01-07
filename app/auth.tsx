import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Image, Alert } from "react-native";
import { useState, useRef } from "react";
import { Stack, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Mail, Lock, User, Phone, UserPlus, LogIn, Users, Truck, Fingerprint, CheckSquare, Square } from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function AuthScreen() {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToPolicies, setAgreedToPolicies] = useState(false);
  const { login, register, loginAsGuest, isBiometricAvailable, isBiometricEnabled, enableBiometric, authenticateWithBiometric } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  const logoUrl = "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/8nlam6zuq1umfi1sxbk5q";
  
  const logoTapCount = useRef(0);
  const logoTapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoTap = () => {
    logoTapCount.current += 1;
    
    if (logoTapTimeout.current) {
      clearTimeout(logoTapTimeout.current);
    }
    
    if (logoTapCount.current === 7) {
      Alert.alert(
        "Admin Access",
        "Enter admin credentials to continue",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {
              logoTapCount.current = 0;
            }
          },
          {
            text: "Continue",
            onPress: async () => {
              logoTapCount.current = 0;
              setShowAuthForm(true);
              setIsLogin(true);
            }
          }
        ]
      );
      logoTapCount.current = 0;
      return;
    }
    
    logoTapTimeout.current = setTimeout(() => {
      logoTapCount.current = 0;
    }, 2000);
  };

  const handleBiometricLogin = async () => {
    const result = await authenticateWithBiometric();
    if (result.success && result.emailOrPhone && result.password) {
      await login(result.emailOrPhone, result.password, 'admin');
      router.replace("/admin-dashboard");
    } else {
      Alert.alert("Error", "Biometric authentication failed");
    }
  };

  const handleSubmit = async () => {
    if (isLogin) {
      if (emailOrPhone && password) {
        if (emailOrPhone === 'admin' || emailOrPhone.includes('admin')) {
          await login(emailOrPhone, password, 'admin');
          
          if (isBiometricAvailable && !isBiometricEnabled) {
            Alert.alert(
              "Enable Face ID?",
              "Would you like to use Face ID for quick admin login?",
              [
                { text: "Not Now", style: "cancel" },
                {
                  text: "Enable",
                  onPress: async () => {
                    await enableBiometric(emailOrPhone, password);
                  }
                }
              ]
            );
          }
          
          router.replace("/admin-dashboard");
        } else {
          await login(emailOrPhone, password, 'customer');
          router.replace("/(tabs)");
        }
      }
    } else {
      if (!name) {
        Alert.alert("Error", "Please enter your full name");
        return;
      }
      if (!password) {
        Alert.alert("Error", "Please enter a password");
        return;
      }
      if (!emailOrPhone && !phone) {
        Alert.alert("Error", "Please provide either email or phone number");
        return;
      }
      if (!agreedToPolicies) {
        Alert.alert("Agreement Required", "Please read and agree to our service policies to continue");
        return;
      }
      
      await register(name, emailOrPhone, phone, password, 'customer');
      router.replace("/(tabs)");
    }
  };

  const handleGuestLogin = async () => {
    await loginAsGuest();
    router.replace("/(tabs)");
  };

  const handleDriverLogin = () => {
    router.push("/driver-auth");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    keyboardView: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    gradientHeader: {
      height: 320,
      justifyContent: "center",
      alignItems: "center",
      position: "relative" as const,
      overflow: "hidden" as const,
    },
    decorativeCircle: {
      position: "absolute" as const,
      width: 250,
      height: 250,
      borderRadius: 125,
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      top: -80,
      right: -60,
    },
    decorativeCircle2: {
      position: "absolute" as const,
      width: 180,
      height: 180,
      borderRadius: 90,
      backgroundColor: "rgba(255, 255, 255, 0.06)",
      bottom: -40,
      left: -50,
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 16,
    },
    logo: {
      width: 110,
      height: 110,
      marginBottom: 20,
    },
    headerTitle: {
      fontSize: 36,
      fontWeight: "800" as const,
      color: "#FFFFFF",
      marginBottom: 8,
      letterSpacing: 0.5,
    },
    headerSubtitle: {
      fontSize: 16,
      color: "rgba(255, 255, 255, 0.95)",
      fontWeight: "500" as const,
    },
    content: {
      flex: 1,
      padding: 24,
      marginTop: -50,
    },
    welcomeContainer: {
      alignItems: "center",
      paddingVertical: 48,
    },
    welcomeTitle: {
      fontSize: 28,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    welcomeSubtitle: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: 40,
      paddingHorizontal: 32,
      lineHeight: 22,
    },
    primaryButton: {
      backgroundColor: colors.tint,
      borderRadius: 16,
      paddingVertical: 18,
      paddingHorizontal: 48,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      marginBottom: 16,
      shadowColor: colors.tint,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 8,
      minWidth: 280,
    },
    primaryButtonText: {
      fontSize: 17,
      fontWeight: "800" as const,
      color: "#FFFFFF",
    },
    secondaryButton: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      paddingVertical: 18,
      paddingHorizontal: 48,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      borderWidth: 2,
      borderColor: colors.border,
      minWidth: 280,
    },
    secondaryButtonText: {
      fontSize: 17,
      fontWeight: "700" as const,
      color: colors.text,
    },
    linkButton: {
      marginTop: 24,
      paddingVertical: 12,
    },
    linkButtonText: {
      fontSize: 15,
      color: colors.tint,
      fontWeight: "600" as const,
    },
    policyContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginTop: 16,
      marginBottom: 8,
    },
    checkbox: {
      marginRight: 12,
      marginTop: 2,
    },
    policyText: {
      flex: 1,
      fontSize: 13,
      lineHeight: 20,
      color: colors.text,
    },
    policyLink: {
      color: colors.tint,
      fontWeight: "700" as const,
      textDecorationLine: "underline" as const,
    },
    card: {
      backgroundColor: colors.cardBackground,
      borderRadius: 24,
      padding: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    backButton: {
      marginBottom: 16,
      alignSelf: "flex-start" as const,
    },
    backButtonText: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: "600" as const,
    },
    tabsContainer: {
      flexDirection: "row",
      backgroundColor: colors.background,
      borderRadius: 14,
      padding: 4,
      marginBottom: 24,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: "center",
    },
    tabActive: {
      backgroundColor: colors.tint,
    },
    tabText: {
      fontSize: 13,
      fontWeight: "700" as const,
      color: colors.textSecondary,
    },
    tabTextActive: {
      color: "#FFFFFF",
    },
    inputGroup: {
      marginBottom: 16,
    },
    inputLabel: {
      fontSize: 12,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 8,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.border,
      paddingHorizontal: 14,
    },
    inputIcon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      paddingVertical: 14,
      fontSize: 13,
      color: colors.text,
      fontWeight: "500" as const,
    },
    submitButton: {
      backgroundColor: colors.tint,
      borderRadius: 14,
      paddingVertical: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      marginTop: 8,
      shadowColor: colors.tint,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    submitButtonText: {
      fontSize: 15,
      fontWeight: "800" as const,
      color: "#FFFFFF",
    },
    footer: {
      alignItems: "center",
      paddingVertical: 24,
    },
    footerText: {
      fontSize: 11,
      color: colors.textSecondary,
      fontWeight: "500" as const,
    },
    biometricButton: {
      backgroundColor: colors.cardBackground,
      borderRadius: 14,
      paddingVertical: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      marginTop: 12,
      borderWidth: 2,
      borderColor: colors.tint,
    },
    biometricButtonText: {
      fontSize: 15,
      fontWeight: "700" as const,
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <LinearGradient
            colors={['#667eea', '#764ba2', '#f093fb']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientHeader}
          >
            <View style={styles.decorativeCircle} />
            <View style={styles.decorativeCircle2} />
            
            <TouchableOpacity 
              style={styles.logoContainer} 
              activeOpacity={1}
              onPress={handleLogoTap}
            >
              {logoUrl && logoUrl.trim().length > 0 && logoUrl.startsWith('http') ? (
                <Image
                  source={{ uri: logoUrl }}
                  style={styles.logo}
                  resizeMode="contain"
                  onError={(error) => {
                    console.log('[Auth] Logo error:', error.nativeEvent?.error || 'Unknown error');
                  }}
                />
              ) : (
                <View style={[styles.logo, { backgroundColor: colors.tint, borderRadius: 55, alignItems: 'center', justifyContent: 'center' }]}>
                  <Text style={{ fontSize: 48, fontWeight: '800', color: '#FFFFFF' }}>K</Text>
                </View>
              )}
              <Text style={styles.headerTitle}>Kaweely</Text>
              <Text style={styles.headerSubtitle}>Premium Ironing at Your Doorstep</Text>
            </TouchableOpacity>
          </LinearGradient>

          <View style={styles.content}>
            {!showAuthForm ? (
              <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeTitle}>Get Started</Text>
                <Text style={styles.welcomeSubtitle}>
                  Experience hassle-free ironing service. Book, track, and manage your orders with ease.
                </Text>
                
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleGuestLogin}
                  activeOpacity={0.8}
                >
                  <Users size={24} color="#FFFFFF" strokeWidth={2.5} />
                  <Text style={styles.primaryButtonText}>Continue as Guest</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.secondaryButton, { marginTop: 12 }]}
                  onPress={handleDriverLogin}
                  activeOpacity={0.8}
                >
                  <Truck size={22} color={colors.text} strokeWidth={2.5} />
                  <Text style={styles.secondaryButtonText}>Continue as Driver</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => {
                    setShowAuthForm(true);
                    setIsLogin(true);
                  }}
                  activeOpacity={0.8}
                >
                  <LogIn size={22} color={colors.text} strokeWidth={2.5} />
                  <Text style={styles.secondaryButtonText}>Sign In</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => {
                    setShowAuthForm(true);
                    setIsLogin(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.linkButtonText}>Don&apos;t have an account? Sign Up</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.card}>
                <TouchableOpacity
                  onPress={() => setShowAuthForm(false)}
                  style={styles.backButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>

                <View style={styles.tabsContainer}>
                  <TouchableOpacity
                    style={[styles.tab, isLogin && styles.tabActive]}
                    onPress={() => setIsLogin(true)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>
                      Sign In
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.tab, !isLogin && styles.tabActive]}
                    onPress={() => setIsLogin(false)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>

                {!isLogin && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <View style={styles.inputContainer}>
                      <User size={20} color={colors.textSecondary} style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your full name"
                        placeholderTextColor={colors.textSecondary}
                      />
                    </View>
                  </View>
                )}

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{isLogin ? "Email or Phone" : "Email"}</Text>
                  <View style={styles.inputContainer}>
                    <Mail size={20} color={colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={emailOrPhone}
                      onChangeText={setEmailOrPhone}
                      placeholder={isLogin ? "Enter your email or phone" : "Enter your email"}
                      placeholderTextColor={colors.textSecondary}
                      keyboardType={isLogin ? "default" : "email-address"}
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                {!isLogin && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Phone Number (optional)</Text>
                    <View style={styles.inputContainer}>
                      <Phone size={20} color={colors.textSecondary} style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="+20 123 456 7890"
                        placeholderTextColor={colors.textSecondary}
                        keyboardType="phone-pad"
                      />
                    </View>
                  </View>
                )}

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={styles.inputContainer}>
                    <Lock size={20} color={colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter your password"
                      placeholderTextColor={colors.textSecondary}
                      secureTextEntry
                    />
                  </View>
                </View>

                {!isLogin && (
                  <TouchableOpacity
                    style={styles.policyContainer}
                    onPress={() => setAgreedToPolicies(!agreedToPolicies)}
                    activeOpacity={0.8}
                  >
                    {agreedToPolicies ? (
                      <CheckSquare size={22} color={colors.tint} strokeWidth={2.5} style={styles.checkbox} />
                    ) : (
                      <Square size={22} color={colors.textSecondary} strokeWidth={2.5} style={styles.checkbox} />
                    )}
                    <Text style={styles.policyText}>
                      I have read and agree to the{" "}
                      <Text
                        style={styles.policyLink}
                        onPress={(e) => {
                          e.stopPropagation();
                          router.push("/policies");
                        }}
                      >
                        Kaweely Service Policies
                      </Text>
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                  activeOpacity={0.8}
                >
                  {isLogin ? (
                    <LogIn size={20} color="#FFFFFF" strokeWidth={2.5} />
                  ) : (
                    <UserPlus size={20} color="#FFFFFF" strokeWidth={2.5} />
                  )}
                  <Text style={styles.submitButtonText}>
                    {isLogin ? "Sign In" : "Create Account"}
                  </Text>
                </TouchableOpacity>

                {isLogin && isBiometricEnabled && (
                  <TouchableOpacity
                    style={styles.biometricButton}
                    onPress={handleBiometricLogin}
                    activeOpacity={0.8}
                  >
                    <Fingerprint size={20} color={colors.tint} strokeWidth={2.5} />
                    <Text style={[styles.biometricButtonText, { color: colors.tint }]}>
                      Use Face ID
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => setIsLogin(!isLogin)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.linkButtonText, { textAlign: 'center' }]}>
                    {isLogin ? "Don&apos;t have an account? Sign Up" : "Already have an account? Sign In"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.footer}>
              <Text style={styles.footerText}>© 2024 Kaweely. All rights reserved.</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
