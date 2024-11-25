import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Notification() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification</Text>
      <Text style={styles.description}>This is the Notification page.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
});
