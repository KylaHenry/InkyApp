import {StyleSheet, Platform } from 'react-native';
import {Image} from 'expo-image';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
   <Image source="homeicon" />
  );
}

