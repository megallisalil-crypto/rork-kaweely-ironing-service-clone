import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import { X, Lightbulb, Volume2 } from "lucide-react-native";
import { useVoiceCommand } from "@/contexts/VoiceCommandContext";
import { hapticFeedback } from "@/utils/haptics";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function VoiceCommandOverlay() {
  const {
    isListening,
    transcript,
    isProcessing,
    isSpeaking,
    suggestions,
    speak,
  } = useVoiceCommand();

  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const waveAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isListening || isSpeaking) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(waveAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      waveAnim.setValue(0);
    }
  }, [isListening, isSpeaking, waveAnim]);

  const isVisible = isListening || isProcessing || isSpeaking;

  if (!isVisible && !showSuggestions) {
    return null;
  }

  const handleSuggestionPress = async (suggestionText: string) => {
    await hapticFeedback.light();
    await speak(suggestionText);
    setShowSuggestions(false);
  };

  const wave1 = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  const wave2 = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30],
  });

  const wave3 = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 15],
  });

  const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.category]) {
      acc[suggestion.category] = [];
    }
    acc[suggestion.category].push(suggestion);
    return acc;
  }, {} as Record<string, typeof suggestions>);

  return (
    <>
      {isVisible && (
        <View style={styles.overlay}>
          <LinearGradient
            colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]}
            style={StyleSheet.absoluteFill}
          />
          
          <View style={styles.content}>
            <View style={styles.visualizer}>
              {isListening && (
                <View style={styles.waveContainer}>
                  <Animated.View
                    style={[
                      styles.wave,
                      { height: wave1, backgroundColor: "#3B82F6" },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.wave,
                      { height: wave2, backgroundColor: "#60A5FA" },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.wave,
                      { height: wave3, backgroundColor: "#93C5FD" },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.wave,
                      { height: wave2, backgroundColor: "#60A5FA" },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.wave,
                      { height: wave1, backgroundColor: "#3B82F6" },
                    ]}
                  />
                </View>
              )}
              
              {isSpeaking && (
                <View style={styles.speakingIndicator}>
                  <Volume2 color="#F59E0B" size={48} />
                </View>
              )}
            </View>

            <Text style={styles.statusText}>
              {isListening
                ? "Listening..."
                : isSpeaking
                ? "Speaking..."
                : isProcessing
                ? "Processing..."
                : ""}
            </Text>

            {transcript && (
              <View style={styles.transcriptContainer}>
                <Text style={styles.transcriptText}>{transcript}</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.suggestionsButton}
              onPress={() => {
                hapticFeedback.light();
                setShowSuggestions(true);
              }}
            >
              <Lightbulb color="#F59E0B" size={20} />
              <Text style={styles.suggestionsButtonText}>View Commands</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Modal
        visible={showSuggestions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSuggestions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Available Commands</Text>
              <TouchableOpacity
                onPress={() => {
                  hapticFeedback.light();
                  setShowSuggestions(false);
                }}
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <X color="#FFFFFF" size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              {Object.entries(groupedSuggestions).map(([category, items]) => (
                <View key={category} style={styles.categoryContainer}>
                  <Text style={styles.categoryTitle}>{category}</Text>
                  {items.map((suggestion, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.suggestionItem}
                      onPress={() => handleSuggestionPress(suggestion.text)}
                    >
                      <View style={styles.suggestionContent}>
                        <Text style={styles.suggestionText}>
                          &quot;{suggestion.text}&quot;
                        </Text>
                        <Text style={styles.suggestionDescription}>
                          {suggestion.description}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  visualizer: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  waveContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  wave: {
    width: 6,
    borderRadius: 3,
    minHeight: 10,
  },
  speakingIndicator: {
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  transcriptContainer: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    maxWidth: width - 80,
    marginBottom: 20,
  },
  transcriptText: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
  },
  suggestionsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(245,158,11,0.2)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#F59E0B",
  },
  suggestionsButtonText: {
    color: "#F59E0B",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1F2937",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.8,
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
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    marginBottom: 12,
    letterSpacing: 1,
  },
  suggestionItem: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#3B82F6",
  },
  suggestionContent: {
    gap: 4,
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  suggestionDescription: {
    fontSize: 14,
    color: "#9CA3AF",
  },
});
