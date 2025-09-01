import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';

const LoginScreen = ({ navigation }) => {
  const { themeStyles } = useContext(ThemeContext);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: themeStyles.primary }]}>
          🚀 LeadVision
        </Text>
        <Text style={[styles.subtitle, { color: themeStyles.text }]}>
          Enterprise Lead Management
        </Text>
        
        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: themeStyles.primary }]}
          onPress={() => navigation.replace('Dashboard')}
        >
          <Text style={styles.loginButtonText}>
            Continue to Dashboard
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
    textAlign: 'center',
  },
  permissionsList: {
    width: '100%',
    marginBottom: 40,
  },
  permissionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  permissionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  permissionText: {
    fontSize: 16,
    flex: 1,
  },
  loginButton: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;