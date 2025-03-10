import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  Animated,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {
  addDays,
  startOfWeek,
  format,
  subMonths,
  addMonths,
  isWithinInterval,
  differenceInDays,
  isValid,
  isAfter,
  isSameDay
} from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiHelper } from '../helpers/ApiHelper';

const API_CYCLE_URL = 'http://127.0.0.1:8000/api/cycles';  // Ganti dengan URL yang benar
const API_PROFILE_URL = 'http://127.0.0.1:8000/api/auth'; // Ganti dengan URL yang benar


const Cycle = () => {
  // --- State dari Komponen Cycle ---
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [viewFullCalendar, setViewFullCalendar] = useState(false);
  const [periodStartDate, setPeriodStartDate] = useState<Date | null>(null);
  const [periodDays, setPeriodDays] = useState(4);
  const [cycleLength, setCycleLength] = useState(28);
  const [isStartingPeriod, setIsStartingPeriod] = useState(false);
  const [selectedCycleLength, setSelectedCycleLength] = useState(cycleLength);
  const [selectedPeriodDays, setSelectedPeriodDays] = useState(periodDays);

  const [painLevel, setPainLevel] = useState(Array(5).fill(false));
  const [bleedingLevel, setBleedingLevel] = useState(Array(5).fill(false));
  const [moodLevel, setMoodLevel] = useState(Array(5).fill(false));

  const [showCycleLengthPicker, setShowCycleLengthPicker] = useState(false);
  const [showPeriodDaysPicker, setShowPeriodDaysPicker] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const painAnims = useState(Array(5).fill(null).map(() => new Animated.Value(0)))[0];
  const bleedingAnims = useState(Array(5).fill(null).map(() => new Animated.Value(0)))[0];
  const moodAnims = useState(Array(5).fill(null).map(() => new Animated.Value(0)))[0];

  // --- State dari Komponen Profile (yang relevan) ---
  const [userName, setUserName] = useState('');


    // --- Fungsi-fungsi Helper untuk Guest ---
    const loadGuestData = async () => {
        try {
            const guestCycleData = await AsyncStorage.getItem('guest_cycle_data');
            const guestProfileData = await AsyncStorage.getItem('guest_profile_data'); // Data profil untuk guest

            if (guestCycleData) {
                const cycleData = JSON.parse(guestCycleData);
                const validPeriodStart = cycleData.periodStart ? new Date(cycleData.periodStart) : null;
                if (validPeriodStart && isValid(validPeriodStart)) {
                    setPeriodStartDate(validPeriodStart);
                }
                setCycleLength(cycleData.cycleLength || 28);
                setPeriodDays(cycleData.periodDays || 4);
                setSelectedCycleLength(cycleData.cycleLength || 28);
                setSelectedPeriodDays(cycleData.periodDays || 4);
                setPainLevel(cycleData.painLevel || Array(5).fill(false));
                setBleedingLevel(cycleData.bleedingLevel || Array(5).fill(false));
                setMoodLevel(cycleData.moodLevel || Array(5).fill(false));
            } else {
                await initializeGuestData();
            }

            if(guestProfileData){
                const profileData = JSON.parse(guestProfileData);
                setUserName(profileData.name || 'Guest');
            } else {
                // Inisialisasi data profile guest, jika belum ada.
                const initialProfile = { name: 'Guest' };
                await AsyncStorage.setItem('guest_profile_data', JSON.stringify(initialProfile));
                setUserName('Guest');

            }

        } catch (error) {
            console.error('Failed to load guest data:', error);
            Alert.alert('Error', 'Failed to load guest data.  Please try again.');
        }
    };

    const initializeGuestData = async () => {
      const initialCycleData = {
            periodStart: null,
            cycleLength: 28,
            periodDays: 4,
            painLevel: Array(5).fill(false),
            bleedingLevel: Array(5).fill(false),
            moodLevel: Array(5).fill(false),
        };

        try {
            await AsyncStorage.setItem('guest_cycle_data', JSON.stringify(initialCycleData));
            // Set state sesuai dengan data inisialisasi
            setPeriodStartDate(null);
            setCycleLength(28);
            setPeriodDays(4);
            setSelectedCycleLength(28);
            setSelectedPeriodDays(4);
            setPainLevel(Array(5).fill(false));
            setBleedingLevel(Array(5).fill(false));
            setMoodLevel(Array(5).fill(false));

        } catch (error) {
            console.error('Failed to initialize guest data:', error);
            Alert.alert('Error', 'Failed to initialize guest data. Please try again.');
        }
    }


    const saveGuestData = async (data: any) => {
        try {
            const existingCycleData = await AsyncStorage.getItem('guest_cycle_data');
            const updatedCycleData = { ...JSON.parse(existingCycleData || '{}'), ...data };
            await AsyncStorage.setItem('guest_cycle_data', JSON.stringify(updatedCycleData));

             // Update state setelah menyimpan
            if (data.period_start) {
                setPeriodStartDate(new Date(data.period_start));
            }
            if(data.cycle_length) setCycleLength(data.cycle_length);
            if(data.period_days) setPeriodDays(data.period_days);
            if(data.pain_level !== undefined) setPainLevel(Array(5).fill(false).map((_, i) => i < data.pain_level));
            if(data.bleeding_level !== undefined) setBleedingLevel(Array(5).fill(false).map((_, i) => i < data.bleeding_level));
            if(data.mood_level !== undefined) setMoodLevel(Array(5).fill(false).map((_, i) => i < data.mood_level));


        } catch (error) {
            console.error('Failed to save guest data:', error);
            Alert.alert('Error', 'Failed to save guest data. Please try again.');
        }
    };


  // --- Fungsi-fungsi Helper untuk User ---

  const loadUserData = async (accessToken: string) => {
    try {
      // Load Cycle Data
      const cycleResponse = await ApiHelper.request(`${API_CYCLE_URL}`, 'GET', null, accessToken);
      const cycleData = cycleResponse.data;

      const validPeriodStart = cycleData.period_start ? new Date(cycleData.period_start) : null;
      if (validPeriodStart && isValid(validPeriodStart)) {
        setPeriodStartDate(validPeriodStart);
      }

      setCycleLength(cycleData.cycle_length || 28);
      setPeriodDays(cycleData.period_days || 4);
      setSelectedCycleLength(cycleData.cycle_length || 28);
      setSelectedPeriodDays(cycleData.period_days || 4);
      setPainLevel(Array(5).fill(false).map((_, i) => i < cycleData.pain_level));
      setBleedingLevel(Array(5).fill(false).map((_, i) => i < cycleData.bleeding_level));
      setMoodLevel(Array(5).fill(false).map((_, i) => i < cycleData.mood_level));

      // Load Profile Data
      const profileResponse = await ApiHelper.request(`${API_PROFILE_URL}/profile`, 'GET', null, accessToken);
      const profileData = profileResponse.data;
      setUserName(profileData.name || 'User');


    } catch (error) {
      console.error('Failed to load user data:', error);
       // Re-throw untuk ditangani di useEffect atau tempat lain yang memanggil fungsi ini
    }
  };

  const saveUserData = async (data: any, accessToken: string) => {
    try {
        const payload = {
            period_start: data.period_start || periodStartDate?.toISOString(),
            cycle_length: data.cycle_length || cycleLength,
            period_days: data.period_days || periodDays,
            pain_level: data.pain_level !== undefined ? data.pain_level : (painLevel.lastIndexOf(true) + 1 || 0),
            bleeding_level: data.bleeding_level !== undefined ? data.bleeding_level : (bleedingLevel.lastIndexOf(true) + 1 || 0),
            mood_level: data.mood_level !== undefined ? data.mood_level : (moodLevel.lastIndexOf(true) + 1 || 0),
        };

        const endpoint = periodStartDate ? `${API_CYCLE_URL}/update` : API_CYCLE_URL;
        await ApiHelper.request(endpoint, periodStartDate ? 'PUT' : 'POST', payload, accessToken);

        // Update state setelah menyimpan
        if (data.period_start) {
          setPeriodStartDate(new Date(data.period_start));
        }
        if (data.cycle_length) setCycleLength(data.cycle_length);
        if (data.period_days) setPeriodDays(data.period_days);
        if (data.pain_level !== undefined) setPainLevel(Array(5).fill(false).map((_, i) => i < data.pain_level));
        if (data.bleeding_level !== undefined) setBleedingLevel(Array(5).fill(false).map((_, i) => i < data.bleeding_level));
        if (data.mood_level !== undefined) setMoodLevel(Array(5).fill(false).map((_, i) => i < data.mood_level));


    } catch (error) {
      console.error('Failed to save user data:', error);
      Alert.alert('Error', 'Failed to save user data. Please try again.');
      throw error; // Re-throw agar bisa ditangani di pemanggil fungsi.
    }
  };


  // --- useEffect untuk Memuat Data ---
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const isGuest = await AsyncStorage.getItem('isGuest');
        if (isGuest === 'true') {
          await loadGuestData();
        } else {
          const accessToken = await AsyncStorage.getItem('access_token');
          if (!accessToken) {
            setError('No access token found'); // Set error jika tidak ada token
            return;
          }
          await loadUserData(accessToken);
        }
      } catch (err) {
          setError('Failed to load data. Please try again.'); // Error yang lebih umum

      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);


  // --- Fungsi-fungsi Handler untuk Interaksi UI ---
  const saveCycleData = async (data: any) => {
    try {
      const isGuest = await AsyncStorage.getItem('isGuest');
      if (isGuest === 'true') {
        await saveGuestData(data);
      } else {
        const accessToken = await AsyncStorage.getItem('access_token');
        if (!accessToken) {
          Alert.alert('Error', 'No access token. Please log in.');
          return;
        }
        await saveUserData(data, accessToken);
      }
    } catch (error) {
        console.error('Failed to save cycle data:', error); // Log error
    }
  };

  const handleSelectDate = async (date: Date) => {
        if (isAfter(date, today)) {
            Alert.alert('Error', 'Cannot select future dates');
            return;
        }
        if (isValid(date)) {
            await saveCycleData({ period_start: date.toISOString() });
            Alert.alert('Period Started', `Period start date set to ${format(date, 'dd MMM yyyy')}`);
            setIsStartingPeriod(false);
        }
    };

  const handleSelectPainLevel = async (index: number) => {
    const newPainLevel = painLevel.map((_, i) => i <= index);
    animateIconChange(painAnims[index]);
    await saveCycleData({ pain_level: index + 1 });
  };

  const handleSelectBleedingLevel = async (index: number) => {
    const newBleedingLevel = bleedingLevel.map((_, i) => i <= index);
    animateIconChange(bleedingAnims[index]);
    await saveCycleData({ bleeding_level: index + 1 });
  };

  const handleSelectMoodLevel = async (index: number) => {
    const newMoodLevel = moodLevel.map((_, i) => i <= index);
    animateIconChange(moodAnims[index]);
    await saveCycleData({ mood_level: index + 1 });
  };

  const handleCycleLengthUpdate = async (newLength: number) => {
    setSelectedCycleLength(newLength);
    await saveCycleData({ cycle_length: newLength });
  };

  const handlePeriodDaysUpdate = async (newDays: number) => {
    setSelectedPeriodDays(newDays);
    await saveCycleData({ period_days: newDays });
  };

  // --- Animasi ---
  const animateIconChange = (animationValue: Animated.Value) => {
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      animationValue.setValue(0);
    });
  };

  const getAnimatedStyle = (animationValue: Animated.Value) => {
    return {
      transform: [{
        rotate: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      }],
    };
  };

  // --- Fungsi-fungsi untuk Menghitung Siklus ---

  const getPeriodDates = (startDate: Date | null) => {
    const dates = [];
    if (startDate) {
      for (let i = 0; i < periodDays; i++) {
        dates.push(addDays(startDate, i));
      }
    }
    return dates;
  };

  const getFertileDates = (startDate: Date | null) => {
    if (!startDate) return [];
    const ovulationDate = addDays(startDate, cycleLength - 14);
    return [
      addDays(ovulationDate, -2),
      addDays(ovulationDate, -1),
      ovulationDate,
      addDays(ovulationDate, 1),
    ];
  };

  const getPredictedPeriodDates = (startDate: Date | null) => {
    if (!startDate) return [];
    const nextPeriodStart = addDays(startDate, cycleLength);
    const predictedDates = getPeriodDates(nextPeriodStart);
    return predictedDates;
  };

    const generateWeekDates = (date: Date) => {
    const startDate = startOfWeek(date, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, index) => addDays(startDate, index));
  };

  const generateMonthDates = (date: Date) => {
    const startDate = startOfWeek(new Date(date.getFullYear(), date.getMonth(), 1), { weekStartsOn: 1 });
    return Array.from({ length: 42 }, (_, index) => addDays(startDate, index));
  };



  const getCyclePhase = () => {
    if (!periodStartDate) return { phase: 'Not set', day: null };

    const currentDate = new Date();

    // Calculate the last day of the fertile window
    const lastFertileDay = fertileDates.length > 0 ? fertileDates[fertileDates.length - 1] : null;

    // Calculate the last day of the predicted period
    const lastPredictedDay = predictedPeriodDates.length > 0 ? addDays(predictedPeriodDates[0], periodDays - 1) : null;

    // Calculate days since last actual period
    const daysSinceLastPeriod = differenceInDays(currentDate, periodStartDate);

     // Check if current date is the last day of the fertile window
    if (lastFertileDay && isSameDay(currentDate, lastFertileDay)) {
        const fertileDifference = differenceInDays(currentDate, fertileDates[0]);
        return { phase: 'Fertile Window', day: fertileDifference + 1 };
    }

    // Check if current date is within the fertile window
    if (fertileDates.length > 0 && lastFertileDay && isWithinInterval(currentDate, { start: fertileDates[0], end: lastFertileDay })) {
        const fertileDifference = differenceInDays(currentDate, fertileDates[0]);
        return { phase: 'Fertile Window', day: fertileDifference + 1 };
    }

    // Check if current date is the last day of the predicted period
    if (lastPredictedDay && isSameDay(currentDate, lastPredictedDay)) {
      const predictedDifference = differenceInDays(currentDate, predictedPeriodDates[0]);
      return { phase: 'Predicted Period', day: predictedDifference + 1 };
    }

    // Check if current date is within the predicted period
    if (predictedPeriodDates.length > 0 && isWithinInterval(currentDate, { start: predictedPeriodDates[0], end: lastPredictedDay })) {
        const predictedDifference = differenceInDays(currentDate, predictedPeriodDates[0]);
        return { phase: 'Predicted Period', day: predictedDifference + 1 };
    }

    // Check if it's a regular day *after* the predicted period
    if (lastPredictedDay && isAfter(currentDate, lastPredictedDay)) {
      const daysAfterPredictedPeriod = differenceInDays(currentDate, lastPredictedDay);
      return { phase: 'Regular Day', day: daysAfterPredictedPeriod };  // Regular Day starts from 1
    }

    // Check if current date is the last day of the period
    const lastPeriodDay = addDays(periodStartDate, periodDays - 1);
    if (isSameDay(currentDate, lastPeriodDay)) {
        const difference = differenceInDays(currentDate, periodStartDate);
        return { phase: 'Period', day: difference + 1 };
    }

    // Check if current date is within the period
    if (isWithinInterval(currentDate, { start: periodStartDate, end: addDays(periodStartDate, periodDays - 1) })) {
        const difference = differenceInDays(currentDate, periodStartDate);
        return { phase: 'Period', day: difference + 1 };
    }

    // Check if it's a regular day *after* the actual period
    if (isAfter(currentDate, lastPeriodDay)) {
        const daysAfterPeriod = differenceInDays(currentDate, lastPeriodDay);
        return { phase: 'Regular Day', day: daysAfterPeriod };
    }

    // If none of the above conditions are met, it's a regular day within cycle length
    const dayInCycle = (daysSinceLastPeriod % cycleLength) + 1;
    return { phase: 'Regular Day', day: dayInCycle };
  };

  const { phase, day } = getCyclePhase();


  const getRecommendation = (phase: string) => {
    switch (phase) {
      case 'Period':
        return 'Drink Herbal Tea For Cramps';
      case 'Fertile Window':
        return 'Eat Foods Rich in Folic Acid';
      case 'Predicted Period':
        return 'Reduce Salt Intake';
      default:
        return 'Maintain a Balanced Diet';
    }
  };


  // --- UI Helpers ---

  const handleStartPeriod = () => {
    setIsStartingPeriod(true);
  };

  const toggleCalendarView = () => {
    if (viewFullCalendar) {
      setCurrentMonth(today);
      setIsStartingPeriod(false);
    }
    setViewFullCalendar(!viewFullCalendar);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const getGreeting = () => {
    const hour = today.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleSelectCycleLengthOption = (newLength: number) => {
    setSelectedCycleLength(newLength);
  };

  const handleSelectPeriodDaysOption = (newDays: number) => {
    setSelectedPeriodDays(newDays);
  };



  // --- Render Functions ---

  const renderCycleOption = ({ item }: { item: number }) => (
    <TouchableOpacity
      style={[
        {
          padding: 10,
          marginVertical: 2,
          backgroundColor: '#e6e6fa',
          borderRadius: 5,
        },
        selectedCycleLength === item && {
          backgroundColor: '#FFC0CB',
        },
      ]}
      onPress={() => handleSelectCycleLengthOption(item)}
    >
      <Text style={{ textAlign: 'center' }}>{item}</Text>
    </TouchableOpacity>
  );

  const renderPeriodOption = ({ item }: { item: number }) => (
    <TouchableOpacity
      style={[
        {
          padding: 10,
          marginVertical: 2,
          backgroundColor: '#e6e6fa',
          borderRadius: 5,
        },
        selectedPeriodDays === item && {
          backgroundColor: '#FFC0CB',
        },
      ]}
      onPress={() => handleSelectPeriodDaysOption(item)}
    >
      <Text style={{ textAlign: 'center' }}>{item}</Text>
    </TouchableOpacity>
  );

  const renderCalendarItem = ({ item }: { item: Date }) => {
    const isToday = today.toDateString() === item.toDateString();
    const isPeriod = periodDates.some((date) => date.toDateString() === item.toDateString());
    const isFertile = fertileDates.some((date) => date.toDateString() === item.toDateString());
    const isPredictedPeriod = predictedPeriodDates.some((date) => date.toDateString() === item.toDateString());
    const isInCurrentMonth = item.getMonth() === currentMonth.getMonth();

    return (
      <TouchableOpacity
        style={[
          {
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 5,
            backgroundColor: '#e6e6fa',
            marginBottom: 10,
            flex: 1,
          },
          isToday && {
            borderColor: '#FF6347',
            borderWidth: 2,
          },
          isPeriod && {
            backgroundColor: '#FFC0CB',
          },
          isFertile && {
            backgroundColor: '#ADD8E6',
          },
          isPredictedPeriod && {
            borderColor: '#FF69B4',
            borderWidth: 2,
          },
          !isInCurrentMonth && {
            backgroundColor: '#dcdcdc',
          },
          viewFullCalendar && {
            width: 35,
            height: 35,
            borderRadius: 17.5,
          },
        ]}
        onPress={() => (isStartingPeriod ? handleSelectDate(item) : null)}
      >
        <Text
          style={[
            {
              fontSize: 16,
              color: '#333',
              textAlign: 'center',
            },
            !isInCurrentMonth && {
              color: '#a9a9a9',
            },
          ]}
        >
          {item.getDate()}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderModalCalendarItem = ({ item }: { item: Date }) => {
    const isToday = today.toDateString() === item.toDateString();
    const isPeriod = periodDates.some((date) => date.toDateString() === item.toDateString());
    const isFertile = fertileDates.some((date) => date.toDateString() === item.toDateString());
    const isPredictedPeriod = predictedPeriodDates.some((date) => date.toDateString() === item.toDateString());
    const isInCurrentMonth = item.getMonth() === currentMonth.getMonth();

    return (
      <TouchableOpacity
        style={[
          {
            width: 35,
            height: 35,
            borderRadius: 17.5,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 5,
            backgroundColor: '#e6e6fa',
            marginBottom: 10,
            flex: 1,
          },
          isToday && {
            borderColor: '#FF6347',
            borderWidth: 2,
          },
          isPeriod && {
            backgroundColor: '#FFC0CB',
          },
          isFertile && {
            backgroundColor: '#ADD8E6',
          },
          isPredictedPeriod && {
            borderColor: '#FF69B4',
            borderWidth: 2,
          },
          !isInCurrentMonth && {
            backgroundColor: '#dcdcdc',
          },
        ]}
        onPress={() => (isStartingPeriod ? handleSelectDate(item) : null)}
      >
        <Text
          style={[
            {
              fontSize: 16,
              color: '#333',
              textAlign: 'center',
            },
            !isInCurrentMonth && {
              color: '#a9a9a9',
            },
          ]}
        >
          {item.getDate()}
        </Text>
      </TouchableOpacity>
    );
  };
    const cycleOptions = Array.from({ length: 60 }, (_, i) => 1 + i);
    const periodOptions = Array.from({ length: 60 }, (_, i) => 1 + i);
    const keyExtractor = (item: Date) => item.toISOString();
    const periodDates = periodStartDate ? getPeriodDates(periodStartDate) : [];
    const fertileDates = periodStartDate ? getFertileDates(periodStartDate) : [];
    const predictedPeriodDates = periodStartDate ? getPredictedPeriodDates(periodStartDate) : [];
    const weekDates = generateWeekDates(today);
    const monthDates = generateMonthDates(currentMonth);

  // --- Loading dan Error UI ---
    if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red', fontSize: 18 }}>{error}</Text>
        <TouchableOpacity onPress={() => window.location.reload()} style={{ marginTop: 10 }}>
          <Text style={{ color: 'blue', fontSize: 16 }}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }


  // --- JSX Utama ---

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ flexGrow: 1, padding: 20, backgroundColor: '#fff' }}>
        {/* Greeting */}
        <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 5 }}>{getGreeting()},</Text>
        <Text style={{ fontSize: 30, color: '#333', marginBottom: 20 }}>{userName}</Text>

        {/* Kontrol Kalender */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13, marginHorizontal: 8 }}>
          <TouchableOpacity disabled={!viewFullCalendar} onPress={handlePrevMonth}>
            <Text style={[{ fontSize: 20, fontWeight: 'bold', color: '#007BFF' }, !viewFullCalendar && { color: '#d3d3d3' }]}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{format(currentMonth, 'MMMM yyyy')}</Text>
          <TouchableOpacity disabled={!viewFullCalendar} onPress={handleNextMonth}>
            <Text style={[{ fontSize: 20, fontWeight: 'bold', color: '#007BFF' }, !viewFullCalendar && { color: '#d3d3d3' }]}>{'>'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleCalendarView}>
            <Text style={{ fontSize: 16, color: '#007BFF' }}>{viewFullCalendar ? 'Hide' : 'View'}</Text>
          </TouchableOpacity>
        </View>

        {/* Hari dalam Seminggu */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 9, paddingHorizontal: 5 }}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
            <Text key={index} style={{ fontSize: 16, fontWeight: 'bold', color: '#666', flex: 1, textAlign: 'center' }}>{day}</Text>
          ))}
        </View>

        {/* Kalender */}
        <FlatList
          data={viewFullCalendar ? monthDates : weekDates}
          numColumns={7}
          keyExtractor={keyExtractor}
          renderItem={renderCalendarItem}
          scrollEnabled={false}
          contentContainerStyle={{ paddingHorizontal: 5 }}
        />

        {/* Pesan Jika Period Start Belum Di-set */}
        {!periodStartDate && (
          <View style={{ padding: 10, borderRadius: 20, marginBottom: 10, marginTop: 10, backgroundColor: '#ffe6e6' }}>
            <Text style={{ fontSize: 16, color: '#333', textAlign: 'left', paddingVertical: 10 }}>
              Please select your start period to calculate predictions.
            </Text>
          </View>
        )}

        {/* Informasi Fase Siklus */}
        {periodStartDate && (
          <View style={{ alignItems: 'center', marginBottom: 20, marginTop: 20 }}>
            <View style={{ width: 300, height: 300, borderRadius: 150, borderWidth: 10, borderColor: '#F05A76', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 36, fontWeight: 'semibold', textAlign: 'center', marginBottom: 5 }}>{phase}:</Text>
              {day !== null && <Text style={{ fontSize: 18, textAlign: 'center', color: '#666' }}>{`Day ${day}`}</Text>}
              <View style={{ marginTop: 15, backgroundColor: '#ffe6e6', padding: 10, borderRadius: 20, maxWidth: 200, alignItems: 'center' }}>
                <Text style={{ fontSize: 16, textAlign: 'center' }}>{getRecommendation(phase)}</Text>
              </View>
            </View>
            <View style={{ padding: 10, backgroundColor: '#ffe6e6', borderRadius: 20, maxWidth: 350, marginTop: 10 }}>
              <Text style={{ textAlign: 'center', color: '#666' }}>
                {periodStartDate
                  ? `Your period is likely to start on or around ${format(addDays(periodStartDate, cycleLength), 'dd MMM yyyy')}`
                  : ''}
              </Text>
            </View>
          </View>
        )}

        {/* Informasi Periode Terakhir */}
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Last Menstrual Period</Text>
        <View style={{ padding: 15, backgroundColor: '#fff', borderRadius: 20, borderWidth: 0.1, borderColor: '#000', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 5, height: 5 }, shadowOpacity: 0.6, shadowRadius: 4, elevation: 5 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Text>Start Date:</Text>
            <Text style={{ marginLeft: 30 }}>{periodStartDate ? format(periodStartDate, 'dd MMM yyyy') : 'Not set'}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Text>Cycle Length:</Text>
            <TouchableOpacity onPress={() => setShowCycleLengthPicker(true)}>
              <Text style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 5, width: 50, textAlign: 'center' }}>{cycleLength}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Period Length:</Text>
            <TouchableOpacity onPress={() => setShowPeriodDaysPicker(true)}>
              <Text style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 5, width: 50, textAlign: 'center' }}>{periodDays}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Period History</Text>
        <View style={{ padding: 15, backgroundColor: '#fff', borderRadius: 20, borderWidth: 0.1, borderColor: '#000', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 5, height: 5 }, shadowOpacity: 0.6, shadowRadius: 4, elevation: 5 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Text>Pain:</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderRadius: 20 }}>
              {[0, 1, 2, 3, 4].map((level) => (
                <TouchableOpacity key={level} onPress={() => handleSelectPainLevel(level)}>
                  <Animated.View style={getAnimatedStyle(painAnims[level])}>
                    <Text style={painLevel[level] ? { fontSize: 24, padding: 5, color: 'black' } : { fontSize: 24, padding: 5 }}>
                      {painLevel[level] ? '❤️' : '🤍'}
                    </Text>
                  </Animated.View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Text>Bleeding:</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderRadius: 20 }}>
              {[0, 1, 2, 3, 4].map((level) => (
                <TouchableOpacity key={level} onPress={() => handleSelectBleedingLevel(level)}>
                  <Animated.View style={getAnimatedStyle(bleedingAnims[level])}>
                    <Text style={bleedingLevel[level] ? { fontSize: 24, padding: 5, color: 'black' } : { fontSize: 24, padding: 5 }}>
                      {bleedingLevel[level] ? '🩸' : '🫙'}
                    </Text>
                  </Animated.View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0 }}>
            <Text>Mood:</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderRadius: 20 }}>
              {[0, 1, 2, 3, 4].map((level) => (
                <TouchableOpacity key={level} onPress={() => handleSelectMoodLevel(level)}>
                  <Animated.View style={getAnimatedStyle(moodAnims[level])}>
                    <Text style={moodLevel[level] ? { fontSize: 24, padding: 5, color: 'black' } : { fontSize: 24, padding: 5 }}>
                      {moodLevel[level] ? '😀' : '😶'}
                    </Text>
                  </Animated.View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <Modal visible={viewFullCalendar} animationType="slide" transparent={true} onRequestClose={toggleCalendarView}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ backgroundColor: '#fff', width: '90%', padding: 25, borderRadius: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginHorizontal: 8 }}>
                <TouchableOpacity onPress={handlePrevMonth}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#007BFF' }}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{format(currentMonth, 'MMMM yyyy')}</Text>
                <TouchableOpacity onPress={handleNextMonth}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#007BFF' }}>{'>'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleCalendarView}>
                  <Text style={{ fontSize: 16, color: '#007BFF' }}>Hide</Text>
                </TouchableOpacity>
              </View>

              <FlatList data={monthDates} numColumns={7} keyExtractor={keyExtractor} renderItem={renderModalCalendarItem} scrollEnabled={false} />

              <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 15, height: 15, borderRadius: 10, marginRight: 5, backgroundColor: '#FFC0CB' }} />
                  <Text style={{ fontSize: 12 }}>Period</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 15, height: 15, borderRadius: 10, marginRight: 5, backgroundColor: '#ADD8E6' }} />
                  <Text style={{ fontSize: 12 }}>Fertile Window</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 15, height: 15, borderRadius: 10, marginRight: 5, borderColor: '#FF69B4', borderWidth: 2 }} />
                  <Text style={{ fontSize: 12 }}>Predicted Period</Text>
                </View>
              </View>

              <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: '#000000', fontWeight: 'semibold' }}>Change Period</Text>
                <TouchableOpacity
                  style={[
                    { padding: 10, borderRadius: 5, backgroundColor: 'red' },
                    isStartingPeriod && { backgroundColor: '#808080' },
                  ]}
                  onPress={handleStartPeriod}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{isStartingPeriod ? 'Select Date' : 'Start Period'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={showCycleLengthPicker} transparent={true} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', margin: 20, padding: 20, borderRadius: 10 }}>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>Select Cycle Length</Text>
            <FlatList
              data={cycleOptions}
              keyExtractor={(item) => item.toString()}
              renderItem={renderCycleOption}
              contentContainerStyle={{ maxHeight: 200 }}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <TouchableOpacity
                style={{ padding: 10, backgroundColor: '#ccc', borderRadius: 5 }}
                onPress={() => setShowCycleLengthPicker(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ padding: 10, backgroundColor: 'pink', borderRadius: 5 }}
                onPress={() => {
                  handleCycleLengthUpdate(selectedCycleLength);
                  setShowCycleLengthPicker(false);
                }}
              >
                <Text>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

        <Modal visible={showPeriodDaysPicker} transparent={true} animationType="slide" onRequestClose={() => setShowPeriodDaysPicker(false)}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ backgroundColor: 'white', width: 300, borderRadius: 10, padding: 10 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>Period Length:</Text>
              <FlatList data={periodOptions} keyExtractor={(item) => String(item)} renderItem={renderPeriodOption} style={{ maxHeight: 200 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 15 }}>
                <TouchableOpacity
                  style={{ padding: 10, borderRadius: 5, backgroundColor: '#d3d3d3' }}
                  onPress={() => {
                    setShowPeriodDaysPicker(false);
                    setSelectedPeriodDays(periodDays);
                  }}
                >
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ padding: 10, borderRadius: 5, backgroundColor: '#FFC0CB' }}
                  onPress={() => {
                    setPeriodDays(selectedPeriodDays);
                    setShowPeriodDaysPicker(false);
                  }}
                >
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default Cycle;