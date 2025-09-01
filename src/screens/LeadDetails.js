import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";
import Header from "../components/Header/Header";
import { SPACING, FONT_SIZE, BORDER_RADIUS } from "../constants/colors";

const LeadDetails = ({ route, navigation }) => {
  const { themeStyles } = useContext(ThemeContext);
  const { lead } = route.params || {};

  const leadData = {
    name: lead?.name || 'Unknown Lead',
    location: lead?.location || 'Location not specified',
    matchScorePercent: lead?.matchScorePercent || lead?.matchScore || 0,
    company: lead?.company || 'Company not specified',
    phone: lead?.phone || '+1 (555) 000-0000',
    email: lead?.email || 'email@example.com',
    status: lead?.status || 'new',
    lastContact: lead?.lastContact || new Date().toLocaleDateString(),
    image: lead?.image || 'https://via.placeholder.com/150',
    ...lead
  };

  if (!lead) {
    return (
      <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
        <Header title="Lead Details" navigation={navigation} />
        <Text style={[styles.text, { color: themeStyles.text }]}>No lead details available</Text>
      </View>
    );
  }

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'hot': return '#FF5722';
      case 'warm': return '#FF9800';
      case 'cold': return '#9E9E9E';
      default: return '#2196F3';
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <Header title="Lead Details" navigation={navigation} />
      
      <View style={[styles.profileCard, { backgroundColor: themeStyles.card }]}>
        <Image source={{ uri: leadData.image }} style={styles.profileImage} />
        
        <Text style={[styles.name, { color: themeStyles.text }]}>{leadData.name}</Text>
        <Text style={[styles.company, { color: themeStyles.textSecondary }]}>{leadData.company}</Text>
        
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(leadData.status) }]}>
          <Text style={styles.statusText}>{leadData.status?.toUpperCase() || 'NEW'}</Text>
        </View>
      </View>

      <View style={[styles.scoreCard, { backgroundColor: leadData.matchScorePercent > 80 ? '#E8F5E8' : themeStyles.card }]}>
        <Text style={[styles.scoreTitle, { color: themeStyles.text }]}>Match Score</Text>
        <Text style={[styles.scoreValue, { color: leadData.matchScorePercent > 80 ? '#4CAF50' : themeStyles.text }]}>
          {leadData.matchScorePercent}%
        </Text>
        <Text style={[styles.scoreDescription, { color: themeStyles.textSecondary }]}>
          {leadData.matchScorePercent > 90 ? 'Excellent Match' : 
           leadData.matchScorePercent > 80 ? 'Good Match' : 
           leadData.matchScorePercent > 60 ? 'Fair Match' : 'Low Match'}
        </Text>
      </View>

      <View style={[styles.detailsCard, { backgroundColor: themeStyles.card }]}>
        <Text style={[styles.sectionTitle, { color: themeStyles.text }]}>Contact Information</Text>
        
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: themeStyles.textSecondary }]}>Location:</Text>
          <Text style={[styles.detailValue, { color: themeStyles.text }]}>{leadData.location}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: themeStyles.textSecondary }]}>Phone:</Text>
          <Text style={[styles.detailValue, { color: themeStyles.text }]}>{leadData.phone}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: themeStyles.textSecondary }]}>Email:</Text>
          <Text style={[styles.detailValue, { color: themeStyles.text }]}>{leadData.email}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: themeStyles.textSecondary }]}>Last Contact:</Text>
          <Text style={[styles.detailValue, { color: themeStyles.text }]}>{leadData.lastContact}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}>
          <Text style={styles.actionButtonText}>📞 Call</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#2196F3' }]}>
          <Text style={styles.actionButtonText}>✉️ Email</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#FF9800' }]}>
          <Text style={styles.actionButtonText}>📝 Notes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileCard: {
    padding: SPACING.lg,
    margin: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: SPACING.md,
  },
  name: {
    fontWeight: 'bold',
    fontSize: FONT_SIZE.xl,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  company: {
    fontSize: FONT_SIZE.md,
    fontStyle: 'italic',
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  statusBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusText: {
    color: '#fff',
    fontSize: FONT_SIZE.sm,
    fontWeight: 'bold',
  },
  scoreCard: {
    padding: SPACING.lg,
    margin: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreTitle: {
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.xs,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  scoreDescription: {
    fontSize: FONT_SIZE.sm,
    fontStyle: 'italic',
  },
  detailsCard: {
    padding: SPACING.lg,
    margin: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  detailLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: FONT_SIZE.md,
    flex: 2,
    textAlign: 'right',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  actionButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    minWidth: 80,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  text: { fontSize: FONT_SIZE.md },
});

export default LeadDetails;
