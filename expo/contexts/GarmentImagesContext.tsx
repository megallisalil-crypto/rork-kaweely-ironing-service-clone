import createContextHook from "@nkzw/create-context-hook";
import { useCallback, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { Directory, File, Paths } from "expo-file-system";
import { safeJsonParse } from "@/utils/safeJsonParse";

const STORAGE_INDEX_KEY = "garment_images_index";
const STORAGE_MANIFEST_KEY = "garment_images_manifest_v2";
const IMAGES_FOLDER = "garment_images";

type GarmentImagesManifestV2 = {
  ids: string[];
  updatedAt: number;
  version: 2;
};

function extractBase64FromDataUri(data: string): string {
  if (!data) return "";
  const trimmed = data.trim();
  if (!trimmed.startsWith("data:")) return trimmed;
  const commaIndex = trimmed.indexOf(",");
  if (commaIndex === -1) return "";
  return trimmed.slice(commaIndex + 1);
}

function getFileUri(file: unknown): string | undefined {
  const anyFile = file as any;
  return (
    (typeof anyFile?.uri === "string" ? anyFile.uri : undefined) ??
    (typeof anyFile?.path === "string" ? anyFile.path : undefined)
  );
}

function isLikelyImageUri(uri: unknown): uri is string {
  if (typeof uri !== "string") return false;
  const s = uri.trim();
  if (s.length < 6) return false;
  return (
    s.startsWith("file:") ||
    s.startsWith("content:") ||
    s.startsWith("data:image") ||
    s.startsWith("https://") ||
    s.startsWith("http://") ||
    s.startsWith("blob:")
  );
}

function base64ToBytes(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function ensureDir(): Promise<Directory | null> {
  if (Platform.OS === "web") return null;

  try {
    const dir = new Directory(Paths.document, IMAGES_FOLDER);
    if (!dir.exists) {
      dir.create({ intermediates: true });
      console.log("[GarmentImages] ✓ Created images directory");
    }
    return dir;
  } catch (error) {
    console.error("[GarmentImages] Failed to ensure directory:", error);
    return null;
  }
}

export const [GarmentImagesProvider, useGarmentImages] = createContextHook(() => {
  const [images, setImages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const count = useMemo(() => Object.keys(images).length, [images]);

  const loadImages = useCallback(async () => {
    console.log("[GarmentImages] Loading images...");
    setIsLoading(true);

    try {
      if (Platform.OS === "web") {
        const stored = await AsyncStorage.getItem(STORAGE_INDEX_KEY);
        const parsed = safeJsonParse<Record<string, string>>(stored);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          const cleaned: Record<string, string> = {};
          for (const [id, uri] of Object.entries(parsed)) {
            if (isLikelyImageUri(uri)) cleaned[id] = uri;
          }
          setImages(cleaned);
          console.log(`[GarmentImages] ✓ Loaded ${Object.keys(cleaned).length} images from web storage`);
        } else {
          setImages({});
        }
        return;
      }

      const dir = await ensureDir();
      if (!dir) {
        console.warn("[GarmentImages] File system not available; cannot load persisted images");
        setImages({});
        return;
      }

      const manifestStr = await AsyncStorage.getItem(STORAGE_MANIFEST_KEY);
      const manifest = safeJsonParse<GarmentImagesManifestV2>(manifestStr);

      let indexIds: string[] = [];
      if (manifest?.version === 2 && Array.isArray(manifest.ids)) {
        indexIds = manifest.ids.filter((x) => typeof x === "string");
      } else {
        const legacyIndexStr = await AsyncStorage.getItem(STORAGE_INDEX_KEY);
        const legacy = safeJsonParse<unknown>(legacyIndexStr);
        if (Array.isArray(legacy)) {
          indexIds = legacy.filter((x) => typeof x === "string") as string[];
        }
      }

      const loaded: Record<string, string> = {};
      const validIds: string[] = [];
      let missing = 0;

      for (const garmentId of indexIds) {
        try {
          const file = new File(dir, `${encodeURIComponent(garmentId)}.png`);
          if (!file.exists) {
            missing += 1;
            continue;
          }

          const size = (file as any)?.size as number | undefined;
          if (typeof size === "number" && size < 512) {
            console.warn(`[GarmentImages] Corrupted/small file for ${garmentId} (size=${size}), deleting`);
            try {
              file.delete();
            } catch {}
            missing += 1;
            continue;
          }

          const uriFromFile = getFileUri(file);
          if (uriFromFile) {
            loaded[garmentId] = uriFromFile;
            validIds.push(garmentId);
            continue;
          }

          const base64 = file.base64Sync();
          if (base64 && base64.length > 100) {
            loaded[garmentId] = `data:image/png;base64,${base64}`;
            validIds.push(garmentId);
          } else {
            missing += 1;
          }
        } catch (err) {
          console.warn(`[GarmentImages] Failed to load ${garmentId}:`, err);
          missing += 1;
        }
      }

      if (missing > 0 || validIds.length !== indexIds.length) {
        const newManifest: GarmentImagesManifestV2 = {
          ids: validIds,
          updatedAt: Date.now(),
          version: 2,
        };
        await AsyncStorage.setItem(STORAGE_MANIFEST_KEY, JSON.stringify(newManifest));
        await AsyncStorage.setItem(STORAGE_INDEX_KEY, JSON.stringify(validIds));
      }

      setImages(loaded);
      console.log(`[GarmentImages] ✓ Loaded ${validIds.length} images${missing > 0 ? `, ${missing} missing/corrupt` : ""}`);
    } catch (error) {
      console.error("[GarmentImages] Critical error loading images:", error);
      setImages({});
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const saveImage = useCallback(
    async (garmentId: string, imageData: string): Promise<boolean> => {
      try {
        if (!garmentId) return false;
        if (!imageData || typeof imageData !== "string") return false;

        console.log(`[GarmentImages] Saving image for ${garmentId}...`);

        if (Platform.OS === "web") {
          const next = { ...images, [garmentId]: imageData };
          const keys = Object.keys(next);
          const limitedKeys = keys.slice(Math.max(0, keys.length - 50));
          const limited: Record<string, string> = {};
          for (const k of limitedKeys) limited[k] = next[k];
          await AsyncStorage.setItem(STORAGE_INDEX_KEY, JSON.stringify(limited));
          setImages(limited);
          console.log(`[GarmentImages] ✓ Saved ${garmentId} to web storage (limited to 50)`);
          return true;
        }

        const dir = await ensureDir();
        if (!dir) {
          console.warn("[GarmentImages] File system not available; cannot persist image");
          return false;
        }

        const base64 = extractBase64FromDataUri(imageData);
        if (!base64 || base64.length < 100) {
          console.warn("[GarmentImages] Invalid base64 data; refusing to save");
          return false;
        }

        const file = new File(dir, `${encodeURIComponent(garmentId)}.png`);
        const bytes = base64ToBytes(base64);
        if (bytes.length === 0) return false;

        try {
          if (file.exists) file.delete();
        } catch {}

        file.create();
        file.write(bytes);

        const size = (file as any)?.size as number | undefined;
        if (typeof size === "number" && size < 512) {
          console.warn(`[GarmentImages] Verification failed after write (size=${size}), deleting`);
          try {
            file.delete();
          } catch {}
          return false;
        }

        const uriFromFile = getFileUri(file);
        setImages((prev) => ({ ...prev, [garmentId]: uriFromFile ?? imageData }));

        try {
          const manifestStr = await AsyncStorage.getItem(STORAGE_MANIFEST_KEY);
          const manifest = safeJsonParse<GarmentImagesManifestV2>(manifestStr);
          const prevIds = Array.isArray(manifest?.ids) ? manifest!.ids.filter((x) => typeof x === "string") : [];

          const nextIds = prevIds.includes(garmentId) ? prevIds : [...prevIds, garmentId];

          const maxImages = 120;
          let finalIds = nextIds;
          if (nextIds.length > maxImages) {
            const removeCount = nextIds.length - maxImages;
            const evicted = nextIds.slice(0, removeCount);
            finalIds = nextIds.slice(removeCount);

            for (const oldId of evicted) {
              try {
                const oldFile = new File(dir, `${encodeURIComponent(oldId)}.png`);
                if (oldFile.exists) oldFile.delete();
              } catch {}
            }
          }

          const newManifest: GarmentImagesManifestV2 = {
            ids: finalIds,
            updatedAt: Date.now(),
            version: 2,
          };

          await AsyncStorage.setItem(STORAGE_MANIFEST_KEY, JSON.stringify(newManifest));
          await AsyncStorage.setItem(STORAGE_INDEX_KEY, JSON.stringify(finalIds));
        } catch (indexErr) {
          console.warn("[GarmentImages] Saved image, but failed updating index:", indexErr);
        }

        console.log(`[GarmentImages] ✓ Saved ${garmentId} to file system${typeof size === "number" ? ` (${(size / 1024).toFixed(1)}KB)` : ""}`);
        return true;
      } catch (error) {
        console.error(`[GarmentImages] Failed to save ${garmentId}:`, error);
        return false;
      }
    },
    [images]
  );

  const deleteImage = useCallback(
    async (garmentId: string) => {
      try {
        if (!garmentId) return;

        if (Platform.OS === "web") {
          const next = { ...images };
          delete next[garmentId];
          await AsyncStorage.setItem(STORAGE_INDEX_KEY, JSON.stringify(next));
          setImages(next);
          return;
        }

        const dir = await ensureDir();
        if (dir) {
          try {
            const file = new File(dir, `${encodeURIComponent(garmentId)}.png`);
            if (file.exists) file.delete();
          } catch {}
        }

        try {
          const manifestStr = await AsyncStorage.getItem(STORAGE_MANIFEST_KEY);
          const manifest = safeJsonParse<GarmentImagesManifestV2>(manifestStr);
          const prevIds = Array.isArray(manifest?.ids) ? manifest!.ids : [];
          const nextIds = prevIds.filter((id) => id !== garmentId);

          const newManifest: GarmentImagesManifestV2 = {
            ids: nextIds,
            updatedAt: Date.now(),
            version: 2,
          };

          await AsyncStorage.setItem(STORAGE_MANIFEST_KEY, JSON.stringify(newManifest));
          await AsyncStorage.setItem(STORAGE_INDEX_KEY, JSON.stringify(nextIds));
        } catch (indexErr) {
          console.warn("[GarmentImages] Deleted image but failed updating index:", indexErr);
        }

        setImages((prev) => {
          const updated = { ...prev };
          delete updated[garmentId];
          return updated;
        });

        console.log(`[GarmentImages] ✓ Deleted ${garmentId}`);
      } catch (error) {
        console.error(`[GarmentImages] Failed to delete ${garmentId}:`, error);
      }
    },
    [images]
  );

  const getImage = useCallback(
    (garmentId: string): string | undefined => {
      return images[garmentId];
    },
    [images]
  );

  const hasImage = useCallback(
    (garmentId: string): boolean => {
      return !!images[garmentId];
    },
    [images]
  );

  const clearAllImages = useCallback(async () => {
    try {
      if (Platform.OS === "web") {
        await AsyncStorage.removeItem(STORAGE_INDEX_KEY);
        setImages({});
        return;
      }

      const dir = await ensureDir();
      if (dir?.exists) {
        try {
          dir.delete();
        } catch {}
        try {
          dir.create({ intermediates: true });
        } catch {}
      }

      await AsyncStorage.multiRemove([STORAGE_INDEX_KEY, STORAGE_MANIFEST_KEY]);
      setImages({});
      console.log("[GarmentImages] ✓ Cleared all images");
    } catch (error) {
      console.error("[GarmentImages] Failed to clear images:", error);
    }
  }, []);

  return {
    images,
    isLoading,
    loadImages,
    saveImage,
    deleteImage,
    getImage,
    hasImage,
    clearAllImages,
    count,
  };
});
