export type FeedbackRating = 1 | 2 | 3 | 4 | 5;

export type FeedbackCategory = "delivery" | "quality" | "packaging" | "timing" | "support";

export type Feedback = {
  id: string;
  orderId: string;
  orderNumber: string;
  overallRating: FeedbackRating;
  categories: {
    [K in FeedbackCategory]: FeedbackRating;
  };
  comment?: string;
  createdAt: Date;
};

export type FeedbackStats = {
  totalFeedbacks: number;
  averageRating: number;
  categoryAverages: {
    [K in FeedbackCategory]: number;
  };
};
