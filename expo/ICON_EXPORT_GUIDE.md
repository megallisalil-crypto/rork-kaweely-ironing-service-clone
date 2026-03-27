# AI Icon Generation & Export Guide

## Overview
This system generates AI-powered icons for all 200 garment types and saves them for reuse. Icons are automatically saved and can be exported as a TypeScript file.

## How It Works

### 1. Generate Icons
1. Navigate to the **AI Icon Generator** screen
2. Click **"Generate All Icons"** button
3. Wait for all icons to be generated (they appear one-by-one)
4. Icons are automatically cached in AsyncStorage

### 2. Export Icons
Once generation is complete:
1. Click **"Export TypeScript File"** button
2. Review the file size and icon count
3. Click **"Copy to Clipboard"**
4. The complete TypeScript file content is copied

### 3. Use Exported Icons

#### Option A: Create a new file
1. Create `constants/generatedIcons.ts` in your project
2. Paste the copied content
3. Import and use in your components:

```typescript
import { generatedGarmentIcons, getGeneratedIcon } from '@/constants/generatedIcons';

// Get a specific icon
const icon = getGeneratedIcon('dress-shirt');

// Use in Image component
<Image source={{ uri: icon }} style={styles.icon} />
```

#### Option B: Update GarmentSelectorModal
Replace the AI icon loading logic with:

```typescript
import { generatedGarmentIcons } from '@/constants/generatedIcons';

// In your component
const aiIconData = generatedGarmentIcons[garment.id];
```

## File Structure

### Generated File Format
```typescript
export const generatedGarmentIcons: Record<string, string> = {
  "dress-shirt": "data:image/png;base64,...",
  "t-shirt": "data:image/png;base64,...",
  // ... 200 garment icons
};

export function getGeneratedIcon(garmentId: string): string | null {
  return generatedGarmentIcons[garmentId] || null;
}

export function hasGeneratedIcon(garmentId: string): boolean {
  return garmentId in generatedGarmentIcons;
}

export const generatedIconsCount = 200;
```

## Benefits

✅ **No Regeneration**: Icons are generated once and saved permanently  
✅ **Instant Loading**: Base64 images load instantly without network requests  
✅ **Portable**: Easy to transfer between projects  
✅ **Type-Safe**: Full TypeScript support  
✅ **Version Control**: Can be committed to git (though files will be large)  

## File Size
- Expect ~5-10 MB for 200 icons
- Each icon is ~25-50 KB in base64 format
- Icons are high quality (1024x1024px)

## Notes
- Icons are stored as base64-encoded data URIs
- Perfect for React Native Web compatibility
- No external dependencies required
- Works offline once generated
