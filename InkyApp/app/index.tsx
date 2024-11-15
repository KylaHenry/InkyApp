import { StyleSheet, View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function HomePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>InkyApp</Text>
      <Text style={styles.subtitle}>Your go-to app for awesome features.</Text>
      
      {/* Link to another page */}
      <Link href="/(tabs)" style={styles.link}>
        Go to Dashboard
      </Link>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
  },
  link: {
    fontSize: 18,
    color: '#1E90FF',
    textDecorationLine: 'underline',
  },

});
