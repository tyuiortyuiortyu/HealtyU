import { Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

import images from '../../constants/images';

const BMI = ({ navigation }) => {
  const [selectedGender, setSelectedGender] = useState(null); // 'male' or 'female'
  const [continuePressed, setContinuePressed] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', padding: 30 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 8 }}>
        <Text style={{ fontSize: 50, fontWeight: 'bold', color: '#BBDA04', marginRight: 5 }}>
          BMI
        </Text>
        <Text style={{ fontSize: 50, fontWeight: 'bold', color: '#FFAF23' }}>
          Calculator
        </Text>
        <Image 
          source={images.bmi} 
          style={{ width: 40, height: 40, marginLeft: 10 }} 
        />
      </View>

      <Text style={{ color: 'black', fontSize: 15, fontWeight: 'semibold', textAlign: 'left' }}>
        We calculate the BMI index based on data such as age, height, and weight.
      </Text>

      <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 20, width: '100%' }}>
        Please select your gender
      </Text>

      {/* Tombol Male */}
      <TouchableOpacity 
        style={{
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          backgroundColor: selectedGender === 'male' ? '#E7F3FB' : 'white',
          padding: 30,
          borderRadius: 30,
          marginTop: 15,
        }}
        onPress={() => setSelectedGender('male')}
      >
        <Text style={{ fontSize: 25, color: '#22689E', fontWeight: 'bold', marginRight: 20 }}>
          Male
        </Text>
        <Image 
          source={images.male} 
          style={{ width: 90, height: 95 }}
        />
      </TouchableOpacity>

      {/* Tombol Female */}
      <TouchableOpacity 
        style={{
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          backgroundColor: selectedGender === 'female' ? '#FBE7E7' : 'white',
          padding: 30,
          borderRadius: 30,
          marginTop: 15,
        }}
        onPress={() => setSelectedGender('female')}
      >
        <Text style={{ fontSize: 25, color: '#FF6757', fontWeight: 'bold', marginRight: 10 }}>
          Female
        </Text>
        <Image 
          source={images.female} 
          style={{ width: 90, height: 95 }}
        />
      </TouchableOpacity>

      {/* Tombol Continue */}
      <TouchableOpacity 
        style={{
          alignSelf: 'center',
          backgroundColor: continuePressed ? '#2B4763' : 'black',
          paddingVertical: 15,
          paddingHorizontal: 30,
          borderRadius: 30,
          marginTop: 20,
        }}
        onPress={() => {
          setContinuePressed(true);
          setTimeout(() => navigation.navigate('EmptyPage'), 200); // Ganti ke halaman kosong ???
        }}
      >
        <Text style={{ fontSize: 18, color: continuePressed ? 'white' : '#B9BCC6', fontWeight: 'bold' }}>
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default BMI