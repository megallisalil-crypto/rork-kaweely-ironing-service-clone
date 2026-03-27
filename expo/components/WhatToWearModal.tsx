import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { X, Cloud, CloudRain, Sun, Thermometer, Wind, Droplets, Shirt, CloudSnow } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";
import * as Location from 'expo-location';
import AsyncStorage from "@react-native-async-storage/async-storage";

const PROFILE_STORAGE_KEY = "kaweely_profile";

type WeatherData = {
  temp: number;
  description: string;
  humidity: number;
  windSpeed: number;
  condition: 'clear' | 'clouds' | 'rain' | 'snow' | 'thunderstorm';
  location: string;
};

type ClothingRecommendation = {
  category: string;
  items: string[];
  icon: typeof Shirt;
};

type WhatToWearModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function WhatToWearModal({ visible, onClose }: WhatToWearModalProps) {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recommendations, setRecommendations] = useState<ClothingRecommendation[]>([]);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      loadGenderAndWeather();
    }
  }, [visible]);

  const loadGenderAndWeather = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const stored = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored && typeof stored === 'string' && stored.trim().length > 0) {
        const trimmedStored = stored.trim();
        
        if (!trimmedStored.startsWith('{') && !trimmedStored.startsWith('[')) {
          console.warn("[WhatToWear] Stored profile value is not valid JSON, clearing");
          await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
        } else {
          try {
            const profile = JSON.parse(trimmedStored);
            setGender(profile.gender || 'male');
          } catch (parseError) {
            console.error("[WhatToWear] JSON Parse error:", parseError);
            console.log("[WhatToWear] Failed value:", stored?.substring(0, 50));
            await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
          }
        }
      }
    } catch (e) {
      console.error("[WhatToWear] Error loading gender:", e);
      try {
        await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
      } catch (clearError) {
        console.error("[WhatToWear] Error clearing profile storage:", clearError);
      }
    }

    await fetchWeatherAndRecommendations();
  };

  const fetchWeatherAndRecommendations = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Location permission denied. Using default location (Cairo).');
        await getWeatherForDefaultLocation();
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;
      await fetchWeather(latitude, longitude);
    } catch (err) {
      console.error("Error getting location:", err);
      setError('Could not get location. Using default (Cairo).');
      await getWeatherForDefaultLocation();
    }
  };

  const getWeatherForDefaultLocation = async () => {
    await fetchWeather(30.0444, 31.2357);
  };

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;
      const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
      
      const [weatherResponse, geocodeResponse] = await Promise.all([
        fetch(weatherUrl),
        fetch(geocodeUrl, {
          headers: {
            'User-Agent': 'Kaweely-App'
          }
        })
      ]);
      
      if (!weatherResponse.ok) {
        throw new Error(`Weather API error: ${weatherResponse.status}`);
      }
      
      const weatherData = await weatherResponse.json();
      
      let locationName = 'Unknown Location';
      if (geocodeResponse.ok) {
        const geocodeData = await geocodeResponse.json();
        console.log('Geocode response:', geocodeData);
        
        if (geocodeData.address) {
          const parts = [
            geocodeData.address.city || geocodeData.address.town || geocodeData.address.village,
            geocodeData.address.state,
            geocodeData.address.country
          ].filter(Boolean);
          
          locationName = parts.length > 0 ? parts.join(', ') : geocodeData.display_name || 'Unknown Location';
        } else if (geocodeData.display_name) {
          locationName = geocodeData.display_name;
        }
      }
      
      const weather: WeatherData = {
        temp: Math.round(weatherData.current.temperature_2m),
        description: getWeatherDescription(weatherData.current.weather_code),
        humidity: weatherData.current.relative_humidity_2m,
        windSpeed: Math.round(weatherData.current.wind_speed_10m),
        condition: mapWeatherCondition(weatherData.current.weather_code),
        location: locationName,
      };

      setWeather(weather);
      generateRecommendations(weather);
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError('Failed to fetch weather data');
    } finally {
      setIsLoading(false);
    }
  };

  const getWeatherDescription = (code: number): string => {
    const descriptions: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Foggy',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      95: 'Thunderstorm',
      96: 'Thunderstorm with hail',
      99: 'Thunderstorm with hail',
    };
    return descriptions[code] || 'Unknown';
  };

  const mapWeatherCondition = (code: number): 'clear' | 'clouds' | 'rain' | 'snow' | 'thunderstorm' => {
    if (code === 0 || code === 1) return 'clear';
    if (code === 2 || code === 3 || code === 45 || code === 48) return 'clouds';
    if (code >= 51 && code <= 65) return 'rain';
    if (code >= 71 && code <= 75) return 'snow';
    if (code >= 95 && code <= 99) return 'thunderstorm';
    return 'clouds';
  };

  const generateRecommendations = (weatherData: WeatherData) => {
    const { temp, condition } = weatherData;
    const userGender = gender;

    const recs: ClothingRecommendation[] = [];

    if (temp < 10) {
      recs.push({
        category: 'Outerwear',
        items: userGender === 'male' 
          ? ['Heavy winter coat', 'Thick scarf', 'Warm gloves', 'Beanie']
          : ['Warm winter coat', 'Stylish scarf', 'Gloves', 'Winter hat'],
        icon: Shirt,
      });
      recs.push({
        category: 'Base Layer',
        items: userGender === 'male'
          ? ['Thermal shirt', 'Thick sweater', 'Thermal pants', 'Wool socks']
          : ['Thermal top', 'Cozy sweater', 'Thermal leggings', 'Warm tights'],
        icon: Shirt,
      });
    } else if (temp < 18) {
      recs.push({
        category: 'Outerwear',
        items: userGender === 'male'
          ? ['Light jacket', 'Hoodie', 'Casual blazer']
          : ['Cardigan', 'Light coat', 'Denim jacket', 'Trench coat'],
        icon: Shirt,
      });
      recs.push({
        category: 'Main Outfit',
        items: userGender === 'male'
          ? ['Long-sleeve shirt', 'Jeans', 'Chinos', 'Sneakers']
          : ['Long-sleeve top', 'Jeans', 'Dress pants', 'Ankle boots'],
        icon: Shirt,
      });
    } else if (temp < 25) {
      recs.push({
        category: 'Main Outfit',
        items: userGender === 'male'
          ? ['T-shirt', 'Light button-up', 'Chinos', 'Casual shoes']
          : ['Blouse', 'Light top', 'Jeans', 'Skirt', 'Flats'],
        icon: Shirt,
      });
      recs.push({
        category: 'Optional',
        items: userGender === 'male'
          ? ['Light sweater (for evening)', 'Sunglasses']
          : ['Light cardigan (for evening)', 'Sunglasses'],
        icon: Shirt,
      });
    } else {
      recs.push({
        category: 'Summer Wear',
        items: userGender === 'male'
          ? ['Light t-shirt', 'Shorts', 'Sandals', 'Cap']
          : ['Summer dress', 'Tank top', 'Shorts', 'Sandals', 'Sun hat'],
        icon: Shirt,
      });
      recs.push({
        category: 'Essentials',
        items: ['Sunglasses', 'Sunscreen', 'Light fabric', 'Stay hydrated'],
        icon: Sun,
      });
    }

    if (condition === 'rain') {
      recs.push({
        category: 'Rain Gear',
        items: ['Umbrella', 'Waterproof jacket', 'Water-resistant shoes', 'Rain boots'],
        icon: CloudRain,
      });
    }

    setRecommendations(recs);
  };

  const getWeatherIcon = () => {
    if (!weather) return Sun;
    
    switch (weather.condition) {
      case 'clear':
        return Sun;
      case 'clouds':
        return Cloud;
      case 'rain':
      case 'thunderstorm':
        return CloudRain;
      case 'snow':
        return CloudSnow;
      default:
        return Sun;
    }
  };

  const getWeatherColor = () => {
    if (!weather) return colors.warning;
    
    switch (weather.condition) {
      case 'clear':
        return '#FDB813';
      case 'clouds':
        return '#94a3b8';
      case 'rain':
      case 'thunderstorm':
        return '#3b82f6';
      case 'snow':
        return '#cbd5e1';
      default:
        return colors.warning;
    }
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingTop: 16,
      paddingBottom: 32,
      height: '85%',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '800' as const,
      color: colors.text,
    },
    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${colors.error}15`,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scrollContent: {
      padding: 20,
    },
    loadingContainer: {
      paddingVertical: 60,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      marginTop: 16,
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '600' as const,
    },
    errorContainer: {
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 200,
    },
    errorText: {
      fontSize: 14,
      color: colors.error,
      textAlign: 'center',
      marginTop: 12,
      fontWeight: '600' as const,
    },
    weatherCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 20,
      padding: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    weatherHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    weatherLeft: {
      flex: 1,
    },
    locationText: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 4,
    },
    descriptionText: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: '500' as const,
    },
    weatherIconContainer: {
      width: 70,
      height: 70,
      borderRadius: 35,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 6,
    },
    tempContainer: {
      alignItems: 'center',
      marginVertical: 12,
    },
    temperature: {
      fontSize: 48,
      fontWeight: '900' as const,
      color: colors.text,
    },
    weatherDetails: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    weatherDetail: {
      alignItems: 'center',
      gap: 6,
    },
    weatherDetailLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      fontWeight: '600' as const,
    },
    weatherDetailValue: {
      fontSize: 14,
      fontWeight: '800' as const,
      color: colors.text,
    },
    recommendationsTitle: {
      fontSize: 18,
      fontWeight: '800' as const,
      color: colors.text,
      marginBottom: 16,
    },
    recommendationCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    recommendationHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 12,
    },
    recommendationIconBg: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    recommendationCategory: {
      fontSize: 15,
      fontWeight: '800' as const,
      color: colors.text,
    },
    itemsList: {
      gap: 8,
    },
    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    itemBullet: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.accent,
    },
    itemText: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: '600' as const,
      flex: 1,
    },
    genderBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      marginBottom: 16,
    },
    genderBadgeText: {
      fontSize: 12,
      fontWeight: '700' as const,
      color: '#FFFFFF',
    },
  });

  const WeatherIcon = getWeatherIcon();
  const weatherColor = getWeatherColor();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>What to Wear Today</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <X size={22} color={colors.error} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={{ flex: 1 }} 
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.scrollContent}>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.tint} />
                  <Text style={styles.loadingText}>Getting weather data...</Text>
                </View>
              ) : error && !weather ? (
                <View style={styles.errorContainer}>
                  <Cloud size={48} color={colors.textSecondary} strokeWidth={2} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : weather ? (
                <>
                  <View style={[styles.genderBadge, { backgroundColor: gender === 'male' ? '#3b82f6' : '#ec4899' }]}>
                    <Text style={styles.genderBadgeText}>
                      Recommendations for {gender === 'male' ? 'Men' : 'Women'}
                    </Text>
                  </View>

                  <View style={styles.weatherCard}>
                    <View style={styles.weatherHeader}>
                      <View style={styles.weatherLeft}>
                        <Text style={styles.locationText}>{weather.location}</Text>
                        <Text style={styles.descriptionText}>{weather.description}</Text>
                      </View>
                      <View style={[styles.weatherIconContainer, { backgroundColor: `${weatherColor}20` }]}>
                        <WeatherIcon size={36} color={weatherColor} strokeWidth={2.5} />
                      </View>
                    </View>

                    <View style={styles.tempContainer}>
                      <Text style={styles.temperature}>{weather.temp}°C</Text>
                    </View>

                    <View style={styles.weatherDetails}>
                      <View style={styles.weatherDetail}>
                        <Droplets size={18} color={colors.tint} strokeWidth={2.5} />
                        <Text style={styles.weatherDetailLabel}>Humidity</Text>
                        <Text style={styles.weatherDetailValue}>{weather.humidity}%</Text>
                      </View>
                      <View style={styles.weatherDetail}>
                        <Wind size={18} color={colors.accent} strokeWidth={2.5} />
                        <Text style={styles.weatherDetailLabel}>Wind</Text>
                        <Text style={styles.weatherDetailValue}>{weather.windSpeed} km/h</Text>
                      </View>
                      <View style={styles.weatherDetail}>
                        <Thermometer size={18} color={colors.warning} strokeWidth={2.5} />
                        <Text style={styles.weatherDetailLabel}>Feels Like</Text>
                        <Text style={styles.weatherDetailValue}>{weather.temp}°C</Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.recommendationsTitle}>Clothing Recommendations</Text>

                  {recommendations.map((rec, index) => {
                    const IconComponent = rec.icon;
                    return (
                      <View key={index} style={styles.recommendationCard}>
                        <View style={styles.recommendationHeader}>
                          <View style={[styles.recommendationIconBg, { backgroundColor: `${colors.tint}20` }]}>
                            <IconComponent size={22} color={colors.tint} strokeWidth={2.5} />
                          </View>
                          <Text style={styles.recommendationCategory}>{rec.category}</Text>
                        </View>
                        <View style={styles.itemsList}>
                          {rec.items.map((item, itemIndex) => (
                            <View key={itemIndex} style={styles.itemRow}>
                              <View style={styles.itemBullet} />
                              <Text style={styles.itemText}>{item}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    );
                  })}
                </>
              ) : null}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
