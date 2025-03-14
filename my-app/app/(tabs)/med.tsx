import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
  ScrollView,
  FlatList,
  Platform,
} from "react-native";

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import CalendarPicker from "react-native-calendar-picker"; // Import CalendarPicker
import {
  getMedications,
  addMedication,
  updateMedication,
  deleteMedication,
} from "../helpers/medApiHelper";
import { MedResponse } from "../response/MedResponse";

import images from "../../constants/images";
import icons from "../../constants/icons";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const MedReminder = () => {
  const router = useRouter();
  const [medications, setMedications] = useState([]);
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
  const [medList, setMedList] = useState<MedResponse[]>([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [skipped, setSkipped] = useState([]);
  const [taken, setTaken] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scheduledReminders, setScheduledReminders] = useState([]);

  const mapHariKeExpo = {
    sunday: 1,
    monday: 2,
    tuesday: 3,
    wednesday: 4,
    thursday: 5,
    friday: 6,
    saturday: 7,
  };
  
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  useEffect(() => {
    const requestPermissions = async() => {
      if (Device.isDevice) {
        const { status: existingStatus} =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const {status} = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        setPermissionsGranted(finalStatus === "granted")
      }else {
        console.log("Must use a physical device for Push Notifications");
      }
    };

    requestPermissions();
  }, []);

  const scheduleNotifications = async (med) => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
  
      const mapHariKeExpo = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
      };
  
      const activeDays = Object.keys(mapHariKeExpo).filter(
        (day) => med[day] === 1
      );
  
      if (activeDays.length === 0) return console.warn("Tidak ada hari terpilih.");
  
      const [hours, minutes, seconds] = med.time_to_take
        .split(":")
        .map(Number);
  
      const now = new Date();
      let notificationsScheduled = 0; // To track how many notifications are set
  
      for (const day of activeDays) {
        const targetDay = mapHariKeExpo[day];
        const currentDay = now.getDay();
  
        // Hitung waktu hingga notifikasi berikutnya
        let daysUntilNext = (targetDay - currentDay + 7) % 7;
        if (daysUntilNext === 0) {
          const targetTime = new Date();
          targetTime.setHours(hours, minutes, 0, 0);
          if (now >= targetTime) daysUntilNext = 7; // Jika sudah lewat, tunggu minggu depan
        }
  
        const triggerTime = new Date(now);
        triggerTime.setDate(now.getDate() + daysUntilNext);
        triggerTime.setHours(hours, minutes, 0, 0);
  
        // Pastikan timeDiff bernilai positif (selisih waktu dalam ms)
        const timeDiff = triggerTime - now;
        if (timeDiff <= 0) {
          console.warn(`Waktu tidak valid: ${med.med_name} untuk ${day}`);
          continue; // Lewati jika waktu telah lewat
        }
  
        // Menunjukkan waktu trigger yang sudah dihitung
        console.log(
          `Menjadwalkan notifikasi: ${med.med_name} pada ${day} di ${triggerTime.toLocaleString()}`
        );
  
        // Simulasi notifikasi di Expo Go dengan setTimeout
        setTimeout(async () => {
          try {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "Waktunya Minum Obat 💊",
                body: `${med.med_name} - ${med.med_dose} ${med.unit}`,
                sound: "default",
              },
              trigger: null, // Langsung kirim
            });
            console.log(`Notifikasi dikirim: ${med.med_name} pada ${day}`);
          } catch (error) {
            console.error(`Error dalam mengirim notifikasi: ${med.med_name} pada ${day}`, error);
          }
        }, timeDiff);
  
        notificationsScheduled++; // Increment when a notification is scheduled
      }
  
      if (notificationsScheduled === 0) {
        console.warn("Tidak ada notifikasi yang dijadwalkan.");
      }
    } catch (error) {
      console.error("Gagal menjadwalkan notifikasi:", error);
    }
  };
  

  // const scheduleNotifications = async (med) => {
  //   try {
  //     // Bersihkan notifikasi lama agar tidak duplikat
  //     await Notifications.cancelAllScheduledNotificationsAsync();

  //     console.log("Med untuk dijadwalkan:", med)

  //     const [hours, minutes, seconds] = med.time_to_take
  //     .split(":")
  //     .map((num) => Number(num).toString().padStart(2, "0"));

  //     const days = Object.keys(mapHariKeExpo).filter(
  //       (day) => med[day] === 1
  //     );

  //     if (days.length === 0) {
  //       console.warn("Tidak ada hari aktif untuk notifikasi.");
  //       return;
  //     }
      
  //     const now = new Date();

  //     for (const day of days) {
  //       const targetDay = mapHariKeExpo[day];
  //       const currentDay = now.getDay();

  //       let daysUntilNext = (targetDay - currentDay + 7) % 7;
  //       if (daysUntilNext === 0) {
  //         const targetTime = new Date();
  //         targetTime.setHours(hours, minutes, 0, 0);
  //         if (now >= targetTime) daysUntilNext = 7; // Jika sudah lewat, tunggu minggu depan
  //       }

  //       const triggerTime = new Date(now);
  //       triggerTime.setDate(now.getDate() + daysUntilNext);
  //       triggerTime.setHours(hours, minutes, 0, 0);

  //       const timeDiff = triggerTime - now; // Selisih waktu dalam ms


  //       // if (
  //       //   now.getDay() + 1 > expoDay || // Jika hari ini sudah lewat
  //       //   (now.getDay() + 1 === expoDay &&
  //       //     (now.getHours() > hours ||
  //       //       (now.getHours() === hours && now.getMinutes() >= minutes)))
  //       // ) {
  //       //   // Setel ke minggu depan
  //       //   nextNotification.setDate(nextNotification.getDate() + 7);
  //       // } else {
  //       //   // Setel ke hari target minggu ini
  //       //   const daysUntilNext = expoDay - (now.getDay() + 1);
  //       //   nextNotification.setDate(nextNotification.getDate() + daysUntilNext);
  //       // }

  //       console.log(
  //         `Menjadwalkan notifikasi: ${med.med_name} pada ${day} dalam ${timeDiff / 1000} detik`
  //       );  

  //   //     await Notifications.scheduleNotificationAsync({
  //   //       content: {
  //   //         title: "Waktunya Minum Obat 💊",
  //   //         body: `${med.med_name} - ${med.med_dose} ${med.unit}`,
  //   //         sound: "default",
  //   //       },
  //   //       trigger: {
  //   //         // type: Notifications.TriggerType.DATE,
  //   //         date: nextNotification,
  //   //         repeats: true,
  //   //       },
  //   //     });
  //   //     // console.log(
  //   //     //   `Notifikasi disetel: ${med.med_name} pada ${day} jam ${hours}:${minutes}`
  //   //     // );
  //   //   }
  //   // } catch (error) {
  //   //   console.error("Gagal menjadwalkan notifikasi:", error);

  //   // Simulasi notifikasi di Expo Go
  //   setTimeout(async () => {
  //     await Notifications.scheduleNotificationAsync({
  //       content: {
  //         title: "Waktunya Minum Obat 💊",
  //         body: `${med.med_name} - ${med.med_dose} ${med.unit}`,
  //         sound: "default",
  //       },
  //       trigger: null, // Langsung kirim
  //     });
  //     console.log(`Notifikasi dikirim: ${med.med_name} pada ${day}`);
  //     }, timeDiff);
  //   }
  //   } catch (error) {
  //     console.error("Gagal menjadwalkan notifikasi:", error);
  //   }
  // };

  const days = [
    { id: 0, label: "S" },
    { id: 1, label: "M" },
    { id: 2, label: "T" },
    { id: 3, label: "W" },
    { id: 4, label: "T" },
    { id: 5, label: "F" },
    { id: 6, label: "S" },
  ];

  const [selectedDays, setSelectedDays] = useState({
    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thursday: 0,
    friday: 0,
    saturday: 0,
    sunday: 0,
  });

  // State untuk menyimpan data pengguna
  const [currentUser, setCurrentUser] = useState({ name: "Guest" });

  // Fungsi untuk memeriksa status pengguna (guest atau terdaftar)
  const checkUserStatus = async () => {
    try {
      const isGuest = await AsyncStorage.getItem("isGuest");
      if (isGuest === "false") {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setCurrentUser(parsedUserData); // Set data pengguna terdaftar
        }
      } else {
        setCurrentUser({ name: "Guest" }); // Set sebagai guest
      }
    } catch (error) {
      console.error("Gagal memeriksa status pengguna:", error);
      setCurrentUser({ name: "Guest" }); // Fallback ke guest jika terjadi error
    }
  };

  // Panggil checkUserStatus saat komponen pertama kali di-render
  useEffect(() => {
    const fetchData = async () => {
      await checkUserStatus();
    };

    fetchData();
  }, []);

  const fetchMedications = async () => {
    try {
      const medications = await getMedications();
      console.log("Fetched medications:", medications);
      setMedList(medications || []);
    } catch (error) {
      console.error("Error fetching medications:", error);
      setMedList([]);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  const toggleDaySelection = (day) => {
    setSelectedDays((prevDays) => ({
      ...prevDays,
      [day]: prevDays[day] === 1 ? 0 : 1, // Toggle antara 1 dan 0
    }));
  };

  const handleIconPress = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleSelectUnit = (unit) => {
    setSelectedUnit(unit);
    setDropdownVisible(false);
  };

  const handleEditReminder = (index) => {
    console.log("Selected Index:", index); // Tambahkan log ini
    console.log("Med edit: ", medList[index])

    const medToEdit = medList[index];
    // if (!medToEdit) return; // Ensure medToEdit is defined
  
    setMedName(medToEdit.med_name);
    setMedDose(medToEdit.med_dose);
    setSelectedMedType(medToEdit.type);
    setSelectedTime(new Date(`1970-01-01T${medToEdit.time_to_take}`));
    setSelectedDays({
      monday: medToEdit.monday,
      tuesday: medToEdit.tuesday,
      wednesday: medToEdit.wednesday,
      thursday: medToEdit.thursday,
      friday: medToEdit.friday,
      saturday: medToEdit.saturday,
      sunday: medToEdit.sunday,
    });
    setSelectedIndex(index);
    setShowImages(!showImages);
  };

  const handlePressItem = (index) => {
    setSelectedIndex(index === selectedIndex ? null : index);
  };

  const handleSkipItem = async (index) => {
    const skippedMed = medList[index];
    if (!skippedMed) return; 
    try {
      await deleteMedication(skippedMed.id);
      setMedList(medList.filter((_, i) => i !== index));
      fetchMedications();
      setSelectedIndex(null);
    } catch (error) {
      console.error("Error skipping medication:", error);
    }
  };

  // const handleTakenItem = async (index) => {
  //   const takenMed = medList[index];
  //   try {
  //     await deleteMedication(takenMed.id);
  //     // setMedList(medList.filter((_, i) => i !== index));
  //     fetchMedications();
  //     setSelectedIndex(null);
  //   } catch (error) {
  //     console.error("Error marking medication as taken:", error);
  //   }
  // };

  const handleAddMedPress = (index) => {
    // setSelectedIndex(index);
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

  const showType = (medType) => {
    switch (medType) {
      case "Pil":
        return require("../../assets/images/Pil.png");
      case "Sirup":
        return require("../../assets/images/Sirup.png");
      case "Tetes":
        return require("../../assets/images/Tetes.png");
      case "Krim":
        return require("../../assets/images/Krim.png");
      case "Tablet":
        return require("../../assets/images/Tablet.png");
      default:
        return null; // Jika tidak cocok, kembalikan null
    }
  };  

  const handleNextPress = () => {
    if (!medName || !medDose) {
      alert("Please fill in all the medication details before proceeding!");
      return;
    }

    setShowDetailsModal(false);
    setShowReminderModal(true);
  };

  const handleSetReminderPress = async () => {
    if (!selectedDays || !selectedTime || !medName || !medDose) {
      alert("Please fill in all details for the reminder!");
      return;
    }
    // Konversi waktu ke format H:i:s
    const formatTime = (date: Date): string => {
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    };

    const newMed = {
      med_name: medName,
      unit: selectedUnit,
      med_dose: medDose,
      type: selectedMedType,
      time_to_take: formatTime(new Date(selectedTime)), // Format waktu yang benar
      monday: selectedDays.monday || 0,
      tuesday: selectedDays.tuesday || 0,
      wednesday: selectedDays.wednesday || 0,
      thursday: selectedDays.thursday || 0,
      friday: selectedDays.friday || 0,
      saturday: selectedDays.saturday || 0,
      sunday: selectedDays.sunday || 0
    };

    try {
      const isGuest = await AsyncStorage.getItem("isGuest");
      let updatedMedList = [...medList];
      if (isGuest === "true") {
        updatedMedList.push(newMed);
      } else {
        if (selectedIndex !== null && medList[selectedIndex]?.schedules?.length > 0) {
          const updatedMed = await updateMedication(
            medList[selectedIndex].schedules[0].id,
            newMed
          );
          updatedMedList = medList.map((med, index) =>
            index === selectedIndex ? updatedMed : med
        );
        alert("Medication reminder successfully updated!");
      } else {
          // console.log("Fetched medications:", medications);
          console.log("Payload sent to backend:", newMed);
          const addedMed = await addMedication(newMed);
          updatedMedList.push(addedMed);
          alert("Medication reminder successfully saved!");
        }
      }
      console.log("Isi med:", newMed);
      console.log("Isi schedules:", newMed.schedules);
      setMedList(updatedMedList);
      resetForm();
      setShowReminderModal(false);
      fetchMedications();
      await scheduleNotifications(newMed);
    } catch (error) {
      console.error("Error saving medication:", error);
    }
  };
  
  const resetForm = () => {
    setMedName("");
    setMedDose("");
    setSelectedMedType(null);
    setSelectedDays({
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0,
    });
    setSelectedTime(new Date());
    setSelectedUnit("mg");
    setSelectedIndex(null);
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

  // Fungsi untuk mengonversi biner ke string nama hari
const convertScheduleToString = (schedule) => {
  if (!schedule || typeof schedule !== "object") {
    return "No Schedule";
  }

  const daysMap = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  };

  const activeDays = Object.keys(schedule)
    .filter((day) => schedule[day] === 1 || schedule[day] === true) // Tangani 1 atau true
    .map((day) => daysMap[day as keyof typeof daysMap] || day); // Gunakan default jika tidak ada di daysMap

  return activeDays.length > 0 ? activeDays.join(", ") : "No Schedule";
};

  const closeDropdown = () => {
    setDropdownVisible(false); // Menutup dropdown
  };

  const availableUnits = ["mg", "ml"].filter((unit) => unit !== selectedUnit); // Menyaring opsi

  const units = {
    1: 'mg',
    2: 'ml'
  };


  return (
    // <SafeAreaView>
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.title}>Hello, </Text>
        <Text style={styles.subtitle}>{currentUser.name ? currentUser.name : "Guest"}</Text>
      </View>
      <View style={styles.box}>
        <View style={styles.textContainer}>
          <View style={styles.layout1}>
            <Text style={styles.text1Box}>What are your plans for today 😊</Text>
            <Text style={styles.text2Box}>Did you remember to take your medicine or vitamine?</Text>
          </View>
        </View>
        <Image source={images.reminder1} style={styles.reminder1} />
      </View>
      <Text style={styles.midText}>Medicine List</Text>

      {/* ScrollView untuk daftar obat */}
      <ScrollView
        style={styles.medListContainer}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >

        {!medList.length || (currentUser.name == "Guest") ? (
          <Text style={styles.noMedText}>No medication added yet</Text>
        ) : (
          medList.map((med, index) => (
            <TouchableOpacity
              key={med.id || index} // Gunakan ID jika ada, fallback ke index
              style={[styles.medItem, { backgroundColor: "#F3F6C8" }]}
              onPress={() => handlePressItem(index)}
            >
              {med.image && (
                <Image
                  source={typeof med.image === "string" ? { uri: med.image } : med.image}
                  style={styles.medIcon}
                />
              )}
              {showType(med.type) && (<Image source={showType(med.type)} style={styles.medIcon} />)}
              <View style={styles.medDetails}>
                <Text style={styles.medName}>{med.med_name}</Text>
                <Text style={styles.medType}>
                  {med.med_dose} {med.unit_id && units[med.unit_id] ? units[med.unit_id] : "No Unit"}
                </Text>
                
                <Text style={styles.medDate}>
                {med.schedules && med.schedules.length > 0? convertScheduleToString(med.schedules[0]): "No Schedule"}
                </Text>
                <Text style={styles.medTime}>
                {med.schedules && med.schedules.length > 0? med.schedules[0].time_to_take.slice(0, 5): "No Time"}
                </Text>

              </View>  

              <TouchableOpacity
                style={styles.editIconWrapper}
                onPress={() => handleEditReminder(index)} // Edit action logic
              >
                <Image source={icons.edit} style={styles.icon} />
              </TouchableOpacity>

              {selectedIndex === index && (
                <View style={styles.statusContainer}>
                  <TouchableOpacity onPress={() => handleSkipItem(index)}>
                    <View style={styles.statusItemRight}>
                      <Image source={icons.deleteItem} style={styles.statusIcon} />
                      {/* <Text style={styles.statusText}>Delete</Text> */}
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
              <Text style={styles.chooseText}>Choose Med Type</Text>
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
                placeholder ="Name"
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
            <Text style={styles.reminderTitle}>Set Reminder</Text>

            {/* /* Pilihan Hari */}
            <View style={styles.containerDay}>
                {Object.keys(selectedDays).map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      selectedDays[day] === 1 && styles.selectedDayButton,
                    ]}
                    onPress={() => toggleDaySelection(day)}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        selectedDays[day] === 1 && styles.selectedDayText,
                      ]}
                    >
                      {day.charAt(0).toUpperCase()}{" "}
                      {/* Menampilkan huruf pertama dari nama hari */}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

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
              <Text style={styles.nextButtonText}>Save Reminder</Text>
              
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
    justifyContent: "flex-start", // Posisikan ke bawah layar
    backgroundColor: "#FFF", // Warna latar modal
    borderRadius: 20, // Membuat sudut membulat
    padding: 20, // Ruang dalam modal
    alignItems: "center", // Elemen di tengah horizontal
    width: "100%", // Sesuaikan lebar modal
    height: "35%", // Tinggi modal (atur sesuai kebutuhan)
    elevation: 5, // Bayangan di Android
    shadowColor: "#000", // Bayangan di iOS
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    top: 180,
  },
  detailModalContainer: {
    justifyContent: "flex-start", // Posisikan ke bawah layar
    backgroundColor: "#FFF", // Warna latar modal
    borderRadius: 20, // Membuat sudut membulat
    padding: 20, // Ruang dalam modal
    alignItems: "center", // Elemen di tengah horizontal
    width: "100%", // Sesuaikan lebar modal
    height: "35%", // Tinggi modal (atur sesuai kebutuhan)
    elevation: 5, // Bayangan di Android
    shadowColor: "#000", // Bayangan di iOS
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    top: 180,
  },
  reminderTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  picker: {
    width: "100%",
    height: 50,
    marginVertical: 10,
    backgroundColor: "#EAEAEA",
    borderRadius: 10,
  },
  detailTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: {
    width: 350,
    height: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
    backgroundColor: "white",
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4
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
    backgroundColor: '#2B4763',
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {width: 5, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: -10,
  },

  nextButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  topContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 16,
    marginTop: 20,
    marginLeft: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 30,
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
    marginTop: 10,
    // marginBottom: 20
    alignItems: "center",
  },
  text1Box: {
    fontSize: 25,
    fontWeight: "bold",
    // marginTop: 20
  },
  layout2: {
    flex: 1,
    width: "50%",
    marginLeft: 10,
    // marginTop: 5,
  },
  text2Box: {
    fontSize: 15,
    color: "red",
    marginLeft: 7,
    marginTop: 8
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
    marginRight: -30,
    marginTop: -100,
  },
  midText: {
    marginTop: 20,
    marginLeft: 30,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  iconAdd: {
    position: "absolute",
    bottom: 25,
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
    gap: 10, // Jarak antar gambar
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
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
    backgroundColor: "white",
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4, marginBottom: 30,
  },
  placeholderText: {
    fontSize: 16,
    color: "#B0B0B0", // Warna placeholder (abu-abu terang)
    marginTop: 10,
    marginLeft: 10,
    alignItems: "center",
  },
  iconWrapper: {
    position: "absolute",
    top: 15,
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
    alignItems: "center",
    width: "100%",
    marginTop: 10,
    // borderWidth: 1, // Debugging border
    // borderColor: "green",
    position: "relative", // Pastikan posisi relatif untuk absolute child
  },
  
  statusItemRight: {
    flexDirection: "row",
    marginLeft: "76%", // Mendorong ke pojok kanan
  },
  
  
  statusIcon: {
    width: 25,
    height: 25,
    marginRight: 105,
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
  containerDay: {
    flexDirection: "row", // Menyusun elemen secara horizontal
    justifyContent: "center", // Posisikan ke tengah
    alignItems: "center",
    marginVertical: 10,
    gap: 10,
    marginBottom: 15,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedDayButton: {
    backgroundColor: "#2B4763",
  },
  dayText: {
    fontSize: 18,
    color: "black",
    marginBottom: 5,
    marginLeft: 3,
    marginTop: 3,
  },
  selectedDayText: {
    color: "white",
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 6,
    color: "#333",
  },
});

export default MedReminder;