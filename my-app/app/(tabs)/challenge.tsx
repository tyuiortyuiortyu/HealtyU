import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Pedometer } from "expo-sensors"; // Pastikan ini ada
import { Accelerometer } from "expo-sensors";
import { useRouter } from "expo-router"; // Impor useRouter dari expo-router
import AsyncStorage from "@react-native-async-storage/async-storage";
import images from "../../constants/images";
import icons from "../../constants/icons";

const initialNotifications = [
  { id: "1", text: "Tantangan Notification #1" },
  { id: "2", text: "Tantangan Notification #2" },
  {
    id: "3",
    text: "Congratulations! You have completed 20 targets this week.",
  },
  { id: "4", text: "No Notifications!" },
];

const Challenge = () => {
  // go
  const [steps, setSteps] = useState(990); // Initial steps
  const [movingTime, setMovingTime] = useState(0); // dalam menit
  const [standingTime, setStandingTime] = useState(0); // dalam jam
  const [isMoving, setIsMoving] = useState(false);
  const lastYRef = useRef(0);
  const lastTimestampRef = useRef(0);
  const movingInterval = useRef(null);
  const standingInterval = useRef(null);
  const stopTimer = useRef(null);
  const [goal, setGoal] = useState(1000);
  const [estimatedCaloriesBurned, setEstimatedCaloriesBurned] = useState(0); 
  const [rewards, setRewards] = useState(0); // Starting rewards count
  const [finalGoalReached, setFinalGoalReached] = useState(false); 

  // const goal = 10000;

  useEffect(() => {
    // Update the goal and rewards based on steps
    if (steps >= goal && goal < 10000) {
      handleRewardPress(`Goal ${goal}`);
      setGoal(prevGoal => Math.min(prevGoal + 1000, 10000)); // Increase the goal by 1000
      if (rewards < 10) { // Only increase rewards if they are less than 10
        setRewards(prevRewards => Math.min(prevRewards + 1, 10)); // Increase rewards
      }
    }
    
    if (steps >= 10000) {
      setFinalGoalReached(true); // Final goal reached
    }

    // Update calories burned (example logic)
    setEstimatedCaloriesBurned(steps * 0.05); // Replace with your calorie logic
  }, [steps, goal]);


  const [currentDay, setCurrentDay] = useState(new Date().getDate());

  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setHours(24, 0, 0, 0); // Set waktu ke jam 00:00 hari berikutnya
  
    const timeUntilMidnight = tomorrow - now; // Hitung waktu tersisa sampai 00:00
  
    const resetTimeout = setTimeout(() => {
      setSteps(0);
      setMovingTime(0);
      setStandingTime(0);
      setCurrentDay(new Date().getDate()); // Update tanggal setelah reset
  
      // Panggil ulang efek untuk menjadwalkan reset berikutnya
    }, timeUntilMidnight);
  
    return () => clearTimeout(resetTimeout);
  }, []);  

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

  // Navigasi ke halaman reward menggunakan Expo Router
  // const router = useRouter(); // Unused variable

  // Mendapatkan tanggal saat ini dalam format yang sesuai
  const currentDate = new Date();

  // Mendapatkan nama bulan, tanggal, dan hari
  const month = currentDate.toLocaleString("default", { month: "long" });
  const day = currentDate.getDate();
  const weekday = currentDate.toLocaleString("default", { weekday: "long" });

  // Format yang diinginkan: "Bulan-Tanggal, Hari"
  const formattedDate = `${month} ${day}, ${weekday}`;

  // Fungsi untuk mengatur tahap progres berdasarkan langkah
  const getProgressStage = () => {
    if (steps < 1000) {
      return "start";
    } else if (steps >= 1000 && steps < goal) {
      return "middle";
    } else {
      return "end";
    }
  };

  const progressStage = getProgressStage();

  useEffect(() => {
    let subscription;

    Accelerometer.isAvailableAsync().then((result) => {
      if (result) {
        subscription = Accelerometer.addListener((accelerometerData) => {
          const { y } = accelerometerData;
          const threshold = 0.1;
          const timeStamp = new Date().getTime();

          if (
            Math.abs(y - lastYRef.current) > threshold &&
            timeStamp - lastTimestampRef.current > 800
          ) {
            setSteps((prevSteps) => prevSteps + 1);
            setIsMoving(true);
            lastYRef.current = y;
            lastTimestampRef.current = timeStamp;

            // Reset timer jika ada pergerakan
            if (stopTimer.current) {
              clearTimeout(stopTimer.current);
            }

            // Timer untuk mendeteksi apakah berhenti setelah 1 detik
            stopTimer.current = setTimeout(() => {
              setIsMoving(false);
            }, 1000);
          }
        });
      } else {
        console.log("Accelerometer is not available on this device");
      }
    });

    // Interval untuk menghitung waktu moving
    const movingInterval = setInterval(() => {
      setMovingTime((prevTime) => (isMoving ? prevTime + 1 : prevTime));
    }, 1000);

    // Interval untuk menghitung waktu standing (HANYA tambah jika user benar-benar diam)
    const standingInterval = setInterval(() => {
      setStandingTime((prevTime) => (!isMoving ? prevTime + 1 : prevTime));
    }, 1000);

    return () => {
      if (subscription) subscription.remove();
      clearInterval(movingInterval);
      clearInterval(standingInterval);
      if (stopTimer.current) clearTimeout(stopTimer.current);
    };
  }, [isMoving]); // Gunakan dependensi `isMoving`
  // const estimatedCaloriesBurned = steps * CALORIES_PER_STEP;

  // Fungsi untuk menghitung berat badan yang berkurang
  const calculateWeightReduced = (calories) => {
    // 3500 kalori = 0.5 kg
    const weightReduced = (calories / 3500) * 0.5;
    return weightReduced.toFixed(2); // Membulatkan ke 2 desimal
  };

  const weightLoss = calculateWeightReduced(estimatedCaloriesBurned);

  // Menentukan gambar dan kata-kata yang akan ditampilkan berdasarkan tahap
  let monsterImage;
  let motivationText;
  let stepsLeftText;

  if (progressStage === "middle") {
    monsterImage = images.monster2; // Gambar pertama
    motivationText = "You're almost there!";
    stepsLeftText = `Steps left to defeat`;
  } else if (progressStage === "end") {
    monsterImage = images.monster3; // Gambar kedua (lebih besar dan lebih menonjol)
    motivationText = "Congrats!";
    stepsLeftText = "You did it! High fives all around!";
  } else {
    monsterImage = images.monster1; // Gambar awal (start)
    motivationText = "You're off to a great start!";
    stepsLeftText = "Steps left to defeat";
  }

  // - done

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showRewardPage, setShowRewardPage] = useState(true);
  const [showMainPage, setShowMainPage] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    []
  );
  const [showAfterClaimRewardPage, setShowAfterClaimRewardPage] =
    useState(false);
  const [selectedBox, setSelectedBox] = useState<string | null>(null);
  const [activePage, setActivePage] = useState("afterClaimReward");

  const toggleNotifications = () => setShowNotifications(!showNotifications);

  const toggleNotificationSelection = (id: string) => {
    setSelectedNotifications((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const clearSelectedNotifications = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter(
        (notification) => !selectedNotifications.includes(notification.id)
      )
    );
    setSelectedNotifications([]);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setSelectedNotifications([]);
  };

  const closeRewardPage = () => {
    setShowRewardPage(false);
    setShowMainPage(true);
  };

  const goBackToRewardPage = () => {
    setShowRewardPage(true);
    setShowMainPage(false);
  };

  const handleBoxPress = (boxId: string) => {
    setSelectedBox(boxId);
    setShowMainPage(false);
    setShowAfterClaimRewardPage(true);
  };

  const handleRewardPress = (boxId) => {
    console.log(`${boxId} opened!`);

    // Show reward page logic here
    setShowMainPage(false);
    setShowAfterClaimRewardPage(true);
  };

  const handleClaimReward = () => {
    setShowRewardPage(true); // Tampilkan RewardPage
    setShowMainPage(false); // Sembunyikan MainPage
    setShowAfterClaimRewardPage(false); // Sembunyikan AfterClaimRewardPage
  };

  const RewardPage = () => (
    <View style={{ flex: 1, padding: 10, backgroundColor: "#ffff" }}>
      {/* Tanggal dan Notifikasi */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 10,
          marginBottom: 15,
        }}
      >
        {/* Tanggal di kiri */}
        <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 15 }}>
          {formattedDate}
        </Text>

        {/* Grup Ikon: Ikon baru dan Ikon Notifikasi */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={closeRewardPage}>
            <Image
              source={icons.trophy}
              style={{ width: 24, height: 24, marginRight: 10 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleNotifications}
            style={{ padding: 8 }}
          >
            <FontAwesome name="bell" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Garis Pembatas */}
      <View style={{ height: 1, backgroundColor: "#ccc", marginBottom: 50 }} />

      {/* Konten Utama */}
      <View
        style={{ alignItems: "center", justifyContent: "center", padding: 5 }}
      >
        <View
          style={
            progressStage === "end"
              ? {
                  flexDirection: "row",
                  alignItems: "flex-start",
                  marginBottom: 5,
                }
              : { flexDirection: "row", alignItems: "center", marginBottom: 5 }
          }
        >
          {/* Gambar Monster di sebelah kiri */}
          <Image
            source={monsterImage}
            style={
              progressStage === "end"
                ? {
                    width: 148.18,
                    height: 148.18,
                    marginRight: 20,
                    marginTop: -20,
                    marginLeft: 40,
                    marginBottom: -10,
                  }
                : {
                    width: 148.18,
                    height: 148.18,
                    marginRight: 10,
                    marginLeft: 50,
                  }
            }
          />
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              style={
                progressStage === "end"
                  ? {
                      fontSize: 15,
                      fontWeight: "bold",
                      marginBottom: 0,
                      textAlign: "left",
                      color: "#877777",
                      marginTop: 1,
                    }
                  : {
                      fontSize: 22,
                      fontWeight: "bold",
                      marginBottom: 5,
                      textAlign: "left",
                      color: "#321C1C",
                    }
              }
            >
              {motivationText}
            </Text>
            <Text
              style={
                progressStage === "end"
                  ? {
                      fontSize: 20,
                      color: "#321C1C",
                      textAlign: "left",
                      fontWeight: "semibold",
                      marginTop: 10,
                      marginRight: 40,
                    }
                  : { fontSize: 16, color: "#666", textAlign: "left" }
              }
            >
              {stepsLeftText}
            </Text>
            {progressStage !== "end" && ( // Tampilkan stepsCount hanya jika bukan fase end
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "bold",
                  marginBottom: 5,
                  textAlign: "left",
                  color: "#321C1C",
                }}
              >
                {goal - steps}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={{ marginTop: 20, marginHorizontal: 30 }}>
        <View
          style={{
            width: "100%",
            height: 15,
            borderRadius: 5,
            overflow: "visible",
            position: "relative",
          }}
        >
          {/* Progress Bar Background dan Fill */}
          <View
            style={{
              height: 15,
              backgroundColor: "#e0e0e0",
              borderRadius: 5,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                height: 15,
                backgroundColor: "#4caf50",
                width: `${(steps / goal) * 100}%`,
              }}
            />
          </View>

          {/* Chest Image */}
          <TouchableOpacity onPress={() => handleBoxPress("rewards")}
            disabled={steps<10000}>
            <Image
              source={icons.Chest}
              style={{
                position: "absolute",
                right: -20,
                top: -30,
                width: 43,
                height: 43,
                zIndex: 1,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Info */}
      {progressStage === "end" ? (
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "semibold",
              textAlign: "center",
              color: "#321C1C",
            }}
          >
            10,000 steps done!
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#2B4763",
              padding: 15,
              borderRadius: 30,
              marginTop: 20,
              width: "40%",
            }}
            onPress={() => handleBoxPress("rewards")}
          >
            <Text
              style={{
                color: "#D9D9D9",
                fontSize: 16,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Claim reward
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1, alignItems: "flex-start" }}>
            <Text style={{ fontSize: 16, color: "#666", marginBottom: 5 }}>
              {steps} steps done
            </Text>
          </View>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              Goal {goal}
            </Text>
          </View>
        </View>
      )}

      {/* Additional Stats - Calories, Moving, Standing */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 60,
          marginRight: 10,
          marginLeft: 10,
        }}
      >
        {/* Calories Card */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 10,
            padding: 15,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            width: "30%",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={icons.calories}
              style={{ width: 24, height: 24, marginRight: 2 }}
            />
            <Text style={{ fontSize: 14, fontWeight: "bold", color: "#333" }}>
              Calories
            </Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000" }}>
            {estimatedCaloriesBurned.toFixed(2)}
          </Text>
          <Text style={{ fontSize: 12, color: "#666" }}>/Kcal</Text>
        </View>

        {/* Moving Card */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 10,
            padding: 15,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            width: "30%",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={icons.clock}
              style={{ width: 24, height: 24, marginRight: 4 }}
            />
            <Text style={{ fontSize: 14, fontWeight: "bold", color: "#333" }}>
              Moving
            </Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000" }}>
            {(movingTime / 60).toFixed(1)}
          </Text>
          <Text style={{ fontSize: 12, color: "#666" }}>/minutes</Text>
        </View>

        {/* Standing Card */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 10,
            padding: 15,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            width: "30%",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={icons.standing}
              style={{ width: 24, height: 24, marginRight: 0 }}
            />
            <Text style={{ fontSize: 14, fontWeight: "bold", color: "#333" }}>
              Standing
            </Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000" }}>
            {(standingTime / 3600).toFixed(1)}
          </Text>
          <Text style={{ fontSize: 12, color: "#666" }}>/hours</Text>
        </View>
      </View>
    </View>
  );

  const MainPage = () => (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 16,
          backgroundColor: "#ffffff",
          borderBottomWidth: 1,
          borderBottomColor: "#ccc",
        }}
      >
        <TouchableOpacity onPress={goBackToRewardPage} style={{ padding: 8 }}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={closeRewardPage}>
            <Image
              source={icons.trophy}
              style={{ width: 24, height: 24, marginRight: 10 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleNotifications}
            style={{ padding: 8 }}
          >
            <FontAwesome name="bell" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 20,
          backgroundColor: "#f8f9fa",
        }}
      >
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <View style={{ position: "absolute", top: 25, zIndex: -1 }}>
            <Image
              source={images.confetti}
              style={{ width: 200, height: 200, opacity: 0.8 }}
            />
          </View>

          <Image
            source={images.profile}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              marginBottom: 10,
              marginTop: 60,
            }}
          />

          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#4caf50" }}>
            Congratulations!
          </Text>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#000" }}>
            {currentUser.name}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            style={{
              width: "48%",
              backgroundColor: "#ffffff",
              borderRadius: 10,
              padding: 15,
              marginVertical: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3,
            }}
            onPress={() => handleBoxPress("rewards")}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 24, fontWeight: "bold", color: "#343a40" }}
                >
                  {rewards}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#6c757d",
                    textAlign: "center",
                    marginTop: 5,
                  }}
                >
                  Rewards
                </Text>
              </View>
              <Image
                source={images.confetti}
                style={{ width: 50, height: 50 }}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: "48%",
              backgroundColor: "#ffffff",
              borderRadius: 10,
              padding: 15,
              marginVertical: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3,
            }}
            onPress={() => handleBoxPress("calories")}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 24, fontWeight: "bold", color: "#343a40" }}
                >
                  {estimatedCaloriesBurned.toFixed(2)}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#6c757d",
                    textAlign: "center",
                    marginTop: 5,
                  }}
                >
                  Total calories burned
                </Text>
              </View>
              <Image
                source={images.calories}
                style={{ width: 50, height: 50 }}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: "48%",
              backgroundColor: "#ffffff",
              borderRadius: 10,
              padding: 15,
              marginVertical: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3,
            }}
            onPress={() => handleBoxPress("target")}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 24, fontWeight: "bold", color: "#343a40" }}
                >
                  {rewards}/10
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#6c757d",
                    textAlign: "center",
                    marginTop: 5,
                  }}
                >
                  Targets
                </Text>
              </View>
              <Image source={images.target} style={{ width: 50, height: 50 }} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: "48%",
              backgroundColor: "#ffffff",
              borderRadius: 10,
              padding: 15,
              marginVertical: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3,
            }}
            onPress={() => handleBoxPress("weight")}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 24, fontWeight: "bold", color: "#343a40" }}
                >
                  {weightLoss}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#6c757d",
                    textAlign: "center",
                    marginTop: 5,
                  }}
                >
                  Weight Reduced
                </Text>
              </View>
              <Image source={images.weight} style={{ width: 50, height: 50 }} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  const NotificationsPage = () => (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 16,
          backgroundColor: "#ffffff",
          borderBottomWidth: 1,
          borderBottomColor: "#ccc",
        }}
      >
        <TouchableOpacity
          onPress={() => setShowNotifications(false)}
          style={{ padding: 8 }}
        >
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={closeRewardPage}>
            <Image
              source={icons.trophy}
              style={{ width: 24, height: 24, marginRight: 10 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleNotifications}
            style={{ padding: 8 }}
          >
            <FontAwesome name="bell" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 20,
          backgroundColor: "#f8f9fa",
        }}
      >
        {notifications.length === 0 ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontSize: 18, color: "#D9D9D9" }}>
              No Notifications!
            </Text>
          </View>
        ) : (
          <>
            <FlatList
              data={notifications}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    padding: 16,
                    backgroundColor: selectedNotifications.includes(item.id)
                      ? "#2B4763"
                      : "#ffffff",
                    borderRadius: 8,
                    marginBottom: 10,
                  }}
                  onPress={() => toggleNotificationSelection(item.id)}
                >
                  <Text
                    style={{
                      color: selectedNotifications.includes(item.id)
                        ? "#fff"
                        : "#000",
                    }}
                  >
                    {item.text}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={{
                alignSelf: "center",
                backgroundColor:
                  selectedNotifications.length > 0 ? "#2B4763" : "#ffffff",
                paddingVertical: 15,
                paddingHorizontal: 30,
                borderRadius: 30,
                marginTop: 20,
              }}
              onPress={
                selectedNotifications.length > 0
                  ? clearSelectedNotifications
                  : clearAllNotifications
              }
            >
              <Text
                style={{
                  color: selectedNotifications.length > 0 ? "#D9D9D9" : "#000",
                  fontWeight: "bold",
                }}
              >
                {selectedNotifications.length > 0
                  ? "Clear Selected"
                  : "Clear All"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );

  const RewardsPage = () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "#4caf50" }}>
        Rewards Page
      </Text>
      <Text style={{ fontSize: 18, color: "#000", marginTop: 10 }}>
        This is the rewards page.
      </Text>
      <TouchableOpacity
        style={{
          marginTop: 20,
          padding: 16,
          backgroundColor: "#4caf50",
          borderRadius: 8,
        }}
        onPress={() => setActivePage("afterClaimReward")}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );

  const CaloriesPage = () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "#4caf50" }}>
        Calories Page
      </Text>
      <Text style={{ fontSize: 18, color: "#000", marginTop: 10 }}>
        This is the calories page.
      </Text>
      <TouchableOpacity
        style={{
          marginTop: 20,
          padding: 16,
          backgroundColor: "#4caf50",
          borderRadius: 8,
        }}
        onPress={() => setActivePage("afterClaimReward")}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );

  const TargetPage = () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "#4caf50" }}>
        Target Page
      </Text>
      <Text style={{ fontSize: 18, color: "#000", marginTop: 10 }}>
        This is the target page.
      </Text>
      <TouchableOpacity
        style={{
          marginTop: 20,
          padding: 16,
          backgroundColor: "#4caf50",
          borderRadius: 8,
        }}
        onPress={() => setActivePage("afterClaimReward")}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );

  const WeightPage = () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "#4caf50" }}>
        Weight Page
      </Text>
      <Text style={{ fontSize: 18, color: "#000", marginTop: 10 }}>
        This is the weight page.
      </Text>
      <TouchableOpacity
        style={{
          marginTop: 20,
          padding: 16,
          backgroundColor: "#4caf50",
          borderRadius: 8,
        }}
        onPress={() => setActivePage("afterClaimReward")}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );

  const AfterClaimRewardPage = () => {
    const getAchievementDetails = () => {
      switch (selectedBox) {
        case "weight":
          return {
            text: `${currentUser.name} has attempted 5 kgs weight reduced!`,
            image: images.weight,
          };
        case "calories":
          return {
            text: `${currentUser.name} has burned ${estimatedCaloriesBurned.toFixed(
              2
            )} kcal!`,
            image: images.calories,
          };
        case "target":
          return {
            text: `${currentUser.name} has completed 41/60 targets!`,
            image: images.target,
          };
        case "reward":
          return {
            text: `${currentUser.name} has earned 3 rewards!`,
            image: images.reward,
          };
        default:
          return {
            text: `${currentUser.name} has achieved a new milestone!`,
            image: images.trophy,
          };
      }
    };

    const { text, image } = getAchievementDetails();

    return (
      <View style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 16,
            backgroundColor: "#ffffff",
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setShowAfterClaimRewardPage(false);
              setShowMainPage(true);
            }}
            style={{ padding: 8 }}
          >
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={closeRewardPage}>
              <Image
                source={icons.trophy}
                style={{ width: 24, height: 24, marginRight: 10 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleNotifications}
              style={{ padding: 8 }}
            >
              <FontAwesome name="bell" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            padding: 20,
            backgroundColor: "#f8f9fa",
          }}
        >
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <View style={{ position: "absolute", top: 25, zIndex: -1 }}>
              <Image
                source={images.confetti}
                style={{ width: 200, height: 200, opacity: 0.8 }}
              />
            </View>
            <Image
              source={images.profile}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                marginBottom: 10,
                marginTop: 60,
              }}
            />
            <Text
              style={{ fontSize: 16, fontWeight: "bold", color: "#4caf50" }}
            >
              Congratulations!
            </Text>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: "#000" }}>
              {currentUser.name}
            </Text>
          </View>

          <View style={{ alignItems: "center", marginTop: 20 }}>
            <View
              style={{
                width: "100%",
                backgroundColor: "#ffffff",
                borderRadius: 10,
                padding: 20,
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
                elevation: 5,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    color: "#4caf50",
                    marginBottom: 10,
                  }}
                >
                  {text}
                </Text>
                <Text
                  style={{ fontSize: 18, color: "#6c757d", textAlign: "left" }}
                >
                  Keep up the great work!
                </Text>
              </View>

              <Image
                source={image}
                style={{ width: 120, height: 120, marginLeft: 10 }}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  if (showAfterClaimRewardPage) {
    if (showNotifications) {
      return <NotificationsPage />;
    }

    switch (activePage) {
      case "rewards":
        return <RewardsPage />;
      case "calories":
        return <CaloriesPage />;
      case "target":
        return <TargetPage />;
      case "weight":
        return <WeightPage />;
      default:
        return <AfterClaimRewardPage />;
    }
  }

  if (showRewardPage) {
    return showNotifications ? <NotificationsPage /> : <RewardPage />;
  }

  if (showMainPage) {
    return showNotifications ? <NotificationsPage /> : <MainPage />;
  }

  if (showAfterClaimRewardPage) {
    return showNotifications ? <NotificationsPage /> : <AfterClaimRewardPage />;
  }

  return <RewardPage />;
};

export default Challenge;
