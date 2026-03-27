import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import { useEffect, useRef } from "react";
import { X, Sparkles, Check } from "lucide-react-native";
import { PERFUMES, PerfumeType } from "@/constants/perfumes";

type PerfumeSelectionModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (perfume: PerfumeType) => void;
  selectedPerfumeId?: string;
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function PerfumeSelectionModal({
  visible,
  onClose,
  onSelect,
  selectedPerfumeId,
}: PerfumeSelectionModalProps) {

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();

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
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim, shimmerAnim]);

  const handleSelect = (perfume: PerfumeType) => {
    onSelect(perfume);
    onClose();
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.85)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    modalContainer: {
      width: Math.min(SCREEN_WIDTH - 40, 420),
      backgroundColor: "#0a0a0a",
      borderRadius: 28,
      borderWidth: 2,
      borderColor: "#EC4899",
      shadowColor: "#EC4899",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.5,
      shadowRadius: 24,
      elevation: 16,
      overflow: "hidden",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 18,
      backgroundColor: "#1a1a1a",
      borderBottomWidth: 1,
      borderBottomColor: "#EC489930",
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
    },
    headerIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#EC489920",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1.5,
      borderColor: "#EC4899",
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      fontSize: 18,
      fontWeight: "900" as const,
      color: "#FFFFFF",
    },
    subtitle: {
      fontSize: 11,
      fontWeight: "600" as const,
      color: "#EC4899",
      marginTop: 2,
    },
    closeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "#1a1a1a",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#2a2a2a",
    },
    content: {
      padding: 18,
      gap: 12,
      maxHeight: 420,
    },
    perfumeCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#141414",
      padding: 16,
      borderRadius: 18,
      borderWidth: 2,
      borderColor: "#2a2a2a",
      position: "relative" as const,
      overflow: "hidden" as const,
    },
    perfumeCardSelected: {
      backgroundColor: "#EC489918",
      borderColor: "#EC4899",
      shadowColor: "#EC4899",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    },
    perfumeIcon: {
      fontSize: 40,
      marginRight: 16,
      width: 52,
      height: 52,
      textAlign: "center" as const,
      lineHeight: 52,
      borderRadius: 26,
      backgroundColor: "#ffffff08",
    },
    perfumeInfo: {
      flex: 1,
    },
    perfumeName: {
      fontSize: 16,
      fontWeight: "800" as const,
      color: "#FFFFFF",
      marginBottom: 4,
      letterSpacing: 0.3,
    },
    perfumeDescription: {
      fontSize: 12,
      fontWeight: "600" as const,
      color: "#999999",
      letterSpacing: 0.2,
    },
    checkmark: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: "#EC4899",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#EC4899",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.6,
      shadowRadius: 4,
      elevation: 4,
    },
    shimmerOverlay: {
      position: "absolute" as const,
      top: 0,
      left: -100,
      width: "100%",
      height: "100%",
      backgroundColor: "transparent",
    },
    shimmerGradient: {
      width: 100,
      height: "100%",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={{ position: "absolute" as const, top: 0, left: 0, right: 0, bottom: 0 }}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIcon}>
                <Sparkles size={20} color="#EC4899" strokeWidth={2.5} />
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Select Fragrance</Text>
                <Text style={styles.subtitle}>
                  Choose your complimentary perfume
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={18} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {PERFUMES.map((perfume, index) => {
              const isSelected = selectedPerfumeId === perfume.id;
              const shimmerTranslate = shimmerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, SCREEN_WIDTH],
              });

              return (
                <TouchableOpacity
                  key={perfume.id}
                  style={[
                    styles.perfumeCard,
                    isSelected && styles.perfumeCardSelected,
                  ]}
                  onPress={() => handleSelect(perfume)}
                  activeOpacity={0.7}
                >
                  {isSelected && (
                    <Animated.View
                      style={[
                        styles.shimmerOverlay,
                        {
                          transform: [{ translateX: shimmerTranslate }],
                        },
                      ]}
                    >
                      <View style={styles.shimmerGradient} />
                    </Animated.View>
                  )}
                  <Text style={styles.perfumeIcon}>{perfume.icon}</Text>
                  <View style={styles.perfumeInfo}>
                    <Text style={styles.perfumeName}>{perfume.name}</Text>
                    <Text style={styles.perfumeDescription}>
                      {perfume.description}
                    </Text>
                  </View>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Check size={16} color="#000000" strokeWidth={3.5} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
