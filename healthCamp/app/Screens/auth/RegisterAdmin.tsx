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
import * as DocumentPicker from "expo-document-picker";
import { auth, db, storage } from "../../../constants/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from 'expo-router';
export default function AdminRegister({ navigation }: any) {
  const [ngoName, setNgoName] = useState("");
  const [ngoId, setNgoId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [certificate, setCertificate] = useState<{ uri: string } | null>(null);

  const router = useRouter();
  // Pick Certificate
  const pickCertificate = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        multiple: false,
      });

      if (!result.canceled && result.assets.length > 0) {
        const fileUri = result.assets[0].uri;
        setCertificate({ uri: fileUri });
      }
    } catch (error) {
      Alert.alert("Error", "Could not pick a certificate.");
    }
  };

  // Upload Certificate
  const uploadCertificate = async (uid: string) => {
    if (!certificate) return null;

    const certificateRef = ref(storage, `certificates/${uid}.pdf`);
    const response = await fetch(certificate.uri);
    const blob = await response.blob();

    await uploadBytes(certificateRef, blob);
    return await getDownloadURL(certificateRef);
  };

  // NGO Registration
  const handleRegister = async () => {
    if (!ngoName || !ngoId || !email || !password || !certificate) {
      Alert.alert("Error", "All fields are required, including certificate!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const certificateURL = await uploadCertificate(user.uid);

      await setDoc(doc(db, "ngos", user.uid), {
        ngoName,
        ngoId,
        email,
        certificateURL,
        role: "ngo_admin",
      });

      await AsyncStorage.setItem(
        "admin",
        JSON.stringify({ uid: user.uid, ngoName, ngoId, role: "ngo_admin" })
      );

      Alert.alert("Success", "Registration Successful! Please login.");
      router.push("/Screens/auth/AdminLogin");
    } catch (error) {
      Alert.alert("Error", "Registration failed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NGO Registration</Text>

      <TextInput style={styles.input} placeholder="NGO Name" value={ngoName} onChangeText={setNgoName} />
      <TextInput style={styles.input} placeholder="NGO Unique ID" value={ngoId} onChangeText={setNgoId} />
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

      <TouchableOpacity style={styles.uploadButton} onPress={pickCertificate}>
        <Text style={styles.uploadText}>{certificate ? "Certificate Selected" : "Upload Certificate (PDF)"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/Screens/auth/AdminLogin")}>
        <Text style={styles.toggleText}>Already registered? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles remain the same as in your original file
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
    input: {
      width: "90%",
      padding: 12,
      borderWidth: 1,
      borderRadius: 10,
      marginBottom: 12,
    },
    button: {
      backgroundColor: "#007BFF",
      padding: 14,
      width: "90%",
      alignItems: "center",
      borderRadius: 10,
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
    uploadButton: {
      backgroundColor: "#28a745",
      padding: 12,
      borderRadius: 10,
      width: "90%",
      alignItems: "center",
      marginTop: 10,
    },
    uploadText: {
      fontSize: 16,
      color: "#FFF",
      fontWeight: "bold",
    },
  });
  