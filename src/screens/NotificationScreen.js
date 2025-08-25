import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";
import Header from "../components/Header/Header";

const NotificationScreen = ({ navigation }) => {
  const { themeStyles } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <Header title="Task 3: Full Notification" navigation={navigation} />
      <Text style={[styles.text, { color: themeStyles.text }]}>
        Notification Screen
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  text: { fontSize: 18, fontWeight: "500" },
});

export default NotificationScreen;
