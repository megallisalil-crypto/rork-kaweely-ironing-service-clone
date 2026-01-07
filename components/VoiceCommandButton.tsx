import React, { useState } from "react";
import { View, StyleSheet, Animated, TouchableOpacity, Modal, Text } from "react-native";
import { Mic, MicOff, X, Sparkles } from "lucide-react-native";
import { useVoiceCommand } from "@/contexts/VoiceCommandContext";
import { hapticFeedback } from "@/utils/haptics";
import { LinearGradient } from "expo-linear-gradient";

export default function VoiceCommandButton() {
  const { isListening, isSpeaking, isVoiceAvailable, startListening, stopListening, transcript } = useVoiceCommand();
  const [showCommandPanel, setShowCommandPanel] = useState<boolean>(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isListening, pulseAnim]);

  const handlePress = async () => {
    await hapticFeedback.medium();
    
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setShowCommandPanel(true);
  };

  const handleVoicePress = async () => {
    await hapticFeedback.medium();
    if (isListening) {
      stopListening();
    } else {
      await startListening();
    }
  };

  const handleClose = () => {
    if (isListening) {
      stopListening();
    }
    setShowCommandPanel(false);
  };

  return (
    <>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.pulseCircle,
            {
              transform: [{ scale: pulseAnim }],
              opacity: isListening ? 0.3 : 0,
            },
          ]}
        />
        
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.8}
          style={styles.touchable}
        >
          <Animated.View
            style={[
              styles.button,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={isListening ? ["#EF4444", "#DC2626"] : isSpeaking ? ["#F59E0B", "#D97706"] : ["#3B82F6", "#2563EB"]}
              style={styles.gradient}
            >
              <Sparkles color="#FFFFFF" size={28} />
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showCommandPanel}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={handleClose}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.titleContainer}>
                <Sparkles color="#3B82F6" size={24} />
                <Text style={styles.modalTitle}>Voice Commands</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  hapticFeedback.light();
                  handleClose();
                }}
                style={styles.closeButton}
              >
                <X color="#FFFFFF" size={24} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalHint}>
              Try: &quot;Show my orders&quot;, &quot;Check balance&quot;, &quot;Track delivery&quot;
            </Text>

            {isVoiceAvailable ? (
              <View style={styles.voiceSection}>
                <TouchableOpacity
                  onPress={handleVoicePress}
                  style={[
                    styles.voiceButton,
                    isListening && styles.voiceButtonActive,
                  ]}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={isListening ? ["#EF4444", "#DC2626"] : ["#3B82F6", "#2563EB"]}
                    style={styles.voiceGradient}
                  >
                    {isListening ? (
                      <MicOff color="#FFFFFF" size={32} />
                    ) : (
                      <Mic color="#FFFFFF" size={32} />
                    )}
                  </LinearGradient>
                  <Text style={styles.voiceButtonText}>
                    {isListening ? "Listening... Tap to stop" : "Tap to speak"}
                  </Text>
                </TouchableOpacity>
                {transcript && (
                  <View style={styles.transcriptBox}>
                    <Text style={styles.transcriptLabel}>Heard:</Text>
                    <Text style={styles.transcriptText}>{transcript}</Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.unavailableContainer}>
                <Text style={styles.unavailableText}>
                  Voice commands are only available on web browsers that support speech recognition (Chrome, Edge, Safari).
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 100,
    left: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  pulseCircle: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#3B82F6",
  },
  touchable: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
  },
  gradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContent: {
    backgroundColor: "#1F2937",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  closeButton: {
    padding: 4,
  },
  modalHint: {
    fontSize: 14,
    color: "#9CA3AF",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  voiceSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  voiceButton: {
    alignItems: "center",
    paddingVertical: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  voiceButtonActive: {
    borderWidth: 2,
    borderColor: "#EF4444",
  },
  voiceGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  voiceButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  transcriptBox: {
    marginTop: 16,
    backgroundColor: "rgba(59,130,246,0.1)",
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#3B82F6",
  },
  transcriptLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    marginBottom: 4,
  },
  transcriptText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  unavailableContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: "center",
  },
  unavailableText: {
    fontSize: 15,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 22,
  },
});
