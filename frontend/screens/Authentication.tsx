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
import { registerUser, loginUser } from "@/network/authentication";
import { useAuth } from "@/context/AuthContext";

const AuthenticationScreen = () => {
  const { setIsAuthenticated } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = () => {
    if (isLogin) {
      return (
        username.trim() !== "" && password.trim() !== ""
      );
    }
    return (
      password.trim() !== "" &&
      username.trim() !== ""
    );
  };

  const handleLogin = async () => {
    setLoading(true);

    if (isLogin) {
      const loggedIn = await loginUser(username, password);
      if (loggedIn) {
        setIsAuthenticated(true);
      } else {
        Alert.alert("Error", "Invalid email or password");
      }
    } else {
      // const user = await registerUser(username, password);
      // if (user) {
      //   setIsAuthenticated(true);
      // } else {
      //   Alert.alert("Error", "Failed to register user");
      // }
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? "Login" : "Register"}</Text>

      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="words"
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

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
          onPress={handleLogin}
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
