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
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // Import useRouter hook
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import images from "../../constants/images";
import { ApiHelper } from '../helpers/ApiHelper';
import { LoginResponse } from "../response/LoginResponse";

const Login = () => {
  // URL API backend
  const API_BASE_URL = 'https://your-api-endpoint.com'; // Ganti dengan URL API Anda

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Fungsi untuk mengambil data pengguna setelah login berhasil
  const fetchUserData = async (token: string) => {
    try {
      const response = await ApiHelper.request<LoginResponse>(`${API_BASE_URL}/getUserData`, "GET", null, token);

      // Simpan data pengguna ke AsyncStorage
      await AsyncStorage.setItem("userData", JSON.stringify(response.output_schema));
      console.log('User data saved:', response.output_schema);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      throw new Error('Failed to fetch user data');
    }
  };

  // Fungsi untuk menangani login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation", "Please fill in both email and password");
      return;
    }
  
    try {
      const loginData = { email, password };
      console.log('Data yang dikirim:', loginData); // Log data yang dikirim
  
      const response = await ApiHelper.request<LoginResponse>(`${API_BASE_URL}/login`, "POST", loginData);
      console.log('Response dari API:', response); // Log response dari API
  
      // Validasi apakah login berhasil (cek access_token)
      if (!response.output_schema?.access_token) {
        const errorMessage = response.error_schema?.error_message || "Login failed. Please try again.";
        Alert.alert("Login Failed", errorMessage);
        return;
      }
  
      // Simpan token ke AsyncStorage
      await AsyncStorage.setItem("access_token", response.output_schema.access_token);
  
      // Simpan status login ke AsyncStorage
      await AsyncStorage.setItem("isLoggedIn", "true");
  
      // Ambil data pengguna setelah login berhasil
      await fetchUserData(response.output_schema.access_token);
  
      // Tampilkan pesan sukses
      Alert.alert("Login Success", "You are logged in!");
      router.push("/profile"); // Arahkan ke halaman profile setelah login berhasil
    } catch (error: any) {
      console.error('Login error:', error); // Log error
      if (error.response) {
        const errorMessage = error.response.error_schema?.error_message || "An error occurred during login";
        Alert.alert("Login Failed", errorMessage);
      } else {
        const errorMessage = "Network error. Please check your internet connection.";
        Alert.alert("Login Failed", errorMessage);
      }
    }
  };

  const checkAsyncStorage = async () => {
    const token = await AsyncStorage.getItem("access_token");
    const userData = await AsyncStorage.getItem("userData");
    console.log('Token:', token);
    console.log('User Data:', userData);
  };
  
  checkAsyncStorage();
  
  return (
    <View style={{ backgroundColor: "#FFFFFF", flex: 1, justifyContent: "center", alignItems: "center", paddingBottom: 20 }}>
      <View style={{ marginRight: 20, paddingRight: 30, marginBottom: 60 }}>
        <Text style={{ textAlign: "left", fontSize: 30, fontWeight: "bold" }}>
          Welcome Back! Glad{"\n"}to see you. Again!
        </Text>
      </View>

      <View style={{ marginBottom: 50, alignItems: 'center', width: '100%' }}>
        {/* Email Input Field */}
        <View style={{
            flexDirection: 'row', alignItems: 'center', width: '85%', borderWidth: 1, borderColor: '#ddd',
            backgroundColor: '#fff', borderRadius: 8, marginBottom: 20, paddingHorizontal: 10, elevation: 5
        }}>
            <TextInput
                style={{ flex: 1, fontSize: 16, paddingVertical: 12, color: '#000' }}
                placeholder="Enter your email address"
                placeholderTextColor="#8A8A8A"
                value={email}
                onChangeText={setEmail}
            />
        </View>

        {/* Password Input Field */}
        <View style={{
            flexDirection: 'row', alignItems: 'center', width: '85%', borderWidth: 1, borderColor: '#ddd',
            backgroundColor: '#fff', borderRadius: 8, marginBottom: 10, paddingHorizontal: 10, elevation: 5
        }}>
            <TextInput
                style={{ flex: 1, fontSize: 16, paddingVertical: 12, color: '#000' }}
                placeholder="Enter your password"
                placeholderTextColor="#8A8A8A"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={24}
                    color="#aaa"
                />
            </TouchableOpacity>
        </View>

        {/* Forgot Password Link */}
        <Text style={{ left: 220, width: "78%", marginTop: 5 }} onPress={() => router.push("./register")}>
          Forgot Password
        </Text>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        style={{ 
          backgroundColor: "#E7E8EE", 
          width: "70%", 
          height: 60, 
          justifyContent: "center", 
          alignItems: "center", 
          marginTop: 20, 
          borderRadius: 10 
        }}
        onPress={handleLogin}
      >
        <Text style={{ color: "#000000", fontSize: 18, textAlign: "center", fontWeight: "bold" }}>Login</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 20, width: "75%" }}>
        <View style={{ flex: 1, height: 1, backgroundColor: "#EDEEF2" }} />
        <Text style={{ color: "#ADB0BB", fontSize: 14, fontWeight: "bold", textAlign: "center" }}>Or Login with</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: "#EDEEF2" }} />
      </View>

      {/* Social Login Icons */}
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 70 }}>
        <Image source={images.google} style={{ width: 50, height: 50, resizeMode: "contain", marginHorizontal: 10, marginTop: 10 }} />
        <Image source={images.apple} style={{ width: 50, height: 50, resizeMode: "contain", marginHorizontal: 10, marginTop: 10 }} />
        <Image source={images.facebook} style={{ width: 50, height: 50, resizeMode: "contain", marginHorizontal: 10, marginTop: 10 }} />
        <Image source={images.twitter} style={{ width: 50, height: 50, resizeMode: "contain", marginHorizontal: 10, marginTop: 10 }} />
      </View>

      {/* Register Link */}
      <View style={{ marginTop: 5 }}>
        <Text style={{ fontSize: 18, textAlign: "center" }}>
          Don't have an account?{" "}
          <Text style={{ color: "#2B4763", fontWeight: "bold" }} onPress={() => router.push("./register")}>
            Register
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default Login;