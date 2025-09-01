import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, Animated } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationScreen = ({ navigation, route }) => {
  const [pulseAnim] = useState(new Animated.Value(1));

  const lead = route?.params?.lead || {
    name: "Rajesh Kumar",
    location: "T. Nagar, Chennai, Tamil Nadu",
    matchScorePercent: 92,
  };

  useEffect(() => {
    const pulse = () => {
      Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true })
        .start(() => {
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true })
            .start(() => pulse());
        });
    };
    pulse();
  }, []);

  const handleAccept = () => {
    navigation.navigate("LeadDetails", { lead });
  };

  const handleReject = async () => {
    try {
      const existing = await AsyncStorage.getItem('@declined_leads');
      const declined = existing ? JSON.parse(existing) : [];
      declined.push({ ...lead, declinedAt: new Date().toISOString() });
      await AsyncStorage.setItem('@declined_leads', JSON.stringify(declined));
      navigation.goBack();
    } catch (error) {
      navigation.goBack();
    }
  };

  return (
    <Modal visible={true} presentationStyle="fullScreen">
      <View style={[styles.container, { backgroundColor: lead.matchScorePercent > 80 ? '#1B5E20' : '#E65100' }]}>
        <View style={styles.topSection}>
          <Text style={styles.incomingText}>Incoming Lead</Text>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Text style={styles.alertIcon}>🔔</Text>
          </Animated.View>
        </View>

        <View style={styles.middleSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{lead.name.charAt(0)}</Text>
          </View>
          <Text style={styles.leadName}>{lead.name}</Text>
          <Text style={styles.leadLocation}>{lead.location}</Text>
          <View style={[styles.matchBadge, { backgroundColor: lead.matchScorePercent > 80 ? '#4CAF50' : '#FF9800' }]}>
            <Text style={styles.matchText}>{lead.matchScorePercent}% Match</Text>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <TouchableOpacity onPress={handleReject}>
            <View style={[styles.buttonCircle, { backgroundColor: '#F44336' }]}>
              <Text style={styles.buttonText}>✕</Text>
            </View>
            <Text style={styles.buttonLabel}>Decline</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleAccept}>
            <View style={[styles.buttonCircle, { backgroundColor: '#4CAF50' }]}>
              <Text style={styles.buttonText}>✓</Text>
            </View>
            <Text style={styles.buttonLabel}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  incomingText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginBottom: 20,
  },
  alertIcon: {
    fontSize: 40,
  },
  middleSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  leadName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  leadLocation: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  matchBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  matchText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 60,
    paddingBottom: 60,
  },
  buttonCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NotificationScreen;
