import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FirebaseMessagingService {
  constructor() {
    this.navigationHandler = null;
    this.configure();
  }

  configure() {
    PushNotification.createChannel({
      channelId: "lead-notifications",
      channelName: "Lead Notifications",
      channelDescription: "High priority lead notifications",
      importance: 5,
      vibrate: true,
      playSound: true,
      soundName: 'default',
      showBadge: true,
    });
    
    PushNotification.configure({
      onNotification: (notification) => {
        console.log('Notification received:', notification);
        
        if (notification.userInteraction) {
          const leadData = notification.data?.leadData ? JSON.parse(notification.data.leadData) : null;
          
          if (notification.action === 'accept' && leadData) {
            this.handleAccept(leadData);
          } else if (notification.action === 'reject' && leadData) {
            this.handleReject(leadData);
          } else if (leadData && this.navigationHandler) {
            this.navigationHandler('Notification', { lead: leadData });
          }
        }
      },
      onAction: (notification) => {
        console.log('Action pressed:', notification.action);
        const leadData = notification.data?.leadData ? JSON.parse(notification.data.leadData) : null;
        
        if (notification.action === 'accept' && leadData) {
          this.handleAccept(leadData);
        } else if (notification.action === 'reject' && leadData) {
          this.handleReject(leadData);
        }
      },
      requestPermissions: true,
    });
  }

  setNavigationHandler(handler) {
    this.navigationHandler = handler;
  }

  async initialize() {
    console.log('Push notification service initialized');
  }

  async sendTestNotification(lead) {
    console.log('Sending notification for lead:', lead.name);
    
    // Show beautiful full-screen modal immediately
    if (this.navigationHandler) {
      this.navigationHandler('Notification', { lead });
    }
  }

  async handleAccept(lead) {
    console.log('Lead accepted:', lead.name);
    PushNotification.cancelAllLocalNotifications();
    if (this.navigationHandler) {
      this.navigationHandler('LeadDetails', { lead });
    }
  }

  async handleReject(lead) {
    try {
      console.log('Lead rejected:', lead.name);
      PushNotification.cancelAllLocalNotifications();
      const declined = await AsyncStorage.getItem('@declined_leads') || '[]';
      const declinedLeads = JSON.parse(declined);
      declinedLeads.push({ ...lead, declinedAt: new Date().toISOString() });
      await AsyncStorage.setItem('@declined_leads', JSON.stringify(declinedLeads));
    } catch (error) {
      console.log('Error saving declined lead:', error);
    }
  }
}

export default new FirebaseMessagingService();