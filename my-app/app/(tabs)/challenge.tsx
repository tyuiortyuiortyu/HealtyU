import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Pedometer } from "expo-sensors"; // Pastikan ini ada
import { Accelerometer } from 'expo-sensors'; 
import { useRouter } from "expo-router"; // Impor useRouter dari expo-router
import images from '../../constants/images';
import icons from "../../constants/icons";
import { sub } from 'date-fns';

const CALORIES_PER_STEP = 0.05;

const initialNotifications = [
  { id: '1', text: 'Tantangan Notification #1' },
  { id: '2', text: 'Tantangan Notification #2' },
  { id: '3', text: 'Congratulations! You have completed 20 targets this week.' },
  { id: '4', text: 'No Notifications!' },
];

const Challenge = () => {

  // go
  const [steps, setSteps] = useState(0); // Initial steps
  const [isCounting, setIsCounting] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [lastTimestamp, setLastTimestamp] = useState(0);

  const goal = 10000;
 
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
    if (steps < 5000) {
      return "start";
    } else if (steps >= 5000 && steps < goal) {
      return "middle";
    } else {
      return "end";
    }
  };

  const progressStage = getProgressStage();

  useEffect (() => {
    let subscription;
    Accelerometer.isAvailableAsync().then((result) => {
      if (result) {
        subscription = Accelerometer.addListener((accelerometerData) => {
          const {y} = accelerometerData;
          const treshold = 0.1;
          const timeStamp = new Date().getTime();
          
          if (
            Math.abs(y - lastY) > treshold &&
            !isCounting &&
            (timeStamp - lastTimestamp > 800)
          ){
            setIsCounting(true);
            setLastY(y);
            setLastTimestamp(timeStamp);

            setSteps((prevSteps) => prevSteps + 1);

            setTimeout(() => {
              setIsCounting(false);
            }, 1200)
          }
        });
      }else {
        console.log('Accelerometer is not available on this device');
      }
    });

    return () => {
      if(subscription) {
        subscription.remove();
      }
    };
  }, [isCounting, lastY, lastTimestamp]);

  const resetSteps = () => {
    setSteps(0);
  };

  const estimatedCaloriesBurned = steps * CALORIES_PER_STEP;



  // Memulai penghitungan langkah
  // useEffect(() => {
  //   Pedometer.isAvailableAsync()
  //     .then((result) => {
  //       if (result) {
  //         Pedometer.watchStepCount((result: { steps: number }) => {
  //           setSteps(result.steps);
  //         });
  //       }
  //     })
  //     .catch((error) => console.log("Pedometer is not available", error));
  // }, []);

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
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [showAfterClaimRewardPage, setShowAfterClaimRewardPage] = useState(false);
  const [selectedBox, setSelectedBox] = useState<string | null>(null);
  const [activePage, setActivePage] = useState('afterClaimReward');

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
      prevNotifications.filter((notification) => !selectedNotifications.includes(notification.id))
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

  const handleClaimReward = () => {
    setShowRewardPage(true); // Tampilkan RewardPage
    setShowMainPage(false); // Sembunyikan MainPage
    setShowAfterClaimRewardPage(false); // Sembunyikan AfterClaimRewardPage
  };

  const userName = "Nikita";

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
        <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 15, }}>{formattedDate}</Text>

        {/* Grup Ikon: Ikon baru dan Ikon Notifikasi */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={closeRewardPage}>
            <Image
              source={icons.trophy}
              style={{ width: 24, height: 24, marginRight: 10 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleNotifications} style={{ padding: 8 }}>
            <FontAwesome name="bell" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Garis Pembatas */}
      <View
        style={{ height: 1, backgroundColor: "#ccc", marginBottom: 50 }}
      />

      {/* Konten Utama */}
      <View style={{ alignItems: "center", justifyContent: "center", padding: 5 }}>
        <View
          style={
            progressStage === "end"
              ? { flexDirection: "row", alignItems: "flex-start", marginBottom: 5 }
              : { flexDirection: "row", alignItems: "center", marginBottom: 5 }
          }
        >
          {/* Gambar Monster di sebelah kiri */}
          <Image
            source={monsterImage}
            style={
              progressStage === "end"
                ? { width: 148.18, height: 148.18, marginRight: 20, marginTop: -20, marginLeft: 40, marginBottom: -10 }
                : { width: 148.18, height: 148.18, marginRight: 10, marginLeft: 50 }
            }
          />
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              style={
                progressStage === "end"
                  ? { fontSize: 15, fontWeight: 'bold', marginBottom: 0, textAlign: "left", color: "#877777", marginTop: 1, }
                  : { fontSize: 22, fontWeight: "bold", marginBottom: 5, textAlign: "left", color: "#321C1C" }
              }
            >
              {motivationText}
            </Text>
            <Text
              style={
                progressStage === "end"
                  ? { fontSize: 20, color: "#321C1C", textAlign: "left", fontWeight: 'semibold', marginTop: 10, marginRight: 40,}
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
          <TouchableOpacity onPress={() => handleBoxPress('rewards')}>
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
          <Text style={{ fontSize: 14, fontWeight: "semibold", textAlign: "center", color: "#321C1C" }}>10,000 steps done!</Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#2B4763",
              padding: 15,
              borderRadius: 30,
              marginTop: 20,
              width: "40%",
            }}
            onPress={() => handleBoxPress('rewards')}
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
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Goal 10,000</Text>
          </View>
        </View>
      )}

      {/* Additional Stats - Calories, Moving, Standing */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 50,
          marginRight: 30,
          marginLeft: 30,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={icons.calories}
              style={{ width: 24, height: 24, marginRight: 8 }}
            />
            <Text style={{ fontSize: 14, fontWeight: "bold", color: "#333" }}>
              Calories
            </Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000" }}>
            {estimatedCaloriesBurned.toFixed(2)}
          </Text>
          <Text style={{ fontSize: 12, color: "#666" }}>/200Kcal</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={icons.clock}
              style={{ width: 24, height: 24, marginRight: 8 }}
            />
            <Text style={{ fontSize: 14, fontWeight: "bold", color: "#333" }}>
              Moving
            </Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000" }}>2</Text>
          <Text style={{ fontSize: 12, color: "#666" }}>/minutes</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={icons.standing}
              style={{ width: 24, height: 24, marginRight: 8 }}
            />
            <Text style={{ fontSize: 14, fontWeight: "bold", color: "#333" }}>
              Standing
            </Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000" }}>1</Text>
          <Text style={{ fontSize: 12, color: "#666" }}>/6Hours</Text>
        </View>
      </View>
    </View>
  );


  const MainPage = () => (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
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
          <TouchableOpacity onPress={toggleNotifications} style={{ padding: 8 }}>
            <FontAwesome name="bell" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, backgroundColor: '#f8f9fa' }}>
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <View style={{ position: 'absolute', top: 25, zIndex: -1 }}>
            <Image
              source={images.confetti}
              style={{ width: 200, height: 200, opacity: 0.8 }}
            />
          </View>

          <Image
            source={images.profile}
            style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 10, marginTop: 60 }}
          />

          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#4caf50' }}>Congratulations!</Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000' }}>{userName}</Text>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <TouchableOpacity
            style={{   
              width: '48%',
              backgroundColor: '#ffffff',
              borderRadius: 10,
              padding: 15,
              marginVertical: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3,
            }}
            onPress={() => handleBoxPress('rewards')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#343a40' }}>3</Text>
                <Text style={{ fontSize: 14, color: '#6c757d', textAlign: 'center', marginTop: 5 }}>Rewards</Text>
              </View>
              <Image source={images.confetti} style={{ width: 50, height: 50 }} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{   
              width: '48%',
              backgroundColor: '#ffffff',
              borderRadius: 10,
              padding: 15,
              marginVertical: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3,
            }}
            onPress={() => handleBoxPress('calories')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#343a40' }}>2290</Text>
                <Text style={{ fontSize: 14, color: '#6c757d', textAlign: 'center', marginTop: 5 }}>Total calories burned</Text>
              </View>
              <Image source={images.calories} style={{ width: 50, height: 50 }} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{   
              width: '48%',
              backgroundColor: '#ffffff',
              borderRadius: 10,
              padding: 15,
              marginVertical: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3,
            }}
            onPress={() => handleBoxPress('target')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#343a40' }}>41/60</Text>
                <Text style={{ fontSize: 14, color: '#6c757d', textAlign: 'center', marginTop: 5 }}>Targets</Text>
              </View>
              <Image source={images.target} style={{ width: 50, height: 50 }} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{   
              width: '48%',
              backgroundColor: '#ffffff',
              borderRadius: 10,
              padding: 15,
              marginVertical: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3,
            }}
            onPress={() => handleBoxPress('weight')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#343a40' }}>5</Text>
                <Text style={{ fontSize: 14, color: '#6c757d', textAlign: 'center', marginTop: 5 }}>Weight Reduced</Text>
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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
        <TouchableOpacity onPress={() => setShowNotifications(false)} style={{ padding: 8 }}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={closeRewardPage}>
            <Image
              source={icons.trophy}
              style={{ width: 24, height: 24, marginRight: 10 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleNotifications} style={{ padding: 8 }}>
            <FontAwesome name="bell" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, backgroundColor: '#f8f9fa' }}>
        {notifications.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, color: '#D9D9D9' }}>No Notifications!</Text>
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
                    backgroundColor: selectedNotifications.includes(item.id) ? '#2B4763' : '#ffffff',
                    borderRadius: 8,
                    marginBottom: 10,
                  }}
                  onPress={() => toggleNotificationSelection(item.id)}
                >
                  <Text style={{ color: selectedNotifications.includes(item.id) ? '#fff' : '#000' }}>{item.text}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={{
                alignSelf: 'center',
                backgroundColor: selectedNotifications.length > 0 ? '#2B4763' : '#ffffff',
                paddingVertical: 15,
                paddingHorizontal: 30,
                borderRadius: 30,
                marginTop: 20,
              }}
              onPress={selectedNotifications.length > 0 ? clearSelectedNotifications : clearAllNotifications}
            >
              <Text style={{ color: selectedNotifications.length > 0 ? '#D9D9D9' : '#000', fontWeight: 'bold' }}>
                {selectedNotifications.length > 0 ? 'Clear Selected' : 'Clear All'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );

  const RewardsPage = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#4caf50' }}>Rewards Page</Text>
      <Text style={{ fontSize: 18, color: '#000', marginTop: 10 }}>This is the rewards page.</Text>
      <TouchableOpacity
        style={{ marginTop: 20, padding: 16, backgroundColor: '#4caf50', borderRadius: 8 }}
        onPress={() => setActivePage('afterClaimReward')}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );

  const CaloriesPage = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#4caf50' }}>Calories Page</Text>
      <Text style={{ fontSize: 18, color: '#000', marginTop: 10 }}>This is the calories page.</Text>
      <TouchableOpacity
        style={{ marginTop: 20, padding: 16, backgroundColor: '#4caf50', borderRadius: 8 }}
        onPress={() => setActivePage('afterClaimReward')}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );

  const TargetPage = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#4caf50' }}>Target Page</Text>
      <Text style={{ fontSize: 18, color: '#000', marginTop: 10 }}>This is the target page.</Text>
      <TouchableOpacity
        style={{ marginTop: 20, padding: 16, backgroundColor: '#4caf50', borderRadius: 8 }}
        onPress={() => setActivePage('afterClaimReward')}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );

  const WeightPage = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#4caf50' }}>Weight Page</Text>
      <Text style={{ fontSize: 18, color: '#000', marginTop: 10 }}>This is the weight page.</Text>
      <TouchableOpacity
        style={{ marginTop: 20, padding: 16, backgroundColor: '#4caf50', borderRadius: 8 }}
        onPress={() => setActivePage('afterClaimReward')}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );

  const AfterClaimRewardPage = () => {
    const getAchievementDetails = () => {
      switch (selectedBox) {
        case 'weight':
          return {
            text: `${userName} has attempted 5 kgs weight reduced!`,
            image: images.weight,
          };
        case 'calories':
          return {
            text: `${userName} has burned 2290 kcal!`,
            image: images.calories,
          };
        case 'target':
          return {
            text: `${userName} has completed 41/60 targets!`,
            image: images.target,
          };
        case 'reward':
          return {
            text: `${userName} has earned 3 rewards!`,
            image: images.reward,
          };
        default:
          return {
            text: `${userName} has achieved a new milestone!`,
            image: images.trophy,
          };
      }
    };

    const { text, image } = getAchievementDetails();

    return (
      <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
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
            <TouchableOpacity onPress={toggleNotifications} style={{ padding: 8 }}>
              <FontAwesome name="bell" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, backgroundColor: '#f8f9fa' }}>
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View style={{ position: 'absolute', top: 25, zIndex: -1 }}>
              <Image
                source={images.confetti}
                style={{ width: 200, height: 200, opacity: 0.8 }}
              />
            </View>
            <Image
              source={images.profile}
              style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 10, marginTop: 60 }}
            />
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#4caf50' }}>Congratulations!</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000' }}>{userName}</Text>
          </View>

          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <View
              style={{
                width: '100%',
                backgroundColor: '#ffffff',
                borderRadius: 10,
                padding: 20,
                flexDirection: 'row',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
                elevation: 5,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#4caf50', marginBottom: 10 }}>
                  {text}
                </Text>
                <Text style={{ fontSize: 18, color: '#6c757d', textAlign: 'left' }}>
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
      case 'rewards':
        return <RewardsPage />;
      case 'calories':
        return <CaloriesPage />;
      case 'target':
        return <TargetPage />;
      case 'weight':
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