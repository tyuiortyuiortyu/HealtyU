// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
// import { format, startOfWeek, addDays, subMonths, addMonths } from 'date-fns';

// const Cycle = () => {
//   const today = new Date();
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [currentMonth, setCurrentMonth] = useState(today);
//   const [viewFullCalendar, setViewFullCalendar] = useState(false);

//   const getGreeting = () => {
//     const hour = today.getHours();
//     if (hour < 12) return 'Good Morning';
//     if (hour < 18) return 'Good Afternoon';
//     return 'Good Evening';
//   };

//   const userName = 'Nikita'; 

//   const generateWeekDates = (date) => {
//     const weekStart = startOfWeek(date, { weekStartsOn: 1 });
//     return Array.from({ length: 7 }, (_, index) => new Date(addDays(weekStart, index)));
//   };

//   const generateMonthDates = (date) => {
//     const startDate = startOfWeek(new Date(date.getFullYear(), date.getMonth(), 1), {
//       weekStartsOn: 1,
//     });
//     return Array.from({ length: 42 }, (_, index) =>
//       addDays(startDate, index)
//     ); // 42 for 6 weeks grid.
//   };

//   const weekDates = generateWeekDates(selectedDate || today);
//   const monthDates = generateMonthDates(currentMonth);

//   return (
//     <View style={styles.container}>
//       {/* Greeting */}
//       <Text style={styles.greeting}>{getGreeting()},</Text>
//       <Text style={styles.userName}>{userName}</Text>

//       {/* Header Calendar */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => setCurrentMonth(subMonths(currentMonth, 1))}>
//           <Text style={styles.arrow}>{"<"}</Text>
//         </TouchableOpacity>
//         <Text style={styles.monthYear}>
//           {format(currentMonth, 'MMMM yyyy')}
//         </Text>
//         <TouchableOpacity onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}>
//           <Text style={styles.arrow}>{">"}</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => setViewFullCalendar(!viewFullCalendar)}>
//           <Text style={styles.actionText}>{viewFullCalendar ? 'Hide' : 'View'}</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Weekdays */}
//       <View style={styles.weekDays}>
//         {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
//           <Text key={index} style={styles.dayLabel}>
//             {day}
//           </Text>
//         ))}
//       </View>

//       {/* Dates */}
//       {viewFullCalendar ? (
//         <FlatList
//           data={monthDates}
//           numColumns={7}
//           keyExtractor={(item) => item.toISOString()}
//           renderItem={({ item }) => {
//             const isSelected = selectedDate && selectedDate.toDateString() === item.toDateString();
//             const isToday = today.toDateString() === item.toDateString();
//             const isOutsideMonth = item.getMonth() !== currentMonth.getMonth();

//             return (
//               <TouchableOpacity
//                 style={[
//                   styles.dateContainer,
//                   isSelected && styles.selectedDate,
//                   isOutsideMonth && styles.outsideMonth,
//                 ]}
//                 onPress={() => setSelectedDate(item)}
//               >
//                 <Text
//                   style={[
//                     styles.dateText,
//                     isToday && styles.todayText,
//                     isOutsideMonth && styles.outsideMonthText,
//                   ]}
//                 >
//                   {item.getDate()}
//                 </Text>
//               </TouchableOpacity>
//             );
//           }}
//           contentContainerStyle={styles.datesList}
//         />
//       ) : (
//         <FlatList
//           data={weekDates}
//           horizontal
//           keyExtractor={(item) => item.toISOString()}
//           renderItem={({ item }) => {
//             const isSelected = selectedDate && selectedDate.toDateString() === item.toDateString();
//             const isToday = today.toDateString() === item.toDateString();

//             return (
//               <TouchableOpacity
//                 style={[styles.dateContainer, isSelected && styles.selectedDate]}
//                 onPress={() => setSelectedDate(item)}
//               >
//                 <Text style={[styles.dateText, isToday && styles.todayText]}>
//                   {item.getDate()}
//                 </Text>
//               </TouchableOpacity>
//             );
//           }}
//           contentContainerStyle={styles.datesList}
//           showsHorizontalScrollIndicator={false}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   greeting: {
//     fontSize: 30,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   userName: {
//     fontSize: 30,
//     color: '#333',
//     marginBottom: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   arrow: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#007BFF',
//   },
//   monthYear: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   actionText: {
//     fontSize: 16,
//     color: '#007BFF',
//   },
//   weekDays: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 10,
//   },
//   dayLabel: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#666',
//   },
//   datesList: {
//     justifyContent: 'space-around',
//   },
//   dateContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginHorizontal: 5,
//     backgroundColor: '#e6e6fa',
//   },
//   selectedDate: {
//     backgroundColor: '#007BFF',
//   },
//   dateText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   todayText: {
//     color: '#FF6347',
//     fontWeight: 'bold',
//   },
//   outsideMonth: {
//     backgroundColor: '#f0f0f0',
//   },
//   outsideMonthText: {
//     color: '#999',
//   },
// });

// export default Cycle;