import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const AdminPanel: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Panel</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/Screens/Admin/AddCamp")}>
        <Text style={styles.buttonText}>Add Health Camp</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/Screens/Admin/ViewCamp")}>
        <Text style={styles.buttonText}>View Health Camps</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("../Screens/Admin/ViewComplaintsScreen")}>
        <Text style={styles.buttonText}>View Complaints</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("../Screens/Admin/ViewFeedbacksScreen")}>
        <Text style={styles.buttonText}>View Feedbacks</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("../Screens/Admin/ViewRegistrationScreen")}>
        <Text style={styles.buttonText}>View Registrations</Text>
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
  button: {
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default AdminPanel;