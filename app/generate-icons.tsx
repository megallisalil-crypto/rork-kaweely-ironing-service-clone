import React, { useState } from 'react';
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
import { ArrowLeft, Sparkles, RefreshCw, Trash2, Download } from 'lucide-react-native';
import {
  generateAllIcons,
  clearIconCache,
  getCachedIcons,
  regenerateIcon,
  IconGenerationStatus,
  exportIconsAsTypeScriptFile,
} from '@/utils/iconGenerator';
import { garmentTypes } from '@/constants/garmentTypes';

export default function GenerateIconsScreen() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [status, setStatus] = useState<IconGenerationStatus | null>(null);
  const [iconMap, setIconMap] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<{ name: string; error: string }[]>([]);

  React.useEffect(() => {
    loadCachedIcons();
  }, []);

  const loadCachedIcons = async () => {
    const cached = await getCachedIcons();
    setIconMap(cached);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setIsPaused(false);
    setErrors([]);
    
    try {
      const icons = await generateAllIcons(
        (progress) => {
          setStatus(progress);
        },
        (name, error) => {
          setErrors(prev => [...prev, { name, error: error.message }]);
        },
        (garmentId, iconData) => {
          setIconMap(prev => ({ ...prev, [garmentId]: iconData }));
        },
        () => isPaused
      );
      
      await loadCachedIcons();
      if (!isPaused) {
        Alert.alert(
          '🎉 Generation Complete!', 
          `Successfully generated ${Object.keys(icons).length} AI icons!\n\n✨ Icons are saved and ready to use. You can now export them as a TypeScript file.`,
          [
            { text: 'OK', style: 'default' }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to generate icons. Please try again.');
      console.error(error);
    } finally {
      setIsGenerating(false);
      setIsPaused(false);
      setStatus(null);
    }
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear all generated icons?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearIconCache();
            setIconMap({});
            Alert.alert('Success', 'Icon cache cleared!');
          },
        },
      ]
    );
  };

  const handleRegenerateIcon = async (garmentId: string) => {
    try {
      const icon = await regenerateIcon(garmentId);
      setIconMap(prev => ({ ...prev, [garmentId]: icon }));
      Alert.alert('Success', 'Icon regenerated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to regenerate icon');
      console.error(error);
    }
  };

  const handleExportFile = async () => {
    try {
      const fileContent = await exportIconsAsTypeScriptFile();
      if (!fileContent) {
        Alert.alert('No Data', 'No icons file found. Generate icons first.');
        return;
      }

      Alert.alert(
        '📥 Export Icons File',
        `Ready to export ${cachedCount} icons as a TypeScript file.\n\nFile size: ${(fileContent.length / 1024).toFixed(2)} KB\n\nYou can copy the file content to clipboard and paste it into your project.`,
        [
          {
            text: 'Copy to Clipboard',
            onPress: async () => {
              try {
                const Clipboard = await import('expo-clipboard');
                await Clipboard.setStringAsync(fileContent);
                Alert.alert(
                  '✅ Copied!',
                  'File content copied to clipboard.\n\nCreate a new file called "constants/generatedIcons.ts" in your project and paste the content there.'
                );
              } catch (error) {
                Alert.alert('Error', 'Failed to copy to clipboard');
                console.error(error);
              }
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to export file');
      console.error(error);
    }
  };

  const progress = status ? (status.generated / status.total) * 100 : 0;
  const cachedCount = Object.keys(iconMap).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'AI Icon Generator',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="#333" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Sparkles size={48} color="#6366F1" />
          </View>
          <Text style={styles.title}>AI Icon Generation System</Text>
          <Text style={styles.subtitle}>
            Generate beautiful, custom icons for all {garmentTypes.length} garment types using AI
          </Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Items:</Text>
            <Text style={styles.statValue}>{garmentTypes.length}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Generated:</Text>
            <Text style={[styles.statValue, { color: '#10B981' }]}>
              {cachedCount}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Remaining:</Text>
            <Text style={[styles.statValue, { color: '#F59E0B' }]}>
              {garmentTypes.length - cachedCount}
            </Text>
          </View>
        </View>

        {isGenerating && status && (
          <View style={styles.progressCard}>
            <Text style={styles.progressText}>
              {isPaused ? '⏸️ Paused' : 'Generating ONE at a time'}
            </Text>
            <Text style={styles.currentItemText}>
              {status.current || 'Preparing...'}
            </Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressPercentage}>
              {status.generated} / {status.total} ({Math.round(progress)}%)
            </Text>
            <TouchableOpacity
              style={[styles.button, isPaused ? styles.resumeButton : styles.pauseButton]}
              onPress={handlePauseResume}
            >
              <Text style={styles.buttonText}>
                {isPaused ? '▶️ Resume' : '⏸️ Pause'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {errors.length > 0 && (
          <View style={styles.errorsCard}>
            <Text style={styles.errorsTitle}>Errors:</Text>
            {errors.map((error, index) => (
              <Text key={index} style={styles.errorText}>
                • {error.name}: {error.error}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Sparkles size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>
                  {cachedCount > 0 ? 'Generate Missing Icons' : 'Generate All Icons'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {cachedCount > 0 && (
            <TouchableOpacity
              style={[styles.button, styles.successButton]}
              onPress={handleExportFile}
              disabled={isGenerating}
            >
              <Download size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Export TypeScript File</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={handleClearCache}
            disabled={isGenerating}
          >
            <Trash2 size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Clear Cache</Text>
          </TouchableOpacity>
        </View>

        {cachedCount > 0 && (
          <View style={styles.previewSection}>
            <Text style={styles.previewTitle}>Generated Icons Preview</Text>
            <View style={styles.iconsGrid}>
              {garmentTypes.slice(0, 20).map((garment) => {
                const icon = iconMap[garment.id];
                return (
                  <View key={garment.id} style={styles.iconPreview}>
                    {icon ? (
                      <>
                        <Image source={{ uri: icon }} style={styles.iconImage} />
                        <TouchableOpacity
                          style={styles.regenerateButton}
                          onPress={() => handleRegenerateIcon(garment.id)}
                        >
                          <RefreshCw size={12} color="#6366F1" />
                        </TouchableOpacity>
                      </>
                    ) : (
                      <View style={styles.iconPlaceholder}>
                        <Text style={styles.iconEmoji}>{garment.icon}</Text>
                      </View>
                    )}
                    <Text style={styles.iconName} numberOfLines={1}>
                      {garment.name}
                    </Text>
                  </View>
                );
              })}
            </View>
            {cachedCount > 20 && (
              <Text style={styles.moreText}>
                + {cachedCount - 20} more icons generated
              </Text>
            )}
          </View>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How It Works</Text>
          <Text style={styles.infoText}>
            1. Click &quot;Generate All Icons&quot; to start the AI generation process
          </Text>
          <Text style={styles.infoText}>
            2. AI creates icons ONE-BY-ONE. You can pause/resume anytime
          </Text>
          <Text style={styles.infoText}>
            3. Icons are cached locally and appear instantly in the garment selector
          </Text>
          <Text style={styles.infoText}>
            4. After completion, click &quot;Export TypeScript File&quot; to save icons
          </Text>
          <Text style={styles.infoText}>
            5. Copy the file content and paste it into your project
          </Text>
          <Text style={styles.infoText}>
            6. Icons will be permanently available without regeneration
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  statsCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 18,
    color: '#111827',
    fontWeight: '700',
  },
  progressCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  progressText: {
    fontSize: 16,
    color: '#4338CA',
    fontWeight: '600',
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#C7D2FE',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
    textAlign: 'center',
  },
  currentItemText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
    marginBottom: 12,
    textAlign: 'center',
  },
  pauseButton: {
    backgroundColor: '#F59E0B',
    marginTop: 12,
  },
  resumeButton: {
    backgroundColor: '#10B981',
    marginTop: 12,
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
    fontWeight: '700',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#991B1B',
    marginBottom: 4,
  },
  actions: {
    gap: 12,
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  primaryButton: {
    backgroundColor: '#6366F1',
  },
  successButton: {
    backgroundColor: '#10B981',
  },
  dangerButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  previewSection: {
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
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
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconEmoji: {
    fontSize: 30,
  },
  regenerateButton: {
    position: 'absolute',
    top: -4,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconName: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  moreText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
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
    fontWeight: '700',
    color: '#0369A1',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#075985',
    marginBottom: 8,
    lineHeight: 20,
  },
});
