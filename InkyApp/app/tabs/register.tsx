// app/register.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Link, useRouter } from 'expo-router'; // Import useRouter
import axios from 'axios';

export default function RegisterScreen() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  
  const router = useRouter(); // Initialize the router

  const handleRegister = async () => {
    try {
        // Navigate to login screen
        router.push('/tabs/login');
        const response = await axios.post(
        'https://fk7qavyfxpom3ps2yeftuv4y5u0hqqtp.lambda-url.us-east-1.on.aws/',
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status === 200) {
        console.log('Registration successful:', response.data);
        Alert.alert('Success', 'Registration successful. Please log in.');
        // Navigate to login screen
        //router.push('/tabs/login');

      } else {
        console.log('Registration failed:', response.data);
        Alert.alert('Error', 'Registration failed. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        console.log('Error data:', error.response.data);
        console.log('Error status:', error.response.status);
        console.log('Error headers:', error.response.headers);
      } else if (error.request) {
        console.log('Error request:', error.request);
      } else {
        console.log('Error message:', error.message);
      }
      console.log('Error config:', error.config);
      Alert.alert('Error', 'An error occurred during registration. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inky</Text>
      <View style={styles.form}>
        <Text style={styles.heading}>Create an account</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        {/* Navigation Link to Login Screen */}
        <TouchableOpacity>
          <Link href="/tabs/login" asChild>
            <Text style={styles.linkText}>Already have an account? Sign In</Text>
          </Link>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  form: {
    backgroundColor: "#1a1a1a",
    width: "85%",
    padding: 20,
    borderRadius: 10,
  },
  heading: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#ff4500",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkText: {
    color: "#ff4500",
    textAlign: "center",
    fontSize: 14,
  },
});
