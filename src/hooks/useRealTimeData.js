import { useState, useEffect, useCallback } from 'react';
import RealTimeService from '../utils/realTimeService';

export const useRealTimeData = (userId) => {
  const [isConnected, setIsConnected] = useState(false);
  const [leads, setLeads] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Handle new lead updates
  const handleNewLead = useCallback((lead) => {
    setLeads(prev => [lead, ...prev]);
    setLastUpdate(new Date());
  }, []);

  // Handle lead updates
  const handleLeadUpdate = useCallback((updatedLead) => {
    setLeads(prev => prev.map(lead => 
      lead.id === updatedLead.id ? { ...lead, ...updatedLead } : lead
    ));
    setLastUpdate(new Date());
  }, []);

  // Handle notifications
  const handleNotification = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10
  }, []);

  // Handle connection status
  const handleConnection = useCallback((connected) => {
    setIsConnected(connected);
  }, []);

  useEffect(() => {
    if (userId) {
      // Subscribe to real-time events
      RealTimeService.subscribe('connected', handleConnection);
      RealTimeService.subscribe('newLead', handleNewLead);
      RealTimeService.subscribe('leadUpdate', handleLeadUpdate);
      RealTimeService.subscribe('notification', handleNotification);

      // Connect to WebSocket
      RealTimeService.connect(userId);

      // Cleanup on unmount
      return () => {
        RealTimeService.unsubscribe('connected', handleConnection);
        RealTimeService.unsubscribe('newLead', handleNewLead);
        RealTimeService.unsubscribe('leadUpdate', handleLeadUpdate);
        RealTimeService.unsubscribe('notification', handleNotification);
        RealTimeService.disconnect();
      };
    }
  }, [userId, handleConnection, handleNewLead, handleLeadUpdate, handleNotification]);

  // Send location update
  const sendLocationUpdate = useCallback((location) => {
    RealTimeService.send('LOCATION_UPDATE', {
      userId,
      location,
      timestamp: new Date().toISOString()
    });
  }, [userId]);

  // Send lead interaction
  const sendLeadInteraction = useCallback((leadId, action) => {
    RealTimeService.send('LEAD_INTERACTION', {
      userId,
      leadId,
      action,
      timestamp: new Date().toISOString()
    });
  }, [userId]);

  return {
    isConnected,
    leads,
    notifications,
    lastUpdate,
    sendLocationUpdate,
    sendLeadInteraction
  };
};