import AsyncStorage from "@react-native-async-storage/async-storage";

export function safeJSONParse<T = any>(value: string, fallback: T): T {
  try {
    if (!value || typeof value !== 'string') {
      console.warn('[safeJSONParse] Invalid input, returning fallback');
      return fallback;
    }
    
    const trimmedValue = value.trim();
    
    if (trimmedValue === '' || 
        trimmedValue === 'null' || 
        trimmedValue === 'undefined' || 
        trimmedValue === 'NaN' ||
        trimmedValue === '[object Object]' ||
        trimmedValue.startsWith('[object ') ||
        trimmedValue === 'object' ||
        trimmedValue === 'object Object' ||
        trimmedValue.startsWith('object ')) {
      console.warn('[safeJSONParse] Invalid value detected:', trimmedValue.substring(0, 50));
      return fallback;
    }
    
    // Additional check: if it doesn't start with { or [ and isn't a quoted string or primitive
    if (!trimmedValue.startsWith('{') && 
        !trimmedValue.startsWith('[') && 
        !trimmedValue.startsWith('"') &&
        trimmedValue !== 'true' &&
        trimmedValue !== 'false' &&
        isNaN(Number(trimmedValue))) {
      // Check if it's a short alphanumeric value (valid simple strings like language codes)
      if (/^[a-zA-Z0-9_\-]{1,20}$/.test(trimmedValue)) {
        // It's a valid simple value, return as is
        return trimmedValue as any;
      }
      console.warn('[safeJSONParse] Value is not valid JSON:', trimmedValue.substring(0, 50));
      return fallback;
    }
    
    const parsed = JSON.parse(trimmedValue);
    return parsed as T;
  } catch (error) {
    console.error('[safeJSONParse] Parse error:', error);
    console.log('[safeJSONParse] Failed value:', value?.substring(0, 100));
    return fallback;
  }
}

export function safeJSONStringify(value: any): string | null {
  try {
    if (value === undefined || value === null) {
      return null;
    }
    
    const jsonString = JSON.stringify(value, (key, val) => {
      if (val !== val) return null; // NaN
      if (val === Infinity || val === -Infinity) return null;
      if (typeof val === 'number' && !isFinite(val)) return null;
      if (typeof val === 'function') return null;
      return val;
    });
    
    if (!jsonString || jsonString === 'undefined' || jsonString === 'null' || jsonString.includes('NaN')) {
      console.error('[safeJSONStringify] Invalid JSON generated');
      return null;
    }
    
    return jsonString;
  } catch (error) {
    console.error('[safeJSONStringify] Stringify error:', error);
    return null;
  }
}

const STORAGE_KEYS = [
  "kaweely_orders",
  "kaweely_loyalty",
  "kaweely_profile",
  "kaweely_notified_offers",
  "kaweely_language",
  "cart_items",
  "kaweely_auth",
  "kaweely_wallet",
  "kaweely_transactions",
  "kaweely_theme",
  "kaweely_color_scheme",
  "kaweely_subscription",
  "kaweely_feedbacks",
  "kaweely_delivery_address",
  "garment_ai_images",
  "ai_garment_icons",
  "garment_images_index",
  "garment_images_manifest_v2",
];

function isInvalidValue(value: string | null): boolean {
  if (!value) return true;
  if (typeof value !== 'string') return true;
  
  const trimmedValue = value.trim();
  
  if (trimmedValue === '' || 
      trimmedValue === 'null' || 
      trimmedValue === 'undefined' || 
      trimmedValue === 'NaN' ||
      trimmedValue.includes('NaN') ||
      trimmedValue.includes('undefined')) {
    return true;
  }
  
  return false;
}

function isValidJSON(value: string): boolean {
  const trimmedValue = value.trim();
  
  // Check for [object Object] or similar toString() results
  if (trimmedValue.startsWith('[object') || trimmedValue === '[object Object]' || trimmedValue.includes('[object')) {
    console.warn('[StorageCleanup] Found [object] string:', trimmedValue.substring(0, 50));
    return false;
  }
  
  // More aggressive check for object toString patterns
  // This catches cases where JSON.parse fails with "Unexpected character: o"
  if (trimmedValue === 'object' || 
      trimmedValue === 'object Object' || 
      trimmedValue === '[object]' || 
      trimmedValue.startsWith('object ') ||
      (trimmedValue.startsWith('o') && trimmedValue.length < 10 && !trimmedValue.match(/^[0-9]+$/) && !['on', 'off'].includes(trimmedValue))) {
    console.warn('[StorageCleanup] Found object toString pattern:', trimmedValue);
    return false;
  }
  
  if (trimmedValue.includes('object Object') || 
      trimmedValue.includes('object HTMLElement') ||
      /\[object [A-Z]/.test(trimmedValue)) {
    console.warn('[StorageCleanup] Found object toString in value');
    return false;
  }
  
  // Allow plain string values (not just JSON)
  if (!trimmedValue.startsWith('{') && !trimmedValue.startsWith('[') && !trimmedValue.startsWith('"')) {
    // Check if it's a valid number
    const num = parseFloat(trimmedValue);
    if (!isNaN(num) && isFinite(num)) {
      return true;
    }
    // Check if it's a boolean
    if (trimmedValue === 'true' || trimmedValue === 'false') {
      return true;
    }
    // Check if it's a valid theme, language code, or color scheme
    const validSimpleValues = ['light', 'dark', 'en', 'ar', 'fr', 'guest', 'teal', 'purple', 'rose', 'blue', 'green', 'sunset'];
    if (validSimpleValues.includes(trimmedValue)) {
      return true;
    }
    
    // Allow short alphanumeric strings (like IDs or simple values)
    // But be more strict - must be simple and short
    if (/^[a-zA-Z0-9_\-]+$/.test(trimmedValue) && trimmedValue.length < 50) {
      return true;
    }
    
    console.warn('[StorageCleanup] Found non-JSON value:', trimmedValue.substring(0, 20));
    return false;
  }
  
  // Try to parse as JSON
  try {
    JSON.parse(trimmedValue);
    return true;
  } catch (e) {
    console.warn('[StorageCleanup] JSON parse failed:', e);
    return false;
  }
}

export async function validateAndCleanStorage() {
  console.log("[StorageCleanup] Starting validation...");
  let cleanedCount = 0;
  let allKeys: readonly string[] = [];
  
  try {
    allKeys = await AsyncStorage.getAllKeys();
    console.log("[StorageCleanup] Found", allKeys.length, "total keys in storage");
  } catch (error) {
    console.error("[StorageCleanup] Failed to get all keys:", error);
    return 0;
  }
  
  const keysToCheck = [...new Set([...STORAGE_KEYS, ...allKeys])];
  console.log("[StorageCleanup] Checking", keysToCheck.length, "keys");
  
  for (const key of keysToCheck) {
    try {
      // PROTECT AI-GENERATED IMAGES - NEVER DELETE THESE
      if (
        key === 'garment_ai_images' ||
        key === 'ai_garment_icons' ||
        key === 'garment_images_index' ||
        key === 'garment_images_manifest_v2' ||
        key.startsWith('garment_image_')
      ) {
        console.log(`[StorageCleanup] ⭐ PROTECTED: Skipping validation for ${key} (AI images)`);
        continue;
      }
      
      const value = await AsyncStorage.getItem(key);
      
      if (!value) {
        continue;
      }
      
      const preview = value.length > 50 ? value.substring(0, 50) + '...' : value;
      console.log(`[StorageCleanup] Checking ${key}: ${preview}`);
      
      if (isInvalidValue(value)) {
        console.warn(`[StorageCleanup] Invalid value for ${key}, removing`);
        await AsyncStorage.removeItem(key);
        cleanedCount++;
        continue;
      }
      
      if (!isValidJSON(value)) {
        const errorPreview = value.length > 100 ? value.substring(0, 100) + '...' : value;
        console.warn(`[StorageCleanup] Invalid JSON for ${key}, removing. Value:`, errorPreview);
        await AsyncStorage.removeItem(key);
        cleanedCount++;
        continue;
      }
      
      console.log(`[StorageCleanup] ${key} is valid`);
    } catch (error) {
      console.error(`[StorageCleanup] Error processing ${key}:`, error);
      try {
        await AsyncStorage.removeItem(key);
        cleanedCount++;
        console.log(`[StorageCleanup] Removed problematic key ${key}`);
      } catch (removeError) {
        console.error(`[StorageCleanup] Error removing ${key}:`, removeError);
      }
    }
  }
  
  console.log(`[StorageCleanup] Validation complete. Cleaned ${cleanedCount} keys.`);
  return cleanedCount;
}

export async function clearCorruptedStorage() {
  try {
    const cleanedCount = await validateAndCleanStorage();
    console.log(`[StorageCleanup] Cleanup complete. Cleaned ${cleanedCount} corrupted keys`);
    return cleanedCount;
  } catch (error) {
    console.error("[StorageCleanup] Error during cleanup:", error);
    return 0;
  }
}

export async function clearAllStorage() {
  console.log("[StorageCleanup] CLEARING ALL STORAGE");
  try {
    for (const key of STORAGE_KEYS) {
      try {
        await AsyncStorage.removeItem(key);
        console.log(`[StorageCleanup] Removed ${key}`);
      } catch (error) {
        console.error(`[StorageCleanup] Error removing ${key}:`, error);
      }
    }
    console.log("[StorageCleanup] All storage cleared");
    return true;
  } catch (error) {
    console.error("[StorageCleanup] Error clearing all storage:", error);
    return false;
  }
}

export async function safeSetItem(key: string, value: string): Promise<boolean> {
  try {
    // PROTECT AI-GENERATED IMAGES - Skip validation for these keys
    if (
      key === 'garment_ai_images' ||
      key === 'ai_garment_icons' ||
      key === 'garment_images_index' ||
      key === 'garment_images_manifest_v2' ||
      key.startsWith('garment_image_')
    ) {
      console.log(`[StorageCleanup] ⭐ PROTECTED: Saving ${key} without validation`);
      await AsyncStorage.setItem(key, value);
      return true;
    }
    
    if (isInvalidValue(value)) {
      console.error(`[StorageCleanup] Refusing to store invalid value for ${key}`);
      return false;
    }
    
    if (!isValidJSON(value)) {
      console.error(`[StorageCleanup] Refusing to store invalid JSON for ${key}`);
      return false;
    }
    
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`[StorageCleanup] Error storing ${key}:`, error);
    return false;
  }
}

export async function safeGetItem(key: string): Promise<string | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    
    if (!value) {
      return null;
    }
    
    // PROTECT AI-GENERATED IMAGES - Skip validation for these keys
    if (
      key === 'garment_ai_images' ||
      key === 'ai_garment_icons' ||
      key === 'garment_images_index' ||
      key === 'garment_images_manifest_v2' ||
      key.startsWith('garment_image_')
    ) {
      console.log(`[StorageCleanup] ⭐ PROTECTED: Loading ${key} without validation`);
      return value;
    }
    
    if (isInvalidValue(value)) {
      console.warn(`[StorageCleanup] Found invalid value for ${key}, removing`);
      await AsyncStorage.removeItem(key);
      return null;
    }
    
    if (!isValidJSON(value)) {
      console.warn(`[StorageCleanup] Found invalid JSON for ${key}, removing`);
      await AsyncStorage.removeItem(key);
      return null;
    }
    
    return value;
  } catch (error) {
    console.error(`[StorageCleanup] Error getting ${key}:`, error);
    return null;
  }
}
