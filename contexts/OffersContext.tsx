import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { SpecialOffer, EventDate } from "@/types/offer";
import { islamicEvents, egyptianHolidays, birthdayOffer } from "@/constants/specialEvents";
import { sendSpecialOfferNotification } from "@/utils/notifications";

const PROFILE_STORAGE_KEY = "kaweely_profile";
const NOTIFIED_OFFERS_KEY = "kaweely_notified_offers";

function hijriToGregorian(islamicYear: number, islamicMonth: number, islamicDay: number): Date {
  const baseDate = new Date(2024, 0, 1);
  const baseHijriYear = 1445;
  const baseHijriMonth = 6;
  
  const yearDiff = islamicYear - baseHijriYear;
  const monthDiff = islamicMonth - baseHijriMonth;
  const totalMonths = (yearDiff * 12) + monthDiff;
  
  const avgHijriMonthDays = 29.53;
  const estimatedDays = (totalMonths * avgHijriMonthDays) + islamicDay;
  
  const estimatedDate = new Date(baseDate);
  estimatedDate.setDate(baseDate.getDate() + estimatedDays);
  
  return estimatedDate;
}

function isDateInRange(targetDate: Date, checkDate: Date, durationDays: number): boolean {
  const startOfDay = new Date(checkDate);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endDate = new Date(startOfDay);
  endDate.setDate(endDate.getDate() + durationDays);
  
  const targetStartOfDay = new Date(targetDate);
  targetStartOfDay.setHours(0, 0, 0, 0);
  
  return targetStartOfDay >= startOfDay && targetStartOfDay < endDate;
}

function parseBirthdayDate(birthdayString: string): { day: number; month: number } | null {
  const parts = birthdayString.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    if (!isNaN(day) && !isNaN(month) && day > 0 && day <= 31 && month > 0 && month <= 12) {
      return { day, month };
    }
  }
  return null;
}

function checkEventActive(event: EventDate, today: Date, birthday?: string): SpecialOffer | null {
  if (event.gregorianDate) {
    const [month, day] = event.gregorianDate.split('-').map(n => parseInt(n, 10));
    const eventDate = new Date(today.getFullYear(), month - 1, day);
    
    if (isDateInRange(today, eventDate, event.durationDays)) {
      return {
        id: `${event.type}-${event.name}`,
        type: event.type,
        title: event.name,
        description: event.description,
        discountPercentage: event.discountPercentage,
        validUntil: new Date(eventDate.getTime() + event.durationDays * 24 * 60 * 60 * 1000),
        eventName: event.name,
        icon: event.icon,
        isActive: true,
        backgroundColor: event.backgroundColor,
      };
    }
  }
  
  if (event.islamicMonth && event.islamicDay) {
    const currentYear = today.getFullYear();
    const currentHijriYear = Math.floor(1445 + (currentYear - 2024) * 1.03);
    
    for (let yearOffset = -1; yearOffset <= 1; yearOffset++) {
      const estimatedDate = hijriToGregorian(
        currentHijriYear + yearOffset,
        event.islamicMonth,
        event.islamicDay
      );
      
      if (isDateInRange(today, estimatedDate, event.durationDays)) {
        return {
          id: `${event.type}-${event.name}`,
          type: event.type,
          title: event.name,
          description: event.description,
          discountPercentage: event.discountPercentage,
          validUntil: new Date(estimatedDate.getTime() + event.durationDays * 24 * 60 * 60 * 1000),
          eventName: event.name,
          icon: event.icon,
          isActive: true,
          backgroundColor: event.backgroundColor,
        };
      }
    }
  }
  
  return null;
}

function checkBirthdayOffer(birthday: string | undefined, today: Date): SpecialOffer | null {
  if (!birthday) return null;
  
  const parsed = parseBirthdayDate(birthday);
  if (!parsed) return null;
  
  const birthdayThisYear = new Date(today.getFullYear(), parsed.month - 1, parsed.day);
  
  if (isDateInRange(today, birthdayThisYear, birthdayOffer.durationDays)) {
    return {
      id: 'birthday-offer',
      type: 'birthday',
      title: birthdayOffer.name,
      description: birthdayOffer.description,
      discountPercentage: birthdayOffer.discountPercentage,
      validUntil: new Date(birthdayThisYear.getTime() + birthdayOffer.durationDays * 24 * 60 * 60 * 1000),
      eventName: birthdayOffer.name,
      icon: birthdayOffer.icon,
      isActive: true,
      backgroundColor: birthdayOffer.backgroundColor,
    };
  }
  
  return null;
}

export const [OffersProvider, useOffers] = createContextHook(() => {
  const [activeOffers, setActiveOffers] = useState<SpecialOffer[]>([]);
  const [birthday, setBirthday] = useState<string | undefined>(undefined);
  const [notifiedOffers, setNotifiedOffers] = useState<Set<string>>(new Set());

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const stored = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
        if (stored && typeof stored === 'string' && stored.trim().length > 0) {
          const trimmedStored = stored.trim();
          
          if (!trimmedStored.startsWith('{') && !trimmedStored.startsWith('[')) {
            console.warn("Stored profile value is not valid JSON, clearing and using empty data");
            try {
              await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
            } catch (e) {
              console.error("Error removing invalid profile data:", e);
            }
            return "";
          }
          
          try {
            const profile = JSON.parse(trimmedStored);
            return profile.birthday || "";
          } catch (parseError) {
            console.error("Error parsing profile data:", parseError);
            try {
              await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
            } catch (e) {
              console.error("Error removing corrupted profile data:", e);
            }
            return "";
          }
        }
        return "";
      } catch (error) {
        console.error("Error loading profile for offers:", error);
        try {
          await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
        } catch (e) {
          console.error("Error clearing profile AsyncStorage:", e);
        }
        return "";
      }
    },
  });

  useEffect(() => {
    if (profileQuery.data !== undefined) {
      setBirthday(profileQuery.data);
    }
  }, [profileQuery.data]);

  useEffect(() => {
    const loadNotifiedOffers = async () => {
      try {
        const stored = await AsyncStorage.getItem(NOTIFIED_OFFERS_KEY);
        if (stored && typeof stored === 'string' && stored.trim().length > 0) {
          const trimmedStored = stored.trim();
          
          if (!trimmedStored.startsWith('[') && !trimmedStored.startsWith('{')) {
            console.warn("Stored notified offers value is not valid JSON, clearing");
            try {
              await AsyncStorage.removeItem(NOTIFIED_OFFERS_KEY);
            } catch (e) {
              console.error("Error removing invalid notified offers:", e);
            }
            return;
          }
          
          try {
            setNotifiedOffers(new Set(JSON.parse(trimmedStored)));
          } catch (parseError) {
            console.error("Error parsing notified offers:", parseError);
            try {
              await AsyncStorage.removeItem(NOTIFIED_OFFERS_KEY);
            } catch (e) {
              console.error("Error removing corrupted notified offers:", e);
            }
          }
        }
      } catch (error) {
        console.error("Error loading notified offers:", error);
        try {
          await AsyncStorage.removeItem(NOTIFIED_OFFERS_KEY);
        } catch (e) {
          console.error("Error clearing notified offers AsyncStorage:", e);
        }
      }
    };
    loadNotifiedOffers();
  }, []);

  useEffect(() => {
    const checkOffers = async () => {
      const today = new Date();
      const offers: SpecialOffer[] = [];

      const birthdayOfferResult = checkBirthdayOffer(birthday, today);
      if (birthdayOfferResult) {
        offers.push(birthdayOfferResult);
      }

      for (const event of egyptianHolidays) {
        const offer = checkEventActive(event, today, birthday);
        if (offer) {
          offers.push(offer);
        }
      }

      for (const event of islamicEvents) {
        const offer = checkEventActive(event, today, birthday);
        if (offer) {
          offers.push(offer);
        }
      }

      setActiveOffers(offers);
      console.log(`Active offers found: ${offers.length}`, offers.map(o => o.title));

      for (const offer of offers) {
        if (!notifiedOffers.has(offer.id)) {
          await sendSpecialOfferNotification(offer);
          const updatedNotified = new Set(notifiedOffers);
          updatedNotified.add(offer.id);
          setNotifiedOffers(updatedNotified);
          
          try {
            const jsonString = JSON.stringify(Array.from(updatedNotified));
            if (jsonString && jsonString !== 'undefined' && jsonString !== 'null') {
              await AsyncStorage.setItem(NOTIFIED_OFFERS_KEY, jsonString);
            }
          } catch (error) {
            console.error("Error saving notified offers:", error);
          }
        }
      }

      const currentOfferIds = new Set(offers.map(o => o.id));
      const expiredNotifications = Array.from(notifiedOffers).filter(
        id => !currentOfferIds.has(id)
      );
      
      if (expiredNotifications.length > 0) {
        const updatedNotified = new Set(
          Array.from(notifiedOffers).filter(id => currentOfferIds.has(id))
        );
        setNotifiedOffers(updatedNotified);
        
        try {
          const jsonString = JSON.stringify(Array.from(updatedNotified));
          if (jsonString && jsonString !== 'undefined' && jsonString !== 'null') {
            await AsyncStorage.setItem(NOTIFIED_OFFERS_KEY, jsonString);
          }
        } catch (error) {
          console.error("Error cleaning notified offers:", error);
        }
      }
    };

    checkOffers();
    const interval = setInterval(checkOffers, 1000 * 60 * 60);

    return () => clearInterval(interval);
  }, [birthday, notifiedOffers]);

  const highestDiscountOffer = useMemo(() => {
    if (activeOffers.length === 0) return null;
    return activeOffers.reduce((highest, current) =>
      current.discountPercentage > highest.discountPercentage ? current : highest
    );
  }, [activeOffers]);

  return useMemo(
    () => ({
      activeOffers,
      highestDiscountOffer,
      hasActiveOffers: activeOffers.length > 0,
      isLoading: profileQuery.isLoading,
    }),
    [activeOffers, highestDiscountOffer, profileQuery.isLoading]
  );
});
