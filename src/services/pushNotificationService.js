class PushNotificationService {
  constructor() {
    this.navigationHandler = null;
  }

  setNavigationHandler(handler) {
    this.navigationHandler = handler;
  }

  sendTestNotification(lead) {
    if (this.navigationHandler) {
      this.navigationHandler('Notification', { lead });
    }
  }

  showLeadNotification(lead) {
    if (this.navigationHandler) {
      this.navigationHandler('Notification', { lead });
    }
  }
}

export default new PushNotificationService();