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

    if (!response.ok) {
      const err = await response.text();
      console.error(`[error] failed to register user: ${err}`);
      return false;
    }

    const data = await response.json();
    await AsyncStorage.clear();
    await AsyncStorage.setItem('access_token', data?.access);
    await AsyncStorage.setItem('refresh_token', data?.refresh);

    if (process.env.DEBUG) {
      console.debug("[debug] successfully registered new use");
    }
    return true;

  } catch (error) {
    console.error(`[error]: ${error}`);
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

    if (!response.ok) {
      const err = await response.text();
      console.error(`[error] failed to log in: ${err}`);
      return false;
    }

    const data = await response.json()
    await AsyncStorage.clear();
    await AsyncStorage.setItem('access_token', data?.access);
    await AsyncStorage.setItem('refresh_token', data?.refresh);

    if (process.env.DEBUG) {
      console.debug("[debug] successfully logged in");
    }
    return true;

  } catch (error) {
    console.error(`[error]: ${error}`);
    return false;
  }
}

// Fetch the currently authenticated user
export async function fetchAuthenticatedUser(): Promise<IUser | undefined> {
  try {
    const response = await fetchWrapper(`${process.env.EXPO_PUBLIC_API_URL}/auth/user/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const err = await response.text();
      console.error(`[error] failed to fetch user: ${err}`);
      return;
    }
    const data: IUser = await response.json();
    if (process.env.DEBUG) {
      console.debug(`[debug] Authenticated user: ${JSON.stringify(data)}`);
    }
    return data;

  } catch (error) {
    console.error(`[error]: ${error}`);
    return;
  }
}

// Log out the user
export async function logoutUser(): Promise<boolean> {
  try {
    const refresh = await AsyncStorage.getItem('refresh_token');
    const response = await fetchWrapper(`${process.env.EXPO_PUBLIC_API_URL}/auth/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refresh }),
    });

    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');

    if (!response.ok) {
      const err = await response.text();
      console.error(`[error] failed to log out: ${err}`);
      return false;
    }
    if (process.env.DEBUG) {
      console.debug("[debug] User logged out successfully");
    }
    return true;

  } catch (error) {
    console.error(`[error]: ${error}`);
    return false;
  }
}
