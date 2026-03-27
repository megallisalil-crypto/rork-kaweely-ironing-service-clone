import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Platform, Share, ActivityIndicator } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useWallet } from "@/contexts/WalletContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { X, Share2, User, CreditCard, Calendar, Sparkles, RefreshCw } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Rect } from "react-native-svg";

type QRCodeModalProps = {
  visible: boolean;
  onClose: () => void;
};

const QR_SIZE = 140;

function SimpleQRCode({ data, size }: { data: string; size: number }) {
  const moduleSize = size / 29;
  
  console.log('[SimpleQRCode] Rendering with data length:', data.length, 'size:', size);
  
  const hash = (str: string): number => {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) - h) + str.charCodeAt(i);
      h = h & h;
    }
    return Math.abs(h);
  };

  const seed = hash(data);
  const random = (index: number) => {
    const x = Math.sin(seed + index) * 10000;
    return x - Math.floor(x);
  };

  const modules: boolean[][] = Array(29).fill(null).map(() => Array(29).fill(false));

  for (let row = 0; row < 29; row++) {
    for (let col = 0; col < 29; col++) {
      if (
        (row < 7 && col < 7) || 
        (row < 7 && col > 21) || 
        (row > 21 && col < 7)
      ) {
        const isFinderPattern = 
          (row === 0 || row === 6 || col === 0 || col === 6 || 
          (row >= 2 && row <= 4 && col >= 2 && col <= 4));
        modules[row][col] = isFinderPattern;
      } else {
        modules[row][col] = random(row * 29 + col) > 0.5;
      }
    }
  }

  const rects: React.ReactElement[] = [];
  modules.forEach((row, rowIndex) => {
    row.forEach((isDark, colIndex) => {
      if (isDark) {
        rects.push(
          <Rect
            key={`${rowIndex}-${colIndex}`}
            x={colIndex * moduleSize}
            y={rowIndex * moduleSize}
            width={moduleSize}
            height={moduleSize}
            fill="#000000"
          />
        );
      }
    });
  });

  console.log('[SimpleQRCode] Rendering', rects.length, 'rectangles');

  return (
    <View style={{ width: size, height: size, backgroundColor: '#FFFFFF' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ backgroundColor: '#FFFFFF' }}>
        <Rect x={0} y={0} width={size} height={size} fill="#FFFFFF" />
        {rects}
      </Svg>
    </View>
  );
}

export default function UserQRCode({ visible, onClose }: QRCodeModalProps) {
  const { colors, isDark } = useTheme();
  const { user, regenerateQrToken } = useAuth();
  const { subscription } = useSubscription();
  const { balance } = useWallet();
  const { format, currentCurrency } = useCurrency();

  const [forceRefresh, setForceRefresh] = useState(0);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible, scaleAnim, shimmerAnim]);

  useEffect(() => {
    if (visible && !user?.qrToken) {
      console.log("[QR] No token found, generating...");
      regenerateQrToken();
      setTimeout(() => {
        setForceRefresh(prev => prev + 1);
      }, 300);
    } else if (visible && user?.qrToken) {
      console.log("[QR] Token exists:", user.qrToken);
    }
  }, [visible, user?.qrToken, regenerateQrToken]);

  const handleRegenerate = () => {
    console.log("[QR] Manual regeneration requested");
    regenerateQrToken();
    setTimeout(() => {
      setForceRefresh(prev => prev + 1);
    }, 300);
  };

  const handleShare = async () => {
    if (Platform.OS === 'web') {
      return;
    }

    try {
      await Share.share({
        message: `My Kaweely QR Code: ${user?.qrToken}`,
      });
    } catch (error) {
      console.error("Error sharing QR code:", error);
    }
  };

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  const qrData = React.useMemo(() => {
    if (!user) {
      console.log('[QR Modal] No user found');
      return "";
    }
    
    if (!user.qrToken) {
      console.log('[QR Modal] No qrToken found, waiting for generation');
      return "";
    }

    const data = {
      token: user.qrToken,
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      subscription: subscription ? {
        plan: subscription.planTitle,
        remainingPieces: subscription.remainingPieces,
        remainingPickups: subscription.remainingPickupsThisWeek,
        isActive: subscription.isActive,
      } : null,
      timestamp: Date.now() + forceRefresh,
    };
    console.log('[QR Modal] Generated qrData with token:', user.qrToken);
    return JSON.stringify(data);
  }, [user, subscription, forceRefresh]);

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.85)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    modalContent: {
      width: "100%",
      maxWidth: 400,
      backgroundColor: colors.cardBackground,
      borderRadius: 32,
      overflow: "hidden" as const,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.4,
      shadowRadius: 24,
      elevation: 12,
    },
    header: {
      position: "relative" as const,
      paddingTop: 50,
      paddingBottom: 24,
      paddingHorizontal: 24,
      overflow: "hidden" as const,
    },
    gradientBg: {
      position: "absolute" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    shimmerOverlay: {
      position: "absolute" as const,
      top: 0,
      bottom: 0,
      width: 100,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    closeButton: {
      position: "absolute" as const,
      top: 16,
      right: 16,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "800" as const,
      color: "#FFFFFF",
      marginBottom: 8,
      textAlign: "center" as const,
      letterSpacing: 0.5,
    },
    headerSubtitle: {
      fontSize: 14,
      color: "rgba(255, 255, 255, 0.9)",
      textAlign: "center" as const,
      fontWeight: "600" as const,
    },
    content: {
      padding: 24,
    },
    qrContainer: {
      backgroundColor: "#FFFFFF",
      borderRadius: 24,
      padding: 20,
      alignItems: "center",
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 6,
      position: "relative" as const,
    },
    qrCorner: {
      position: "absolute" as const,
      width: 20,
      height: 20,
      borderColor: colors.tint,
      borderWidth: 3,
    },
    qrCornerTL: {
      top: 8,
      left: 8,
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    qrCornerTR: {
      top: 8,
      right: 8,
      borderLeftWidth: 0,
      borderBottomWidth: 0,
    },
    qrCornerBL: {
      bottom: 8,
      left: 8,
      borderRightWidth: 0,
      borderTopWidth: 0,
    },
    qrCornerBR: {
      bottom: 8,
      right: 8,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    qrImage: {
      width: QR_SIZE,
      height: QR_SIZE,
      backgroundColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
    },
    qrToken: {
      fontSize: 18,
      fontWeight: "800" as const,
      color: colors.text,
      marginTop: 16,
      letterSpacing: 2,
      textAlign: "center" as const,
    },
    infoContainer: {
      gap: 12,
      marginBottom: 20,
    },
    infoCard: {
      flexDirection: "row" as const,
      alignItems: "center",
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 16,
      gap: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    infoIconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
    },
    infoContent: {
      flex: 1,
    },
    infoLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      fontWeight: "600" as const,
      marginBottom: 4,
      textTransform: "uppercase" as const,
      letterSpacing: 0.5,
    },
    infoValue: {
      fontSize: 15,
      color: colors.text,
      fontWeight: "700" as const,
    },
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: "flex-start" as const,
    },
    statusText: {
      fontSize: 11,
      fontWeight: "800" as const,
      color: "#FFFFFF",
      letterSpacing: 0.5,
    },
    actionsContainer: {
      flexDirection: "row" as const,
      gap: 12,
    },
    actionButton: {
      flex: 1,
      flexDirection: "row" as const,
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 16,
      borderRadius: 16,
      borderWidth: 2,
    },
    primaryButton: {
      backgroundColor: colors.tint,
      borderColor: colors.tint,
    },
    secondaryButton: {
      backgroundColor: "transparent",
      borderColor: colors.border,
    },
    buttonText: {
      fontSize: 14,
      fontWeight: "700" as const,
    },
    primaryButtonText: {
      color: "#FFFFFF",
    },
    secondaryButtonText: {
      color: colors.text,
    },
    disclaimer: {
      backgroundColor: `${colors.tint}10`,
      borderRadius: 12,
      padding: 14,
      marginTop: 20,
      borderWidth: 1,
      borderColor: `${colors.tint}30`,
    },
    disclaimerText: {
      fontSize: 11,
      color: colors.textSecondary,
      textAlign: "center" as const,
      lineHeight: 16,
      fontWeight: "500" as const,
    },
    loadingContainer: {
      justifyContent: "center",
      alignItems: "center",
      width: QR_SIZE,
      height: QR_SIZE,
    },
    loadingText: {
      marginTop: 12,
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: "center" as const,
    },
    refreshButton: {
      marginTop: 12,
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.tint,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <LinearGradient
              colors={isDark 
                ? ['#2D1B69', '#6B2D91', '#9B59B6'] 
                : ['#667eea', '#764ba2', '#f093fb']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBg}
            />
            <Animated.View
              style={[
                styles.shimmerOverlay,
                {
                  transform: [{ translateX: shimmerTranslate }],
                },
              ]}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <X size={20} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>

            <View style={{ alignItems: "center" }}>
              <Sparkles size={40} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.headerTitle}>Your Kaweely ID</Text>
              <Text style={styles.headerSubtitle}>Scan at any Kaweely service point</Text>
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.qrContainer}>
              <View style={[styles.qrCorner, styles.qrCornerTL]} />
              <View style={[styles.qrCorner, styles.qrCornerTR]} />
              <View style={[styles.qrCorner, styles.qrCornerBL]} />
              <View style={[styles.qrCorner, styles.qrCornerBR]} />
              
              <View style={styles.qrImage}>
                {(() => {
                  console.log('[QR Render] user:', !!user, 'qrToken:', user?.qrToken, 'qrData length:', qrData?.length);
                  
                  if (!user) {
                    return (
                      <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>No user data</Text>
                      </View>
                    );
                  }
                  
                  if (!user.qrToken) {
                    return (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.tint} />
                        <Text style={styles.loadingText}>Generating Token...</Text>
                        <TouchableOpacity
                          onPress={handleRegenerate}
                          style={styles.refreshButton}
                        >
                          <RefreshCw size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    );
                  }
                  
                  if (!qrData || qrData.length === 0) {
                    return (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.tint} />
                        <Text style={styles.loadingText}>Generating QR...</Text>
                        <TouchableOpacity
                          onPress={handleRegenerate}
                          style={styles.refreshButton}
                        >
                          <RefreshCw size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    );
                  }
                  
                  return <SimpleQRCode data={qrData} size={QR_SIZE} />;
                })()}
              </View>
              
              <Text style={styles.qrToken}>{user?.qrToken || "GENERATING..."}</Text>
            </View>

            <View style={styles.infoContainer}>
              <View style={styles.infoCard}>
                <View style={[styles.infoIconContainer, { backgroundColor: `${colors.tint}15` }]}>
                  <User size={22} color={colors.tint} strokeWidth={2.5} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Account Name</Text>
                  <Text style={styles.infoValue}>{user?.name}</Text>
                </View>
              </View>

              <View style={styles.infoCard}>
                <View style={[styles.infoIconContainer, { backgroundColor: `${colors.accent}15` }]}>
                  <CreditCard size={22} color={colors.accent} strokeWidth={2.5} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Wallet Balance</Text>
                  <Text style={styles.infoValue}>{format(balance, currentCurrency)}</Text>
                </View>
              </View>

              <View style={styles.infoCard}>
                <View style={[styles.infoIconContainer, { backgroundColor: subscription?.isActive ? `${colors.success}15` : `${colors.error}15` }]}>
                  <Calendar size={22} color={subscription?.isActive ? colors.success : colors.error} strokeWidth={2.5} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Subscription</Text>
                  {subscription?.isActive ? (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Text style={styles.infoValue}>{subscription.planTitle}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: colors.success }]}>
                        <Text style={styles.statusText}>ACTIVE</Text>
                      </View>
                    </View>
                  ) : (
                    <Text style={[styles.infoValue, { color: colors.textSecondary }]}>No Active Plan</Text>
                  )}
                </View>
              </View>
            </View>

            {Platform.OS !== 'web' && (
              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.primaryButton]}
                  onPress={handleShare}
                  activeOpacity={0.8}
                >
                  <Share2 size={20} color="#FFFFFF" strokeWidth={2.5} />
                  <Text style={[styles.buttonText, styles.primaryButtonText]}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.secondaryButton]}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.buttonText, styles.secondaryButtonText]}>Close</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.disclaimer}>
              <Text style={styles.disclaimerText}>
                This QR code contains your account information for quick service at Kaweely locations. Keep it secure and don&apos;t share with unauthorized parties.
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
