import React from "react";
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack>
    <Stack.Screen
      name="index" // Halaman Welcome akan menjadi halaman pertama yang ditampilkan
      options={{ title: "Welcome", headerShown: false  }} // Sembunyikan header jadiin false aja
    />
    <Stack.Screen
      name="login" // Halaman Login
      options={{ title: "Login", headerShown: false  }} // Sembunyikan header jadiin false aja
    />
      <Stack.Screen
        name="register"
        options={{ title: "Register", headerShown: false }} // Sembunyikan header jadiin false aja
      />
    </Stack>
  );
};

export default AuthLayout;
