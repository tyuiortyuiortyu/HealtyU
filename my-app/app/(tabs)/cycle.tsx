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
  isSameDay,
} from 'date-fns';
import { ApiHelper } from '../helpers/ApiHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://your-api-base-url.com';  // GANTI INI dengan URL dasar API Anda

const Cycle = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [viewFullCalendar, setViewFullCalendar] = useState(false);
  const [periodStartDate, setPeriodStartDate] = useState(null);
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

  const painAnims = useState(Array(5).fill(null).map(() => new Animated.Value(0)))[0];
  const bleedingAnims = useState(Array(5).fill(null).map(() => new Animated.Value(0)))[0];
  const moodAnims = useState(Array(5).fill(null).map(() => new Animated.Value(0)))[0];

  const screenWidth = Dimensions.get('window').width;

  // Fungsi untuk menyimpan data siklus
  const saveCycleData = async () => {
    try {
      // Validasi: Pastikan periodStartDate sudah diisi
      if (!periodStartDate) {
        Alert.alert('Error', 'Please select a start date for your period.');
        return;
      }
  
      const isGuest = await AsyncStorage.getItem('isGuest');
      const dataToSave = {
        start: format(periodStartDate, 'yyyy-MM-dd'), // Format tanggal ke 'yyyy-MM-dd'
        end: format(addDays(periodStartDate, periodDays - 1), 'yyyy-MM-dd'), // Format tanggal ke 'yyyy-MM-dd'
        cycle_len: parseInt(cycleLength, 10), // Pastikan integer
        period_len: parseInt(periodDays, 10), // Pastikan integer
        pain_lv: parseInt(painLevel.filter(Boolean).length, 10), // Pastikan integer
        bleeding_lv: parseInt(bleedingLevel.filter(Boolean).length, 10), // Pastikan integer
        mood_lv: parseInt(moodLevel.filter(Boolean).length, 10), // Pastikan integer
      };
  
      if (isGuest === 'true') {
        await AsyncStorage.setItem('guestCycleData', JSON.stringify(dataToSave));
        Alert.alert('Success', 'Cycle data saved locally');
      } else {
        const accessToken = await AsyncStorage.getItem('access_token');
        if (!accessToken) {
          Alert.alert("Error", "User not authenticated");
          return;
        }
  
        // Cek apakah data sudah ada untuk menentukan create/update
        const checkResponse = await ApiHelper.request(
          `${API_BASE_URL}/api/cycles`,
          'GET',
          null,
          accessToken
        );
  
        let response;
        if (checkResponse && checkResponse.data.length > 0) {
          // Update existing data
          response = await ApiHelper.request(
            `${API_BASE_URL}/api/cycles/update`,
            'POST',
            { ...dataToSave, id: checkResponse.data[0].id },
            accessToken
          );
        } else {
          // Create new data
          response = await ApiHelper.request(
            `${API_BASE_URL}/api/cycles`,
            'POST',
            dataToSave,
            accessToken
          );
        }
  
        if (response?.message) {
          Alert.alert('Success', response.message);
          loadCycleData();
        }
      }
    } catch (error) {
      console.error("Save Cycle Error:", error);
      Alert.alert('Error', 'Failed to save cycle data: ' + (error.message || "Unknown error"));
    }
  };

  // Fungsi untuk memuat data siklus
  const loadCycleData = async () => {
    try {
      const isGuest = await AsyncStorage.getItem('isGuest');

      if (isGuest === 'true') {
        const data = await AsyncStorage.getItem('guestCycleData');
        if (data) {
          const parsedData = JSON.parse(data);
          setPeriodStartDate(parsedData.start ? new Date(parsedData.start) : null); // Perbaikan di sini
          setCycleLength(parsedData.cycle_len);
          setPeriodDays(parsedData.period_len);
      
          // Load pain, bleeding, and mood levels
          const newPainLevel = Array(5).fill(false);
          for (let i = 0; i < parsedData.pain_lv; i++) {
            newPainLevel[i] = true;
          }
          setPainLevel(newPainLevel);
      
          const newBleedingLevel = Array(5).fill(false);
          for (let i = 0; i < parsedData.bleeding_lv; i++) {
            newBleedingLevel[i] = true;
          }
          setBleedingLevel(newBleedingLevel);
      
          const newMoodLevel = Array(5).fill(false);
          for (let i = 0; i < parsedData.mood_lv; i++) {
            newMoodLevel[i] = true;
          }
          setMoodLevel(newMoodLevel);
        }
      }else {
        const accessToken = await AsyncStorage.getItem('access_token');
        if (!accessToken) return;

        const response = await ApiHelper.request(
          `${API_BASE_URL}/api/cycles`,
          'GET',
          null,
          accessToken
        );

        if (response && response.data && response.data.length > 0) {
          const latestData = response.data[response.data.length - 1];
          setPeriodStartDate(latestData.start ? new Date(latestData.start) : null);
          setCycleLength(latestData.cycle_len);
          setPeriodDays(latestData.period_len);

          // Update status icons
          const updateLevels = (levelCount, setter) => {
            const newLevels = Array(5).fill(false);
            for (let i = 0; i < levelCount; i++) {
              newLevels[i] = true;
            }
            setter(newLevels);
          };

          updateLevels(latestData.pain_lv, setPainLevel);
          updateLevels(latestData.bleeding_lv, setBleedingLevel);
          updateLevels(latestData.mood_lv, setMoodLevel);
        }
      }
    } catch (error) {
      console.error('Failed to load cycle data:', error);
      Alert.alert("Error", "Failed to load cycle data");
    }
  };

  // Panggil loadCycleData di useEffect
  useEffect(() => {
    loadCycleData();
  }, []);



  const animateIconChange = (animationValue) => {
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      animationValue.setValue(0);
    });
  };

  const getAnimatedStyle = (animationValue) => {
    return {
      transform: [{
        rotate: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      }],
    };
  };

  const handleSelectPainLevel = (index) => {
    const newPainLevel = [...painLevel];
    for (let i = 0; i < 5; i++) {
      newPainLevel[i] = i <= index;
    }
    setPainLevel(newPainLevel);
    animateIconChange(painAnims[index]);
  };

  const handleSelectBleedingLevel = (index) => {
    const newBleedingLevel = [...bleedingLevel];
    for (let i = 0; i < 5; i++) {
      newBleedingLevel[i] = i <= index;
    }
    setBleedingLevel(newBleedingLevel);
    animateIconChange(bleedingAnims[index]);
  };

  const handleSelectMoodLevel = (index) => {
    const newMoodLevel = [...moodLevel];
    for (let i = 0; i < 5; i++) {
      newMoodLevel[i] = i <= index;
    }
    setMoodLevel(newMoodLevel);
    animateIconChange(moodAnims[index]);
  };

  const getPeriodDates = (startDate) => {
    const dates = [];
    if (startDate) {
      for (let i = 0; i < periodDays; i++) {
        dates.push(addDays(startDate, i));
      }
    }
    return dates;
  };

  const getFertileDates = (startDate) => {
    if (!startDate) return [];
    const ovulationDate = addDays(startDate, cycleLength - 14);
    return [
      addDays(ovulationDate, -2),
      addDays(ovulationDate, -1),
      ovulationDate,
      addDays(ovulationDate, 1),
    ];
  };

  const getPredictedPeriodDates = (startDate) => {
    if (!startDate) return [];
    const nextPeriodStart = addDays(startDate, cycleLength);
    const predictedDates = getPeriodDates(nextPeriodStart);
    return predictedDates;
  };

  const periodDates = periodStartDate ? getPeriodDates(periodStartDate) : [];
  const fertileDates = periodStartDate ? getFertileDates(periodStartDate) : [];
  const predictedPeriodDates = periodStartDate ? getPredictedPeriodDates(periodStartDate) : [];

  const generateWeekDates = (date) => {
    const startDate = startOfWeek(date, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, index) => addDays(startDate, index));
  };

  const generateMonthDates = (date) => {
    const startDate = startOfWeek(new Date(date.getFullYear(), date.getMonth(), 1), { weekStartsOn: 1 });
    return Array.from({ length: 42 }, (_, index) => addDays(startDate, index));
  };

  const weekDates = generateWeekDates(today);
  const monthDates = generateMonthDates(currentMonth);

  const getCyclePhase = () => {
    if (!periodStartDate) return { phase: 'Not set', day: null };
  
    const currentDate = new Date();
    const daysSinceLastPeriod = differenceInDays(currentDate, periodStartDate);

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
    if (fertileDates.length > 0 && isWithinInterval(currentDate, { start: fertileDates[0], end: lastFertileDay })) {
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

  const getRecommendation = (phase) => {
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

  const handleStartPeriod = () => {
      //check if there is period start date
    if (periodStartDate) {
        Alert.alert(
          'Confirmation',
          'Are you sure you want to change your period start date?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Yes', onPress: () => setIsStartingPeriod(true) },
          ]
        );
    } else {
        setIsStartingPeriod(true);
    }
  };


  const handleSelectDate = (date) => {
    if (isAfter(date, today)) {
      Alert.alert('Error', 'Cannot select a date after today.');
      return;
    }
    if (isValid(date)) {
      setPeriodStartDate(date);
      Alert.alert(
        'Period Started',
        `Your period start date is set to ${format(date, 'dd MMM yyyy')}`
      );
      setIsStartingPeriod(false);
      saveCycleData(); // Simpan data setelah memilih tanggal
    }
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

    const [userName, setUserName] = useState('');  // Use state

    useEffect(() => {
        const fetchUserName = async () => {
          try {
            const storedUserName = await AsyncStorage.getItem('userName');
            if (storedUserName) {
              setUserName(storedUserName);
            }
          } catch (error) {
            console.error('Failed to fetch user name:', error);
          }
        };

        fetchUserName();
      }, []);


  const cycleOptions = Array.from({ length: 60 }, (_, i) => 1 + i);
  const periodOptions = Array.from({ length: 60 }, (_, i) => 1 + i);

  const handleSelectCycleLengthOption = (newLength) => {
    setSelectedCycleLength(newLength);
  };

  const handleSelectPeriodDaysOption = (newDays) => {
    setSelectedPeriodDays(newDays);
  };

  const handleConfirmCycleLength = () => {
    setCycleLength(selectedCycleLength);
    setShowCycleLengthPicker(false);
    saveCycleData(); // Simpan data setelah mengonfirmasi
  };
  
  const handleConfirmPeriodDays = () => {
    setPeriodDays(selectedPeriodDays);
    setShowPeriodDaysPicker(false);
    saveCycleData(); // Simpan data setelah mengonfirmasi
  };



  const renderCycleOption = ({ item }) => (
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

  const renderPeriodOption = ({ item }) => (
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

  const renderCalendarItem = ({ item }) => {
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

  const renderModalCalendarItem = ({ item }) => {
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

  const keyExtractor = (item) => item.toISOString();

  return (
    <ScrollView style={{ flex: 1}}>
      <View style={{ flexGrow: 1, padding: 20, backgroundColor: '#fff' }}>
        <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 5 }}>{getGreeting()},</Text>
        <Text style={{ fontSize: 30, color: '#333', marginBottom: 20 }}>{userName}</Text>

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

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 9, paddingHorizontal: 5 }}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
            <Text key={index} style={{ fontSize: 16, fontWeight: 'bold', color: '#666', flex: 1, textAlign: 'center' }}>{day}</Text>
          ))}
        </View>

        <FlatList
          data={viewFullCalendar ? monthDates : weekDates}
          numColumns={7}
          keyExtractor={keyExtractor}
          renderItem={renderCalendarItem}
          scrollEnabled={false}
          contentContainerStyle={{ paddingHorizontal: 5 }}
        />

        {!periodStartDate && (
          <View style={{ padding: 10, borderRadius: 20, marginBottom: 10, marginTop: 10, backgroundColor: '#ffe6e6' }}>
            <Text style={{ fontSize: 16, color: '#333', textAlign: 'left', paddingVertical: 10 }}>
              Please select your start period to calculate predictions.
            </Text>
          </View>
        )}

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

        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Last Menstrual Period</Text>
        <View style={{ padding: 15, backgroundColor: '#fff', borderRadius: 20, borderWidth: 0.1, borderColor: '#000' , marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 5, height: 5 }, shadowOpacity: 0.6, shadowRadius: 4, elevation: 5 }}>
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
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
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

        <Modal visible={showCycleLengthPicker} transparent={true} animationType="slide" onRequestClose={() => setShowCycleLengthPicker(false)}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ backgroundColor: 'white', width: 300, borderRadius: 10, padding: 10 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>Cycle Length:</Text>
              <FlatList data={cycleOptions} keyExtractor={(item) => String(item)} renderItem={renderCycleOption} style={{ maxHeight: 200 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 15 }}>
                <TouchableOpacity
                  style={{ padding: 10, borderRadius: 5, backgroundColor: '#d3d3d3' }}
                  onPress={() => {
                    setShowCycleLengthPicker(false);
                    setSelectedCycleLength(cycleLength);
                  }}
                >
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ padding: 10, borderRadius: 5, backgroundColor: '#FFC0CB' }}
                  onPress={() => {
                    setCycleLength(selectedCycleLength);
                    setShowCycleLengthPicker(false);
                  }}
                >
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Confirm</Text>
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