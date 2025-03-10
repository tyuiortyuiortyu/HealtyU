import { Text, View, Alert, TextInput, TouchableOpacity, Image, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import images from '../../constants/images';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ApiHelper from '../helpers/ApiHelper';
import RegisterResponse from '../response/RegisterResponse';
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RegisterScreen = () => {
    // URL API backend
    const API_BASE_URL = 'http://10.68.111.137:8000'; // taruh di sini bang

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isMinLengthMet, setIsMinLengthMet] = useState(false);
    const [hasLowercase, setHasLowercase] = useState(false);
    const [hasUppercase, setHasUppercase] = useState(false);
    const [hasNumber, setHasNumber] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    // Fungsi untuk memanggil API register
    const handleApiRegister = async () => {
        setIsLoading(true); 
        setError(''); // Reset error state sebelum memulai proses registrasi
    
        try {
            // Validasi input
            if (!name || !email || !password || !confirmPassword) {
                setError('Please fill in all required fields.');
                Alert.alert('Error', 'Please fill in all required fields.');
                return;
            }
    
            if (password !== confirmPassword) {
                setError('Password and confirmation password do not match.');
                Alert.alert('Error', 'Password and confirmation password do not match.');
                return;
            }
    
            if (!validateEmail(email)) {
                setError('Please enter a valid email address.');
                Alert.alert('Error', 'Please enter a valid email address.');
                return;
            }
    
            if (!isPasswordValid()) {
                setError('Password does not meet the requirements.');
                Alert.alert('Error', 'Password does not meet the requirements.');
                return;
            }
    
            // Buat objek RegisterModel dari data yang diinput
            const password_confirmation = confirmPassword;
            const registerData = { name, email, username, password, password_confirmation };
    
            console.log('Data yang dikirim:', registerData); // Log data yang dikirim
    
            // Panggil API menggunakan ApiHelper dengan URL lengkap
            const response = await ApiHelper.request<RegisterResponse>(`${API_BASE_URL}/api/auth/register`, 'POST', registerData);
    
            console.log('Response dari API:', response); // Log response dari API
    
            // Cek jika response valid dan mengandung access_token
            if (response?.output_schema?.access_token) {
                // Simpan access_token ke AsyncStorage
                await AsyncStorage.setItem('access_token', response.output_schema.access_token);
    
                // Simpan data user lainnya
                if (response.output_schema.name) {
                    await AsyncStorage.setItem('name', response.output_schema.name);
                }
                if (response.output_schema.email) {
                    await AsyncStorage.setItem('email', response.output_schema.email);
                }
                if (response.output_schema.username) {
                    await AsyncStorage.setItem('username', response.output_schema.username);
                }
                if (response.output_schema.password) {
                    await AsyncStorage.setItem('password', response.output_schema.password);
                }
                if (response.output_schema.password_confirmation) {
                    await AsyncStorage.setItem('password_confirmation', response.output_schema.password_confirmation);
                }

                // Simpan status register ke AsyncStorage
                // await AsyncStorage.setItem("isRegisterIn", "true");
                const userData = { name, email, username, password, password_confirmation };
                await AsyncStorage.setItem('userData', JSON.stringify(userData));

                // Tampilkan pesan sukses
                Alert.alert('Success', 'Registration successful!');
                router.push("/profile"); // Arahkan ke halaman profile setelah registrasi berhasil
            } else {
                // Jika tidak ada access_token, tampilkan pesan error dari API atau default
                const errorMessage = response?.error_schema?.error_message || 'Registration failed. Please try again.';
                setError(errorMessage);
                Alert.alert('Error', errorMessage);
            }
        } catch (error) {
            // Tangani error yang terjadi
            const errorMessage = error instanceof Error ? error.message : 'An error occurred. Please try again later.';
            setError(errorMessage);
            Alert.alert('Error', errorMessage);
            console.error('Registration error:', error);
        } finally {
            setIsLoading(false); // Set isLoading ke false setelah proses selesai
        }
    };

    // Validasi email
    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Validasi password
    const isPasswordValid = () => {
        return isMinLengthMet && hasLowercase && hasUppercase && hasNumber;
    };

    // Update state validasi password saat password berubah
    useEffect(() => {
        setIsMinLengthMet(password.length >= 8);
        setHasLowercase(/[a-z]/.test(password));
        setHasUppercase(/[A-Z]/.test(password));
        setHasNumber(/\d/.test(password));
    }, [password]);

    // Render item validasi password
    const renderValidationItem = (condition: boolean, text: string) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 2, width: '50%' }}>
            <Ionicons
                name={condition ? "checkmark-circle" : "ellipse-outline"}
                size={18}
                color={condition ? "#50C878" : "#bbb"}
                style={{ marginRight: 5 }}
            />
            <Text style={{ color: condition ? '#000' : '#8A8A8A' }}>{text}</Text>
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, backgroundColor: '#f9f9f9' }}
        >
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {/* Header */}
                <Text style={{ fontSize: 25, textAlign: 'center', fontWeight: 'bold', padding: 35 }}>Register</Text>

                {/* Input Fields */}
                <View style={{
                    flexDirection: 'row', alignItems: 'center', width: '85%', borderWidth: 1, borderColor: '#ddd',
                    backgroundColor: '#fff', borderRadius: 8, marginBottom: 20, paddingHorizontal: 10, elevation: 5
                }}>
                    <TextInput
                        style={{ flex: 1, fontSize: 16, paddingVertical: 12, color: '#000' }}
                        placeholder="Enter your name"
                        placeholderTextColor="#8A8A8A"
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <View style={{
                    flexDirection: 'row', alignItems: 'center', width: '85%', borderWidth: 1, borderColor: '#ddd',
                    backgroundColor: '#fff', borderRadius: 8, marginBottom: 20, paddingHorizontal: 10, elevation: 5
                }}>
                    <TextInput
                        style={{ flex: 1, fontSize: 16, paddingVertical: 12, color: '#000' }}
                        placeholder="Enter your email address"
                        placeholderTextColor="#8A8A8A"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View style={{
                    flexDirection: 'row', alignItems: 'center', width: '85%', borderWidth: 1, borderColor: '#ddd',
                    backgroundColor: '#fff', borderRadius: 8, marginBottom: 20, paddingHorizontal: 10, elevation: 5
                }}>
                    <TextInput
                        style={{ flex: 1, fontSize: 16, paddingVertical: 12, color: '#000' }}
                        placeholder="Enter your username"
                        placeholderTextColor="#8A8A8A"
                        value={username}
                        onChangeText={setUsername}
                    />
                </View>

                {/* Password Input */}
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

                {/* Password validation requirements */}
                <View style={{ width: '85%', marginBottom: 10, paddingLeft: 10, flexDirection: 'row', flexWrap: 'wrap' }}>
                    {renderValidationItem(isMinLengthMet, "Min. 8 characters")}
                    {renderValidationItem(hasLowercase, "Lowercase letter")}
                    {renderValidationItem(hasUppercase, "Uppercase letter")}
                    {renderValidationItem(hasNumber, "Number")}
                </View>

                {/* Confirm Password Input */}
                <View style={{
                    flexDirection: 'row', alignItems: 'center', width: '85%', borderWidth: 1, borderColor: '#ddd',
                    backgroundColor: '#fff', borderRadius: 8, marginBottom: 20, paddingHorizontal: 10, elevation: 5
                }}>
                    <TextInput
                        style={{ flex: 1, fontSize: 16, paddingVertical: 12, color: '#000' }}
                        placeholder="Confirm your password"
                        placeholderTextColor="#8A8A8A"
                        secureTextEntry={!showConfirmPassword}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <Ionicons
                            name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                            size={24}
                            color="#aaa"
                        />
                    </TouchableOpacity>
                </View>

                {/* Register Button */}
                <TouchableOpacity
                    style={{ backgroundColor: '#E7E8EE', padding: 18, borderRadius: 10, alignItems: 'center', width: '65%', marginBottom: 17 }}
                    onPress={handleApiRegister}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#000000" />
                    ) : (
                        <Text style={{ color: '#000000', fontSize: 16, fontWeight: 'bold' }}>Register</Text>
                    )}
                </TouchableOpacity>

                {/* Login Navigation */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: '#555' }}>
                        Already have an account?{' '}
                    </Text>
                    <Text style={{ color: "#2B4763", fontWeight: "bold" }} onPress={() => router.push("/login")}>
                        Login
                    </Text>
                </View>

                {/* More Login Methods */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20, width: '75%' }}>
                    <View style={{ flex: 1, height: 1, backgroundColor: '#EDEEF2' }} />
                    <Text style={{ marginHorizontal: 10, color: '#ADB0BB', fontSize: 14, fontWeight: 'bold' }}>
                        More Login Methods
                    </Text>
                    <View style={{ flex: 1, height: 1, backgroundColor: '#EDEEF2' }} />
                </View>

                {/* Social Media */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 2, marginBottom: 45 }}>
                    <Image source={images.google} style={{ width: 50, height: 50, resizeMode: 'contain', marginHorizontal: 10 }} />
                    <Image source={images.apple} style={{ width: 50, height: 50, resizeMode: 'contain', marginHorizontal: 10 }} />
                    <Image source={images.facebook} style={{ width: 50, height: 50, resizeMode: 'contain', marginHorizontal: 10 }} />
                    <Image source={images.twitter} style={{ width: 50, height: 50, resizeMode: 'contain', marginHorizontal: 10 }} />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default RegisterScreen;