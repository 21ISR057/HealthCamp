import React, { useEffect, useState } from "react";
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
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { collection, getDocs, Timestamp, addDoc, query, where } from "firebase/firestore";
import { db, auth } from "../../constants/firebase";
import { WebView } from "react-native-webview";
import DateTimePicker from "@react-native-community/datetimepicker";
import Navbar from "../../components/Navbar"; // Update this path as needed for your project structure

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

interface User {
  id: string;
  locality: string;
}

const HomeScreen = () => {
  const router = useRouter();
  const [camps, setCamps] = useState<HealthCamp[]>([]);
  const [filteredCamps, setFilteredCamps] = useState<HealthCamp[]>([]);
  const [expandedCampId, setExpandedCampId] = useState<string | null>(null);
  const [selectedCampId, setSelectedCampId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userLocality, setUserLocality] = useState<string>("");
  const [localCamps, setLocalCamps] = useState<HealthCamp[]>([]);
  const [hasNotification, setHasNotification] = useState<boolean>(false);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  
  // States for Feedback Modal
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  
  // States for Complaint Modal
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaintEmail, setComplaintEmail] = useState("");
  const [complaintText, setComplaintText] = useState("");
  const [showOptionsMenu, setShowOptionsMenu] = useState<string | null>(null);

  // Fetch user locality from Firestore
  const fetchUserLocality = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userQuery = query(collection(db, "users"), where("uid", "==", user.uid));
        const userSnapshot = await getDocs(userQuery);
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data() as User;
          setUserLocality(userData.locality);
        }
      }
    } catch (error) {
      console.error("Error fetching user locality:", error);
    }
  };

  // Fetch health camps from Firestore
  const fetchCamps = async () => {
    try {
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
      setFilteredCamps(campsData);
      
      // Find camps in user's locality
      if (userLocality) {
        const matchingCamps = campsData.filter(camp => 
          camp.location.toLowerCase() === userLocality.toLowerCase() && isCampActive(camp.date)
        );
        setLocalCamps(matchingCamps);
        setHasNotification(matchingCamps.length > 0);
      }
    } catch (error) {
      console.error("Error fetching camps:", error);
    }
  };

  useEffect(() => {
    fetchUserLocality();
  }, []);

  useEffect(() => {
    fetchCamps();
  }, [userLocality]);

  useEffect(() => {
    filterCamps();
  }, [searchQuery, dateFrom, dateTo, selectedLocations, camps]);

  const isCampActive = (campDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return campDate >= today;
  };

  const filterCamps = () => {
    let filtered = camps.filter(camp => isCampActive(camp.date));

    if (searchQuery) {
      filtered = filtered.filter((camp) =>
        camp.healthCampName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        camp.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        camp.location.toLowerCase().includes(searchQuery.toLowerCase())
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

    setFilteredCamps(filtered);
  };

  const handleOpenMap = async (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Error opening map:", error);
    }
  };

  const handleRegister = (campId: string) => {
    router.push(`../Screens/UserRegister?campId=${campId}`);
  };

  const handleWebsiteLink = (link: string) => {
    Linking.openURL(link).catch((err) => console.error("Failed to open URL:", err));
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const clearFilters = () => {
    setDateFrom(null);
    setDateTo(null);
    setSelectedLocations([]);
    setSearchQuery("");
    setFilteredCamps(camps.filter(camp => isCampActive(camp.date)));
    setShowFilterModal(false);
  };
  
  // Handle sending feedback
  const handleSendFeedback = async () => {
    // Validate inputs
    if (!feedbackEmail || !feedbackText) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    
    if (selectedCampId) {
      try {
        const selectedCamp = camps.find(camp => camp.id === selectedCampId);
        
        if (selectedCamp) {
          // Add feedback to Firestore collection
          await addDoc(collection(db, "feedbacks"), {
            email: feedbackEmail,
            feedback: feedbackText,
            campId: selectedCampId,
            campName: selectedCamp.healthCampName,
            timestamp: Timestamp.now()
          });
          
          Alert.alert("Success", "Your feedback has been submitted successfully");
          
          // Reset fields and close modal
          setFeedbackEmail("");
          setFeedbackText("");
          setShowFeedbackModal(false);
        }
      } catch (error) {
        console.error("Error sending feedback:", error);
        Alert.alert("Error", "Failed to submit feedback. Please try again later.");
      }
    }
  };
  
  // Handle raising a complaint
  const handleRaiseComplaint = async () => {
    // Validate inputs
    if (!complaintEmail || !complaintText) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    
    if (selectedCampId) {
      try {
        const selectedCamp = camps.find(camp => camp.id === selectedCampId);
        
        if (selectedCamp) {
          // Add complaint to Firestore collection
          await addDoc(collection(db, "complaints"), {
            email: complaintEmail,
            complaint: complaintText,
            campId: selectedCampId,
            campName: selectedCamp.healthCampName,
            timestamp: Timestamp.now()
          });
          
          Alert.alert("Success", "Your complaint has been submitted successfully");
          
          // Reset fields and close modal
          setComplaintEmail("");
          setComplaintText("");
          setShowComplaintModal(false);
        }
      } catch (error) {
        console.error("Error raising complaint:", error);
        Alert.alert("Error", "Failed to submit complaint. Please try again later.");
      }
    }
  };
  
  // Handle showing options menu
  const toggleOptionsMenu = (campId: string) => {
    if (showOptionsMenu === campId) {
      setShowOptionsMenu(null);
    } else {
      setShowOptionsMenu(campId);
      setSelectedCampId(campId);
    }
  };

  const renderCampCard = ({ item }: { item: HealthCamp }) => {
    return (
      <View style={styles.card}>
        <Image
          source={{ uri: `https://picsum.photos/seed/${item.id}/400/200` }}
          style={styles.cardImage}
        />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.organizationName}>{item.organizationName}</Text>
              <Text style={styles.campName}>{item.healthCampName}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleOptionsMenu(item.id)}>
              <Feather name="more-vertical" size={20} color="#555" />
            </TouchableOpacity>
          </View>
          
          {/* Options Menu */}
          {showOptionsMenu === item.id && (
            <View style={styles.optionsMenu}>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => {
                  setShowOptionsMenu(null);
                  setShowFeedbackModal(true);
                }}
              >
                <Feather name="message-square" size={16} color="#555" />
                <Text style={styles.optionText}>Send Feedback</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => {
                  setShowOptionsMenu(null);
                  setShowComplaintModal(true);
                }}
              >
                <Feather name="alert-circle" size={16} color="#555" />
                <Text style={styles.optionText}>Raise a Complaint</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.infoRow}>
            <Feather name="map-pin" size={16} color="#555" />
            <Text style={styles.infoText}>{item.location}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Feather name="calendar" size={16} color="#555" />
            <Text style={styles.infoText}>{formatDate(item.date)}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Feather name="clock" size={16} color="#555" />
            <Text style={styles.infoText}>{formatTime(item.timeFrom)} - {formatTime(item.timeTo)}</Text>
          </View>

          {expandedCampId === item.id && (
            <View style={styles.expandedContent}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{item.description}</Text>
              
              <Text style={styles.sectionTitle}>Details</Text>
              <View style={styles.infoRow}>
                <Feather name="truck" size={16} color="#555" />
                <Text style={styles.infoText}>Ambulances: {item.ambulancesAvailable}</Text>
              </View>
              <View style={styles.infoRow}>
                <Feather name="home" size={16} color="#555" />
                <Text style={styles.infoText}>Hospital Nearby: {item.hospitalNearby}</Text>
              </View>
              
              <WebView
                source={{ uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${item.longitude},${item.latitude}&zoom=14&marker=lonlat:${item.longitude},${item.latitude};color:%23ff0000;size:medium&apiKey=0358f75d36084c9089636544e0aeed50` }}
                style={styles.map}
              />
              
              <TouchableOpacity 
                style={styles.mapButton} 
                onPress={() => handleOpenMap(item.latitude, item.longitude)}
              >
                <Feather name="map" size={16} color="#FFF" />
                <Text style={styles.buttonText}>Open in Maps</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.cardActions}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => setExpandedCampId(expandedCampId === item.id ? null : item.id)}
            >
              <Text style={styles.actionButtonText}>
                {expandedCampId === item.id ? "View Less" : "View More"}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.websiteButton} 
                onPress={() => handleWebsiteLink(item.registrationUrl)}
              >
                <Feather name="external-link" size={16} color="#FFF" />
                <Text style={styles.buttonText}>Website</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.registerButton} 
                onPress={() => handleRegister(item.id)}
              >
                <Feather name="user-plus" size={16} color="#FFF" />
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#F5F5F5" barStyle="dark-content" />
      
      {/* Navbar */}
      <Navbar />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Health Camps</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => setShowFilterModal(true)}>
            <Feather name="filter" size={22} color="#333" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.notificationButton} 
            onPress={() => setShowNotificationModal(true)}
          >
            <Feather name="bell" size={22} color="#333" />
            {hasNotification && <View style={styles.notificationDot} />}
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#888" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search camps, organizations, or locations..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Feather name="x" size={20} color="#888" />
          </TouchableOpacity>
        ) : null}
      </View>
      
      {/* Selected Filters Display */}
      {selectedLocations.length > 0 || (dateFrom && dateTo) ? (
        <View style={styles.filterChipsContainer}>
          {dateFrom && dateTo && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>
                {formatDate(dateFrom)} - {formatDate(dateTo)}
              </Text>
              <TouchableOpacity onPress={() => {
                setDateFrom(null);
                setDateTo(null);
              }}>
                <Feather name="x" size={14} color="#555" />
              </TouchableOpacity>
            </View>
          )}
          
          {selectedLocations.map((location, index) => (
            <View key={`loc-${index}`} style={styles.filterChip}>
              <Text style={styles.filterChipText}>{location}</Text>
              <TouchableOpacity onPress={() => 
                setSelectedLocations(selectedLocations.filter((loc) => loc !== location))
              }>
                <Feather name="x" size={14} color="#555" />
              </TouchableOpacity>
            </View>
          ))}
          
          <TouchableOpacity 
            style={styles.clearChip} 
            onPress={clearFilters}
          >
            <Text style={styles.clearChipText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      
      {/* Camp List */}
      {filteredCamps.length > 0 ? (
        <FlatList
          data={filteredCamps}
          keyExtractor={(item) => item.id}
          renderItem={renderCampCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Feather name="calendar" size={60} color="#CCC" />
          <Text style={styles.emptyText}>No health camps available</Text>
          <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
        </View>
      )}
      
      {/* Notification Modal */}
      <Modal
        visible={showNotificationModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowNotificationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.notificationModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <TouchableOpacity onPress={() => setShowNotificationModal(false)}>
                <Feather name="x" size={22} color="#333" />
              </TouchableOpacity>
            </View>
            
            {localCamps.length > 0 ? (
              <FlatList
                data={localCamps}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.notificationItem}
                    onPress={() => {
                      setShowNotificationModal(false);
                      const camp = filteredCamps.find(c => c.id === item.id);
                      if (camp) {
                        setExpandedCampId(item.id);
                      }
                    }}
                  >
                    <View style={styles.notificationContent}>
                      <View style={styles.notificationDot} />
                      <View>
                        <Text style={styles.notificationTitle}>
                          New Health Camp in {userLocality}
                        </Text>
                        <Text style={styles.notificationCampName}>
                          {item.healthCampName} by {item.organizationName}
                        </Text>
                        <Text style={styles.notificationDate}>
                          {formatDate(item.date)}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <View style={styles.emptyNotifications}>
                <Feather name="bell-off" size={40} color="#CCC" />
                <Text style={styles.emptyNotificationsText}>
                  No health camps in your area
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
      
      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Health Camps</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Feather name="x" size={22} color="#333" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.filterLabel}>Date Range</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Feather name="calendar" size={16} color="#555" />
              <Text style={styles.datePickerText}>
                {dateFrom && dateTo
                  ? `${formatDate(dateFrom)} - ${formatDate(dateTo)}`
                  : "Select Date Range"}
              </Text>
            </TouchableOpacity>
            
            <Text style={styles.filterLabel}>Locations</Text>
            <View style={styles.locationOptions}>
              {Array.from(new Set(camps.map(camp => camp.location))).map((location, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.locationOption,
                    selectedLocations.includes(location) && styles.selectedLocation
                  ]}
                  onPress={() => {
                    if (selectedLocations.includes(location)) {
                      setSelectedLocations(selectedLocations.filter(loc => loc !== location));
                    } else {
                      setSelectedLocations([...selectedLocations, location]);
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.locationOptionText,
                      selectedLocations.includes(location) && styles.selectedLocationText
                    ]}
                  >
                    {location}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.filterActions}>
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={clearFilters}
              >
                <Text style={styles.clearFiltersText}>Clear Filters</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.applyFiltersButton}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.applyFiltersText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
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
      
      {/* Feedback Modal */}
      <Modal
        visible={showFeedbackModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFeedbackModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.formModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send Feedback</Text>
              <TouchableOpacity onPress={() => setShowFeedbackModal(false)}>
                <Feather name="x" size={22} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#888"
                value={feedbackEmail}
                onChangeText={setFeedbackEmail}
                keyboardType="email-address"
              />
              
              <Text style={styles.inputLabel}>Feedback</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Write your feedback here..."
                placeholderTextColor="#888"
                value={feedbackText}
                onChangeText={setFeedbackText}
                multiline={true}
                numberOfLines={5}
                textAlignVertical="top"
              />
              
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSendFeedback}
              >
                <Text style={styles.submitButtonText}>Submit Feedback</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Complaint Modal */}
      <Modal
        visible={showComplaintModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowComplaintModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.formModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Raise a Complaint</Text>
              <TouchableOpacity onPress={() => setShowComplaintModal(false)}>
                <Feather name="x" size={22} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#888"
                value={complaintEmail}
                onChangeText={setComplaintEmail}
                keyboardType="email-address"
              />
              
              <Text style={styles.inputLabel}>Complaint</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Describe your complaint here..."
                placeholderTextColor="#888"
                value={complaintText}
                onChangeText={setComplaintText}
                multiline={true}
                numberOfLines={5}
                textAlignVertical="top"
              />
              
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: "#E53935" }]}
                onPress={handleRaiseComplaint}
              >
                <Text style={styles.submitButtonText}>Submit Complaint</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationButton: {
    marginLeft: 16,
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E53935",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  filterChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  filterChipText: {
    fontSize: 13,
    color: "#555",
    marginRight: 6,
  },
  clearChip: {
    backgroundColor: "#E0E0E0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  clearChipText: {
    fontSize: 13,
    color: "#555",
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  cardImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  organizationName: {
    fontSize: 13,
    color: "#666",
    marginBottom: 2,
  },
  campName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#555",
  },
  expandedContent: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    marginTop: 16,
  },
  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 16,
  },
  map: {
    width: "100%",
    height: 200,
    marginVertical: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  cardActions: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  actionButtonText: {
    fontSize: 14,
    color: "#555",
  },
  actionButtons: {
    flexDirection: "row",
  },
  websiteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3F51B5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  registerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF9800",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 16,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "500",
    marginLeft: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#777",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationModal: {
    backgroundColor: "#FFF",
    width: "90%",
    maxHeight: "80%",
    borderRadius: 12,
    overflow: "hidden",
  },
  filterModal: {
    backgroundColor: "#FFF",
    width: "90%",
    borderRadius: 12,
    padding: 16,
    maxHeight: "80%",
  },
  formModal: {
    backgroundColor: "#FFF",
    width: "90%",
    borderRadius: 12,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  datePickerText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#555",
  },
  locationOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  locationOption: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedLocation: {
    backgroundColor: "#3F51B5",
  },
  locationOptionText: {
    fontSize: 14,
    color: "#555",
  },
  selectedLocationText: {
    color: "#FFF",
  },
  filterActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  clearFiltersButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  clearFiltersText: {
    color: "#555",
    fontWeight: "500",
  },
  applyFiltersButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: "#3F51B5",
    alignItems: "center",
    justifyContent: "center",
  },
  applyFiltersText: {
    color: "#FFF",
    fontWeight: "500",
  },
  notificationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  notificationCampName: {
    fontSize: 13,
    color: "#555",
    marginBottom: 4,
  },
  notificationDate: {
    fontSize: 12,
    color: "#888",
  },
  emptyNotifications: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyNotificationsText: {
    fontSize: 16,
    color: "#888",
    marginTop: 16,
    textAlign: "center",
  },
  optionsMenu: {
    position: "absolute",
    right: 0,
    top: 40,
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  optionText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 8,
  },
  modalContent: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 16,
    color: "#333",
  },
  textArea: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 16,
    height: 120,
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  submitButtonText: {
    color: "#FFF",
    fontWeight: "500",
    fontSize: 16,
  }
});

export default HomeScreen;