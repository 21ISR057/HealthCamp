import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from 'expo-router';

export default function AdminPanel() {
  const router = useRouter();
 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Panel</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/Screens/Admin/AddCamp")}>
        <Text style={styles.buttonText}>Add Health Camp</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("../Screens/Admin/ViewCamp")}>
        <Text style={styles.buttonText}>View Health Camps</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 14,
    width: "90%",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
});
