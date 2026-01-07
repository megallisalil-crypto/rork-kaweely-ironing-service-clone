import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { X, Crosshair, Check, MapPin } from "lucide-react-native";

export type MapPickedAddress = {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  city?: string;
  region?: string;
  country?: string;
};

type MapAddressPickerModalProps = {
  visible: boolean;
  onClose: () => void;
  onPick: (picked: MapPickedAddress) => void;
  accentColor: string;
};

type Coords = { latitude: number; longitude: number };

type NominatimReverseResponse = {
  display_name?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    region?: string;
    country?: string;
  };
};

async function getCurrentCoords(): Promise<Coords> {
  if (Platform.OS === "web") {
    const geo = (globalThis as any)?.navigator?.geolocation as
      | Geolocation
      | undefined;

    if (!geo) {
      throw new Error("Geolocation not available on web");
    }

    return await new Promise<Coords>((resolve, reject) => {
      geo.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 15000 }
      );
    });
  }

  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Location permission not granted");
  }

  const pos = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
}

async function reverseGeocodeNative(coords: Coords): Promise<MapPickedAddress> {
  const results = await Location.reverseGeocodeAsync({
    latitude: coords.latitude,
    longitude: coords.longitude,
  });

  const first = results?.[0];
  const parts = [
    first?.name,
    first?.street,
    first?.district,
    first?.city,
    first?.region,
    first?.country,
  ].filter((p): p is string => typeof p === "string" && p.trim().length > 0);

  const formattedAddress =
    parts.join(", ") || `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`;

  return {
    latitude: coords.latitude,
    longitude: coords.longitude,
    formattedAddress,
    city: first?.city ?? undefined,
    region: first?.region ?? undefined,
    country: first?.country ?? undefined,
  };
}

async function reverseGeocodeWeb(coords: Coords): Promise<MapPickedAddress> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
    String(coords.latitude)
  )}&lon=${encodeURIComponent(String(coords.longitude))}`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Reverse geocode failed (${res.status})`);
  }

  const data = (await res.json()) as NominatimReverseResponse;
  const formattedAddress =
    data.display_name || `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`;

  const city =
    data.address?.city ?? data.address?.town ?? data.address?.village ?? undefined;

  return {
    latitude: coords.latitude,
    longitude: coords.longitude,
    formattedAddress,
    city,
    region: data.address?.state ?? data.address?.region ?? undefined,
    country: data.address?.country ?? undefined,
  };
}

async function reverseGeocode(coords: Coords): Promise<MapPickedAddress> {
  if (Platform.OS === "web") {
    return reverseGeocodeWeb(coords);
  }
  return reverseGeocodeNative(coords);
}

export const MapAddressPickerModal = React.memo(function MapAddressPickerModal({
  visible,
  onClose,
  onPick,
  accentColor,
}: MapAddressPickerModalProps) {
  const mapRef = useRef<MapView | null>(null);

  const [isBooting, setIsBooting] = useState<boolean>(false);
  const [isResolving, setIsResolving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [coords, setCoords] = useState<Coords | null>(null);
  const [region, setRegion] = useState<Region | null>(null);

  const initialRegion = useMemo<Region>(() => {
    return (
      region ?? {
        latitude: coords?.latitude ?? 30.0444,
        longitude: coords?.longitude ?? 31.2357,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    );
  }, [coords?.latitude, coords?.longitude, region]);

  const boot = useCallback(async () => {
    setIsBooting(true);
    setErrorMessage(null);

    try {
      const current = await getCurrentCoords();
      console.log("[MapAddressPicker] Current coords:", current);
      setCoords(current);
      const nextRegion: Region = {
        latitude: current.latitude,
        longitude: current.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(nextRegion);
      mapRef.current?.animateToRegion(nextRegion, 550);
    } catch (e: any) {
      console.error("[MapAddressPicker] boot error:", e);
      setErrorMessage(
        "We couldn't access your current location. You can still pick on the map."
      );
      const fallback: Coords = { latitude: 30.0444, longitude: 31.2357 };
      setCoords(fallback);
      setRegion({
        latitude: fallback.latitude,
        longitude: fallback.longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      });
    } finally {
      setIsBooting(false);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      boot();
    } else {
      setIsResolving(false);
      setIsBooting(false);
      setErrorMessage(null);
      setCoords(null);
      setRegion(null);
    }
  }, [visible, boot]);

  const handleCenter = useCallback(async () => {
    try {
      setIsBooting(true);
      const current = await getCurrentCoords();
      console.log("[MapAddressPicker] Centering coords:", current);
      setCoords(current);
      const nextRegion: Region = {
        latitude: current.latitude,
        longitude: current.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(nextRegion);
      mapRef.current?.animateToRegion(nextRegion, 550);
    } catch (e: any) {
      console.error("[MapAddressPicker] center error:", e);
      Alert.alert(
        "Location unavailable",
        "Couldn't get your current location. Please pick manually on the map."
      );
    } finally {
      setIsBooting(false);
    }
  }, []);

  const handlePick = useCallback(async () => {
    if (!coords) return;
    setIsResolving(true);
    try {
      const resolved = await reverseGeocode(coords);
      console.log("[MapAddressPicker] resolved:", resolved);
      onPick(resolved);
      onClose();
    } catch (e: any) {
      console.error("[MapAddressPicker] reverse geocode error:", e);
      Alert.alert(
        "Couldn't get address",
        "We couldn't resolve the address. We'll use coordinates instead."
      );
      onPick({
        latitude: coords.latitude,
        longitude: coords.longitude,
        formattedAddress: `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(
          5
        )}`,
      });
      onClose();
    } finally {
      setIsResolving(false);
    }
  }, [coords, onClose, onPick]);

  const handleMapPress = useCallback(
    (e: any) => {
      const latitude: number | undefined = e?.nativeEvent?.coordinate?.latitude;
      const longitude: number | undefined = e?.nativeEvent?.coordinate?.longitude;
      if (typeof latitude !== "number" || typeof longitude !== "number") return;
      console.log("[MapAddressPicker] map press:", { latitude, longitude });
      setCoords({ latitude, longitude });
    },
    [setCoords]
  );

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container} testID="mapPicker.container">
        <View style={[styles.topBar, { borderBottomColor: "rgba(255,255,255,0.12)" }]}>
          <View style={styles.topBarLeft}>
            <View style={[styles.iconBubble, { borderColor: accentColor }]}
              testID="mapPicker.iconBubble"
            >
              <MapPin size={18} color={accentColor} strokeWidth={2.5} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title} testID="mapPicker.title">Pick on map</Text>
              <Text style={styles.subtitle} testID="mapPicker.subtitle">
                Tap anywhere to drop the pin
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
            testID="mapPicker.close"
          >
            <X size={20} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <View style={styles.mapWrap}>
          <MapView
            ref={(r) => {
              mapRef.current = r;
            }}
            style={StyleSheet.absoluteFill}
            initialRegion={initialRegion}
            onPress={handleMapPress}
            onRegionChangeComplete={(r) => setRegion(r)}
            testID="mapPicker.map"
          >
            {coords && (
              <Marker
                coordinate={coords}
                draggable
                onDragEnd={(e) => {
                  const latitude: number | undefined =
                    e?.nativeEvent?.coordinate?.latitude;
                  const longitude: number | undefined =
                    e?.nativeEvent?.coordinate?.longitude;
                  if (typeof latitude !== "number" || typeof longitude !== "number") return;
                  console.log("[MapAddressPicker] marker drag:", { latitude, longitude });
                  setCoords({ latitude, longitude });
                }}
                testID="mapPicker.marker"
              />
            )}
          </MapView>

          {isBooting && (
            <View style={styles.loadingOverlay} testID="mapPicker.loading">
              <ActivityIndicator color={accentColor} />
              <Text style={styles.loadingText}>Finding your location…</Text>
            </View>
          )}

          {!!errorMessage && (
            <View style={styles.toast} testID="mapPicker.toast">
              <Text style={styles.toastText}>{errorMessage}</Text>
            </View>
          )}

          <View style={styles.fabRow} pointerEvents="box-none">
            <TouchableOpacity
              style={[styles.fab, { borderColor: "rgba(255,255,255,0.18)" }]}
              onPress={handleCenter}
              disabled={isBooting}
              testID="mapPicker.center"
            >
              <Crosshair size={18} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomBar} testID="mapPicker.bottomBar">
          <TouchableOpacity
            style={[styles.confirmBtn, { backgroundColor: accentColor }]}
            onPress={handlePick}
            disabled={!coords || isResolving}
            testID="mapPicker.confirm"
          >
            {isResolving ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <>
                <Check size={18} color="#000000" strokeWidth={3} />
                <Text style={styles.confirmText}>Use this address</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  topBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    paddingRight: 12,
  },
  iconBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1.5,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900" as const,
  },
  subtitle: {
    color: "rgba(255,255,255,0.62)",
    fontSize: 11,
    fontWeight: "600" as const,
    marginTop: 2,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  mapWrap: {
    flex: 1,
    overflow: "hidden",
  },
  bottomBar: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(0,0,0,0.92)",
  },
  confirmBtn: {
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  confirmText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "900" as const,
    letterSpacing: 0.2,
  },
  loadingOverlay: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.72)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700" as const,
  },
  toast: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "rgba(255, 179, 0, 0.18)",
    borderWidth: 1,
    borderColor: "rgba(255, 179, 0, 0.35)",
  },
  toastText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700" as const,
  },
  fabRow: {
    position: "absolute",
    right: 14,
    bottom: 14,
  },
  fab: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
});
