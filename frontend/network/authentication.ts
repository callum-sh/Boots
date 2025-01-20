import { BACKEND_URL, DEBUG } from "@/constants/env";
import { IAuthResponse, IUser } from "@/types/authentication";

// Register a new user
export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<IUser | undefined> {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/auth/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (DEBUG) {
      console.log(`[debug] User registered: ${JSON.stringify(data)}`);
    }

    return data.user;
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
    const response = await fetch(`${BACKEND_URL}/auth/auth/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: usernameOrEmail, password }),
    });

    const data: IAuthResponse = await response.json();

    if (DEBUG) {
      console.log(`[debug] User logged in: ${JSON.stringify(data)}`);
    }

    return data;
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
    const response = await fetch(`${BACKEND_URL}/auth/auth/user/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    const data: IUser = await response.json();

    if (DEBUG) {
      console.log(`[debug] Authenticated user: ${JSON.stringify(data)}`);
    }

    return data;
  } catch (error) {
    console.error(`[error] failed to fetch authenticated user: ${error}`);
    return undefined;
  }
}

// Log out the user
export async function logoutUser(token: string): Promise<void> {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/auth/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (response.ok) {
      if (DEBUG) {
        console.log("[debug] User logged out successfully");
      }
    } else {
      console.error(`[error] failed to log out: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`[error] failed to log out: ${error}`);
  }
}
