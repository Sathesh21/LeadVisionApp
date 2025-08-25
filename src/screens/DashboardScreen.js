// src/screens/DashboardScreen.js
import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ThemeContext } from "../theme/ThemeContext";
import Header from "../components/Header/Header";

const DashboardScreen = ({ navigation }) => {
  const { themeStyles } = useContext(ThemeContext);
  return (
    <>
      <Header navigation={navigation} title="Dashboard" onSettingsPress={() => navigation.navigate("Settings")} />
      <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
        <Text style={[styles.title, { color: themeStyles.text }]}>
          Select a Task
        </Text>
        {[
          { title: "Task 1: OCR Capture", screen: "OCR" },
          { title: "Task 2: AI Result Display", screen: "Chat" },
          { title: "Task 3: Full Notification", screen: "Notification" },
          { title: "Task 4: Location Fetch", screen: "Location" },
          { title: "Task 5: Lead Allocation", screen: "LeadAllocation" },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.button, { backgroundColor: themeStyles.primary }]}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={[styles.buttonText, { color: themeStyles.text }]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>

  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, marginBottom: 20, textAlign: "center" },
  button: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: "center",
  },
  buttonText: { fontSize: 16, fontWeight: "bold" },
});

export default DashboardScreen;
