// import React from "react";
// import { Stack } from "expo-router";

// const AuthLayout = () => {
//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//     <Stack.Screen
//       name="index"
//     />
//     <Stack.Screen
//       name="login"
//     />
//       <Stack.Screen
//         name="register"
//       />
//     </Stack>
//   );
// };
// export default AuthLayout;

import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="register" options={{ title: 'Register' }} />
      <Stack.Screen name="welcome" options={{ title: 'Welcome' }} />
    </Stack>
  );
}