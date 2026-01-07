import { Tabs } from "expo-router";
import { Home, ClipboardList, UserCircle, CreditCard, MapPin, AlertCircle, Crown } from "lucide-react-native";
import { useRef, useEffect, memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Platform, View, Animated, StyleSheet, Dimensions } from "react-native";
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSOS } from '@/contexts/SOSContext';

const { width } = Dimensions.get('window');

type TabIconProps = {
  name: string;
  color: string;
  focused: boolean;
};

type SOSTabIconProps = {
  focused: boolean;
};

const SOSTabIcon = memo(function SOSTabIcon({ focused }: SOSTabIconProps) {
  const sosContext = useSOS();
  const activeSOSCount = sosContext?.activeSOSCount || 0;
  const isSubscriber = sosContext?.isSubscriber || false;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    );

    pulseAnimation.start();
    glowAnimation.start();
    rotateAnimation.start();

    return () => {
      pulseAnimation.stop();
      glowAnimation.stop();
      rotateAnimation.stop();
    };
  }, [pulseAnim, glowAnim, rotateAnim]);

  const rotateDegrees = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const sosColor = isSubscriber ? '#10B981' : '#EF4444';

  return (
    <View style={sosTabIconStyles.container}>
      <Animated.View
        style={[
          sosTabIconStyles.glowContainer,
          {
            opacity: glowOpacity,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <View
          style={[
            sosTabIconStyles.glow,
            { backgroundColor: sosColor },
          ]}
        />
      </Animated.View>

      <Animated.View
        style={[
          sosTabIconStyles.button,
          {
            transform: [
              { scale: pulseAnim },
              { rotate: rotateDegrees },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={isSubscriber ? ['#10B981', '#059669'] : ['#EF4444', '#DC2626']}
          style={sosTabIconStyles.gradient}
        >
          <AlertCircle size={26} color="#FFF" strokeWidth={2.5} />
        </LinearGradient>
      </Animated.View>

      {activeSOSCount > 0 && (
        <View style={sosTabIconStyles.badge}>
          <View style={sosTabIconStyles.badgeInner}>
            {/* Empty - just a visual indicator */}
          </View>
        </View>
      )}
    </View>
  );
});

const sosTabIconStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    width: 70,
    height: 70,
    marginTop: Platform.OS === 'ios' ? -25 : -20,
  },
  glowContainer: {
    position: 'absolute' as const,
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    width: 68,
    height: 68,
    borderRadius: 34,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 18,
    elevation: 12,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden' as const,
  },
  gradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  badge: {
    position: 'absolute' as const,
    top: 5,
    right: 5,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  badgeInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
  },
});

const TabIcon = memo(function TabIcon({ name, color, focused }: TabIconProps) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(focused ? 1 : 0.85)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 80,
          friction: 6,
        }),
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -10,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.spring(bounceAnim, {
            toValue: 0,
            tension: 100,
            friction: 7,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0.85,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focused, scaleAnim, glowAnim, bounceAnim]);

  const iconSize = 24;

  const iconGradients: Record<string, readonly [string, string]> = {
    index: ['#14B8A6', '#0D9488'] as const,
    orders: ['#F59E0B', '#D97706'] as const,
    tracking: ['#3B82F6', '#2563EB'] as const,
    subscribe: ['#A855F7', '#9333EA'] as const,
    "subscription-status": ['#FFD700', '#F59E0B'] as const,
    profile: ['#EC4899', '#DB2777'] as const,
  };

  let IconComponent;
  switch (name) {
    case "index":
      IconComponent = Home;
      break;
    case "orders":
      IconComponent = ClipboardList;
      break;
    case "tracking":
      IconComponent = MapPin;
      break;
    case "subscribe":
      IconComponent = CreditCard;
      break;
    case "subscription-status":
      IconComponent = Crown;
      break;
    case "profile":
      IconComponent = UserCircle;
      break;
    default:
      IconComponent = Home;
  }

  const gradient = iconGradients[name] || (['#14B8A6', '#0D9488'] as const);

  return (
    <Animated.View
      style={[
        tabIconStyles.container,
        {
          transform: [
            { scale: scaleAnim },
            { translateY: bounceAnim },
          ],
        },
      ]}
    >
      {focused && (
        <Animated.View
          style={[
            tabIconStyles.glowRing,
            {
              opacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.7],
              }),
              transform: [
                {
                  scale: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.3],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={gradient}
            style={tabIconStyles.glowGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>
      )}
      <View style={tabIconStyles.iconWrapper}>
        {focused ? (
          <LinearGradient
            colors={gradient}
            style={tabIconStyles.iconGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <IconComponent
              size={iconSize}
              color="#FFFFFF"
              strokeWidth={2.8}
            />
          </LinearGradient>
        ) : (
          <View style={tabIconStyles.iconInactive}>
            <IconComponent
              size={iconSize}
              color={colors.tabIconDefault}
              strokeWidth={2}
            />
          </View>
        )}
      </View>
      {focused && (
        <Animated.View
          style={[
            tabIconStyles.activeIndicator,
            {
              opacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ]}
        >
          <LinearGradient
            colors={gradient}
            style={tabIconStyles.indicatorGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </Animated.View>
      )}
    </Animated.View>
  );
});

const tabIconStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative" as const,
    width: 56,
    height: 56,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    position: 'relative' as const,
  },
  iconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  iconInactive: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'transparent',
  },
  glowRing: {
    position: "absolute" as const,
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  glowGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    opacity: 0.4,
  },
  activeIndicator: {
    position: "absolute" as const,
    bottom: -8,
    width: 32,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden' as const,
  },
  indicatorGradient: {
    width: '100%',
    height: '100%',
  },
});

const isGlassAvailable = Platform.OS === 'ios' && isLiquidGlassAvailable();

const tabBarStyle = {
  position: "absolute" as const,
  borderTopWidth: 0,
  height: Platform.OS === "ios" ? 88 : 70,
  paddingTop: 8,
  paddingBottom: Platform.OS === "ios" ? 24 : 8,
  borderTopLeftRadius: 32,
  borderTopRightRadius: 32,
  backgroundColor: isGlassAvailable ? 'transparent' : undefined,
  overflow: 'hidden' as const,
};

const tabBarLabelStyle = {
  fontSize: 0,
  fontWeight: "800" as const,
  marginTop: 0,
  letterSpacing: 0,
  height: 0,
};

const tabBarIconStyle = {
  marginTop: 4,
  marginBottom: 0,
};

const tabBarItemStyle = {
  paddingTop: 0,
  paddingBottom: 0,
  gap: 0,
};



export default function TabLayout() {
  const { t } = useLanguage();
  const { colors, isDark } = useTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, [shimmerAnim]);
  
  const TabBarBackground = () => {
    const translateX = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-width, width],
    });

    return (
      <View style={StyleSheet.absoluteFill}>
        {isGlassAvailable ? (
          <GlassView 
            style={StyleSheet.absoluteFill} 
            glassEffectStyle="regular"
          />
        ) : (
          <BlurView 
            intensity={85}
            tint={isDark ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        )}
        <LinearGradient
          colors={[
            'rgba(20, 184, 166, 0.1)',
            'rgba(251, 146, 60, 0.08)',
            'rgba(168, 85, 247, 0.1)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <LinearGradient
            colors={[
              'transparent',
              'rgba(255, 255, 255, 0.1)',
              'transparent',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
    );
  };
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
          borderBottomWidth: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 3,
        },
        headerTintColor: colors.tint,
        headerTitleStyle: {
          color: colors.text,
          fontWeight: "800" as const,
          fontSize: 22,
        },
        tabBarStyle: {
          ...tabBarStyle,
          backgroundColor: isGlassAvailable ? 'transparent' : colors.cardBackground,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.15,
          shadowRadius: 24,
          elevation: 20,
          borderTopWidth: 2,
          borderTopColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
          borderLeftWidth: 0,
          borderRightWidth: 0,
        },
        tabBarLabelStyle,
        tabBarIconStyle,
        tabBarItemStyle,
        tabBarBackground: () => <TabBarBackground />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.tabs.home,
          tabBarIcon: ({ color, focused }) => <TabIcon name="index" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: t.tabs.orders,
          tabBarIcon: ({ color, focused }) => <TabIcon name="orders" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="tracking"
        options={{
          title: t.tabs.tracking,
          tabBarIcon: ({ color, focused }) => <TabIcon name="tracking" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="subscribe"
        options={{
          title: t.tabs.subscribe,
          tabBarIcon: ({ color, focused }) => <TabIcon name="subscribe" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="subscription-status"
        options={{
          title: t.tabs.myPlan,
          tabBarIcon: ({ color, focused }) => <TabIcon name="subscription-status" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t.tabs.profile,
          tabBarIcon: ({ color, focused }) => <TabIcon name="profile" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="sos"
        options={{
          href: null,
          title: "SOS",
          headerShown: false,
          tabBarIcon: ({ focused }) => <SOSTabIcon focused={focused} />,
        }}
      />
    </Tabs>
  );
}
