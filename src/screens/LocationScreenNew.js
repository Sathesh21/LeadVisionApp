import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, PermissionsAndroid } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { ThemeContext } from '../theme/ThemeContext';
import Header from '../components/Header/Header';

const LEADS = [
  { id: '1', name: 'Rajesh Kumar', latitude: 13.0827, longitude: 80.2707, matchScore: 95 },
  { id: '2', name: 'Priya Sharma', latitude: 13.0850, longitude: 80.2101, matchScore: 87 },
  { id: '3', name: 'Arjun Krishnan', latitude: 12.9750, longitude: 80.2200, matchScore: 78 },
  { id: '4', name: 'Meera Devi', latitude: 13.0067, longitude: 80.2206, matchScore: 92 },
];

const LocationScreen = ({ navigation }) => {
  const { themeStyles } = useContext(ThemeContext);
  const [userLocation, setUserLocation] = useState(null);
  const [nearestLead, setNearestLead] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const requestPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      return false;
    }
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Location permission is required');
      return;
    }

    // Use native geolocation API
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        findNearestLead(latitude, longitude);
      },
      (error) => {
        console.log('Geolocation error:', error);
        // Fallback to mock location for demo
        const mockLat = 13.0827 + (Math.random() - 0.5) * 0.02;
        const mockLng = 80.2707 + (Math.random() - 0.5) * 0.02;
        setUserLocation({ latitude: mockLat, longitude: mockLng });
        findNearestLead(mockLat, mockLng);
        Alert.alert('Demo Mode', 'Using simulated location near Chennai');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const findNearestLead = (userLat, userLng) => {
    let nearest = null;
    let minDistance = Infinity;

    LEADS.forEach(lead => {
      const distance = calculateDistance(userLat, userLng, lead.latitude, lead.longitude);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = { ...lead, distance: distance.toFixed(2) };
      }
    });

    setNearestLead(nearest);
  };

  const startTracking = () => {
    setIsTracking(true);
    getCurrentLocation();
    
    const id = setInterval(() => {
      getCurrentLocation();
    }, 120000); // 2 minutes
    
    setIntervalId(id);
  };

  const stopTracking = () => {
    setIsTracking(false);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  useEffect(() => {
    getCurrentLocation();
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <Header title="Task 4: Location Fetch" navigation={navigation} />
      
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isTracking ? '#F44336' : '#4CAF50' }]}
          onPress={isTracking ? stopTracking : startTracking}
        >
          <Text style={styles.buttonText}>
            {isTracking ? '⏹️ Stop' : '▶️ Start'} Tracking
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#2196F3' }]}
          onPress={getCurrentLocation}
        >
          <Text style={styles.buttonText}>🔄 Update</Text>
        </TouchableOpacity>
      </View>

      {userLocation && (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            <Marker
              coordinate={userLocation}
              title="Your Location"
              pinColor="blue"
            />
            {LEADS.map(lead => (
              <Marker
                key={lead.id}
                coordinate={{ latitude: lead.latitude, longitude: lead.longitude }}
                title={lead.name}
                description={`Match: ${lead.matchScore}%`}
                pinColor={lead.id === nearestLead?.id ? "red" : "green"}
              />
            ))}
          </MapView>
        </View>
      )}

      {nearestLead && (
        <View style={[styles.info, { backgroundColor: themeStyles.card }]}>
          <Text style={[styles.title, { color: themeStyles.text }]}>Nearest Lead:</Text>
          <Text style={[styles.name, { color: themeStyles.text }]}>{nearestLead.name}</Text>
          <Text style={[styles.details, { color: themeStyles.textSecondary }]}>
            Distance: {nearestLead.distance} km | Match: {nearestLead.matchScore}%
          </Text>
          <Text style={[styles.status, { color: isTracking ? '#4CAF50' : '#F44336' }]}>
            Status: {isTracking ? 'Tracking (2min updates)' : 'Not tracking'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  info: {
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LocationScreen;