import { IAuthResponse, IUser } from "@/types/authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Register a new user
export async function registerUser(
  firstName: string,
  email: string,
  password: string
): Promise<IUser | undefined> {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ first_name: firstName, email, password }),
    });

    const data = await response.json();

    if (process.env.DEBUG) {
      console.log(`[DEBUG] User registered: ${JSON.stringify(data)}`);
    }

    return data;
  } catch (error) {
    console.error(`[error] failed to register user: ${error}`);
    return undefined;
  }
}

// Log in a user
export async function loginUser(
  usernameOrEmail: string,
  password: string
): Promise<IAuthResponse | undefined> {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: usernameOrEmail, password }),
    });

    const data: IAuthResponse = await response.json();

    if (process.env.DEBUG) {
      console.log(`[DEBUG] User logged in: ${JSON.stringify(data)}`);
    }

    return data;
  } catch (error) {
    console.error(`[error] failed to log in: ${error}`);
    return undefined;
  }
}

// Fetch the currently authenticated user
export async function fetchAuthenticatedUser(): Promise<IUser | undefined> {
  const token = await AsyncStorage.getItem("userToken");

  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/user/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    const data: IUser = await response.json();

    if (process.env.DEBUG) {
      console.log(`[DEBUG] Authenticated user: ${JSON.stringify(data)}`);
    }

    return data;
  } catch (error) {
    console.error(`[error] failed to fetch authenticated user: ${error}`);
    return undefined;
  }
}

// Log out the user
export async function logoutUser(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (response.ok) {
      if (process.env.DEBUG) {
        console.log("[DEBUG] User logged out successfully");
        return true;
      }
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
