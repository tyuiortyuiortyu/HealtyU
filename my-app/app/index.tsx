import '../global.css'

import { SafeAreaView, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const App = () => {
  return (
    <SafeAreaView className='flex-1'>
        <View className='flex-1 justify-center items-center'>
        <Text className='text-3xl font-aExLight'>HealthyU</Text>
        <Link href={"./(tabs)/profile"} className='text-xs'>Go to profile</Link>
      </View>
    </SafeAreaView>    
  )
}

export default App

