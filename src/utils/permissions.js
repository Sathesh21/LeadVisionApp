import { PermissionsAndroid, Platform, Alert } from "react-native";

export const requestPermissions = async (forCamera = false, forGallery = false) => {
  if (Platform.OS !== "android") return true;

  try {
    // Camera permission
    if (forCamera) {
      const cameraGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permission",
          message: "This app needs access to your camera",
          buttonPositive: "OK",
        }
      );

      if (cameraGranted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert("Permission required", "Camera access is required.");
        return false;
      }
    }

    // Gallery permission
    if (forGallery && Platform.Version < 33) {
      const storageGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Storage Permission",
          message: "This app needs access to your photos",
          buttonPositive: "OK",
        }
      );

      if (storageGranted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert("Permission required", "Storage access is required.");
        return false;
      }
    }

    // On Android 13+, no storage permission needed for picker
    return true;

  } catch (err) {
    console.warn("Permission error:", err);
    return false;
  }
};
