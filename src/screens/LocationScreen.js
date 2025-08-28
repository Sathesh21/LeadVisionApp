import React, { useContext, useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, AppState, Platform } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";
import Header from "../components/Header/Header";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import BackgroundTimer from "react-native-background-timer";
import Toast from "../components/Toast/Toast";
import { useToast } from "../hooks/useToast";

// Mock leads dataset with coordinates
const MOCK_LEADS = [
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
  const [lastUpdate, setLastUpdate] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const intervalRef = useRef(null);
  const appState = useRef(AppState.currentState);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    requestLocationPermission();
    
    const handleAppStateChange = (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App came to foreground - resume normal tracking
        if (isTracking) startLocationTracking(120000); // 2 minutes
      } else if (nextAppState.match(/inactive|background/)) {
        // App went to background - reduce frequency
        if (isTracking) startLocationTracking(300000); // 5 minutes
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription?.remove();
      stopLocationTracking();
    };
  }, [isTracking]);

  const requestLocationPermission = async () => {
    try {
      const permission = Platform.OS === 'ios' 
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE 
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      
      const result = await request(permission);
      if (result === RESULTS.GRANTED) {
        setHasLocationPermission(true);
        getCurrentLocation();
      } else {
        setHasLocationPermission(false);
        showToast('Location permission is required for this feature', 'error');
      }
    } catch (error) {
      console.error('Permission error:', error);
      showToast('Failed to request location permission', 'error');
    }
  };

  const getCurrentLocation = () => {
    if (!hasLocationPermission) {
      showToast('Location permission not granted', 'error');
      return;
    }

    try {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { latitude, longitude };
          setUserLocation(newLocation);
          setLastUpdate(new Date());
          findNearestLead(newLocation);
          showToast('Location updated successfully', 'success');
        },
        (error) => {
          console.error('Location error:', error);
          let errorMessage = 'Unable to get location';
          switch (error.code) {
            case 1:
              errorMessage = 'Location permission denied';
              break;
            case 2:
              errorMessage = 'Location unavailable';
              break;
            case 3:
              errorMessage = 'Location request timeout';
              break;
            default:
              errorMessage = error.message || 'Unknown location error';
          }
          showToast(errorMessage, 'error');
        },
        { 
          enableHighAccuracy: true, 
          timeout: 15000, 
          maximumAge: 10000,
          distanceFilter: 10
        }
      );
    } catch (error) {
      console.error('Geolocation error:', error);
      showToast('Location service unavailable', 'error');
    }
  };

  const startLocationTracking = (interval = 120000) => { // Default 2 minutes
    if (!hasLocationPermission) {
      showToast('Location permission required to start tracking', 'error');
      return;
    }

    if (intervalRef.current) {
      BackgroundTimer.clearInterval(intervalRef.current);
    }
    
    intervalRef.current = BackgroundTimer.setInterval(() => {
      getCurrentLocation();
    }, interval);
    
    setIsTracking(true);
    showToast('Location tracking started', 'success');
  };

  const stopLocationTracking = () => {
    if (intervalRef.current) {
      BackgroundTimer.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsTracking(false);
    showToast('Location tracking stopped', 'info');
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const findNearestLead = (location) => {
    let nearest = null;
    let minDistance = Infinity;

    MOCK_LEADS.forEach(lead => {
      const distance = calculateDistance(
        location.latitude, location.longitude,
        lead.latitude, lead.longitude
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearest = { ...lead, distance: distance.toFixed(2) };
      }
    });

    setNearestLead(nearest);
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <Header title="Task 4: Location Fetch" navigation={navigation} />
      
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isTracking ? '#F44336' : '#4CAF50' }]}
          onPress={isTracking ? stopLocationTracking : () => startLocationTracking()}
        >
          <Text style={styles.buttonText}>
            {isTracking ? 'Stop Tracking' : 'Start Tracking'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#2196F3' }]}
          onPress={getCurrentLocation}
        >
          <Text style={styles.buttonText}>Update Location</Text>
        </TouchableOpacity>
      </View>

      {userLocation && (
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
          
          {MOCK_LEADS.map(lead => (
            <Marker
              key={lead.id}
              coordinate={{ latitude: lead.latitude, longitude: lead.longitude }}
              title={lead.name}
              description={`Match Score: ${lead.matchScore}%`}
              pinColor={lead.id === nearestLead?.id ? "red" : "green"}
            />
          ))}
        </MapView>
      )}

      <View style={[styles.infoPanel, { backgroundColor: themeStyles.card }]}>
        <Text style={[styles.infoTitle, { color: themeStyles.text }]}>Location Info</Text>
        
        {userLocation ? (
          <Text style={[styles.infoText, { color: themeStyles.textSecondary }]}>
            Lat: {userLocation.latitude.toFixed(6)}, Lng: {userLocation.longitude.toFixed(6)}
          </Text>
        ) : (
          <Text style={[styles.infoText, { color: themeStyles.textSecondary }]}>No location data</Text>
        )}
        
        {lastUpdate && (
          <Text style={[styles.infoText, { color: themeStyles.textSecondary }]}>
            Last Update: {lastUpdate.toLocaleTimeString()}
          </Text>
        )}
        
        {nearestLead && (
          <View style={styles.leadInfo}>
            <Text style={[styles.leadTitle, { color: themeStyles.text }]}>Nearest Lead:</Text>
            <Text style={[styles.leadName, { color: themeStyles.text }]}>{nearestLead.name}</Text>
            <Text style={[styles.leadDistance, { color: themeStyles.textSecondary }]}>
              Distance: {nearestLead.distance} km
            </Text>
            <Text style={[styles.leadScore, { color: '#4CAF50' }]}>
              Match Score: {nearestLead.matchScore}%
            </Text>
          </View>
        )}
        
        <Text style={[styles.trackingStatus, { color: isTracking ? '#4CAF50' : '#F44336' }]}>
          Tracking: {isTracking ? 'Active' : 'Inactive'}
        </Text>
      </View>
      
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
        onHide={hideToast}
      />
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  map: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
  },
  infoPanel: {
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
  },
  leadInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 8,
  },
  leadTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  leadName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  leadDistance: {
    fontSize: 14,
  },
  leadScore: {
    fontSize: 14,
    fontWeight: '600',
  },
  trackingStatus: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default LocationScreen;
