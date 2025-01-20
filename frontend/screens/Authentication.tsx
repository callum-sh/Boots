import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerUser, loginUser } from "@/network/authentication";
import { useAuth } from "@/context/AuthContext";

const AuthenticationScreen = () => {
  const { setIsAuthenticated } = useAuth();
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const canSubmit = () => {
    if (isLogin) {
      return username.trim() !== "" && password.trim() !== "";
    }
    return (
      username.trim() !== "" &&
      password.trim() !== "" &&
      email.trim() !== "" &&
      isValidEmail(email)
    );
  };

  const handleAuth = async () => {
    setLoading(true);

    try {
      if (isLogin) {
        const response = await loginUser(username, password);
        if (response?.token) {
          // Save token to AsyncStorage
          await AsyncStorage.setItem("userToken", response.token);
          Alert.alert("Success", "Login successful!");
          if (isLogin && response?.token) {
            await AsyncStorage.setItem("userToken", response.token);
            Alert.alert("Success", "Login successful!");
            setIsAuthenticated(true); // Notify parent component
          }
        } else {
          throw new Error("Login failed");
        }
      } else {
        const user = await registerUser(username, email, password);
        if (user) {
          Alert.alert(
            "Success",
            "Registration successful! You can now log in."
          );
          setIsLogin(true); // Switch to login after successful registration
        } else {
          throw new Error("Registration failed");
        }
      }
    } catch (error) {
      Alert.alert("Error: Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? "Login" : "Register"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      {!isLogin && (
        <TextInput
          style={[
            styles.input,
            email && !isValidEmail(email) && { borderColor: "red" },
          ]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity
          style={[styles.button, !canSubmit() && { backgroundColor: "#ccc" }]}
          onPress={handleAuth}
          disabled={!canSubmit()}
        >
          <Text style={styles.buttonText}>
            {isLogin ? "Login" : "Register"}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setIsLogin(!isLogin)}
      >
        <Text style={styles.toggleButtonText}>
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  toggleButton: {
    marginTop: 15,
    alignItems: "center",
  },
  toggleButtonText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});

export default AuthenticationScreen;
