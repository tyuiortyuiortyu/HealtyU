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
  const API_BASE_URL = 'https://your-api-endpoint.com';

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fetchUserData = async (token: string) => {
    try {
      const response = await ApiHelper.request<LoginResponse>(
        `${API_BASE_URL}/getUserData`,
        "GET",
        null,
        token
      );
      await AsyncStorage.setItem("userData", JSON.stringify(response.output_schema));
      console.log('User data saved:', response.output_schema);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      throw new Error('Failed to fetch user data');
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
        `${API_BASE_URL}/login`,
        "POST",
        loginData
      );

      if (!response.output_schema?.access_token) {
        const errorMessage = response.error_schema?.error_message || "Login failed. Please try again.";
        Alert.alert("Login Failed", errorMessage);
        return;
      }

      await AsyncStorage.setItem("access_token", response.output_schema.access_token);
      await AsyncStorage.setItem("isLoggedIn", "true");
      await fetchUserData(response.output_schema.access_token);

      Alert.alert("Login Success", "You are logged in!");
      router.push("/profile");
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response) {
        const errorMessage = error.response.error_schema?.error_message || "An error occurred during login";
        Alert.alert("Login Failed", errorMessage);
      } else {
        const errorMessage = "Network error. Please check your internet connection.";
        Alert.alert("Login Failed", errorMessage);
      }
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
      const response: { success?: boolean; error?: string } = await ApiHelper.request(
        `${API_BASE_URL}/resetPassword`,
        'POST',
        resetData
      );

      if (response?.success) {
        Alert.alert('Success', 'Password reset link has been sent to your email.');
        setShowForgotPassword(false);
      } else {
        const errorMessage = response?.error || 'Failed to send reset password request.';
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      Alert.alert('Error', 'An error occurred. Please try again later.');
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