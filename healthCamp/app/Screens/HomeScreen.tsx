import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Linking, Share, Modal, TextInput, Alert, Image } from "react-native";
const useRouter = require("expo-router").useRouter;

import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { Menu, Provider } from "react-native-paper";
import Navbar from "../../components/Navbar";
import { db } from "../../constants/firebase";
import { collection, getDocs, Timestamp, addDoc } from "firebase/firestore";
import { WebView } from "react-native-webview";

interface HealthCamp {
  id: string;
  organizationName: string;
  healthCampName: string;
  location: string;
  date: Date;
  timeFrom: Date;
  timeTo: Date;
  description: string;
  ambulancesAvailable: string;
  hospitalNearby: string;
  latitude: number;
  longitude: number;
  registrationUrl: string;
}

const HomeScreen = () => {
  const router = useRouter();
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [camps, setCamps] = useState<HealthCamp[]>([]);
  const [expandedCampId, setExpandedCampId] = useState<string | null>(null);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedCampId, setSelectedCampId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [complaint, setComplaint] = useState("");
  const [feedback, setFeedback] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    fetchCamps();
  }, []);

  const fetchCamps = async () => {
    const querySnapshot = await getDocs(collection(db, "healthCamps"));
    const campsData: HealthCamp[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      const date = data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date || new Date());
      const timeFrom = data.timeFrom instanceof Timestamp ? data.timeFrom.toDate() : new Date(data.timeFrom || new Date());
      const timeTo = data.timeTo instanceof Timestamp ? data.timeTo.toDate() : new Date(data.timeTo || new Date());

      return {
        id: doc.id,
        organizationName: data.organizationName,
        healthCampName: data.healthCampName,
        location: data.location,
        date,
        timeFrom,
        timeTo,
        description: data.description,
        ambulancesAvailable: data.ambulancesAvailable,
        hospitalNearby: data.hospitalNearby,
        latitude: data.latitude,
        longitude: data.longitude,
        registrationUrl: data.registrationUrl,
      } as HealthCamp;
    });
    setCamps(campsData);
  };

  // Function to generate a random image URL based on the health camp name
  const getRandomImageUrl = (seed: string) => {
    return `https://picsum.photos/seed/${seed}/300/200`;
  };

  const handleRegister = (link: string) => {
    Linking.openURL(link).catch((err) => console.error("Failed to open URL:", err));
  };

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = async (link: string) => {
    try {
      await Share.share({
        message: `Check out this free health camp: ${link}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleOpenMap = async (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Error opening map:", error);
    }
  };

  const getGeoapifyMapUrl = (latitude: number, longitude: number) => {
    const apiKey = "0358f75d36084c9089636544e0aeed50";
    return `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${longitude},${latitude}&zoom=14&marker=lonlat:${longitude},${latitude};color:%23ff0000;size:medium&apiKey=${apiKey}`;
  };

  const handleComplaintSubmit = async () => {
    if (!selectedCampId || !email || !complaint) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const camp = camps.find(camp => camp.id === selectedCampId);
    if (!camp) {
      Alert.alert("Error", "Camp not found");
      return;
    }

    try {
      await addDoc(collection(db, "complaints"), {
        email,
        complaint,
        healthCampName: camp.healthCampName,
        createdAt: Timestamp.fromDate(new Date()),
      });
      Alert.alert("Success", "Complaint submitted successfully");
      setShowComplaintModal(false);
      setEmail("");
      setComplaint("");
    } catch (error) {
      console.error("Error submitting complaint:", error);
      Alert.alert("Error", "Failed to submit complaint");
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!selectedCampId || !email || !feedback) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const camp = camps.find(camp => camp.id === selectedCampId);
    if (!camp) {
      Alert.alert("Error", "Camp not found");
      return;
    }

    try {
      await addDoc(collection(db, "feedbacks"), {
        email,
        feedback,
        healthCampName: camp.healthCampName,
        createdAt: Timestamp.fromDate(new Date()),
      });
      Alert.alert("Success", "Feedback submitted successfully");
      setShowFeedbackModal(false);
      setEmail("");
      setFeedback("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      Alert.alert("Error", "Failed to submit feedback");
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Navbar />

        <FlatList
          data={camps}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.campItem}>
              {/* Random Image */}
              <Image
                source={{ uri: getRandomImageUrl(item.healthCampName) }}
                style={styles.campImage}
              />
              <View style={styles.campHeader}>
                <Text style={styles.organizationName}>{item.organizationName}</Text>
                <Menu
                  visible={menuVisible && selectedCampId === item.id}
                  onDismiss={() => setMenuVisible(false)}
                  anchor={
                    <TouchableOpacity 
                      style={styles.menuButton}
                      onPress={() => {
                        setSelectedCampId(item.id);
                        setMenuVisible(true);
                      }}
                    >
                      <FontAwesome name="ellipsis-v" size={24} color="#2E7D32" />
                    </TouchableOpacity>
                  }
                >
                  <Menu.Item
                    onPress={() => {
                      setShowComplaintModal(true);
                      setMenuVisible(false);
                    }}
                    title="Raise a Complaint"
                  />
                  <Menu.Item
                    onPress={() => {
                      setShowFeedbackModal(true);
                      setMenuVisible(false);
                    }}
                    title="Send Feedback"
                  />
                </Menu>
              </View>
              <Text style={styles.campName}>{item.healthCampName}</Text>
              <Text style={styles.campLocation}>{item.location}</Text>
              <Text style={styles.campDate}>Date: {item.date.toLocaleDateString()}</Text>
              <Text style={styles.campTime}>
                Time: {item.timeFrom.toLocaleTimeString()} - {item.timeTo.toLocaleTimeString()}
              </Text>

              <TouchableOpacity onPress={() => handleRegister(item.registrationUrl)}>
                <Text style={styles.registrationLink}>Go to Website</Text>
              </TouchableOpacity>

              {expandedCampId === item.id && (
                <View>
                  <Text style={styles.campDescription}>{item.description}</Text>
                  <Text style={styles.campDetails}>Ambulances: {item.ambulancesAvailable}</Text>
                  <Text style={styles.campDetails}>Hospital Nearby: {item.hospitalNearby}</Text>

                  <WebView
                    source={{ uri: getGeoapifyMapUrl(item.latitude, item.longitude) }}
                    style={styles.map}
                  />

                  <TouchableOpacity style={styles.mapButton} onPress={() => handleOpenMap(item.latitude, item.longitude)}>
                    <Text style={styles.buttonText}>Open in Maps</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.viewMoreButton} onPress={() => setExpandedCampId(expandedCampId === item.id ? null : item.id)}>
                  <Text style={styles.buttonText}>{expandedCampId === item.id ? "View Less" : "View More"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.registerButton} onPress={() => router.push(`../Screens/UserRegister?campId=${item.id}`)}>
                  <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        <Modal visible={showComplaintModal} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Raise a Complaint</Text>
              <TextInput
                style={styles.input}
                placeholder="Your Email"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.input}
                placeholder="Complaint"
                value={complaint}
                onChangeText={setComplaint}
                multiline
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleComplaintSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowComplaintModal(false)}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={showFeedbackModal} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Send Feedback</Text>
              <TextInput
                style={styles.input}
                placeholder="Your Email"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.input}
                placeholder="Feedback"
                value={feedback}
                onChangeText={setFeedback}
                multiline
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleFeedbackSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowFeedbackModal(false)}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E8F5E9",
  },
  campItem: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  campImage: {
    width: "100%",
    height: 150,
    borderRadius: 5,
    marginBottom: 10,
  },
  campHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  organizationName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  campName: {
    fontSize: 16,
    color: "#2E7D32",
  },
  campLocation: {
    fontSize: 14,
    color: "#2E7D32",
  },
  campDate: {
    fontSize: 14,
    color: "#2E7D32",
  },
  campTime: {
    fontSize: 14,
    color: "#2E7D32",
  },
  registrationLink: {
    fontSize: 14,
    color: "#007BFF",
    textDecorationLine: "underline",
    marginTop: 5,
  },
  campDescription: {
    fontSize: 14,
    color: "#2E7D32",
    marginTop: 10,
  },
  campDetails: {
    fontSize: 14,
    color: "#2E7D32",
    marginTop: 5,
  },
  map: {
    height: 200,
    marginTop: 10,
    borderRadius: 5,
  },
  mapButton: {
    backgroundColor: "#2E7D32",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  viewMoreButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginRight: 10,
  },
  registerButton: {
    backgroundColor: "#2E7D32",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#2E7D32",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#2E7D32",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: "#FF0000",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  menuButton: {
    padding: 10,
  },
});

export default HomeScreen;