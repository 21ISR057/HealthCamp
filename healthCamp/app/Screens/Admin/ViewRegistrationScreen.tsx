import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { db, auth } from "../../../constants/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

interface Registration {
  id: string;
  campId: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
}

const ViewRegistrationsScreen = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    const adminId = auth.currentUser?.uid; // Get the logged-in admin's ID
    if (!adminId) return;

    // Fetch health camps created by the admin
    const healthCampsQuery = query(collection(db, "healthCamps"), where("adminId", "==", adminId));
    const healthCampsSnapshot = await getDocs(healthCampsQuery);
    const healthCampIds = healthCampsSnapshot.docs.map((doc) => doc.id);

    // Fetch registrations for these health camps
    const registrationsQuery = query(collection(db, "registrations"), where("campId", "in", healthCampIds));
    const registrationsSnapshot = await getDocs(registrationsQuery);
    const registrationsData: Registration[] = registrationsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        campId: data.campId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        createdAt: data.createdAt.toDate(),
      } as Registration;
    });
    setRegistrations(registrationsData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrations</Text>
      <FlatList
        data={registrations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.registrationItem}>
            <Text style={styles.registrationText}>Name: {item.name}</Text>
            <Text style={styles.registrationText}>Email: {item.email}</Text>
            <Text style={styles.registrationText}>Phone: {item.phone}</Text>
            <Text style={styles.registrationText}>Registered on: {item.createdAt.toLocaleDateString()}</Text>
          </View>
        )}
      />
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
  registrationItem: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  registrationText: {
    fontSize: 14,
    color: "#2E7D32",
  },
});

export default ViewRegistrationsScreen;