import { fetchWrapper } from "./fetchWrapper";

export async function fetchTodaysUserGoals(competitionId: string) {
  // fetch user's goals for the given competition
  try {
    const response = await fetchWrapper(`${process.env.EXPO_PUBLIC_API_URL}/${competitionId}/goal/`, {
      method: 'GET',
      headers: { "Content-Type": "application/json" }
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error(`[error] failed to fetch user competitions; response not ok`);
    }

  } catch (error) {
    console.error(`[error] failed to fetch user competitions: ${error}`)
    return undefined;
  }
};


export async function putGoal(goalId: string, data: any) {
  try {
    const response = await fetchWrapper(`${process.env.EXPO_PUBLIC_API_URL}/goal/${goalId}/`, {
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error(`[error] failed to update goal; response not ok`);
    }

  } catch (error) {
    console.error(`[error] failed to update goal: ${error}`)
    return undefined;
  }
}