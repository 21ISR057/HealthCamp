import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import * as DocumentPicker from "react-native-document-picker";
import { Ionicons } from "@expo/vector-icons";
const useRouter = require("expo-router").useRouter;


interface UploadedFile {
  name: string;
  uri: string;
  type: string;
}

const MedicalReport: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const router = useRouter();

  const categories = ["Blood Test", "X-Ray", "MRI Scan", "Prescription", "Other"];

  // Function to pick PDF files
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf], // Allow only PDFs
      });

      if (result && selectedCategory) {
        const newFile: UploadedFile = {
          name: result[0].name??"Unknown File",
          uri: result[0].uri,
          type: result[0].type || "application/pdf",
        };

        setUploadedFiles((prevFiles) => [...prevFiles, newFile]);
        Alert.alert("Success", `File uploaded under ${selectedCategory}!`);
      } else {
        Alert.alert("Error", "Please select a category first!");
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("User cancelled document picker");
      } else {
        console.error(err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📄 Upload Medical Reports</Text>

      {/* Category Selection */}
      <Text style={styles.label}>Select Report Type:</Text>
      <View style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category ? styles.categorySelected : null,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Upload Button */}
      <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
        <Ionicons name="cloud-upload-outline" size={24} color="white" />
        <Text style={styles.uploadButtonText}>Upload PDF</Text>
      </TouchableOpacity>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <>
          <Text style={styles.label}>Uploaded Reports:</Text>
          <FlatList
            data={uploadedFiles}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.fileItem}>
                <Ionicons name="document-text-outline" size={20} color="#444" />
                <Text style={styles.fileName}>{item.name}</Text>
              </View>
            )}
          />
        </>
      )}

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="white" />
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MedicalReport;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 15,
  },
  categoryButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  categorySelected: {
    backgroundColor: "#007bff",
  },
  categoryText: {
    color: "#333",
    fontSize: 14,
  },
  uploadButton: {
    flexDirection: "row",
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  uploadButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    elevation: 2,
  },
  fileName: {
    marginLeft: 10,
    fontSize: 14,
    color: "#444",
  },
  backButton: {
    flexDirection: "row",
    backgroundColor: "#333",
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
  },
});
