import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SplashScreen as ExpoSplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";

import Splash from "./splash";

ExpoSplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    aExLight: require("../assets/fonts/Assistant-ExtraLight.ttf"),
    aLight: require("../assets/fonts/Assistant-Light.ttf"),
    aRegular: require("../assets/fonts/Assistant-Regular.ttf"),
    aMedium: require("../assets/fonts/Assistant-Medium.ttf"),
    aSemiBold: require("../assets/fonts/Assistant-SemiBold.ttf"),
    aBold: require("../assets/fonts/Assistant-Bold.ttf"),
    aExBold: require("../assets/fonts/Assistant-ExtraBold.ttf"),
    rMedium: require("../assets/fonts/Raleway-Medium.ttf"),
  });

  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsSplashVisible(false);
      ExpoSplashScreen.hideAsync();
    }, 4000); // Durasi SplashScreen, sesuaikan dengan kebutuhan
  }, []);
  

  if (isSplashVisible) {
    return <Splash />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/register" />
    </Stack>
  );
};

export default RootLayout;
