// import "../global.css";
// import { SafeAreaView, View, Text } from "react-native";
// import React, { useState, useEffect } from "react";
// import { Link } from "expo-router";

// import Splash from "./splash";

// const App = () => {
//   const [isSplashVisible, setIsSplashVisible] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsSplashVisible(false); // Sembunyikan Splash setelah 3 detik
//     }, 4000);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <SafeAreaView className="flex-1">
//       {isSplashVisible ? (
//         <Splash />
//       ) : (
//         <View className="flex-1 justify-center items-center">
//           <Text className="text-3xl font-aExLight">HealthyU</Text>
//           <Link href={"(auth)/welcome"} className="text-xs">
//             Go to login
//           </Link>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// };

// export default App;


import "../global.css";
import { SafeAreaView } from "react-native";
import React, { useState, useEffect } from "react";
import { Link, router } from "expo-router";

import Splash from "./splash";

const App = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false); // Sembunyikan Splash setelah 4 detik
      router.replace("/(auth)/welcome"); // Navigasi ke halaman Welcome
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView className="flex-1">
      {isSplashVisible && <Splash />}
    </SafeAreaView>
  );
};

export default App;