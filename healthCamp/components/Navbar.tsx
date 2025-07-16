import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";

const MENU_ANIMATION_DURATION = 300;

const Navbar = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const menuAnimation = useState(new Animated.Value(0))[0];

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

  const toggleMenu = () => {
    const toValue = menuVisible ? 0 : 1;

    Animated.timing(menuAnimation, {
      toValue,
      duration: MENU_ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();

    setMenuVisible(!menuVisible);
  };

  const menuTranslateY = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 0],
  });

  const menuOpacity = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const navigateTo = (route: string) => {
    toggleMenu();
    setTimeout(() => {
      router.push(route);
    }, 300);
  };

  return (
    <>
      <StatusBar backgroundColor="#26A69A" barStyle="light-content" />
      <LinearGradient
        colors={["#26A69A", "#00695C"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.navbarContainer}
      >
        <View style={styles.navbarContent}>
          <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
            <Ionicons
              name={menuVisible ? "close" : "menu"}
              size={24}
              color="white"
            />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <View style={styles.logoContainer}>
              <Feather
                name="activity"
                size={20}
                color="white"
                style={styles.logoIcon}
              />
            </View>
            <Text style={styles.navbarTitle}>mediconnect</Text>
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push("../Screens/UserProfile")}
          >
            <Ionicons name="person-circle-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Animated Menu Overlay */}
      {menuVisible && (
        <Animated.View
          style={[
            styles.menuOverlay,
            {
              opacity: menuOpacity,
            },
          ]}
          pointerEvents={menuVisible ? "auto" : "none"}
        >
          <TouchableOpacity
            style={styles.overlayBackground}
            onPress={toggleMenu}
            activeOpacity={1}
          />
          <Animated.View
            style={[
              styles.navMenu,
              {
                transform: [{ translateY: menuTranslateY }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateTo("../Screens/HomeScreen")}
            >
              <View style={styles.menuIconContainer}>
                <Feather name="home" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.menuItemText}>{t("health_camps")}</Text>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateTo("../Screens/Emergency/NearbyEmergency")}
            >
              <View style={styles.menuIconContainer}>
                <Feather name="phone" size={24} color="#F44336" />
              </View>
              <Text style={styles.menuItemText}>{t("emergency_service")}</Text>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateTo("../Screens/MedicalReport")}
            >
              <View style={styles.menuIconContainer}>
                <Feather name="file-text" size={24} color="#2196F3" />
              </View>
              <Text style={styles.menuItemText}>{t("medical_report")}</Text>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateTo("../Screens/Game/GameScreen")}
            >
              <View style={styles.menuIconContainer}>
                <Feather name="award" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.menuItemText}>{t("health_game")}</Text>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateTo("../Screens/GovtHomeScreen")}
            >
              <View style={styles.menuIconContainer}>
                <Feather name="briefcase" size={24} color="#FF9800" />
              </View>
              <Text style={styles.menuItemText}>{t("government_camps")}</Text>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateTo("../Screens/HealthGuidelines")}
            >
              <View style={styles.menuIconContainer}>
                <Feather name="book-open" size={24} color="#9C27B0" />
              </View>
              <Text style={styles.menuItemText}>{t("guidelines")}</Text>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      )}
    </>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  navbarContainer: {
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  navbarContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
  },
  menuButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  logoContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  logoIcon: {
    // No additional styles needed
  },
  navbarTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 0.5,
  },
  profileButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  navMenu: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 80,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
