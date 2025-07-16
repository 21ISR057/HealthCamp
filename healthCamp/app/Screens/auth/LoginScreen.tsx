import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  ScrollView,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../constants/firebase";
import { doc, getDoc } from "firebase/firestore";
const useRouter = require("expo-router").useRouter;
import * as Location from "expo-location";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "../../../constants/i18n";

export default function LoginScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  // 🔹 Function to Check Location Permission and GPS Status
  const checkLocationPermission = async () => {
    console.log("🔍 Checking location permissions...");

    // Check if location services (GPS) are enabled
    const isLocationEnabled = await Location.hasServicesEnabledAsync();
    console.log("📍 Is GPS enabled?:", isLocationEnabled);

    if (!isLocationEnabled) {
      Alert.alert(
        "Location Disabled",
        "Please turn on location services in your device settings."
      );
      return false;
    }

    // Request location permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    console.log("📜 Permission status:", status);

    if (status !== "granted") {
      Alert.alert("Permission Required", "Please enable location to proceed.");
      return false;
    }

    console.log("✅ Location permission granted!");
    return true;
  };

  // 🔹 Handle Login Function
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password!");
      return;
    }

    try {
      console.log("🔑 Attempting login...");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Load user's language preference from database
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.preferredLanguage) {
            await changeLanguage(userData.preferredLanguage);
            console.log(
              "🌐 Loaded user's preferred language:",
              userData.preferredLanguage
            );
          }
        }
      } catch (langError) {
        console.log("⚠️ Could not load user language preference:", langError);
      }

      Alert.alert(t("success"), t("login_successful"));
      console.log("✅ Login successful!");

      // 🔹 Check Location Permission Before Proceeding
      const isLocationAvailable = await checkLocationPermission();
      console.log("📍 Can proceed with location?:", isLocationAvailable);

      if (!isLocationAvailable) {
        Alert.alert(t("location_required"), t("enable_location_services"), [
          {
            text: t("ok"),
            onPress: () => console.log("🔔 User prompted to enable location"),
          },
        ]);
      } else {
        console.log("🚀 Navigating to Home Screen...");
        router.push("/Screens/HomeScreen");
      }
    } catch (error) {
      console.error("❌ Login error:", error.message);
      Alert.alert(t("error"), t("invalid_credentials"));
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#26A69A" barStyle="light-content" />

      {/* Header with gradient */}
      <LinearGradient colors={["#26A69A", "#00695C"]} style={styles.header}>
        <MaterialIcons name="local-hospital" size={64} color="#FFFFFF" />
        <Text style={styles.appName}>{t("app_name")}</Text>
        <Text style={styles.tagline}>{t("app_tagline")}</Text>
      </LinearGradient>

      {/* Login Form */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

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

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <LinearGradient
            colors={["#26A69A", "#00695C"]}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>{t("sign_in")}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>{t("or")}</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => router.push("/Screens/auth/RegisterScreenUser")}
        >
          <Text style={styles.registerText}>
            Don't have an account?{" "}
            <Text style={styles.registerTextBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  appName: {
    fontSize: 32,
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
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A237E",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#546E7A",
    textAlign: "center",
    marginBottom: 40,
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
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: "#999",
  },
  registerLink: {
    alignItems: "center",
  },
  registerText: {
    fontSize: 16,
    color: "#546E7A",
  },
  registerTextBold: {
    fontWeight: "bold",
    color: "#26A69A",
  },
});
