import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../config";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import Spinner from "react-native-loading-spinner-overlay";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const navigation = useNavigation();

  const [userInfo, setUserInfo] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const login = (email, password) => {
    setIsLoading(true);

    axios
      .post(`${BASE_URL}/auth/user/login`, {
        email,
        password,
      })
      .then((res) => {
        Toast.show({
          type: res.data.success ? "success" : "error",
          text1: res.data.message,
        });
        let userInfo = res.data;
        console.log(userInfo);

        setUserInfo(userInfo);
        AsyncStorage.setItem("userInfo", JSON.stringify(userInfo.token));
        setIsLoading(false);
        {
          res.data.success
            ? navigation.navigate("home", { token: res.data.token })
            : null;
        }
      })
      .catch((e) => {
        console.log("Detailed Error", e);
        console.log(`login error ${e}`);
        Toast.show({
          type: "error",
          text1: e.message,
        });
        setIsLoading(false);
      });
  };
  return (
    <View className="bg-blue h-full w-full">
      <StatusBar style="light" />
      <Image
        className="h-full w-full absolute"
        source={require("../assets/images/background.png")}
      />

      <View className="flex-row w-full justify-around absolute">
        <Animated.Image
          entering={FadeInUp.delay(200)
            .duration(1000)
            .springify()
            .damping(3)
            .mass(5)}
          className="h-[210] w-[80] "
          source={require("../assets/images/light.png")}
        />

        <Animated.Image
          entering={FadeInUp.delay(400)
            .duration(1000)
            .springify()
            .mass(3)
            .damping(3)}
          className="h-[160] w-[65] "
          source={require("../assets/images/light.png")}
        />
      </View>

      <Spinner visible={isLoading} />

      <View className="flex h-full w-full justify-around pt-40 pb-10">
        <View className="flex items-center">
          <Animated.Text
            entering={FadeInUp.delay(400)
              .duration(1000)
              .springify()

              .damping(3)}
            className="text-white font-bold tracking-wider text-5xl"
          >
            Login
          </Animated.Text>
        </View>

        <View className="flex items-center mx-4 space-y-4">
          <Animated.View
            entering={FadeInDown.duration(1000).delay(200).springify()}
            className="bg-black/5 p-5 rounded-2xl w-full"
          >
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholderTextColor={"gray"}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000).delay(400).springify()}
            className="bg-black/5 p-5 rounded-2xl w-full"
          >
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={(text) => setPassword(text)}
              placeholderTextColor={"gray"}
              secureTextEntry
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000).delay(600).springify()}
            className="w-full"
          >
            <TouchableOpacity
              className="w-full bg-sky-400 p-3 rounded-2xl mb-3"
              onPress={() => login(email, password)}
            >
              <Text className="text-xl font-bold text-white text-center">
                Login
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000).delay(800).springify()}
            className="flex-row justify-center"
          >
            <Text>Don't have an account ? </Text>
            <TouchableOpacity onPress={() => navigation.push("register")}>
              <Text className="text-sky-600">Sign Up</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
