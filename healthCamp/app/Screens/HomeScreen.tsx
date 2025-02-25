import React, { useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Linking, Share } from "react-native";
import { useRouter } from "expo-router";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

interface Post {
  id: string;
  image: string;
  name: string;
  description: string;
  location: string;
  date: string;
  time: string;
  registrationLink: string;
}

const HomeScreen = () => {
  const router = useRouter();
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [posts] = useState<Post[]>([
    {
      id: "1",
      image: "https://www.sulabhpublicschool.com/wp-content/uploads/2024/09/health.jpeg",
      name: "Free Health Camp",
      description: "A general health camp with all facilities.",
      location: "Erode",
      date: "March 10, 2025",
      time: "10:00 AM - 4:00 PM",
      registrationLink: "https://forms.gle/4apaNRXBRzUdx9LXA",
    },
    {
      id: "2",
      image: "https://vethathirigramam.org/wp-content/uploads/2019/03/001.png",
      name: "Free Health Camp",
      description: "A general health camp with all facilities.",
      location: "Tirupur",
      date: "March 15, 2025",
      time: "9:00 AM - 3:00 PM",
      registrationLink: "https://forms.gle/4apaNRXBRzUdx9LXA",
    },
  ]);

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

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <Image source={{ uri: item.image }} style={styles.postImage} />
            <Text style={styles.postText}> {item.name}</Text>
            <Text style={styles.postText}>📝 {item.description}</Text>
            <Text style={styles.postLocation}>📍 {item.location}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => toggleLike(item.id)}>
                <AntDesign name={likedPosts[item.id] ? "heart" : "hearto"} size={20} color={likedPosts[item.id] ? "red" : "gray"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleShare(item.registrationLink)}>
                <FontAwesome name="share" size={20} color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => handleRegister(item.registrationLink)} style={styles.registerButton}>
                <Text style={styles.registerButtonText}>Register</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.viewButton} 
                onPress={() => router.push({
                  pathname: "/camp-details",
                  params: {
                    campName: item.name,
                    image: item.image,
                    location: item.location,
                    doctorName: "Dr. John Doe",
                    doctorDetails: "Cardiologist, 10+ years of experience",
                    medicalFacilities: JSON.stringify([
                      "Blood Pressure Check", 
                      "Diabetes Screening", 
                      "Eye Test"
                    ]),
                  }
                })}
              >
                <Text style={styles.viewButtonText}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  postContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    elevation: 3,
    width: "45%", // Increased width for better spacing
    alignSelf: "center",
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  postText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 3,
  },
  postLocation: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 6,
  },
  registerButton: {
    backgroundColor: "#28A745",
    paddingVertical: 6,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
  },
  registerButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFF",
  },
  viewButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 6,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginLeft: 5,
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    alignItems: "center",
    color: "#FFF",
  },
});
