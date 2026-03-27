import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Reminder } from '@/types/reminder';
import { scheduleReminderNotification, cancelScheduledNotification } from '@/utils/notifications';

const REMINDERS_STORAGE_KEY = '@kaweely_reminders';

export const [ReminderProvider, useReminders] = createContextHook(() => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      console.log('[ReminderContext] Loading reminders from storage');
      const stored = await AsyncStorage.getItem(REMINDERS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const hydrated = parsed.map((r: any) => ({
          ...r,
          scheduledDate: new Date(r.scheduledDate),
          createdAt: new Date(r.createdAt),
        }));
        setReminders(hydrated);
        console.log('[ReminderContext] Loaded reminders:', hydrated.length);
      }
    } catch (error) {
      console.error('[ReminderContext] Error loading reminders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveReminders = async (updatedReminders: Reminder[]) => {
    try {
      await AsyncStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(updatedReminders));
      console.log('[ReminderContext] Saved reminders to storage');
    } catch (error) {
      console.error('[ReminderContext] Error saving reminders:', error);
    }
  };

  const addReminder = useCallback(async (title: string, message: string, scheduledDate: Date) => {
    try {
      console.log('[ReminderContext] Adding reminder:', { title, scheduledDate });
      
      const notificationId = await scheduleReminderNotification(title, message, scheduledDate);
      
      const newReminder: Reminder = {
        id: Date.now().toString(),
        title,
        message,
        scheduledDate,
        isActive: true,
        notificationId,
        createdAt: new Date(),
      };

      const updatedReminders = [...reminders, newReminder];
      setReminders(updatedReminders);
      await saveReminders(updatedReminders);

      console.log('[ReminderContext] Reminder added successfully:', newReminder.id);
      return newReminder;
    } catch (error) {
      console.error('[ReminderContext] Error adding reminder:', error);
      throw error;
    }
  }, [reminders]);

  const deleteReminder = useCallback(async (id: string) => {
    try {
      console.log('[ReminderContext] Deleting reminder:', id);
      
      const reminder = reminders.find(r => r.id === id);
      if (reminder?.notificationId) {
        await cancelScheduledNotification(reminder.notificationId);
      }

      const updatedReminders = reminders.filter(r => r.id !== id);
      setReminders(updatedReminders);
      await saveReminders(updatedReminders);

      console.log('[ReminderContext] Reminder deleted successfully');
    } catch (error) {
      console.error('[ReminderContext] Error deleting reminder:', error);
    }
  }, [reminders]);

  const toggleReminder = useCallback(async (id: string) => {
    try {
      console.log('[ReminderContext] Toggling reminder:', id);
      
      const reminder = reminders.find(r => r.id === id);
      if (!reminder) return;

      if (reminder.isActive && reminder.notificationId) {
        await cancelScheduledNotification(reminder.notificationId);
      } else if (!reminder.isActive) {
        const notificationId = await scheduleReminderNotification(
          reminder.title,
          reminder.message,
          reminder.scheduledDate
        );
        reminder.notificationId = notificationId;
      }

      const updatedReminders = reminders.map(r =>
        r.id === id ? { ...r, isActive: !r.isActive } : r
      );
      setReminders(updatedReminders);
      await saveReminders(updatedReminders);

      console.log('[ReminderContext] Reminder toggled successfully');
    } catch (error) {
      console.error('[ReminderContext] Error toggling reminder:', error);
    }
  }, [reminders]);

  const getActiveReminders = useCallback(() => {
    return reminders.filter(r => r.isActive && r.scheduledDate > new Date());
  }, [reminders]);

  return useMemo(() => ({
    reminders,
    isLoading,
    addReminder,
    deleteReminder,
    toggleReminder,
    getActiveReminders,
  }), [reminders, isLoading, addReminder, deleteReminder, toggleReminder, getActiveReminders]);
});
