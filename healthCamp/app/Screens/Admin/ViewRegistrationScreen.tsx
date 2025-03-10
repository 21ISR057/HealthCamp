import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { db, auth } from "../../../constants/firebase";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import * as FileSystem from "expo-file-system"; // For file system operations
import * as Sharing from 'expo-sharing'; // For sharing files
=======
import { View, Text, FlatList, StyleSheet } from "react-native";
import { db, auth } from "../../../constants/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
>>>>>>> e91dec83dd21cda0363788834ad67916fb1a00c7

interface Registration {
  id: string;
  campId: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
<<<<<<< HEAD
  verified: boolean; // Add verified field
}

interface Camp {
  id: string;
  healthCampName: string; // Add camp name field
}

interface CampReport {
  campName: string;
  totalRegistrations: number;
  verifiedRegistrations: number;
=======
>>>>>>> e91dec83dd21cda0363788834ad67916fb1a00c7
}

const ViewRegistrationsScreen = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
<<<<<<< HEAD
  const [camps, setCamps] = useState<Camp[]>([]); // Store camp data
  const [campReports, setCampReports] = useState<CampReport[]>([]); // Store camp reports
=======
>>>>>>> e91dec83dd21cda0363788834ad67916fb1a00c7

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

<<<<<<< HEAD
    // Store camp data for mapping
    const campsData: Camp[] = healthCampsSnapshot.docs.map((doc) => ({
      id: doc.id,
      healthCampName: doc.data().healthCampName,
    }));
    setCamps(campsData);

=======
>>>>>>> e91dec83dd21cda0363788834ad67916fb1a00c7
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
<<<<<<< HEAD
        verified: data.verified || false, // Default to false if not set
      } as Registration;
    });
    setRegistrations(registrationsData);

    // Calculate camp reports
    const reports: CampReport[] = campsData.map((camp) => {
      const campRegistrations = registrationsData.filter((reg) => reg.campId === camp.id);
      const verifiedRegistrations = campRegistrations.filter((reg) => reg.verified).length;
      return {
        campName: camp.healthCampName,
        totalRegistrations: campRegistrations.length,
        verifiedRegistrations,
      };
    });
    setCampReports(reports);
  };

  const handleVerify = async (registrationId: string, campId: string) => {
    try {
      // Update the registration to mark it as verified
      const registrationRef = doc(db, "registrations", registrationId);
      await updateDoc(registrationRef, { verified: true });

      // Update the local state to reflect the verification
      setRegistrations((prevRegistrations) =>
        prevRegistrations.map((reg) =>
          reg.id === registrationId ? { ...reg, verified: true } : reg
        )
      );

      // Recalculate camp reports
      const updatedReports = campReports.map((report) => {
        if (camps.find((camp) => camp.id === campId)?.healthCampName === report.campName) {
          return {
            ...report,
            verifiedRegistrations: report.verifiedRegistrations + 1,
          };
        }
        return report;
      });
      setCampReports(updatedReports);

      Alert.alert("Success", "Registration verified successfully!");
    } catch (error) {
      console.error("Error verifying registration:", error);
      Alert.alert("Error", "Failed to verify registration.");
    }
  };

  const generateCSV = () => {
    let csvContent = "Camp Name,Total Registrations,Verified Registrations\n";
    campReports.forEach((report) => {
      csvContent += `${report.campName},${report.totalRegistrations},${report.verifiedRegistrations}\n`;
    });
    return csvContent;
  };

  const downloadCSV = async () => {
    const csvContent = generateCSV();
    const fileUri = FileSystem.documentDirectory + "camp_reports.csv";

    try {
      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("Sharing is not available on this device.");
        return;
      }

      // Share the file
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Share Camp Report',
        UTI: 'public.comma-separated-values-text', // iOS only
      });

      Alert.alert("Success", "CSV file downloaded successfully!");
    } catch (error) {
      console.error("Error downloading CSV:", error);
      Alert.alert("Error", "Failed to download CSV file.");
    }
=======
      } as Registration;
    });
    setRegistrations(registrationsData);
>>>>>>> e91dec83dd21cda0363788834ad67916fb1a00c7
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
<<<<<<< HEAD
            <Text style={styles.registrationText}>
              Registered on: {item.createdAt.toLocaleDateString()}
            </Text>
            <Text style={styles.registrationText}>
              Status: {item.verified ? "Verified" : "Not Verified"}
            </Text>
            {!item.verified && (
              <TouchableOpacity
                style={styles.verifyButton}
                onPress={() => handleVerify(item.id, item.campId)}
              >
                <Text style={styles.verifyButtonText}>Verify</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      {/* Display camp reports */}
      <View style={styles.reportContainer}>
        <Text style={styles.reportTitle}>Camp Reports</Text>
        {campReports.map((report, index) => (
          <View key={index} style={styles.reportItem}>
            <Text style={styles.reportText}>Camp: {report.campName}</Text>
            <Text style={styles.reportText}>Total Registrations: {report.totalRegistrations}</Text>
            <Text style={styles.reportText}>Verified Registrations: {report.verifiedRegistrations}</Text>
          </View>
        ))}
      </View>

      {/* Download CSV Button */}
      <TouchableOpacity style={styles.downloadButton} onPress={downloadCSV}>
        <Text style={styles.downloadButtonText}>Download Report as CSV</Text>
      </TouchableOpacity>
=======
            <Text style={styles.registrationText}>Registered on: {item.createdAt.toLocaleDateString()}</Text>
          </View>
        )}
      />
>>>>>>> e91dec83dd21cda0363788834ad67916fb1a00c7
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
<<<<<<< HEAD
    marginBottom: 5,
  },
  verifyButton: {
    backgroundColor: "#2E7D32",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  verifyButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  reportContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 5,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 10,
  },
  reportItem: {
    marginBottom: 10,
  },
  reportText: {
    fontSize: 14,
    color: "#2E7D32",
  },
  downloadButton: {
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  downloadButtonText: {
    color: "#FFF",
    fontWeight: "bold",
=======
>>>>>>> e91dec83dd21cda0363788834ad67916fb1a00c7
  },
});

export default ViewRegistrationsScreen;