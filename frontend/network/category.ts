import { ICategory } from "@/types/category";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function fetchCategories(): Promise<ICategory[]> {
  // fetch user's competitions from the backend
  const accessToken = await AsyncStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/category`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Use Bearer token for authentication
        },
      }
    );
    const competitionData = await response.json();
    if (process.env.DEBUG) {
      console.log(
        `[debug] fetched categories: ${JSON.stringify(competitionData)}`
      );
    }
    return competitionData;
  } catch (error) {
    console.error(`[error] failed to fetch user categories: ${error}`);
    return [];
  }
}

export async function createCategory(category: ICategory) {
  // create a new competition on the backend
  const accessToken = await AsyncStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/category/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Use Bearer token for authentication
        },
        body: JSON.stringify(category),
      }
    );
    const data: ICategory = await response.json();
    if (process.env.DEBUG) {
      console.log(`[debug] created category: ${JSON.stringify(data)}`);
    }
    return data;
  } catch (error) {
    console.error(`[error] failed to create category: ${error}`);
  }
}
