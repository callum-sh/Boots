import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import AuthenticationScreen from "../screens/Authentication";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { Image, TouchableOpacity } from "react-native";

export default function Layout() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}

function AuthGate() {
  const { isAuthenticated, checkAuthStatus } = useAuth();
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuthStatus();
      setLoading(false);
    };

    initializeAuth();
  }, []);

  if (loading) {
    // You could return a loading spinner or splash screen here
    return null;
  }

  // If user is authenticated, show the main navigation stack with a custom header
  if (isAuthenticated) {
    return (
      <Stack
        screenOptions={{
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => router.push(`/profile`)}
            >
              {/* Replace with actual user avatar if available */}
              <Image
                source={{ uri: "https://placekitten.com/200/200" }}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                }}
              />
            </TouchableOpacity>
          ),
        }}
      />
    );
  }

  // Otherwise, show the AuthenticationScreen
  return <AuthenticationScreen />;
}