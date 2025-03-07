import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../../constants/firebase"; // Import Firebase
import { useRouter } from "expo-router"; // ✅ Import useRouter

export default function RegisterScreen() {
  const router = useRouter(); // ✅ Initialize router

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [locality, setLocality] = useState("");
  // 🔹 Handle Registration Function
  const handleRegister = async () => {
    if (!fullName || !email || !password || !phoneNumber || !gender || !dob||!locality) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      // 🔹 Create User in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔹 Dynamic User Data to Store in Firestore
      const userData = {
        uid: user.uid,
        fullName,
        email,
        phoneNumber,
        gender,
        dob,
        locality,
        createdAt: serverTimestamp(),
      };

      // 🔹 Store Data in Firestore
      await setDoc(doc(db, "users", user.uid), userData);

      Alert.alert("Success", "Registration Successful!");
      router.push("/Screens/auth/LoginScreen"); 
    } catch (error:any) {
      console.error("Registration error:", error.message);
      Alert.alert("Error", "Registration failed. Try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" value={phoneNumber} onChangeText={setPhoneNumber} />
      <TextInput style={styles.input} placeholder="Gender" value={gender} onChangeText={setGender} />
      <TextInput style={styles.input} placeholder="Date of Birth (YYYY-MM-DD)" value={dob} onChangeText={setDob} />
      <TextInput style={styles.input} placeholder="Locality" value={locality} onChangeText={setLocality} /> {/* ✅ Added input for locality */}

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/Screens/auth/LoginScreen")}> 
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
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "90%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#FFF",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 14,
    width: "90%",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
  toggleText: {
    fontSize: 16,
    color: "#007BFF",
    marginTop: 10,
  },
});
