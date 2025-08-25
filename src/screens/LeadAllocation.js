import React, { useContext, useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";
import Header from "../components/Header/Header";
import { SPACING, FONT_SIZE, BORDER_RADIUS, BASE_COLORS } from "../constants/colors";

// Dummy leads with coordinates (latitude & longitude)
const dummyLeads = [
  { id: "1", name: "Edwin Graham", matchScore: 85, latitude: 12.9716, longitude: 77.5946 },
  { id: "2", name: "Rochelle Schamberger", matchScore: 70, latitude: 12.2958, longitude: 76.6394 },
  { id: "3", name: "Preston Kohler", matchScore: 92, latitude: 11.0168, longitude: 76.9558 },
  { id: "4", name: "Dr. Amy Stehr", matchScore: 65, latitude: 13.0827, longitude: 80.2707 },
];

// Haversine formula to calculate distance between two lat/lng points
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in km
};

const LeadAllocation = ({ navigation }) => {
  const { themeStyles } = useContext(ThemeContext);
  const [userLocation, setUserLocation] = useState({ latitude: 12.9716, longitude: 77.5946 }); // Bangalore
  const [leads, setLeads] = useState(dummyLeads);
  const [sortBy, setSortBy] = useState("score"); // "score" or "distance"
  const [filterScore, setFilterScore] = useState(false);

  useEffect(() => {
    const updatedLeads = dummyLeads.map((lead) => ({
      ...lead,
      distance: getDistance(
        userLocation.latitude,
        userLocation.longitude,
        lead.latitude,
        lead.longitude
      ),
    }));
    setLeads(updatedLeads);
  }, [userLocation]);

  const sortedLeads = [...leads]
    .filter((lead) => (filterScore ? lead.matchScore > 70 : true))
    .sort((a, b) => (sortBy === "score" ? b.matchScore - a.matchScore : a.distance - b.distance));

  const bestMatch = sortedLeads[0]?.id;

  const LeadCard = ({ lead }) => {
    const isBest = lead.id === bestMatch;
    const distance = lead.distance ?? 0;
     return (
      <View
        style={[
          styles.leadCard,
          {
            backgroundColor: isBest ? "#d1f7c4" : themeStyles.card,
            borderColor: isBest ? "green" : themeStyles.border,
          },
        ]}
      >
        <Text style={[styles.name, { color: themeStyles.text }]}>{lead.name}</Text>
        <Text style={[styles.text, { color: themeStyles.textSecondary }]}>
          Distance: {lead?.distance?.toFixed(2)} km
        </Text>
        <Text style={[styles.text, { color: themeStyles.text }]}>
          Match Score: {lead.matchScore}%
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <Header title="Task 5: Lead Allocation" navigation={navigation} />

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setSortBy(sortBy === "score" ? "distance" : "score")}
        >
          <Text style={styles.buttonText}>Sort by: {sortBy}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setFilterScore(!filterScore)}
        >
          <Text style={styles.buttonText}>
            {filterScore ? "Show All" : "Filter >70%"}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedLeads}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <LeadCard lead={item} />}
        contentContainerStyle={{ padding: SPACING.md }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  controls: { flexDirection: "row", justifyContent: "space-between", padding: SPACING.md },
  button: { backgroundColor: BASE_COLORS.blue, padding: SPACING.sm, borderRadius: BORDER_RADIUS.sm },
  buttonText: { color: "#fff", fontWeight: "600" },
  leadCard: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    marginBottom: SPACING.sm,
  },
  name: { fontWeight: "bold", fontSize: FONT_SIZE.md },
  text: { fontSize: FONT_SIZE.sm },
});

export default LeadAllocation;
