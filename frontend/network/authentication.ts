import { IAuthResponse, IUser } from "@/types/authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Register a new user
export async function registerUser(
  firstName: string,
  email: string,
  password: string
): Promise<IAuthResponse | undefined> {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/auth/register/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ first_name: firstName, email, password }),
      }
    );

    const data: IAuthResponse = await response.json();

    if (process.env.DEBUG) {
      console.log(`[DEBUG] User registered: ${JSON.stringify(data)}`);
    }

    if (response.ok) {
      return data; // Contains access and refresh tokens
    } else {
      console.error(`[error] Registration failed: ${JSON.stringify(data)}`);
      return undefined;
    }
  } catch (error) {
    console.error(`[error] failed to register user: ${error}`);
    return undefined;
  }
}

// Log in a user
export async function loginUser(
  email: string,
  password: string
): Promise<IAuthResponse | undefined> {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/auth/login/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const data: IAuthResponse = await response.json();

    if (process.env.DEBUG) {
      console.log(`[DEBUG] User logged in: ${JSON.stringify(data)}`);
    }

    if (response.ok) {
      return data; // Contains access and refresh tokens
    } else {
      console.error(`[error] Login failed: ${JSON.stringify(data)}`);
      return undefined;
    }
  } catch (error) {
    console.error(`[error] failed to log in: ${error}`);
    return undefined;
  }
}

// Fetch the currently authenticated user
export async function fetchAuthenticatedUser(
  token: string
): Promise<IUser | undefined> {
  try {
    const accessToken = await AsyncStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/auth/fetch_user/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Use Bearer token for authentication
        },
      }
    );

    const data: IUser = await response.json();

    if (process.env.DEBUG) {
      console.log(`[DEBUG] Authenticated user: ${JSON.stringify(data)}`);
    }

    if (response.ok) {
      return data; // Contains user details
    } else {
      console.error(`[error] Failed to fetch user: ${JSON.stringify(data)}`);
      return undefined;
    }
  } catch (error) {
    console.error(`[error] failed to fetch authenticated user: ${error}`);
    return undefined;
  }
}

// Log out the user
export async function logoutUser(refreshToken: string): Promise<boolean> {
  try {
    const accessToken = await AsyncStorage.getItem("accessToken");
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/auth/logout/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Use Bearer token for authentication
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }
    );

    if (response.ok) {
      if (process.env.DEBUG) {
        console.log("[DEBUG] User logged out successfully");
      }
      return true;
    } else {
      console.error(`[error] Failed to log out: ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.error(`[error] failed to log out: ${error}`);
    return false;
  }
}
