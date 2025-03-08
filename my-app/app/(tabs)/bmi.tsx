import { Text, View, Image, TouchableOpacity, TextInput, Modal } from 'react-native';
import React, { useState } from 'react';

import images from '../../constants/images';
import icons from '../../constants/icons';

const BMI = () => {
  const [selectedGender, setSelectedGender] = useState(null); // 'male' or 'female'
  const [continuePressed, setContinuePressed] = useState(false); // Controls main content visibility

  const [weight, setWeight] = useState(0);
  const [age, setAge] = useState(0);
  const [height, setHeight] = useState(0);

  const [bmiResult, setBmiResult] = useState(null); // Store BMI result
  const [showBMIResult, setShowBMIResult] = useState(false); // Toggle to show BMI result

  const handleWeightChange = (newWeight) => {
    setWeight(newWeight);
  };

  const handleAgeChange = (newAge) => {
    if(newAge >= 0){
      setAge(newAge);
    }
  };

  const handleHeightChange = (value) => {
    setHeight(value);
  };

  const calculateBMI = () => {
    const heightInMeters = height / 100; // Convert Height cm -> m
    const result = weight / (heightInMeters * heightInMeters); // Formula BMI
    setBmiResult(result.toFixed(2)); // Simpan Hasil BMI
    setShowBMIResult(true); // Tampilin Hasil BMI
  };

  const getBMIStatus = (bmi) => {
    if (bmi < 18.5) {
      return 'Underweight';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      return 'Normal (Ideal)';
    } else if (bmi >= 25 && bmi <= 29.9) {
      return 'Overweigh';
    } else {
      return 'Obesity';
    }
  };

  const getBMIRange = (bmi) => {
    if (bmi < 18.5) {
      return 'Underweight: < 18.5 kg/m²';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      return 'Normal (Ideal): 18.5 kg/m² - 24.9 kg/m²';
    } else if (bmi >= 25 && bmi <= 29.9) {
      return 'Overweight: 25 kg/m² - 29.9 kg/m²';
    } else {
      return 'Obesity: ≥ 30 kg/m²';
    }
  };

  const getAdvice = (bmi) => {
    if (bmi < 18.5) {
      return 'Pastikan asupan kalori sesuai dengan kebutuhan kalori harian & konsumsi makanan sehat.';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      return 'Pertahankan pola makan sehat dan rutin berolahraga.';
    } else if (bmi >= 25 && bmi <= 29.9) {
      return 'Kurangi asupan kalori dan tingkatkan aktivitas fisik.';
    } else {
      return 'Segera konsultasikan dengan dokter atau ahli gizi untuk rencana penurunan berat badan yang sehat.';
    }
  };

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
              // Biru jika gender dipilih, putih jika belum
              backgroundColor: selectedGender ? '#2B4763' : 'white',
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
              fontSize: 18, color: selectedGender ? 'white' : '#B9BCC6', fontWeight: 'bold' }}>
              {/* putih jika gender dipilih, abu" kalau belum */}
              Continue
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        // Konten yang ditampilkan setelah tombol Continue ditekan
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {/* Judul */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginRight: 8 }}>
            <Text style={{ fontSize: 50, fontWeight: 'bold', color: '#BBDA04', marginRight: 5 }}>
              BMI
            </Text>
            <Text style={{ fontSize: 50, fontWeight: 'bold', color: '#FFAF23' }}>
              Calculator
            </Text>
            <Image 
              source={images.bmi} 
              style={{ width: 40, height: 40, marginLeft: 10, marginRight: 20 }} 
            />
          </View>

          {/* Deskripsi We calculate the BMI index based on data such as age, height, and weight */}
          <Text style={{ color: 'black', fontSize: 15, fontWeight: 'semibold', textAlign: 'left', marginBottom: 10 }}>
            We calculate the BMI index based on data such as age, height, and weight.
          </Text>

          
          {/* Ubah Nilai */}
          <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold', textAlign: 'center', width: '100%', marginBottom: 10 }}>
            Please change the value
          </Text>

          {/* Kotak Weight dan Age -> buat bersebelahan */}
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
              <View style={{ width: '100%', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, color: '#9A9A9A', marginBottom: 2 }}>Weight (kg)</Text>
                <TextInput
                  style={{
                    fontSize: 50,
                    color: '#4C837A',
                    fontWeight: 'bold',
                    borderBottomWidth: 2,
                    textAlign: 'center',
                    marginVertical: 10,
                  }}
                  keyboardType="numeric"
                  value={weight.toString()} // Variabel weight digunakan
                  onChangeText={(value) => {
                    const parsedValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
                    handleWeightChange(parsedValue >= 0 ? parsedValue : 0); // Validasi agar tidak negatif
                  }}
                />
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => handleWeightChange((weight - 1) >= 0 ? weight - 1 : 0)} // Mencegah nilai negatif
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 50,
                    borderWidth: 2,
                    borderColor: '#8BADA7',
                    width: 50,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginHorizontal: 5,
                  }}
                >
                  <Text style={{ fontSize: 30, color: '#8BADA7', fontWeight: 'bold' }}>−</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleWeightChange(weight + 1)}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 50,
                    borderWidth: 2,
                    borderColor: '#8BADA7',
                    width: 50,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginHorizontal: 5,
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
              <View style={{ width: '100%', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, color: '#9A9A9A', marginBottom: 2 }}>Age (years)</Text>
                <TextInput
                  style={{
                    fontSize: 50,
                    color: '#4C837A',
                    fontWeight: 'bold',
                    borderBottomWidth: 2,
                    textAlign: 'center',
                    marginVertical: 10,
                  }}
                  keyboardType="numeric"
                  value={age.toString()} // Variabel age digunakan
                  onChangeText={(value) => {
                    const parsedValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
                    handleAgeChange(parsedValue >= 0 ? parsedValue : 0); // Validasi agar tidak negatif
                  }}
                />
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => handleAgeChange((age - 1) >= 0 ? age - 1 : 0)} // Mencegah nilai negatif
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 50,
                    borderWidth: 2,
                    borderColor: '#8BADA7',
                    width: 50,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginHorizontal: 5,
                  }}
                >
                  <Text style={{ fontSize: 30, color: '#8BADA7', fontWeight: 'bold' }}>−</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleAgeChange(age + 1)}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 50,
                    borderWidth: 2,
                    borderColor: '#8BADA7',
                    width: 50,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginHorizontal: 5,
                  }}
                >
                  <Text style={{ fontSize: 30, color: '#8BADA7', fontWeight: 'bold' }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Kotak Height */}
          <View
            style={{
              alignItems: 'center',
              backgroundColor: '#FFFCF0',
              padding: 15,
              borderRadius: 20,
              width: 300,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 5, // Efek shadow untuk Android
              marginBottom: 20,
            }}
          >
            <View style={{ width: '100%', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, color: '#9A9A9A', marginBottom: 2 }}>Height (cm)</Text>
              <TextInput
                style={{
                  fontSize: 50,
                  color: '#4C837A',
                  fontWeight: 'bold',
                  borderBottomWidth: 2,
                  textAlign: 'center',
                  marginVertical: 10,
                }}
                keyboardType="numeric"
                value={height.toString()}
                onChangeText={(value) => {
                  const parsedValue = parseInt(value) || 0;
                  handleHeightChange(parsedValue > 0 ? parsedValue : 0);
                }}
              />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => handleHeightChange(height - 1 > 0 ? height - 1 : 0)} // Mencegah nilai minus
                style={{
                  backgroundColor: 'white',
                  borderRadius: 50,
                  borderWidth: 2,
                  borderColor: '#8BADA7',
                  width: 50,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: 5,
                }}
              >
                <Text style={{ fontSize: 30, color: '#8BADA7', fontWeight: 'bold' }}>−</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleHeightChange(height + 1)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 50,
                  borderWidth: 2,
                  borderColor: '#8BADA7',
                  width: 50,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: 5,
                }}
              >
                <Text style={{ fontSize: 30, color: '#8BADA7', fontWeight: 'bold' }}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tombol Calculate */}
          <TouchableOpacity
            style={{
              alignSelf: 'center',
              // Biru jika semua input > 0, putih jika ada yang 0
              backgroundColor: (weight > 0 && age > 0 && height > 0) ? '#2B4763' : 'white',
              paddingVertical: 15,
              paddingHorizontal: 30,
              borderRadius: 30,
            }}
            onPress={calculateBMI}
          >
            <Text style={{
            fontSize: 18, color: (weight > 0 && age > 0 && height > 0) ? 'white' : '#B9BCC6', fontWeight: 'bold' }}>
            {/* putih jika gender dipilih, abu" kalau belum */}
              Calculate
            </Text>
          </TouchableOpacity>

          {/* Konten yang ditampilin setelah tombol Calculate ditekan  */}
          {showBMIResult && (
            <Modal transparent={true} visible={showBMIResult} animationType="slide">
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View style={{ 
                  backgroundColor: '#FFFCF0', 
                  padding: 30, 
                  borderRadius: 20, 
                  alignItems: 'center', 
                  width: '80%',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.8,
                  shadowRadius: 4,
                  elevation: 5,
                }}>
                  {/* Judul "Your BMI" */}
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#4C837A', marginBottom: 10 }}>
                    Your BMI is
                  </Text>

                  {/* Hasil BMI */}
                  <Text style={{ fontSize: 60, fontWeight: 'bold', color: '#FF6757', marginBottom: 15 }}>
                    {bmiResult}
                  </Text>

                  {/* Status BMI */}
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FF6757', marginBottom: 10 }}>
                    {getBMIStatus(bmiResult)}
                  </Text>

                  {/* Informasi Range BMI Dinamis */}
                  <Text style={{ fontSize: 16, color: '#4C837A', marginBottom: 10, textAlign: 'center' }}>
                    {getBMIRange(bmiResult)}
                  </Text>

                  {/* Informasi Healthy Weight for the Height */}
                  <Text style={{ fontSize: 16, color: '#4C837A', marginBottom: 20, textAlign: 'center' }}>
                    Healthy weight for the height: {Math.round(18.5 * (height / 100) * (height / 100))} kg - {Math.round(24.9 * (height / 100) * (height / 100))} kg
                  </Text>

                  {/* Kotak untuk Notes */}
                  <View style={{ 
                    borderWidth: 1, 
                    borderColor: '#4C837A', 
                    borderRadius: 10, 
                    padding: 15, 
                    width: '100%', 
                    marginBottom: 20,
                    backgroundColor: '#F0F8FF', // Warna latar belakang yang lebih soft
                  }}>
                    <Text style={{ fontSize: 16, color: '#4C837A', textAlign: 'center' }}>
                      Notes: {getAdvice(bmiResult)}
                    </Text>
                  </View>

                  {/* Tombol Close */}
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#2B4763',
                      paddingVertical: 10,
                      paddingHorizontal: 30,
                      borderRadius: 20,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.8,
                      shadowRadius: 4,
                      elevation: 5,
                    }}
                    onPress={() => setShowBMIResult(false)}
                  >
                    <Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}>
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
        </View>
      )}
    </View>
  );
};

export default BMI;