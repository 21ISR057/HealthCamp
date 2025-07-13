import React, { useState } from "react";
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
import DateTimePicker from "@react-native-community/datetimepicker";

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
  const [organizationName, setOrganizationName] = useState("");
  const [healthCampName, setHealthCampName] = useState("");
  const [location, setLocation] = useState(districts[0]); // Default to the first district
  // Set default date to tomorrow to ensure it's a future date
  const getDefaultDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };
  const [date, setDate] = useState(getDefaultDate());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Initialize time with proper default values
  const getDefaultTimeFrom = () => {
    const time = new Date();
    time.setHours(9, 0, 0, 0); // 9:00 AM
    return time;
  };

  const getDefaultTimeTo = () => {
    const time = new Date();
    time.setHours(17, 0, 0, 0); // 5:00 PM
    return time;
  };

  const [timeFrom, setTimeFrom] = useState(getDefaultTimeFrom());
  const [timeTo, setTimeTo] = useState(getDefaultTimeTo());
  const [description, setDescription] = useState("");
  const [ambulancesAvailable, setAmbulancesAvailable] = useState("");
  const [hospitalNearby, setHospitalNearby] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [registrationUrl, setRegistrationUrl] = useState("");
  const [showTimeFromPicker, setShowTimeFromPicker] = useState(false);
  const [showTimeToPicker, setShowTimeToPicker] = useState(false);

  const router = useRouter();

  // Add this function to handle date selection with future date validation
  const handleDateChange = (event: any, selectedDate?: Date) => {
    console.log("handleDateChange called with:", event, selectedDate);
    setShowDatePicker(false);
    if (selectedDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate >= today) {
        setDate(selectedDate);
        console.log("Date updated to:", selectedDate);
      } else {
        Alert.alert(
          "Invalid Date",
          "Please select a future date for the health camp."
        );
      }
    }
  };

  const handleAddCamp = async () => {
    console.log("handleAddCamp called");

    // Validate all required fields
    if (
      !organizationName ||
      !healthCampName ||
      !location ||
      !description ||
      !ambulancesAvailable ||
      !hospitalNearby ||
      !latitude ||
      !longitude ||
      !registrationUrl
    ) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    // Validate latitude and longitude are numbers
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lng)) {
      Alert.alert("Error", "Please enter valid latitude and longitude values!");
      return;
    }

    console.log("Validation passed, adding camp...");
    console.log("Date:", date);
    console.log("TimeFrom:", timeFrom);
    console.log("TimeTo:", timeTo);

    // Validate date and time
    if (!date || !timeFrom || !timeTo) {
      Alert.alert("Error", "Please select date and time!");
      return;
    }

    // Validate that timeFrom is before timeTo
    if (timeFrom >= timeTo) {
      Alert.alert("Error", "Start time must be before end time!");
      return;
    }

    console.log("Adding camp with data:", {
      organizationName,
      healthCampName,
      location,
      date: date.toISOString(),
      timeFrom: timeFrom.toISOString(),
      timeTo: timeTo.toISOString(),
      latitude,
      longitude,
    });

    try {
      // Check if user is authenticated
      if (!auth.currentUser?.uid) {
        Alert.alert("Error", "You must be logged in to add a camp!");
        return;
      }

      // Generate a unique ID for the camp
      const campId = new Date().getTime().toString();

      console.log("Saving camp with ID:", campId);
      console.log("Admin ID:", auth.currentUser.uid);

      // Prepare camp data
      const campData = {
        organizationName,
        healthCampName,
        location,
        date: Timestamp.fromDate(date),
        timeFrom: Timestamp.fromDate(timeFrom),
        timeTo: Timestamp.fromDate(timeTo),
        description,
        ambulancesAvailable,
        hospitalNearby,
        latitude: lat,
        longitude: lng,
        registrationUrl,
        adminId: auth.currentUser.uid,
        createdAt: Timestamp.now(),
      };

      console.log("Camp data to save:", campData);

      // Add the camp data to Firestore
      await setDoc(doc(db, "healthCamps", campId), campData);

      console.log("Camp saved successfully!");

      // Show success message
      Alert.alert("Success", "Health Camp Added Successfully!");

      // Reset form
      setOrganizationName("");
      setHealthCampName("");
      setLocation(districts[0]);
      setDate(getDefaultDate());
      setTimeFrom(getDefaultTimeFrom());
      setTimeTo(getDefaultTimeTo());
      setDescription("");
      setAmbulancesAvailable("");
      setHospitalNearby("");
      setLatitude("");
      setLongitude("");
      setRegistrationUrl("");

      // Navigate to the ViewCamp screen
      router.push("/Screens/Admin/ViewCamp");
    } catch (error) {
      console.error("Error adding camp:", error);
      Alert.alert(
        "Error",
        `Failed to add health camp: ${error.message || error}`
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Add Health Camp</Text>

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
        <Text style={styles.label}>Health Camp Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Health Camp Name"
          value={healthCampName}
          onChangeText={setHealthCampName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Location:</Text>
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

      {/* Date Selection - Important Field */}
      <View style={styles.importantInputContainer}>
        <Text style={styles.importantLabel}>📅 Camp Date (Required):</Text>
        <TouchableOpacity
          style={styles.dateTimeInput}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateTimeInputText}>
            {date.toLocaleDateString()}
          </Text>
          <Text style={styles.selectText}>Tap to select date</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}

        <Text style={styles.helperText}>
          Select a future date for the health camp
        </Text>
      </View>

      {/* Time From Selection - Important Field */}
      <View style={styles.importantInputContainer}>
        <Text style={styles.importantLabel}>🕐 Start Time (Required):</Text>
        <TouchableOpacity
          style={styles.dateTimeInput}
          onPress={() => setShowTimeFromPicker(true)}
        >
          <Text style={styles.dateTimeInputText}>
            {timeFrom.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <Text style={styles.selectText}>Tap to select start time</Text>
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

        <Text style={styles.helperText}>Select the camp start time</Text>
      </View>

      {/* Time To Selection - Important Field */}
      <View style={styles.importantInputContainer}>
        <Text style={styles.importantLabel}>🕐 End Time (Required):</Text>
        <TouchableOpacity
          style={styles.dateTimeInput}
          onPress={() => setShowTimeToPicker(true)}
        >
          <Text style={styles.dateTimeInputText}>
            {timeTo.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <Text style={styles.selectText}>Tap to select end time</Text>
        </TouchableOpacity>

        {showTimeToPicker && (
          <DateTimePicker
            value={timeTo}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowTimeToPicker(false);
              if (selectedTime) {
                // Validate that end time is after start time
                if (selectedTime <= timeFrom) {
                  Alert.alert(
                    "Invalid Time",
                    "End time must be after start time."
                  );
                } else {
                  setTimeTo(selectedTime);
                }
              }
            }}
          />
        )}

        <Text style={styles.helperText}>Select the camp end time</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Description"
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
        <Text style={styles.buttonText}>Add Camp</Text>
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
  importantInputContainer: {
    marginBottom: 20,
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    borderWidth: 2,
    borderColor: "#4CAF50",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    color: "#2E7D32",
    marginBottom: 5,
  },
  importantLabel: {
    fontSize: 18,
    color: "#1B5E20",
    marginBottom: 10,
    fontWeight: "bold",
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
  dateTimeInput: {
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 8,
    padding: 15,
    minHeight: 60,
    justifyContent: "center",
  },
  dateTimeInputText: {
    fontSize: 18,
    color: "#1B5E20",
    fontWeight: "600",
    textAlign: "center",
  },
  selectText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
    fontStyle: "italic",
  },
  helperText: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    fontStyle: "italic",
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
