import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, Alert, Dimensions, FlatList, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

interface Hospital {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

// Function to initiate a call
const callNumber = (phoneNumber: string) => {
  Linking.openURL(`tel:${phoneNumber}`).catch(err => console.error('Error opening dialer', err));
};

// Get User Location
const getLocation = async (): Promise<Location.LocationObjectCoords | null> => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission Denied', 'Enable location services to fetch nearby hospitals.');
    return null;
  }
  let location = await Location.getCurrentPositionAsync({});
  return location.coords;
};

// Fetch Nearby Hospitals
const fetchNearbyHospitals = async (latitude: number, longitude: number): Promise<Hospital[]> => {
  const apiKey = '0358f75d36084c9089636544e0aeed50'; // Replace with your API Key
  const radiusMeters = 5000;
  const url = `https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=circle:${longitude},${latitude},${radiusMeters}&limit=10&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);
    return response.data.features.map((feature: any): Hospital => ({
      name: feature.properties.name || 'Unknown Hospital',
      address: feature.properties.address_line1 || 'Address not available',
      latitude: feature.properties.lat,
      longitude: feature.properties.lon,
    }));
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    return [];
  }
};

// Main App Component
const App: React.FC = () => {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showMap, setShowMap] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const coords = await getLocation();
      if (!coords) {
        setLoading(false);
        return;
      }
      setLocation(coords);
      const hospitalData = await fetchNearbyHospitals(coords.latitude, coords.longitude);
      setHospitals(hospitalData);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.navbarText}>Hospital Finder</Text>
      </View>

      {/* Toggle Button */}
      <View style={styles.buttonContainer}>
        <Button title={showMap ? 'Show List' : 'Visualize'} onPress={() => setShowMap(!showMap)} />
      </View>

      {/* Map View */}
      {showMap && location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title="Your Location"
            pinColor="blue"
          />
          {hospitals.map((hospital, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: hospital.latitude, longitude: hospital.longitude }}
              title={hospital.name}
              description={hospital.address}
            />
          ))}
        </MapView>
      ) : (
        // Table View
        <FlatList
          data={hospitals}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.listItemTitle}>{item.name}</Text>
              <Text>{item.address}</Text>
            </View>
          )}
        />
      )}

      {/* Emergency Contacts */}
      <View style={styles.emergencyContainer}>
  <Text style={styles.emergencyTitle}>🚑 Emergency Contacts</Text>
  <TouchableOpacity style={styles.callButton} onPress={() => callNumber('108')}>
    <Text style={styles.callText}>🚨 108 - Ambulance Service</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.callButton} onPress={() => callNumber('102')}>
    <Text style={styles.callText}>🏥 102 - Pregnant Woman Helpline</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.callButton} onPress={() => callNumber('112')}>
    <Text style={styles.callText}>🆘 112 - National Emergency Number</Text>
  </TouchableOpacity>
</View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navbar: {
    backgroundColor: '#007bff',
    padding: 15,
    alignItems: 'center',
  },
  navbarText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  map: {
    width: width,
    height: height * 0.6,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  listItemTitle: {
    fontWeight: 'bold',
  },
  emergencyContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#ffe5e5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff4d4d',
    shadowColor: '#ff0000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6, // For Android shadow
    alignItems: 'center',
  },
  emergencyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#cc0000',
    textAlign: 'center',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  callButton: {
    width: '90%',
    backgroundColor: '#ff4d4d',
    paddingVertical: 12,
    marginVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#b30000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  callText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 1,
  },
});
