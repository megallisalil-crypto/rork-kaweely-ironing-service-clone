import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { garmentTypes } from '@/constants/garmentTypes';
import { useGarmentImages } from '@/contexts/GarmentImagesContext';

export default function GenerateGarmentImagesScreen() {
  const { images: generatedImages, saveImage, count, loadImages } = useGarmentImages();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [failedSaves, setFailedSaves] = useState<string[]>([]);

  React.useEffect(() => {
    if (Object.keys(generatedImages).length > 0) {
      const keys = Object.keys(generatedImages);
      const lastIndex = garmentTypes.findIndex(g => g.id === keys[keys.length - 1]);
      if (lastIndex >= 0 && lastIndex < garmentTypes.length - 1) {
        setCurrentIndex(lastIndex + 1);
      }
    }
  }, [generatedImages]);

  const generateImageForGarment = async (garment: typeof garmentTypes[0]) => {
    setGenerating(true);
    setError('');

    try {
      const description = `Create a clean, professional sketch illustration of a ${garment.name.toLowerCase()}. 
The image should be:
- A clear, accurate representation of ${garment.name}
- Simple line art sketch style with minimal shading
- Centered on white background
- Professional laundry catalog style
- Show the garment laid flat or on a simple hanger
- No text, no people, just the garment itself
- Clean and recognizable

Garment: ${garment.name}
Category: ${garment.category}
${garment.description ? `Details: ${garment.description}` : ''}`;

      const response = await fetch('https://toolkit.rork.com/images/generate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: description,
          size: '512x512',
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate image: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data || !data.image || !data.image.base64Data) {
        throw new Error('Invalid response format');
      }
      const imageUrl = `data:${data.image.mimeType || 'image/png'};base64,${data.image.base64Data}`;

      setSaveStatus(`Saving ${garment.name}...`);
      const success = await saveImage(garment.id, imageUrl);
      
      if (!success) {
        setFailedSaves(prev => [...prev, garment.id]);
        setSaveStatus(`⚠️ Failed to save ${garment.name}`);
        Alert.alert('Storage Error', `Failed to save image for ${garment.name}. The image was generated but could not be saved.`);
      } else {
        setSaveStatus(`✓ Saved ${garment.name}`);
      }
      
      return imageUrl;
    } catch (err: any) {
      console.error('Failed to generate image:', err);
      setError(err.message || 'Failed to generate image');
      throw err;
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateCurrent = async () => {
    if (currentIndex >= garmentTypes.length) {
      return;
    }

    const garment = garmentTypes[currentIndex];
    
    try {
      await generateImageForGarment(garment);
      setCurrentIndex(prev => prev + 1);
    } catch (err) {
      console.error('Generation failed:', err);
    }
  };

  const handleGenerateAll = async () => {
    for (let i = currentIndex; i < garmentTypes.length; i++) {
      if (!generating) {
        setCurrentIndex(i);
        const garment = garmentTypes[i];
        
        try {
          await generateImageForGarment(garment);
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (err) {
          console.error(`Failed to generate ${garment.name}:`, err);
          break;
        }
      }
    }
  };

  const handleSkip = () => {
    if (currentIndex < garmentTypes.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleReloadFromStorage = async () => {
    setSaveStatus('Reloading from storage...');
    await loadImages();
    setSaveStatus(`✓ Loaded ${count} images from storage`);
    Alert.alert('Reloaded', `Successfully loaded ${count} images from storage`);
  };

  const handleExport = async () => {
    const code = `// Generated AI images for garments
export const garmentAIImages: Record<string, string> = ${JSON.stringify(generatedImages, null, 2)};
`;
    console.log('Export this to a new file:');
    console.log(code);
    alert('Check console for export code');
  };

  const currentGarment = garmentTypes[currentIndex];
  const progress = ((count / garmentTypes.length) * 100).toFixed(1);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          title: 'Generate Garment Images',
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#fff',
        }} 
      />

      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>AI Garment Image Generator</Text>
          <Text style={styles.subtitle}>
            Progress: {count} / {garmentTypes.length} ({progress}%)
          </Text>
          {saveStatus ? (
            <Text style={styles.saveStatus}>{saveStatus}</Text>
          ) : null}
          {failedSaves.length > 0 && (
            <Text style={styles.failedStatus}>⚠️ {failedSaves.length} failed saves</Text>
          )}
        </View>

        {currentGarment && (
          <View style={styles.currentSection}>
            <Text style={styles.sectionTitle}>Current Garment:</Text>
            <View style={styles.garmentCard}>
              <Text style={styles.garmentName}>{currentGarment.name}</Text>
              <Text style={styles.garmentNameAr}>{currentGarment.nameAr}</Text>
              <Text style={styles.garmentDetails}>
                Category: {currentGarment.category}
              </Text>
              <Text style={styles.garmentDetails}>
                Price: ${currentGarment.price}
              </Text>
              {currentGarment.description && (
                <Text style={styles.garmentDescription}>{currentGarment.description}</Text>
              )}
            </View>

            {generating && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Generating AI sketch...</Text>
              </View>
            )}

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {generatedImages[currentGarment.id] && (
              <View style={styles.imagePreview}>
                <Text style={styles.previewLabel}>Generated Image:</Text>
                <Image 
                  source={{ uri: generatedImages[currentGarment.id] }}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
              </View>
            )}
          </View>
        )}

        {currentIndex >= garmentTypes.length && (
          <View style={styles.completeContainer}>
            <Text style={styles.completeText}>✅ All garments generated!</Text>
            <Text style={styles.completeSubtext}>
              Generated {count} images
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton, generating && styles.buttonDisabled]}
            onPress={handleGenerateCurrent}
            disabled={generating || currentIndex >= garmentTypes.length}
          >
            <Text style={styles.buttonText}>
              {generating ? 'Generating...' : 'Generate Current'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]}
            onPress={handleSkip}
            disabled={generating || currentIndex >= garmentTypes.length}
          >
            <Text style={styles.buttonText}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.successButton, generating && styles.buttonDisabled]}
            onPress={handleGenerateAll}
            disabled={generating || currentIndex >= garmentTypes.length}
          >
            <Text style={styles.buttonText}>Generate All Remaining</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.warningButton]}
            onPress={handleReloadFromStorage}
          >
            <Text style={styles.buttonText}>🔄 Reload from Storage</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.exportButton]}
            onPress={handleExport}
          >
            <Text style={styles.buttonText}>Export to Console</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.generatedList}>
          <Text style={styles.sectionTitle}>Generated ({count}):</Text>
          {Object.entries(generatedImages).map(([id, url]) => {
            const garment = garmentTypes.find(g => g.id === id);
            return (
              <View key={id} style={styles.generatedItem}>
                <Image source={{ uri: url }} style={styles.thumbImage} />
                <Text style={styles.thumbText}>{garment?.name || id}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3e',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
  },
  saveStatus: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 8,
  },
  failedStatus: {
    fontSize: 14,
    color: '#FF9800',
    marginTop: 4,
  },
  currentSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  garmentCard: {
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  garmentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  garmentNameAr: {
    fontSize: 18,
    color: '#aaa',
    marginBottom: 12,
  },
  garmentDetails: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
  },
  garmentDescription: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    marginBottom: 16,
  },
  loadingText: {
    color: '#4CAF50',
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: '#ff4444',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
  },
  imagePreview: {
    marginBottom: 16,
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  previewImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#2a2a3e',
    borderRadius: 12,
  },
  completeContainer: {
    alignItems: 'center',
    padding: 32,
  },
  completeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  completeSubtext: {
    fontSize: 16,
    color: '#aaa',
  },
  buttonContainer: {
    padding: 20,
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  secondaryButton: {
    backgroundColor: '#666',
  },
  successButton: {
    backgroundColor: '#2196F3',
  },
  exportButton: {
    backgroundColor: '#FF9800',
  },
  warningButton: {
    backgroundColor: '#9C27B0',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  generatedList: {
    padding: 20,
  },
  generatedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  thumbImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#2a2a3e',
  },
  thumbText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
});
