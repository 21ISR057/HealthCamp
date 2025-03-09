import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import { saveToGovtData, fetchGovtData, GovtDataType } from "../../constants/firebaseHelpers";

const HomeScreen = () => {
  const [posts, setPosts] = useState<GovtDataType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const storedData = await fetchGovtData(); // Fetch from Firestore
        setPosts(storedData);
      } catch (error) {
        console.error("❌ Error:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="blue" />;
  }

  return (
    <View>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Government Data
      </Text>
      {posts.length > 0 ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id || Math.random().toString()} // Handle missing ID
          renderItem={({ item }) => (
            <View style={{ padding: 10, borderBottomWidth: 1 }}>
              <Text>📌 Title: {item.title}</Text>
              <Text>🏢 Organization: {item.organization}</Text>
              <Text>📍 Location: {item.location}</Text>
              <Text>📅 Day: {item.day}</Text>
            </View>
          )}
        />
      ) : (
        <Text>No data found</Text>
      )}
    </View>
  );
};

export default HomeScreen;
