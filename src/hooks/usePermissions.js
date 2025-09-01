import { useCallback } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

export const requestPermissionDirect = async (type) => {
  if (Platform.OS !== 'android') return true;
  try {
    let permission;
    switch(type) {
      case 'camera': permission = PermissionsAndroid.PERMISSIONS.CAMERA; break;
      case 'location': permission = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION; break;
      case 'storage': permission = Platform.Version >= 33 ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE; break;
      default: return false;
    }
    const result = await PermissionsAndroid.request(permission);
    return result === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    return false;
  }
};

export const usePermissions = () => {
  const requestCameraPermission = useCallback(async () => {
    return await requestPermissionDirect('camera');
  }, []);

  const requestLocationPermission = useCallback(async () => {
    return await requestPermissionDirect('location');
  }, []);

  const requestStoragePermission = useCallback(async () => {
    return await requestPermissionDirect('storage');
  }, []);

  return {
    requestCameraPermission,
    requestLocationPermission,
    requestStoragePermission,
  };
};