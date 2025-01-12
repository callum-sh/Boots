import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Import your screens
import HomeScreen from './(tabs)';
import CompetitionDetailsScreen from './(tabs)';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* HomeScreen will show the list of competitions */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Ongoing Competitions' }} 
        />

        {/* This is where users see the details of a specific competition */}
        <Stack.Screen 
          name="CompetitionDetails" 
          component={CompetitionDetailsScreen} 
          options={{ title: 'Competition Details' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
