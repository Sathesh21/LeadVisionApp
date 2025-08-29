// components/MessageBubble.js
import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";
import { SPACING, FONT_SIZE, BORDER_RADIUS, BASE_COLORS } from "../constants/colors";

const MessageBubble = ({ message, text, isUser }) => {
  const { themeStyles } = useContext(ThemeContext);
  
  // Handle both message object and direct props
  const messageText = message?.text || text || '';
  const isUserMessage = message?.isUser ?? isUser ?? false;

  if (!messageText) return null;

  return (
    <View
      style={[
        styles.bubble,
        {
          backgroundColor: isUserMessage ? BASE_COLORS.blue : themeStyles.card,
          alignSelf: isUserMessage ? "flex-end" : "flex-start",
        },
      ]}
    >
      <Text style={[styles.text, { color: isUserMessage ? "#fff" : themeStyles.text }]}>
        {messageText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginVertical: SPACING.xs,
    maxWidth: "80%",
  },
  text: { fontSize: FONT_SIZE.md },
});

export default MessageBubble;
