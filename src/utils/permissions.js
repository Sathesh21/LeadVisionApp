import { PermissionsAndroid, Platform } from "react-native";

export const requestLocationPermission = async () => {
  if (Platform.OS !== "android") return true;
  try {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    return false;
  }
};

export const requestPermissions = async (forCamera = false, forGallery = false) => {
  if (Platform.OS !== "android") return true;

  try {
    if (forCamera) {
      const cameraGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      if (cameraGranted !== PermissionsAndroid.RESULTS.GRANTED) return false;
    }

    if (forGallery && Platform.Version < 33) {
      const storageGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
      if (storageGranted !== PermissionsAndroid.RESULTS.GRANTED) return false;
    }

    return true;
  } catch (err) {
    return false;
  }
};
