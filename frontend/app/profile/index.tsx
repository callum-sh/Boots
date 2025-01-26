import { logoutUser } from '@/network/authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  // Replace this with your actual user data from a context or API call
  const user = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
  };

  const handleSignOut = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.error('No token found in storage');
      return;
    }

    logoutUser(token);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <Text>Name: {user.name}</Text>
      <Text>Email: {user.email}</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
});
