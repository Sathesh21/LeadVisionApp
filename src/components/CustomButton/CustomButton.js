import React, { useContext } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { ThemeContext } from "../../theme/ThemeContext";
import { FONT_SIZE, FONT_FAMILY } from "../../constants/fonts";

const CustomButton = ({ title, onPress, outline = false }) => {
  const { themeStyles } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      style={[styles.button, {
        backgroundColor: outline ? "transparent" : themeStyles.primary,
        borderColor: themeStyles.primary,
        borderWidth: outline ? 1 : 0,
      }]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: outline ? themeStyles.primary : "#fff" }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 5,
  },
  text: {
    fontSize: FONT_SIZE.medium,
    fontFamily: FONT_FAMILY.bold,
  },
});

export default CustomButton;
