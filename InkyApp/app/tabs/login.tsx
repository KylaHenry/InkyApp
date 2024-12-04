// app/login.tsx

import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Link, useRouter } from 'expo-router';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://owfmsf2mr44wbryxtjnvunwhta0gtwmq.lambda-url.us-east-1.on.aws/', {
        email,
        password,
      });

      console.log('Response status:', response.status);
      console.log('Response data:', response.data);

      if (response.status === 200 && response.data.token) {
        console.log('Login successful:', response.data);
        const token = response.data.token;
        login(token);
        router.replace('/tabs/home');
      } else {
        console.log('Login failed:', response.data.error || response.data.message);
        Alert.alert('Login Failed', response.data.error || 'An unknown error occurred.');
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with a status other than 2xx
          console.log('Login failed:', error.response.data.error || error.response.data.message);
          Alert.alert('Login Failed', error.response.data.error || 'Invalid email or password.');
        } else if (error.request) {
          // No response received
          console.error('No response received:', error.request);
          Alert.alert('Error', 'No response from server. Please try again later.');
        } else {
          // Error setting up the request
          console.error('Error setting up request:', error.message);
          Alert.alert('Error', 'An error occurred. Please try again.');
        }
      } else {
        console.error('Unexpected error:', error);
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          //source={{ uri: 'https://your-logo-url.com/logo.png' }} // Replace with your logo URL
          //style={styles.logo}
        />
        <Text style={styles.logoText}>Inky</Text>
      </View>

      {/* Login Form */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign in to your account</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Role Selection Removed */}

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
        </TouchableOpacity>

        {/* Navigation Link to Register Screen */}
        <TouchableOpacity style={styles.registerLink}>
          <Link href="/tabs/register" asChild>
            <Text style={styles.registerText}>New user? Register</Text>
          </Link>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... your existing styles
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  logoText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#1c1c1c',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#2c2c2c',
    borderRadius: 5,
    paddingHorizontal: 15,
    color: '#fff',
    fontSize: 16,
    marginBottom: 15,
  },

  button: {
    backgroundColor: '#ff4500',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerLink: {
    alignItems: 'center',
  },
  registerText: {
    color: '#aaa',
    fontSize: 14,
  },
});
