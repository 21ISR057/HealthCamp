import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from 'expo-router';
import { db, storage } from "../../../constants/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';

export default function AddCamp() {
  const [organizationName, setOrganizationName] = useState("");
  const [healthCampName, setHealthCampName] = useState("");
  const [location, setLocation] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<{ uri: string } | null>(null);
  const [ambulancesAvailable, setAmbulancesAvailable] = useState("");
  const [hospitalNearby, setHospitalNearby] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [registrationUrl, setRegistrationUrl] = useState("");

  const router = useRouter();
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage({ uri: result.assets[0].uri });
    }
  };

  const uploadImage = async (uid: string) => {
    if (!image) return null;

    const imageRef = ref(storage, `healthCamps/${uid}.jpg`);
    const response = await fetch(image.uri);
    const blob = await response.blob();

    await uploadBytes(imageRef, blob);
    return await getDownloadURL(imageRef);
  };

  const handleAddCamp = async () => {
    if (!organizationName || !healthCampName || !location || !timeFrom || !timeTo || !description || !image || !ambulancesAvailable || !hospitalNearby || !latitude || !longitude || !registrationUrl) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      const campId = new Date().getTime().toString();
      const imageURL = await uploadImage(campId);

      await setDoc(doc(db, "healthCamps", campId), {
        organizationName,
        healthCampName,
        location,
        timeFrom,
        timeTo,
        description,
        imageURL,
        ambulancesAvailable,
        hospitalNearby,
        latitude,
        longitude,
        registrationUrl,
      });

      Alert.alert("Success", "Health Camp Added Successfully!");

      // Try navigating to AdminPanel first
      try {
        router.push("../(Screens)/Admin/AdminPanel");
      } catch (error) {
        console.error("AdminPanel not found. Redirecting to home screen...");
        // Fallback to home screen
        router.push("/");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to add health camp. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Health Camp</Text>

      <TextInput style={styles.input} placeholder="Organization Name" value={organizationName} onChangeText={setOrganizationName} />
      <TextInput style={styles.input} placeholder="Health Camp Name" value={healthCampName} onChangeText={setHealthCampName} />
      <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
      <TextInput style={styles.input} placeholder="Time From" value={timeFrom} onChangeText={setTimeFrom} />
      <TextInput style={styles.input} placeholder="Time To" value={timeTo} onChangeText={setTimeTo} />
      <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />
      <TextInput style={styles.input} placeholder="Ambulances Available" value={ambulancesAvailable} onChangeText={setAmbulancesAvailable} />
      <TextInput style={styles.input} placeholder="Hospital Nearby" value={hospitalNearby} onChangeText={setHospitalNearby} />
      <TextInput style={styles.input} placeholder="Latitude" value={latitude} onChangeText={setLatitude} />
      <TextInput style={styles.input} placeholder="Longitude" value={longitude} onChangeText={setLongitude} />
      <TextInput style={styles.input} placeholder="Registration URL" value={registrationUrl} onChangeText={setRegistrationUrl} />

      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadText}>{image ? "Image Selected" : "Upload Image"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleAddCamp}>
        <Text style={styles.buttonText}>Add Camp</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "90%",
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 14,
    width: "90%",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
  uploadButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    marginTop: 10,
  },
  uploadText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
});