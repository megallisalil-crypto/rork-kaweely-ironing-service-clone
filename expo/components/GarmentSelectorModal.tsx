import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from "expo-image";
import { useEffect, useMemo, useState } from "react";
import {
  X,
  Search,
  Plus,
  Minus,
  Sparkles,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import {
  garmentTypes,
  searchGarments,
  GarmentType,
} from "@/constants/garmentTypes";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useGarmentImages } from "@/contexts/GarmentImagesContext";

type GarmentSelectorModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (garment: GarmentType, quantity?: number) => void;
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_SIZE = 70;
const ITEMS_PER_ROW = 4;

export function GarmentSelectorModal({
  visible,
  onClose,
  onSelect,
}: GarmentSelectorModalProps) {
  const { currentLanguage } = useLanguage();
  const { format } = useCurrency();
  const { images: generatedImages, saveImage, deleteImage, isLoading: isImagesLoading, loadImages } = useGarmentImages();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<"men" | "women" | "children" | "home">("men");
  const [selectedGarment, setSelectedGarment] = useState<GarmentType | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [generatingSketch, setGeneratingSketch] = useState<Record<string, boolean>>({});
  const [didAttemptReload, setDidAttemptReload] = useState<boolean>(false);

  useEffect(() => {
    if (visible && !didAttemptReload) {
      console.log("[GarmentSelector] Opened → reloading garment images");
      setDidAttemptReload(true);
      loadImages().catch((err) => {
        console.warn("[GarmentSelector] loadImages failed:", err);
      });
    }
  }, [visible, didAttemptReload, loadImages]);

  const getFilteredGarments = useMemo(() => {
    let filtered = garmentTypes;

    if (searchQuery.trim()) {
      filtered = searchGarments(searchQuery, currentLanguage);
    }

    if (selectedCategory === "men") {
      filtered = filtered.filter(g => 
        g.category === "mens_wear" || 
        g.category === "formal" ||
        g.category === "sportswear" ||
        g.category === "outerwear" ||
        g.category === "sleepwear" ||
        g.category === "undergarments" ||
        g.category === "accessories"
      );
    } else if (selectedCategory === "women") {
      filtered = filtered.filter(g => 
        g.category === "womens_wear" || 
        g.category === "traditional" ||
        g.category === "formal" ||
        g.category === "sportswear" ||
        g.category === "outerwear" ||
        g.category === "sleepwear" ||
        g.category === "undergarments" ||
        g.category === "accessories"
      );
    } else if (selectedCategory === "children") {
      filtered = filtered.filter(g => g.category === "kids_wear");
    } else if (selectedCategory === "home") {
      filtered = filtered.filter(g => g.category === "household");
    }

    return filtered;
  }, [searchQuery, selectedCategory, currentLanguage]);

  const handleSelectGarment = (garment: GarmentType) => {
    setSelectedGarment(garment);
    setQuantity(1);
  };

  const handleAddToOrder = () => {
    if (selectedGarment) {
      onSelect(selectedGarment, quantity);
      setSelectedGarment(null);
      setQuantity(1);
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setSelectedCategory("men");
    setSelectedGarment(null);
    setQuantity(1);
    setDidAttemptReload(false);
    onClose();
  };

  const handleGenerateSketch = async (garment: GarmentType, e: any) => {
    e.stopPropagation();
    
    const activeGenerations = Object.values(generatingSketch).filter(Boolean).length;
    if (activeGenerations >= 2) {
      Alert.alert(
        currentLanguage === 'en' ? '⚠️ Wait' : '⚠️ انتظر',
        currentLanguage === 'en'
          ? 'Wait for current generations to finish'
          : 'انتظر حتى تنتهي الأجيال الحالية'
      );
      return;
    }
    
    setGeneratingSketch(prev => ({ ...prev, [garment.id]: true }));

    try {
      const prompt = `A clean product photo of a ${garment.name}. ${garment.description || ''}. Professional clothing photography, white background, centered.`;
      
      const response = await fetch('https://toolkit.rork.com/images/generate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          size: '512x512',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (!data?.image?.base64) {
        throw new Error('No image data');
      }
      
      const imageUri = `data:${data.image.mimeType || 'image/png'};base64,${data.image.base64}`;
      
      console.log('[GarmentSelector] Image generated for:', garment.name);
      
      const success = await saveImage(garment.id, imageUri);
      
      if (success) {
        Alert.alert(
          currentLanguage === 'en' ? '✓ Saved' : '✓ تم الحفظ',
          currentLanguage === 'en' ? `Image saved to storage!` : `تم حفظ الصورة!`
        );
      } else {
        throw new Error('Failed to save image');
      }
    } catch (error: any) {
      console.error('[GarmentSelector] Generation error:', error);
      Alert.alert(
        currentLanguage === 'en' ? '✗ Failed' : '✗ فشل',
        error?.message || 'Unknown error'
      );
    } finally {
      setGeneratingSketch(prev => ({ ...prev, [garment.id]: false }));
    }
  };

  const renderGarmentItem = ({ item }: { item: GarmentType }) => {
    const isGenerating = generatingSketch[item.id];
    let imageUri = item.imageUrl || `https://source.unsplash.com/featured/400x400?${encodeURIComponent(item.name)}`;
    let hasValidGenerated = false;
    
    try {
      if (generatedImages[item.id]) {
        const generatedUri = generatedImages[item.id];
        if (generatedUri && typeof generatedUri === 'string' && generatedUri.length > 100) {
          if (generatedUri.startsWith('data:image')) {
            imageUri = generatedUri;
            hasValidGenerated = true;
          } else {
            console.warn(`[GarmentSelector] Invalid image format for ${item.id}, using fallback`);
          }
        }
      }
    } catch (err) {
      console.error('[GarmentSelector] Error accessing image:', err);
    }

    return (
      <TouchableOpacity
        style={styles.gridItem}
        onPress={() => handleSelectGarment(item)}
        activeOpacity={0.7}
      >
        <View style={styles.circleWrap}>
          {isGenerating ? (
            <View style={styles.generatingOverlay}>
              <ActivityIndicator size="small" color={Colors.light.tint} />
            </View>
          ) : (
            <Image
              source={{ uri: imageUri }}
              style={styles.circleImage}
              contentFit="cover"
              transition={150}
              cachePolicy="memory-disk"
              onError={(error: any) => {
                const errorMsg = error?.error?.message || error?.message || "Unknown error";
                console.error(`[GarmentSelector] Image load error for ${item.id}: ${errorMsg}`);

                const isDataUri = typeof imageUri === "string" && imageUri.startsWith("data:image");
                const isFileUri = typeof imageUri === "string" && imageUri.startsWith("file:");

                if (hasValidGenerated || isDataUri || isFileUri) {
                  console.log(`[GarmentSelector] Removing bad generated image for ${item.id} and reloading index`);
                  deleteImage(item.id);
                  loadImages().catch(() => undefined);
                }
              }}
            />
          )}
        </View>

        <Text style={styles.itemName} numberOfLines={2}>
          {currentLanguage === "en" ? item.name : item.nameAr}
        </Text>
        <Text style={styles.itemPrice}>{format(item.price)}</Text>

        <TouchableOpacity
          style={[styles.miniGenButton, isGenerating && styles.miniGenButtonDisabled]}
          onPress={(e) => handleGenerateSketch(item, e)}
          disabled={isGenerating}
          activeOpacity={0.7}
        >
          <Sparkles size={8} color="#FFFFFF" strokeWidth={3} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyState}>
      <Search size={48} color={Colors.light.tabIconDefault} />
      <Text style={styles.emptyText}>
        {currentLanguage === "en" ? "No garments found" : "لم يتم العثور على ملابس"}
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={handleClose}
        />

        <View style={styles.modalContainer} testID="garmentSelectorModal">
          <View style={styles.handleBar} />

          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>
                {currentLanguage === "en" ? "Select Garment" : "اختر الملابس"}
              </Text>
              <Text style={styles.subtitle}>
                {getFilteredGarments.length} {currentLanguage === "en" ? "items" : "عنصر"}
                {Object.keys(generatedImages).length > 0 && (
                  <Text style={styles.generatedCount}>
                    {" • "}{Object.keys(generatedImages).length} AI
                  </Text>
                )}
              </Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.iconButton}>
              <X size={22} color={Colors.light.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Search size={18} color={Colors.light.tabIconDefault} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={currentLanguage === "en" ? "Search..." : "ابحث..."}
              placeholderTextColor={Colors.light.tabIconDefault}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <X size={18} color={Colors.light.tabIconDefault} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.categoryTabs}>
            <TouchableOpacity
              style={styles.categoryTabWrapper}
              onPress={() => setSelectedCategory("men")}
              activeOpacity={0.8}
            >
              {selectedCategory === "men" ? (
                <LinearGradient
                  colors={['#3B82F6', '#06B6D4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.categoryTabActive}
                >
                  <Text style={styles.categoryTabIcon}>👔</Text>
                  <Text style={styles.categoryTabTextActive}>
                    {currentLanguage === "en" ? "Men" : "رجال"}
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.categoryTabInactive}>
                  <Text style={styles.categoryTabIconInactive}>👔</Text>
                  <Text style={styles.categoryTabText}>
                    {currentLanguage === "en" ? "Men" : "رجال"}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.categoryTabWrapper}
              onPress={() => setSelectedCategory("women")}
              activeOpacity={0.8}
            >
              {selectedCategory === "women" ? (
                <LinearGradient
                  colors={['#EC4899', '#F97316']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.categoryTabActive}
                >
                  <Text style={styles.categoryTabIcon}>👗</Text>
                  <Text style={styles.categoryTabTextActive}>
                    {currentLanguage === "en" ? "Women" : "نساء"}
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.categoryTabInactive}>
                  <Text style={styles.categoryTabIconInactive}>👗</Text>
                  <Text style={styles.categoryTabText}>
                    {currentLanguage === "en" ? "Women" : "نساء"}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.categoryTabWrapper}
              onPress={() => setSelectedCategory("children")}
              activeOpacity={0.8}
            >
              {selectedCategory === "children" ? (
                <LinearGradient
                  colors={['#F59E0B', '#EF4444']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.categoryTabActive}
                >
                  <Text style={styles.categoryTabIcon}>👶</Text>
                  <Text style={styles.categoryTabTextActive}>
                    {currentLanguage === "en" ? "Children" : "أطفال"}
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.categoryTabInactive}>
                  <Text style={styles.categoryTabIconInactive}>👶</Text>
                  <Text style={styles.categoryTabText}>
                    {currentLanguage === "en" ? "Children" : "أطفال"}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.categoryTabWrapper}
              onPress={() => setSelectedCategory("home")}
              activeOpacity={0.8}
            >
              {selectedCategory === "home" ? (
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.categoryTabActive}
                >
                  <Text style={styles.categoryTabIcon}>🏠</Text>
                  <Text style={styles.categoryTabTextActive}>
                    {currentLanguage === "en" ? "Home" : "منزل"}
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.categoryTabInactive}>
                  <Text style={styles.categoryTabIconInactive}>🏠</Text>
                  <Text style={styles.categoryTabText}>
                    {currentLanguage === "en" ? "Home" : "منزل"}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {isImagesLoading ? (
            <View style={styles.loadingArea}>
              <ActivityIndicator size="large" color={Colors.light.tint} />
              <Text style={styles.loadingText}>
                {currentLanguage === "en" ? "Loading garment images…" : "جاري تحميل صور الملابس…"}
              </Text>
            </View>
          ) : (
            <FlatList
              data={getFilteredGarments}
              renderItem={renderGarmentItem}
              keyExtractor={(item) => item.id}
              numColumns={ITEMS_PER_ROW}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              initialNumToRender={20}
              maxToRenderPerBatch={20}
              windowSize={5}
              removeClippedSubviews={true}
              ListEmptyComponent={renderEmptyComponent}
              testID="garmentSelectorList"
            />
          )}
        </View>

        {selectedGarment && (
          <View style={styles.detailsPanel}>
            <View style={styles.detailsHeader}>
              <TouchableOpacity
                style={styles.detailsCloseButton}
                onPress={() => setSelectedGarment(null)}
              >
                <X size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.detailsContent}>
              <View style={styles.detailsImageContainer}>
                <Image
                  source={{ 
                    uri: generatedImages[selectedGarment.id] || selectedGarment.imageUrl || `https://source.unsplash.com/featured/400x400?${encodeURIComponent(selectedGarment.name)}`
                  }}
                  style={styles.detailsImage}
                  contentFit="cover"
                  transition={200}
                  cachePolicy="memory-disk"
                  onError={(error: any) => {
                    const errorMsg = error?.error?.message || error?.message || "Unknown error";
                    console.error(`[GarmentSelector] Details image error for ${selectedGarment.id}: ${errorMsg}`);
                    if (generatedImages[selectedGarment.id]) {
                      deleteImage(selectedGarment.id);
                      loadImages().catch(() => undefined);
                    }
                  }}
                />
              </View>

              <Text style={styles.detailsName}>
                {currentLanguage === "en" ? selectedGarment.name : selectedGarment.nameAr}
              </Text>
              <Text style={styles.detailsPrice}>{format(selectedGarment.price)}</Text>

              {selectedGarment.description && (
                <Text style={styles.detailsDescription}>
                  {currentLanguage === "en" ? selectedGarment.description : selectedGarment.descriptionAr}
                </Text>
              )}

              <View style={styles.detailsSection}>
                <Text style={styles.detailsSectionTitle}>
                  {currentLanguage === "en" ? "Quantity" : "الكمية"}
                </Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={[styles.quantityButton, quantity === 1 && styles.quantityButtonDisabled]}
                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity === 1}
                  >
                    <Minus size={18} color={quantity === 1 ? Colors.light.tabIconDefault : Colors.light.tint} />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => setQuantity(quantity + 1)}
                  >
                    <Plus size={18} color={Colors.light.tint} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.detailsTotalRow}>
                <Text style={styles.detailsTotalLabel}>
                  {currentLanguage === "en" ? "Total" : "المجموع"}
                </Text>
                <Text style={styles.detailsTotalValue}>
                  {format(selectedGarment.price * quantity)}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddToOrder}
                activeOpacity={0.8}
              >
                <Text style={styles.addButtonText}>
                  {currentLanguage === "en" ? "Add to Order" : "إضافة للطلب"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  overlayTouchable: {
    flex: 1,
  },
  modalContainer: {
    height: "90%",
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: Colors.light.border,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "800" as const,
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.light.tabIconDefault,
    marginTop: 2,
  },
  generatedCount: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: Colors.light.tint,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.cardBackground,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.cardBackground,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.light.text,
  },
  categoryTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  categoryTabWrapper: {
    flex: 1,
  },
  categoryTabActive: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  categoryTabInactive: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: Colors.light.cardBackground,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  categoryTabIcon: {
    fontSize: 14,
  },
  categoryTabIconInactive: {
    fontSize: 14,
    opacity: 0.5,
  },
  categoryTabTextActive: {
    fontSize: 12,
    fontWeight: '900' as const,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  categoryTabText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  gridItem: {
    width: (SCREEN_WIDTH - 72) / ITEMS_PER_ROW,
    alignItems: "center",
    marginBottom: 16,
    marginHorizontal: 4,
  },
  circleWrap: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    backgroundColor: Colors.light.cardBackground,
    borderWidth: 2,
    borderColor: Colors.light.border,
    overflow: "hidden",
    marginBottom: 6,
  },
  circleImage: {
    width: "100%",
    height: "100%",
  },
  loadingArea: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.tabIconDefault,
  },
  generatingOverlay: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.cardBackground,
  },
  itemName: {
    fontSize: 10,
    fontWeight: "700" as const,
    color: Colors.light.text,
    textAlign: "center",
    lineHeight: 13,
    height: 26,
  },
  itemPrice: {
    fontSize: 9,
    fontWeight: "700" as const,
    color: Colors.light.tint,
    marginTop: 2,
  },
  miniGenButton: {
    marginTop: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.tint,
    justifyContent: "center",
    alignItems: "center",
  },
  miniGenButtonDisabled: {
    backgroundColor: Colors.light.tabIconDefault,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  detailsPanel: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.light.background,
  },
  detailsHeader: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  detailsCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.cardBackground,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  detailsContent: {
    paddingHorizontal: 24,
  },
  detailsImageContainer: {
    width: 160,
    height: 160,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 30,
    overflow: "hidden",
    alignSelf: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  detailsImage: {
    width: "100%",
    height: "100%",
  },
  detailsName: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: Colors.light.text,
    textAlign: "center",
    marginBottom: 6,
  },
  detailsPrice: {
    fontSize: 26,
    fontWeight: "700" as const,
    color: Colors.light.tint,
    textAlign: "center",
    marginBottom: 14,
  },
  detailsDescription: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    lineHeight: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  detailsSection: {
    marginBottom: 20,
  },
  detailsSectionTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 10,
    textAlign: "center",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityText: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: Colors.light.text,
    minWidth: 35,
    textAlign: "center",
  },
  detailsTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  detailsTotalLabel: {
    fontSize: 17,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  detailsTotalValue: {
    fontSize: 26,
    fontWeight: "700" as const,
    color: Colors.light.tint,
  },
  addButton: {
    backgroundColor: Colors.light.tint,
    borderRadius: 14,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700" as const,
  },
});
