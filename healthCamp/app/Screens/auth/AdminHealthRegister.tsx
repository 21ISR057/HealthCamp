import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../../../constants/firebase"; // Ensure storage is imported
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage functions
import { useRouter } from "expo-router";
import { getStorage } from "firebase/storage";
export default function HealthStudentRegister() {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
    
  const handleRegister = async () => {
    if (!name || !studentId || !email || !password) {
      Alert.alert("Error", "All fields and Student ID image are required!");
      return;
    }

    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Save user details in Firestore
      await setDoc(doc(db, "students", user.uid), {
        uid: user.uid,
        name,
        studentId,
        email,
        role: "health_student",
        createdAt: serverTimestamp(), // Store registration timestamp
      });

      // Store user data in AsyncStorage for session management
      await AsyncStorage.setItem(
        "student",
        JSON.stringify({ uid: user.uid, name, studentId, role: "health_student" })
      );

      Alert.alert("Success", "Registration Successful! Please login.");
      router.push("/Screens/auth/AdminLogin");
    } catch (error) {
      console.error("Registration Error:", error);
      Alert.alert("Error", "Registration failed. Please try again.");
    }
  };
  const uploadImage = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
  
      const storage = getStorage();
      const storageRef = ref(storage, `studentIds/${Date.now()}.jpg`);
  
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
  
      return downloadURL; // Save this URL in Firestore
    } catch (error) {
      console.error("Upload Error:", error);
      Alert.alert("Upload Failed", "Could not upload image.");
      return null;
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
  imagePicker: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  imagePickerText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  previewImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 5,
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
