import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "../../constants/firebase"; // Ensure correct import

// Define UserData Type
interface UserData {
  fullName: string;
  email: string;
  phoneNumber: string | number; // Can be string or number
  gender: string;
  dob: string;
  locality: string;
  uid: string;
  profileImage?: string; // Optional field
}

interface Camp {
  id: string;
  healthCampName: string;
  date: string;
  verified: boolean;
}

// Define prop types for ProfileSection
interface ProfileSectionProps {
  userData: UserData;
  editMode: boolean;
  updatedData: Partial<UserData>;
  setUpdatedData: (data: Partial<UserData>) => void;
  handleUpdate: () => void;
  setEditMode: (mode: boolean) => void;
}

// Define prop types for CampSection
interface CampSectionProps {
  camps: Camp[];
  title: string;
  showStatus?: boolean;
}

// Reusable Components
const ProfileSection = ({
  userData,
  editMode,
  updatedData,
  setUpdatedData,
  handleUpdate,
  setEditMode,
}: ProfileSectionProps) => (
  <View style={styles.profileContainer}>
    {/* Profile Header */}
    <LinearGradient
      colors={["#26A69A", "#00695C"]}
      style={styles.profileHeader}
    >
      <View style={styles.profileImageContainer}>
        <Image
          source={{
            uri:
              userData.profileImage ||
              "https://www.w3schools.com/howto/img_avatar.png",
          }}
          style={styles.profileImage}
        />
        <View style={styles.profileImageOverlay}>
          <Feather name="camera" size={20} color="#FFFFFF" />
        </View>
      </View>
      <Text style={styles.profileName}>{userData.fullName}</Text>
      <Text style={styles.profileEmail}>{userData.email}</Text>
    </LinearGradient>

    {/* Edit Button */}
    <TouchableOpacity
      style={[styles.editButton, editMode && styles.cancelButton]}
      onPress={() => setEditMode(!editMode)}
    >
      <Feather
        name={editMode ? "x" : "edit-3"}
        size={16}
        color="#FFFFFF"
        style={styles.buttonIcon}
      />
      <Text style={styles.editButtonText}>
        {editMode ? "Cancel" : "Edit Profile"}
      </Text>
    </TouchableOpacity>

    {/* Profile Details */}
    <View style={styles.detailsContainer}>
      {Object.entries(userData)
        .filter(
          ([key]) => !["profileImage", "uid", "email", "fullName"].includes(key)
        )
        .map(([key, value]) => (
          <View key={key} style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <MaterialIcons
                name={getIconForField(key)}
                size={20}
                color="#00695C"
              />
              <Text style={styles.detailLabel}>{formatFieldName(key)}</Text>
            </View>
            {editMode ? (
              <TextInput
                style={styles.detailInput}
                value={String(
                  updatedData[key as keyof UserData] || value || ""
                )}
                onChangeText={(text) =>
                  setUpdatedData({
                    ...(updatedData || {}),
                    [key]: text,
                  })
                }
                placeholder={`Enter ${formatFieldName(key)}`}
                placeholderTextColor="#999"
              />
            ) : (
              <Text style={styles.detailValue}>
                {String(value || "Not provided")}
              </Text>
            )}
          </View>
        ))}
    </View>

    {editMode && (
      <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
        <Feather
          name="check"
          size={16}
          color="#FFFFFF"
          style={styles.buttonIcon}
        />
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    )}
  </View>
);

// Helper functions
const getIconForField = (fieldName: string) => {
  const iconMap: { [key: string]: string } = {
    phoneNumber: "phone",
    gender: "person",
    dob: "cake",
    locality: "location-on",
  };
  return iconMap[fieldName] || "info";
};

const formatFieldName = (fieldName: string) => {
  const nameMap: { [key: string]: string } = {
    phoneNumber: "Phone Number",
    dob: "Date of Birth",
    locality: "Locality",
    gender: "Gender",
  };
  return nameMap[fieldName] || fieldName.replace(/([A-Z])/g, " $1").trim();
};

const CampSection = ({
  camps,
  title,
  showStatus = false,
}: CampSectionProps) => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionHeader}>
      <MaterialIcons
        name="event"
        size={24}
        color="#00695C"
        style={styles.sectionIcon}
      />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {camps.length > 0 ? (
      camps.map((camp) => (
        <View key={camp.id} style={styles.campCard}>
          <View style={styles.campHeader}>
            <Text style={styles.campName}>{camp.healthCampName}</Text>
            {showStatus && (
              <View
                style={[
                  styles.statusBadge,
                  camp.verified ? styles.verifiedBadge : styles.pendingBadge,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    camp.verified ? styles.verifiedText : styles.pendingText,
                  ]}
                >
                  {camp.verified ? "Verified" : "Pending"}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.campDetails}>
            <Feather name="calendar" size={16} color="#546E7A" />
            <Text style={styles.campDate}>{camp.date}</Text>
          </View>
        </View>
      ))
    ) : (
      <View style={styles.noCampsContainer}>
        <MaterialIcons name="event-busy" size={48} color="#CFD8DC" />
        <Text style={styles.noCampsText}>No camps available</Text>
        <Text style={styles.noCampsSubtext}>
          Register for health camps to see them here
        </Text>
      </View>
    )}
  </View>
);

const UserProfile = () => {
  const auth = getAuth(app);
  const db = getFirestore(app);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState<Partial<UserData>>({}); // Initialize as empty object
  const [registeredCamps, setRegisteredCamps] = useState<Camp[]>([]); // User's registered camps
  const [verifiedCamps, setVerifiedCamps] = useState<Camp[]>([]); // Verified camps

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data() as UserData;
            setUserData(data);
            setUpdatedData(data); // Initialize updatedData with user data
          } else {
            setError("User data not found.");
          }

          // Fetch user's registered camps
          const registrationsQuery = query(
            collection(db, "registrations"),
            where("email", "==", user.email)
          );
          const registrationsSnapshot = await getDocs(registrationsQuery);
          const campsData: Camp[] = [];

          for (const regDoc of registrationsSnapshot.docs) {
            const campId = regDoc.data().campId;
            const campDoc = await getDoc(doc(db, "healthCamps", campId));
            if (campDoc.exists()) {
              const campData = campDoc.data();
              const campDate = campData.date
                ? campData.date.toDate // Check if date is a Firestore Timestamp
                  ? campData.date.toDate().toLocaleDateString() // Convert to date string
                  : campData.date // Use as-is if it's already a string
                : "No date available"; // Fallback if date is missing

              campsData.push({
                id: campId,
                healthCampName: campData.healthCampName,
                date: campDate,
                verified: regDoc.data().verified || false,
              });
            }
          }

          setRegisteredCamps(campsData);
          setVerifiedCamps(campsData.filter((camp) => camp.verified)); // Filter verified camps
        } else {
          setError("No authenticated user.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle updating user data
  const handleUpdate = async () => {
    if (!auth.currentUser || !updatedData) return;

    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, updatedData);
      setUserData(updatedData as UserData);
      setEditMode(false);
      Alert.alert("Success", "User details updated successfully!");
    } catch (error) {
      console.error("Error updating user data:", error);
      Alert.alert("Error", "Failed to update user details.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar backgroundColor="#00695C" barStyle="light-content" />
        <ActivityIndicator size="large" color="#00695C" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar backgroundColor="#00695C" barStyle="light-content" />
        <MaterialIcons name="error-outline" size={64} color="#E53935" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => window.location.reload()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#00695C" barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {userData && (
          <ProfileSection
            userData={userData}
            editMode={editMode}
            updatedData={updatedData}
            setUpdatedData={setUpdatedData}
            handleUpdate={handleUpdate}
            setEditMode={setEditMode}
          />
        )}

        <CampSection
          camps={registeredCamps}
          title="My Registered Camps"
          showStatus
        />
        <CampSection camps={verifiedCamps} title="Verified Camps" />
      </ScrollView>
    </View>
  );
};

export default UserProfile;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#546E7A",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#E53935",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#00695C",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  profileContainer: {
    marginBottom: 24,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  profileImageOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    padding: 8,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: "#E0F2F1",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1976D2",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginHorizontal: 20,
    marginTop: -20,
    shadowColor: "#1976D2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cancelButton: {
    backgroundColor: "#E53935",
    shadowColor: "#E53935",
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonIcon: {
    marginRight: 8,
  },
  detailsContainer: {
    margin: 20,
  },
  detailRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  detailLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#00695C",
    marginLeft: 8,
  },
  detailValue: {
    fontSize: 16,
    color: "#263238",
    lineHeight: 24,
  },
  detailInput: {
    fontSize: 16,
    color: "#263238",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#F9F9F9",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2E7D32",
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 20,
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  sectionContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#263238",
  },
  campCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#00695C",
  },
  campHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  campName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#263238",
    flex: 1,
    marginRight: 8,
  },
  campDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  campDate: {
    fontSize: 14,
    color: "#546E7A",
    marginLeft: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedBadge: {
    backgroundColor: "#E8F5E9",
  },
  pendingBadge: {
    backgroundColor: "#FFF3E0",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  verifiedText: {
    color: "#2E7D32",
  },
  pendingText: {
    color: "#F57C00",
  },
  noCampsContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noCampsText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#546E7A",
    marginTop: 16,
    textAlign: "center",
  },
  noCampsSubtext: {
    fontSize: 14,
    color: "#78909C",
    marginTop: 8,
    textAlign: "center",
  },
});
