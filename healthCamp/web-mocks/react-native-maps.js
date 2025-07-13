import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

// Mock MapView component for web
const MapView = ({ children, style, initialRegion, ...props }) => {
  const openInGoogleMaps = () => {
    if (initialRegion) {
      const url = `https://www.google.com/maps?q=${initialRegion.latitude},${initialRegion.longitude}`;
      Linking.openURL(url);
    }
  };

  return (
    <View style={[styles.mapContainer, style]}>
      <Text style={styles.mapText}>🗺️ Map View</Text>
      <Text style={styles.mapSubtext}>
        {initialRegion 
          ? `Location: ${initialRegion.latitude.toFixed(4)}, ${initialRegion.longitude.toFixed(4)}`
          : 'Map not available on web'
        }
      </Text>
      <TouchableOpacity style={styles.openMapButton} onPress={openInGoogleMaps}>
        <Text style={styles.openMapButtonText}>Open in Google Maps</Text>
      </TouchableOpacity>
      {children}
    </View>
  );
};

// Mock Marker component for web
const Marker = ({ coordinate, title, description, ...props }) => {
  return (
    <View style={styles.marker}>
      <Text style={styles.markerText}>📍 {title || 'Marker'}</Text>
      {description && <Text style={styles.markerDescription}>{description}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    padding: 20,
  },
  mapText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  mapSubtext: {
    fontSize: 14,
    color: '#888',
    marginBottom: 15,
    textAlign: 'center',
  },
  openMapButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  openMapButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  marker: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  markerText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  markerDescription: {
    fontSize: 10,
    color: '#666',
  },
});

export default MapView;
export { Marker };
