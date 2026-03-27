import AsyncStorage from "@react-native-async-storage/async-storage";

export async function emergencyCleanup(): Promise<void> {
  console.log("[EmergencyCleanup] Starting emergency cleanup...");
  
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    console.log("[EmergencyCleanup] Found", allKeys.length, "keys");
    
    for (const key of allKeys) {
      if (key === 'garment_ai_images' || key === 'ai_garment_icons' || key.startsWith('garment_image_')) {
        console.log(`[EmergencyCleanup] Skipping protected AI image storage: ${key}`);
        continue;
      }
      
      try {
        const value = await AsyncStorage.getItem(key);
        
        if (!value) {
          continue;
        }
        
        const trimmed = value.trim();
        
        if (
          trimmed === '' ||
          trimmed === 'null' ||
          trimmed === 'undefined' ||
          trimmed === 'NaN' ||
          trimmed === 'object' ||
          trimmed === 'object Object' ||
          trimmed === '[object Object]' ||
          trimmed.startsWith('[object ') ||
          trimmed.startsWith('object ') ||
          trimmed.includes('NaN') ||
          trimmed.includes('undefined') ||
          trimmed.includes('object Object')
        ) {
          console.warn(`[EmergencyCleanup] Removing corrupted key: ${key} with value: ${trimmed.substring(0, 50)}`);
          await AsyncStorage.removeItem(key);
          continue;
        }
        
        if (!trimmed.startsWith('{') && !trimmed.startsWith('[') && !trimmed.startsWith('"')) {
          const validSimpleValues = ['light', 'dark', 'en', 'ar', 'fr', 'guest', 'teal', 'purple', 'rose', 'blue', 'green', 'sunset', 'true', 'false'];
          const isNumber = !isNaN(parseFloat(trimmed)) && isFinite(Number(trimmed));
          const isSimpleString = /^[a-zA-Z0-9_\-]{1,50}$/.test(trimmed);
          
          if (!validSimpleValues.includes(trimmed) && !isNumber && !isSimpleString) {
            console.warn(`[EmergencyCleanup] Removing non-JSON key: ${key} with value: ${trimmed.substring(0, 50)}`);
            await AsyncStorage.removeItem(key);
            continue;
          }
        } else {
          try {
            JSON.parse(trimmed);
          } catch (e) {
            console.warn(`[EmergencyCleanup] Removing unparseable key: ${key}, error: ${e}`);
            await AsyncStorage.removeItem(key);
            continue;
          }
        }
      } catch (error) {
        console.error(`[EmergencyCleanup] Error processing ${key}:`, error);
        try {
          await AsyncStorage.removeItem(key);
        } catch (removeError) {
          console.error(`[EmergencyCleanup] Failed to remove ${key}:`, removeError);
        }
      }
    }
    
    console.log("[EmergencyCleanup] Emergency cleanup complete");
  } catch (error) {
    console.error("[EmergencyCleanup] Critical error:", error);
    try {
      console.log("[EmergencyCleanup] Attempting nuclear cleanup...");
      await AsyncStorage.clear();
      console.log("[EmergencyCleanup] All storage cleared");
    } catch (clearError) {
      console.error("[EmergencyCleanup] Failed to clear storage:", clearError);
    }
  }
}
