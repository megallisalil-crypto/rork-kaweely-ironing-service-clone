import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Sparkles, Play, CheckCircle, SkipForward } from 'lucide-react-native';
import { garmentTypes } from '@/constants/garmentTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/colors';

const TEST_GARMENTS_IDS = ['1', '3', '11', '5', '12'];

export default function TestGenerate5IconsScreen() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentGarment, setCurrentGarment] = useState('');
  const [generatedIcons, setGeneratedIcons] = useState<Record<string, string>>({});
  const generatingRef = useRef(false);

  const testGarments = garmentTypes.filter(g => TEST_GARMENTS_IDS.includes(g.id));

  useEffect(() => {
    loadProgress();
    checkStorageDebug();
  }, []);

  const checkStorageDebug = async () => {
    try {
      const stored = await AsyncStorage.getItem('ai_garment_icons');
      console.log('[DEBUG] Storage contents:', stored ? `${stored.length} characters` : 'EMPTY');
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('[DEBUG] Stored icon IDs:', Object.keys(parsed));
      }
    } catch (error) {
      console.error('[DEBUG] Failed to check storage:', error);
    }
  };

  const loadProgress = async () => {
    try {
      const stored = await AsyncStorage.getItem('ai_garment_icons');
      if (stored) {
        const icons = JSON.parse(stored);
        setGeneratedIcons(icons);
        
        const completedIds = TEST_GARMENTS_IDS.filter(id => icons[id]);
        setCurrentIndex(completedIds.length);
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };

  const generateIconForGarment = async (garmentId: string, garmentName: string, retries = 3): Promise<string> => {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        console.log(`🎨 [Attempt ${attempt + 1}/${retries + 1}] Generating icon for: ${garmentName}`);
        
        const prompt = `Create a simple, clean icon of a ${garmentName.toLowerCase()} garment. Minimalist line art style, transparent background, single color, no text, professional design for a laundry app interface. Icon should be recognizable and clear.`;

        const response = await fetch('https://toolkit.rork.com/images/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            size: '1024x1024'
          }),
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unable to read error');
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const base64Data = data?.image?.base64Data || data?.image?.base64;
        const mimeType = data?.image?.mimeType || 'image/png';
        
        if (!base64Data) {
          throw new Error('No image data received from API');
        }

        console.log(`✅ Successfully generated icon for ${garmentName}`);
        return `data:${mimeType};base64,${base64Data}`;
      } catch (error: any) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        let errorMsg = lastError.message;
        if (errorMsg.includes('Network request failed') || errorMsg.toLowerCase().includes('network')) {
          errorMsg = 'Network connection issue';
        } else if (errorMsg.includes('Failed to fetch')) {
          errorMsg = 'Cannot reach server';
        }
        
        console.error(`❌ Attempt ${attempt + 1}/${retries + 1} failed for ${garmentName}:`, errorMsg);
        
        if (attempt < retries) {
          const delay = 2000;
          console.log(`⏳ Waiting ${delay/1000}s before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError || new Error('All retry attempts failed');
  };

  const generateNextIcon = async () => {
    if (generatingRef.current) {
      console.log('⚠️ Already generating');
      return;
    }

    if (currentIndex >= testGarments.length) {
      Alert.alert(
        '🎉 All Complete!',
        `All ${testGarments.length} icons have been generated!`,
        [
          { text: 'View Icons', onPress: () => router.back() },
          { text: 'OK' }
        ]
      );
      return;
    }

    const garment = testGarments[currentIndex];
    
    if (generatedIcons[garment.id]) {
      setCurrentIndex(prev => prev + 1);
      return;
    }

    generatingRef.current = true;
    setIsGenerating(true);
    setCurrentGarment(garment.name);

    try {
      console.log(`\n📸 [${currentIndex + 1}/${testGarments.length}] Generating: ${garment.name}`);
      
      const iconData = await generateIconForGarment(garment.id, garment.name, 3);

      const updatedIcons = { ...generatedIcons, [garment.id]: iconData };
      setGeneratedIcons(updatedIcons);
      
      await AsyncStorage.setItem('ai_garment_icons', JSON.stringify(updatedIcons));
      console.log(`✅ ${garment.name} saved!`);

      setCurrentIndex(prev => prev + 1);
      setIsGenerating(false);
      generatingRef.current = false;
      
      Alert.alert(
        '✅ Success!',
        `Generated icon for ${garment.name}\n\nProgress: ${currentIndex + 1}/${testGarments.length}`,
        [
          currentIndex + 1 < testGarments.length
            ? { text: 'Generate Next', onPress: () => setTimeout(generateNextIcon, 100) }
            : { text: 'View All Icons', onPress: () => router.back() }
        ]
      );
    } catch (error: any) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Failed:`, errorMsg);
      setIsGenerating(false);
      generatingRef.current = false;
      
      Alert.alert(
        '❌ Generation Failed',
        `Could not generate icon for ${garment.name}\n\nError: ${errorMsg}`,
        [
          { text: 'Retry', onPress: () => setTimeout(generateNextIcon, 100) },
          { text: 'Skip', onPress: () => {
            setCurrentIndex(prev => prev + 1);
          }}
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Test Generate 5 Icons',
          headerStyle: { backgroundColor: Colors.light.background },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={Colors.light.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Sparkles size={48} color={Colors.light.tint} />
          </View>
          <Text style={styles.title}>Test Icon Generation</Text>
          <Text style={styles.subtitle}>
            Generate AI icons for 5 test garments to see how they look in the selector
          </Text>
        </View>

        <View style={styles.testGarmentsCard}>
          <Text style={styles.cardTitle}>Test Garments</Text>
          {testGarments.map((garment, index) => (
            <View key={garment.id} style={styles.garmentRow}>
              <View style={styles.garmentInfo}>
                <Text style={styles.garmentEmoji}>{garment.icon}</Text>
                <Text style={styles.garmentName}>{garment.name}</Text>
              </View>
              {generatedIcons[garment.id] && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.statusCard}>
          <Text style={styles.cardTitle}>Progress</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Current:</Text>
            <Text style={styles.statusValue}>
              {currentIndex + 1} of {testGarments.length}
            </Text>
          </View>
          {isGenerating && (
            <View style={styles.generatingBadge}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.generatingText}>Generating {currentGarment}...</Text>
            </View>
          )}
          {currentIndex < testGarments.length && !isGenerating && (
            <View style={styles.nextBadge}>
              <Text style={styles.nextText}>
                Next: {testGarments[currentIndex]?.name}
              </Text>
            </View>
          )}
          {currentIndex >= testGarments.length && (
            <View style={styles.completeBadge}>
              <CheckCircle size={20} color="#10B981" />
              <Text style={styles.completeText}>All icons generated!</Text>
            </View>
          )}
        </View>

        {Object.keys(generatedIcons).length > 0 && !isGenerating && (
          <View style={styles.previewCard}>
            <Text style={styles.cardTitle}>Generated Icons Preview</Text>
            <Text style={styles.debugText}>Storage: {Object.keys(generatedIcons).length} icons saved</Text>
            <View style={styles.iconsGrid}>
              {testGarments.map(garment => {
                const icon = generatedIcons[garment.id];
                const hasValidIcon = icon && 
                  typeof icon === 'string' && 
                  icon.startsWith('data:image/') && 
                  icon.includes('base64,');
                
                return (
                  <View key={garment.id} style={styles.iconPreview}>
                    {hasValidIcon ? (
                      <Image 
                        source={{ uri: icon }} 
                        style={styles.iconImage}
                        resizeMode="contain"
                        onError={(e) => {
                          console.error('[Preview Image Error]', garment.name, e.nativeEvent.error);
                        }}
                      />
                    ) : (
                      <View style={styles.iconPlaceholder}>
                        <Text style={styles.iconEmoji}>{garment.icon}</Text>
                      </View>
                    )}
                    <Text style={styles.iconLabel} numberOfLines={1}>
                      {garment.name}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
            onPress={generateNextIcon}
            disabled={isGenerating || currentIndex >= testGarments.length}
          >
            {isGenerating ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Play size={20} color="#FFFFFF" fill="#FFFFFF" />
                <Text style={styles.generateButtonText}>
                  {currentIndex >= testGarments.length 
                    ? 'All Complete!' 
                    : currentIndex === 0 
                    ? 'Start Generation' 
                    : 'Generate Next'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {currentIndex < testGarments.length && currentIndex > 0 && !isGenerating && (
            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => setCurrentIndex(prev => prev + 1)}
            >
              <SkipForward size={20} color="#FFFFFF" />
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>💡 How it works</Text>
          <Text style={styles.infoText}>
            1. Click &quot;Start Generation&quot; or &quot;Generate Next&quot; for ONE icon at a time
          </Text>
          <Text style={styles.infoText}>
            2. Each icon is SAVED IMMEDIATELY - your progress is never lost!
          </Text>
          <Text style={styles.infoText}>
            3. Close the app, restart, or refresh - progress is always saved
          </Text>
          <Text style={styles.infoText}>
            4. Click &quot;Skip&quot; to move to the next garment without generating
          </Text>
          <Text style={styles.infoText}>
            5. Generated icons appear immediately in the garment selector!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  backButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${Colors.light.tint}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.tabIconDefault,
    textAlign: 'center',
    lineHeight: 22,
  },
  testGarmentsCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  garmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  garmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  garmentEmoji: {
    fontSize: 24,
  },
  garmentName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700' as const,
  },
  progressCard: {
    backgroundColor: `${Colors.light.tint}20`,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: `${Colors.light.tint}40`,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.tint,
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
    color: Colors.light.tint,
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: `${Colors.light.tint}40`,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.light.tint,
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 14,
    color: Colors.light.tint,
    fontWeight: '600' as const,
    textAlign: 'center',
  },
  errorsCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  errorsTitle: {
    fontSize: 16,
    color: '#DC2626',
    fontWeight: '700' as const,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#991B1B',
    marginBottom: 4,
  },
  previewCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  iconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconPreview: {
    width: 80,
    alignItems: 'center',
  },
  iconImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  iconPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  iconEmoji: {
    fontSize: 30,
  },
  iconLabel: {
    fontSize: 10,
    color: Colors.light.tabIconDefault,
    marginTop: 4,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  generateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.light.tint,
    paddingVertical: 16,
    borderRadius: 12,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#6B7280',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  statusCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  statusLabel: {
    fontSize: 16,
    color: Colors.light.tabIconDefault,
    fontWeight: '600' as const,
  },
  statusValue: {
    fontSize: 20,
    color: Colors.light.tint,
    fontWeight: '700' as const,
  },
  generatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: `${Colors.light.tint}20`,
    borderRadius: 8,
  },
  generatingText: {
    fontSize: 14,
    color: Colors.light.tint,
    fontWeight: '600' as const,
  },
  nextBadge: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  nextText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600' as const,
  },
  completeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: '#D1FAE5',
    borderRadius: 8,
  },
  completeText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600' as const,
  },
  infoCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#0369A1',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#075985',
    marginBottom: 8,
    lineHeight: 20,
  },
  debugText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
    fontStyle: 'italic' as const,
  },
});
