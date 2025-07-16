import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../../../constants/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { getCurrentLanguage } from "../../../constants/i18n";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

export default function Register() {
  const { t, i18n } = useTranslation();
  const [role, setRole] = useState<string | null>(null); // Role from previous screen
  const [subRole, setSubRole] = useState(""); // Default sub-role
  const [name, setName] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Fetch role from AsyncStorage when the component loads
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const storedRole = await AsyncStorage.getItem("selectedRole");
        console.log("Fetched Role:", storedRole); // Debugging
        if (storedRole) {
          setRole(storedRole);
        } else {
          console.warn("No role found in AsyncStorage");
        }

        // Load language preference
        const storedLang = await AsyncStorage.getItem("language");
        if (storedLang) {
          i18n.changeLanguage(storedLang);
        }
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };
    fetchRole();
  }, []);

  const handleRegister = async () => {
    if (!name || !email || !password || (role === "admin" && !uniqueId)) {
      Alert.alert("Error", "All fields are required!");
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

      let userData = {
        uid: user.uid,
        name,
        uniqueId,
        email,
        role: role,
        subRole: role, // This was incorrectly set; now properly using subRole
        preferredLanguage: currentLanguage, // Store language preference
        createdAt: serverTimestamp(),
      };

      let collectionName = "users"; // Default collection

      if (role === "admin") {
        userData = { ...userData, uniqueId, subRole };
        collectionName = subRole === "ngo_admin" ? "ngos" : "students";
      }

      await setDoc(doc(db, collectionName, user.uid), userData);
      await AsyncStorage.setItem("user", JSON.stringify(userData));

      Alert.alert("Success", "Registration Successful! Please login.");
      router.push("/Screens/auth/AdminLogin");
    } catch (error) {
      console.error("Registration Error:", error);
      Alert.alert("Error", "Registration failed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#26A69A" barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={["#26A69A", "#00695C"]} style={styles.header}>
        <MaterialIcons name="admin-panel-settings" size={64} color="#FFFFFF" />
        <Text style={styles.appName}>{t("admin_registration")}</Text>
        <Text style={styles.tagline}>Join mediconnect Admin Portal</Text>
      </LinearGradient>

      {/* Registration Form */}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.formContainer}
      >
        <Text style={styles.title}>Create Admin Account</Text>
        <Text style={styles.subtitle}>Fill in your details to get started</Text>

        {role === "admin" && (
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="admin-panel-settings"
              size={20}
              color="#26A69A"
              style={styles.inputIcon}
            />
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={subRole}
                onValueChange={(itemValue) => setSubRole(itemValue)}
                style={styles.picker}
                prompt={t("select_admin_role")}
              >
                <Picker.Item label={t("ngo_admin")} value="ngo_admin" />
                <Picker.Item
                  label={t("health_student")}
                  value="health_student"
                />
              </Picker>
            </View>
          </View>
        )}

        <View style={styles.inputContainer}>
          <MaterialIcons
            name="person"
            size={20}
            color="#26A69A"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder={t("full_name")}
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />
        </View>

        {role === "admin" && (
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="badge"
              size={20}
              color="#26A69A"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder={
                subRole === "ngo_admin" ? t("ngo_unique_id") : t("student_id")
              }
              placeholderTextColor="#999"
              value={uniqueId}
              onChangeText={setUniqueId}
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <MaterialIcons
            name="email"
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
          <MaterialIcons
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

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <LinearGradient
            colors={["#26A69A", "#00695C"]}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>{t("register")}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => router.push("/Screens/auth/AdminLogin")}
        >
          <Text style={styles.linkText}>
            {t("already_have_account")}{" "}
            <Text style={styles.linkTextBold}>{t("login")}</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 16,
    textAlign: "center",
  },
  tagline: {
    fontSize: 16,
    color: "#E0F2F1",
    marginTop: 8,
    textAlign: "center",
  },
  scrollContainer: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A237E",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#546E7A",
    marginBottom: 32,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  pickerWrapper: {
    flex: 1,
  },
  picker: {
    flex: 1,
    height: 50,
    color: "#333",
    fontSize: 16,
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
  linkContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  linkText: {
    fontSize: 16,
    color: "#546E7A",
  },
  linkTextBold: {
    fontWeight: "bold",
    color: "#26A69A",
  },
});
