import { ICompetition } from "@/types/competition";
import { fetchWrapper } from "./fetchWrapper";

export async function fetchCompetitionDetails(competitionId: number): Promise<ICompetition | undefined> {
  // fetch competition details from the backend
  try {
    const response = await fetchWrapper(`${process.env.EXPO_PUBLIC_API_URL}/competition/${competitionId}/`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      const err = await response.text();
      console.error(`[error] failed to fetch competition details: ${err}`)
      return;
    }
    const data = await response.json();
    return data;

  } catch (error) {
    console.error(`[error]: ${error}`);
    return;
  }
};

export async function fetchUserCompetitions() {
  // fetch user's competitions from the backend
  try {
    const response = await fetchWrapper(`${process.env.EXPO_PUBLIC_API_URL}/competition/`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      const err = await response.text();
      console.error(`[error] failed to fetch user competitions: ${err}`);
      return;
    }
    const data = await response.json();
    return data;

  } catch (error) {
    console.error(`[error]: ${error}`)
    return;
  }
};

export async function createCompetition(competitionFormData: ICompetition) {
  // create a new competition on the backend
  try {
    const response = await fetchWrapper(`${process.env.EXPO_PUBLIC_API_URL}/competition/`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(competitionFormData),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error(`[error] failed to create competition: ${err}`);
      return false;
    }
    if (process.env.DEBUG) {
      console.debug(`[debug] created competition: ${JSON.stringify(competitionFormData)}`);
    }
    return true;

  } catch (error) {
    console.error(`[error]: ${error}`);
    return false;
  }
};

export async function removeCompetition(competitionId: number): Promise<ICompetition | undefined> {
  // delete competition
  try {
    const response = await fetchWrapper(`${process.env.EXPO_PUBLIC_API_URL}/competition/${competitionId}/`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      const err = await response.text();
      console.error(`[error] failed to delete competition: ${err}`)
      return;
    }
  } catch (error) {
    console.error(`[error]: ${error}`);
  }
};

export async function joinCompetition(competitionId: number) {
  // join a competition on the backend
  try {
    const response = await fetchWrapper(`${process.env.EXPO_PUBLIC_API_URL}/competition/${competitionId}/join/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const err = await response.text();
      console.error(`[error] failed to join competition ${err}`);
      return false;
    }
    if (process.env.DEBUG) {
      console.debug(`[debug] joined competition: ${competitionId}`);
    }
    return true;

  } catch (error) {
    console.error(`[error]: ${error}`);
    return false;
  }
};