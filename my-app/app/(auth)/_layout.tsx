import React from "react";
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="index" // Halaman Welcome akan menjadi halaman pertama yang ditampilkan
    />
    <Stack.Screen
      name="login" // Halaman Login
    />
      <Stack.Screen
        name="register"
      />
    </Stack>
  );
};

export default AuthLayout;
