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
} from "react-native";
import * as Location from "expo-location";
import axios from "axios";

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
      {/* Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.navbarText}>Nearby Services Finder</Text>
      </View>

      {/* Toggle Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title={showMap ? "Show List" : "Visualize"}
          onPress={() => setShowMap(!showMap)}
        />
        <Button
          title={
            serviceType === "hospital" ? "Show Medical Shops" : "Show Hospitals"
          }
          onPress={toggleServiceType}
        />
      </View>

      {/* Map View */}
      {showMap && location ? (
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
      ) : (
        // List View
        <FlatList
          data={services}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.listItemTitle}>{item.name}</Text>
              <Text>{item.address}</Text>
              {item.distance && <Text>Distance: {item.distance}</Text>}

              {/* Navigation Button */}
              <TouchableOpacity
                style={styles.navigateButton}
                onPress={() => {
                  if (location) {
                    // Open Google Maps with directions from current location to the place
                    const url = `https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${item.latitude},${item.longitude}&travelmode=driving`;
                    Linking.openURL(url);
                  }
                }}
              >
                <Text style={styles.navigateButtonText}>🧭 Navigate</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Emergency Contacts */}
      <View style={styles.emergencyContainer}>
        <Text style={styles.emergencyTitle}>🚑 Emergency Contacts</Text>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => callNumber("108")}
        >
          <Text style={styles.callText}>🚨 108 - Ambulance Service</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => callNumber("112")}
        >
          <Text style={styles.callText}>
            🆘 112 - National Emergency Number
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sosButton}
          onPress={() =>
            location && sendSOSAlert(location.latitude, location.longitude)
          }
        >
          <Text style={styles.callText}>📢 SOS Emergency Alert</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f5f5f5" },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  navbar: { backgroundColor: "#007bff", padding: 15, alignItems: "center" },
  navbarText: { fontSize: 20, color: "white", fontWeight: "bold" },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  map: { width: width, height: height * 0.6 },
  mapPlaceholder: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 20,
    margin: 10,
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderStyle: "dashed",
    alignItems: "center",
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#495057",
    marginBottom: 8,
  },
  mapSubtitle: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 15,
    textAlign: "center",
  },
  servicesContainer: {
    width: "100%",
    marginBottom: 15,
  },
  servicesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#343a40",
    marginBottom: 10,
    textAlign: "center",
  },
  serviceItem: {
    backgroundColor: "#ffffff",
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#007bff",
  },
  serviceName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#212529",
  },
  serviceAddress: {
    fontSize: 12,
    color: "#6c757d",
    marginTop: 2,
  },
  serviceDistance: {
    fontSize: 12,
    color: "#28a745",
    fontWeight: "600",
    marginTop: 2,
  },
  moreServices: {
    fontSize: 12,
    color: "#6c757d",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 8,
  },
  openMapButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  openMapButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  listItem: { padding: 10, borderBottomWidth: 1, backgroundColor: "white" },
  listItemTitle: { fontWeight: "bold", color: "#333" },
  navigateButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 8,
    alignItems: "center",
  },
  navigateButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
  mapItemNavigateButton: {
    backgroundColor: "#28a745",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    marginTop: 6,
    alignItems: "center",
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
    marginTop: 5,
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  callText: { color: "#fff", fontWeight: "bold" },
  sosButton: {
    marginTop: 5,
    backgroundColor: "#ff0000",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
});
