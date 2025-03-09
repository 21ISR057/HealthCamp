import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Linking } from "react-native";
import { useRouter } from 'expo-router';
import { db, auth } from "../../../constants/firebase";
import { collection, query, where, getDocs, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { WebView } from 'react-native-webview'; // Use WebView for Geoapify maps
import * as Location from 'expo-location';

interface HealthCamp {
  id: string;
  organizationName: string;
  healthCampName: string;
  location: string;
  timeFrom: Date; // Use Date type
  timeTo: Date; // Use Date type
  description: string;
  ambulancesAvailable: string;
  hospitalNearby: string;
  latitude: number;
  longitude: number;
  registrationUrl: string;
}

export default function ViewCamp() {
  const [camps, setCamps] = useState<HealthCamp[]>([]);
  const [expandedCampId, setExpandedCampId] = useState<string | null>(null);
  const router = useRouter();
  const user = auth.currentUser;

  useEffect(() => {
    fetchCamps();
  }, []);

  const fetchCamps = async () => {
    const q = query(collection(db, "healthCamps"), where("adminId", "==", user?.uid));
    const querySnapshot = await getDocs(q);
    const campsData: HealthCamp[] = querySnapshot.docs.map(doc => {
      const data = doc.data();

      // Convert Firestore Timestamp to JavaScript Date
      const timeFrom = data.timeFrom instanceof Timestamp ? data.timeFrom.toDate() : new Date(data.timeFrom || new Date());
      const timeTo = data.timeTo instanceof Timestamp ? data.timeTo.toDate() : new Date(data.timeTo || new Date());

      if (isNaN(timeFrom.getTime()) || isNaN(timeTo.getTime())) {
        console.error("Invalid date detected:", data.timeFrom, data.timeTo);
        Alert.alert("Error", "Invalid date format in Firestore.");
      }

      return {
        id: doc.id,
        organizationName: data.organizationName,
        healthCampName: data.healthCampName,
        location: data.location,
        timeFrom, // Use parsed Date object
        timeTo, // Use parsed Date object
        description: data.description,
        ambulancesAvailable: data.ambulancesAvailable,
        hospitalNearby: data.hospitalNearby,
        latitude: data.latitude,
        longitude: data.longitude,
        registrationUrl: data.registrationUrl,
      } as HealthCamp;
    });
    setCamps(campsData);
  };

  const handleDeleteCamp = async (id: string) => {
    try {
      await deleteDoc(doc(db, "healthCamps", id));
      fetchCamps();
      Alert.alert("Success", "Camp deleted successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to delete camp. Please try again.");
    }
  };

  const handleViewMore = (id: string) => {
    setExpandedCampId(expandedCampId === id ? null : id);
  };

  const handleOpenMap = async (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Error", "Unable to open maps.");
    }
  };

  const handleOpenRegistrationLink = (url: string) => {
    Linking.openURL(url).catch(() => Alert.alert("Error", "Unable to open the link."));
  };

  // Generate Geoapify map URL
  const getGeoapifyMapUrl = (latitude: number, longitude: number) => {
    const apiKey = "0358f75d36084c9089636544e0aeed50"; // Your Geoapify API key
    return `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${longitude},${latitude}&zoom=14&marker=lonlat:${longitude},${latitude};color:%23ff0000;size:medium&apiKey=${apiKey}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Health Camps</Text>

      <FlatList
        data={camps}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: HealthCamp }) => (
          <View style={styles.campItem}>
            <Text style={styles.campName}>{item.healthCampName}</Text>
            <Text style={styles.campOrganization}>{item.organizationName}</Text>
            <Text style={styles.campLocation}>{item.location}</Text>
            <Text style={styles.campTime}>
              Time: {item.timeFrom.toLocaleTimeString()} - {item.timeTo.toLocaleTimeString()}
            </Text>

            <TouchableOpacity onPress={() => handleOpenRegistrationLink(item.registrationUrl)}>
              <Text style={styles.registrationLink}>Registration Link</Text>
            </TouchableOpacity>

            {expandedCampId === item.id && (
              <View>
                <Text style={styles.campDescription}>{item.description}</Text>
                <Text style={styles.campDetails}>Ambulances: {item.ambulancesAvailable}</Text>
                <Text style={styles.campDetails}>Hospital Nearby: {item.hospitalNearby}</Text>

                {/* Geoapify Map */}
                <WebView
                  source={{ uri: getGeoapifyMapUrl(item.latitude, item.longitude) }}
                  style={styles.map}
                />

                <TouchableOpacity style={styles.mapButton} onPress={() => handleOpenMap(item.latitude, item.longitude)}>
                  <Text style={styles.buttonText}>Open in Maps</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.editButton} onPress={() => router.push(`/Screens/Admin/EditCamp?id=${item.id}`)}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>