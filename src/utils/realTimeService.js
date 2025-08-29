// Real-time data service using WebSocket and polling
class RealTimeService {
  constructor() {
    this.ws = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.isConnected = false;
  }

  // WebSocket connection for real-time updates
  connect(userId) {
    try {
      // Replace with your WebSocket server URL
      this.ws = new WebSocket(`wss://your-api.com/ws?userId=${userId}`);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.emit('connected', true);
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleRealTimeUpdate(data);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        this.emit('connected', false);
        this.attemptReconnect(userId);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.emit('error', error);
      };
    } catch (error) {
      console.error('WebSocket connection failed:', error);
    }
  }

  // Handle different types of real-time updates
  handleRealTimeUpdate(data) {
    switch (data.type) {
      case 'NEW_LEAD':
        this.emit('newLead', data.payload);
        break;
      case 'LEAD_UPDATE':
        this.emit('leadUpdate', data.payload);
        break;
      case 'LOCATION_UPDATE':
        this.emit('locationUpdate', data.payload);
        break;
      case 'NOTIFICATION':
        this.emit('notification', data.payload);
        break;
      default:
        console.log('Unknown update type:', data.type);
    }
  }

  // Send data to server
  send(type, payload) {
    if (this.isConnected && this.ws) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }

  // Subscribe to real-time updates
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  // Unsubscribe from updates
  unsubscribe(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Emit events to subscribers
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  // Reconnection logic
  attemptReconnect(userId) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff
      
      setTimeout(() => {
        console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
        this.connect(userId);
      }, delay);
    }
  }

  // Disconnect WebSocket
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.listeners.clear();
  }

  // Polling fallback for when WebSocket is not available
  startPolling(endpoint, interval = 30000) {
    return setInterval(async () => {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        this.emit('pollingUpdate', data);
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, interval);
  }
}

export default new RealTimeService();