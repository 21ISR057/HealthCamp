import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

interface Place {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: string;
}

// Function to initiate a call
const callNumber = (phoneNumber: string) => {
  Linking.openURL(`tel:${phoneNumber}`).catch((err) =>
    console.error("Error opening dialer", err)
  );
};

// Get User Location
const getLocation = async (): Promise<Location.LocationObjectCoords | null> => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Permission Denied",
      "Enable location services to fetch nearby services."
    );
    return null;
  }
  let location = await Location.getCurrentPositionAsync({});
  return location.coords;
};

// Fetch Nearby Services (Hospitals or Medical Shops)
const getDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2) + " km";
};

const fetchNearbyServices = async (
  latitude: number,
  longitude: number,
  category: string
): Promise<Place[]> => {
  const apiKey = "0358f75d36084c9089636544e0aeed50";
  const radiusMeters = 5000;
  const url = `https://api.geoapify.com/v2/places?categories=${category}&filter=circle:${longitude},${latitude},${radiusMeters}&limit=10&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);
    return response.data.features.map(
      (feature: any): Place => {
        const placeLat = feature.geometry.coordinates[1];
        const placeLon = feature.geometry.coordinates[0];
        return {
          name: feature.properties.name || "Unknown Place",
          address: feature.properties.address_line1 || "Address not available",
          latitude: placeLat,
          longitude: placeLon,
          distance: getDistance(latitude, longitude, placeLat, placeLon), // Calculate distance manually
          // rating: feature.properties.rating || 0, // Fetch rating
        };
      }
    );
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};

// Send SOS Alert
const sendSOSAlert = async (latitude: number, longitude: number) => {
  const emergencyNumber = "112"; // National emergency number
  const message = `Emergency! I need help. My location: https://www.google.com/maps?q=${latitude},${longitude}`;
  const smsUrl = `sms:${emergencyNumber}?body=${encodeURIComponent(message)}`;

  Linking.openURL(smsUrl).catch((err) =>
    console.error("Error sending SOS alert", err)
  );
};

// Main App Component
const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [
    location,
    setLocation,
  ] = useState<Location.LocationObjectCoords | null>(null);
  const [services, setServices] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [serviceType, setServiceType] = useState<"hospital" | "medical">(
    "hospital"
  );

  // Load language preference on component mount
  useEffect(() => {
    const loadLanguage = async () => {
      const storedLang = await AsyncStorage.getItem("language");
      if (storedLang) {
        i18n.changeLanguage(storedLang);
      }
    };
    loadLanguage();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const coords = await getLocation();
      if (!coords) {
        setLoading(false);
        return;
      }
      setLocation(coords);
      fetchServiceData(
        coords.latitude,
        coords.longitude,
        "healthcare.hospital"
      );
    };
    fetchData();
  }, []);

  const fetchServiceData = async (
    latitude: number,
    longitude: number,
    category: string
  ) => {
    setLoading(true);
    const data = await fetchNearbyServices(latitude, longitude, category);
    setServices(data);
    setLoading(false);
  };

  const toggleServiceType = async () => {
    const newType = serviceType === "hospital" ? "medical" : "hospital";
    setServiceType(newType);
    console.log(`Toggling service type to: ${newType}`);

    if (location) {
      const category =
        newType === "hospital" ? "healthcare.hospital" : "healthcare.pharmacy";
      await fetchServiceData(location.latitude, location.longitude, category);
    }
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#26A69A" barStyle="light-content" />

      {/* Header with Gradient */}
      <LinearGradient colors={["#26A69A", "#00695C"]} style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialIcons name="local-hospital" size={24} color="#FFFFFF" />
          <Text style={styles.title}>{t("emergency_service")}</Text>
          <Text style={styles.subtitle}>
            Find nearby hospitals & medical shops
          </Text>
        </View>
      </LinearGradient>

      {/* Emergency Action Buttons - Compact */}
      <View style={styles.emergencyButtons}>
        <TouchableOpacity
          style={styles.compactEmergencyButton}
          onPress={() => callNumber("108")}
        >
          <MaterialIcons name="warning" size={20} color="#FFFFFF" />
          <Text style={styles.compactButtonText}>SOS 108</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.compactAmbulanceButton}
          onPress={() => callNumber("102")}
        >
          <MaterialIcons name="local-hospital" size={20} color="#FFFFFF" />
          <Text style={styles.compactButtonText}>Ambulance 102</Text>
        </TouchableOpacity>
      </View>

      {/* Service Type Toggle */}
      <View style={styles.serviceToggle}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            serviceType === "hospital" && styles.activeToggle,
          ]}
          onPress={() => serviceType !== "hospital" && toggleServiceType()}
        >
          <MaterialIcons
            name="local-hospital"
            size={20}
            color={serviceType === "hospital" ? "#FFFFFF" : "#26A69A"}
          />
          <Text
            style={[
              styles.toggleText,
              serviceType === "hospital" && styles.activeToggleText,
            ]}
          >
            Hospitals
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            serviceType === "medical" && styles.activeToggle,
          ]}
          onPress={() => serviceType !== "medical" && toggleServiceType()}
        >
          <MaterialIcons
            name="local-pharmacy"
            size={20}
            color={serviceType === "medical" ? "#FFFFFF" : "#26A69A"}
          />
          <Text
            style={[
              styles.toggleText,
              serviceType === "medical" && styles.activeToggleText,
            ]}
          >
            Pharmacies
          </Text>
        </TouchableOpacity>
      </View>

      {/* View Toggle */}
      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[styles.viewToggleButton, !showMap && styles.activeViewToggle]}
          onPress={() => setShowMap(false)}
        >
          <MaterialIcons
            name="list"
            size={20}
            color={!showMap ? "#FFFFFF" : "#26A69A"}
          />
          <Text
            style={[
              styles.viewToggleText,
              !showMap && styles.activeViewToggleText,
            ]}
          >
            List View
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.viewToggleButton, showMap && styles.activeViewToggle]}
          onPress={() => setShowMap(true)}
        >
          <MaterialIcons
            name="map"
            size={20}
            color={showMap ? "#FFFFFF" : "#26A69A"}
          />
          <Text
            style={[
              styles.viewToggleText,
              showMap && styles.activeViewToggleText,
            ]}
          >
            Map View
          </Text>
        </TouchableOpacity>
      </View>

      {/* Loading State */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#26A69A" />
          <Text style={styles.loadingText}>Finding nearby services...</Text>
        </View>
      )}

      {/* Map View */}
      {showMap && location && !loading ? (
        <ScrollView
          style={styles.mapScrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapTitle}>📍 Map View</Text>
            <Text style={styles.mapSubtitle}>
              Your Location: {location.latitude.toFixed(4)},{" "}
              {location.longitude.toFixed(4)}
            </Text>

            <View style={styles.servicesContainer}>
              <Text style={styles.servicesTitle}>
                Nearby{" "}
                {serviceType === "hospital" ? "Hospitals" : "Medical Shops"} (
                {services.length})
              </Text>
              {services.slice(0, 3).map((place, index) => (
                <View key={index} style={styles.serviceItem}>
                  <Text style={styles.serviceName}>📍 {place.name}</Text>
                  <Text style={styles.serviceAddress}>{place.address}</Text>
                  <Text style={styles.serviceDistance}>
                    Distance: {place.distance}
                  </Text>
                  <TouchableOpacity
                    style={styles.mapItemNavigateButton}
                    onPress={() => {
                      if (location) {
                        // Open Google Maps with directions from current location to the place
                        const url = `https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${place.latitude},${place.longitude}&travelmode=driving`;
                        Linking.openURL(url);
                      }
                    }}
                  >
                    <Text style={styles.mapItemNavigateText}>🧭 Navigate</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {services.length > 3 && (
                <Text style={styles.moreServices}>
                  ... and {services.length - 3} more locations
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.openMapButton}
              onPress={() => {
                const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
                Linking.openURL(url);
              }}
            >
              <Text style={styles.openMapButtonText}>Open in Google Maps</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : null}

      {/* Services List */}
      {!showMap && !loading && services.length > 0 && (
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>
            Nearby {serviceType === "hospital" ? "Hospitals" : "Pharmacies"}
          </Text>
          <FlatList
            data={services}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.serviceCard}>
                <View style={styles.serviceHeader}>
                  <MaterialIcons
                    name={
                      serviceType === "hospital"
                        ? "local-hospital"
                        : "local-pharmacy"
                    }
                    size={24}
                    color="#26A69A"
                  />
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{item.name}</Text>
                    <Text style={styles.serviceAddress}>{item.address}</Text>
                    {item.distance && (
                      <View style={styles.distanceContainer}>
                        <MaterialIcons
                          name="location-on"
                          size={16}
                          color="#757575"
                        />
                        <Text style={styles.distanceText}>{item.distance}</Text>
                      </View>
                    )}
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.navigateButton}
                  onPress={() => {
                    if (location) {
                      const url = `https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${item.latitude},${item.longitude}&travelmode=driving`;
                      Linking.openURL(url);
                    }
                  }}
                >
                  <MaterialIcons name="directions" size={20} color="#FFFFFF" />
                  <Text style={styles.navigateButtonText}>Navigate</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}

      {/* No Services Found */}
      {!loading && !showMap && services.length === 0 && (
        <View style={styles.noServicesContainer}>
          <MaterialIcons name="search-off" size={64} color="#BDBDBD" />
          <Text style={styles.noServicesText}>No services found nearby</Text>
          <Text style={styles.noServicesSubtext}>
            Try changing your location or service type
          </Text>
        </View>
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#E0F2F1",
    marginTop: 6,
    textAlign: "center",
  },
  emergencyButtons: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 12,
  },
  compactEmergencyButton: {
    flex: 1,
    backgroundColor: "#FF5722",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#FF5722",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  compactAmbulanceButton: {
    flex: 1,
    backgroundColor: "#FF9800",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#FF9800",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  compactButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  mapScrollView: {
    flex: 1,
  },
  serviceToggle: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  toggleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeToggle: {
    backgroundColor: "#26A69A",
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#26A69A",
    marginLeft: 8,
  },
  activeToggleText: {
    color: "#FFFFFF",
  },
  viewToggle: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  viewToggleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeViewToggle: {
    backgroundColor: "#26A69A",
  },
  viewToggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#26A69A",
    marginLeft: 8,
  },
  activeViewToggleText: {
    color: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#26A69A",
    marginTop: 16,
    fontWeight: "500",
  },
  servicesSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#263238",
    marginBottom: 16,
    textAlign: "center",
  },
  serviceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#26A69A",
  },
  serviceHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  serviceInfo: {
    flex: 1,
    marginLeft: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#263238",
    marginBottom: 4,
  },
  serviceAddress: {
    fontSize: 14,
    color: "#546E7A",
    lineHeight: 20,
    marginBottom: 8,
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  distanceText: {
    fontSize: 13,
    color: "#757575",
    marginLeft: 4,
    fontWeight: "500",
  },
  navigateButton: {
    backgroundColor: "#26A69A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#26A69A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  navigateButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  noServicesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  noServicesText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#546E7A",
    marginTop: 16,
    textAlign: "center",
  },
  noServicesSubtext: {
    fontSize: 14,
    color: "#78909C",
    marginTop: 8,
    textAlign: "center",
  },
  map: { width: width, height: height * 0.6 },
  mapPlaceholder: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    margin: 12,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  mapTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#263238",
    marginBottom: 8,
  },
  mapSubtitle: {
    fontSize: 16,
    color: "#546E7A",
    marginBottom: 15,
    textAlign: "center",
  },
  servicesContainer: {
    width: "100%",
    marginBottom: 15,
  },
  servicesTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#263238",
    marginBottom: 12,
    textAlign: "center",
  },
  serviceItem: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    marginVertical: 8,
    borderRadius: 16,
    borderLeftWidth: 5,
    borderLeftColor: "#FF7043",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#263238",
  },
  serviceAddress: {
    fontSize: 14,
    color: "#546E7A",
    marginTop: 4,
  },
  serviceDistance: {
    fontSize: 14,
    color: "#2E7D32",
    fontWeight: "600",
    marginTop: 4,
  },
  moreServices: {
    fontSize: 12,
    color: "#6c757d",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 8,
  },
  openMapButton: {
    backgroundColor: "#3F51B5",
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 14,
    elevation: 6,
    shadowColor: "#3F51B5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  openMapButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  listItem: { padding: 10, borderBottomWidth: 1, backgroundColor: "white" },
  listItemTitle: { fontWeight: "bold", color: "#333" },
  navigateButton: {
    backgroundColor: "#3F51B5",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    shadowColor: "#3F51B5",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  navigateButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  mapItemNavigateButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 8,
    alignItems: "center",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  mapItemNavigateText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 12,
  },
  emergencyContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ff4d4d",
    alignItems: "center",
  },
  emergencyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#cc0000",
    textAlign: "center",
  },
  callButton: {
    marginTop: 8,
    backgroundColor: "#E53935",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#E53935",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  callText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 },
  sosButton: {
    marginTop: 8,
    backgroundColor: "#D32F2F",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#D32F2F",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});
