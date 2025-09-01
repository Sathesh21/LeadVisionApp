import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';

class LocationService {
  constructor() {
    this.watchId = null;
    this.isTracking = false;
  }

  async requestLocationPermission() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to location for lead tracking',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.log('Permission error:', err);
        return false;
      }
    }
    return true;
  }

  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      try {
        Geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: new Date(position.timestamp),
            });
          },
          (error) => {
            // Fallback to Chennai coordinates if location fails
            resolve({
              latitude: 13.0827,
              longitude: 80.2707,
              accuracy: 100,
              timestamp: new Date(),
            });
          },
          {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 60000,
          }
        );
      } catch (error) {
        // Fallback to Chennai coordinates
        resolve({
          latitude: 13.0827,
          longitude: 80.2707,
          accuracy: 100,
          timestamp: new Date(),
        });
      }
    });
  }

  async startTracking(callback, intervalMinutes = 2) {
    if (this.isTracking) {
      this.stopTracking();
    }

    this.isTracking = true;
    
    // Get initial position
    const position = await this.getCurrentPosition();
    callback(position);

    // Set up interval tracking
    this.watchId = setInterval(async () => {
      if (this.isTracking) {
        const position = await this.getCurrentPosition();
        callback(position);
      }
    }, intervalMinutes * 60 * 1000);

    return true;
  }

  stopTracking() {
    console.log('Stopping location tracking...');
    if (this.watchId) {
      clearInterval(this.watchId);
      this.watchId = null;
    }
    this.isTracking = false;
  }

  async reverseGeocode(latitude, longitude) {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await response.json();
      return data.locality || data.city || data.principalSubdivision || 'Unknown Location';
    } catch (error) {
      console.log('Reverse geocoding error:', error);
      return 'Unknown Location';
    }
  }
}

export default new LocationService();