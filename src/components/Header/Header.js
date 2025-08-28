import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ThemeContext } from "../../theme/ThemeContext";
import { FONT_SIZE, FONT_FAMILY } from "../../constants/fonts";

const Header = ({ navigation, onSettingsPress, title }) => {
  const { themeStyles } = useContext(ThemeContext);

  const handleSettingsPress = () => {
    if (onSettingsPress) {
      onSettingsPress();
    } else if (navigation) {
      navigation.navigate('Settings');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.primary }]}>
      <View style={styles.leftSection}>
        {navigation?.canGoBack() && title !== "Dashboard" ? (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={[styles.backText, { color: themeStyles.text }]}>←</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} />
        )}
      </View>
      
      <View style={styles.centerSection}>
        <Text style={[styles.title, { color: themeStyles.text }]}>
          {title || "Header"}
        </Text>
      </View>
      
      <View style={styles.rightSection}>
        {title !== "Settings" ? (
          <TouchableOpacity onPress={handleSettingsPress} style={styles.settingsButton}>
            <Text style={[styles.settingsText, { color: themeStyles.text }]}>⚙️</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.settingsButton} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    elevation: 4,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: { 
    fontSize: FONT_SIZE.extraLarge || 26, 
    fontWeight: "bold"
  },
  title: {
    fontSize: FONT_SIZE.large || 18,
    fontFamily: FONT_FAMILY.bold,
    textAlign: 'center',
  },
  settingsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsText: {
    fontSize: 20,
  },
});

export default Header;
