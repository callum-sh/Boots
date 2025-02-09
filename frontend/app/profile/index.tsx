import { fetchAuthenticatedUser, logoutUser } from '@/network/authentication';
import { IUser } from '@/types/authentication';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  const [user, setUser] = useState<IUser | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      // get authenticated user info 
      const userData = await fetchAuthenticatedUser();
      if (userData) {
        setUser(userData);
      }
    };

    fetchData();
  }, []);

  const handleSignOut = async () => {
    logoutUser();
  };

  return (
    <>
    <Stack.Screen
      name="User Profile"
      options={{
        title: user ? user.username : 'Profile',
      }}
    />

    {/* rendering user info */}
      <View style={styles.container}>
        <Text style={styles.title}>User Profile</Text>
        <Button title="Sign Out" onPress={handleSignOut} />
      </View>
    </>
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
