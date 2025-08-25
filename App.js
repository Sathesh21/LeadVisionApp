import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeProvider } from "./src/theme/ThemeContext";

// Screens
import DashboardScreen from "./src/screens/DashboardScreen";
import OCRScreen from "./src/screens/OCRScreen";
import ChatScreen from "./src/screens/ChatScreen";
import NotificationScreen from "./src/screens/NotificationScreen";
import LocationScreen from "./src/screens/LocationScreen";
import LeadAllocation from "./src/screens/LeadAllocation";
import SettingsScreen from "./src/screens/SettingsScreen";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="OCR" component={OCRScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Notification" component={NotificationScreen} />
          <Stack.Screen name="Location" component={LocationScreen} />
          <Stack.Screen name="LeadAllocation" component={LeadAllocation} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;
