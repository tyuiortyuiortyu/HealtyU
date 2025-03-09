import React, { useState } from "react";
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Platform,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import CalendarPicker from "react-native-calendar-picker"; // Import CalendarPicker
import AsyncStorage from "@react-native-async-storage/async-storage";

import images from "../../constants/images";
import icons from "../../constants/icons";
import { SafeAreaView } from "react-native-safe-area-context";

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
  // const [medList, setMedList] = useState([]);
  const [medImage, setMedImage] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState("mg");
  const [status, setStatus] = useState({}); // Status untuk setiap item
  const [medList, setMedList] = useState([]);

  const [skipped, setSkipped] = useState([]);
  const [taken, setTaken] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleEditItem = (index) => {
    const med = medList[index];

    // Set the values of the selected medication to edit
    setMedName(med.name);
    setMedDose(med.dose);
    setSelectedMedType(med.type);
    setMedImage(med.image);

    // Waktu: Pastikan formatnya valid
    if (med.time) {
      const timeParts = med.time.split(":");
      const timeDate = new Date();
      timeDate.setHours(parseInt(timeParts[0], 10));
      timeDate.setMinutes(parseInt(timeParts[1], 10));
      setSelectedTime(timeDate);
    } else {
      setSelectedTime(new Date()); // Default ke waktu sekarang
    }

    setSelectedIndex(index); // Set the selected index for editing

    // Open the details modal
    setShowDetailsModal(true);
  };

  const handlePressItem = (index) => {
    setSelectedIndex(index === selectedIndex ? null : index);
  };

  const handleSkipItem = (index) => {
    const skippedMed = medList[index];
    setSkipped([...skipped, skippedMed]);
    setMedList(medList.filter((_, i) => i !== index));
    setSelectedIndex(null);
  };

  const handleTakenItem = (index) => {
    const takenMed = medList[index];
    setTaken([...taken, takenMed]);
    setMedList(medList.filter((_, i) => i !== index));
    setSelectedIndex(null);
  };

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

    if (selectedIndex !== null) {
      // Update existing medication in the list
      const updatedMedList = [...medList];
      updatedMedList[selectedIndex] = {
        ...updatedMedList[selectedIndex],
        name: medName,
        dose: medDose,
        type: selectedMedType,
        date: selectedStartDate.toDateString(), // Simpan tanggal
        time: selectedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit",second: "2-digit",}), 
        image: medImage,
      };
      setMedList(updatedMedList); // Update the list with the new values
    } else {
      // Add new medication if it's a new entry
      const newMed = {
        name: medName,
        dose: medDose,
        type: selectedMedType,
        date: selectedStartDate.toDateString(), 
        time: selectedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit",second: "2-digit",}), 
        image: medImage,
      };
      setMedList([...medList, newMed]); // Add the new item to the list
    }

    // Reset form fields
    setMedName("");
    setMedDose("");
    setSelectedMedType(null);
    setMedImage(null);
    setSelectedStartDate(null);
    setSelectedTime(new Date());
    setSelectedIndex(null);

    setShowReminderModal(false);
  };

  const toggleCalendar = () => {
    setCalendarVisible(!isCalendarVisible);
  };

  const toggleTimePicker = () => {
    setIsTimePickerVisible(!isTimePickerVisible);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || new Date();
    currentTime.setSeconds(0);
    setSelectedTime(currentTime);
    setIsTimePickerVisible(false);
  };

  const handleIconPress = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const closeDropdown = () => {
    setDropdownVisible(false); // Menutup dropdown
  };

  const handleSelectUnit = (unit) => {
    setSelectedUnit(unit);
    closeDropdown();
  };

  const availableUnits = ["mg", "mL"].filter((unit) => unit !== selectedUnit); // Menyaring opsi

  return (
    // <SafeAreaView>
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
          justifyContent: "flex-start",
        }}
      >
        {medList.length === 0 ? (
          <Text style={styles.noMedText}>Belum ada obat ditambahkan</Text>
        ) : (
          medList.map((med, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.medItem, { backgroundColor: "#FFF9C4" }]}
              onPress={() => handlePressItem(index)}
            >
              {med.image && <Image source={med.image} style={styles.medIcon} />}
              <View style={styles.medDetails}>
                <Text style={styles.medName}>{med.name}</Text>
                <Text style={styles.medType}>
                  {med.type}, {med.dose}
                </Text>
                <Text style={styles.medDate}>{med.date}</Text>
                <Text style={styles.medTime}>{med.time}</Text>
              </View>

              <TouchableOpacity
                style={styles.editIconWrapper}
                onPress={() => handleEditItem(index)} // Edit action logic
              >
                <Image source={icons.edit} style={styles.icon} />
              </TouchableOpacity>

              {selectedIndex === index && (
                <View style={styles.statusContainer}>
                  <TouchableOpacity onPress={() => handleSkipItem(index)}>
                    <View style={styles.statusItemLeft}>
                      <Image source={icons.skipped} style={styles.statusIcon} />
                      <Text style={styles.statusText}>Skipped</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleTakenItem(index)}>
                    <View style={styles.statusItemRight}>
                      <Image source={icons.taken} style={styles.statusIcon} />
                      <Text style={styles.statusText}>Taken</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
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
        <KeyboardAvoidingView
          style={styles.dimmedBackground}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.detailModalContainer}>
              <Text style={styles.detailTitle}>Add Details</Text>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={medName}
                onChangeText={setMedName}
              />

              <View style={styles.inputWithIcon}>
                <TextInput
                  style={styles.input}
                  placeholder="Dosage"
                  value={medDose}
                  onChangeText={setMedDose}
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={styles.unitWrapper}
                  onPress={handleIconPress}
                >
                  <Text style={styles.unitText}>{selectedUnit}</Text>
                  <Image
                    source={icons.arrowDown} // Ganti dengan ikon panah bawah
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>

              {/* Dropdown Modal */}
              {isDropdownVisible && (
                <View style={styles.dropdownContainer}>
                  {availableUnits.map((unit) => (
                    <TouchableOpacity
                      key={unit}
                      style={styles.dropdownItem}
                      onPress={() => handleSelectUnit(unit)}
                    >
                      <Text style={styles.dropdownText}>{unit}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNextPress}
              >
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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

            <TouchableOpacity onPress={toggleCalendar} style={styles.dateBox}>
              <Text style={styles.placeholderText}>
                {selectedStartDate
                  ? selectedStartDate.toDateString()
                  : "Select Date"}
              </Text>
              <View style={styles.iconWrapper}>
                <Image source={icons.arrowDown} style={styles.icon} />
              </View>
            </TouchableOpacity>

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
            <TouchableOpacity onPress={toggleTimePicker} style={styles.timeBox}>
              <Text style={styles.placeholderText}>
                {selectedTime
                  ? selectedTime.toLocaleTimeString()
                  : "Select Time"}
              </Text>
              <View style={styles.iconWrapper}>
                <Image source={icons.arrowDown} style={styles.icon} />
              </View>
            </TouchableOpacity>

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
    // {/* </SafeAreaView> */}
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
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
  detailModalContainer: {
    justifyContent: "center", // Posisikan ke bawah layar
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
    top: 200,
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
    // borderWidth: 1, // Debugging border
    // borderColor: "blue",
  },
  inputWithIcon: {
    // flexDirection: "row",
    // alignItems: "center",
    // marginBottom: 16, // Sesuaikan dengan jarak antar elemen
    // borderWidth: 1, // Debugging border
    // borderColor: "green",
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
    marginTop: 20,
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
    marginTop: 20,
    marginLeft: 30,
    marginBottom: 20,
    fontSize: 30,
    color: "#000000",
  },
  iconAdd: {
    position: "absolute",
    bottom: 5,
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
    alignSelf: "center",
    top: "20%", // Sesuaikan posisi
    width: "95%",
    height: "20%", // Tinggi otomatis sesuai konten
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
    flex: 1,
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
    width: "85%", // Full width of the parent container
    flexWrap: "wrap", // Allow items to wrap
    overflow: "hidden", // Prevent overflow

    // borderWidth: 1, // Debugging border
    // borderColor: "green",
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
    // borderWidth: 1, // Debugging border
    // borderColor: "green",
  },
  medName: {
    fontSize: 20, // Font size relative to screen width
    fontWeight: "bold",
  },
  medType: {
    fontSize: 16, // Font size relative to screen width
    color: "#666",
  },
  medDate: {
    fontSize: 16, // Font size relative to screen width
    color: "#666",
  },
  medTime: {
    fontSize: 16, // Font size relative to screen width
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownContainer: {
    position: "absolute",
    bottom: 10, // Sesuaikan ini agar dropdown berada tepat di bawah input
    right: 20, // Sesuaikan ini agar sejajar dengan ikon
    backgroundColor: "#EAEAEA",
    borderRadius: 8,
    padding: 10,
    elevation: 5,
    marginBottom: 5,
    // borderWidth: 1, // Debugging border
    // borderColor: "green",
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    // borderWidth: 1, // Debugging border
    // borderColor: "green",
  },
  dropdownText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  unitWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: 50,
    bottom: 50,
    left: 280,
    // borderWidth: 1, // Debugging border
    // borderColor: "red",
  },
  unitText: {
    fontSize: 16,
    color: "#000",
    marginRight: 4,
    fontWeight: "bold",
    // borderWidth: 1, // Debugging border
    // borderColor: "green",
  },
  // tes
  statusButton: {
    backgroundColor: "#4CAF50",
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  statusButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  statusItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  statusItemRight: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  statusIcon: {
    width: 25,
    height: 25,
    marginRight: 5,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  editIconWrapper: {
    position: "absolute", // Positioning it absolutely within the modal container
    top: 10,
    right: 10,
    zIndex: 2,
  },
});

export default MedReminder;
