import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { db, auth } from "../../../constants/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "expo-router";

interface Complaint {
  id: string;
  email: string;
  complaint: string;
  healthCampName: string;
  createdAt: Date;
}

const ViewComplaintsScreen: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    const adminId = auth.currentUser?.uid; // Get the logged-in admin's ID
    if (!adminId) return;

    // Fetch health camps created by the admin
    const healthCampsQuery = query(collection(db, "healthCamps"), where("adminId", "==", adminId));
    const healthCampsSnapshot = await getDocs(healthCampsQuery);
    const healthCampNames = healthCampsSnapshot.docs.map((doc) => doc.data().healthCampName);

    // Fetch complaints for these health camps
    const complaintsQuery = query(collection(db, "complaints"), where("healthCampName", "in", healthCampNames));
    const complaintsSnapshot = await getDocs(complaintsQuery);
    const complaintsData: Complaint[] = complaintsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        email: data.email,
        complaint: data.complaint,
        healthCampName: data.healthCampName,
        createdAt: data.createdAt.toDate(),
      } as Complaint;
    });
    setComplaints(complaintsData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complaints</Text>
      <FlatList
        data={complaints}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>Email: {item.email}</Text>
            <Text style={styles.listItemText}>Complaint: {item.complaint}</Text>
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

export default ViewComplaintsScreen;