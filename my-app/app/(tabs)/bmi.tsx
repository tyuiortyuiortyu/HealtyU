
import { Text, View, Image, TouchableOpacity, TextInput } from 'react-native';
import React, { useState } from 'react';
import images from '../../constants/images';
// import Slider from '@react-native-community/slider';

const BMI = () => {
  const [selectedGender, setSelectedGender] = useState(null); // 'male' or 'female'
  const [continuePressed, setContinuePressed] = useState(false); // Untuk mengatur visibilitas elemen

  const [weight, setWeight] = useState(60);
  const [age, setAge] = useState(19);
  const [height, setHeight] = useState(165);
  // const [bmi, setBMI] = useState(null);// hasil dari BMI Calculator

  const handleWeightChange = (increment) => {
    setWeight((prev) => Math.max(1, prev + increment)); // Menghindari weight < -1
  };

  const handleAgeChange = (increment) => {
    setAge((prev) => Math.max(1, prev + increment)); // Menghindari usia < 1
  };

  const handleHeightChange = (value) => {
    setHeight(value);
  };

  // const calculateBMI = () => {
  //   const heightInMeters = height / 100; // Konversi dari cm ke meter
  //   const result = weight / (heightInMeters * heightInMeters); // Rumus BMI
  //   setBMI(result.toFixed(2)); // Format BMI ke 2 angka desimal
  // };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', padding: 25 }}>
      {/* Jika tombol Continue belum ditekan, tampilkan konten utama */}
      {!continuePressed ? (
        <>
          {/* Judul */}
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

          {/* Deskripsi We calculate the BMI index based on data such as age, height, and weight */}
          <Text style={{ color: 'black', fontSize: 15, fontWeight: 'semibold', textAlign: 'left' }}>
            We calculate the BMI index based on data such as age, height, and weight.
          </Text>

          {/* Pilihan Gender */}
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
              padding: 40,
              borderRadius: 30,
              marginTop: 15,
            }}
            onPress={() => setSelectedGender('male')}
          >
            <Text style={{ fontSize: 25, color: '#22689E', fontWeight: 'bold', marginRight: 70 }}>
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
              padding: 40,
              borderRadius: 30,
              marginTop: 15,
            }}
            onPress={() => setSelectedGender('female')}
          >
            <Text style={{ fontSize: 25, color: '#FF6757', fontWeight: 'bold', marginRight: 50 }}>
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
              backgroundColor: selectedGender ? '#2B4763' : 'white', // Biru jika gender dipilih, putih jika belum
              paddingVertical: 15,
              paddingHorizontal: 30,
              borderRadius: 30,
              marginTop: 20,
            }}
            onPress={() => {
              if (selectedGender) {
                // sembunyiin konten utama dan tampilan teks
                setContinuePressed(true);
              } else {
                // bisa no need.. soalnya ga berhubungan sama aplikasinya
                console.log('Please select a gender first');
              }
            }}
          >
            <Text style={{
              fontSize: 18, color: selectedGender ? 'white' : '#B9BCC6', fontWeight: 'bold',}}>
              {/* putih jika gender dipilih, abu" kalau belum */}
              Continue
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        // Konten yang ditampilkan setelah tombol Continue ditekan
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {/* Judul */}
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

          {/* Kotak Weight dan Age bersebelahan */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 }}>
            {/* Kotak Weight */}
            <View
              style={{
                alignItems: 'center',
                backgroundColor: '#FFFCF0',
                padding: 20,
                borderRadius: 20,
                width: 150,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 5, // Efek shadow untuk Android
                marginHorizontal: 10, // Jarak antar kotak
              }}
            >
              <Text style={{ fontSize: 18, color: '#9A9A9A', marginBottom: 5 }}>Weight (kg)</Text>
              <Text style={{ fontSize: 50, color: '#4C837A', fontWeight: 'bold' }}>{weight}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => handleWeightChange(-1)}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 50,
                    borderWidth: 2,
                    borderColor: '#8BADA7',
                    padding: 10,
                    marginHorizontal: 5,
                    width: 50,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 30, color: '#8BADA7', fontWeight: 'bold' }}>−</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleWeightChange(1)}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 50,
                    borderWidth: 2,
                    borderColor: '#8BADA7',
                    padding: 10,
                    marginHorizontal: 5,
                    width: 50,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 30, color: '#8BADA7', fontWeight: 'bold' }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Kotak Age */}
            <View
              style={{
                alignItems: 'center',
                backgroundColor: '#FFFCF0',
                padding: 20,
                borderRadius: 20,
                width: 150,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 5, // Efek shadow untuk Android
                marginHorizontal: 10, // Jarak antar kotak
              }}
            >
              <Text style={{ fontSize: 18, color: '#9A9A9A', marginBottom: 5 }}>Age (years)</Text>
              <Text style={{ fontSize: 50, color: '#4C837A', fontWeight: 'bold' }}>{age}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => handleAgeChange(-1)}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 50,
                    borderWidth: 2,
                    borderColor: '#8BADA7',
                    padding: 10,
                    marginHorizontal: 5,
                    width: 50,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 30, color: '#8BADA7', fontWeight: 'bold' }}>−</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleAgeChange(1)}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 50,
                    borderWidth: 2,
                    borderColor: '#8BADA7',
                    padding: 10,
                    marginHorizontal: 5,
                    width: 50,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 30, color: '#8BADA7', fontWeight: 'bold' }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Input Tinggi */}
          <View style={{ width: '100%', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 20 }}>Height (cm)</Text>
            <TextInput
              style={{ borderBottomWidth: 2, fontSize: 30, textAlign: 'center', marginVertical: 10 }}
              keyboardType="numeric"
              value={height.toString()}
              onChangeText={(value) => handleHeightChange(parseInt(value) || 0)}
            />
          </View>

          {/* Tombol Calculate */}
          <TouchableOpacity
            style={{
              backgroundColor: '#2B4763',
              paddingVertical: 15,
              paddingHorizontal: 60,
              borderRadius: 30,
            }}
            onPress={() => {
              console.log(`Weight: ${weight}, Age: ${age}, Height: ${height}`);
            }}
          >
            <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>Calculate</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default BMI;
