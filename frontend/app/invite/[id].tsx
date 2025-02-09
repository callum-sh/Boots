import React from 'react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ICompetition } from '@/types/competition';
import { fetchCompetitionDetails, joinCompetition } from '@/network/competition';
import { Text, View } from '@/components/Themed';
import { IconButton } from '@/components/IconButton';
import { StyleSheet, useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function InviteScreen() {
    const { id } = useLocalSearchParams();
    const [competitionDetails, setCompetitionDetails] = useState<ICompetition | undefined>(undefined);
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'light' ? Colors.light : Colors.dark;    

    useEffect(() => {
        // fetch competition details
        const fetchData = async () => {
          const data = await fetchCompetitionDetails(parseInt(id as string));
          setCompetitionDetails(data);
        };
    
        fetchData();
    }, []);

    const handleJoiningCompetition = async () => {
        if (!competitionDetails) return;
        await joinCompetition(competitionDetails.id);
        router.push("/")
    };

  return (
    <>
    <Stack.Screen options={{ title: `${competitionDetails?.name} Invite` }} />
    
    <View style={styles.container}>
        <Text style={styles.title}>🎉 You're invited to join {competitionDetails?.name}</Text>
        <IconButton
            iconName="check"
            color={theme.tint}
            iconSize={32}
            onPress={handleJoiningCompetition}
            content="Join Competition"
        />  
    </View>
    </>
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
});
