import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from "react-native";
import { useRouter } from 'expo-router';
import { db } from "../../../constants/firebase";
import { collection, query, doc, getDocs, deleteDoc } from "firebase/firestore";

// Define TypeScript interface
interface HealthCamp {
  id: string;
  healthCampName: string;
  location: string;
}

export default function ViewCamps() {
  const [camps, setCamps] = useState<HealthCamp[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchCamps();
  }, []);

  const fetchCamps = async () => {
    const q = query(collection(db, "healthCamps"));
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
            <Text style={styles.campName}>{item.healthCampName}</Text>
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
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  campItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  campName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  campLocation: {
    fontSize: 14,
    color: "#666",
  },
  editButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
  },
});
