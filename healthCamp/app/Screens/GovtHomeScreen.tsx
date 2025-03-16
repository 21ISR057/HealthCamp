import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
  ActivityIndicator,
  Alert,
  TextInput,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import Navbar from "../../components/Navbar";
import { db } from "../../constants/firebase";
import { collection, getDocs } from "firebase/firestore";

interface GovtCamp {
  id: string;
  Area_staff_involved: string;
  Camp_Day: string;
  Camp_Site: string;
  Distance_to_be_covered: number;
  Name_of_Villages: string;
  Population_to_be_covered: number;
  Session_Time: string;
  Source_PDF: string;
}

const GovtHomeScreen = () => {
  const router = useRouter();
  const [camps, setCamps] = useState<GovtCamp[]>([]);
  const [filteredCamps, setFilteredCamps] = useState<GovtCamp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSessionTime, setSelectedSessionTime] = useState<string>("");
  const [selectedPopulation, setSelectedPopulation] = useState<number | null>(null);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);

  useEffect(() => {
    fetchGovtCamps();
  }, []);

  useEffect(() => {
    filterCamps();
  }, [searchQuery, selectedSessionTime, selectedPopulation, selectedDistance, camps]);

  const fetchGovtCamps = async () => {
    try {
      // Reference to the govtdata collection
      const govtdataRef = collection(db, "govtdata");
      const querySnapshot = await getDocs(govtdataRef);

      let allCamps: GovtCamp[] = [];

      // Iterate through each district document
      querySnapshot.forEach((doc) => {
        const districtData = doc.data();
        console.log("District Data:", districtData); // Debug: Check the structure of districtData

        if (districtData.camps && Array.isArray(districtData.camps)) {
          // Add each camp to the allCamps array
          districtData.camps.forEach((camp: any) => {
            console.log("Camp Data:", camp); // Debug: Check the structure of each camp

            allCamps.push({
              id: camp.id || doc.id, // Use camp ID or district ID as fallback
              Area_staff_involved: camp["Area Staff to be involved"] || "N/A",
              Camp_Day: camp["CAMP DAY"] || "N/A",
              Camp_Site: camp["Camp Site"] || "N/A",
              Distance_to_be_covered: parseFloat(camp["Distance of the Villages covered from the Camp site"]) || 0,
              Name_of_Villages: camp["Name of the Village to be covered"] || "N/A",
              Population_to_be_covered: parseInt(camp["Population to be covered"]) || 0,
              Session_Time: camp["FN / AN"] || "N/A",
              Source_PDF: "N/A", // Add this field if it exists in Firestore
            });
          });
        }
      });

      // Remove duplicates based on the `id` field
      const uniqueCamps = Array.from(new Set(allCamps.map((camp) => camp.id)))
        .map((id) => allCamps.find((camp) => camp.id === id))
        .filter((camp): camp is GovtCamp => camp !== undefined); // Ensure no undefined values

      console.log("Unique Camps:", uniqueCamps); // Debug: Check final camps array

      setCamps(uniqueCamps);
      setFilteredCamps(uniqueCamps);
      setError(null);
    } catch (error) {
      console.error("Error fetching government camps:", error);
      setError("Failed to fetch government camps. Please try again later.");
      Alert.alert("Error", "Failed to fetch government camps. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filterCamps = () => {
    let filtered = camps;

    // Filter by search query (Camp_Site or Name_of_Villages)
    if (searchQuery) {
      filtered = filtered.filter(
        (camp) =>
          camp.Camp_Site.toLowerCase().includes(searchQuery.toLowerCase()) ||
          camp.Name_of_Villages.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by Session_Time
    if (selectedSessionTime) {
      filtered = filtered.filter((camp) => camp.Session_Time === selectedSessionTime);
    }

    // Filter by Population_to_be_covered
    if (selectedPopulation) {
      filtered = filtered.filter((camp) => camp.Population_to_be_covered >= selectedPopulation);
    }

    // Filter by Distance_to_be_covered
    if (selectedDistance) {
      filtered = filtered.filter((camp) => camp.Distance_to_be_covered <= selectedDistance);
    }

    setFilteredCamps(filtered);
  };

  const getRandomImageUrl = (seed: string) => {
    return `https://picsum.photos/seed/${seed}/300/200`;
  };

  const handleViewPDF = (link: string) => {
    Linking.openURL(link).catch((err) => console.error("Failed to open PDF:", err));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchGovtCamps} style={styles.retryButton}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Navbar />

      {/* Search and Filter UI */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBox}
          placeholder="Search by camp site or village..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Options */}
      <ScrollView horizontal style={styles.filterContainer} contentContainerStyle={styles.filterContentContainer}>
        <TouchableOpacity
          style={[styles.filterButton, selectedSessionTime === "FN" && styles.activeFilterButton]}
          onPress={() => setSelectedSessionTime("FN")}
        >
          <Text style={styles.filterButtonText}>Morning Session</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedSessionTime === "AN" && styles.activeFilterButton]}
          onPress={() => setSelectedSessionTime("AN")}
        >
          <Text style={styles.filterButtonText}>Afternoon Session</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedPopulation === 1000 && styles.activeFilterButton]}
          onPress={() => setSelectedPopulation(1000)}
        >
          <Text style={styles.filterButtonText}>Population ≥ 1000</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {
            setSelectedSessionTime("");
            setSelectedPopulation(null);
            setSelectedDistance(null);
          }}
        >
          <Text style={styles.filterButtonText}>Clear Filters</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Camp List */}
      <FlatList
        data={filteredCamps}
        keyExtractor={(item) => item.id} // Ensure `item.id` is unique
        renderItem={({ item }) => (
          <View style={styles.campItem}>
            <Image
              source={{ uri: getRandomImageUrl(item.Camp_Site) }}
              style={styles.campImage}
            />
            <Text style={styles.campName}>{item.Camp_Site}</Text>
            <Text style={styles.campLocation}>Village: {item.Name_of_Villages}</Text>
            <Text style={styles.campDate}>Camp Day: {item.Camp_Day}</Text>
            <Text style={styles.campTime}>Session Time: {item.Session_Time}</Text>
            <Text style={styles.campDetails}>
              Population to be Covered: {item.Population_to_be_covered}
            </Text>
          
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E8F5E9",
  },
  searchContainer: {
    marginBottom: 10,
  },
  searchBox: {
    borderWidth: 1,
    borderColor: "#2E7D32",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#FFF",
  },
  filterContainer: {
    marginBottom: 20,
    height: 50, // Set a fixed height for the filter container
  },
  filterContentContainer: {
    alignItems: "center", // Center buttons vertically
    paddingHorizontal: 10, // Add horizontal padding
  },
  filterButton: {
    backgroundColor: "#2E7D32",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    justifyContent: "center", // Center text vertically
    alignItems: "center", // Center text horizontally
  },
  activeFilterButton: {
    backgroundColor: "#1B5E20",
  },
  filterButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14, // Adjust font size if needed
  },
  campItem: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    elevation: 2,
  },
  campImage: {
    width: "100%",
    height: 150,
    borderRadius: 5,
    marginBottom: 10,
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
  campDetails: {
    fontSize: 14,
    color: "#2E7D32",
    marginTop: 5,
  },
  pdfButton: {
    backgroundColor: "#2E7D32",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#2E7D32",
    padding: 10,
    borderRadius: 5,
  },
});




export default GovtHomeScreen;