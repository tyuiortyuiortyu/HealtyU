import { Text, View, Alert, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';

import images from '../../constants/images';
import icons from '../../constants/icons';

const register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false); // State untuk password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State untuk confirm password

  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    Alert.alert('Success', `Welcome, ${name}! Your account has been registered.`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f9f9f9', alignItems: 'center', justifyContent: 'center' }}>
      {/* Header */}
      <Text style={{ fontSize: 25, textAlign: 'center', fontWeight: 'bold', padding: 35 }}>Register</Text>

      {/* Input Fields */}
      <TextInput style={{ width: '85%', borderWidth: 1, borderColor: '#ddd', padding: 16, borderRadius: 8, marginBottom: 20, 
        backgroundColor: '#fff', fontSize: 16, elevation: 5,}}
        placeholder="Enter your name"
        placeholderTextColor="#8A8A8A"
        value={name}
        onChangeText={setName}
      />
      <TextInput style={{ width: '85%', borderWidth: 1, borderColor: '#ddd', padding: 16, borderRadius: 8, marginBottom: 20, 
        backgroundColor: '#fff', fontSize: 16, elevation: 5,}}
        placeholder="Enter your email address"
        placeholderTextColor="#8A8A8A"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password Input */}
      <View style={{ flexDirection: 'row', alignItems: 'center', width: '85%', borderWidth: 1, borderColor: '#ddd', 
        backgroundColor: '#fff', borderRadius: 8, marginBottom: 20, paddingHorizontal: 10, elevation: 5 }}>
        <TextInput style={{ flex: 1, fontSize: 16, paddingVertical: 12, color: '#000' }}
          placeholder="Enter your password"
          placeholderTextColor="#8A8A8A"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Image
            source={showPassword ? icons.pop_eye : icons.spy}
            style={{ width: 24, height: 24, tintColor: '#aaa', alignContent: 'center' }}
          />
        </TouchableOpacity>
      </View>

      {/* Confirm Password Input */}
      <View style={{ flexDirection: 'row', alignItems: 'center', width: '85%', borderWidth: 1, borderColor: '#ddd', 
      backgroundColor: '#fff', borderRadius: 8, marginBottom: 20, paddingHorizontal: 10, elevation: 5 }}>
        <TextInput style={{ flex: 1, fontSize: 16, paddingVertical: 12, color: '#000' }} 
          placeholder="Confirm your Password"
          placeholderTextColor="#8A8A8A"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Image
            source={showConfirmPassword ? icons.pop_eye : icons.spy}
            style={{ width: 24, height: 24, tintColor: '#aaa' }}
          />
        </TouchableOpacity>
      </View>

      {/* Register Button */}
      <TouchableOpacity style={{ backgroundColor: '#E7E8EE', padding: 18, borderRadius: 10, alignItems: 'center', width: '65%', marginBottom: 17}}
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

export default register;
