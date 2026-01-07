import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, RefreshCw, Trash2, CheckCircle, XCircle } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { garmentTypes } from '@/constants/garmentTypes';
import { safeJsonParse } from '@/utils/safeJsonParse';

export default function TestIconsScreen() {
  const [iconCache, setIconCache] = useState<Record<string, string>>({});
  const [rawCache, setRawCache] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCache();
  }, []);

  const loadCache = async () => {
    setIsLoading(true);
    try {
      const cached = await AsyncStorage.getItem('ai_garment_icons');
      setRawCache(cached || 'No cache found');
      
      if (cached) {
        const parsed = safeJsonParse<Record<string, string>>(cached);
        if (parsed) {
          setIconCache(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load cache:', error);
      Alert.alert('Error', 'Failed to load icon cache');
    } finally {
      setIsLoading(false);
    }
  };

  const clearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear all cached icons?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('ai_garment_icons');
            setIconCache({});
            setRawCache('Cache cleared');
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const firstTenGarments = garmentTypes.slice(0, 10);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Test Icon Cache',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="#333" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Cache Statistics</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Garments:</Text>
            <Text style={styles.statValue}>{garmentTypes.length}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Icons in Cache:</Text>
            <Text style={[styles.statValue, { color: '#10B981' }]}>
              {Object.keys(iconCache).length}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Missing:</Text>
            <Text style={[styles.statValue, { color: '#EF4444' }]}>
              {garmentTypes.length - Object.keys(iconCache).length}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={loadCache}
            disabled={isLoading}
          >
            <RefreshCw size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Reload Cache</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={clearCache}
          >
            <Trash2 size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Clear Cache</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.previewSection}>
          <Text style={styles.previewTitle}>First 10 Garments Status</Text>
          <Text style={styles.previewSubtitle}>
            Check if &quot;Dress Shirt&quot; (id: 1) has an icon
          </Text>
          
          <View style={styles.garmentsList}>
            {firstTenGarments.map((garment) => {
              const hasIcon = !!iconCache[garment.id];
              const iconData = iconCache[garment.id];
              
              return (
                <View key={garment.id} style={styles.garmentRow}>
                  <View style={styles.garmentInfo}>
                    {hasIcon ? (
                      <CheckCircle size={20} color="#10B981" />
                    ) : (
                      <XCircle size={20} color="#EF4444" />
                    )}
                    <Text style={styles.garmentName}>
                      {garment.name} (id: {garment.id})
                    </Text>
                  </View>
                  
                  {hasIcon && iconData ? (
                    <View style={styles.iconPreviewContainer}>
                      <Image
                        source={{ uri: iconData }}
                        style={styles.iconPreview}
                        onError={() => console.log('Failed to load icon for', garment.name)}
                      />
                    </View>
                  ) : (
                    <View style={styles.iconPlaceholder}>
                      <Text style={styles.iconEmoji}>{garment.icon}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.rawDataSection}>
          <Text style={styles.rawDataTitle}>Raw Cache Data (First 500 chars)</Text>
          <ScrollView style={styles.rawDataScroll} horizontal>
            <Text style={styles.rawDataText}>
              {rawCache.substring(0, 500)}
              {rawCache.length > 500 ? '...' : ''}
            </Text>
          </ScrollView>
          <Text style={styles.rawDataInfo}>
            Total length: {rawCache.length} characters
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
  statsCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#111827',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500' as const,
  },
  statValue: {
    fontSize: 18,
    color: '#111827',
    fontWeight: '700' as const,
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
  dangerButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  previewSection: {
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#111827',
    marginBottom: 4,
  },
  previewSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  garmentsList: {
    gap: 12,
  },
  garmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  garmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  garmentName: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500' as const,
  },
  iconPreviewContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconPreview: {
    width: 36,
    height: 36,
    borderRadius: 6,
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconEmoji: {
    fontSize: 20,
  },
  rawDataSection: {
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  rawDataTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#0369A1',
    marginBottom: 12,
  },
  rawDataScroll: {
    maxHeight: 200,
  },
  rawDataText: {
    fontSize: 12,
    color: '#075985',
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  rawDataInfo: {
    fontSize: 12,
    color: '#075985',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
