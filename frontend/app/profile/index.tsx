import { useAuth } from '@/context/AuthContext';
import { useURL } from "expo-linking";
import { fetchAuthenticatedUser, logoutUser } from '@/network/authentication';
import { IUser } from '@/types/authentication';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text } from "@/components/Themed";
import { Button, StyleSheet, Alert } from 'react-native';

export default function ProfileScreen() {

  const [user, setUser] = useState<IUser | undefined>(undefined);
  const { setIsAuthenticated } = useAuth();

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

  const handleLogout = async () => {
    setIsAuthenticated(false);
    router.push("/")

    const loggedOut = await logoutUser();
    if (!loggedOut) {
      Alert.alert("Error", "Failed to logout user");
    }
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
    {/* {user ? ( */}
      <View style={styles.container}>
        <Text style={styles.title}>User Profile</Text>
        {/* <Text>Name: {user.username}</Text>
        <Text>Email: {user.email}</Text> */}

        {/* TODO: would be nice to add lots of metrics about wins, etc. */}

        <Button title="Sign Out" onPress={handleLogout} />
      </View>
    {/* ) : (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    )} */}
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