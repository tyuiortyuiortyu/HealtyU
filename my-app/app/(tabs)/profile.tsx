import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Switch,
  TextInput,
  ScrollView,
  Platform,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiHelper } from '../helpers/ApiHelper'; // Pastikan ApiHelper sudah diimpor

const Profile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [isNotificationOn, setNotification] = useState(true);
  const [isEditing, setEditing] = useState(false);
  const [showHalloPage, setShowHalloPage] = useState(false);
  const [isLeaveModalVisible, setLeaveModalVisible] = useState(false);

  const [profileData, setProfileData] = useState({
    username: '',
    name: '',
    email: '',
    dob: '',
    gender: '',
    height: '',
    weight: '',
  });

  const [inputUsername, setInputUsername] = useState('');
  const [inputName, setInputName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputDob, setInputDob] = useState(null);
  const [inputGender, setInputGender] = useState('');
  const [inputHeight, setInputHeight] = useState('');
  const [inputWeight, setInputWeight] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [originalProfileData, setOriginalProfileData] = useState(null);

  const [isLoading, setIsLoading] = useState(true); // State untuk loading
  const [error, setError] = useState(null); // State untuk error

  useEffect(() => {
    if (isEditing) {
      setOriginalProfileData({ ...profileData });

      setInputUsername(profileData.username);
      setInputName(profileData.name);
      setInputEmail(profileData.email);
      setInputDob(profileData.dob ? new Date(profileData.dob) : null);
      setInputGender(profileData.gender);
      setInputHeight(profileData.height.replace(' cm', ''));
      setInputWeight(profileData.weight.replace(' kg', ''));
    }
  }, [isEditing]);

  useEffect(() => {
    if (showHalloPage) {
      setInputUsername(profileData.username);
      setInputName(profileData.name);
      setInputEmail(profileData.email);
      setInputDob(profileData.dob ? new Date(profileData.dob) : null);
      setInputGender(profileData.gender);
      setInputHeight(profileData.height.replace(' cm', ''));
      setInputWeight(profileData.weight.replace(' kg', ''));
    }
  }, [showHalloPage]);

  const toggleNotification = () => setNotification((prev) => !prev);

  const isFormValid =
    inputUsername &&
    inputName &&
    inputEmail &&
    inputDob &&
    inputGender &&
    inputHeight &&
    inputWeight;

  const handleSave = () => {
    if (isFormValid) {
      setProfileData({
        username: inputUsername,
        name: inputName,
        email: inputEmail,
        dob: inputDob.toISOString().split('T')[0],
        gender: inputGender,
        height: `${inputHeight} cm`,
        weight: `${inputWeight} kg`,
      });

      if (profileImage) {
        setProfileImage(profileImage);
      }

      setEditing(false);
      setShowHalloPage(false);
    } else {
      Alert.alert('Error', 'Please fill out all fields before continuing');
    }
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || inputDob;
    setShowDatePicker(Platform.OS === 'ios');
    setInputDob(currentDate);
  };

  const validateNumberInput = (text, setState) => {
    const numericRegex = /^[0-9]*$/;
    if (numericRegex.test(text)) {
      setState(text);
    }
  };

  const handleCancelLeave = () => {
    setLeaveModalVisible(false);
  };

  const handleLeaveWithoutSaving = () => {
    setLeaveModalVisible(false);
    setShowHalloPage(false);
    if (originalProfileData) {
      setProfileData(originalProfileData);
      setOriginalProfileData(null);
    }
  };

  const handleCancel = () => {
    setLeaveModalVisible(true);
  };

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need gallery access to set profile picture.');
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('http://your-backend-url/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.access_token) {
        await AsyncStorage.setItem('token', data.access_token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        console.log('Login berhasil');
      } else {
        console.log('Token tidak ditemukan');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const [user, setUser] = useState(null);

  // Fungsi untuk mengambil data profil dari API
  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Panggil API menggunakan ApiHelper
      const data = await ApiHelper.request('/api/profile', 'GET');

      // Update state dengan data yang diterima
      setProfileData({
        username: data.username,
        name: data.name,
        email: data.email,
        dob: data.dob,
        gender: data.gender,
        height: data.height,
        weight: data.weight,
      });

      setIsLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch profile data');
      setIsLoading(false);
    }
  };

  // Ambil data profil saat komponen dimount
  useEffect(() => {
    fetchProfileData();
  }, []);

  // Fungsi untuk menyimpan perubahan profil ke API
  const saveProfileData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const updatedData = {
        username: inputUsername,
        name: inputName,
        email: inputEmail,
        dob: inputDob.toISOString().split('T')[0],
        gender: inputGender,
        height: `${inputHeight} cm`,
        weight: `${inputWeight} kg`,
      };

      // Panggil API untuk menyimpan perubahan
      await ApiHelper.request('/api/profile', 'POST', updatedData);

      // Update state dengan data yang baru
      setProfileData(updatedData);
      setEditing(false);
      setShowHalloPage(false);
      setIsLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to save profile data');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    fetchUserData();
  }, []);

  if (!user) {
    return <Text>Loading...</Text>;
  }

  // Tampilkan loading indicator jika data sedang dimuat
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Tampilkan pesan error jika terjadi kesalahan
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red', fontSize: 18 }}>{error}</Text>
        <TouchableOpacity onPress={fetchProfileData} style={{ marginTop: 10 }}>
          <Text style={{ color: 'blue', fontSize: 16 }}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (showHalloPage) {
    return (
      <ScrollView style={{ flex: 1, padding: 10, marginTop: 10, marginLeft: 10, marginRight: 10 }}>
        <TouchableOpacity onPress={handleCancel} style={{ marginBottom: 20 }}>
          <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold' }}>Cancel</Text>
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: 'center', padding: 20, marginBottom: 20 }}>
          <TouchableOpacity onPress={pickImage}>
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#ccc',
              }}
            >
              {profileImage && (
                <Image
                  source={{ uri: profileImage }}
                  style={{ width: 100, height: 100, borderRadius: 50 }}
                  resizeMode="cover"
                />
              )}
            </View>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <Text style={{ fontSize: 25, fontWeight: 'bold', marginRight: 10 }}>{profileData.name}</Text>
          </View>
          <Text style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>{profileData.email}</Text>
        </View>

        <View style={{ alignItems: 'flex-start' }}>
          <Text style={{ fontSize: 16, marginBottom: 2, marginLeft: 4 }}>Username</Text>
          <TextInput
            placeholder="Enter your username"
            style={{
              width: '100%',
              backgroundColor: '#fff',
              padding: 15,
              borderRadius: 10,
              marginBottom: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
            value={inputUsername}
            onChangeText={setInputUsername}
            editable={true}
          />

          <Text style={{ fontSize: 16, marginBottom: 2, marginLeft: 4 }}>Name</Text>
          <TextInput
            placeholder="Enter your name"
            style={{
              width: '100%',
              backgroundColor: '#fff',
              padding: 15,
              borderRadius: 10,
              marginBottom: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
            value={inputName}
            onChangeText={setInputName}
            editable={true}
          />

          <Text style={{ fontSize: 16, marginBottom: 2, marginLeft: 4 }}>Email</Text>
          <TextInput
            placeholder="Enter your email address"
            style={{
              width: '100%',
              backgroundColor: '#fff',
              padding: 15,
              borderRadius: 10,
              marginBottom: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
            value={inputEmail}
            onChangeText={setInputEmail}
            editable={true}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <View style={{ width: '48%' }}>
              <Text style={{ fontSize: 16, marginBottom: 2, marginLeft: 4 }}>Date of Birth</Text>
              <TouchableOpacity
                style={{
                  width: '100%',
                  backgroundColor: '#fff',
                  padding: 15,
                  borderRadius: 10,
                  marginBottom: 20,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                  justifyContent: 'center',
                  height: 50,
                }}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ color: inputDob ? '#000' : '#888' }}>
                  {inputDob ? inputDob.toISOString().split('T')[0] : 'Enter your date of birth'}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={inputDob || new Date()}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                />
              )}
            </View>

            <View style={{ width: '48%' }}>
              <Text style={{ fontSize: 16, marginBottom: 2, marginLeft: 4 }}>Gender</Text>
              <View
                style={{
                  width: '100%',
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  marginBottom: 20,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                  height: 50,
                  justifyContent: 'center',
                }}
              >
                <Picker
                  selectedValue={inputGender}
                  enabled={true}
                  onValueChange={(itemValue) => setInputGender(itemValue)}
                  mode="dropdown"
                  style={{ fontSize: 14, width: '100%', color: inputGender ? 'black' : 'gray' }}
                >
                  <Picker.Item label="Select Gender" value="" color="gray" style={{ fontSize: 14 }} />
                  <Picker.Item label="Female" value="Female" style={{ fontSize: 14 }} />
                  <Picker.Item label="Male" value="Male" style={{ fontSize: 14 }} />
                </Picker>
              </View>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <View style={{ width: '48%' }}>
              <Text style={{ fontSize: 16, marginBottom: 2, marginLeft: 4 }}>Height</Text>
              <TextInput
                placeholder="Enter your height (in cm)"
                style={{
                  width: '100%',
                  backgroundColor: '#fff',
                  padding: 15,
                  borderRadius: 10,
                  marginBottom: 20,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                  height: 50,
                }}
                value={inputHeight}
                onChangeText={(text) => validateNumberInput(text, setInputHeight)}
                keyboardType="numeric"
                editable={true}
              />
            </View>

            <View style={{ width: '48%' }}>
              <Text style={{ fontSize: 16, marginBottom: 2, marginLeft: 4 }}>Weight</Text>
              <TextInput
                placeholder="Enter your weight (in kg)"
                style={{
                  width: '100%',
                  backgroundColor: '#fff',
                  padding: 15,
                  borderRadius: 10,
                  marginBottom: 20,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                  height: 50,
                }}
                value={inputWeight}
                onChangeText={(text) => validateNumberInput(text, setInputWeight)}
                keyboardType="numeric"
                editable={true}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={{
            alignSelf: 'center',
            backgroundColor: isFormValid ? '#2B4763' : '#ccc',
            paddingVertical: 15,
            paddingHorizontal: 30,
            borderRadius: 30,
            marginTop: 15,
            marginBottom: 30,
          }}
          onPress={handleSave}
        >
          <Text style={{ fontSize: 18, color: isFormValid ? 'white' : '#666', fontWeight: 'bold' }}>
            Save
          </Text>
        </TouchableOpacity>

        <Modal
          visible={isLeaveModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCancelLeave}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <View
              style={{
                backgroundColor: '#fff',
                padding: 20,
                borderRadius: 10,
                width: 300,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 5,
                elevation: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  marginBottom: 20,
                  textAlign: 'center',
                  color: '#666',
                }}
              >
                Leave without saving your post? Your changes won’t be saved.
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <TouchableOpacity
                  onPress={handleCancelLeave}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: '#ccc',
                  }}
                >
                  <Text style={{ fontWeight: 'bold', color: 'black' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleLeaveWithoutSaving}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 20,
                    backgroundColor: '#ff4444',
                  }}
                >
                  <Text style={{ fontWeight: 'bold', color: 'white' }}>Leave</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }

  if (isEditing) {
    return (
      <ScrollView style={{ flex: 1, padding: 10, marginTop: 10, marginLeft: 10, marginRight: 10 }}>
        <TouchableOpacity
          onPress={() => {
            setEditing(false);
            if (originalProfileData) {
              setProfileData(originalProfileData);
              setOriginalProfileData(null);
            }
          }}
          style={{ marginBottom: 20 }}
        >
          <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold' }}>Cancel</Text>
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: 'center', padding: 20, marginBottom: 20 }}>
          <TouchableOpacity>
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#ccc',
              }}
            >
              {profileImage && (
                <Image
                  source={{ uri: profileImage }}
                  style={{ width: 100, height: 100, borderRadius: 50 }}
                  resizeMode="cover"
                />
              )}
            </View>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 25, fontWeight: 'bold', marginRight: 10 }}>{profileData.name}</Text>
            <TouchableOpacity onPress={() => setShowHalloPage(true)}>
              <MaterialIcons name="edit" size={20} color="#000" />
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>{profileData.email}</Text>
        </View>

        <View style={{ alignItems: 'flex-start' }}>
          <Text style={{ fontSize: 16, marginBottom: 2, marginLeft: 4 }}>Username</Text>
          <TextInput
            placeholder="Enter your username"
            style={{
              width: '100%',
              backgroundColor: '#fff',
              padding: 15,
              borderRadius: 10,
              marginBottom: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
            value={inputUsername}
            onChangeText={setInputUsername}
            editable={false}
          />

          <Text style={{ fontSize: 16, marginBottom: 2, marginLeft: 4 }}>Name</Text>
          <TextInput
            placeholder="Enter your name"
            style={{
              width: '100%',
              backgroundColor: '#fff',
              padding: 15,
              borderRadius: 10,
              marginBottom: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
            value={inputName}
            onChangeText={setInputName}
            editable={false}
          />

          <Text style={{ fontSize: 16, marginBottom: 2, marginLeft: 4 }}>Email</Text>
          <TextInput
            placeholder="Enter your email address"
            style={{
              width: '100%',
              backgroundColor: '#fff',
              padding: 15,
              borderRadius: 10,
              marginBottom: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
            value={inputEmail}
            onChangeText={setInputEmail}
            editable={false}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <View style={{ width: '48%' }}>
              <Text style={{ fontSize: 16, marginBottom: 2, marginLeft: 4 }}>Date of Birth</Text>
              <TouchableOpacity
                style={{
                  width: '100%',
                  backgroundColor: '#fff',
                  padding: 15,
                  borderRadius: 10,
                  marginBottom: 20,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                  justifyContent: 'center',
                  height: 50,
                }}
                disabled={true}
              >
                <Text style={{ color: inputDob ? '#000' : '#888' }}>
                  {inputDob ? inputDob.toISOString().split('T')[0] : 'Enter your date of birth'}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={inputDob || new Date()}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                />
              )}
            </View>

            <View style={{ width: '48%' }}>
              <Text style={{ fontSize: 16, marginBottom: 2, marginLeft: 4 }}>Gender</Text>
              <View
                style={{
                  width: '100%',
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  marginBottom: 20,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                  height: 50,
                  justifyContent: 'center',
                }}
              >
                <Picker
                  selectedValue={inputGender}
                  enabled={false}
                  mode="dropdown"
                  style={{ fontSize: 14, width: '100%', color: inputGender ? 'black' : 'gray' }}
                >
                  <Picker.Item label="Select Gender" value="" color="gray" style={{ fontSize: 14 }} />
                  <Picker.Item label="Female" value="Female" style={{ fontSize: 14 }} />
                  <Picker.Item label="Male" value="Male" style={{ fontSize: 14 }} />
                </Picker>
              </View>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <View style={{ width: '48%' }}>
              <Text style={{ fontSize: 16, marginBottom: 2, marginLeft: 4 }}>Height</Text>
              <TextInput
                placeholder="Enter your height (in cm)"
                style={{
                  width: '100%',
                  backgroundColor: '#fff',
                  padding: 15,
                  borderRadius: 10,
                  marginBottom: 20,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                  height: 50,
                }}
                value={inputHeight}
                onChangeText={(text) => validateNumberInput(text, setInputHeight)}
                keyboardType="numeric"
                editable={false}
              />
            </View>

            <View style={{ width: '48%' }}>
              <Text style={{ fontSize: 16, marginBottom: 2, marginLeft: 4 }}>Weight</Text>
              <TextInput
                placeholder="Enter your weight (in kg)"
                style={{
                  width: '100%',
                  backgroundColor: '#fff',
                  padding: 15,
                  borderRadius: 10,
                  marginBottom: 20,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                  height: 50,
                }}
                value={inputWeight}
                onChangeText={(text) => validateNumberInput(text, setInputWeight)}
                keyboardType="numeric"
                editable={false}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5', marginTop: 25 }}>
      <View style={{ alignItems: 'center', padding: 20 }}>
        <TouchableOpacity>
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#ccc',
            }}
          >
            {profileImage && (
              <Image
                source={{ uri: profileImage }}
                style={{ width: 100, height: 100, borderRadius: 50 }}
                resizeMode="cover"
              />
            )}
          </View>
        </TouchableOpacity>
        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>{profileData.name}</Text>
        <Text style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>{profileData.email}</Text>
      </View>

      <View style={{ marginTop: 12, paddingHorizontal: 20 }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            padding: 15,
            borderRadius: 10,
            marginBottom: 15,
            shadowColor: '#000',
            shadowOffset: { width: 5, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 2,
          }}
          onPress={() => setEditing(true)}
        >
          <MaterialIcons name="edit" size={20} color="#000" style={{ marginRight: 10 }} />
          <Text style={{ fontSize: 16, flex: 1, fontWeight: '600' }}>Ubah Informasi Profil</Text>
        </TouchableOpacity>

        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: { width: 5, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 2,
            marginBottom: 15,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15, marginTop: -10, marginBottom: -10 }}>
            <MaterialIcons name="notifications" size={20} color="#000" style={{ marginRight: 10 }} />
            <Text style={{ fontSize: 16, flex: 1, fontWeight: '600' }}>Notifikasi</Text>
            <Switch value={isNotificationOn} onValueChange={toggleNotification} />
          </View>

          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 15, marginTop: -8 }}>
            <MaterialIcons name="security" size={20} color="#000" style={{ marginRight: 10 }} />
            <Text style={{ fontSize: 16, flex: 1, fontWeight: '600' }}>Keamanan</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: { width: 5, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 2,
            marginBottom: 15,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 15,
            }}
          >
            <MaterialIcons name="help-outline" size={20} color="#000" style={{ marginRight: 10 }} />
            <Text style={{ fontSize: 16, flex: 1, fontWeight: '600' }}>Bantuan & Dukungan</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 15, marginTop: -8 }}>
            <MaterialIcons name="contact-support" size={20} color="#000" style={{ marginRight: 10 }} />
            <Text style={{ fontSize: 16, flex: 1, fontWeight: '600' }}>Hubungi Kami</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 15, marginTop: -8 }}>
            <MaterialIcons name="privacy-tip" size={20} color="#000" style={{ marginRight: 10 }} />
            <Text style={{ fontSize: 16, flex: 1, fontWeight: '600' }}>Kebijakan Privasi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Profile;