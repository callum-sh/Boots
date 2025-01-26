import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack } from "expo-router";

import { ICompetition } from "@/types/competition";
import { Text, View } from "@/components/Themed";
import { calculateProgress } from "@/utils/date";
import { fetchUserCompetitions } from "@/network/competition";
import { CompetitionCreationModal } from "@/components/competitionCreation/CompetitionCreationModal";
import { useAuth } from "@/context/AuthContext";
import { Colors } from "@/constants/Colors";
import { logoutUser } from "@/network/authentication";
export default function HomeScreen() {
  const { logout } = useAuth(); // Use the new `logout` function from context
  const [competitions, setCompetitions] = useState<ICompetition[]>([]);
  const theme = useColorScheme() === "light" ? Colors.light : Colors.dark;

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchUserCompetitions();
      setCompetitions(data);
    };

    fetchData();
  }, []);

  const handlePress = (competition: ICompetition) => {
    router.push(`/${competition.id}`);
  };

  const handleLogout = async () => {
    try {
      await logout(); // Call the `logout` function from context
      Alert.alert("Success", "You have been logged out.");
    } catch (error) {
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
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
          { backgroundColor: theme.container },
        ]}
      >
        <Text>{competition.name}</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: progress }]} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: "Ongoing Competitions" }} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.outerCompetitionContainer}>
          {competitions.length > 0 ? (
            competitions.map((competition: ICompetition) =>
              renderCompetitionItem(competition)
            )
          ) : (
            <Text>No competitions available</Text>
          )}
          <CompetitionCreationModal />
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
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
