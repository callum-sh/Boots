import { BACKEND_URL, DEBUG } from "@/constants/env";
import { ICompetition } from "@/types/competition";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function fetchCompetitionDetails(competitionId: number): Promise<ICompetition | undefined> {
  // fetch competition details from the backend
  const token = await AsyncStorage.getItem("userToken");

  try {
    const response = await fetch(`${BACKEND_URL}/competition/${competitionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      }
    });
    const competitionData = await response.json();

    if (DEBUG) {
      console.log(`[debug] fetched competition details: ${JSON.stringify(competitionData)}`);
    }
    return competitionData;

  } catch (error) {
    console.error(`[error] failed to fetch competition details: ${error}`);
    return undefined;
  }
};


export async function fetchUserCompetitions() {
  // fetch user's competitions from the backend
  const token = await AsyncStorage.getItem("userToken");

  try {
    const response = await fetch(`${BACKEND_URL}/competition`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      }
    });
    const competitionData = await response.json();
    if (DEBUG) {
      console.log(`[debug] fetched competitions: ${JSON.stringify(competitionData)}`);
    }
    return competitionData;

    
  } catch (error) {
    console.error(`[error] failed to fetch user competitions: ${error}`);
  }
};


export async function createCompetition(competitionFormData: ICompetition) {
  // create a new competition on the backend
  const token = await AsyncStorage.getItem("userToken");

  try {
    await fetch(`${BACKEND_URL}/competition/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(competitionFormData),
    });
    if (DEBUG) {
      console.log(`[debug] created competition: ${JSON.stringify(competitionFormData)}`);
    }
  } catch (error) {
    console.error(`[error] failed to create competition: ${error}`);
  }
};


export async function joinCompetition(competitionId: number) {
  // join a competition on the backend
  const token = await AsyncStorage.getItem("userToken");

  try {
    await fetch(`${BACKEND_URL}/competition/${competitionId}/join/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    });
    if (DEBUG) {
      console.log(`[debug] joined competition: ${competitionId}`);
    }
  } catch (error) {
    console.error(`[error] failed to join competition: ${error}`);
  }
};