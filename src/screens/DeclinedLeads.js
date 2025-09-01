import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../theme/ThemeContext';
import Header from '../components/Header/Header';

const DeclinedLeads = ({ navigation }) => {
  const { themeStyles } = useContext(ThemeContext);
  const [declinedLeads, setDeclinedLeads] = useState([]);

  useEffect(() => {
    loadDeclinedLeads();
  }, []);

  const loadDeclinedLeads = async () => {
    try {
      const stored = await AsyncStorage.getItem('@declined_leads');
      if (stored) {
        setDeclinedLeads(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading declined leads:', error);
    }
  };

  const clearDeclinedLeads = async () => {
    try {
      await AsyncStorage.removeItem('@declined_leads');
      setDeclinedLeads([]);
    } catch (error) {
      console.log('Error clearing declined leads:', error);
    }
  };

  const renderDeclinedLead = ({ item }) => (
    <View style={[styles.leadCard, { backgroundColor: themeStyles.card }]}>
      <Text style={[styles.leadName, { color: themeStyles.text }]}>{item.name}</Text>
      <Text style={[styles.leadLocation, { color: themeStyles.textSecondary }]}>
        📍 {item.location}
      </Text>
      <Text style={[styles.leadScore, { color: '#FF9800' }]}>
        Match Score: {item.matchScorePercent}%
      </Text>
      <Text style={[styles.declinedDate, { color: themeStyles.textSecondary }]}>
        Declined: {new Date(item.declinedAt).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <Header title="Declined Leads" navigation={navigation} />
      
      {declinedLeads.length > 0 && (
        <TouchableOpacity 
          style={[styles.clearButton, { backgroundColor: '#F44336' }]}
          onPress={clearDeclinedLeads}
        >
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      )}

      {declinedLeads.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: themeStyles.textSecondary }]}>
            No declined leads yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={declinedLeads}
          renderItem={renderDeclinedLead}
          keyExtractor={(item, index) => `${item.id || index}`}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  clearButton: {
    margin: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  leadCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  leadName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  leadLocation: {
    fontSize: 14,
    marginBottom: 4,
  },
  leadScore: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  declinedDate: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default DeclinedLeads;