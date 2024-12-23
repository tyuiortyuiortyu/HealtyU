import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, Image, Text } from 'react-native';
// import { useFonts } from 'expo-font';

import images from '../constants/images';

const Splash = () => {
  const heartScale = useRef(new Animated.Value(3)).current;
  const heartPosition = useRef(new Animated.Value(1)).current;

  // Initialize textOpacity with Animated.Values for each character upfront
  const text = 'HealthyU'.split('');
  const textOpacity = useRef(text.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1,
        duration: 800,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
      Animated.timing(heartPosition, {
        toValue: -10,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Animating each character opacity sequentially
      textOpacity.forEach((anim, index) => {
        setTimeout(() => {
          Animated.timing(anim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }, index * 150);
      });
    });
  }, [heartScale, heartPosition, textOpacity]);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Animated.Image
          source={images.logo}
          style={{
            width: 130,
            height: 130,
            marginRight: -20,
            transform: [{ scale: heartScale }, { translateX: heartPosition }],
          }}
        />
        <View style={{ flexDirection: 'row' }}>
          {text.map((char, index) => (
            <Animated.Text
              key={index}
              className={'font-rMedium'}
              style={{
                fontSize: 28,
                // fontWeight: 'bold',
                color: '#333333',
                marginTop: 40,
                marginRight: 0.5,
                opacity: textOpacity[index],
              }}
            >
              {char}
            </Animated.Text>
          ))}
        </View>
      </View>
    </View>
  );
};

export default Splash;
