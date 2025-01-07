import React, { useState } from "react";
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import CalendarPicker from "react-native-calendar-picker"; // Import CalendarPicker

import images from "../../constants/images";
import icons from "../../constants/icons";

const { width, height } = Dimensions.get("window");

const MedReminder = () => {
  const [showImages, setShowImages] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedMedType, setSelectedMedType] = useState(null);
  const [medName, setMedName] = useState("");
  const [medDose, setMedDose] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState(null); // Pilihan tanggal
  const [selectedTime, setSelectedTime] = useState("");
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false); // Untuk menampilkan/menyembunyikan TimePicker
  const [medList, setMedList] = useState([]);
  const [medImage, setMedImage] = useState(null);

  const handleAddMedPress = () => {
    setShowImages(!showImages);
  };

  const handleOverlayPress = () => {
    setShowImages(false);
  };

  const handleMedTypeSelect = (medType) => {
    setSelectedMedType(medType);
    setShowImages(false);

    // Set image based on selected med type
    let imageSource;
    switch (medType) {
      case "Pil":
        imageSource = require("../../assets/images/Pil.png"); // Ganti dengan path gambar Pil
        break;
      case "Sirup":
        imageSource = require("../../assets/images/Sirup.png"); // Ganti dengan path gambar Sirup
        break;
      case "Tetes":
        imageSource = require("../../assets/images/Tetes.png"); // Ganti dengan path gambar Tetes
        break;
      case "Krim":
        imageSource = require("../../assets/images/Krim.png"); // Ganti dengan path gambar Krim
        break;
      case "Tablet":
        imageSource = require("../../assets/images/Tablet.png"); // Ganti dengan path gambar Tablet
        break;
      default:
        imageSource = null;
    }
    setMedImage(imageSource);
    setTimeout(() => setShowDetailsModal(true), 300);
  };
  const handleNextPress = () => {
    if (!medName || !medDose) {
      alert("Please fill in all the medication details before proceeding!");
      return;
    }
    setShowDetailsModal(false);
    setShowReminderModal(true);
  };

  const handleSetReminderPress = () => {
    if (!selectedStartDate || !selectedTime || !medName || !medDose) {
      alert("Please fill in all details for the reminder!");
      return;
    }

    const newMed = {
      name: medName,
      dose: medDose,
      type: selectedMedType,
      date: selectedStartDate.toDateString(),
      time: selectedTime.toLocaleTimeString(),
      image: medImage,
    };

    setMedList([...medList, newMed]); // Tambahkan data baru ke daftar
    setMedName("");
    setMedDose("");
    setSelectedStartDate(null);
    setSelectedTime("");
    setMedImage(null);
    setShowReminderModal(false);
  };

  const toggleCalendar = () => {
    setCalendarVisible(!isCalendarVisible);
  };

  const toggleTimePicker = () => {
    setIsTimePickerVisible(!isTimePickerVisible);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || selectedTime;
    setSelectedTime(currentTime);
    setIsTimePickerVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.title}>Halo, </Text>
        <Text style={styles.subtitle}>Nikita</Text>
      </View>
      <View style={styles.box}>
        <View style={styles.textContainer}>
          <View style={styles.layout1}>
            <Text style={styles.text1Box}>Rencana Anda{"\n"}hari ini</Text>
          </View>
          <View style={styles.layout2}>
            <Text style={styles.text2Box}>1 dari 4 selesai</Text>
          </View>
          <View style={styles.layout3}>
            <Text style={styles.text3Box}>Tampilkan lebih banyak</Text>
          </View>
        </View>
        <Image source={images.reminder1} style={styles.reminder1} />
      </View>
      <Text style={styles.midText}>Obat Hari Ini</Text>

      {/* ScrollView untuk daftar obat */}
      <ScrollView
        style={styles.medListContainer}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "flex-start", // Menambahkan agar konten ada di tengah vertikal
          paddingBottom: 20,
          borderWidth: 1, // Debugging border
          borderColor: "blue",
        }}
      >
        {medList.length === 0 ? (
          <Text style={styles.noMedText}>Belum ada obat ditambahkan</Text>
        ) : (
          medList.map((med, index) => (
            <View key={index} style={styles.medItem}>
              {med.image && <Image source={med.image} style={styles.medIcon} />}
              <View style={styles.medDetails}>
                <Text style={styles.medName}>{med.name}</Text>
                <Text style={styles.medType}>
                  {med.type}, {med.dose}
                </Text>
                <Text style={styles.medDate}>{med.date}</Text>
                <Text style={styles.medTime}>{med.time}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.iconAdd} onPress={handleAddMedPress}>
        <Image
          source={showImages ? icons.cancelMed : icons.addMed} // Ikon berubah
          style={styles.addMed}
        />
      </TouchableOpacity>

      {/* Modal Pilih Jenis Obat */}
      <Modal
        visible={showImages}
        transparent={true}
        animationType="fade"
        onRequestClose={handleOverlayPress}
      >
        <TouchableOpacity
          style={styles.dimmedBackground}
          activeOpacity={1}
          onPress={handleOverlayPress}
        >
          <View style={styles.modalContainer}>
            <View style={styles.backgroundBox}>
              <Text style={styles.chooseText}>Pilih Jenis Obat</Text>
              <View style={styles.imagesRow}>
                <TouchableOpacity
                  onPress={() => handleMedTypeSelect("Pil")}
                  style={{ opacity: 0.8 }}
                >
                  <Image source={images.pil} style={styles.image} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleMedTypeSelect("Sirup")}
                  style={{ opacity: 0.8 }}
                >
                  <Image source={images.sirup} style={styles.image} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleMedTypeSelect("Tetes")}
                  style={{ opacity: 0.8 }}
                >
                  <Image source={images.tetes} style={styles.image} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleMedTypeSelect("Krim")}
                  style={{ opacity: 0.8 }}
                >
                  <Image source={images.krim} style={styles.image} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleMedTypeSelect("Tablet")}
                  style={{ opacity: 0.8 }}
                >
                  <Image source={images.tablet} style={styles.image} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal Tambahkan Detail */}
      <Modal
        visible={showDetailsModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <View style={styles.dimmedBackground}>
          <View style={styles.detailModalContainer}>
            <Text style={styles.detailTitle}>Add Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={medName}
              onChangeText={setMedName}
            />
            <TextInput
              style={styles.input}
              placeholder="Dosage"
              value={medDose}
              onChangeText={setMedDose}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNextPress}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Atur Pengingat */}
      <Modal
        visible={showReminderModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowReminderModal(false)}
      >
        <View style={styles.dimmedBackground}>
          <View style={styles.reminderModalContainer}>
            <Text style={styles.reminderTitle}>Atur Pengingat</Text>
            <View style={styles.dateBox}>
              {/* Tampilkan Placeholder atau Tanggal yang Dipilih */}
              <Text style={styles.placeholderText}>
                {selectedStartDate
                  ? selectedStartDate.toDateString()
                  : "Pilih Tanggal"}
              </Text>
              <TouchableOpacity
                onPress={toggleCalendar} // Fungsi untuk menampilkan/menyembunyikan kalender
                style={styles.iconWrapper}
              >
                <Image source={icons.arrowDown} style={styles.icon} />
              </TouchableOpacity>
            </View>

            {/* Modal untuk Calendar */}
            <Modal
              transparent={true}
              visible={isCalendarVisible} // Menampilkan kalender
              animationType="slide"
              onRequestClose={toggleCalendar} // Menutup kalender
            >
              <View style={styles.modalBackground}>
                <View style={styles.calendarContainer}>
                  <CalendarPicker
                    onDateChange={(date) => {
                      setSelectedStartDate(date); // Set tanggal yang dipilih
                      toggleCalendar(); // Menutup modal kalender setelah memilih tanggal
                    }}
                    width={300}
                    height={300}
                    selectedDayColor="#000000"
                    selectedDayTextColor="#FFFFFF"
                  />
                </View>
              </View>
            </Modal>

            {/* Picker untuk Memilih Waktu */}
            <View style={styles.timeBox}>
              <Text style={styles.placeholderText}>
                {selectedTime
                  ? selectedTime.toLocaleTimeString()
                  : "Pilih Waktu"}
              </Text>
              <TouchableOpacity
                onPress={toggleTimePicker}
                style={styles.iconWrapper}
              >
                <Image source={icons.arrowDown} style={styles.icon} />
              </TouchableOpacity>
            </View>

            {isTimePickerVisible && (
              <Modal transparent={true} visible={isTimePickerVisible}>
                <View style={styles.modalBackground}>
                  <DateTimePicker
                    value={selectedTime || new Date()}
                    mode="time"
                    is24Hour={false} // Gunakan format waktu 12 jam
                    display="spinner"
                    onChange={handleTimeChange}
                  />
                </View>
              </Modal>
            )}

            {/* Tombol untuk Menyimpan Pengingat */}
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleSetReminderPress} // Fungsi untuk menyimpan pengingat
            >
              <Text style={styles.nextButtonText}>Simpan Pengingat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#ffff",
  },
  dimmedBackground: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  reminderModalContainer: {
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    width: "100%",
    height: "35%",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginBottom: -500,
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  picker: {
    width: "100%",
    height: 50,
    marginVertical: 10,
    backgroundColor: "#EAEAEA",
    borderRadius: 10,
  },
  detailModalContainer: {
    justifyContent: "flex-end", // Posisikan ke bawah layar
    backgroundColor: "#FFF", // Warna latar modal
    borderRadius: 20, // Membuat sudut membulat
    padding: 20, // Ruang dalam modal
    alignItems: "center", // Elemen di tengah horizontal
    width: "100%", // Sesuaikan lebar modal
    height: "33%", // Tinggi modal (atur sesuai kebutuhan)
    elevation: 5, // Bayangan di Android
    shadowColor: "#000", // Bayangan di iOS
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginBottom: -400,
  },
  detailTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    width: 350,
    height: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#EAEAEA",
  },
  nextButton: {
    backgroundColor: "#000000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  nextButtonText: { color: "#B9BCC6", fontSize: 16, fontWeight: "bold" },
  topContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 16,
    marginTop: 100,
    marginLeft: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 40,
  },
  box: {
    width: "85%",
    height: "25%",
    backgroundColor: "#F3F6C8",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginTop: 20,
    alignSelf: "center",
  },
  textContainer: {
    flexDirection: "column",
    flex: 1,
  },
  layout1: {
    flex: 1,
    width: "100%",
    // height: 10,
    marginLeft: 10,
    // marginTop: 20,
    // marginBottom: 20
  },
  text1Box: {
    fontSize: 25,
    fontWeight: "bold",
    // marginTop:
    // marginTop: -5,
    marginBottom: -5,
  },
  layout2: {
    flex: 1,
    width: "50%",
    marginLeft: 10,
    // marginTop: 5,
  },
  text2Box: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
  layout3: {
    flex: 1,
    width: "60%",
    height: 10,
    marginBottom: -20,
    marginLeft: 10,
    
  },
  text3Box: {
    fontSize: 14,
    color: "#FF0000",
    textDecorationLine: "underline",
  },
  reminder1: {
    width: 200,
    height: 200,
    marginRight: -70,
    marginTop: -120,
  },
  midText: {
    marginTop: 40,
    marginLeft: 50,
    fontSize: 30,
    color: "#000000",
  },
  iconAdd: {
    position: "absolute",
    bottom: 50,
    left: "50%",
    transform: [{ translateX: -25 }],
    
  },
  addMed: {
    width: 50,
    height: 50,
    
  },
  cancelMed: {
    width: 50,
    height: 50,
  },
  modalContainer: {
    position: "absolute",
    alignSelf: "center",
    bottom: "25%", // Sesuaikan posisi
    width: "95%",
    height: "auto", // Tinggi otomatis sesuai konten
    justifyContent: "center",
    alignItems: "center",
    
  },
  backgroundBox: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 10,
    width: "90%", // Lebar modal
    height: "80%", // Tinggi otomatis
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginTop: 30,
    
  },
  chooseContainer: {
    marginBottom: 0,
  },
  chooseText: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
  imagesRow: {
    flexDirection: "row",
    flexWrap: "wrap", // Membungkus gambar jika layar sempit
    justifyContent: "center", // Pusatkan elemen
    gap: 15, // Jarak antar gambar
    marginTop: 10,
  },
  image: {
    width: 50,
    height: 50,
  },
  dateBox: {
    width: 350,
    height: 60,
    backgroundColor: "#EAEAEA",
    borderColor: "#ccc",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  timeBox: {
    width: 350,
    height: 60,
    backgroundColor: "#EAEAEA",
    borderColor: "#ccc",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: "#B0B0B0", // Warna placeholder (abu-abu terang)
  },
  iconWrapper: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  calendarContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    
  },
  medListContainer: {
    // marginHorizontal: 10, // Margin relative to screen width
    // marginRight: 10,
    // marginTop: 20,
    flex: 1,
    paddingBottom: 20,
    borderWidth: 1, // Debugging border
    borderColor: "red",

    // alignItems: "center",
    width: "100%",
  },
  noMedText: {
    fontSize: 16, // Font size relative to screen width
    color: "#000",
    textAlign: "center",
    marginVertical: 20,
  },
  medItem: {
    flexDirection: "row", // Horizontal layout
    alignItems: "center", // Vertically centered items
    padding: 15, // Padding relative to screen width
    borderRadius: 10,
    backgroundColor: "#ff44", // Background color
    marginBottom: 15,
    // marginHorizontal: width * 0.03, // Horizontal margin relative to screen width
    // width: "100%", // Full width of the parent container
    flexWrap: "wrap", // Allow items to wrap
    overflow: "hidden", // Prevent overflow
    borderWidth: 1, // Debugging border
    borderColor: "green",
  
  },
  medIcon: {
    width: 50,
    height: 50,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  medDetails: {
    // flex: -3,
    marginLeft: 10, // Left margin for separation
    justifyContent: "center",
    alignItems: "flex-start",
    paddingVertical: 5,
    borderWidth: 1, // Debugging border
    borderColor: "green",
  },
  medName: {
    fontSize: 16, // Font size relative to screen width
    fontWeight: "bold",
  },
  medType: {
    fontSize: 14, // Font size relative to screen width
    color: "#666",
  },
  medDate: {
    fontSize: 14, // Font size relative to screen width
    color: "#666",
  },
  medTime: {
    fontSize: 14, // Font size relative to screen width
    color: "#666",
  },
});

export default MedReminder;
