import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from "@react-native-picker/picker";
import { db } from "../../../constants/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import DateTimePicker from '@react-native-community/datetimepicker';

const districts = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", 
  "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", 
  "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", 
  "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", 
  "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", 
  "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"
];

export default function EditCamp() {
  const { id } = useLocalSearchParams(); // Get the `id` from the query parameter
  const [organizationName, setOrganizationName] = useState("");
  const [healthCampName, setHealthCampName] = useState("");
  const [location, setLocation] = useState("");
  const [timeFrom, setTimeFrom] = useState(new Date());
  const [timeTo, setTimeTo] = useState(new Date());
  const [description, setDescription] = useState("");
  const [ambulancesAvailable, setAmbulancesAvailable] = useState("");
  const [hospitalNearby, setHospitalNearby] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [registrationUrl, setRegistrationUrl] = useState("");
  const [showTimeFromPicker, setShowTimeFromPicker] = useState(false);
  const [showTimeToPicker, setShowTimeToPicker] = useState(false);

  const router = useRouter();

  // Fetch the camp details when the component mounts
  useEffect(() => {
    fetchCamp();
  }, []);

  const fetchCamp = async () => {
    if (!id) {
      Alert.alert("Error", "Camp ID is missing!");
      return;
    }

    const docRef = doc(db, "healthCamps", id as string);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setOrganizationName(data.organizationName);
      setHealthCampName(data.healthCampName);
      setLocation(data.location);
      setTimeFrom(data.timeFrom.toDate());
      setTimeTo(data.timeTo.toDate());
      setDescription(data.description);
      setAmbulancesAvailable(data.ambulancesAvailable);
      setHospitalNearby(data.hospitalNearby);
      setLatitude(data.latitude);
      setLongitude(data.longitude);
      setRegistrationUrl(data.registrationUrl);
    } else {
      Alert.alert("Error", "Camp not found!");
    }
  };

  const handleUpdateCamp = async () => {
    if (!organizationName || !healthCampName || !location || !description || !ambulancesAvailable || !hospitalNearby || !latitude || !longitude || !registrationUrl) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      await updateDoc(doc(db, "healthCamps", id as string), {
        organizationName,
        healthCampName,
        location,
        timeFrom,
        timeTo,
        description,
        ambulancesAvailable,
        hospitalNearby,
        latitude,
        longitude,
        registrationUrl,
      });

      Alert.alert("Success", "Health Camp Updated Successfully!");
      router.push("/Screens/Admin/ViewCamp"); // Navigate back to ViewCamp
    } catch (error) {
      Alert.alert("Error", "Failed to update health camp. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Health Camp</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Organization Name:</Text>
        <TextInput style={styles.input} placeholder="Enter Organization Name" value={organizationName} onChangeText={setOrganizationName} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Health Camp Name:</Text>
        <TextInput style={styles.input} placeholder="Enter Health Camp Name" value={healthCampName} onChangeText={setHealthCampName} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Location:</Text>
        <Picker
          selectedValue={location}
          style={styles.picker}
          onValueChange={(itemValue: string) => setLocation(itemValue)}
        >
          {districts.map((district) => (
            <Picker.Item key={district} label={district} value={district} />
          ))}
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Time From:</Text>
        <TouchableOpacity style={styles.timeButton} onPress={() => setShowTimeFromPicker(true)}>
          <Text style={styles.timeButtonText}>{timeFrom.toLocaleTimeString()}</Text>
        </TouchableOpacity>
        {showTimeFromPicker && (
          <DateTimePicker
            value={timeFrom}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowTimeFromPicker(false);
              if (selectedTime) setTimeFrom(selectedTime);
            }}
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Time To:</Text>
        <TouchableOpacity style={styles.timeButton} onPress={() => setShowTimeToPicker(true)}>
          <Text style={styles.timeButtonText}>{timeTo.toLocaleTimeString()}</Text>
        </TouchableOpacity>
        {showTimeToPicker && (
          <DateTimePicker
            value={timeTo}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowTimeToPicker(false);
              if (selectedTime) setTimeTo(selectedTime);
            }}
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description:</Text>
        <TextInput style={styles.input} placeholder="Enter Description" value={description} onChangeText={setDescription} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Ambulances Available:</Text>
        <TextInput style={styles.input} placeholder="Enter Number of Ambulances" value={ambulancesAvailable} onChangeText={setAmbulancesAvailable} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Hospital Nearby:</Text>
        <TextInput style={styles.input} placeholder="Enter Nearby Hospital" value={hospitalNearby} onChangeText={setHospitalNearby} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Latitude:</Text>
        <TextInput style={styles.input} placeholder="Enter Latitude" value={latitude} onChangeText={setLatitude} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Longitude:</Text>
        <TextInput style={styles.input} placeholder="Enter Longitude" value={longitude} onChangeText={setLongitude} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Registration URL:</Text>
        <TextInput style={styles.input} placeholder="Enter Registration URL" value={registrationUrl} onChangeText={setRegistrationUrl} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleUpdateCamp}>
        <Text style={styles.buttonText}>Update Camp</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E8F5E9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#2E7D32",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#2E7D32",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  picker: {
    height: 40,
    borderColor: "#2E7D32",
    borderWidth: 1,
    borderRadius: 5,
  },
  timeButton: {
    backgroundColor: "#2E7D32",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  timeButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});