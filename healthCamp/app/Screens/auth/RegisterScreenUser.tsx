import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  StatusBar,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../../constants/firebase";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { getCurrentLanguage } from "../../../constants/i18n";
import DateTimePicker from "@react-native-community/datetimepicker";
export default function RegisterScreenUser() {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [locality, setLocality] = useState(""); // ✅ Set initial state for locality

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

  // Date picker handler
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

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

  // 🔹 Handle Registration Function
  const handleRegister = async () => {
    if (
      !fullName ||
      !email ||
      !password ||
      !phoneNumber ||
      !gender ||
      !dob ||
      !locality
    ) {
      Alert.alert(t("error"), t("all_fields_required"));
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Get current language preference
      const currentLanguage = getCurrentLanguage();

      const userData = {
        uid: user.uid,
        fullName,
        email,
        phoneNumber,
        gender,
        dob: dob.toISOString().split("T")[0], // Format date as YYYY-MM-DD
        locality,
        preferredLanguage: currentLanguage, // Store language preference
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, "users", user.uid), userData);

      Alert.alert(t("success"), t("registration_successful"));
      router.push("/Screens/auth/LoginScreen");
    } catch (error) {
      console.error("Registration error:", error.message);
      Alert.alert(t("error"), t("registration_failed"));
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#26A69A" barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={["#26A69A", "#00695C"]} style={styles.header}>
        <MaterialIcons name="person-add" size={64} color="#FFFFFF" />
        <Text style={styles.appName}>{t("join_mediconnect")}</Text>
        <Text style={styles.tagline}>{t("create_health_account")}</Text>
      </LinearGradient>

      {/* Registration Form */}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.formContainer}
      >
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Fill in your details to get started</Text>

        <View style={styles.inputContainer}>
          <Feather
            name="user"
            size={20}
            color="#26A69A"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder={t("full_name")}
            placeholderTextColor="#999"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Feather
            name="mail"
            size={20}
            color="#26A69A"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder={t("email")}
            placeholderTextColor="#999"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Feather
            name="lock"
            size={20}
            color="#26A69A"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder={t("password")}
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.inputContainer}>
          <Feather
            name="phone"
            size={20}
            color="#26A69A"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder={t("phone_number")}
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons
            name="person"
            size={20}
            color="#26A69A"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder={`${t("gender")} (${t("male")}/${t("female")}/${t(
              "other"
            )})`}
            placeholderTextColor="#999"
            value={gender}
            onChangeText={setGender}
          />
        </View>

        <View style={styles.inputContainer}>
          <Feather
            name="calendar"
            size={20}
            color="#26A69A"
            style={styles.inputIcon}
          />
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.datePickerText}>{formatDate(dob)}</Text>
            <MaterialIcons name="date-range" size={20} color="#26A69A" />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={dob}
            mode="date"
            display="default"
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}

        <View style={styles.pickerContainer}>
          <MaterialIcons
            name="location-on"
            size={20}
            color="#26A69A"
            style={styles.pickerIcon}
          />
          <Picker
            selectedValue={locality}
            onValueChange={(itemValue) => setLocality(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label={t("select_district")} value="" />
            {districts.map((district, index) => (
              <Picker.Item key={index} label={district} value={district} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <LinearGradient
            colors={["#26A69A", "#00695C"]}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>{t("create_account")}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => router.push("/Screens/auth/LoginScreen")}
        >
          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text style={styles.loginTextBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// 🔹 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    alignItems: "center",
    paddingVertical: 50,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  appName: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 16,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: "#E8EAF6",
    marginTop: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1A237E",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#546E7A",
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#1A237E",
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  pickerIcon: {
    marginRight: 12,
  },
  picker: {
    flex: 1,
    height: 50,
    color: "#1A237E",
  },
  datePickerButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  datePickerText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  button: {
    marginTop: 24,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#26A69A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  loginLink: {
    alignItems: "center",
    marginTop: 24,
  },
  loginText: {
    fontSize: 16,
    color: "#546E7A",
  },
  loginTextBold: {
    fontWeight: "bold",
    color: "#26A69A",
  },
});
