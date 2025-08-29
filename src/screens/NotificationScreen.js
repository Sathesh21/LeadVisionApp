import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";
import Header from "../components/Header/Header";
import { validateMatchScore } from "../utils/validation";

const NotificationScreen = ({ navigation, route }) => {
  const { themeStyles } = useContext(ThemeContext);

  const lead = route?.params?.lead || {
    name: "Rajesh Kumar",
    location: "T. Nagar, Chennai, Tamil Nadu",
    matchScorePercent: 92,
  };

  const validMatchScore = validateMatchScore(lead.matchScorePercent);

  const handleAccept = () => {
    // Navigate to Lead Details screen
    navigation.navigate("LeadDetails", { lead });
  };

  const handleReject = () => {
    Alert.alert('Lead Declined', 'Lead has been declined', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <Header title="Task 3: Full Notification" navigation={navigation} />

      <View style={[styles.notificationCard, { backgroundColor: themeStyles.card }]}>
        <View style={styles.header}>
          <Text style={[styles.alertTitle, { color: themeStyles.text }]}>
            🔔 New Lead Alert!
          </Text>
          <Text style={[styles.priority, { 
            color: validMatchScore > 80 ? '#4CAF50' : '#FF9800',
            backgroundColor: validMatchScore > 80 ? '#E8F5E8' : '#FFF3E0'
          }]}>
            {validMatchScore > 80 ? 'HIGH PRIORITY' : 'MEDIUM PRIORITY'}
          </Text>
        </View>

        <Text style={[styles.leadName, { color: themeStyles.text }]}>
          {lead.name}
        </Text>
        <Text style={[styles.leadLocation, { color: themeStyles.textSecondary }]}>
          📍 {lead.location}
        </Text>
        <Text style={[styles.leadScore, { color: validMatchScore > 80 ? "#4CAF50" : "#FF9800" }]}>
          Match Score: {validMatchScore}%
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.acceptButton, { backgroundColor: "#4CAF50" }]}
            onPress={handleAccept}
          >
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.rejectButton, { backgroundColor: "#F44336" }]}
            onPress={handleReject}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  notificationCard: {
    flex: 1,
    margin: 20,
    borderRadius: 16,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  priority: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  leadName: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  leadLocation: { fontSize: 16, marginBottom: 8 },
  leadScore: { fontSize: 16, fontWeight: "600", marginBottom: 20 },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  acceptButton: {
    flex: 0.4,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  rejectButton: {
    flex: 0.4,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});

export default NotificationScreen;
