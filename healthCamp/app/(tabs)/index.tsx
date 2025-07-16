import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";
import { changeLanguage } from "../../constants/i18n";
import { useRouter } from "expo-router";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const IndexScreen = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter(); // ✅ Use useRouter() from expo-router
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    i18n.language
  );

  useEffect(() => {
    const loadStoredLanguage = async () => {
      const storedLang = await AsyncStorage.getItem("language");
      if (storedLang) {
        setSelectedLanguage(storedLang);
        i18n.changeLanguage(storedLang);
      }
    };
    loadStoredLanguage();
  }, []);

  const handleLanguageChange = async (lang: string) => {
    setSelectedLanguage(lang);
    await changeLanguage(lang);
    i18n.changeLanguage(lang);
    Alert.alert(
      t("selected_language"),
      t("language_changed_to") + " " + lang.toUpperCase()
    );

    setTimeout(() => {
      router.push("/Screens/auth/RoleSelection"); // ✅ Use router.push()
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#26A69A" barStyle="light-content" />

      {/* Header with gradient */}
      <LinearGradient colors={["#26A69A", "#00695C"]} style={styles.header}>
        <MaterialIcons name="language" size={64} color="#FFFFFF" />
        <Text style={styles.appName}>{t("app_name")}</Text>
        <Text style={styles.tagline}>{t("choose_your_language")}</Text>
      </LinearGradient>

      {/* Language Selection Form */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>{t("select_language")}</Text>
        <Text style={styles.subtitle}>{t("select_preferred_language")}</Text>

        <View style={styles.languageGrid}>
          {[
            { label: "English", value: "en", flag: "🇺🇸" },
            { label: "Français", value: "fr", flag: "🇫🇷" },
            { label: "Español", value: "es", flag: "🇪🇸" },
            { label: "தமிழ்", value: "ta", flag: "🇮🇳" },
          ].map((language) => (
            <TouchableOpacity
              key={language.value}
              style={[
                styles.languageCard,
                selectedLanguage === language.value &&
                  styles.selectedLanguageCard,
              ]}
              onPress={() => handleLanguageChange(language.value)}
            >
              <Text style={styles.languageFlag}>{language.flag}</Text>
              <Text
                style={[
                  styles.languageLabel,
                  selectedLanguage === language.value &&
                    styles.selectedLanguageLabel,
                ]}
              >
                {language.label}
              </Text>
              {selectedLanguage === language.value && (
                <Feather
                  name="check-circle"
                  size={20}
                  color="#26A69A"
                  style={styles.checkIcon}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {selectedLanguage && (
          <View style={styles.selectedContainer}>
            <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
            <Text style={styles.selectedText}>
              {t("selected_language")}: {selectedLanguage.toUpperCase()}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default IndexScreen;

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
  languageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  languageCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  selectedLanguageCard: {
    borderColor: "#26A69A",
    backgroundColor: "#F3F4F6",
    shadowColor: "#26A69A",
    shadowOpacity: 0.2,
    elevation: 6,
  },
  languageFlag: {
    fontSize: 32,
    marginBottom: 8,
  },
  languageLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#546E7A",
    textAlign: "center",
  },
  selectedLanguageLabel: {
    color: "#26A69A",
    fontWeight: "bold",
  },
  checkIcon: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  selectedContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8F5E9",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  selectedText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    marginLeft: 8,
  },
});
