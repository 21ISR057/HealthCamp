import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Button,
  Alert,
  ScrollView,
} from "react-native";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
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

const UserProfile = () => {
  const auth = getAuth(app);
  const db = getFirestore(app);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState<Partial<UserData> | null>(null);

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
            setUpdatedData(data);
          } else {
            setError("User data not found.");
          }
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
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: userData?.profileImage || "https://www.w3schools.com/howto/img_avatar.png" }}
        style={styles.profileImage}
      />
      <Button title={editMode ? "Cancel" : "Edit Details"} onPress={() => setEditMode(!editMode)} />

      {Object.entries(userData || {}).map(([key, value]) => (
        <View key={key} style={styles.row}>
          <Text style={styles.label}>{key.replace(/([A-Z])/g, " $1").trim()}:</Text>
          {editMode ? (
            <TextInput
              style={styles.input}
              value={String(updatedData?.[key as keyof UserData] || "")} // Convert to string
              onChangeText={(text) =>
                setUpdatedData((prev) => ({ ...prev!, [key]: text }))
              }
            />
          ) : (
            <Text style={styles.userInfo}>{String(value)}</Text>
          )}
        </View>
      ))}

      {editMode && <Button title="Save Changes" onPress={handleUpdate} color="green" />}
    </ScrollView>
  );
};

export default UserProfile;

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userInfo: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
