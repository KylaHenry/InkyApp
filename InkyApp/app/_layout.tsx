// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import SideBar from '@/components/SideBar'; // Ensure correct import path
import ProfileIcon from '@/components/ProfileIcon'; 

// Import AuthProvider
//import { AuthProvider } from '../context/AuthContext';
import { AuthProvider } from './context/AuthContext';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <View style={styles.container}>
          {/* Sidebar */}
          <SideBar />
          {/* Main content */}
          <View style={styles.content}>
            <Stack>
              {/* Define your routes here */}
              <Stack.Screen name="index" options={{ title: 'Home' }} />
              <Stack.Screen name="tabs" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </View>
        </View>
      </ThemeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row', // Sidebar and main content side by side
  },
  content: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Light background for main content
  },
});
