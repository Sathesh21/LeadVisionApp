import React, { useContext, useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";
import Header from "../components/Header/Header";
import { SPACING, FONT_SIZE, BORDER_RADIUS, BASE_COLORS } from "../constants/colors";

// Enhanced leads dataset with more details
const dummyLeads = [
  { id: "1", name: "Rajesh Kumar", matchScore: 85, latitude: 13.0827, longitude: 80.2707, company: "Chennai Tech Solutions", status: "hot" },
  { id: "2", name: "Priya Sharma", matchScore: 70, latitude: 13.0850, longitude: 80.2101, company: "Madras Marketing Pro", status: "warm" },
  { id: "3", name: "Arjun Krishnan", matchScore: 92, latitude: 12.9750, longitude: 80.2200, company: "Tamil Finance Corp", status: "hot" },
  { id: "4", name: "Meera Devi", matchScore: 65, latitude: 13.0067, longitude: 80.2206, company: "Chennai Healthcare Plus", status: "cold" },
  { id: "5", name: "Suresh Babu", matchScore: 88, latitude: 12.9249, longitude: 80.1000, company: "Chennai Real Estate Pro", status: "hot" },
  { id: "6", name: "Lakshmi Narayanan", matchScore: 75, latitude: 13.0878, longitude: 80.2785, company: "Mylapore Consulting Inc", status: "warm" },
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
  const [userLocation, setUserLocation] = useState({ latitude: 13.0827, longitude: 80.2707 }); // Chennai
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
    const isHighScore = lead.matchScore > 80;
    
    return (
      <View
        style={[
          styles.leadCard,
          {
            backgroundColor: isBest ? "#d1f7c4" : isHighScore ? "#e8f5e8" : themeStyles.card,
            borderColor: isBest ? "#4CAF50" : isHighScore ? "#81C784" : themeStyles.border,
            borderWidth: isBest ? 3 : 1,
          },
        ]}
      >
        {isBest && (
          <View style={styles.bestMatchBadge}>
            <Text style={styles.bestMatchText}>🏆 BEST MATCH</Text>
          </View>
        )}
        
        <Text style={[styles.name, { color: themeStyles.text }]}>{lead.name}</Text>
        <Text style={[styles.company, { color: themeStyles.textSecondary }]}>{lead.company}</Text>
        <Text style={[styles.text, { color: themeStyles.textSecondary }]}>
          Distance: {lead?.distance?.toFixed(2)} km
        </Text>
        <Text style={[styles.text, { color: isHighScore ? '#4CAF50' : themeStyles.text, fontWeight: isHighScore ? '600' : 'normal' }]}>
          Match Score: {lead.matchScore}%
        </Text>
        
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(lead.status) }]}>
          <Text style={styles.statusText}>{lead.status.toUpperCase()}</Text>
        </View>
      </View>
    );
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'hot': return '#FF5722';
      case 'warm': return '#FF9800';
      case 'cold': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <Header title="Task 5: Lead Allocation" navigation={navigation} />

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: sortBy === 'score' ? '#4CAF50' : BASE_COLORS.blue }]}
          onPress={() => setSortBy(sortBy === "score" ? "distance" : "score")}
        >
          <Text style={styles.buttonText}>Sort: {sortBy === 'score' ? '📊 Score' : '📍 Distance'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: filterScore ? '#FF9800' : BASE_COLORS.blue }]}
          onPress={() => setFilterScore(!filterScore)}
        >
          <Text style={styles.buttonText}>
            {filterScore ? "Show All" : "Filter >70%"}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsContainer}>
        <Text style={[styles.statsText, { color: themeStyles.text }]}>
          Showing {sortedLeads.length} of {leads.length} leads
        </Text>
        {bestMatch && (
          <Text style={[styles.bestMatchInfo, { color: '#4CAF50' }]}>
            Best Match: {sortedLeads.find(l => l.id === bestMatch)?.name}
          </Text>
        )}
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
  button: { padding: SPACING.sm, borderRadius: BORDER_RADIUS.sm, minWidth: 120 },
  buttonText: { color: "#fff", fontWeight: "600", textAlign: 'center' },
  statsContainer: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm },
  statsText: { fontSize: FONT_SIZE.sm, textAlign: 'center' },
  bestMatchInfo: { fontSize: FONT_SIZE.sm, textAlign: 'center', fontWeight: '600', marginTop: 4 },
  leadCard: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.sm,
    position: 'relative',
  },
  bestMatchBadge: {
    position: 'absolute',
    top: -8,
    right: 8,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  bestMatchText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  name: { fontWeight: "bold", fontSize: FONT_SIZE.md, marginBottom: 4 },
  company: { fontSize: FONT_SIZE.sm, fontStyle: 'italic', marginBottom: 4 },
  text: { fontSize: FONT_SIZE.sm, marginBottom: 2 },
  statusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default LeadAllocation;
