import { View, Text } from "react-native";
import React, { useState } from "react";
import Spinner from "react-native-loading-spinner-overlay";
const ReceiverScreen = ({ route }) => {
  const [isLoading, setIsLoading] = useState(false);
  // console.log(route.params.myData.data[0]);
  const foundData = route.params?.myData?.data;
  console.log("FoundData", foundData);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Spinner visible={isLoading} />
      <Text className="text-black font-bold text-3xl">Stored Data</Text>
      {foundData == [] ? (
        <Text>No data Found for User</Text>
      ) : (
        <View>
          <Text className="mx-2 my-2">File : {foundData[0]?.file}</Text>
          <Text className="mx-2 my-2">
            Latitude : {foundData[0]?.location.latitude}
          </Text>
          <Text className="mx-2 my-2">
            Longitude : {foundData[0]?.location.longitude}
          </Text>
        </View>
      )}
    </View>
  );
};

export default ReceiverScreen;
