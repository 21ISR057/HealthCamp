import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function RoleSelectionScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"user" | "admin" | null>(
    null
  );
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const loadLanguage = async () => {
      const lang = await AsyncStorage.getItem("language");
      if (lang) {
        i18n.changeLanguage(lang);
      }
    };
    loadLanguage();
  }, []);

  // ✅ Store role in AsyncStorage when selected
  const handleRoleSelection = async (role: "user" | "admin") => {
    try {
      setSelectedRole(role);
      await AsyncStorage.setItem("selectedRole", role); // Save role
      console.log("Saved Role:", role); // Debugging
    } catch (error) {
      console.error("Error saving role:", error);
    }
  };

  const handleContinue = async () => {
    try {
      const storedRole = await AsyncStorage.getItem("selectedRole");
      console.log("Fetched Role from AsyncStorage:", storedRole); // Debugging

      let path = "";

      if (storedRole === "user") {
        path = "/Screens/auth/RegisterScreenUser";
      } else if (storedRole === "admin") {
        path = "/Screens/auth/RegisterAdmin";
      }

      if (path) {
        router.push(path as any);
      }
    } catch (error) {
      console.error("Error retrieving role:", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#26A69A" barStyle="light-content" />

      {/* Header with gradient */}
      <LinearGradient colors={["#26A69A", "#00695C"]} style={styles.header}>
        <MaterialIcons name="person" size={64} color="#FFFFFF" />
        <Text style={styles.appName}>{t("app_name")}</Text>
        <Text style={styles.tagline}>{t("selectRole")}</Text>
      </LinearGradient>

      {/* Role Selection Form */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>{t("selectRole")}</Text>
        <Text style={styles.subtitle}>{t("selectRole")}</Text>

        {/* Role Selection (User / Admin) */}
        <View style={styles.selectionContainer}>
          <TouchableOpacity
            style={[
              styles.option,
              selectedRole === "user" && styles.selectedOption,
            ]}
            onPress={() => handleRoleSelection("user")} // ✅ Now saves role
          >
            <Image
              source={require("../../../assets/images/user.png")}
              style={styles.image}
            />
            <Text style={styles.optionText}>{t("user")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.option,
              selectedRole === "admin" && styles.selectedOption,
            ]}
            onPress={() => handleRoleSelection("admin")} // ✅ Now saves role
          >
            <Image
              source={require("../../../assets/images/admin.jpg")}
              style={styles.image}
            />
            <Text style={styles.optionText}>{t("admin")}</Text>
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedRole && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={!selectedRole}
        >
          <LinearGradient
            colors={
              selectedRole ? ["#26A69A", "#00695C"] : ["#E0E0E0", "#BDBDBD"]
            }
            style={styles.buttonGradient}
          >
            <Text
              style={[
                styles.continueButtonText,
                !selectedRole && styles.disabledButtonText,
              ]}
            >
              {t("continue")}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: 40,
  },
  selectionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  option: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 15,
    borderWidth: 3,
    borderColor: "#E0E0E0",
    borderRadius: 16,
    padding: 20,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedOption: {
    borderColor: "#26A69A",
    backgroundColor: "#F3F4F6",
    shadowColor: "#26A69A",
    shadowOpacity: 0.2,
    elevation: 6,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#546E7A",
    marginTop: 8,
  },
  continueButton: {
    marginTop: 40,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#26A69A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  disabledButtonText: {
    color: "#999999",
  },
});
