// app/login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { Link } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://owfmsf2mr44wbryxtjnvunwhta0gtwmq.lambda-url.us-east-1.on.aws/', {
        email,
        password,
      });
  
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
  
      // Check if login was successful based on the HTTP status code
      if (response.status === 200) {
        console.log('Login successful:', response.data);
        // Store the token and navigate to the next screen as needed
        const token = response.data.token;
        // For example, save the token to AsyncStorage or update your app state
      } else {
        console.log('Login failed:', response.data.error || response.data.message);
        // Show error message to the user
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.log('Login failed:', error.response.data.error || error.response.data.message);
        // Show error message to the user
      } else if (error.request) {
        // No response received from the server
        console.error('No response received:', error.request);
        // Show network error message to the user
      } else {
        // An error occurred in setting up the request
        console.error('An error occurred:', error.message);
        // Show a generic error message to the user
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'https://your-logo-url.com/logo.png' }} // Replace with your logo URL
          style={styles.logo}
        />
        <Text style={styles.logoText}>Inky</Text>
      </View>

      {/* Login Form */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign in to your account</Text>

        <TextInput
          style={styles.input}
          placeholder="Username or email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
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
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#ff4500',
    fontSize: 14,
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
