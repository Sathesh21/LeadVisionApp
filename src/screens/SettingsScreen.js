import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";
import DEFAULT_TEXT from "../constants/defaultText";
import { FONT_SIZE, FONT_FAMILY } from "../constants/fonts";
import Header from "../components/Header/Header";

const colors = ["blue", "green", "purple", "orange"];

const SettingsScreen = ({ navigation }) => {
  const { theme, setTheme, baseColor, setBaseColor, themeStyles } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <Header
        title={DEFAULT_TEXT.themeSettingsTitle}
        navigation={navigation}
        themeStyles={themeStyles}
      />

      <View style={styles.spacer} />

      <Text style={[styles.sectionTitle, { color: themeStyles.text }]}>Theme Settings</Text>
      <TouchableOpacity
        style={[styles.button, { borderColor: themeStyles.text }]}
        onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <Text style={[styles.buttonText, { color: themeStyles.text }]}>
          {theme === "dark" ? DEFAULT_TEXT.switchToLight : DEFAULT_TEXT.switchToDark}
        </Text>
      </TouchableOpacity>

      {/* Choose Base Color */}
      <Text style={[styles.subTitle, { color: themeStyles.text }]}>
        {DEFAULT_TEXT.chooseBaseColor}
      </Text>

      <View style={styles.colorRow}>
        {colors.map(c => (
          <TouchableOpacity
            key={c}
            style={[
              styles.colorBox,
              {
                backgroundColor: c === baseColor ? themeStyles.primary : c,
                borderWidth: c === baseColor ? 2 : 0,
                borderColor: themeStyles.text,
              },
            ]}
            onPress={() => setBaseColor(c)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backBtn: { marginRight: 10 },
  backText: { fontSize: FONT_SIZE.extraLarge || 26, fontWeight: "bold" },
  title: {
    fontSize: FONT_SIZE.extraLarge || 24,
    fontFamily: FONT_FAMILY.bold,
  },
  subTitle: {
    marginTop: 20,
    fontSize: FONT_SIZE.medium,
    fontFamily: FONT_FAMILY.bold
  },
  button: {
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center"
  },
  buttonText: { fontSize: FONT_SIZE.medium, fontFamily: FONT_FAMILY.bold },
  colorRow: { flexDirection: "row", marginTop: 15, gap: 10 },
  colorBox: { width: 40, height: 40, borderRadius: 8 },
  spacer: { height: 20 },
  sectionTitle: { fontSize: FONT_SIZE.large || 18, fontFamily: FONT_FAMILY.bold, marginBottom: 10 },
});

export default SettingsScreen;
