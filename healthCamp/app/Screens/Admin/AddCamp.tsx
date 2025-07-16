import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { db, auth } from "../../../constants/firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

const districts = [
  "Ariyalur",
  "Chengalpattu",
  "Chennai",
  "Coimbatore",
  "Cuddalore",
  "Dharmapuri",
  "Dindigul",
  "Erode",
  "Kallakurichi",
  "Kanchipuram",
  "Kanyakumari",
  "Karur",
  "Krishnagiri",
  "Madurai",
  "Nagapattinam",
  "Namakkal",
  "Nilgiris",
  "Perambalur",
  "Pudukkottai",
  "Ramanathapuram",
  "Ranipet",
  "Salem",
  "Sivaganga",
  "Tenkasi",
  "Thanjavur",
  "Theni",
  "Thoothukudi",
  "Tiruchirappalli",
  "Tirunelveli",
  "Tirupathur",
  "Tiruppur",
  "Tiruvallur",
  "Tiruvannamalai",
  "Tiruvarur",
  "Vellore",
  "Viluppuram",
  "Virudhunagar",
];

export default function AddCamp() {
  const { t, i18n } = useTranslation();
  const [organizationName, setOrganizationName] = useState("");
  const [healthCampName, setHealthCampName] = useState("");
  const [location, setLocation] = useState(districts[0]);
  const [date, setDate] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [description, setDescription] = useState("");
  const [ambulancesAvailable, setAmbulancesAvailable] = useState("");
  const [hospitalNearby, setHospitalNearby] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [registrationUrl, setRegistrationUrl] = useState("");

  const router = useRouter();

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

  const handleAddCamp = async () => {
    try {
      // Basic validation
      if (!organizationName || !healthCampName || !location) {
        Alert.alert("Error", t("please_fill_all_fields"));
        return;
      }

      // Set default values if not provided
      const finalDate = date || "2024-12-25";
      const finalTimeFrom = timeFrom || "09:00";
      const finalTimeTo = timeTo || "17:00";
      const finalDescription = description || "Health Camp";
      const finalAmbulances = ambulancesAvailable || "1";
      const finalHospital = hospitalNearby || "Yes";
      const finalLatitude = latitude || "12.9716";
      const finalLongitude = longitude || "77.5946";
      const finalUrl = registrationUrl || "https://example.com";

      // Create date objects
      const campDate = new Date(finalDate);
      const timeFromDate = new Date(`${finalDate}T${finalTimeFrom}:00`);
      const timeToDate = new Date(`${finalDate}T${finalTimeTo}:00`);

      // Check authentication
      if (!auth.currentUser) {
        Alert.alert("Error", "Please log in first!");
        return;
      }

      // Generate camp ID
      const campId = `camp_${Date.now()}`;

      // Prepare camp data
      const campData = {
        organizationName,
        healthCampName,
        location,
        date: Timestamp.fromDate(campDate),
        timeFrom: Timestamp.fromDate(timeFromDate),
        timeTo: Timestamp.fromDate(timeToDate),
        description: finalDescription,
        ambulancesAvailable: finalAmbulances,
        hospitalNearby: finalHospital,
        latitude: parseFloat(finalLatitude),
        longitude: parseFloat(finalLongitude),
        registrationUrl: finalUrl,
        adminId: auth.currentUser.uid,
        createdAt: Timestamp.now(),
      };

      await setDoc(doc(db, "healthCamps", campId), campData);

      Alert.alert("Success", t("camp_created_successfully"));

      // Reset form
      setOrganizationName("");
      setHealthCampName("");
      setLocation(districts[0]);
      setDate("");
      setTimeFrom("");
      setTimeTo("");
      setDescription("");
      setAmbulancesAvailable("");
      setHospitalNearby("");
      setLatitude("");
      setLongitude("");
      setRegistrationUrl("");
    } catch (error) {
      console.error("Error saving camp:", error);
      Alert.alert("Error", "Failed to save camp. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>{t("add_health_camp")}</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Organization Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Organization Name"
          value={organizationName}
          onChangeText={setOrganizationName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t("camp_name")}:</Text>
        <TextInput
          style={styles.input}
          placeholder={t("enter_camp_name")}
          value={healthCampName}
          onChangeText={setHealthCampName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t("camp_location")}:</Text>
        {districts && districts.length > 0 ? (
          <Picker
            selectedValue={location}
            style={styles.picker}
            onValueChange={(itemValue) => setLocation(itemValue)}
          >
            {districts.map((district) => (
              <Picker.Item key={district} label={district} value={district} />
            ))}
          </Picker>
        ) : (
          <Text>No districts available</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t("camp_date")} (YYYY-MM-DD):</Text>
        <TextInput
          style={styles.input}
          placeholder={t("select_date")}
          value={date}
          onChangeText={setDate}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Start {t("camp_time")} (HH:MM):</Text>
        <TextInput
          style={styles.input}
          placeholder={t("select_time")}
          value={timeFrom}
          onChangeText={setTimeFrom}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>End {t("camp_time")} (HH:MM):</Text>
        <TextInput
          style={styles.input}
          placeholder={t("select_time")}
          value={timeTo}
          onChangeText={setTimeTo}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t("camp_description")}:</Text>
        <TextInput
          style={styles.input}
          placeholder={t("enter_description")}
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Ambulances Available:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Number of Ambulances"
          value={ambulancesAvailable}
          onChangeText={setAmbulancesAvailable}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Hospital Nearby:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Nearby Hospital"
          value={hospitalNearby}
          onChangeText={setHospitalNearby}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Latitude:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Latitude"
          value={latitude}
          onChangeText={setLatitude}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Longitude:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Longitude"
          value={longitude}
          onChangeText={setLongitude}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Website URL:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Website URL"
          value={registrationUrl}
          onChangeText={setRegistrationUrl}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAddCamp}>
        <Text style={styles.buttonText}>{t("create_camp")}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 10,
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
    backgroundColor: "#FFF",
  },
  picker: {
    height: 50,
    borderColor: "#2E7D32",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#FFF",
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
