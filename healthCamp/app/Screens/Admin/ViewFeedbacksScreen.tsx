import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { db, auth } from "../../../constants/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "expo-router";

interface Feedback {
  id: string;
  email: string;
  feedback: string;
  healthCampName: string;
  createdAt: Date;
}

const ViewFeedbacksScreen: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    const adminId = auth.currentUser?.uid; // Get the logged-in admin's ID
    if (!adminId) return;

    // Fetch health camps created by the admin
    const healthCampsQuery = query(collection(db, "healthCamps"), where("adminId", "==", adminId));
    const healthCampsSnapshot = await getDocs(healthCampsQuery);
    const healthCampNames = healthCampsSnapshot.docs.map((doc) => doc.data().healthCampName);

    // Fetch feedbacks for these health camps
    const feedbacksQuery = query(collection(db, "feedbacks"), where("healthCampName", "in", healthCampNames));
    const feedbacksSnapshot = await getDocs(feedbacksQuery);
    const feedbacksData: Feedback[] = feedbacksSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        email: data.email,
        feedback: data.feedback,
        healthCampName: data.healthCampName,
        createdAt: data.createdAt.toDate(),
      } as Feedback;
    });
    setFeedbacks(feedbacksData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feedbacks</Text>
      <FlatList
        data={feedbacks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>Email: {item.email}</Text>
            <Text style={styles.listItemText}>Feedback: {item.feedback}</Text>
            <Text style={styles.listItemText}>Health Camp: {item.healthCampName}</Text>
            <Text style={styles.listItemText}>Date: {item.createdAt.toLocaleDateString()}</Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E8F5E9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 20,
  },
  listItem: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  listItemText: {
    fontSize: 14,
    color: "#2E7D32",
  },
  backButton: {
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default ViewFeedbacksScreen;