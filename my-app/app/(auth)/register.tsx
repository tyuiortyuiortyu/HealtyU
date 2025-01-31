import { Text, View, Alert, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import images from '../../constants/images';
import Ionicons from 'react-native-vector-icons/Ionicons';

const RegisterScreen = () => {
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


    useEffect(() => {
        setIsMinLengthMet(password.length >= 8);
        setHasLowercase(/[a-z]/.test(password));
        setHasUppercase(/[A-Z]/.test(password));
        setHasNumber(/\d/.test(password));
    }, [password])

    const isPasswordValid = () => {
        return isMinLengthMet && hasLowercase && hasUppercase && hasNumber;
    }

    const handleRegister = () => {
        if (!name || !username || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        if (!isPasswordValid()) {
            Alert.alert('Error', 'Password does not meet requirements');
            return;
        }

        if (!email.includes('@')) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        Alert.alert('Success', `Welcome, ${name}! Your account has been registered.`);
    };


     const renderValidationItem = (condition, text) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 2, width: '50%', }}>
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
        <View style={{ flex: 1, backgroundColor: '#f9f9f9', alignItems: 'center', justifyContent: 'center' }}>
            {/* Header */}
            <Text style={{ fontSize: 25, textAlign: 'center', fontWeight: 'bold', padding: 35 }}>Register</Text>

            {/* Input Fields */}
            <TextInput style={{
                width: '85%', borderWidth: 1, borderColor: '#ddd', padding: 16, borderRadius: 8, marginBottom: 20,
                backgroundColor: '#fff', fontSize: 16, elevation: 5,
            }}
                placeholder="Enter your name"
                placeholderTextColor="#8A8A8A"
                value={name}
                onChangeText={setName}
            />


            <TextInput style={{
                width: '85%', borderWidth: 1, borderColor: '#ddd', padding: 16, borderRadius: 8, marginBottom: 20,
                backgroundColor: '#fff', fontSize: 16, elevation: 5,
            }}
                placeholder="Enter your email address"
                placeholderTextColor="#8A8A8A"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
             <TextInput style={{
                width: '85%', borderWidth: 1, borderColor: '#ddd', padding: 16, borderRadius: 8, marginBottom: 20,
                backgroundColor: '#fff', fontSize: 16, elevation: 5,
            }}
                placeholder="Enter your username"
                placeholderTextColor="#8A8A8A"
                value={username}
                onChangeText={setUsername}
            />
             {/* Password Input */}
              <View style={{
                flexDirection: 'row', alignItems: 'center', width: '85%', borderWidth: 1, borderColor: '#ddd',
                backgroundColor: '#fff', borderRadius: 8, marginBottom: 10, paddingHorizontal: 10, elevation: 5
            }}>
                <TextInput style={{ flex: 1, fontSize: 16, paddingVertical: 12, color: '#000' }}
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
                <TextInput style={{ flex: 1, fontSize: 16, paddingVertical: 12, color: '#000' }}
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
            <TouchableOpacity style={{ backgroundColor: '#E7E8EE', padding: 18, borderRadius: 10, alignItems: 'center', width: '65%', marginBottom: 17 }}
                onPress={handleRegister}>
                <Text style={{ color: '#000000', fontSize: 16, fontWeight: 'bold' }}>Register</Text>
            </TouchableOpacity>

            {/* Login Navigation */}
            <Text style={{ fontSize: 16, color: '#555' }}>
                Already have an account? <Text style={{ color: '#2B4763', fontWeight: 'bold' }}>Log In</Text>
            </Text>

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
    );
};

export default RegisterScreen;