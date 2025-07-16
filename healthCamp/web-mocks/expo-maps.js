import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

// Mock AppleMaps.View component for web
const AppleMapsView = ({ style, cameraPosition, markers, ...props }) => {
  const openInGoogleMaps = () => {
    if (cameraPosition?.coordinates) {
      const { latitude, longitude } = cameraPosition.coordinates;
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
      Linking.openURL(url);
    }
  };

  return (
    <View style={[styles.mapContainer, style]}>
      <Text style={styles.mapText}>🗺️ Apple Maps View</Text>
      <Text style={styles.mapSubtext}>
        {cameraPosition?.coordinates 
          ? `Location: ${cameraPosition.coordinates.latitude.toFixed(4)}, ${cameraPosition.coordinates.longitude.toFixed(4)}`
          : 'Map not available on web'
        }
      </Text>
      {markers && markers.length > 0 && (
        <View style={styles.markersContainer}>
          <Text style={styles.markersTitle}>Markers ({markers.length}):</Text>
          {markers.slice(0, 3).map((marker, index) => (
            <Text key={index} style={styles.markerText}>
              📍 {marker.title || `Marker ${index + 1}`}
            </Text>
          ))}
          {markers.length > 3 && (
            <Text style={styles.moreMarkersText}>
              ... and {markers.length - 3} more
            </Text>
          )}
        </View>
      )}
      <TouchableOpacity style={styles.openMapButton} onPress={openInGoogleMaps}>
        <Text style={styles.openMapButtonText}>Open in Google Maps</Text>
      </TouchableOpacity>
    </View>
  );
};

// Mock GoogleMaps.View component for web
const GoogleMapsView = ({ style, cameraPosition, markers, ...props }) => {
  const openInGoogleMaps = () => {
    if (cameraPosition?.coordinates) {
      const { latitude, longitude } = cameraPosition.coordinates;
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
      Linking.openURL(url);
    }
  };

  return (
    <View style={[styles.mapContainer, style]}>
      <Text style={styles.mapText}>🗺️ Google Maps View</Text>
      <Text style={styles.mapSubtext}>
        {cameraPosition?.coordinates 
          ? `Location: ${cameraPosition.coordinates.latitude.toFixed(4)}, ${cameraPosition.coordinates.longitude.toFixed(4)}`
          : 'Map not available on web'
        }
      </Text>
      {markers && markers.length > 0 && (
        <View style={styles.markersContainer}>
          <Text style={styles.markersTitle}>Markers ({markers.length}):</Text>
          {markers.slice(0, 3).map((marker, index) => (
            <Text key={index} style={styles.markerText}>
              📍 {marker.title || `Marker ${index + 1}`}
              {marker.snippet && <Text style={styles.snippetText}> - {marker.snippet}</Text>}
            </Text>
          ))}
          {markers.length > 3 && (
            <Text style={styles.moreMarkersText}>
              ... and {markers.length - 3} more
            </Text>
          )}
        </View>
      )}
      <TouchableOpacity style={styles.openMapButton} onPress={openInGoogleMaps}>
        <Text style={styles.openMapButtonText}>Open in Google Maps</Text>
      </TouchableOpacity>
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
    minHeight: 200,
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
  markersContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
  markersTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
  },
  markerText: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  snippetText: {
    fontSize: 10,
    color: '#888',
  },
  moreMarkersText: {
    fontSize: 10,
    color: '#999',
    fontStyle: 'italic',
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
});

// Export the mock components
export const AppleMaps = {
  View: AppleMapsView,
};

export const GoogleMaps = {
  View: GoogleMapsView,
};
