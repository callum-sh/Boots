import { BACKEND_URL, DEBUG } from "@/constants/env";
import { ICategory } from "@/types/category";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function fetchCategories(): Promise<ICategory[]> {
  // fetch user's competitions from the backend
  const token = await AsyncStorage.getItem("userToken");
  
  try {
    const response = await fetch(`${BACKEND_URL}/category`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
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