import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import AuthenticationScreen from "../screens/Authentication";
import { AuthProvider, useAuth } from "../context/AuthContext";

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

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuthStatus();
      setLoading(false);
    };

    initializeAuth();
  }, []);

  if (loading) {
    return null; // TODO: fun loading animation later?
  }

  return isAuthenticated ? <Stack /> : <AuthenticationScreen />;
}
