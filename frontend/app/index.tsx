import React, { useEffect, useState } from "react";

import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import { ICompetition } from "@/types/competition";
import { Text, View } from "@/components/Themed";
import { calculateProgress } from "@/utils/date";
import { fetchUserCompetitions } from "@/network/competition";
import { CompetitionCreationModal } from "@/components/competitionCreation/CompetitionCreationModal";
import { useAuth } from "@/context/AuthContext";

export default function HomeScreen() {
  const { setIsAuthenticated } = useAuth();
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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      Alert.alert("Success", "You have been logged out.");
      setIsAuthenticated(false); // Notify parent component
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
        style={styles.competitionContainer}
      >
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
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        {competitions.length > 0 ? (
          competitions.map((competition: ICompetition) =>
            renderCompetitionItem(competition)
          )
        ) : (
          <Text>No competitions available</Text>
        )}
      </View>
      <CompetitionCreationModal />
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
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
    backgroundColor: useColorScheme() === "light" ? "#fff" : "#2e2e2e",
    borderRadius: 8,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  outerCompetitionContainer: {
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
