import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import Spinner from "react-native-loading-spinner-overlay";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../config";

const RegisterScreen = () => {
  const navigation = useNavigation();

  const [userInfo, setUserInfo] = useState({});

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendToBackend = () => {
    const submittedData = { name, email, password };

    if (name == "" || email == "" || password == "") {
      Toast.show({
        type: "error",
        text1: "Name, email and password cannot be empty",
      });
    } else {
      if (password.length < 6) {
        Toast.show({
          type: "error",
          text1: "Password length cannot be less than 6",
        });
      } else {
        setIsLoading(true);
        fetch(`${BASE_URL}/auth/user/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submittedData),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.message) {
              data.success
                ? Toast.show({
                    type: "success",
                    text1: data.message,
                  })
                : Toast.show({
                    type: "error",
                    text1: data.message,
                  });
            }

            {
              data.success ? navigation.navigate("login") : null;
            }
          })
          .catch((e) => {
            console.log(`register error ${e}`);
            Toast.show({
              type: "error",
              text1: e.message,
            });

            setIsLoading(false);
          });

        setIsLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View className="bg-blue h-full w-full">
          <StatusBar style="light" />
          <Image
            className="h-[700] w-full absolute"
            source={require("../assets/images/background.png")}
          />

          <View className="flex-row w-full justify-around">
            <Animated.Image
              entering={FadeInUp.delay(200)
                .duration(1000)
                .springify()
                .damping(3)
                .mass(5)}
              className="h-[190] w-[80] "
              source={require("../assets/images/light.png")}
            />

            <Spinner visible={isLoading} />

            <Animated.Image
              entering={FadeInUp.delay(400)
                .duration(1000)
                .springify()
                .mass(3)
                .damping(3)}
              className="h-[130] w-[65] "
              source={require("../assets/images/light.png")}
            />
          </View>

          <View className="flex h-full w-full justify-around pt-0 pb-60">
            <View className="flex items-center">
              <Animated.Text
                entering={FadeInUp.delay(400)
                  .duration(1000)
                  .springify()

                  .damping(3)}
                className="text-white font-bold tracking-wider text-5xl"
              >
                Register
              </Animated.Text>
            </View>

            <View className="flex items-center mx-4 space-y-4">
              <Animated.View
                entering={FadeInDown.duration(1000).delay(200).springify()}
                className="bg-black/5 p-4 rounded-2xl w-full"
              >
                <TextInput
                  placeholder="Name"
                  placeholderTextColor={"gray"}
                  value={name}
                  onChangeText={(text) => setName(text)}
                />
              </Animated.View>
              <Animated.View
                entering={FadeInDown.duration(1000).delay(200).springify()}
                className="bg-black/5 p-4 rounded-2xl w-full"
              >
                <TextInput
                  placeholder="Email"
                  placeholderTextColor={"gray"}
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                />
              </Animated.View>

              <Animated.View
                entering={FadeInDown.duration(1000).delay(400).springify()}
                className="bg-black/5 p-4 rounded-2xl w-full"
              >
                <TextInput
                  placeholder="Password"
                  placeholderTextColor={"gray"}
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  secureTextEntry
                />
              </Animated.View>

              <Animated.View
                entering={FadeInDown.duration(1000).delay(600).springify()}
                className="w-full"
              >
                <TouchableOpacity
                  className="w-full bg-sky-400 p-3 rounded-2xl mb-3"
                  onPress={() => sendToBackend()}
                >
                  <Text className="text-xl font-bold text-white text-center">
                    Register
                  </Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View
                entering={FadeInDown.duration(1000).delay(800).springify()}
                className="flex-row justify-center"
              >
                <Text>Already have an account ? </Text>
                <TouchableOpacity onPress={() => navigation.push("login")}>
                  <Text className="text-sky-600">Login</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
