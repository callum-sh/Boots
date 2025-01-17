import React, { useEffect, useState } from 'react';

import { StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

import { ICompetition } from '@/types/competition';
import { Colors } from '@/constants/Colors';
import { Text, View } from '@/components/Themed';
import { calculateProgress } from '@/utils/date';
import { fetchUserCompetitions } from '@/network/competition';
import { IconButton } from '@/components/IconButton';
import { CompetitionCreationModal } from '@/components/CompetitionCreationModal';


export default function HomeScreen() {
  const [competitions, setCompetitions] = useState<ICompetition[]>([]);

  // fetch data needed to render page 
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchUserCompetitions();
      setCompetitions(data);
    };

    fetchData();
  }, []);

  const handlePress = (competition: ICompetition) => {
    // Navigate to the details screen and pass competition data as params
    router.push(`/${competition.id}`);
  };

  const renderCompetitionItem = (competition: ICompetition) => {
    const progress = calculateProgress(competition.start_date, competition.end_date);
    return (
      <TouchableOpacity onPress={() => handlePress(competition)} key={competition.id} style={styles.competitionContainer}>
        <Text>{competition.name}</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: progress }]} />
            </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.outerCompetitionContainer}>
        <Text style={styles.title}>Ongoing Competitions</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        {competitions.length > 0 ? (
          competitions.map((competition: ICompetition) => (
            renderCompetitionItem(competition)
          ))
        ) : (
          <Text>No competitions available</Text>
        )}
      </View>
      <CompetitionCreationModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 8,
  },
  competitionContainer: {
    padding: 16,
    width: '80%',
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  outerCompetitionContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 16,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#76c7c0',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
});