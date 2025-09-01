import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { ThemeContext } from '../theme/ThemeContext';
import Header from '../components/Header/Header';


import { NOTIFICATION_LEADS } from '../data/notificationLeads';

const LEADS = NOTIFICATION_LEADS.map(lead => ({
  id: lead.id,
  name: lead.name,
  latitude: lead.latitude,
  longitude: lead.longitude,
  matchScore: lead.matchScorePercent
}));

const LocationScreen = ({ navigation }) => {
  const { themeStyles } = useContext(ThemeContext);
  const [userLocation, setUserLocation] = useState(null);
  const [locationHistory, setLocationHistory] = useState([]);
  const [nearestLead, setNearestLead] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [intervalId, setIntervalId] = useState(null);

  const getCurrentLocation = async () => {
    const chennaiLocations = [
      { lat: 13.0827, lng: 80.2707, area: 'T. Nagar, Chennai' },
      { lat: 13.0850, lng: 80.2101, area: 'Anna Nagar, Chennai' },
      { lat: 13.0067, lng: 80.2206, area: 'Adyar, Chennai' },
      { lat: 12.9756, lng: 80.2207, area: 'Velachery, Chennai' },
      { lat: 13.0339, lng: 80.2619, area: 'Mylapore, Chennai' },
      { lat: 12.9249, lng: 80.1000, area: 'Tambaram, Chennai' }
    ];
    
    const randomLocation = chennaiLocations[Math.floor(Math.random() * chennaiLocations.length)];
    
    const locationData = {
      latitude: randomLocation.lat,
      longitude: randomLocation.lng,
      accuracy: 100,
      timestamp: new Date(),
      area: randomLocation.area
    };
    
    setUserLocation(locationData);
    setLastUpdate(new Date());
    setLocationName(randomLocation.area);
    
    setLocationHistory(prev => {
      const newHistory = [locationData, ...prev].slice(0, 5);
      return newHistory;
    });
    
    findNearestLead(locationData.latitude, locationData.longitude);
  };

  const startTracking = async () => {
    setIsTracking(true);
    getCurrentLocation();
    
    // Simulate tracking with Chennai coordinates
    setIntervalId(setInterval(() => {
      if (isTracking) {
        getCurrentLocation();
      }
    }, 2 * 60 * 1000)); // 2 minutes
  };

  const stopTracking = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsTracking(false);
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

  useEffect(() => {
    getCurrentLocation();
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
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
          <Text style={styles.buttonText}>🔄 Update Now</Text>
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
              title="Your Live Location"
              description={locationName || 'Current Location'}
              pinColor="blue"
            />
            {locationHistory.map((location, index) => (
              <Marker
                key={`history-${index}`}
                coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                title={`Previous Location ${index + 1}`}
                description={`${location.area} - ${location.timestamp?.toLocaleTimeString()}`}
                pinColor="orange"
                opacity={0.7 - (index * 0.1)}
              />
            ))}
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
          <Text style={[styles.update, { color: themeStyles.textSecondary }]}>
            Last Update: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
          </Text>
          <Text style={[styles.area, { color: themeStyles.textSecondary }]}>
            Current Area: {locationName || 'Getting location...'}
          </Text>
          <Text style={[styles.history, { color: themeStyles.textSecondary }]}>
            Location History: {locationHistory.length} places visited
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
    marginBottom: 4,
  },
  update: {
    fontSize: 12,
  },
  area: {
    fontSize: 12,
    marginBottom: 2,
  },
  history: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default LocationScreen;