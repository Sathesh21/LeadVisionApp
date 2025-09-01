import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, SafeAreaView } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";
import Header from "../components/Header/Header";
import { getNextNotificationLead } from "../data/notificationLeads";
import FirebaseMessagingService from "../services/firebaseMessaging";
import PushNotificationService from "../services/pushNotificationService";

const DashboardScreen = ({ navigation }) => {
  const { themeStyles } = useContext(ThemeContext);

  useEffect(() => {
    FirebaseMessagingService.setNavigationHandler((screen, params) => {
      navigation.navigate(screen, params);
    });
    
    PushNotificationService.setNavigationHandler((screen, params) => {
      navigation.navigate(screen, params);
    });
    
    FirebaseMessagingService.initialize();

    const timer = setTimeout(() => {
      const mockLead = getNextNotificationLead();
      FirebaseMessagingService.sendTestNotification(mockLead);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [navigation]);
  
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeStyles.background }]}>
      <Header navigation={navigation} title="Dashboard" onSettingsPress={() => navigation.navigate("Settings")} />
      <ScrollView 
        style={[styles.scrollView, { backgroundColor: themeStyles.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: themeStyles.text }]}>
          🚀 LeadVision Tasks
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
            description: "Full-page notification display with Accept/Reject buttons and lead details navigation",
            screen: "PushNotificationDemo" 
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
          style={[styles.button, { backgroundColor: themeStyles.primary, marginTop: 20 }]}
          onPress={() => {
            const mockLead = getNextNotificationLead();
            console.log('Test button pressed, sending notification...');
            FirebaseMessagingService.sendTestNotification(mockLead);
          }}
        >
          <Text style={[styles.buttonText, { color: '#fff' }]}>
            🔔 Test Push Notification
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#F44336', marginTop: 10, marginBottom: 20 }]}
          onPress={() => navigation.navigate('DeclinedLeads')}
        >
          <Text style={[styles.buttonText, { color: '#fff' }]}>
            📋 View Declined Leads
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
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
