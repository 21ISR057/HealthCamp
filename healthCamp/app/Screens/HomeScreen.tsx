import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Share,
  Modal,
  TextInput,
  Alert,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
=======
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Linking, Share, Modal, TextInput, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
>>>>>>> e91dec83dd21cda0363788834ad67916fb1a00c7
import { Menu, Provider } from "react-native-paper";
import Navbar from "../../components/Navbar";
import { db } from "../../constants/firebase";
import { collection, getDocs, Timestamp, addDoc } from "firebase/firestore";
import { WebView } from "react-native-webview";
<<<<<<< HEAD
import DateTimePicker from "@react-native-community/datetimepicker";
=======
>>>>>>> e91dec83dd21cda0363788834ad67916fb1a00c7

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
<<<<<<< HEAD
  const [filteredCamps, setFilteredCamps] = useState<HealthCamp[]>([]);
=======
>>>>>>> e91dec83dd21cda0363788834ad67916fb1a00c7
  const [expandedCampId, setExpandedCampId] = useState<string | null>(null);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedCampId, setSelectedCampId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [complaint, setComplaint] = useState("");
  const [feedback, setFeedback] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
<<<<<<< HEAD
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedCampNames, setSelectedCampNames] = useState<string[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [campNameSuggestions, setCampNameSuggestions] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<string>(""); // Assume user location is stored here
  const [hasNotification, setHasNotification] = useState<boolean>(false);

  useEffect(() => {
    fetchCamps();
    // Fetch user location from your backend or local storage
    const userLocationFromStorage = "UserLocation"; // Replace with actual user location
    setUserLocation(userLocationFromStorage);
  }, []);

  useEffect(() => {
    filterCamps();
    checkForNotifications();
  }, [searchQuery, dateFrom, dateTo, selectedLocations, selectedCampNames, camps, userLocation]);

=======

  useEffect(() => {
    fetchCamps();
  }, []);

>>>>>>> e91dec83dd21cda0363788834ad67916fb1a00c7
  const fetchCamps = async () => {
    const querySnapshot = await getDocs(collection(db, "healthCamps"));
    const campsData: HealthCamp[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
<<<<<<< HEAD
=======

>>>>>>> e91dec83dd21cda0363788834ad67916fb1a00c7
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
<<<<<<< HEAD
    setFilteredCamps(campsData);
  };

  const checkForNotifications = () => {
    const hasMatchingCamps = camps.some(camp => camp.location === userLocation);
    setHasNotification(hasMatchingCamps);
  };

  const filterCamps = () => {
    let filtered = camps;

    if (searchQuery) {
      filtered = filtered.filter((camp) =>
        camp.healthCampName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (dateFrom && dateTo) {
      filtered = filtered.filter(
        (camp) => camp.date >= dateFrom && camp.date <= dateTo
      );
    }

    if (selectedLocations.length > 0) {
      filtered = filtered.filter((camp) =>
        selectedLocations.includes(camp.location)
      );
    }

    if (selectedCampNames.length > 0) {
      filtered = filtered.filter((camp) =>
        selectedCampNames.includes(camp.healthCampName)
      );
    }

    setFilteredCamps(filtered);
  };

  const handleLocationInput = (text: string) => {
    const suggestions = Array.from(new Set(camps.map((camp) => camp.location))).filter(
      (location) => location.toLowerCase().includes(text.toLowerCase())
    );
    setLocationSuggestions(suggestions);
  };

  const handleCampNameInput = (text: string) => {
    const suggestions = Array.from(new Set(camps.map((camp) => camp.healthCampName))).filter(
      (name) => name.toLowerCase().includes(text.toLowerCase())
    );
    setCampNameSuggestions(suggestions);
  };

=======
  };

  // Function to generate a random image URL based on the health camp name
>>>>>>> e91dec83dd21cda0363788834ad67916fb1a00c7
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

<<<<<<< HEAD
  const isCampActive = (campDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return campDate >= today;
  };

=======
>>>>>>> e91dec83dd21cda0363788834ad67916fb1a00c7
  return (
    <Provider>
      <View style={styles.container}>
        <Navbar />

<<<<<<< HEAD
        {/* Search and Filter UI */}
        <View style={styles.navbarContainer}>
          <TouchableOpacity onPress={() => setShowFilterModal(true)}>
            <Ionicons name="filter" size={24} color="#2E7D32" />
          </TouchableOpacity>
          <TextInput
            style={styles.searchBox}
            placeholder="Search by health camp name..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity onPress={() => {}}>
            <View>
              <Ionicons name="notifications" size={24} color="#2E7D32" />
              {hasNotification && <View style={styles.notificationDot} />}
            </View>
          </TouchableOpacity>
        </View>

        {/* Selected Filters */}
        {(selectedLocations.length > 0 || selectedCampNames.length > 0 || (dateFrom && dateTo)) && (
          <View style={styles.filtersContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {dateFrom && dateTo && (
                <View style={styles.filterTag}>
                  <Text style={styles.filterTagText}>
                    {dateFrom.toLocaleDateString()} - {dateTo.toLocaleDateString()}
                  </Text>
                  <TouchableOpacity onPress={() => {
                    setDateFrom(null);
                    setDateTo(null);
                  }}>
                    <Ionicons name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              )}
              {selectedLocations.map((location, index) => (
                <View key={`loc-${index}`} style={styles.filterTag}>
                  <Text style={styles.filterTagText}>{location}</Text>
                  <TouchableOpacity onPress={() => setSelectedLocations(selectedLocations.filter((loc) => loc !== location))}>
                    <Ionicons name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
              {selectedCampNames.map((name, index) => (
                <View key={`camp-${index}`} style={styles.filterTag}>
                  <Text style={styles.filterTagText}>{name}</Text>
                  <TouchableOpacity onPress={() => setSelectedCampNames(selectedCampNames.filter((n) => n !== name))}>
                    <Ionicons name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <FlatList
          data={filteredCamps}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isActive = isCampActive(item.date);
            return (
              <View style={[styles.campItem, !isActive && styles.inactiveCamp]}>
                <Image
                  source={{ uri: getRandomImageUrl(item.healthCampName) }}
                  style={styles.campImage}
                />
                <View style={styles.campHeader}>
                  <Text style={styles.organizationName}>{item.organizationName}</Text>
                  {isActive && (
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
                  )}
                </View>
                <Text style={styles.campName}>{item.healthCampName}</Text>
                <Text style={styles.campLocation}>{item.location}</Text>
                <Text style={styles.campDate}>Date: {item.date.toLocaleDateString()}</Text>
                <Text style={styles.campTime}>
                  Time: {item.timeFrom.toLocaleTimeString()} - {item.timeTo.toLocaleTimeString()}
                </Text>

                {isActive ? (
                  <TouchableOpacity onPress={() => handleRegister(item.registrationUrl)}>
                    <Text style={styles.registrationLink}>Go to Website</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.inactiveText}>This camp has ended.</Text>
                )}

                {expandedCampId === item.id && isActive && (
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
                  <TouchableOpacity 
                    style={[styles.viewMoreButton, !isActive && styles.disabledButton]} 
                    onPress={() => isActive && setExpandedCampId(expandedCampId === item.id ? null : item.id)}
                    disabled={!isActive}
                  >
                    <Text style={styles.buttonText}>{expandedCampId === item.id ? "View Less" : "View More"}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.registerButton, !isActive && styles.disabledButton]} 
                    onPress={() => isActive && router.push(`../Screens/UserRegister?campId=${item.id}`)}
                    disabled={!isActive}
                  >
                    <Text style={styles.buttonText}>Register</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />

        {/* Complaint Modal */}
=======
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

>>>>>>> e91dec83dd21cda0363788834ad67916fb1a00c7
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

<<<<<<< HEAD
        {/* Feedback Modal */}
=======
>>>>>>> e91dec83dd21cda0363788834ad67916fb1a00c7
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
<<<<<<< HEAD

        {/* Filter Modal */}
        <Modal visible={showFilterModal} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Advanced Filters</Text>

              {/* Date Range Picker */}
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.datePickerText}>
                  {dateFrom && dateTo
                    ? `${dateFrom.toLocaleDateString()} - ${dateTo.toLocaleDateString()}`
                    : "Select Date Range"}
                </Text>
              </TouchableOpacity>

              {/* Location Filter */}
              <TextInput
                style={styles.input}
                placeholder="Filter by location..."
                onChangeText={handleLocationInput}
              />
              <ScrollView style={styles.suggestionsContainer}>
                {locationSuggestions.map((location, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => {
                      if (!selectedLocations.includes(location)) {
                        setSelectedLocations([...selectedLocations, location]);
                      }
                      setLocationSuggestions([]);
                    }}
                  >
                    <Text>{location}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Camp Name Filter */}
              <TextInput
                style={styles.input}
                placeholder="Filter by camp name..."
                onChangeText={handleCampNameInput}
              />
              <ScrollView style={styles.suggestionsContainer}>
                {campNameSuggestions.map((name, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => {
                      if (!selectedCampNames.includes(name)) {
                        setSelectedCampNames([...selectedCampNames, name]);
                      }
                      setCampNameSuggestions([]);
                    }}
                  >
                    <Text>{name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Apply Filters Button */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.buttonText}>Apply Filters</Text>
              </TouchableOpacity>

              {/* Reset Filters Button */}
              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => {
                  setDateFrom(null);
                  setDateTo(null);
                  setSelectedLocations([]);
                  setSelectedCampNames([]);
                  setSearchQuery("");
                  setFilteredCamps(camps);
                  setShowFilterModal(false);
                }}
              >
                <Text style={styles.buttonText}>Reset Filters</Text>
              </TouchableOpacity>

              {/* Close Modal Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={dateFrom || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                if (!dateFrom) {
                  setDateFrom(selectedDate);
                  setShowDatePicker(true); // Show picker again for end date
                } else {
                  setDateTo(selectedDate);
                }
              }
            }}
          />
        )}
=======
>>>>>>> e91dec83dd21cda0363788834ad67916fb1a00c7
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
<<<<<<< HEAD
  navbarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 10,
    elevation: 3,
  },
  searchBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#2E7D32",
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
    backgroundColor: "#FFF",
  },
  filtersContainer: {
    margin: 5,
    height: 25, 
    marginBottom: 20,
  },
  filterTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E7D32",
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  filterTagText: {
    color: "#FFF",
    marginRight: 5,
    fontSize: 12, // Smaller font size for filter tags
  },
=======
>>>>>>> e91dec83dd21cda0363788834ad67916fb1a00c7
  campItem: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
<<<<<<< HEAD
    elevation: 2,
  },
  inactiveCamp: {
    opacity: 0.6,
=======
>>>>>>> e91dec83dd21cda0363788834ad67916fb1a00c7
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
<<<<<<< HEAD
  inactiveText: {
    fontSize: 14,
    color: "#FF0000",
    marginTop: 5,
  },
=======
>>>>>>> e91dec83dd21cda0363788834ad67916fb1a00c7
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
<<<<<<< HEAD
  disabledButton: {
    backgroundColor: "#ccc",
  },
=======
>>>>>>> e91dec83dd21cda0363788834ad67916fb1a00c7
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
<<<<<<< HEAD
    maxHeight: "80%",
=======
>>>>>>> e91dec83dd21cda0363788834ad67916fb1a00c7
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
<<<<<<< HEAD
  suggestionsContainer: {
    maxHeight: 100,
    marginBottom: 10,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: "#2E7D32",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  datePickerText: {
    color: "#2E7D32",
  },
=======
>>>>>>> e91dec83dd21cda0363788834ad67916fb1a00c7
  submitButton: {
    backgroundColor: "#2E7D32",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
<<<<<<< HEAD
  resetButton: {
    backgroundColor: "#FF9800",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
=======
>>>>>>> e91dec83dd21cda0363788834ad67916fb1a00c7
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
<<<<<<< HEAD
  notificationDot: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'red',
    borderRadius: 5,
    width: 10,
    height: 10,
  },
=======
>>>>>>> e91dec83dd21cda0363788834ad67916fb1a00c7
});

export default HomeScreen;