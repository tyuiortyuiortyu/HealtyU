import React, {useState} from 'react';
import { View, Text, TouchableOpacity, Image, Switch, TextInput } from 'react-native';

import images from '../../constants/images';
import icons from '../../constants/icons';

const Profile = () => {
  const [isNotificationOn, setNotification] = useState(true);
  const [isEditing, setEditing] = useState(false);

  // State untuk data profil
  const [profileData, setProfileData] = useState({
    name: 'Nikita',
    phone: '085248181233',
    email: 'nikita.niki2410@gmail.com',
  });

  // State untuk input form
  const [inputName, setInputName] = useState('');
  const [inputPhone, setInputPhone] = useState('');
  const [inputEmail, setInputEmail] = useState('');

  const toggleNotification = () => setNotification((prev) => !prev);

  // Cek apakah semua input terisi
  const isFormValid = inputName && inputPhone && inputEmail;

  const handleSave = () => {
    if (isFormValid) {
      setProfileData({
        name: inputName,
        phone: inputPhone,
        email: inputEmail,
      });
      setEditing(false); // Keluar dari mode edit
      setInputName(''); // Reset input
      setInputPhone('');
      setInputEmail('');
    } else {
      console.log('Please fill out all fields before continuing');
    }
  };
  
  if (isEditing) {
    return (
      <View style={{ flex: 1, padding: 10, marginTop: 10, marginLeft: 10, marginRight: 10 }}>
      {/* Cancel */}
      <TouchableOpacity onPress={() => setEditing(false)} style={{ marginBottom: 20 }}>
        <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold' }}>
          Cancel
        </Text>
      </TouchableOpacity>

      {/* Profile Picture */}
      <View style={{ alignItems: 'center', padding: 20, marginBottom: 20 }}>
        <Image
          source={images.profile}
          style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 10 }}
        />
        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>{profileData.name}</Text>
        <Text style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
          {profileData.email} | {profileData.phone}
        </Text>

        <TouchableOpacity>
          <Text style={{ fontSize: 16, color: '#007BFF', marginBottom: 10 }}>
            Ganti Foto
          </Text>
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
      <View style={{alignItems: 'flex-start' }}>
        <Text style={{ fontSize: 16, marginBottom: 2, marginLeft: 4 }}>Name</Text>
        <TextInput 
          placeholder="Enter your Name"
          style={{ 
            width: 340,
            alignItems: 'center', 
            backgroundColor: '#fff', 
            padding: 15, 
            paddingVertical: 15,
            paddingHorizontal: 20,
            borderRadius: 10, 
            marginBottom: 20, 
            marginRight: 5,
            shadowColor: '#000', 
            shadowOffset: { width: 5, height: 4 }, 
            shadowOpacity: 0.5, 
            shadowRadius: 4, 
            elevation: 2
          }}
          value={inputName}
          onChangeText={setInputName} // Update name input
        />

        <Text style={{ fontSize: 16, marginBottom: 2, marginLeft: 4 }}>Nomor Telepon</Text>
        <TextInput 
          placeholder="Enter your Phone Number"
          style={{ 
            width: 340,
            alignItems: 'center', 
            backgroundColor: '#fff', 
            padding: 15, 
            paddingVertical: 15,
            paddingHorizontal: 20,
            borderRadius: 10, 
            marginBottom: 20, 
            marginRight: 5,
            shadowColor: '#000', 
            shadowOffset: { width: 5, height: 4 }, 
            shadowOpacity: 0.5, 
            shadowRadius: 4, 
            elevation: 2
          }}
          value={inputPhone}
          onChangeText={setInputPhone} // Update phone input
        />

        <Text style={{ fontSize: 16, marginBottom: 2, marginLeft: 4 }}>Email</Text>
        <TextInput 
          placeholder="Enter your Email"
          style={{ 
            width: 340,
            alignItems: 'center', 
            backgroundColor: '#fff', 
            padding: 15, 
            paddingVertical: 15,
            paddingHorizontal: 20,
            borderRadius: 10, 
            marginBottom: 20, 
            marginRight: 5,
            shadowColor: '#000', 
            shadowOffset: { width: 5, height: 4 }, 
            shadowOpacity: 0.5, 
            shadowRadius: 4, 
            elevation: 2
          }}
          value={inputEmail}
          onChangeText={setInputEmail} // Update email input
        />
      </View>

      {/* Tombol Save */}
      <TouchableOpacity
        style={{ 
          alignSelf: 'center',
          backgroundColor: isFormValid ? '#2B4763' : 'white', // Biru jika form valid, putih jika tidak
          paddingVertical: 15,
          paddingHorizontal: 30,
          borderRadius: 30,
          marginTop: 15,
        }}
        onPress={handleSave}
      >
        <Text style={{
          fontSize: 18, color: isFormValid ? 'white' : '#B9BCC6', fontWeight: 'bold' }}>
          Save
        </Text>
      </TouchableOpacity>
    </View>
  );
};

  return (
    <View style={{flex: 1, backgroundColor: '#f5f5f5', marginTop: 25}}>
      {/* Profile */}
      <View style={{ alignItems: 'center', padding: 20 }}>
        <Image
          source={images.profile}
          style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 10 }}
        />
        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>{profileData.name}</Text>
        <Text style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
          {profileData.email} | {profileData.phone}
        </Text>
      </View>

      {/* Ubah Informasi Profil */}
      <View style={{marginTop: 12, paddingHorizontal: 20}}>
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
            elevation: 2
          }}
          onPress={() => setEditing(true)} // Mengubah state isEditing menjadi true
        >
          <Image source={icons.ubah_profile} style={{marginRight: 10}}/>
          <Text style={{fontSize: 16, flex: 1, fontWeight: 600}}>Ubah Informasi Profil</Text>
        </TouchableOpacity>

        {/* Notifikasi dan Keamanan dalam satu blok */}
        <View style={{ backgroundColor: '#fff', borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 5, height: 4 }, shadowOpacity: 0.5, 
          shadowRadius: 4, elevation: 2, marginBottom: 15}}>
          {/* Notifikasi */}
          <View style={{flexDirection: 'row', alignItems: 'center', padding: 15, marginTop: -10, marginBottom: -10}}>
            <Image source={icons.notifikasi} style={{marginRight: 10}}/>
            <Text style={{fontSize: 16, flex: 1, fontWeight: 600}}>Notifikasi</Text>
            <Switch
              value={isNotificationOn}
              onValueChange={toggleNotification}
            />
          </View>

          {/* Keamanan */}
          <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', padding: 15,  marginTop: -8}}>
            <Image source={icons.keamanan} style={{marginRight: 10}}/>
            <Text style={{fontSize: 16, flex: 1, fontWeight: 600}}>Keamanan</Text>
          </TouchableOpacity>           
        </View>

        <View style={{ backgroundColor: '#fff', borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 5, height: 4 }, shadowOpacity: 0.5, 
          shadowRadius: 4, elevation: 2, marginBottom: 15 }}>
          {/* Bantuan & Dukungan */}
          <TouchableOpacity 
            style={{
              flexDirection: 'row', 
              alignItems: 'center', 
              padding: 15}}
          >
            <Image source={icons.bantuan} style={{marginRight: 10}}/>
            <Text style={{fontSize: 16, flex: 1, fontWeight: 600}}>Bantuan & Dukungan</Text>
          </TouchableOpacity>

          {/* Hubungi Kami */}
          <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', padding: 15, marginTop: -8}}>
            <Image source={icons.hubungi} style={{marginRight: 10}}/>
            <Text style={{fontSize: 16, flex: 1, fontWeight: 600}}>Hubungi Kami</Text>
          </TouchableOpacity>

          {/* Kebijakan Privasi */}
          <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', padding: 15, marginTop: -8}}>
            <Image source={icons.kebijakan} style={{marginRight: 10}}/>
            <Text style={{fontSize: 16, flex: 1, fontWeight: 600}}>Kebijakan Privasi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Profile;
