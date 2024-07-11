import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import DisplayImageScreen from "../screens/DisplayImageScreen";
import ChatUserScreen from "../screens/ChatUserScreen";
import ConnectScreen from "../screens/ConnectScreen";

import TabNavigator from "./TabNavigator";
import GetFeedbacks from "../components/GetFeedbacks";
import RetryMediaUpload from "../components/RetryMediaUpload";

// SCREEN PACK THAT SHOWS WHEN YOU'RE LOGGED IN

const Stack = createNativeStackNavigator();

// SCREENS HERE WILL NOT DISPLAY THE BOTTOM TABS

const HomeNavigator = () => {
  const [uploadData, setUploadData] = useState(null);

  const prepareFunc = async () => {
    const failedData = await AsyncStorage.getItem("failed_upload");
    if (failedData) {
      setUploadData(JSON.parse(failedData));
    }
  };

  useEffect(() => {
    prepareFunc();
  }, []);

  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeTab" component={TabNavigator} />
        <Stack.Screen name="ChatUser" component={ChatUserScreen} />
        <Stack.Screen name="Display" component={DisplayImageScreen} />
        <Stack.Screen name="Connect" component={ConnectScreen} />
      </Stack.Navigator>
      <GetFeedbacks />
      <RetryMediaUpload data={uploadData} />
    </>
  );
};

export default HomeNavigator;
