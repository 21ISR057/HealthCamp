import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { changeLanguage, getCurrentLanguage } from "../constants/i18n";

const LanguageTest = () => {
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());

  useEffect(() => {
    setCurrentLang(i18n.language);
  }, [i18n.language]);

  const testLanguageSwitch = async (lang: string) => {
    try {
      await changeLanguage(lang);
      setCurrentLang(lang);

      // Test if language is properly stored
      const storedLang = await AsyncStorage.getItem("language");

      Alert.alert(
        t("success"),
        `${t("language_changed_to")} ${lang.toUpperCase()}\n${t(
          "loading"
        )} ${storedLang}`
      );
    } catch (error) {
      Alert.alert(t("error"), "Failed to change language");
    }
  };

  const testTamilText = () => {
    Alert.alert(
      "Tamil Text Test",
      `App Name: ${t("app_name")}\nHealth Camps: ${t(
        "health_camps"
      )}\nRegister: ${t("register")}`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Multi-Language Test</Text>
      <Text style={styles.currentLang}>Current Language: {currentLang}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => testLanguageSwitch("en")}
        >
          <Text style={styles.buttonText}>English</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => testLanguageSwitch("fr")}
        >
          <Text style={styles.buttonText}>Français</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => testLanguageSwitch("es")}
        >
          <Text style={styles.buttonText}>Español</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => testLanguageSwitch("ta")}
        >
          <Text style={styles.buttonText}>தமிழ்</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.testButton]}
        onPress={testTamilText}
      >
        <Text style={styles.buttonText}>Test Tamil Display</Text>
      </TouchableOpacity>

      <View style={styles.translationTest}>
        <Text style={styles.testTitle}>Translation Test:</Text>
        <Text style={styles.testText}>{t("app_name")}</Text>
        <Text style={styles.testText}>{t("health_camps")}</Text>
        <Text style={styles.testText}>{t("register")}</Text>
        <Text style={styles.testText}>{t("login")}</Text>
        <Text style={styles.testText}>{t("welcome")}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  currentLang: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#26A69A",
    padding: 12,
    borderRadius: 8,
    margin: 5,
    minWidth: 80,
  },
  testButton: {
    backgroundColor: "#4CAF50",
    alignSelf: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  translationTest: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  testText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#666",
  },
});

export default LanguageTest;
