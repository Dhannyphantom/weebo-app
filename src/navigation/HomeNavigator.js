import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DisplayImageScreen from "../screens/DisplayImageScreen";
import ChatUserScreen from "../screens/ChatUserScreen";
import ConnectScreen from "../screens/ConnectScreen";

import TabNavigator from "./TabNavigator";
import GetFeedbacks from "../components/GetFeedbacks";

// SCREEN PACK THAT SHOWS WHEN YOU'RE LOGGED IN

const Stack = createNativeStackNavigator();

// SCREENS HERE WILL NOT DISPLAY THE BOTTOM TABS

const HomeNavigator = () => {
  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeTab" component={TabNavigator} />
        <Stack.Screen name="ChatUser" component={ChatUserScreen} />
        <Stack.Screen name="Display" component={DisplayImageScreen} />
        <Stack.Screen name="Connect" component={ConnectScreen} />
      </Stack.Navigator>
      <GetFeedbacks />
    </>
  );
};

export default HomeNavigator;
