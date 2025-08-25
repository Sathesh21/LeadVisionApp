import React, { useContext } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { ThemeContext } from "../../theme/ThemeContext";
import { FONT_SIZE, FONT_FAMILY } from "../../constants/fonts";

const CustomInput = ({ label, value, onChangeText }) => {
  const { themeStyles } = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: themeStyles.text }]}>{label}</Text>
      <TextInput
        style={[styles.input, { borderColor: themeStyles.primary, color: themeStyles.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={`Enter ${label}`}
        placeholderTextColor={themeStyles.text + "99"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  label: { fontSize: FONT_SIZE.medium, marginBottom: 5, fontFamily: FONT_FAMILY.bold },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: FONT_SIZE.medium,
    fontFamily: FONT_FAMILY.regular,
  },
});

export default CustomInput;
