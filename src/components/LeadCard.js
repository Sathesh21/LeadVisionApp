// LeadCard.js
import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";
import { SPACING, BORDER_RADIUS, FONT_SIZE } from "../constants/colors";

const LeadCard = ({ lead }) => {
  const { themeStyles } = useContext(ThemeContext);

  // Return null if lead data is incomplete
  if (!lead || !lead.name) {
    return null;
  }

  // Handle both matchScore and matchScorePercent
  const matchScore = lead.matchScore || lead.matchScorePercent || 0;
  const highlight = matchScore > 80;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: highlight ? "#d1f7c4" : themeStyles.card },
      ]}
    >
      <Text style={[styles.name, { color: themeStyles.text }]}>{lead.name}</Text>
      <Text style={[styles.location, { color: themeStyles.textSecondary }]}>
        {lead.location || 'Location not available'}
      </Text>
      <Text style={[styles.score, { color: highlight ? "green" : themeStyles.text }]}>
        Match Score: {matchScore}%
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    marginVertical: SPACING.sm / 2,
  },
  name: { fontWeight: "bold", fontSize: FONT_SIZE.md },
  location: { fontSize: FONT_SIZE.sm },
  score: { fontWeight: "600", marginTop: 4 },
});

export default LeadCard;
