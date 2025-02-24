import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../../../constants/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from 'expo-router';
export default function HealthStudentRegister({ navigation }: any) {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  // Health Student Registration
  const handleRegister = async () => {
    if (!name || !studentId || !email || !password) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "students", user.uid), {
        name,
        studentId,
        email,
        role: "health_student",
      });

      await AsyncStorage.setItem(
        "student",
        JSON.stringify({ uid: user.uid, name, studentId, role: "health_student" })
      );

      Alert.alert("Success", "Registration Successful! Please login.");
  router.push("/Screens/auth/AdminLogin");
    } catch (error) {
      Alert.alert("Error", "Registration failed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Health Student Registration</Text>

      <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Student ID" value={studentId} onChangeText={setStudentId} />
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/Screens/auth/AdminLogin")}>
        <Text style={styles.toggleText}>Already registered? Login</Text>
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
      backgroundColor: "#f5f5f5",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      color: "#333",
    },
    input: {
      width: "100%",
      height: 50,
      backgroundColor: "#fff",
      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: "#ddd",
    },
    button: {
      width: "100%",
      height: 50,
      backgroundColor: "#007BFF",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 8,
      marginTop: 10,
    },
    buttonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
    toggleText: {
      marginTop: 15,
      color: "#007BFF",
    },
  });
  
