# Firebase Push Notification Setup

## 1. Install Firebase
```bash
npm install @react-native-firebase/app @react-native-firebase/messaging
```

## 2. Android Configuration
- Add `google-services.json` to `android/app/`
- Update `android/build.gradle` and `android/app/build.gradle`

## 3. Replace Mock Service
```javascript
import messaging from '@react-native-firebase/messaging';

class FirebaseMessagingService {
  async initialize() {
    await messaging().requestPermission();
    
    // Background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      this.handleNotification(remoteMessage);
    });
    
    // Foreground handler
    messaging().onMessage(async remoteMessage => {
      this.handleNotification(remoteMessage);
    });
  }
  
  handleNotification(remoteMessage) {
    const { data } = remoteMessage;
    if (data?.leadData) {
      const lead = JSON.parse(data.leadData);
      // Navigate to full-screen notification
      this.navigationHandler('Notification', { lead });
    }
  }
}
```

## 4. Full-Screen Display Process
- Firebase receives push notification
- App processes notification data
- Navigates to `NotificationScreen` component
- Shows full-screen lead details with Accept/Reject buttons