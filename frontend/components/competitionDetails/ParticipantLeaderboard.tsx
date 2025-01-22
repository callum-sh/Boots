import { IParticipant } from "@/types/participant";
import { View, Text } from "../Themed";
import { StyleSheet } from "react-native";


export function ParticipantLeaderboard({ participants }: { participants: IParticipant[] }) {
  return (
    <View style={styles.detailContainer}>     
        <Text style={styles.title}>Leaderboard</Text>
        <View style={styles.titleSeparator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

        {participants
            .sort((a, b) => b.score - a.score)
            .map((participant, index) => (
            <View key={participant.id}>
                <Text>{index + 1}. {participant.user_name} - {participant.score}</Text>
            </View>
            ))}
    </View>
  );
}


const styles = StyleSheet.create({
    detailContainer: {
      width: '80%',
      alignItems: 'flex-start',
      paddingBottom: 16,
    },
    titleSeparator: {
      marginVertical: 5,
      height: 1,
      width: '100%',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      alignItems: 'flex-start'
    },
  });