import { StyleSheet, Share, useColorScheme } from 'react-native';

import { Text, View } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ICompetition } from '@/types/competition';
import { BACKEND_URL } from '@/constants/env';
import { calculateProgress, formatDate } from '@/utils/date';
import { fetchCompetitionDetails } from '@/network/competition';
import { IconButton } from '@/components/IconButton';
import { ParticipantLeaderboard } from '@/components/competitionDetails/ParticipantLeaderboard';
import { CompetitionCategoryList } from '@/components/competitionDetails/CompetitionCategoryList';

export default function CompetitionDetails() {
  const local = useLocalSearchParams();
  const theme = useColorScheme() ?? 'light';
  const [competitionDetails, setCompetitionDetails] = useState<ICompetition | undefined>(undefined);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    // fetch competition details
    const fetchData = async () => {
      const data = await fetchCompetitionDetails(parseInt(local.competition as string));
      setCompetitionDetails(data);
      if (data) {
        setProgress(calculateProgress(data.start_date, data.end_date));
      }
    };

    fetchData();
  }, []);

  // Handle sharing competition link
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join my boots competition: ${competitionDetails?.name}!`,
        url: `${BACKEND_URL}/joinCompetition/${competitionDetails?.id}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* display competition details */}
      <View style={styles.detailContainer}>
        <Text style={styles.title}>{competitionDetails?.name}</Text>
        <View style={styles.titleSeparator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: progress }]} />
        </View>
        <Text>{competitionDetails?.description}</Text>
        <Text>{formatDate(competitionDetails?.start_date)} - {formatDate(competitionDetails?.end_date)}</Text>
      </View>

      {/* display competition participant leaderboard if exist */}
      {competitionDetails && competitionDetails.participants.length > 0 ? (
        <ParticipantLeaderboard participants={competitionDetails.participants} />
      ) : (
        <Text>No participants yet</Text>
      )}
      
      {/* display competition categories if exist */}
      {competitionDetails && competitionDetails.categories.length > 0 ? (
        <CompetitionCategoryList categories={competitionDetails.categories} />
      ) : (
        <Text>No Categories Selected</Text>
      )}

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <IconButton
        iconName="share-apple"
        content="Share"
        color={theme === 'light' ? Colors.light.tint : Colors.dark.tint}
        iconSize={32}
        onPress={handleShare}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  shareContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  detailContainer: {
    width: '80%',
    alignItems: 'flex-start',
    paddingBottom: 16,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  titleSeparator: {
    marginVertical: 5,
    height: 1,
    width: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'flex-start'
  },
  progressBarContainer: {
    height: 10,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#76c7c0',
  },
});
