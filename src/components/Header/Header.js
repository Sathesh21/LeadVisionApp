import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ThemeContext } from "../../theme/ThemeContext";
import { FONT_SIZE, FONT_FAMILY } from "../../constants/fonts";

const Header = ({ navigation, onSettingsPress, title }) => {
  const { themeStyles } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.primary }]}>
      {navigation?.canGoBack() && title !== "Dashboard" && (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
      )}
      <Text style={[styles.title, { color: themeStyles.text }]}>
        {title || "Header"}
      </Text>
      {title !== "Settings" ? <TouchableOpacity onPress={onSettingsPress}>
        <Image
          source={require("../../../assets/icons/settings.png")}
          style={{ width: 30, height: 30, tintColor: themeStyles.icon || themeStyles.text }}
        />
      </TouchableOpacity> : <View style={{ width: 30 }}></View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    elevation: 4,
  },
  backText: { fontSize: FONT_SIZE.extraLarge || 26, fontWeight: "bold", marginBottom: 2 },
  title: {
    fontSize: FONT_SIZE.large,
    fontFamily: FONT_FAMILY.bold,
  },
});

export default Header;
