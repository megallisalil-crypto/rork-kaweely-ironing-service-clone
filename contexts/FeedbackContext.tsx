import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Feedback, FeedbackRating, FeedbackCategory, FeedbackStats } from "@/types/feedback";

const STORAGE_KEY = "kaweely_feedbacks";

export const [FeedbackProvider, useFeedback] = createContextHook(() => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const feedbacksQuery = useQuery({
    queryKey: ["feedbacks"],
    queryFn: async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        console.log("[FeedbackContext] Loading feedbacks from storage:", stored?.substring(0, 50));
        
        if (!stored || stored === 'null' || stored === 'undefined' || stored.trim() === '' || stored === 'NaN') {
          console.log("[FeedbackContext] No stored feedbacks, using empty array");
          await AsyncStorage.removeItem(STORAGE_KEY);
          return [];
        }
        
        const trimmedStored = stored.trim();
        
        if (!trimmedStored || (!trimmedStored.startsWith('[') && !trimmedStored.startsWith('{'))) {
          console.warn("[FeedbackContext] Stored value is not valid JSON, clearing. Value:", trimmedStored.substring(0, 50));
          await AsyncStorage.removeItem(STORAGE_KEY);
          return [];
        }
        
        if (trimmedStored.includes('NaN') || trimmedStored.includes('undefined')) {
          console.warn("[FeedbackContext] Stored value contains invalid values, clearing");
          await AsyncStorage.removeItem(STORAGE_KEY);
          return [];
        }
        
        try {
          const parsedFeedbacks = JSON.parse(trimmedStored);
          if (Array.isArray(parsedFeedbacks)) {
            console.log("[FeedbackContext] Successfully loaded", parsedFeedbacks.length, "feedbacks");
            return parsedFeedbacks.map((feedback: Feedback) => ({
              ...feedback,
              createdAt: new Date(feedback.createdAt),
            }));
          } else {
            console.error("[FeedbackContext] Invalid feedback data format (not an array)");
            await AsyncStorage.removeItem(STORAGE_KEY);
            return [];
          }
        } catch (parseError) {
          console.error("[FeedbackContext] JSON Parse error:", parseError);
          console.log("[FeedbackContext] Failed value:", stored?.substring(0, 100));
          await AsyncStorage.removeItem(STORAGE_KEY);
          return [];
        }
      } catch (error) {
        console.error("[FeedbackContext] Error loading feedbacks:", error);
        await AsyncStorage.removeItem(STORAGE_KEY);
        return [];
      }
    },
  });

  const syncMutation = useMutation({
    mutationFn: async (updatedFeedbacks: Feedback[]) => {
      try {
        if (!updatedFeedbacks || !Array.isArray(updatedFeedbacks)) {
          console.error('[FeedbackContext] Invalid feedback data, not syncing');
          return updatedFeedbacks;
        }
        
        const jsonString = JSON.stringify(updatedFeedbacks, (key, value) => {
          if (value !== value) return null;
          if (value === Infinity || value === -Infinity) return null;
          if (typeof value === 'number' && !isFinite(value)) return null;
          return value;
        });
        
        if (!jsonString || jsonString === 'undefined' || jsonString === 'null' || jsonString === 'NaN' || jsonString.includes('NaN')) {
          console.error('[FeedbackContext] Invalid JSON string generated, not syncing');
          return updatedFeedbacks;
        }
        
        console.log('[FeedbackContext] Syncing', updatedFeedbacks.length, 'feedbacks');
        await AsyncStorage.setItem(STORAGE_KEY, jsonString);
        return updatedFeedbacks;
      } catch (error) {
        console.error('[FeedbackContext] Error syncing feedbacks:', error);
        await AsyncStorage.removeItem(STORAGE_KEY);
        return updatedFeedbacks;
      }
    },
  });

  const { mutate: syncFeedbacks } = syncMutation;

  useEffect(() => {
    if (feedbacksQuery.data) {
      setFeedbacks(feedbacksQuery.data);
    }
  }, [feedbacksQuery.data]);

  const stats = useMemo<FeedbackStats>(() => {
    if (feedbacks.length === 0) {
      return {
        totalFeedbacks: 0,
        averageRating: 0,
        categoryAverages: {
          delivery: 0,
          quality: 0,
          packaging: 0,
          timing: 0,
          support: 0,
        },
      };
    }

    const totalOverall = feedbacks.reduce((sum, f) => sum + f.overallRating, 0);
    const categoryTotals: { [K in FeedbackCategory]: number } = {
      delivery: 0,
      quality: 0,
      packaging: 0,
      timing: 0,
      support: 0,
    };

    feedbacks.forEach((feedback) => {
      Object.keys(feedback.categories).forEach((key) => {
        categoryTotals[key as FeedbackCategory] += feedback.categories[key as FeedbackCategory];
      });
    });

    return {
      totalFeedbacks: feedbacks.length,
      averageRating: totalOverall / feedbacks.length,
      categoryAverages: {
        delivery: categoryTotals.delivery / feedbacks.length,
        quality: categoryTotals.quality / feedbacks.length,
        packaging: categoryTotals.packaging / feedbacks.length,
        timing: categoryTotals.timing / feedbacks.length,
        support: categoryTotals.support / feedbacks.length,
      },
    };
  }, [feedbacks]);

  const addFeedback = useCallback((feedbackData: {
    orderId: string;
    orderNumber: string;
    overallRating: FeedbackRating;
    categories: { [K in FeedbackCategory]: FeedbackRating };
    comment?: string;
  }) => {
    const newFeedback: Feedback = {
      id: Date.now().toString(),
      ...feedbackData,
      createdAt: new Date(),
    };

    const updated = [newFeedback, ...feedbacks];
    setFeedbacks(updated);
    syncFeedbacks(updated);
    console.log("[FeedbackContext] Feedback added for order", feedbackData.orderNumber);
  }, [feedbacks, syncFeedbacks]);

  const hasFeedback = useCallback((orderId: string) => {
    return feedbacks.some((f) => f.orderId === orderId);
  }, [feedbacks]);

  const getFeedbackByOrderId = useCallback((orderId: string) => {
    return feedbacks.find((f) => f.orderId === orderId);
  }, [feedbacks]);

  return useMemo(
    () => ({
      feedbacks,
      stats,
      isLoading: feedbacksQuery.isLoading,
      addFeedback,
      hasFeedback,
      getFeedbackByOrderId,
    }),
    [feedbacks, stats, feedbacksQuery.isLoading, addFeedback, hasFeedback, getFeedbackByOrderId]
  );
});
