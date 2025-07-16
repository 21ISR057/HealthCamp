import "react-native-reanimated"; // ✅ Place at the topmost part
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
const Stack = require("expo-router").Stack;

import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18nextProvider } from "react-i18next";
import i18n, { changeLanguage } from "../constants/i18n";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    const initializeApp = async () => {
      // Load stored language preference
      try {
        const storedLanguage = await AsyncStorage.getItem("language");
        if (storedLanguage) {
          await changeLanguage(storedLanguage);
          console.log("🌐 Loaded stored language:", storedLanguage);
        }
      } catch (error) {
        console.log("⚠️ Could not load stored language:", error);
      }

      if (loaded) {
        SplashScreen.hideAsync();
      }
    };

    initializeApp();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="RoleSelection" options={{ headerShown: false }} />
          <Stack.Screen name="NocUpload" options={{ title: "Upload NOC" }} />
          <Stack.Screen name="Home" options={{ title: "Home" }} />
          <Stack.Screen
            name="CampDetails"
            options={{ title: "Camp Details" }}
          />
          <Stack.Screen
            name="userprofile"
            options={{ title: "User Profile" }}
          />
          <Stack.Screen
            name="Screens/Admin/AdminPanel"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Screens/Admin/AddCamp"
            options={{ title: "Add Camp" }}
          />
          <Stack.Screen
            name="Screens/Admin/ViewCamp"
            options={{ title: "View Camps" }}
          />
          <Stack.Screen
            name="Screens/Admin/EditCamp"
            options={{ title: "Edit Camp" }}
          />
          <Stack.Screen
            name="Screens/Admin/ViewComplaintsScreen"
            options={{ title: "View Complaints" }}
          />
          <Stack.Screen
            name="Screens/Admin/ViewFeedbacksScreen"
            options={{ title: "View Feedback" }}
          />
          <Stack.Screen
            name="Screens/Admin/ViewRegistrationScreen"
            options={{ title: "View Registrations" }}
          />
          <Stack.Screen
            name="Screens/HomeScreen"
            options={{ title: "Home Screen" }}
          />
          <Stack.Screen
            name="Screens/UserRegister"
            options={{ title: "Register" }}
          />
          <Stack.Screen
            name="Screens/auth/LoginScreen"
            options={{ title: "Login screen" }}
          />
          <Stack.Screen
            name="Screens/MedicalReport"
            options={{ title: "Medical Reports" }}
          />
          <Stack.Screen
            name="Screens/Game/GameScreen"
            options={{ title: "Health Games" }}
          />
          <Stack.Screen
            name="govtHomeScreen"
            options={{ title: "Government Camps" }}
          />
          <Stack.Screen
            name="HealthGuidelines"
            options={{ title: "Guidelines" }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </I18nextProvider>
  );
}
