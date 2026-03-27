import { Platform, Alert } from "react-native";
import * as Notifications from "expo-notifications";
import { OrderStatus } from "@/types/order";
import { SpecialOffer } from "@/types/offer";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function sendOrderNotification(
  orderNumber: string,
  status: OrderStatus
) {
  const notificationMessages: Record<OrderStatus, { title: string; body: string }> = {
    pending: {
      title: "Order Received",
      body: `Order ${orderNumber} has been received and is being processed.`,
    },
    pickup_scheduled: {
      title: "Pickup Scheduled",
      body: `Driver will arrive soon to pick up your clothes for order ${orderNumber}.`,
    },
    pickup_in_progress: {
      title: "Driver On The Way! 🚗",
      body: `Your driver is on the way to pick up your clothes for order ${orderNumber}.`,
    },
    processing: {
      title: "Ironing in Progress",
      body: `Your clothes for order ${orderNumber} are being ironed.`,
    },
    ready: {
      title: "Order Ready! ✨",
      body: `Your order ${orderNumber} is ready for delivery.`,
    },
    delivery_in_progress: {
      title: "Out for Delivery! 🚚",
      body: `Your order ${orderNumber} is on its way to you!`,
    },
    completed: {
      title: "Order Delivered! ✅",
      body: `Order ${orderNumber} has been successfully delivered. Thank you!`,
    },
    cancelled: {
      title: "Order Cancelled",
      body: `Order ${orderNumber} has been cancelled.`,
    },
  };

  const message = notificationMessages[status];

  if (Platform.OS === "web") {
    Alert.alert(message.title, message.body);
    return;
  }

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: message.title,
        body: message.body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}

export async function sendSpecialOfferNotification(offer: SpecialOffer) {
  const message = {
    title: `🎉 ${offer.title}`,
    body: `${offer.description} - Use code: ${offer.discountPercentage}OFF`,
  };

  if (Platform.OS === "web") {
    Alert.alert(message.title, message.body);
    return;
  }

  try {
    const { status } = await Notifications.getPermissionsAsync();
    
    if (status !== "granted") {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== "granted") {
        console.log("Notification permissions not granted");
        return;
      }
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: message.title,
        body: message.body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: {
          offerType: offer.type,
          discountPercentage: offer.discountPercentage,
        },
      },
      trigger: null,
    });

    console.log(`Sent offer notification: ${offer.title}`);
  } catch (error) {
    console.error("Error sending offer notification:", error);
  }
}

export async function scheduleReminderNotification(
  title: string,
  message: string,
  scheduledDate: Date
): Promise<string | undefined> {
  if (Platform.OS === "web") {
    console.log('[Notifications] Web reminder scheduled:', { title, scheduledDate });
    return undefined;
  }

  try {
    const { status } = await Notifications.getPermissionsAsync();
    
    if (status !== "granted") {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== "granted") {
        console.log("Notification permissions not granted");
        return undefined;
      }
    }

    const now = new Date();
    const triggerTime = scheduledDate.getTime() - now.getTime();

    if (triggerTime <= 0) {
      console.log('[Notifications] Scheduled date is in the past');
      return undefined;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: message,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: {
          type: 'reminder',
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: Math.floor(triggerTime / 1000),
      },
    });

    console.log(`[Notifications] Reminder scheduled with ID: ${notificationId}`);
    return notificationId;
  } catch (error) {
    console.error("[Notifications] Error scheduling reminder:", error);
    return undefined;
  }
}

export async function cancelScheduledNotification(notificationId: string) {
  if (Platform.OS === "web") {
    console.log('[Notifications] Web reminder cancelled:', notificationId);
    return;
  }

  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log(`[Notifications] Cancelled notification: ${notificationId}`);
  } catch (error) {
    console.error("[Notifications] Error cancelling notification:", error);
  }
}
