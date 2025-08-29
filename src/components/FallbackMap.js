import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const FallbackMap = ({ userLocation, leads, nearestLead, themeStyles }) => {
  return (
    <View style={[styles.container, { backgroundColor: themeStyles.card }]}>
      <Text style={[styles.title, { color: themeStyles.text }]}>Map View (Fallback)</Text>
      
      {userLocation && (
        <View style={styles.locationSection}>
          <Text style={[styles.sectionTitle, { color: themeStyles.primary }]}>Your Location:</Text>
          <Text style={[styles.coordinates, { color: themeStyles.text }]}>
            📍 {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}
          </Text>
          {userLocation.accuracy && (
            <Text style={[styles.accuracy, { color: themeStyles.textSecondary }]}>
              Accuracy: ±{Math.round(userLocation.accuracy)}m
            </Text>
          )}
        </View>
      )}
      
      <ScrollView style={styles.leadsSection} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: themeStyles.primary }]}>Nearby Leads:</Text>
        
        {leads.map(lead => {
          const isNearest = nearestLead && lead.id === nearestLead.id;
          const distance = userLocation ? 
            calculateDistance(userLocation.latitude, userLocation.longitude, lead.latitude, lead.longitude) : 
            null;
            
          return (
            <View 
              key={lead.id} 
              style={[
                styles.leadItem, 
                { 
                  backgroundColor: isNearest ? themeStyles.primary + '20' : themeStyles.background,
                  borderColor: isNearest ? themeStyles.primary : themeStyles.textSecondary + '30'
                }
              ]}
            >
              <View style={styles.leadHeader}>
                <Text style={[styles.leadName, { color: themeStyles.text }]}>
                  {isNearest ? '🎯 ' : '📍 '}{lead.name}
                </Text>
                <Text style={[styles.matchScore, { color: getScoreColor(lead.matchScore) }]}>
                  {lead.matchScore}%
                </Text>
              </View>
              
              <Text style={[styles.leadCoords, { color: themeStyles.textSecondary }]}>
                {lead.latitude.toFixed(4)}, {lead.longitude.toFixed(4)}
              </Text>
              
              {distance && (
                <Text style={[styles.distance, { color: themeStyles.primary }]}>
                  Distance: {distance.toFixed(2)} km
                </Text>
              )}
              
              {isNearest && (
                <Text style={[styles.nearestLabel, { color: themeStyles.primary }]}>
                  🏆 Nearest Lead
                </Text>
              )}
            </View>
          );
        })}
      </ScrollView>
      
      <Text style={[styles.note, { color: themeStyles.textSecondary }]}>
        💡 Note: Install Google Maps to see interactive map view
      </Text>
    </View>
  );
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const getScoreColor = (score) => {
  if (score >= 90) return '#4CAF50';
  if (score >= 80) return '#FF9800';
  if (score >= 70) return '#2196F3';
  return '#F44336';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  locationSection: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  coordinates: {
    fontSize: 14,
    fontFamily: 'monospace',
  },
  accuracy: {
    fontSize: 12,
    marginTop: 4,
  },
  leadsSection: {
    flex: 1,
    maxHeight: 300,
  },
  leadItem: {
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  leadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  leadName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  matchScore: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  leadCoords: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  distance: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  nearestLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  note: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
});

export default FallbackMap;