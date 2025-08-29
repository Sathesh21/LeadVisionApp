import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { usePermissions } from './usePermissions';
import { useToast } from './useToast';

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  
  const intervalRef = useRef(null);
  const appState = useRef(AppState.currentState);
  const { permissions, requestLocationPermission } = usePermissions();
  const { showToast } = useToast();

  const getLocationName = useCallback(async (lat, lng) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      const data = await response.json();
      const area = data.locality || data.city || data.principalSubdivision || 'Unknown Area';
      setLocationName(area);
    } catch (error) {
      console.log('Geocoding error:', error);
      setLocationName('Location Unavailable');
    }
  }, []);

  const getCurrentLocation = useCallback(() => {
    if (!permissions.location) {
      showToast('Location permission required', 'error');
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy: acc } = position.coords;
        
        if (latitude && longitude && !isNaN(latitude) && !isNaN(longitude)) {
          const newLocation = { latitude, longitude };
          setLocation(newLocation);
          setAccuracy(Math.round(acc || 0));
          setLastUpdate(new Date());
          getLocationName(latitude, longitude);
          
          if (!isTracking) {
            showToast(`Location updated (±${Math.round(acc || 0)}m)`, 'success');
          }
        }
      },
      (error) => {
        let message = 'Location error';
        switch (error.code) {
          case 1: message = 'Location permission denied'; break;
          case 2: message = 'Location unavailable'; break;
          case 3: message = 'Location timeout'; break;
          default: message = error.message || 'Unknown location error';
        }
        showToast(message, 'error');
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, [permissions.location, isTracking, showToast, getLocationName]);

  const startTracking = useCallback((interval = 120000) => {
    if (!permissions.location) {
      requestLocationPermission();
      return;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    getCurrentLocation();
    
    intervalRef.current = setInterval(getCurrentLocation, interval);
    setIsTracking(true);
    
    const minutes = interval / 60000;
    showToast(`Tracking started (${minutes}min intervals)`, 'success');
  }, [permissions.location, getCurrentLocation, requestLocationPermission, showToast]);

  const stopTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsTracking(false);
    showToast('Location tracking stopped', 'info');
  }, [showToast]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        if (isTracking) startTracking(120000); // 2 minutes active
      } else if (nextAppState.match(/inactive|background/)) {
        if (isTracking) startTracking(300000); // 5 minutes background
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription?.remove();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTracking, startTracking]);

  return {
    location,
    locationName,
    isTracking,
    lastUpdate,
    accuracy,
    getCurrentLocation,
    startTracking,
    stopTracking,
  };
};