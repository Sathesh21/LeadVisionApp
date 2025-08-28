// src/screens/DashboardScreen.js
import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";
import Header from "../components/Header/Header";

const DashboardScreen = ({ navigation }) => {
  const { themeStyles } = useContext(ThemeContext);

  // Simulate push notification after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      const mockLead = {
        name: 'Rajesh Kumar',
        location: 'T. Nagar, Chennai, Tamil Nadu',
        matchScorePercent: 94,
        image: 'https://via.placeholder.com/150'
      };
      
      Alert.alert(
        'New Lead Alert!',
        `High-priority lead: ${mockLead.name} (${mockLead.matchScorePercent}% match)`,
        [
          { text: 'Dismiss', style: 'cancel' },
          { 
            text: 'View Full Screen', 
            onPress: () => navigation.navigate('Notification', { lead: mockLead })
          }
        ]
      );
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);
  return (
    <>
      <Header navigation={navigation} title="Dashboard" onSettingsPress={() => navigation.navigate("Settings")} />
      <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
        <Text style={[styles.title, { color: themeStyles.text }]}>
          Select a Task
        </Text>
        {[
          { 
            title: "Task 1: OCR Capture & Validation", 
            description: "Upload/capture ID card image, extract text with OCR, show confidence scores, edit and save data",
            screen: "OCR" 
          },
          { 
            title: "Task 2: AI Result Display (Chat Style)", 
            description: "Chat interface with lead queries, mock API calls, styled lead cards with match scores",
            screen: "Chat" 
          },
          { 
            title: "Task 3: Full-Screen Notification Flow", 
            description: "Simulate push notifications, full-page display, Accept/Reject buttons, lead details navigation",
            screen: "Notification" 
          },
          { 
            title: "Task 4: Location Fetch with Battery Optimization", 
            description: "Live location tracking, 2-minute updates, map view, nearest lead assignment from dataset",
            screen: "Location" 
          },
          { 
            title: "Task 5: Lead Allocation Dashboard", 
            description: "Lead list with distance/scores, sort controls, filter >70% matches, highlight best match",
            screen: "LeadAllocation" 
          },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.taskCard, { backgroundColor: themeStyles.card || '#f5f5f5' }]}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={[styles.taskTitle, { color: themeStyles.primary }]}>
              {item.title}
            </Text>
            <Text style={[styles.taskDescription, { color: themeStyles.textSecondary || '#666' }]}>
              {item.description}
            </Text>
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FF6B35', marginTop: 20 }]}
          onPress={() => {
            const mockLead = {
              name: 'Priya Sharma',
              location: 'Anna Nagar, Chennai, Tamil Nadu',
              matchScorePercent: 88
            };
            navigation.navigate('Notification', { lead: mockLead });
          }}
        >
          <Text style={[styles.buttonText, { color: '#fff' }]}>
            🔔 Simulate Push Notification
          </Text>
        </TouchableOpacity>
      </View>
    </>

  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, marginBottom: 20, textAlign: "center", fontWeight: 'bold' },
  taskCard: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  taskTitle: { 
    fontSize: 16, 
    fontWeight: "bold",
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: "center",
  },
  buttonText: { fontSize: 16, fontWeight: "bold" },
});

export default DashboardScreen;
