import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchAuthenticatedUser, logoutUser } from "@/network/authentication";

interface AuthContextProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (authenticated: boolean) => void;
  checkAuthStatus: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      if (!accessToken || !refreshToken) {
        // If no tokens are found, set as not authenticated
        setIsAuthenticated(false);
        return;
      }

      // Try to fetch user data using the access token
      const user = await fetchAuthenticatedUser(accessToken);

      if (user) {
        setIsAuthenticated(true);
      } else {
        // Handle token expiration by refreshing it
        const refreshedToken = await refreshAccessToken(refreshToken);

        if (refreshedToken) {
          await AsyncStorage.setItem("accessToken", refreshedToken);
          setIsAuthenticated(true);
        } else {
          // Refresh token is invalid or expired
          await AsyncStorage.removeItem("accessToken");
          await AsyncStorage.removeItem("refreshToken");
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error("Error checking authentication status:", error);
      setIsAuthenticated(false);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      if (refreshToken) {
        await logoutUser(refreshToken);
      }

      // Clear all tokens
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const refreshAccessToken = async (
    refreshToken: string
  ): Promise<string | null> => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh: refreshToken }),
        }
      );

      const data = await response.json();

      if (response.ok && data.access) {
        return data.access; // Return the new access token
      } else {
        console.error("Failed to refresh access token:", data);
        return null;
      }
    } catch (error) {
      console.error("Error refreshing access token:", error);
      return null;
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        checkAuthStatus,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
