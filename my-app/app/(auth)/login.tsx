import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import images from "../../constants/images";
import icons from "../../constants/icons";
import { useRouter } from "expo-router"; // Import useRouter hook

const login = () => {
  // State untuk email dan password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State untuk toggle password
  const router = useRouter(); // Initialize router hook

  // Fungsi untuk menangani login
  const handleLogin = () => {
    if (!email || !password) {
      // Menampilkan pesan jika email atau password belum diisi
      Alert.alert("Validation", "Please fill in both email and password");
      return;
    }

    // Jika email dan password sudah terisi, lakukan navigasi ke Homepage
    router.push("../(tabs)/profile.tsx"); // Use router.push() for navigation
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.topText}>
          Welcome Back! Glad{"\n"}to see you. Again!
        </Text>
      </View>

      {/* Input Email */}
      <View style={styles.inputContainerEmail}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your email address"
          value={email}
          onChangeText={setEmail} // Update state ketika ada perubahan
        />
      </View>

      {/* Input Password */}
      <View style={styles.inputContainerPassword}>
        <TextInput
          style={[styles.textInput, { paddingRight: 30 }]} // Sesuaikan padding untuk ikon
          placeholder="Enter your password"
          value={password}
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
        />
        {/* Toggle Icon */}
        <TouchableOpacity
          onPress={() => setShowPassword((prev) => !prev)} // Toggle visibilitas password
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"} // Ikon mata terbuka/tutup
            size={24}
            color="#aaa"
          />
        </TouchableOpacity>
      </View>

      <Text
        style={styles.forgotText}
        onPress={() => router.push("./register.tsx")}
      >
        Forgot Password
      </Text>

      {/* Tombol Login */}
      <TouchableOpacity
        style={styles.loginButtonContainer}
        onPress={handleLogin} // Menangani login
      >
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      {/* Or login with */}
      <View style={styles.orLoginWithContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>Or Login with</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.logoContainer}>
        <Image source={images.google} style={styles.logo} />
        <Image source={images.apple} style={styles.logo} />
        <Image source={images.facebook} style={styles.logo} />
        <Image source={images.twitter} style={styles.logo} />
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.bottomText}>
          Don't have an account?{" "}
          <Text
            style={styles.registerText}
            onPress={() => router.push("./register.tsx")}
          >
            Register
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default login;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },
  topContainer: {
    marginTop: 0,
    marginBottom: 80,
  },
  topText: {
    textAlign: "left",
    fontSize: 30,
    fontWeight: "bold",
  },
  textInput: {
    flex: 1,
    paddingLeft: 10, // Pastikan ada jarak di sebelah kiri
    fontSize: 16,
    textAlign: "left",
    textAlignVertical: "center", // Vertikal rata tengah (khusus Android)
  },
  inputContainerEmail: {
    backgroundColor: "#ffff",
    flexDirection: "row",
    width: "85%",
    height: 60,
    borderRadius: 10,
    elevation: 15,
    marginHorizontal: 40,
    marginBottom: 10,
    alignItems: "center",
  },
  inputContainerPassword: {
    backgroundColor: "#ffff",
    flexDirection: "row",
    width: "85%",
    height: 60,
    borderRadius: 10,
    elevation: 15,
    marginHorizontal: 40,
    marginBottom: 10,
    alignItems: "center",
    paddingRight: 10, // Berikan ruang untuk ikon toggle
  },
  forgotText: {
    textAlign: "right",
    width: "78%",
    marginTop: 5,
  },
  loginButtonContainer: {
    backgroundColor: "#E7E8EE",
    width: "70%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
    borderRadius: 10,
  },
  loginText: {
    color: "#000000",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },

  orLoginWithContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10, // Mengurangi margin untuk mendekatkan dengan logo container
    width: "75%",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#EDEEF2",
    marginTop: 30,
  },
  orText: {
    color: "#ADB0BB",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 10,
    marginTop: 30,
  },

  logoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25, // Mengurangi margin untuk mendekatkan dengan orLoginWithContainer
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginHorizontal: 10,
    marginTop: 10,
  },
  bottomContainer: {
    flex: 1,
    marginTop: 100,
  },
  bottomText: {
    fontSize: 18,
    textAlign: "center",
    // marginTop: 100,
  },
  registerText: {
    color: "#2B4763",
    fontWeight: "bold",
  },
});
