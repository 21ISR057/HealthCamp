import React, { useState, useEffect } from "react";
import { View, Text, Alert, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as Location from "expo-location"; // ✅ Import Location API
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types"; // ✅ Import correct navigation types

// Define navigation props
type AdminNocUploadProps = NativeStackScreenProps<RootStackParamList, "AdminNocUpload">;

const AdminNocUpload: React.FC = () => {
  const navigation = useNavigation<AdminNocUploadProps["navigation"]>(); // ✅ Fix Type Issue
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [location, setLocation] = useState<string>(""); // ✅ Location field

  // Function to pick a document (PDF only)
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      if (result.canceled) {
        Alert.alert("No File Selected", "Please select a NOC certificate.");
        return;
      }

      setFile(result.assets[0]); // Store selected file
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "Failed to pick document. Try again.");
    }
  };

  // Function to get current location
  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }

      const locationData = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = locationData.coords;
      setLocation(`Lat: ${latitude}, Lon: ${longitude}`);
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Failed to fetch location.");
    }
  };

  useEffect(() => {
    getLocation(); // ✅ Get location when the component mounts
  }, []);

  // Function to verify and proceed
  const verifyAndProceed = () => {
    if (!file) {
      Alert.alert("Upload Required", "Please upload a NOC certificate first.");
      return;
    }

    if (!location) {
      Alert.alert("Location Required", "Failed to retrieve location. Try again.");
      return;
    }

    Alert.alert("Verification Success", `NOC verified.\nLocation: ${location}\nRedirecting...`);
    navigation.navigate("Home"); // ✅ Redirect to HomeScreen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upload Your NOC Certificate</Text>

      {/* Upload Section */}
      <TouchableOpacity style={styles.uploadBox} onPress={pickDocument}>
        <Text style={styles.uploadText}>
          {file ? `📄 ${file.name}` : "Tap to Upload PDF"}
        </Text>
      </TouchableOpacity>

      {/* Location Field (Non-editable) */}
      <TextInput
        style={styles.locationInput}
        value={location}
        placeholder="Fetching location..."
        editable={false} // Read-only field
      />

      {/* Verify & Continue Button */}
      <TouchableOpacity
        style={[styles.verifyButton, (!file || !location) && styles.disabledButton]}
        onPress={verifyAndProceed}
        disabled={!file || !location}
      >
        <Text style={styles.buttonText}>Verify & Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AdminNocUpload;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  uploadBox: {
    width: "90%",
    height: 120,
    borderWidth: 2,
    borderColor: "#007BFF",
    borderStyle: "dashed",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    marginBottom: 20,
  },
  uploadText: {
    fontSize: 16,
    color: "#007BFF",
    fontWeight: "600",
    textAlign: "center",
  },
  locationInput: {
    width: "90%",
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#CED4DA",
    borderRadius: 8,
    backgroundColor: "#F8F9FA",
    textAlign: "center",
    marginBottom: 20,
  },
  verifyButton: {
    width: "80%",
    paddingVertical: 12,
    backgroundColor: "#28A745",
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#A9A9A9",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
