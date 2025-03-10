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
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiHelper } from '../helpers/ApiHelper';
import { ProfileResponse } from '../response/ProfileResponse';

const API_BASE_URL = 'http://10.68.110.255:8081';

const Profile = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isNotificationOn, setNotification] = useState(true);
  const [isEditing, setEditing] = useState(false);
  const [showHalloPage, setShowHalloPage] = useState(false);
  const [isLeaveModalVisible, setLeaveModalVisible] = useState(false);

  interface ProfileData {
    username: string;
    name: string;
    email: string;
    dob: string;
    gender: string;
    height: number;
    weight: number;
    profile_picture?: string | null;
  }

  const [profileData, setProfileData] = useState<ProfileData>({
    username: '',
    name: '',
    email: '',
    dob: '',
    gender: '',
    height: 0,
    weight: 0,
  });

  // Fungsi untuk memuat data profil dari AsyncStorage
  const fetchProfileDataFromStorage = async () => {
    try {
      setIsLoading(true);
      const storedProfileData = await AsyncStorage.getItem('userData');
      console.log('Stored Profile Data:', storedProfileData);
  
      if (storedProfileData) {
        const parsedProfileData = JSON.parse(storedProfileData);
        setProfileData({
          username: parsedProfileData.username,
          name: parsedProfileData.name,
          email: parsedProfileData.email,
          dob: parsedProfileData.dob || '',
          gender: parsedProfileData.gender || '',
          height: parsedProfileData.height || 0,
          weight: parsedProfileData.weight || 0,
        });
  
        if (parsedProfileData.profile_picture) {
          setProfileImage(parsedProfileData.profile_picture);
        }
      } else {
        throw new Error();
      }
    } catch (error) {
      alert('Failed to fetch profile data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Memuat data profil dari AsyncStorage saat komponen pertama kali di-render
  const checkGuestStatus = async () => {
    const isGuest = await AsyncStorage.getItem('isGuest');
    console.log('Is Guest:', isGuest);
  
    if (isGuest === 'true') {
      setIsLoading(true);
      setProfileData({
        username: 'Guest',
        name: 'Guest',
        email: '',
        dob: '',
        gender: '',
        height: 0,
        weight: 0,
      });
      setProfileImage(null);
      setIsLoading(false);
    } else {
      fetchProfileDataFromStorage();
    }
  };
  
  // Panggil fungsi ini di useEffect atau di tempat yang sesuai
  useEffect(() => {
    checkGuestStatus();
  }, []);

  useEffect(() => {
  const fetchProfileData = async () => {
    try {
      const storedProfileData = await AsyncStorage.getItem('userData');
      if (storedProfileData) {
        const parsedProfileData = JSON.parse(storedProfileData);
        setProfileData(parsedProfileData);
        // Set state input dengan data dari profileData
        setInputUsername(parsedProfileData.username);
        setInputName(parsedProfileData.name);
        setInputEmail(parsedProfileData.email);
        setInputDob(parsedProfileData.dob ? new Date(parsedProfileData.dob) : null);
        setInputGender(parsedProfileData.gender);
        setInputHeight(parsedProfileData.height);
        setInputWeight(parsedProfileData.weight);
      }
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
    }
  };

  fetchProfileData();
}, []);

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
  const router = useRouter();

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
      formData.append('height', inputHeight);
      formData.append('weight', inputWeight);

      if (profileImage) {
        formData.append('profile_picture', {
          uri: profileImage,
          name: 'profile.jpg',
          type: 'image/jpeg',
        } as any);
      }

      const response = await ApiHelper.request(
        `${API_BASE_URL}/api/auth/updateProfile`,
        'POST',
        formData,
        accessToken,
        true
      );

      console.log('Update Profile Response:', response);

      // Simpan data yang baru ke AsyncStorage
      const updatedProfileData = {
        username: inputUsername,
        name: inputName,
        email: inputEmail,
        dob: inputDob ? inputDob.toISOString().split('T')[0] : '',
        gender: inputGender,
        height: inputHeight,
        weight: inputWeight,
        profile_picture: profileImage,
      };
      
      await AsyncStorage.setItem('profile_data', JSON.stringify(updatedProfileData));

      setProfileData(updatedProfileData); // Perbarui state profileData
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
        if (hasChanges()) {
          setProfileData({
            username: inputUsername,
            name: inputName,
            email: inputEmail,
            dob: inputDob ? inputDob.toISOString().split('T')[0] : '',
            gender: inputGender,
            height: parseFloat(inputHeight),
            weight: parseFloat(inputWeight),
            profile_picture: profileImage,
          });
      
          if (profileImage) {
            setProfileImage(profileImage);
          }
      
          saveProfileData(); // Panggil fungsi untuk menyimpan data ke API
          setEditing(false);
          setShowHalloPage(false);
        } else {
          Alert.alert('Info', 'No changes detected.');
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

  const hasChanges = () => {
    return (
      inputUsername !== profileData.username ||
      inputName !== profileData.name ||
      inputEmail !== profileData.email ||
      (inputDob ? inputDob.toISOString().split('T')[0] : '') !== profileData.dob ||
      inputGender !== profileData.gender ||
      inputHeight !== profileData.height.toString() ||
      inputWeight !== profileData.weight.toString() ||
      profileImage !== profileData.profile_picture
    );
  };

  // Fungsi untuk logout
  const handleLogout = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      console.log('Access Token:', accessToken);
  
      if (accessToken) {
        await ApiHelper.logout();
      }
  
      await AsyncStorage.removeItem('isGuest');
      await AsyncStorage.removeItem('profile_data');
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('userData');
  
      console.log('Logged out successfully');
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };



  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  if (showHalloPage) {
    return (
      <ScrollView style={{ flex: 1, padding: 10, marginTop: 10, marginLeft: 10, marginRight: 10 }}>
        <TouchableOpacity onPress={handleCancel} style={{ marginBottom: 20 }}>
          <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold' }}>Cancel</Text>
        </TouchableOpacity>

        <View style={{ alignItems: 'center', padding: 20 }}>
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
            {/* Nama di bawah foto profil */}
            <Text style={{ fontSize: 25, fontWeight: 'bold', marginTop: 10 }}>{profileData.name}</Text>

            {/* {profileData.name === 'Guest' ? (
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>Guest Account</Text>
            ) : (
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>{profileData.email}</Text>
            )} */}

            {profileData.name === 'Guest' ? (
                <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>Guest Account</Text>
                <TouchableOpacity
                    onPress={() => router.push('/welcome')} // Arahkan ke halaman Welcome
                    style={{
                    backgroundColor: '#2B4763', // Warna background tombol
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 20,
                    marginTop: 10,
                    }}
                >
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Sign In</Text>
                </TouchableOpacity>
                </View>
            ) : (
                <Text style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>{profileData.email}</Text>
            )}

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
          disabled={!hasChanges()} // Nonaktifkan tombol jika tidak ada perubahan
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
    <View style={{ flex: 1, backgroundColor: 'white', marginTop: 25 }}>
        <View style={{ alignItems: 'center', padding: 20 }}>
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
        {/* Nama di bawah foto profil */}
        {/* {profileData.name === 'Guest' ? (
            <Text style={{ fontSize: 25, fontWeight: 'bold', marginTop: 10 }}>Guest Account</Text>
        ) : (
            <Text style={{ fontSize: 25, fontWeight: 'bold', marginTop: 10 }}>{profileData.name}</Text>
        )} */}
        {profileData.name === 'Guest' ? (
            <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 25, color: '#666', marginTop: 10 }}>Guest Account</Text>
            <TouchableOpacity
                onPress={() => router.push('/welcome')} // Arahkan ke halaman Welcome
                style={{
                backgroundColor: '#2B4763', // Warna background tombol
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 20,
                marginTop: 10,
                }}
            >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Sign In</Text>
            </TouchableOpacity>
            </View>
        ) : (
            <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#666', marginTop: 10 }}>{profileData.name}</Text>
        )}
        </View>

        {/* Tombol dan opsi lainnya */}
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
            onPress={() => {
            if (profileData.name !== 'Guest') {
                setEditing(true);
            } else {
                Alert.alert('Info', 'Guest users cannot edit profiles.');
            }
            }}
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
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15, marginTop: -8, marginBottom: -10 }}>
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

          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', padding: 15, marginTop: -8 }}
            onPress={handleLogout}  
          >
            <MaterialIcons name="logout" size={20} color="#000" style={{ marginRight: 10 }} />
            <Text style={{ fontSize: 16, flex: 1, fontWeight: '600' }}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Profile;