import React, { useEffect, useState } from 'react';

import { StyleSheet, TouchableOpacity } from 'react-native';
import { ICompetition } from '@/types/category';

import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { BACKEND_URL, DEBUG } from '@/constants/env';
import { Text, View } from '@/components/Themed';


export default function HomeScreen() {
  const [competitions, setCompetitions] = useState<ICompetition[]>([]);

  // fetch data needed to render page 
  useEffect(() => {
    fetchUserCompetitions();
  }, []);

  async function fetchUserCompetitions() {
    // fetch user's competitions from the backend
    try {
      const response = await fetch(`${BACKEND_URL}/competition`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const competitionData = await response.json();

      setCompetitions(competitionData);

      if (DEBUG) {
        console.log(`[debug] fetched competitions: ${JSON.stringify(competitionData)}`);
      }
    } catch (error) {
      console.error(`[error] failed to fetch competitions: ${error}`);
    }
  }

  const handlePress = (competition: ICompetition) => {
    // Navigate to the details screen and pass competition data as params
    const id = competition.id;

    router.push({
      pathname: '/competitionDetails/[id]',
      params: { id },
    });
  };

  const calculateProgress = (startDate: string, endDate: string): number => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = Date.now();
    return ((now - start) / (end - start)) * 100;
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
      <Text style={styles.title}>Ongoing Competitions</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        {/* todo: replace w/ dynamic competitions */}
      {competitions.length > 0 ? (
        competitions.map((competition: ICompetition) => (
          renderCompetitionItem(competition)
        ))
      ) : (
        <Text>No competitions available</Text>
      )}
      <View style={styles.helpContainer}>
        <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
          (+) Create a new competition
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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