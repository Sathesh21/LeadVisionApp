import { useState, useCallback } from 'react';
import { Platform, Alert, Linking } from 'react-native';
import { request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';

export const usePermissions = () => {
  const [permissions, setPermissions] = useState({
    camera: false,
    location: false,
    storage: false,
  });

  const requestCameraPermission = useCallback(async () => {
    try {
      const permission = Platform.OS === 'ios' 
        ? PERMISSIONS.IOS.CAMERA 
        : PERMISSIONS.ANDROID.CAMERA;
      
      const result = await request(permission);
      const granted = result === RESULTS.GRANTED;
      
      setPermissions(prev => ({ ...prev, camera: granted }));
      
      if (!granted && result === RESULTS.BLOCKED) {
        Alert.alert(
          'Camera Permission Required',
          'Please enable camera access in settings to capture images.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: openSettings }
          ]
        );
      }
      
      return granted;
    } catch (error) {
      console.error('Camera permission error:', error);
      return false;
    }
  }, []);

  const requestLocationPermission = useCallback(async () => {
    try {
      const permission = Platform.OS === 'ios' 
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE 
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      
      const result = await request(permission);
      const granted = result === RESULTS.GRANTED;
      
      setPermissions(prev => ({ ...prev, location: granted }));
      
      if (!granted && result === RESULTS.BLOCKED) {
        Alert.alert(
          'Location Permission Required',
          'Please enable location access in settings for location tracking.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: openSettings }
          ]
        );
      }
      
      return granted;
    } catch (error) {
      console.error('Location permission error:', error);
      return false;
    }
  }, []);

  const requestStoragePermission = useCallback(async () => {
    try {
      if (Platform.OS === 'ios') return true;
      
      const permission = Platform.Version >= 33 
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      
      const result = await request(permission);
      const granted = result === RESULTS.GRANTED;
      
      setPermissions(prev => ({ ...prev, storage: granted }));
      return granted;
    } catch (error) {
      console.error('Storage permission error:', error);
      return false;
    }
  }, []);

  return {
    permissions,
    requestCameraPermission,
    requestLocationPermission,
    requestStoragePermission,
  };
};