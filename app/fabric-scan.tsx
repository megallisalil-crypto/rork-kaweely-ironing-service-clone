import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal, Dimensions } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Camera, Sparkles, X, AlertCircle, CheckCircle2, Info, Trash2, Lightbulb, Droplet, Shield, Zap } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useFabricScan } from "@/contexts/FabricScanContext";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedPressable } from "@/components/AnimatedPressable";
import { FabricAnalysis } from "@/types/fabricScan";

const { width } = Dimensions.get('window');

export default function FabricScanScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { scans, isAnalyzing, analyzeImage, deleteScan } = useFabricScan();
  const [selectedScan, setSelectedScan] = useState<FabricAnalysis | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photos to use this feature.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await analyzeImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow camera access to use this feature.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await analyzeImage(result.assets[0].uri);
    }
  };

  const confirmDelete = (scanId: string) => {
    Alert.alert(
      'Delete Scan',
      'Are you sure you want to delete this fabric scan?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteScan(scanId)
        },
      ]
    );
  };

  const fabricColors: Record<string, string> = {
    cotton: '#93C5FD',
    silk: '#FCA5A5',
    wool: '#FCD34D',
    polyester: '#A78BFA',
    linen: '#86EFAC',
    denim: '#60A5FA',
    leather: '#F59E0B',
    synthetic: '#A855F7',
    delicate: '#EC4899',
    unknown: '#94A3B8',
  };

  const stainIcons: Record<string, typeof Droplet> = {
    coffee: Droplet,
    wine: Droplet,
    oil: Droplet,
    blood: Droplet,
    ink: Droplet,
    grass: Droplet,
    food: Droplet,
    makeup: Droplet,
    mud: Droplet,
    sweat: Droplet,
    unknown: AlertCircle,
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      gap: 16,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '900' as const,
      color: colors.text,
    },
    headerSubtitle: {
      fontSize: 15,
      color: colors.textSecondary,
      fontWeight: '600' as const,
      lineHeight: 22,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    actionButton: {
      flex: 1,
      borderRadius: 20,
      overflow: 'hidden' as const,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    actionButtonGradient: {
      padding: 20,
      alignItems: 'center',
      gap: 12,
    },
    actionButtonIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionButtonText: {
      fontSize: 16,
      fontWeight: '800' as const,
      color: '#FFFFFF',
    },
    scansList: {
      padding: 20,
      paddingTop: 0,
      gap: 16,
    },
    scanCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 20,
      overflow: 'hidden' as const,
      borderWidth: 2,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    scanImage: {
      width: '100%',
      height: 200,
      backgroundColor: colors.border,
    },
    scanContent: {
      padding: 16,
      gap: 12,
    },
    scanHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    fabricBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 12,
    },
    fabricDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    fabricText: {
      fontSize: 14,
      fontWeight: '800' as const,
      color: '#FFFFFF',
      textTransform: 'capitalize' as const,
    },
    deleteButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: `${colors.error}20`,
      alignItems: 'center',
      justifyContent: 'center',
    },
    confidenceBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 10,
      backgroundColor: `${colors.success}15`,
    },
    confidenceText: {
      fontSize: 12,
      fontWeight: '700' as const,
      color: colors.success,
    },
    stainsBadge: {
      flexDirection: 'row',
      flexWrap: 'wrap' as const,
      gap: 8,
    },
    stainChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 10,
      backgroundColor: `${colors.error}15`,
    },
    stainText: {
      fontSize: 12,
      fontWeight: '700' as const,
      color: colors.error,
      textTransform: 'capitalize' as const,
    },
    viewDetailsButton: {
      marginTop: 8,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: colors.tint,
      alignItems: 'center',
    },
    viewDetailsText: {
      fontSize: 14,
      fontWeight: '800' as const,
      color: '#FFFFFF',
    },
    emptyState: {
      padding: 40,
      alignItems: 'center',
      gap: 16,
    },
    emptyIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: `${colors.tint}15`,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: '800' as const,
      color: colors.text,
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      justifyContent: 'center',
    },
    modalContent: {
      backgroundColor: colors.cardBackground,
      margin: 20,
      borderRadius: 24,
      maxHeight: '85%',
      borderWidth: 2,
      borderColor: colors.border,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 2,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: '900' as const,
      color: colors.text,
    },
    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${colors.error}20`,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalScroll: {
      padding: 20,
    },
    modalImage: {
      width: '100%',
      height: 250,
      borderRadius: 16,
      marginBottom: 20,
    },
    detailSection: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '800' as const,
      color: colors.text,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    instructionItem: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 10,
      paddingLeft: 8,
    },
    bulletPoint: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.tint,
      marginTop: 8,
    },
    instructionText: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
      lineHeight: 22,
      fontWeight: '600' as const,
    },
    serviceChip: {
      backgroundColor: `${colors.accent}15`,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      marginRight: 8,
      marginBottom: 8,
    },
    serviceText: {
      fontSize: 13,
      fontWeight: '700' as const,
      color: colors.accent,
    },
    emergencySection: {
      backgroundColor: `${colors.error}10`,
      padding: 16,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: `${colors.error}30`,
      marginBottom: 20,
    },
    emergencyTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
    },
    emergencyTitleText: {
      fontSize: 16,
      fontWeight: '900' as const,
      color: colors.error,
    },
    loadingOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    loadingContent: {
      backgroundColor: colors.cardBackground,
      padding: 32,
      borderRadius: 24,
      alignItems: 'center',
      gap: 16,
      borderWidth: 2,
      borderColor: colors.border,
    },
    loadingText: {
      fontSize: 18,
      fontWeight: '800' as const,
      color: colors.text,
    },
    loadingSubtext: {
      fontSize: 14,
      color: colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "AI Fabric Scan",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AI Fabric Care Assistant</Text>
          <Text style={styles.headerSubtitle}>
            Scan your fabrics to get instant care instructions, stain removal tips, and service recommendations powered by AI
          </Text>

          <View style={styles.actionButtons}>
            <AnimatedPressable onPress={takePhoto} style={styles.actionButton} hapticType="medium">
              <LinearGradient
                colors={['#14B8A6', '#0D9488']}
                style={styles.actionButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.actionButtonIcon}>
                  <Camera size={28} color="#FFFFFF" strokeWidth={2.5} />
                </View>
                <Text style={styles.actionButtonText}>Take Photo</Text>
              </LinearGradient>
            </AnimatedPressable>

            <AnimatedPressable onPress={pickImage} style={styles.actionButton} hapticType="medium">
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                style={styles.actionButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.actionButtonIcon}>
                  <Sparkles size={28} color="#FFFFFF" strokeWidth={2.5} />
                </View>
                <Text style={styles.actionButtonText}>Choose Photo</Text>
              </LinearGradient>
            </AnimatedPressable>
          </View>
        </View>

        <View style={styles.scansList}>
          {scans.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Camera size={40} color={colors.tint} strokeWidth={2} />
              </View>
              <Text style={styles.emptyTitle}>No Scans Yet</Text>
              <Text style={styles.emptyText}>
                Take or upload a photo of your garment to get AI-powered care instructions
              </Text>
            </View>
          ) : (
            scans.map((scan) => {
              const fabricColor = fabricColors[scan.detectedFabric] || fabricColors.unknown;
              return (
                <View key={scan.id} style={styles.scanCard}>
                  <Image source={{ uri: scan.imageUri }} style={styles.scanImage} />
                  <View style={styles.scanContent}>
                    <View style={styles.scanHeader}>
                      <View style={[styles.fabricBadge, { backgroundColor: fabricColor }]}>
                        <View style={[styles.fabricDot, { backgroundColor: '#FFFFFF' }]} />
                        <Text style={styles.fabricText}>{scan.detectedFabric}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => confirmDelete(scan.id)}
                        activeOpacity={0.7}
                      >
                        <Trash2 size={18} color={colors.error} strokeWidth={2.5} />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.confidenceBadge}>
                      <CheckCircle2 size={14} color={colors.success} strokeWidth={2.5} />
                      <Text style={styles.confidenceText}>
                        {Math.round(scan.confidence * 100)}% Confidence
                      </Text>
                    </View>

                    {scan.detectedStains.length > 0 && (
                      <View style={styles.stainsBadge}>
                        {scan.detectedStains.map((stain, idx) => {
                          const StainIcon = stainIcons[stain] || AlertCircle;
                          return (
                            <View key={idx} style={styles.stainChip}>
                              <StainIcon size={12} color={colors.error} strokeWidth={2.5} />
                              <Text style={styles.stainText}>{stain}</Text>
                            </View>
                          );
                        })}
                      </View>
                    )}

                    <TouchableOpacity
                      style={styles.viewDetailsButton}
                      onPress={() => setSelectedScan(scan)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.viewDetailsText}>View Care Instructions</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      <Modal
        visible={selectedScan !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedScan(null)}
      >
        {selectedScan && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Fabric Care Guide</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedScan(null)}
                  activeOpacity={0.7}
                >
                  <X size={20} color={colors.error} strokeWidth={2.5} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                <Image source={{ uri: selectedScan.imageUri }} style={styles.modalImage} />

                {selectedScan.emergencyTips && selectedScan.emergencyTips.length > 0 && (
                  <View style={styles.emergencySection}>
                    <View style={styles.emergencyTitle}>
                      <Zap size={20} color={colors.error} strokeWidth={2.5} />
                      <Text style={styles.emergencyTitleText}>Emergency Stain Treatment</Text>
                    </View>
                    {selectedScan.emergencyTips.map((tip, idx) => (
                      <View key={idx} style={styles.instructionItem}>
                        <Text style={{ color: colors.error, fontWeight: '900' as const }}>
                          {idx + 1}.
                        </Text>
                        <Text style={[styles.instructionText, { color: colors.text }]}>
                          {tip}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.detailSection}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Droplet size={20} color={colors.tint} strokeWidth={2.5} />
                    <Text style={styles.sectionTitle}>Washing Instructions</Text>
                  </View>
                  {selectedScan.careInstructions.map((instruction, idx) => (
                    <View key={idx} style={styles.instructionItem}>
                      <View style={styles.bulletPoint} />
                      <Text style={styles.instructionText}>{instruction}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.detailSection}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Lightbulb size={20} color={colors.accent} strokeWidth={2.5} />
                    <Text style={styles.sectionTitle}>Care Tips</Text>
                  </View>
                  {selectedScan.washingTips.map((tip, idx) => (
                    <View key={idx} style={styles.instructionItem}>
                      <View style={styles.bulletPoint} />
                      <Text style={styles.instructionText}>{tip}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.detailSection}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Shield size={20} color={colors.success} strokeWidth={2.5} />
                    <Text style={styles.sectionTitle}>Recommended Services</Text>
                  </View>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' as const }}>
                    {selectedScan.recommendedServices.map((service, idx) => (
                      <View key={idx} style={styles.serviceChip}>
                        <Text style={styles.serviceText}>{service}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>

      {isAnalyzing && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            <Sparkles size={48} color={colors.accent} strokeWidth={2.5} />
            <Text style={styles.loadingText}>Analyzing Fabric...</Text>
            <Text style={styles.loadingSubtext}>AI is detecting fabric type and stains</Text>
          </View>
        </View>
      )}
    </View>
  );
}
