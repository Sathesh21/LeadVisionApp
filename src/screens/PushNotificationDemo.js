import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';
import Header from '../components/Header/Header';
import FirebaseMessagingService from '../services/firebaseMessaging';
import { getNextNotificationLead } from '../data/notificationLeads';

const PushNotificationDemo = ({ navigation }) => {
  const { themeStyles } = useContext(ThemeContext);

  const sendTestNotification = () => {
    const mockLead = getNextNotificationLead();
    FirebaseMessagingService.sendTestNotification(mockLead);
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <Header title="Task 3: Full-Screen Notifications" navigation={navigation} />
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: themeStyles.text }]}>
          🔔 Full-Screen Notification Demo
        </Text>
        
        <Text style={[styles.description, { color: themeStyles.textSecondary }]}>
          This demonstrates full-screen notification flow with Accept/Reject actions.
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: themeStyles.primary }]}
          onPress={sendTestNotification}
        >
          <Text style={styles.buttonText}>Trigger Full-Screen Notification</Text>
        </TouchableOpacity>

        <View style={[styles.infoBox, { backgroundColor: themeStyles.card }]}>
          <Text style={[styles.infoTitle, { color: themeStyles.text }]}>Features:</Text>
          <Text style={[styles.infoText, { color: themeStyles.textSecondary }]}>
            • Full-screen notification display{'\n'}
            • Lead details with match scores{'\n'}
            • Accept/Reject action buttons{'\n'}
            • Navigate to Lead Details on Accept{'\n'}
            • Save declined leads to storage
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoBox: {
    padding: 20,
    borderRadius: 12,
    width: '100%',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default PushNotificationDemo;