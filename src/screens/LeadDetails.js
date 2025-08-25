import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";
import Header from "../components/Header/Header";
import { SPACING, FONT_SIZE, BORDER_RADIUS } from "../constants/colors";

const LeadDetails = ({ route, navigation }) => {
  const { themeStyles } = useContext(ThemeContext);
  const { lead } = route.params || {}; // get lead details passed from NotificationScreen

  if (!lead) {
    return (
      <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
        <Header title="Lead Details" navigation={navigation} />
        <Text style={[styles.text, { color: themeStyles.text }]}>No lead details available</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <Header title="Lead Details" navigation={navigation} />
      <View style={[styles.card, { backgroundColor: themeStyles.card }]}>
        <Text style={[styles.name, { color: themeStyles.text }]}>{lead.name}</Text>
        <Text style={[styles.location, { color: themeStyles.textSecondary }]}>{lead.location}</Text>
        {lead.matchScorePercent !== undefined && (
          <Text style={[styles.score, { color: themeStyles.text }]}>{`Match Score: ${lead.matchScorePercent}%`}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: SPACING.md },
  card: { padding: SPACING.md, borderRadius: BORDER_RADIUS.md, marginTop: SPACING.lg },
  text: { fontSize: FONT_SIZE.md },
  name: { fontWeight: "bold", fontSize: FONT_SIZE.lg, marginBottom: SPACING.sm },
  location: { fontSize: FONT_SIZE.md, marginBottom: SPACING.sm },
  score: { fontWeight: "600", marginTop: SPACING.sm },
});

export default LeadDetails;
