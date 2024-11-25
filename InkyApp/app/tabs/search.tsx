// app/tabs/advanced-search.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AdvancedSearchTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Advanced Search Tab</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
  },
});
