import { ICategory } from "@/types/category";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchWrapper } from "./fetchWrapper";

export async function fetchCategories(): Promise<ICategory[]> {
  // fetch user's competitions from the backend
  try {
    const response = await fetchWrapper(`${process.env.EXPO_PUBLIC_API_URL}/category/`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      const err = await response.text();
      console.error(`[error] failed to fetch user categories: ${err}`);
      return []; 
    }
    const data = await response.json();
    return data;

  } catch (error) {
    console.error(`[error]: ${error}`);
    return [];
  }
}

export async function createCategory(category: ICategory) {
  // create a new competition on the backend
  try {
    const response = await fetchWrapper(`${process.env.EXPO_PUBLIC_API_URL}/category/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error(`[error] failed to create new category: ${err}`);
      return
    }
    const data: ICategory = await response.json();
    if (process.env.DEBUG) {
      console.debug(`[debug] created category: ${JSON.stringify(data)}`);
    }
    return data;

  } catch (error) {
    console.error(`[error]: ${error}`);
  }
}