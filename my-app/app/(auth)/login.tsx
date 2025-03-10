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
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import images from "../../constants/images";
import { ApiHelper } from '../helpers/ApiHelper';
import { LoginResponse } from "../response/LoginResponse";

const Login = () => {
  const API_BASE_URL = 'http://10.68.107.46:8000';

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fetchUserData = async (token: string) => {
    try {
      const response = await ApiHelper.request<LoginResponse>(
        `${API_BASE_URL}/api/auth/getUserData`,
        "GET",
        null,
        token
      );
  
      if (response?.error_schema.error_code != "S001") {
        throw new Error("Failed to fetch data");
      }
  
      const userData = JSON.stringify(response.output_schema);
      await AsyncStorage.setItem("userData", userData);
      console.log("User data saved:", response.output_schema);

      await AsyncStorage.setItem("isGuest", "false");
    } catch (error) {
      Alert.alert("Login Failed", error.response);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation", "Please fill in both email and password");
      return;
    }
  
    try {
      const loginData = { email, password };
      const response = await ApiHelper.request<LoginResponse>(
        `${API_BASE_URL}/api/auth/login`,
        "POST",
        loginData
      );
  
      if (response?.error_schema.error_code != "S001") {
        throw new Error(response.error_schema.error_message);
      }
  
      // Simpan token dan data pengguna ke AsyncStorage
      await AsyncStorage.setItem("access_token", response.output_schema.access_token);

      await AsyncStorage.setItem("isLoggedIn", "true");
      await fetchUserData(response.output_schema.access_token);
      
      // Tampilkan pesan sukses dan arahkan ke halaman profile
      Alert.alert(
        'Success',
        'You have successfully logged in.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.push("/profile");
            },
          },
        ]
      );
    } catch (error) {
      console.error('Login error:', error);
        const errorMessage = error.response || "An error occurred during login";
        Alert.alert("Login Failed", errorMessage);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }
  
    setIsLoading(true);
  
    try {
      const resetData = { email };
      const response = await ApiHelper.request(
        `${API_BASE_URL}/api/auth/resetPassword`,
        'POST',
        resetData
      );
      console.log('Reset password response:', response);
    
      // Jika API merespons dengan error, tampilkan pesan error
      if (response?.error_schema.error_code != "S001") {
        throw new Error(response.error_schema.additional_message);
      }
    
      Alert.alert(
        'Success',
        'Password reset link has been sent to your email.',
        [
          {
            text: 'OK',
            onPress: () => {
              setShowForgotPassword(false);
              router.push("/login");
            },
          },
        ]
      );
    } catch (error) {
      // console.error("API Error:", error);
      const errorMessage = error.message || "An error occurred";
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ backgroundColor: "#FFFFFF", flex: 1, justifyContent: "center", alignItems: "center", paddingBottom: 20 }}>
      {/* Welcome Back Text */}
      {!showForgotPassword && (
        <View style={{ marginRight: 20, paddingRight: 30, marginBottom: 60 }}>
          <Text style={{ textAlign: "left", fontSize: 30, fontWeight: "bold" }}>
            Welcome Back! Glad{"\n"}to see you. Again!
          </Text>
        </View>
      )}

      <View style={{ marginBottom: 50, alignItems: 'center', width: '100%' }}>
        {/* Email and Password Input Fields */}
        {!showForgotPassword && (
          <>
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
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

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
          </>
        )}

        {/* Forgot Password Link */}
        {!showForgotPassword && (
          <Text
            style={{ left: 220, width: "78%", marginTop: 5 }}
            onPress={() => setShowForgotPassword(!showForgotPassword)}
          >
            Forgot Password
          </Text>
        )}

        {/* Forgot Password Form */}
        {showForgotPassword && (
          <View style={{ width: "85%", marginTop: 20 }}>
            <Text style={{ fontSize: 16, marginBottom: 10, textAlign: "center" }}>
              Enter your email to reset your password
            </Text>
            <TextInput
              style={{
                width: "100%",
                height: 50,
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                paddingHorizontal: 10,
                marginBottom: 20,
                fontSize: 16,
              }}
              placeholder="Enter your email address"
              placeholderTextColor="#8A8A8A"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={{
                width: "100%",
                height: 50,
                backgroundColor: "#2B4763",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 8,
              }}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "bold" }}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Login Button, Divider, Social Icons, and Register Link */}
        {!showForgotPassword && (
          <>
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

            <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 20, width: "75%" }}>
              <View style={{ flex: 1, height: 1, backgroundColor: "#EDEEF2" }} />
              <Text style={{ color: "#ADB0BB", fontSize: 14, fontWeight: "bold", textAlign: "center" }}>Or Login with</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: "#EDEEF2" }} />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 70 }}>
              <Image source={images.google} style={{ width: 50, height: 50, resizeMode: "contain", marginHorizontal: 10, marginTop: 10 }} />
              <Image source={images.apple} style={{ width: 50, height: 50, resizeMode: "contain", marginHorizontal: 10, marginTop: 10 }} />
              <Image source={images.facebook} style={{ width: 50, height: 50, resizeMode: "contain", marginHorizontal: 10, marginTop: 10 }} />
              <Image source={images.twitter} style={{ width: 50, height: 50, resizeMode: "contain", marginHorizontal: 10, marginTop: 10 }} />
            </View>

            <View style={{ marginTop: 5 }}>
              <Text style={{ fontSize: 18, textAlign: "center" }}>
                Don't have an account?{" "}
                <Text style={{ color: "#2B4763", fontWeight: "bold" }} onPress={() => router.push("./register")}>
                  Register
                </Text>
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default Login;