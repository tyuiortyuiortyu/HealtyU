import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { SplashScreen, Stack } from 'expo-router'
import { useFonts } from 'expo-font'

SplashScreen.preventAutoHideAsync()

const RootLayout = () => {
    const [ fontsLoaded, error ] = useFonts({
        "aExLight": require("../assets/fonts/Assistant-ExtraLight.ttf"),
        "aLight": require("../assets/fonts/Assistant-Light.ttf"),
        "aRegular": require("../assets/fonts/Assistant-Regular.ttf"),
        "aMedium": require("../assets/fonts/Assistant-Medium.ttf"),
        "aSemiBold": require("../assets/fonts/Assistant-SemiBold.ttf"),
        "aBold": require("../assets/fonts/Assistant-Bold.ttf"),
        "aExBold": require("../assets/fonts/Assistant-ExtraBold.ttf"),
        "rMedium": require("../assets/fonts/Raleway-Medium.ttf"),
    })

    useEffect(() => {
        if(error)throw error
        if(fontsLoaded)SplashScreen.hideAsync()
    }, [fontsLoaded, error])

    if(!fontsLoaded && !error)return null

  return (
    <Stack>
        <Stack.Screen name='index' options={{headerShown: false}} />
    </Stack>
  )
}

export default RootLayout

const styles = StyleSheet.create({})