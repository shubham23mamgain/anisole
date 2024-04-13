import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Camera, CameraType } from "expo-camera";
import { Avatar } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

const CameraScreen = ({ navigation, route }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [camera, setCamera] = useState(null);
  const openImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false)
      return alert("Permission to access gallery is required");

    const data = await ImagePicker.launchImageLibraryAsync();

    return navigation.navigate("home", {
      image: data.assets[0].uri,
    });
  };

  const clickPicture = async () => {
    const data = await camera.takePictureAsync();

    // console.log("Image Data from Camera Screen", data);
    return navigation.navigate("home", {
      image: data.uri,
    });
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) return <View />;

  if (hasPermission === false)
    return (
      <View style={defaultStyle}>
        <Text>No access to camera</Text>
      </View>
    );

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Camera
        type={type}
        style={{
          flex: 1,
          aspectRatio: 1,
        }}
        ratio={"1:1"}
        ref={(e) => setCamera(e)}
      />

      <View
        style={{
          flexDirection: "row",
          bottom: 10,
          width: "100%",
          justifyContent: "space-evenly",
          position: "absolute",
        }}
      >
        <MyIcon icon="image" handler={openImagePicker} />
        <MyIcon icon="camera" handler={clickPicture} />
        <MyIcon
          icon="camera-flip"
          handler={() => {
            setType((prevType) =>
              prevType === CameraType.back ? CameraType.front : CameraType.back
            );
          }}
        />
      </View>
    </View>
  );
};

const MyIcon = ({ icon, handler }) => (
  <TouchableOpacity onPress={handler}>
    <Avatar.Icon
      icon={icon}
      size={40}
      color={"red"}
      style={{
        backgroundColor: "purple",
      }}
    />
  </TouchableOpacity>
);

export default CameraScreen;
