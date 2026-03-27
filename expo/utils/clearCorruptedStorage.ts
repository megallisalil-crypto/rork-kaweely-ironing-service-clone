import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Clears all corrupted AsyncStorage entries
 * Returns the number of corrupted entries found and cleared
 */
export async function clearCorruptedStorage(): Promise<number> {
  console.log("[clearCorruptedStorage] Starting scan...");
  let corruptedCount = 0;

  try {
    let allKeys: readonly string[] = [];
    try {
      allKeys = await AsyncStorage.getAllKeys();
      console.log(`[clearCorruptedStorage] Found ${allKeys.length} total keys`);
    } catch (keysError) {
      console.error("[clearCorruptedStorage] Failed to get keys, clearing all:", keysError);
      try {
        await AsyncStorage.clear();
        return 1;
      } catch (clearErr) {
        console.error("[clearCorruptedStorage] Failed to clear storage:", clearErr);
        return 0;
      }
    }

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
          console.log(`[clearCorruptedStorage] ⭐ PROTECTED: Skipping ${key}`);
          continue;
        }

        let value: string | null = null;
        try {
          value = await AsyncStorage.getItem(key);
        } catch (getError) {
          console.error(`[clearCorruptedStorage] Failed to get key ${key}, removing it:`, getError);
          try {
            await AsyncStorage.removeItem(key);
            corruptedCount++;
          } catch {}
          continue;
        }
        
        if (!value) {
          console.log(`[clearCorruptedStorage] Skipping null/empty value for ${key}`);
          continue;
        }

        if (typeof value !== 'string') {
          console.error(`[clearCorruptedStorage] Value is not a string for ${key}, removing`);
          try {
            await AsyncStorage.removeItem(key);
            corruptedCount++;
          } catch {}
          continue;
        }

        let trimmed: string;
        try {
          trimmed = value.trim();
        } catch (trimErr) {
          console.error(`[clearCorruptedStorage] Failed to trim value for ${key}, removing:`, trimErr);
          try {
            await AsyncStorage.removeItem(key);
            corruptedCount++;
          } catch {}
          continue;
        }
        
        if (
          trimmed === '' ||
          trimmed === 'null' ||
          trimmed === 'undefined' ||
          trimmed === 'NaN' ||
          trimmed === 'o' ||
          trimmed === 'object' ||
          trimmed === '[object Object]' ||
          trimmed === '[object Array]' ||
          trimmed === 'object Object' ||
          trimmed.startsWith('object ') ||
          trimmed.startsWith('[object') ||
          trimmed.includes('NaN') ||
          trimmed.includes('undefined') ||
          trimmed.includes('\u0000') ||
          /[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(trimmed) ||
          (trimmed.startsWith('o') && trimmed.length < 10 && !trimmed.startsWith('{') && !trimmed.startsWith('['))
        ) {
          console.warn(`[clearCorruptedStorage] Removing corrupted key: ${key}`);
          try {
            await AsyncStorage.removeItem(key);
            corruptedCount++;
          } catch {}
          continue;
        }

        if (trimmed.startsWith('{') || trimmed.startsWith('[') || trimmed.startsWith('"')) {
          try {
            const testParse = trimmed.substring(0, Math.min(100, trimmed.length));
            if (/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(testParse)) {
              console.warn(`[clearCorruptedStorage] Binary/control chars detected in ${key}, removing`);
              try {
                await AsyncStorage.removeItem(key);
                corruptedCount++;
              } catch {}
              continue;
            }
            
            if (trimmed.includes('}{') || trimmed.includes('][')) {
              console.warn(`[clearCorruptedStorage] Malformed JSON (multiple objects/arrays) in ${key}, removing`);
              try {
                await AsyncStorage.removeItem(key);
                corruptedCount++;
              } catch {}
              continue;
            }
            
            let parsed: any;
            try {
              parsed = JSON.parse(trimmed);
            } catch (parseError: any) {
              console.warn(`[clearCorruptedStorage] Removing unparseable JSON key: ${key}`);
              console.warn(`[clearCorruptedStorage] Parse error:`, parseError?.message || parseError);
              console.warn(`[clearCorruptedStorage] First 100 chars:`, trimmed.substring(0, 100));
              try {
                await AsyncStorage.removeItem(key);
                corruptedCount++;
              } catch {}
              continue;
            }
            
            if (parsed === null || parsed === undefined) {
              console.warn(`[clearCorruptedStorage] Parsed to null/undefined, removing key: ${key}`);
              await AsyncStorage.removeItem(key);
              corruptedCount++;
              continue;
            }
            
            if (key === 'kaweely_orders' && Array.isArray(parsed)) {
              const validOrders = parsed.filter((order: any) => {
                if (!order || typeof order !== 'object') return false;
                if (!order.id || !order.orderNumber || !order.status) return false;
                return true;
              });
              
              if (validOrders.length !== parsed.length) {
                console.warn(`[clearCorruptedStorage] Found ${parsed.length - validOrders.length} invalid orders in kaweely_orders`);
                if (validOrders.length === 0) {
                  console.warn(`[clearCorruptedStorage] No valid orders remain, clearing kaweely_orders`);
                  await AsyncStorage.removeItem(key);
                  corruptedCount++;
                } else {
                  console.log(`[clearCorruptedStorage] Saving ${validOrders.length} valid orders`);
                  await AsyncStorage.setItem(key, JSON.stringify(validOrders));
                  corruptedCount++;
                }
                continue;
              }
            }
          } catch (parseError: any) {
            console.warn(`[clearCorruptedStorage] Error parsing ${key}:`, parseError?.message || parseError);
            try {
              await AsyncStorage.removeItem(key);
              corruptedCount++;
            } catch {}
            continue;
          }
        }
      } catch (error) {
        console.error(`[clearCorruptedStorage] Error checking key ${key}:`, error);
        try {
          await AsyncStorage.removeItem(key);
          corruptedCount++;
        } catch {}
      }
    }

    console.log(`[clearCorruptedStorage] Finished. Cleared ${corruptedCount} corrupted entries`);
    return corruptedCount;
  } catch (error) {
    console.error("[clearCorruptedStorage] Fatal error, clearing all storage:", error);
    try {
      await AsyncStorage.clear();
      return 1;
    } catch (clearError) {
      console.error("[clearCorruptedStorage] Failed to clear storage:", clearError);
      return 0;
    }
  }
}

/**
 * Clears ALL AsyncStorage entries (nuclear option)
 */
export async function clearAllStorage(): Promise<void> {
  try {
    console.log("[clearAllStorage] Clearing all storage...");
    await AsyncStorage.clear();
    console.log("[clearAllStorage] All storage cleared");
  } catch (error) {
    console.error("[clearAllStorage] Error:", error);
    throw error;
  }
}
