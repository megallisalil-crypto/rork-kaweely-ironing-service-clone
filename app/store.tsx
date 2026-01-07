import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import Colors from "@/constants/colors";
import { ShoppingBag, Star, Plus, Heart, Sparkles, ShoppingCart } from "lucide-react-native";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 2;

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  featured?: boolean;
  discount?: number;
  originalPrice?: number;
  weight?: string;
  brand?: string;
};

const products: Product[] = [
  {
    id: "det1",
    name: "Kaweely Powder Detergent",
    price: 89.99,
    image: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/jijjdliks5fp4wlcqw1gh",
    rating: 4.9,
    reviews: 1847,
    inStock: true,
    featured: true,
    weight: "2.5 kg",
    brand: "Kaweely",
  },
  {
    id: "det2",
    name: "Oxi Automatic Powder Detergent",
    price: 349.95,
    originalPrice: 408.00,
    discount: 14,
    image: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/wyxrnvql2qx7kv21rq9yt",
    rating: 4.8,
    reviews: 2134,
    inStock: true,
    featured: true,
    weight: "4kg + 2kg",
    brand: "Oxi",
  },
  {
    id: "det3",
    name: "Kaweely Fabric Softener",
    price: 65.00,
    image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400",
    rating: 4.7,
    reviews: 923,
    inStock: true,
    weight: "2L",
    brand: "Kaweely",
  },
  {
    id: "det4",
    name: "Oxi Stain Remover Spray",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400",
    rating: 4.6,
    reviews: 567,
    inStock: true,
    weight: "500ml",
    brand: "Oxi",
  },
  {
    id: "det5",
    name: "Kaweely Bleach",
    price: 38.00,
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400",
    rating: 4.5,
    reviews: 445,
    inStock: true,
    weight: "1L",
    brand: "Kaweely",
  },
  {
    id: "det6",
    name: "Oxi Color Protect Detergent",
    price: 299.00,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
    rating: 4.8,
    reviews: 1256,
    inStock: true,
    weight: "5kg",
    brand: "Oxi",
  },
];

export default function StoreScreen() {
  const logoUrl = "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/8nlam6zuq1umfi1sxbk5q";
  const router = useRouter();
  const { addToCart, totalItems } = useCart();
  const { format } = useCurrency();

  const handleAddToCart = (product: Product) => {
    console.log("[Store] Adding product to cart:", product.name);
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      type: 'product',
    });
    Alert.alert(
      "Added to Cart",
      `${product.name} has been added to your cart`,
      [
        { text: "Continue Shopping", style: "cancel" },
        { text: "View Cart", onPress: () => router.push("/cart") },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Store",
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
          headerTintColor: Colors.light.text,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/cart")}
              style={styles.cartButton}
              activeOpacity={0.7}
            >
              <ShoppingCart size={24} color={Colors.light.tint} strokeWidth={2.5} />
              {totalItems > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{totalItems}</Text>
                </View>
              )}
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <View style={styles.headerLogoContainer}>
              <Image
                source={{ uri: logoUrl }}
                style={styles.headerLogo}
                resizeMode="contain"
                onError={(error) => console.log('[Store] Logo error:', error.nativeEvent?.error || 'Unknown error')}
              />
            </View>
            <View style={styles.iconContainer}>
              <ShoppingBag size={36} color={Colors.light.tint} strokeWidth={2.5} />
            </View>
            <Text style={styles.title}>Kaweely Store</Text>
            <Text style={styles.subtitle}>
              Premium garment care & ironing products
            </Text>
          </View>

          <View style={styles.productsGrid}>
            {products.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={[
                  styles.productCard,
                  product.featured && styles.productCardFeatured,
                ]}
                activeOpacity={0.9}
              >
                {product.featured && (
                  <View style={styles.featuredBadge}>
                    <Sparkles size={14} color={Colors.light.background} fill={Colors.light.background} />
                    <Text style={styles.featuredText}>BEST SELLER</Text>
                  </View>
                )}
                
                {product.discount && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{product.discount}% OFF</Text>
                  </View>
                )}

                <View style={styles.productImageContainer}>
                  <Image
                    source={{ uri: product.image }}
                    style={styles.productImage}
                    resizeMode="cover"
                    onError={(error) => console.log('[Store] Product image error:', product.name, error.nativeEvent?.error || 'Unknown error')}
                  />
                  <TouchableOpacity style={styles.favoriteButton} activeOpacity={0.8}>
                    <Heart size={20} color={Colors.light.text} strokeWidth={2.5} />
                  </TouchableOpacity>
                  {!product.inStock && (
                    <View style={styles.outOfStockBadge}>
                      <Text style={styles.outOfStockText}>Out of Stock</Text>
                    </View>
                  )}
                </View>

                <View style={styles.productInfo}>
                  {product.brand && (
                    <Text style={styles.brandText}>{product.brand}</Text>
                  )}
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  {product.weight && (
                    <Text style={styles.weightText}>{product.weight}</Text>
                  )}

                  <View style={styles.ratingRow}>
                    <Star size={14} color={Colors.light.accent} fill={Colors.light.accent} />
                    <Text style={styles.ratingText}>{product.rating}</Text>
                    <Text style={styles.reviewsText}>({product.reviews.toLocaleString()})</Text>
                  </View>

                  <View style={styles.productFooter}>
                    <View>
                      {product.originalPrice && (
                        <Text style={styles.originalPrice}>{format(product.originalPrice)}</Text>
                      )}
                      <Text style={styles.productPrice}>{format(product.price)}</Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.addButton,
                        !product.inStock && styles.addButtonDisabled,
                        product.featured && styles.addButtonFeatured,
                      ]}
                      activeOpacity={0.8}
                      disabled={!product.inStock}
                      onPress={() => handleAddToCart(product)}
                    >
                      <Plus size={20} color="#FFFFFF" strokeWidth={3} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 14,
    paddingBottom: 20,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 16,
    position: "relative" as const,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  headerLogoContainer: {
    position: "absolute" as const,
    top: 0,
    right: 0,
    opacity: 0.15,
  },
  headerLogo: {
    width: 120,
    height: 120,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${Colors.light.tint}20`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.light.tint,
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "900" as const,
    color: Colors.light.text,
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 16,
    fontWeight: "500" as const,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    position: "relative" as const,
  },
  productCardFeatured: {
    borderColor: Colors.light.accent,
    shadowColor: Colors.light.accent,
    shadowOpacity: 0.2,
  },
  featuredBadge: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.accent,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    zIndex: 10,
  },
  featuredText: {
    fontSize: 11,
    fontWeight: "900" as const,
    color: Colors.light.background,
    letterSpacing: 1,
  },
  productImageContainer: {
    width: "100%",
    height: CARD_WIDTH,
    position: "relative" as const,
    marginTop: 0,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  favoriteButton: {
    position: "absolute" as const,
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  outOfStockBadge: {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(239, 68, 68, 0.95)",
    paddingVertical: 8,
    alignItems: "center",
  },
  outOfStockText: {
    fontSize: 12,
    fontWeight: "800" as const,
    color: "#FFFFFF",
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  productInfo: {
    padding: 12,
  },
  brandText: {
    fontSize: 11,
    fontWeight: "900" as const,
    color: Colors.light.tint,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    marginBottom: 4,
  },
  productName: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 4,
    minHeight: 34,
    lineHeight: 17,
  },
  weightText: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  reviewsText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: "500" as const,
  },
  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  originalPrice: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
    textDecorationLine: "line-through" as const,
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "900" as const,
    color: Colors.light.tint,
  },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.light.tint,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonFeatured: {
    backgroundColor: Colors.light.accent,
    shadowColor: Colors.light.accent,
  },
  addButtonDisabled: {
    backgroundColor: Colors.light.border,
    shadowOpacity: 0,
  },
  cartButton: {
    position: "relative" as const,
    marginRight: 4,
    padding: 8,
  },
  cartBadge: {
    position: "absolute" as const,
    top: 4,
    right: 4,
    backgroundColor: Colors.light.accent,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  cartBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900" as const,
  },
  discountBadge: {
    position: "absolute" as const,
    top: 8,
    left: 8,
    backgroundColor: "#EF4444",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    zIndex: 10,
  },
  discountText: {
    fontSize: 11,
    fontWeight: "900" as const,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
});
