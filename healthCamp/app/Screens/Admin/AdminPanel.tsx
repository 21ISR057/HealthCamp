import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { db, auth } from "../../../constants/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";

const AdminPanel: React.FC = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [activeCampsCount, setActiveCampsCount] = useState(0);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);

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

  const getAdminActions = () => [
    {
      title: t("add_health_camp"),
      subtitle: t("create_new_camp"),
      icon: "plus-circle",
      color: "#2E7D32",
      gradient: ["#4CAF50", "#2E7D32"],
      route: "/Screens/Admin/AddCamp",
    },
    {
      title: t("view_health_camps"),
      subtitle: t("manage_existing_camps"),
      icon: "list",
      color: "#1976D2",
      gradient: ["#42A5F5", "#1976D2"],
      route: "/Screens/Admin/ViewCamp",
    },
    {
      title: t("view_complaints"),
      subtitle: t("handle_user_complaints"),
      icon: "alert-circle",
      color: "#E53935",
      gradient: ["#EF5350", "#E53935"],
      route: "/Screens/Admin/ViewComplaintsScreen",
    },
    {
      title: t("view_feedbacks"),
      subtitle: t("review_user_feedback"),
      icon: "message-square",
      color: "#00695C",
      gradient: ["#26A69A", "#00695C"],
      route: "/Screens/Admin/ViewFeedbacksScreen",
    },
    {
      title: t("view_registrations"),
      subtitle: t("manage_camp_registrations"),
      icon: "users",
      color: "#FF7043",
      gradient: ["#FFAB91", "#FF7043"],
      route: "/Screens/Admin/ViewRegistrationScreen",
    },
  ];

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Refresh stats when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchDashboardStats();
    }, [])
  );

  const fetchDashboardStats = async () => {
    try {
      const adminId = auth.currentUser?.uid;
      if (!adminId) return;

      // Fetch active camps (current and future dates only)
      const campsQuery = query(
        collection(db, "healthCamps"),
        where("adminId", "==", adminId)
      );
      const campsSnapshot = await getDocs(campsQuery);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let activeCamps = 0;
      const campIds: string[] = [];

      campsSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        const campDate =
          data.date instanceof Timestamp
            ? data.date.toDate()
            : new Date(data.date);
        campDate.setHours(0, 0, 0, 0);

        if (campDate >= today) {
          activeCamps++;
          campIds.push(doc.id);
        }
      });

      setActiveCampsCount(activeCamps);

      // Fetch registrations for admin's camps
      if (campIds.length > 0) {
        const registrationsQuery = query(
          collection(db, "registrations"),
          where("campId", "in", campIds)
        );
        const registrationsSnapshot = await getDocs(registrationsQuery);
        setTotalRegistrations(registrationsSnapshot.docs.length);
      }

      // Fetch feedbacks for admin's camps
      if (campIds.length > 0) {
        const feedbacksQuery = query(
          collection(db, "feedbacks"),
          where("campId", "in", campIds)
        );
        const feedbacksSnapshot = await getDocs(feedbacksQuery);
        setTotalFeedbacks(feedbacksSnapshot.docs.length);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#00695C" barStyle="light-content" />

      {/* Header with gradient */}
      <LinearGradient colors={["#26A69A", "#00695C"]} style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialIcons name="admin-panel-settings" size={32} color="#FFF" />
          <Text style={styles.title}>{t("admin_dashboard")}</Text>
          <Text style={styles.subtitle}>mediconnect</Text>
        </View>
      </LinearGradient>

      {/* Admin Actions */}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.actionsContainer}>
          {getAdminActions().map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionCard, { borderLeftColor: action.color }]}
              onPress={() => router.push(action.route)}
              activeOpacity={0.7}
            >
              <View style={styles.cardContent}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: action.color },
                  ]}
                >
                  <Feather name={action.icon as any} size={24} color="#FFF" />
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                </View>

                <Feather name="chevron-right" size={20} color="#999" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>{t("quick_overview")}</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MaterialIcons name="event" size={32} color="#2E7D32" />
              <Text style={styles.statNumber}>{activeCampsCount}</Text>
              <Text style={styles.statLabel}>{t("active_camps")}</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialIcons name="people" size={32} color="#1976D2" />
              <Text style={styles.statNumber}>{totalRegistrations}</Text>
              <Text style={styles.statLabel}>{t("registrations")}</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialIcons name="feedback" size={32} color="#00695C" />
              <Text style={styles.statNumber}>{totalFeedbacks}</Text>
              <Text style={styles.statLabel}>{t("feedbacks")}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    padding: 24,
    backgroundColor: "#00695C",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  buttonsContainer: {
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#2E7D32",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  headerContent: {
    alignItems: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#E0F2F1",
    marginTop: 4,
    textAlign: "center",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  textContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#263238",
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: "#546E7A",
  },
  statsSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#263238",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#263238",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#546E7A",
    marginTop: 4,
    textAlign: "center",
  },
});

export default AdminPanel;
