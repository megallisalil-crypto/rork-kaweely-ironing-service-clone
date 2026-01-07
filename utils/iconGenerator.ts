import { garmentTypes, GarmentType } from '@/constants/garmentTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { safeJsonParse, safeJsonStringify } from '@/utils/safeJsonParse';

const ICON_CACHE_KEY = 'ai_garment_icons';

export type IconGenerationStatus = {
  total: number;
  generated: number;
  current: string;
  currentGarmentId?: string;
  isComplete: boolean;
};

async function generateIconForGarment(garment: GarmentType, retries = 3): Promise<string> {
  const prompt = `Create a minimalist icon for ${garment.name}. Simple line art on transparent background. Clean, professional style for laundry app. No text.`;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    let controller: AbortController | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    
    try {
      controller = new AbortController();
      timeoutId = setTimeout(() => {
        if (controller) {
          controller.abort();
        }
      }, 60000);

      console.log(`🔄 Attempt ${attempt + 1}/${retries + 1} for ${garment.name}...`);

      const response = await fetch('https://toolkit.rork.com/images/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          size: '1024x1024'
        }),
        signal: controller.signal,
      });

      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      console.log(`📥 Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unable to read response');
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      console.log('✓ API Response received for', garment.name);
      
      const base64Data = data?.image?.base64Data || data?.image?.base64;
      const mimeType = data?.image?.mimeType || 'image/png';
      
      if (!base64Data) {
        console.error('Invalid response format. Full response:', JSON.stringify(data, null, 2).substring(0, 500));
        throw new Error(`Invalid response format from API. Missing base64 data`);
      }

      console.log(`✅ Successfully generated icon for ${garment.name}`);
      return `data:${mimeType};base64,${base64Data}`;
    } catch (error: any) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      lastError = error instanceof Error ? error : new Error(String(error));
      
      let errorMsg = lastError.message;
      let errorType = lastError.name;
      
      if (lastError.name === 'AbortError' || error.name === 'AbortError') {
        errorMsg = 'Request timeout (60s)';
        errorType = 'Timeout';
      } else if (errorMsg.includes('Network request failed') || errorMsg.toLowerCase().includes('network')) {
        errorMsg = 'Network connection failed';
        errorType = 'NetworkError';
      } else if (errorMsg.includes('Failed to fetch')) {
        errorMsg = 'Cannot reach server';
        errorType = 'FetchError';
      }
      
      console.error(`❌ Attempt ${attempt + 1}/${retries + 1} failed for ${garment.name}:`, errorMsg);
      console.error(`🐛 Error type: ${errorType}`);
      
      if (attempt < retries) {
        const delay = Math.min(5000 * (attempt + 1), 15000);
        console.log(`⏳ Waiting ${Math.round(delay/1000)}s before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('All retry attempts exhausted');
}

export async function generateAllIcons(
  onProgress?: (status: IconGenerationStatus) => void,
  onError?: (garmentName: string, error: Error) => void,
  onIconGenerated?: (garmentId: string, iconData: string) => void,
  shouldPause?: () => boolean
): Promise<Record<string, string>> {
  const cached = await AsyncStorage.getItem(ICON_CACHE_KEY);
  const iconMap: Record<string, string> = cached ? (safeJsonParse(cached) || {}) : {};

  const total = garmentTypes.length;
  let generated = Object.keys(iconMap).length;

  const remainingGarments = garmentTypes.filter(g => !iconMap[g.id]);
  
  if (remainingGarments.length === 0) {
    if (onProgress) {
      onProgress({
        total,
        generated: total,
        current: 'All icons already generated!',
        isComplete: true,
      });
    }
    return iconMap;
  }

  console.log(`🚀 Starting ONE-BY-ONE generation of ${remainingGarments.length} icons...`);

  for (let i = 0; i < remainingGarments.length; i++) {
    if (shouldPause && shouldPause()) {
      console.log('⏸️ Generation paused by user');
      break;
    }

    const garment = remainingGarments[i];
    
    try {
      if (onProgress) {
        onProgress({
          total,
          generated,
          current: `Generating ${garment.name}...`,
          currentGarmentId: garment.id,
          isComplete: false,
        });
      }

      console.log(`\n📸 [${i + 1}/${remainingGarments.length}] Generating ONE icon: ${garment.name}`);
      console.log(`⏳ This will take about 10-15 seconds...`);
      
      const icon = await generateIconForGarment(garment);

      if (shouldPause && shouldPause()) {
        console.log('⏸️ Generation paused after completing current item');
        generated++;
        iconMap[garment.id] = icon;
        try {
          await AsyncStorage.setItem(ICON_CACHE_KEY, JSON.stringify(iconMap));
        } catch (e) {
          console.error('Failed to save before pause:', e);
        }
        break;
      }
      iconMap[garment.id] = icon;
      generated++;
      
      try {
        const jsonString = JSON.stringify(iconMap);
        if (!jsonString || jsonString === '{}' || jsonString === 'null') {
          console.error(`❌ Invalid JSON for ${garment.name}`);
          continue;
        }
        await AsyncStorage.setItem(ICON_CACHE_KEY, jsonString);
        console.log(`💾 Saved to storage: ${garment.name}`);
      } catch (saveError) {
        console.error(`❌ Failed to save ${garment.name} to storage:`, saveError);
        try {
          await AsyncStorage.removeItem(ICON_CACHE_KEY);
          console.log('🧹 Cleared corrupted storage');
        } catch (e) {
          console.error('Failed to clear storage:', e);
        }
      }
      
      console.log(`✅ Successfully saved ${garment.name} (${generated}/${total} total)`);
      
      if (onIconGenerated) {
        onIconGenerated(garment.id, icon);
      }
      
      if (onProgress) {
        onProgress({
          total,
          generated,
          current: `Generated ${garment.name}`,
          currentGarmentId: garment.id,
          isComplete: false,
        });
      }

      if (i < remainingGarments.length - 1 && (!shouldPause || !shouldPause())) {
        const delay = 2000;
        console.log(`⏳ Waiting ${delay/1000}s before next item...`);
        for (let j = 0; j < delay / 100; j++) {
          if (shouldPause && shouldPause()) {
            console.log('⏸️ Paused during wait period');
            break;
          }
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } catch (error) {
      console.error(`❌ Failed to generate ${garment.name}:`, error);
      if (onError) {
        onError(garment.name, error instanceof Error ? error : new Error(String(error)));
      }
    }
  }

  if (onProgress) {
    onProgress({
      total,
      generated,
      current: generated === total ? 'All icons generated!' : `Generated ${generated}/${total} icons`,
      isComplete: generated === total,
    });
  }

  if (generated === total) {
    console.log('🎉 All icons generated! Saving to file...');
    try {
      await saveIconsToFile(iconMap);
      console.log('✅ Icons saved to file successfully!');
    } catch (error) {
      console.error('❌ Failed to save icons to file:', error);
    }
  }

  return iconMap;
}

export async function getCachedIcons(): Promise<Record<string, string>> {
  const cached = await AsyncStorage.getItem(ICON_CACHE_KEY);
  return cached ? (safeJsonParse(cached) || {}) : {};
}

export async function clearIconCache(): Promise<void> {
  await AsyncStorage.removeItem(ICON_CACHE_KEY);
}

export async function getIconForGarment(garmentId: string): Promise<string | null> {
  const cached = await getCachedIcons();
  return cached[garmentId] || null;
}

export async function regenerateIcon(garmentId: string): Promise<string> {
  const garment = garmentTypes.find(g => g.id === garmentId);
  if (!garment) {
    throw new Error('Garment not found');
  }

  const icon = await generateIconForGarment(garment);
  
  const cached = await getCachedIcons();
  cached[garmentId] = icon;
  const jsonString = safeJsonStringify(cached);
  if (jsonString) {
    await AsyncStorage.setItem(ICON_CACHE_KEY, jsonString);
  }
  
  return icon;
}

export async function saveIconsToFile(iconMap: Record<string, string>): Promise<void> {
  console.log('📁 Saving icons data for export...');
  
  const fileContent = `export const generatedGarmentIcons: Record<string, string> = ${JSON.stringify(iconMap, null, 2)};

export function getGeneratedIcon(garmentId: string): string | null {
  return generatedGarmentIcons[garmentId] || null;
}

export function hasGeneratedIcon(garmentId: string): boolean {
  return garmentId in generatedGarmentIcons;
}

export const generatedIconsCount = ${Object.keys(iconMap).length};
`;

  try {
    await AsyncStorage.setItem('generated_icons_file_content', fileContent);
    console.log(`✅ Icons data saved for export`);
    console.log(`📊 Total icons: ${Object.keys(iconMap).length}`);
    const sizeKB = (fileContent.length / 1024).toFixed(2);
    console.log(`📦 Data size: ${sizeKB} KB`);
  } catch (error) {
    console.error('❌ Failed to save icons data:', error);
    throw error;
  }
}

export async function getGeneratedFileContent(): Promise<string | null> {
  try {
    const content = await AsyncStorage.getItem('generated_icons_file_content');
    return content;
  } catch (error) {
    console.error('❌ Failed to get file content:', error);
    return null;
  }
}

export async function exportIconsAsTypeScriptFile(): Promise<string | null> {
  const content = await getGeneratedFileContent();
  if (!content) {
    console.log('⚠️ No icons file content found. Generate icons first.');
    return null;
  }
  return content;
}
