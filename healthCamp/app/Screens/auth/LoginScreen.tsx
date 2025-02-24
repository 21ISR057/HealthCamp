import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../constants/firebase"; // Import Firebase
import { useRouter } from "expo-router"; // Import useRouter

export default function LoginScreen() {
  const router = useRouter(); // Initialize router

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔹 Handle Login Function
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password!");
      return;
    }

    try {
      // 🔹 Sign in User
      await signInWithEmailAndPassword(auth, email, password);

      Alert.alert("Success", "Login Successful!");
      router.push('../HomeScreen'); // ✅ Redirect to Dashboard after login
    } catch (error:any) {
      console.error("Login error:", error.message);
      Alert.alert("Error", "Invalid email or password!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("../Screens/auth/RegisterScreenUser")}>
        <Text style={styles.toggleText}>Don't have an account? Register</Text>
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