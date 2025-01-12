import React, { useState } from 'react';

import { Image, StyleSheet, FlatList, TouchableOpacity, View, Button, Modal } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CompetitionCreationModal } from '@/components/CompetitionCreationModal';

// define competition interface 
interface Competition {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

// TODO: get from backend API
const COMPETITIONS = [
  { id: 1, name: 'Boots with Buddies', startDate: '2025-01-01', endDate: '2025-01-20'},
  { id: 2, name: 'Collaboration Competition', startDate: '2024-12-01', endDate: '2025-02-01'},
  { id: 3, name: 'JavaScript Marathon', startDate: '2025-01-01', endDate: '2025-01-07'},
];
export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handlePress = (competition: Competition) => {
    // Navigate to the details screen and pass competition data as params
    navigation.navigate('CompetitionDetails', { competition });
  };

  const calculateProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = Date.now();
    return ((now - start) / (end - start)) * 100;
  };

  const renderCompetitionItem = ({ item }: { item: Competition }) => {
    const progress = calculateProgress(item.startDate, item.endDate);
    return (
      <TouchableOpacity onPress={() => handlePress(item)} style={styles.itemContainer}>
        <ThemedText>{item.name}</ThemedText>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Ongoing Competitions</ThemedText>
      </ThemedView>

      {/* Render your competitions in a list */}
      <FlatList
        data={COMPETITIONS}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCompetitionItem}
        contentContainerStyle={{ paddingHorizontal: 2, paddingVertical: 8 }}
      />

      {/* create new competition button */}
      <CompetitionCreationModal />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  itemContainer: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#76c7c0',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
});