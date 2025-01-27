import React, { useEffect, useState } from "react";

import { StyleSheet, TouchableOpacity, useColorScheme, ScrollView, Image} from "react-native";
import { router, Stack } from "expo-router";

import { ICompetition } from "@/types/competition";
import { Text, View } from "@/components/Themed";
import { calculateProgress } from "@/utils/date";
import { fetchUserCompetitions } from "@/network/competition";
import { CompetitionCreationModal } from "@/components/competitionCreation/CompetitionCreationModal";
import { Colors } from "@/constants/Colors";
import { IconButton } from "@/components/IconButton";

export default function HomeScreen() {
  const [competitions, setCompetitions] = useState<ICompetition[]>([]);
  const theme = useColorScheme() === 'light' ? Colors.light : Colors.dark;

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
    router.push(`/competition/${competition.id}`);
  };

  const renderCompetitionItem = (competition: ICompetition) => {
    const progress = calculateProgress(
      competition.start_date,
      competition.end_date
    );
    return (
      <TouchableOpacity
        onPress={() => handlePress(competition)}
        key={competition.id}
        style={[
          styles.competitionContainer,
          {backgroundColor: theme.container}
        ]}
      >
        <Text>{competition.name}</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: progress }]} />
        </View>
      </TouchableOpacity>
    );
  };

  const handleProfile = () => {
    router.push("/profile");
  }; 

  return (
    <>
    <Stack.Screen
      name="OngoingCompetitions"
      options={{
        headerTitle: 'Ongoing Competitions',
        headerTitleAlign: 'center',
        headerRight: () => (
          <IconButton
            iconName="user"
            color={theme.tint}
            iconSize={28}
            onPress={handleProfile}
            style={{ marginRight: 10 }}
          />
        ),
      }}
    />
    
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.outerCompetitionContainer}>
        {competitions.length > 0 ? (
          competitions.map((competition: ICompetition) =>
            renderCompetitionItem(competition)
          )
        ) : (
          <Text style={styles.title}>😔 No competitions</Text>
        )}
        <CompetitionCreationModal />
      </View>
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingVertical: 48,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  logoutButton: {
    backgroundColor: "#ff6b6b",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 8,
  },
  competitionContainer: {
    padding: 16,
    width: "80%",
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  outerCompetitionContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 16,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#76c7c0",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: "center",
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: "center",
  },
});
