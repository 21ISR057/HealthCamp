import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native";
import { useLocalSearchParams } from "expo-router";

const CampDetails = () => {
  const params = useLocalSearchParams();

  // Convert medicalFacilities string to array
  const medicalFacilities = params.medicalFacilities
    ? JSON.parse(params.medicalFacilities as string)
    : [];

  const openMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(params.location as string)}`;
    Linking.openURL(url).catch((err) => console.error("Failed to open Maps:", err));
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.innerContainer}>
          <Image source={{ uri: params.image as string }} style={styles.postImage} />
          <Text style={styles.postContainer}>{params.campName}</Text>
          <Text style={styles.postLocation}>📍 {params.location}</Text>

          <TouchableOpacity style={styles.mapButton} onPress={openMaps}>
            <Text style={styles.mapButtonText}>View Location on Maps</Text>
          </TouchableOpacity>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👨‍⚕️ Doctor</Text>
            <Text style={styles.detailText}>{params.doctorName}</Text>
            <Text style={styles.detailText}>{params.doctorDetails}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏥 Medical Facilities</Text>
            {medicalFacilities.map((facility: string, index: number) => (
              <Text key={index} style={styles.detailText}>✅ {facility}</Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CampDetails;

const styles = StyleSheet.create({
    container: {
      
      backgroundColor: "#F8F9FA",
      alignItems: "center", // Centers horizontally
      justifyContent: "center", // Centers vertically
    },
    scrollView: {
      width: "100%",
    },
    contentContainer: {
      width: "80%", // Ensures good responsiveness
      maxWidth: 400, // Prevents excessive stretching
      backgroundColor: "#FFF",
      borderRadius: 10,
      padding: 15,
      elevation: 5,
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
    },
    innerContainer: {
      width: "100%",
      alignItems: "center",
    },
    postImage: {
      width: "100%",
      height: 200,
      borderRadius: 8,
      marginBottom: 10,
    },
    postContainer: {
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
      color: "#333",
      marginBottom: 5,
    },
    postLocation: {
      fontSize: 16,
      fontWeight: "600",
      color: "#555",
      marginBottom: 8,
      textAlign: "center",
    },
    mapButton: {
      backgroundColor: "#FF5733",
      paddingVertical: 10,
      borderRadius: 6,
      alignItems: "center",
      justifyContent: "center",
      width: "80%",
      marginBottom: 12,
    },
    mapButtonText: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#FFF",
    },
    section: {
      width: "100%",
      paddingHorizontal: 10,
      marginBottom: 15,
      alignItems: "center",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#222",
      marginBottom: 6,
      textAlign: "center",
    },
    detailText: {
      fontSize: 14,
      color: "#444",
      textAlign: "center",
      marginTop: 4,
    },
  });
  