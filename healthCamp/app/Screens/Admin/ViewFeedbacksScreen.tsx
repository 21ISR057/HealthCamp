import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { db } from "../../../constants/firebase";
import { collection, getDocs } from "firebase/firestore";
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
    const querySnapshot = await getDocs(collection(db, "feedbacks"));
    const feedbacksData: Feedback[] = querySnapshot.docs.map((doc) => {
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