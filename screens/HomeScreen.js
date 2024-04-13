import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { Avatar } from "react-native-paper";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { BASE_URL } from "../config";
import Spinner from "react-native-loading-spinner-overlay";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { defaultImg } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import mime from "mime";

const HomeScreen = ({ route }) => {
  const router = useRoute();
  // console.log("Token in Home Page from Passing Data", router.params?.token);

  // console.log("Async storage token saved", token);

  const [pic, setPic] = useState(null);

  const [userData, setUserData] = useState({});
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchToken = async () => {
    try {
      const token = await AsyncStorage.getItem("userInfo");
      return JSON.parse(token);
    } catch (e) {
      console.log(e);
    }
  };

  const navigation = useNavigation();

  const fetchLocationData = async () => {
    const token = await fetchToken();

    setIsLoading(true);

    axios
      .get(`${BASE_URL}/data`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        Toast.show({
          type: res.data.success ? "success" : "error",
          text1: res.data.message,
        });
        let myData = res.data;

        setUserData(myData);
        AsyncStorage.setItem("userData", JSON.stringify(myData));
        setIsLoading(false);
        {
          res.data.success ? navigation.navigate("receiver", { myData }) : null;
        }
      })
      .catch((e) => {
        console.log(`login error ${e}`);
        Toast.show({
          type: "error",
          text1: e.message,
        });
        setIsLoading(false);
      });
  };

  const sendToBackend = async () => {
    const token = await fetchToken();
    if (latitude == "" || longitude == "" || pic == null) {
      Toast.show({
        type: "error",
        text1: "Fields cannot be empty",
      });
    } else {
      const myForm = new FormData();
      myForm.append("latitude", latitude);
      myForm.append("longitude", longitude);
      if (pic !== "") {
        myForm.append("file", {
          uri: "https://test.webyaparsolutions.com/form" + pic,
          type: mime.getType(pic),
          name: pic.split("/").pop(),
        });
      }

      // console.log("Showing myForm data", myForm._parts[2]);

      setIsLoading(true);

      axios
        .post(`${BASE_URL}/form`, myForm, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          console.log(res);
          Toast.show({
            type: res.data.success ? "success" : "error",
            text1: res.data.message,
          });
          let myData = res.data;
          console.log(myData);
          setUserData(myData);
          AsyncStorage.setItem("userData", JSON.stringify(myData));
          setIsLoading(false);
          {
            res.data.success ? navigation.navigate("receiver") : null;
          }
        })
        .catch((e) => {
          console.log(`login error ${e}`);
          Toast.show({
            type: "error",
            text1: e.message,
          });
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    if (route.params?.image) setPic(route.params.image);
  }, [route.params?.image]);
  return (
    <View className="bg-white">
      <View className="flex h-[50] w-full mt-20 mb-20">
        <View className="flex items-center">
          <Text className="text-black font-bold tracking-wider text-5xl">
            Fill the Form
          </Text>
        </View>
      </View>

      <Animated.View
        entering={FadeInUp.duration(1000).springify().delay(200)}
        className="items-center"
      >
        <Avatar.Image
          style={{
            alignSelf: "center",
            backgroundColor: "gray",
            marginBottom: 10,
          }}
          size={150}
          source={{
            uri: pic ? pic : defaultImg,
          }}
        />

        <TouchableOpacity onPress={() => navigation.navigate("camera")}>
          <Text className="text-xl font-bold text-sky-400 text-center mb-10">
            Change Photo
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <View className="flex items-center mx-4 space-y-4">
        <Animated.View
          entering={FadeInDown.duration(1000).delay(200).springify()}
          className="bg-black/5 p-4 rounded-2xl w-full"
        >
          <TextInput
            placeholder="Latitude"
            placeholderTextColor={"gray"}
            value={latitude}
            onChangeText={(text) => setLatitude(text)}
          />
        </Animated.View>
        <Animated.View
          entering={FadeInDown.duration(1000).delay(200).springify()}
          className="bg-black/5 p-4 rounded-2xl w-full"
        >
          <TextInput
            placeholder="Longitude"
            placeholderTextColor={"gray"}
            value={longitude}
            onChangeText={(text) => setLongitude(text)}
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
              Submit
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Text className="text-xl font-bold text-black text-center"> OR </Text>

        <Animated.View
          entering={FadeInDown.duration(1000).delay(600).springify()}
          className="w-full"
        >
          <TouchableOpacity
            className="w-full bg-sky-400 p-3 rounded-2xl mb-3"
            onPress={() => fetchLocationData()}
          >
            <Text className="text-xl font-bold text-white text-center">
              Get Data
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

export default HomeScreen;
