import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions } from "react-native";
import { useState } from "react";
import { Star, CheckCircle, Package, Clock, Headphones, Truck } from "lucide-react-native";
import SlidingPanel from "./SlidingPanel";
import { FeedbackRating, FeedbackCategory } from "@/types/feedback";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type FeedbackPanelProps = {
  visible: boolean;
  onClose: () => void;
  orderNumber: string;
  onSubmit: (feedback: {
    overallRating: FeedbackRating;
    categories: { [K in FeedbackCategory]: FeedbackRating };
    comment?: string;
  }) => void;
  colors: any;
};

const categories: { key: FeedbackCategory; label: string; icon: any }[] = [
  { key: "delivery", label: "Delivery Service", icon: Truck },
  { key: "quality", label: "Ironing Quality", icon: Star },
  { key: "packaging", label: "Packaging", icon: Package },
  { key: "timing", label: "Timeliness", icon: Clock },
  { key: "support", label: "Customer Support", icon: Headphones },
];

export default function FeedbackPanel({ visible, onClose, orderNumber, onSubmit, colors }: FeedbackPanelProps) {
  const [overallRating, setOverallRating] = useState<FeedbackRating>(5);
  const [categoryRatings, setCategoryRatings] = useState<{ [K in FeedbackCategory]: FeedbackRating }>({
    delivery: 5,
    quality: 5,
    packaging: 5,
    timing: 5,
    support: 5,
  });
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    onSubmit({
      overallRating,
      categories: categoryRatings,
      comment: comment.trim() || undefined,
    });
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setOverallRating(5);
      setCategoryRatings({ delivery: 5, quality: 5, packaging: 5, timing: 5, support: 5 });
      setComment("");
    }, 1500);
  };

  const renderStars = (rating: number, onPress: (rating: FeedbackRating) => void) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => onPress(star as FeedbackRating)}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
          >
            <Star
              size={32}
              color={star <= rating ? "#FFB800" : colors.border}
              fill={star <= rating ? "#FFB800" : "transparent"}
              strokeWidth={2}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderCategoryStars = (rating: number, onPress: (rating: FeedbackRating) => void) => {
    return (
      <View style={styles.categoryStarsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => onPress(star as FeedbackRating)}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 3, right: 3 }}
          >
            <Star
              size={24}
              color={star <= rating ? "#FFB800" : colors.border}
              fill={star <= rating ? "#FFB800" : "transparent"}
              strokeWidth={2}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const styles = StyleSheet.create({
    content: {
      gap: 24,
    },
    orderInfo: {
      alignItems: "center",
      marginBottom: 8,
    },
    orderNumber: {
      fontSize: 16,
      fontWeight: "700" as const,
      color: colors.tint,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: colors.tabIconDefault,
      textAlign: "center",
      lineHeight: 20,
    },
    section: {
      gap: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700" as const,
      color: colors.text,
      marginBottom: 4,
    },
    starsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
    },
    categoryItem: {
      backgroundColor: colors.cardBackground,
      padding: 16,
      borderRadius: 16,
      gap: 12,
    },
    categoryHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    categoryIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: `${colors.tint}15`,
      justifyContent: "center",
      alignItems: "center",
    },
    categoryLabel: {
      flex: 1,
      fontSize: 14,
      fontWeight: "600" as const,
      color: colors.text,
    },
    categoryStarsContainer: {
      flexDirection: "row",
      gap: 6,
    },
    commentInput: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 16,
      fontSize: 14,
      color: colors.text,
      minHeight: 100,
      textAlignVertical: "top",
      borderWidth: 1,
      borderColor: colors.border,
    },
    submitButton: {
      backgroundColor: colors.tint,
      padding: 18,
      borderRadius: 16,
      alignItems: "center",
      shadowColor: colors.tint,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    submitButtonText: {
      fontSize: 16,
      fontWeight: "700" as const,
      color: "#FFFFFF",
    },
    successContainer: {
      alignItems: "center",
      paddingVertical: 40,
      gap: 16,
    },
    successIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: `${colors.tint}15`,
      justifyContent: "center",
      alignItems: "center",
    },
    successTitle: {
      fontSize: 20,
      fontWeight: "700" as const,
      color: colors.text,
    },
    successMessage: {
      fontSize: 14,
      color: colors.tabIconDefault,
      textAlign: "center",
      lineHeight: 20,
    },
  });

  return (
    <SlidingPanel
      visible={visible}
      onClose={onClose}
      title="Rate Your Experience"
      height={SCREEN_HEIGHT * 0.85}
    >
      {!submitted ? (
        <View style={styles.content}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderNumber}>{orderNumber}</Text>
            <Text style={styles.subtitle}>
              Your feedback helps us improve our service
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overall Experience</Text>
            {renderStars(overallRating, setOverallRating)}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rate Each Aspect</Text>
            {categories.map(({ key, label, icon: Icon }) => (
              <View key={key} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryIcon}>
                    <Icon size={18} color={colors.tint} strokeWidth={2.5} />
                  </View>
                  <Text style={styles.categoryLabel}>{label}</Text>
                </View>
                {renderCategoryStars(categoryRatings[key], (rating) =>
                  setCategoryRatings({ ...categoryRatings, [key]: rating })
                )}
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Comments (Optional)</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Tell us more about your experience..."
              placeholderTextColor={colors.tabIconDefault}
              multiline
              value={comment}
              onChangeText={setComment}
              maxLength={500}
            />
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <CheckCircle size={48} color={colors.tint} strokeWidth={2.5} />
          </View>
          <Text style={styles.successTitle}>Thank You!</Text>
          <Text style={styles.successMessage}>
            Your feedback has been submitted and will help us improve our service
          </Text>
        </View>
      )}
    </SlidingPanel>
  );
}
