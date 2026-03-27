import AsyncStorage from '@react-native-async-storage/async-storage';
import { safeJsonParse } from './safeJsonParse';

export async function validateAndCleanStorage(): Promise<void> {
  console.log('[StorageValidator] Starting storage validation...');
  
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    console.log(`[StorageValidator] Found ${allKeys.length} storage keys`);
    
    const corruptedKeys: string[] = [];
    const validKeys: string[] = [];
    
    for (const key of allKeys) {
      try {
        // PROTECT AI-GENERATED IMAGES - NEVER DELETE THESE
        if (
          key === 'garment_ai_images' ||
          key === 'ai_garment_icons' ||
          key === 'garment_images_index' ||
          key === 'garment_images_manifest_v2' ||
          key.startsWith('garment_image_')
        ) {
          console.log(`[StorageValidator] ⭐ PROTECTED: Skipping ${key} (AI images)`);
          validKeys.push(key);
          continue;
        }
        
        const value = await AsyncStorage.getItem(key);
        
        if (!value) {
          console.log(`[StorageValidator] Empty value for key: ${key}`);
          continue;
        }
        
        if (value.includes('[object Object]') || 
            value.includes('[object Array]') || 
            value.startsWith('object') ||
            /^\[object\s/.test(value)) {
          console.warn(`[StorageValidator] ❌ Corrupted key found: ${key}`);
          corruptedKeys.push(key);
          continue;
        }
        
        const parsed = safeJsonParse(value);
        if (parsed === null && value.trim().startsWith('{') || value.trim().startsWith('[')) {
          console.warn(`[StorageValidator] ❌ Unparseable JSON in key: ${key}`);
          corruptedKeys.push(key);
          continue;
        }
        
        validKeys.push(key);
        console.log(`[StorageValidator] ✅ Valid key: ${key}`);
      } catch (error) {
        console.error(`[StorageValidator] ❌ Error checking key ${key}:`, error);
        corruptedKeys.push(key);
      }
    }
    
    if (corruptedKeys.length > 0) {
      console.log(`[StorageValidator] Removing ${corruptedKeys.length} corrupted keys...`);
      await AsyncStorage.multiRemove(corruptedKeys);
      console.log('[StorageValidator] ✅ Corrupted keys removed:', corruptedKeys);
    } else {
      console.log('[StorageValidator] ✅ All storage keys are valid');
    }
    
    console.log(`[StorageValidator] Summary: ${validKeys.length} valid, ${corruptedKeys.length} corrupted`);
  } catch (error) {
    console.error('[StorageValidator] Fatal error during validation:', error);
  }
}
