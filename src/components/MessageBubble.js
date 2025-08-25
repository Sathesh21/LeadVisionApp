// components/MessageBubble.js
import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";
import { SPACING, FONT_SIZE, BORDER_RADIUS, BASE_COLORS } from "../constants/colors";

const MessageBubble = ({ text, isUser }) => {
  const { themeStyles } = useContext(ThemeContext);

  return (
    <View
      style={[
        styles.bubble,
        {
          backgroundColor: isUser ? BASE_COLORS.blue : themeStyles.card,
          alignSelf: isUser ? "flex-end" : "flex-start",
        },
      ]}
    >
      <Text style={[styles.text, { color: isUser ? "#fff" : themeStyles.text }]}>{text}</Text>
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
