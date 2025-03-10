import { IUser } from "@/types/authentication";
import { fetchWrapper } from "./fetchWrapper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

// Register a new user
export async function registerUser(
  email: string,
  username: string,
  password: string
): Promise<Boolean> {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, password }),
    });
    const data = await response.json();

    if (data?.access && data?.refresh) {
      await AsyncStorage.clear();
      await AsyncStorage.setItem('access_token', data?.access);
      await AsyncStorage.setItem('refresh_token', data?.refresh);
    } else {
      console.error(`[error] failed to register user: ${data}`);
      return false;
    }

    console.log("RESPONSE:", data);
    console.log("storage keys:", await AsyncStorage.getItem('access_token'), await AsyncStorage.getItem('refresh_token'));
    return true;

  } catch (error) {
    console.error(`[error] failed to register user: ${error}`);
    return false
  }
}

// Log in a user
export async function loginUser(
  username: string,
  password: string
): Promise<Boolean> {

  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username,  password }),
    });

    const data = await response.json();

    if (data?.access && data?.refresh) {
      await AsyncStorage.clear();
      await AsyncStorage.setItem('access_token', data?.access);
      await AsyncStorage.setItem('refresh_token', data?.refresh);
    } else {
      console.error(`[error] failed to log in: ${data}`);
      return false;
    }

    console.log("RESPONSE:", data);
    console.log("storage keys:", await AsyncStorage.getItem('access_token'), await AsyncStorage.getItem('refresh_token'));
    return true;

  } catch (error) {
    console.error(`[error] failed to log in: ${error}`);
    return false;
  }
}

// Fetch the currently authenticated user
export async function fetchAuthenticatedUser(): Promise<IUser | undefined> {
  const token = await AsyncStorage.getItem("userToken");

  // try {
  //   const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/user/`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Token ${token}`,
  //     },
  //   });

  //   const data: IUser = await response.json();

  //   if (process.env.DEBUG) {
  //     console.log(`[DEBUG] Authenticated user: ${JSON.stringify(data)}`);
  //   }

  //   return data;
  // } catch (error) {
  //   console.error(`[error] failed to fetch authenticated user: ${error}`);
  //   return undefined;
  // }

  return undefined;
}

// Log out the user
export async function logoutUser(): Promise<boolean> {
  try {
    const refresh = await AsyncStorage.getItem('refresh_token');
    const response = await fetchWrapper(`${process.env.EXPO_PUBLIC_API_URL}/auth/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AsyncStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({ refresh_token: refresh }),
    });

    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');

    if (response.ok) {
      console.log("User logged out successfully");
    } else {
      console.error(`[error] failed to log out: ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.error(`[error] failed to log out: ${error}`);
    return false;
  }

  return false;
}
