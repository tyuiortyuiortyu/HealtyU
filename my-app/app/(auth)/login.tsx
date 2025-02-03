import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import images from "../../constants/images";
import axios from "axios";
import { useRouter } from "expo-router";

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation", "Please fill in both email and password");
      return;
    }

    try {
      const response = await axios.post("http://10.68.99.124:8000/api/auth/login", {
        email,
        password,
      },
      
      {headers: {
          "Content-Type": "application/json",
        },
      }
    );

      console.log("Response:", response.data); // Cek response dari server

      const token = response.data.token;
      console.log("JWT Token:", token);
      Alert.alert("Login Success", "You are logged in!");

      // Simpan token ke AsyncStorage jika ingin session tetap aktif
      // await AsyncStorage.setItem("jwt_token", token);

      router.push("../(tabs)/profile.tsx");
    } catch (error) {
      Alert.alert("Login Failed", error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.topText}>Welcome Back! Glad{"\n"}to see you. Again!</Text>
      </View>
      
      <View style={styles.inputContainerEmail}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainerPassword}>
        <TextInput
          style={[styles.textInput, { paddingRight: 30 }]}
          placeholder="Enter your password"
          value={password}
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
          <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={24} color="#aaa" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButtonContainer} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default login;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },
  topContainer: {
    marginBottom: 80,
  },
  topText: {
    textAlign: "left",
    fontSize: 30,
    fontWeight: "bold",
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
  },
  inputContainerEmail: {
    backgroundColor: "#ffff",
    flexDirection: "row",
    width: "85%",
    height: 60,
    borderRadius: 10,
    elevation: 15,
    marginBottom: 10,
    alignItems: "center",
  },
  inputContainerPassword: {
    backgroundColor: "#ffff",
    flexDirection: "row",
    width: "85%",
    height: 60,
    borderRadius: 10,
    elevation: 15,
    marginBottom: 10,
    alignItems: "center",
    paddingRight: 10,
  },
  loginButtonContainer: {
    backgroundColor: "#E7E8EE",
    width: "70%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
    borderRadius: 10,
  },
  loginText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
  },
});