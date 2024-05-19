import React, { useContext, useEffect, useState } from "react";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { EventRegister } from "react-native-event-listeners";
import * as NavigationBar from "expo-navigation-bar";
import {
  Provider as AuthProvider,
  Context as AuthContext,
} from "./config/AuthContext";
import { Provider as CharProvider } from "./config/CharContext";
import { Provider as AccountProvider } from "./config/AcctContext";
import { Provider as FeedProvider } from "./config/FeedContext";
import { Provider as ChallContext } from "./config/ChallContext";
import theme from "./constants/theme";

import AuthNavigator from "./navigation/AuthNavigator";
import HomeNavigator from "./navigation/HomeNavigator";
import ThemeContext from "./config/ThemeContext";
import colors from "./constants/colors";
// import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { Text, View } from "react-native";

const Entry = () => {
  return (
    <View>
      <Text>Entry</Text>
    </View>
  );
};

export default Entry;
