export interface Reminder {
  id: string;
  title: string;
  message: string;
  scheduledDate: Date;
  isActive: boolean;
  notificationId?: string;
  createdAt: Date;
}

export type ReminderType = 'laundry' | 'pickup' | 'delivery' | 'custom';
