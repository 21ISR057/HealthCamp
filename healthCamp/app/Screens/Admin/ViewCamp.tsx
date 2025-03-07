import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from "react-native";
import { useRouter } from 'expo-router';
import { db } from "../../../constants/firebase";
import { collection, query, where, getDocs, deleteDoc,doc } from "firebase/firestore";
import { auth } from "../../../constants/firebase";

interface HealthCamp {
  id: string;
  campName: string;
  location: string;
}

export default function ViewCamps() {
  const [camps, setCamps] = useState<HealthCamp[]>([]);
  const router = useRouter();
  const user = auth.currentUser;

  useEffect(() => {
    fetchCamps();
  }, []);

  const fetchCamps = async () => {
    const q = query(collection(db, "healthCamps"), where("adminId", "==", user?.uid));
    const querySnapshot = await getDocs(q);
    const campsData: HealthCamp[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HealthCamp));
    setCamps(campsData);
  };

  const handleDeleteCamp = async (id: string) => {
    try {
      await deleteDoc(doc(db, "healthCamps", id));
      fetchCamps();
      Alert.alert("Success", "Camp deleted successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to delete camp. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Health Camps</Text>

      <FlatList
        data={camps}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: HealthCamp }) => (
          <View style={styles.campItem}>
            <Text style={styles.campName}>{item.campName}</Text>
            <Text style={styles.campLocation}>{item.location}</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => router.push(`../Screens/admin/EditCamp?id=${item.id}`)}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteCamp(item.id)}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

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
  campItem: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  campName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  campLocation: {
    fontSize: 14,
    color: "#2E7D32",
  },
  editButton: {
    backgroundColor: "#2E7D32",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: "#D32F2F",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
