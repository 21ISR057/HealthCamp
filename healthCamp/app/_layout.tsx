import 'react-native-reanimated'; // ✅ Place at the topmost part
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="RoleSelection" options={{ headerShown: false }} />
        <Stack.Screen name="NocUpload" options={{ title: "Upload NOC" }} />
        <Stack.Screen name="Home" options={{ title: "Home" }} />
        <Stack.Screen name="CampDetails" options={{ title: "Camp Details" }} />
        <Stack.Screen name="userprofile" options={{ title: "User Profile" }} />
        <Stack.Screen name="AdminPanel" options={{ title: "Admin Panel" }} />
        <Stack.Screen name="AddCamp" options={{ title: "Add Health Camp" }} /> {/* Add this route */}
        <Stack.Screen name="ViewCamp" options={{ title: "View Health Camps" }} /> {/* Add this route */}
        <Stack.Screen name="EditCamp" options={{ title: "Edit Health Camp" }} /> {/* Add this route */}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}