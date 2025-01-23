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

export async function createCategory(category: ICategory) {
  // create a new competition on the backend
  try {
    const response = await fetch(`${BACKEND_URL}/category/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });
    const data: ICategory = await response.json();
    if (DEBUG) {
      console.log(`[debug] created category: ${JSON.stringify(data)}`);
    }
    return data;
  } catch (error) {
    console.error(`[error] failed to create category: ${error}`);
  }
}