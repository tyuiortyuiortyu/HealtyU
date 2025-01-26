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
} from 'date-fns';

const Cycle = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [viewFullCalendar, setViewFullCalendar] = useState(false);
  const [periodStartDate, setPeriodStartDate] = useState(null);
  const [periodDays, setPeriodDays] = useState(4);
  const [cycleLength, setCycleLength] = useState(28);
  const [isStartingPeriod, setIsStartingPeriod] = useState(false);

  // State for levels in period history
  const [painLevel, setPainLevel] = useState(Array(5).fill(false));
  const [bleedingLevel, setBleedingLevel] = useState(Array(5).fill(false));
  const [moodLevel, setMoodLevel] = useState(Array(5).fill(false));

  const [showCycleLengthPicker, setShowCycleLengthPicker] = useState(false);
  const [showPeriodDaysPicker, setShowPeriodDaysPicker] = useState(false);

   // Animation refs for each icon
  const painAnims = useState(Array(5).fill(null).map(() => new Animated.Value(0)))[0];
    const bleedingAnims = useState(Array(5).fill(null).map(() => new Animated.Value(0)))[0];
  const moodAnims = useState(Array(5).fill(null).map(() => new Animated.Value(0)))[0];

    // Function to handle animation
 const animateIconChange = (animationValue) => {
        Animated.timing(animationValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            animationValue.setValue(0);
        });
    };

     // Function to return animation
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


  // Calculate Dates
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
    return getPeriodDates(nextPeriodStart);
  };

  const periodDates = periodStartDate ? getPeriodDates(periodStartDate) : [];
  const fertileDates = periodStartDate ? getFertileDates(periodStartDate) : [];
  const predictedPeriodDates = periodStartDate
    ? getPredictedPeriodDates(periodStartDate)
    : [];

  const generateWeekDates = (date) => {
    const startDate = startOfWeek(date, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, index) => addDays(startDate, index));
  };

  const generateMonthDates = (date) => {
    const startDate = startOfWeek(
      new Date(date.getFullYear(), date.getMonth(), 1),
      {
        weekStartsOn: 1,
      }
    );
    return Array.from({ length: 42 }, (_, index) => addDays(startDate, index));
  };

  const weekDates = generateWeekDates(today);
  const monthDates = generateMonthDates(currentMonth);

    // Logic for phase and day
    const getCyclePhase = () => {
        if (!periodStartDate) return { phase: 'Not set', day: null };

    const currentDate = new Date();
        const difference = differenceInDays(currentDate, periodStartDate);

    if (isWithinInterval(currentDate, { start: periodStartDate, end: addDays(periodStartDate, periodDays - 1) })){
         return {phase: 'Period', day: difference + 1};
     } else if (fertileDates.length > 0 && isWithinInterval(currentDate, {start: fertileDates[0], end: fertileDates[fertileDates.length - 1]})){
          const fertileDifference = differenceInDays(currentDate, fertileDates[0]);
           return {phase: 'Fertile Window', day: fertileDifference + 1};
      } else if (predictedPeriodDates.length > 0 && isWithinInterval(currentDate, {start: predictedPeriodDates[0], end: predictedPeriodDates[predictedPeriodDates.length-1] })){
         return {phase: 'Predicted Period', day: difference - (cycleLength) + 1 };
      }
       return {phase: 'Regular Day', day: difference - (periodDays) + 1};
  };
    const { phase, day } = getCyclePhase();

    // Food recommendation based on phase
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

  // Handling start period
  const handleStartPeriod = () => {
    setIsStartingPeriod(true);
  };

  const handleSelectDate = (date) => {
    if (isValid(date)) {
      setPeriodStartDate(date);
      Alert.alert(
        'Period Started',
        `Your period start date is set to ${format(date, 'dd MMM yyyy')}`
      );
      setIsStartingPeriod(false);
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

  const userName = 'Nikita';

    const cycleOptions = Array.from({ length: 25 }, (_, i) => 17 + i);
  const periodOptions = Array.from({ length: 30 }, (_, i) => 1 + i);

  const handleSelectCycleLength = (newLength) => {
    setCycleLength(newLength);
    setShowCycleLengthPicker(false);
  };

  const handleSelectPeriodDays = (newDays) => {
    setPeriodDays(newDays);
    setShowPeriodDaysPicker(false);
  };

  const renderCycleOption = ({ item }) => (
    <TouchableOpacity
      style={{
        padding: 10,
        marginVertical: 2,
        backgroundColor: '#e6e6fa',
        borderRadius: 5,
        ...(cycleLength === item && { backgroundColor: '#FFC0CB' }),
      }}
      onPress={() => setCycleLength(item)}
    >
      <Text style={{textAlign: 'center'}}>{item}</Text>
    </TouchableOpacity>
  );

  const renderPeriodOption = ({ item }) => (
    <TouchableOpacity
      style={{
        padding: 10,
        marginVertical: 2,
        backgroundColor: '#e6e6fa',
        borderRadius: 5,
        ...(periodDays === item && { backgroundColor: '#FFC0CB' }),
      }}
      onPress={() => setPeriodDays(item)}
    >
      <Text style={{textAlign: 'center'}}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ flexGrow: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
        {/* Greeting */}
          <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 5 }}>{getGreeting()},</Text>
          <Text style={{ fontSize: 30, color: '#333', marginBottom: 20}}>{userName}</Text>

        {/* Month Selector */}
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
            marginHorizontal: 8,
        }}>
          <TouchableOpacity
             disabled={!viewFullCalendar}
              onPress={handlePrevMonth}
            >
            <Text
              style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#007BFF',
                ...( !viewFullCalendar && {color: '#d3d3d3'})
                }}
            >
              {'<'}
            </Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{format(currentMonth, 'MMMM yyyy')}</Text>
          <TouchableOpacity
            disabled={!viewFullCalendar}
             onPress={handleNextMonth}
          >
            <Text
              style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#007BFF',
                ...( !viewFullCalendar && {color: '#d3d3d3'})
                }}
            >
              {'>'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleCalendarView}>
              <Text style={{ fontSize: 16, color: '#007BFF'}}>
              {viewFullCalendar ? 'Hide' : 'View'}
            </Text>
          </TouchableOpacity>
        </View>
         {/* Weekdays */}
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 9,
        }}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
            <Text key={index} style={{ fontSize: 16, fontWeight: 'bold', color: '#666', marginHorizontal: 15 }}>
              {day}
            </Text>
          ))}
        </View>

        {/* Calendar */}
        <FlatList
          data={viewFullCalendar ? monthDates : weekDates}
          numColumns={7}
          keyExtractor={(item) => item.toISOString()}
            renderItem={({ item }) => {
            const isToday = today.toDateString() === item.toDateString();
              const isPeriod = periodDates.some(
                (date) => date.toDateString() === item.toDateString()
            );
              const isFertile = fertileDates.some(
                (date) => date.toDateString() === item.toDateString()
            );
            const isPredictedPeriod = predictedPeriodDates.some(
                (date) => date.toDateString() === item.toDateString()
            );
            const isInCurrentMonth = item.getMonth() === currentMonth.getMonth();

            return (
              <TouchableOpacity
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginHorizontal: 5,
                    backgroundColor: '#e6e6fa',
                    marginBottom: 10,
                    ...(isToday && { borderColor: '#FF6347', borderWidth: 2 }),
                    ...(isPeriod && {backgroundColor: '#FFC0CB'}),
                    ...(isFertile && {backgroundColor: '#ADD8E6'}),
                      ...(isPredictedPeriod && { borderColor: '#FF69B4', borderWidth: 2 }),
                    ...( !isInCurrentMonth && {backgroundColor: '#dcdcdc'}),
                    ...(viewFullCalendar && { width: 35,
                      height: 35,
                      borderRadius: 30 }),
                }}
                  onPress={() => (isStartingPeriod ? handleSelectDate(item) : null)}
                >
                <Text
                    style={{
                       fontSize: 16,
                        color: '#333',
                        ...( !isInCurrentMonth && { color: '#a9a9a9' }),
                     }}
                  >
                  {item.getDate()}
                </Text>
              </TouchableOpacity>
            );
          }}
            contentContainerStyle={{justifyContent: 'space-around'}}
        />
        {/* Warning text if no date selected */}
        {!periodStartDate && (
          <View style={{
                padding: 10,
                borderRadius: 20,
                marginBottom: 10,
                marginTop: 10,
                backgroundColor: '#ffe6e6',
          }}>
            <Text style={{ fontSize: 16, color: '#333', textAlign: 'left', paddingVertical: 10 }}>
              Please select your start period to calculate predictions.
            </Text>
          </View>
        )}
        {/* Full Calendar Pop-up */}
        <Modal
          visible={viewFullCalendar}
          animationType="slide"
          transparent={true}
          onRequestClose={toggleCalendarView}
        >
          <View style={{
              flex: 1,
                justifyContent: 'center',
               alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
            <View style={{
                  backgroundColor: '#fff',
                    width: '90%',
                   padding: 20,
                  borderRadius: 10,
            }}>
              <View style={{
                  flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10,
                    marginHorizontal: 8,
              }}>
                  <TouchableOpacity onPress={handlePrevMonth}>
                    <Text style={{
                      fontSize: 20,
                        fontWeight: 'bold',
                        color: '#007BFF',
                    }}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                  {format(currentMonth, 'MMMM yyyy')}
                </Text>
                  <TouchableOpacity onPress={handleNextMonth}>
                      <Text style={{
                        fontSize: 20,
                          fontWeight: 'bold',
                            color: '#007BFF',
                    }}>{'>'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={toggleCalendarView}>
                      <Text style={{ fontSize: 16, color: '#007BFF'}}>Hide</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                  data={monthDates}
                numColumns={7}
                keyExtractor={(item) => item.toISOString()}
                  renderItem={({ item }) => {
                    const isToday = today.toDateString() === item.toDateString();
                     const isPeriod = periodDates.some(
                         (date) => date.toDateString() === item.toDateString()
                     );
                     const isFertile = fertileDates.some(
                        (date) => date.toDateString() === item.toDateString()
                    );
                    const isPredictedPeriod = predictedPeriodDates.some(
                       (date) => date.toDateString() === item.toDateString()
                    );
                    const isInCurrentMonth =
                        item.getMonth() === currentMonth.getMonth();
                    return (
                      <TouchableOpacity
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginHorizontal: 5,
                            backgroundColor: '#e6e6fa',
                            marginBottom: 10,
                             ...(isToday && { borderColor: '#FF6347', borderWidth: 2 }),
                             ...(isPeriod && {backgroundColor: '#FFC0CB'}),
                            ...(isFertile && {backgroundColor: '#ADD8E6'}),
                              ...(isPredictedPeriod && { borderColor: '#FF69B4', borderWidth: 2 }),
                            ...( !isInCurrentMonth && {backgroundColor: '#dcdcdc'}),
                            ...( { width: 35,
                            height: 35,
                            borderRadius: 30 }),
                        }}
                           onPress={() =>
                            isStartingPeriod ? handleSelectDate(item) : null
                           }
                        >
                        <Text
                          style={{
                              fontSize: 16,
                                color: '#333',
                               ...( !isInCurrentMonth && { color: '#a9a9a9' }),
                           }}
                        >
                          {item.getDate()}
                        </Text>
                      </TouchableOpacity>
                    );
                }}
                 contentContainerStyle={{justifyContent: 'space-around', marginBottom: 20}}
              />
              {/* Legend */}
              <View style={{
                  flexDirection: 'row',
                    justifyContent: 'space-around',
                   paddingVertical: 10,
                     marginBottom: 10,
              }}>
                <View style={{flexDirection: 'row',
                    alignItems: 'center',}}>
                    <View style={{
                        width: 15,
                        height: 15,
                        borderRadius: 10,
                        marginRight: 5,
                      backgroundColor: '#FFC0CB' }} />
                  <Text style={{ fontSize: 12 }}>Period</Text>
                </View>
                <View style={{flexDirection: 'row',
                    alignItems: 'center',}}>
                  <View style={{
                       width: 15,
                        height: 15,
                        borderRadius: 10,
                        marginRight: 5,
                      backgroundColor: '#ADD8E6'}} />
                  <Text style={{ fontSize: 12 }}>Fertile Window</Text>
                </View>
                 <View style={{flexDirection: 'row',
                    alignItems: 'center',}}>
                  <View style={{
                       width: 15,
                        height: 15,
                        borderRadius: 10,
                        marginRight: 5,
                      borderColor: '#FF69B4',
                      borderWidth: 2,}} />
                  <Text style={{ fontSize: 12 }}>Predicted Period</Text>
                </View>
              </View>
                {/* Change Period Button */}
                <View style={{
                     marginTop: 20,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                }}>
                     <Text style={{ fontSize: 16, color: '#000000', fontWeight: 'semibold' }}>Change Period</Text>
                    <TouchableOpacity
                       style={{
                         padding: 10,
                            borderRadius: 5,
                             backgroundColor: '#007BFF',
                         ...(isStartingPeriod ? {backgroundColor: '#808080'} : {backgroundColor: '#FF6347'}),
                     }}
                      onPress={handleStartPeriod}
                    >
                         <Text style={{color: '#fff', fontWeight: 'bold'}}>
                            {isStartingPeriod ? 'Select Date' : 'Start Period'}
                        </Text>
                   </TouchableOpacity>
                </View>
            </View>
          </View>
        </Modal>
      {/* Cycle Indicator */}
        {periodStartDate && (
            <View style={{
                 alignItems: 'center',
                  marginBottom: 20,
                  marginTop: 20,
            }}>
              <View style={{
                 width: 300,
                height: 300,
                borderRadius: 150,
                borderWidth: 10,
                  borderColor: '#F05A76',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                  <Text style={{fontSize: 36, fontWeight: 'semibold',textAlign: 'center', marginBottom: 5}}>
                    {phase}:
                    </Text>
                   {day !== null && <Text style={{ fontSize: 18,textAlign: 'center', color: '#666'}}>
                        {`Day ${day}`}
                   </Text>}
                  <View style={{
                      marginTop: 15,
                        backgroundColor: '#ffe6e6',
                         padding: 10,
                        borderRadius: 20,
                        maxWidth: 200,
                        alignItems: 'center',
                  }}>
                      <Text style={{ fontSize: 16, textAlign: 'center' }}>
                        {getRecommendation(phase)}
                     </Text>
                </View>
                </View>
                <View style={{
                    padding: 10,
                    backgroundColor: '#ffe6e6',
                    borderRadius: 20,
                    maxWidth: 350,
                    marginTop: 10,
                }}>
                    <Text style={{ textAlign: 'center',color: '#666'}}>
                      {periodStartDate
                        ? `Your period is likely to start on or around ${format(
                           addDays(periodStartDate, cycleLength),
                            'dd MMM yyyy'
                        )}`
                        : ''}
                    </Text>
                 </View>
            </View>
        )}
      {/* Last Menstrual Period Info */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Last Menstrual Period</Text>
       <View style={{
                padding: 10,
                backgroundColor: '#fff',
                borderRadius: 20,
                marginBottom: 20,
                 shadowColor: '#000',
                 shadowOffset: {
                    width: 2,
                    height: 2,
                },
                shadowOpacity: 0.4,
                shadowRadius: 4,
               elevation: 5,
       }}>
          <View style={{
               flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
          }}>
           <Text>
             Start Date:{' '}
           </Text>
              <Text style={{ marginLeft: 30 }}>
                {periodStartDate ? format(periodStartDate, 'dd MMM yyyy') : 'Not set'}
             </Text>
          </View>
          <View style={{
              flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
          }}>
             <Text>Cycle Length:</Text>
            <TouchableOpacity onPress={() => setShowCycleLengthPicker(true)}>
                <Text style={{
                      borderWidth: 1,
                     borderColor: '#ccc',
                     borderRadius: 10,
                       padding: 5,
                      width: 50,
                      textAlign: 'center',
                }}>{cycleLength} </Text>
            </TouchableOpacity>
          </View>
           <View style={{
              flexDirection: 'row',
               justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
           }}>
              <Text>Period Length:</Text>
            <TouchableOpacity onPress={() => setShowPeriodDaysPicker(true)}>
               <Text style={{
                      borderWidth: 1,
                    borderColor: '#ccc',
                     borderRadius: 10,
                       padding: 5,
                    width: 50,
                      textAlign: 'center',
                }}>{periodDays} </Text>
            </TouchableOpacity>
          </View>
        </View>
       {/* Modal for Cycle Length Picker */}
       <Modal
            visible={showCycleLengthPicker}
            transparent={true}
           animationType="slide"
            onRequestClose={() => setShowCycleLengthPicker(false)}
        >
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
           <View style={{
               backgroundColor: 'white',
                width: 300,
                borderRadius: 10,
               padding: 10,
           }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>Cycle Length:</Text>
               <FlatList
                 data={cycleOptions}
                 keyExtractor={(item) => String(item)}
                   renderItem={renderCycleOption}
                style={{ maxHeight: 200}}
            />
                <View style={{
                     flexDirection: 'row',
                      justifyContent: 'space-around',
                     marginTop: 15,
                }}>
                   <TouchableOpacity
                        style={{
                             padding: 10,
                            borderRadius: 5,
                           backgroundColor: '#d3d3d3'
                        }}
                       onPress={() => setShowCycleLengthPicker(false)}
                    >
                    <Text style={{ fontWeight: 'bold', fontSize: 16}}>Cancel</Text>
                  </TouchableOpacity>
                    <TouchableOpacity
                       style={{
                            padding: 10,
                              borderRadius: 5,
                             backgroundColor: '#FFC0CB',
                     }}
                      onPress={() => handleSelectCycleLength(cycleLength)}
                    >
                    <Text style={{ fontWeight: 'bold', fontSize: 16}}>Confirm</Text>
                  </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
     {/* Modal for Period Length Picker */}
        <Modal
          visible={showPeriodDaysPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowPeriodDaysPicker(false)}
        >
            <View style={{
                flex: 1,
                  justifyContent: 'center',
                 alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
             <View style={{
                 backgroundColor: 'white',
                width: 300,
                borderRadius: 10,
                 padding: 10,
             }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>Period Length:</Text>
                <FlatList
                     data={periodOptions}
                     keyExtractor={(item) => String(item)}
                   renderItem={renderPeriodOption}
                     style={{ maxHeight: 200}}
                  />
                    <View style={{
                         flexDirection: 'row',
                       justifyContent: 'space-around',
                         marginTop: 15,
                    }}>
                        <TouchableOpacity
                             style={{
                                 padding: 10,
                                borderRadius: 5,
                                 backgroundColor: '#d3d3d3'
                             }}
                             onPress={() => setShowPeriodDaysPicker(false)}
                       >
                       <Text style={{ fontWeight: 'bold', fontSize: 16}}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                           style={{
                               padding: 10,
                             borderRadius: 5,
                               backgroundColor: '#FFC0CB',
                          }}
                           onPress={() => handleSelectPeriodDays(periodDays)}
                      >
                        <Text style={{ fontWeight: 'bold', fontSize: 16}}>Confirm</Text>
                      </TouchableOpacity>
                   </View>
               </View>
            </View>
        </Modal>

       {/* Period History */}
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Period History</Text>
        <View style={{
                padding: 10,
                 backgroundColor: '#fff',
                  borderRadius: 20,
                marginBottom: 20,
               shadowColor: '#000',
                 shadowOffset: {
                    width: 2,
                     height: 2,
                 },
                 shadowOpacity: 0.4,
                shadowRadius: 4,
                  elevation: 5,
        }}>
           <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
            }}>
              <Text>Pain:</Text>
                <View style={{
                     flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    borderRadius: 20,
                    backgroundColor: '#E7E7FF',
                }}>
                     {[0, 1, 2, 3, 4].map((level) => (
                        <TouchableOpacity
                              key={level}
                            onPress={() => handleSelectPainLevel(level)}
                            >
                              <Animated.View style={getAnimatedStyle(painAnims[level])}>
                                 <Text
                                       style={{
                                        fontSize: 24,
                                          padding: 5,
                                         ...( painLevel[level] && { color: 'black'})
                                        }}
                                   >
                                       {painLevel[level] ? '❤️' : '🤍'}
                                    </Text>
                                </Animated.View>
                            </TouchableOpacity>
                        ))}
                  </View>
           </View>
          <View style={{
               flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
          }}>
                <Text>Bleeding:</Text>
                 <View style={{
                     flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    borderRadius: 20,
                    backgroundColor: '#FFF3F5',
                }}>
                      {[0, 1, 2, 3, 4].map((level) => (
                        <TouchableOpacity
                           key={level}
                            onPress={() => handleSelectBleedingLevel(level)}
                            >
                            <Animated.View style={getAnimatedStyle(bleedingAnims[level])}>
                              <Text
                                style={{
                                        fontSize: 24,
                                          padding: 5,
                                       ...( bleedingLevel[level] && { color: 'black'})
                                    }}
                                >
                                   {bleedingLevel[level] ? '🩸' : '🫙'}
                                </Text>
                            </Animated.View>
                        </TouchableOpacity>
                     ))}
                    </View>
           </View>
           <View style={{
              flexDirection: 'row',
               justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
           }}>
               <Text>Mood:</Text>
             <View style={{
                 flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                     borderRadius: 20,
                    backgroundColor: '#F6FFC2',
             }}>
                  {[0, 1, 2, 3, 4].map((level) => (
                        <TouchableOpacity
                           key={level}
                          onPress={() => handleSelectMoodLevel(level)}
                           >
                            <Animated.View style={getAnimatedStyle(moodAnims[level])}>
                                  <Text
                                   style={{
                                       fontSize: 24,
                                          padding: 5,
                                        ...( moodLevel[level] && { color: 'black'})
                                    }}
                                    >
                                     {moodLevel[level] ? '😀' : '😶'}
                                    </Text>
                                </Animated.View>
                           </TouchableOpacity>
                      ))}
                  </View>
            </View>
          </View>
    </View>
  </ScrollView>
  );
};
export default Cycle;