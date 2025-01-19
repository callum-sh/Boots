import { BACKEND_URL, DEBUG } from "@/constants/env";
import { ICategory } from "@/types/category";

export async function fetchCategories(): Promise<ICategory[]> {
  // fetch user's competitions from the backend
  try {
    const response = await fetch(`${BACKEND_URL}/category`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const competitionData = await response.json();
    if (DEBUG) {
      console.log(`[debug] fetched categories: ${JSON.stringify(competitionData)}`);
    }
    return competitionData;

  } catch (error) {
    console.error(`[error] failed to fetch user categories: ${error}`);
    return [];
  }
}