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
import { ApiHelper } from '../helpers/ApiHelper';
import { ProfileResponse } from '../response/ProfileResponse';

const API_BASE_URL = 'http://192.168.100.45:8000/api/auth'; // ini kann?

const Profile = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
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
  const [inputDob, setInputDob] = useState<Date | null>(null);
  const [inputGender, setInputGender] = useState('');
  const [inputHeight, setInputHeight] = useState('');
  const [inputWeight, setInputWeight] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [originalProfileData, setOriginalProfileData] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

//   // Fungsi untuk mengambil data profil dari API
//   const fetchProfileData = async () => {
//     try {
//       setIsLoading(true);
//       const accessToken = await AsyncStorage.getItem('access_token');

//       if (!accessToken) {
//         Alert.alert('Error', 'No access token found. Please log in again.');
//         return;
//       }

//       const response = await ApiHelper.request<ProfileResponse>(
//         `${API_BASE_URL}/profile`,
//         'GET',
//         null,
//         accessToken
//       );

//       if (!response.output_schema) {
//         const errorMessage = response.error_schema?.error_message || 'Failed to fetch profile data.';
//         Alert.alert('Error', errorMessage);
//         return;
//       }

//       setProfileData({
//         username: response.output_schema.username || '',
//         name: response.output_schema.name || '',
//         email: response.output_schema.email || '',
//         dob: response.output_schema.dob || '',
//         gender: response.output_schema.gender || '',
//         height: String(response.output_schema.height) || '',
//         weight: String(response.output_schema.weight) || '',
//       });

//       if (response.output_schema.profile_picture) {
//         setProfileImage(response.output_schema.profile_picture);
//       }

//       await AsyncStorage.setItem('profile_data', JSON.stringify(response.output_schema));
//     } catch (error) {
//       console.error('Profile error:', error);
//       setError((error as Error).message || 'Failed to fetch profile data.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

  // Fungsi untuk mengambil data profil dari AsyncStorage
  const fetchProfileDataFromStorage = async () => {
    try {
      setIsLoading(true);
      const storedProfileData = await AsyncStorage.getItem('profile_data');

      if (storedProfileData) {
        const parsedProfileData = JSON.parse(storedProfileData);
        setProfileData({
          username: parsedProfileData.username || '',
          name: parsedProfileData.name || '',
          email: parsedProfileData.email || '',
          dob: parsedProfileData.dob || '',
          gender: parsedProfileData.gender || '',
          height: String(parsedProfileData.height) || '',
          weight: String(parsedProfileData.weight) || '',
        });

        if (parsedProfileData.profile_picture) {
          setProfileImage(parsedProfileData.profile_picture);
        }
      } else {
        Alert.alert('Error', 'No profile data found in storage.');
      }
    } catch (error) {
      console.error('Error fetching profile data from storage:', error);
      setError('Failed to fetch profile data from storage.');
    } finally {
      setIsLoading(false);
    }
  };

    // Memuat data profil dari AsyncStorage saat komponen pertama kali di-render
    useEffect(() => {
        fetchProfileDataFromStorage();
        }, []);

        // Tampilkan loading indicator jika data sedang dimuat
        if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

   // Fungsi untuk menyimpan perubahan profil ke API
   const saveProfileData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const accessToken = await AsyncStorage.getItem('access_token');

      if (!accessToken) {
        Alert.alert('Error', 'No access token found. Please log in again.');
        return;
      }

      const formData = new FormData();
      formData.append('username', inputUsername);
      formData.append('name', inputName);
      formData.append('email', inputEmail);
      formData.append('dob', inputDob ? inputDob.toISOString().split('T')[0] : '');
      formData.append('gender', inputGender);
      formData.append('height', `${inputHeight} cm`);
      formData.append('weight', `${inputWeight} kg`);

      if (profileImage) {
        formData.append('profile_picture', {
          uri: profileImage,
          name: 'profile.jpg',
          type: 'image/jpeg',
        } as any);
      }

      const response = await ApiHelper.request(
        `${API_BASE_URL}/updateProfile`,
        'POST',
        formData,
        accessToken,
        true
      );

      // Simpan data yang baru ke AsyncStorage
      const updatedProfileData = {
        username: inputUsername,
        name: inputName,
        email: inputEmail,
        dob: inputDob ? inputDob.toISOString().split('T')[0] : '',
        gender: inputGender,
        height: `${inputHeight} cm`,
        weight: `${inputWeight} kg`,
        profile_picture: profileImage,
      };

      await AsyncStorage.setItem('profile_data', JSON.stringify(updatedProfileData));

      setProfileData(updatedProfileData);
      setEditing(false);
      setShowHalloPage(false);
      setIsLoading(false);

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Save profile error:', error);
      setError(error instanceof Error ? error.message : 'Failed to save profile data.');
      setIsLoading(false);
      Alert.alert('Error', 'Failed to save profile data. Please try again.');
    }
  };

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
        <TouchableOpacity onPress={fetchProfileDataFromStorage} style={{ marginTop: 10 }}>
          <Text style={{ color: 'blue', fontSize: 16 }}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

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

  const onChangeDate = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || inputDob;
    setShowDatePicker(Platform.OS === 'ios');
    setInputDob(currentDate);
  };

  const validateNumberInput = (text: string, setState: React.Dispatch<React.SetStateAction<string>>) => {
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

  if (showHalloPage) {
    return (
      <ScrollView style={{ flex: 1, padding: 10, marginTop: 10, marginLeft: 10, marginRight: 10 }}>
        <TouchableOpacity onPress={handleCancel} style={{ marginBottom: 20 }}>
          <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold' }}>Cancel</Text>
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: 'center', padding: 20, marginBottom: 20, backgroundColor: "#fff" }}>
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
                {profileImage ? (
                <Image
                    source={{ uri: profileImage }}
                    style={{ width: 100, height: 100, borderRadius: 50 }}
                    resizeMode="cover"
                />
                ) : (
                <MaterialIcons name="person" size={50} color="#fff" />
                )}
            </View>
          </TouchableOpacity>
          <Text style={{ fontSize: 25, fontWeight: 'bold' }}>{profileData.name}</Text>
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
            editable={isEditing}
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
                  {inputDob ? new Date(inputDob).toISOString().split('T')[0] : 'Enter your date of birth'}
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
                backgroundColor: "#fff",
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
                  {inputDob ? new Date(inputDob).toISOString().split('T')[0] : 'Enter your date of birth'}
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