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
import AsyncStorageLib from "@react-native-async-storage/async-storage";

const Main = () => {
  const {
    state: { token },
  } = useContext(AuthContext);
  const [themeMode, setThemeMode] = useState(false);

  const lightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme,
      primary: colors.primary,
      background: themeMode ? theme.dark.background : theme.light.background,
    },
  };
  const darkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme,
      primary: colors.primary,
      background: themeMode ? theme.dark.background : theme.light.background,
    },
  };

  const setNavBar = async () => {
    await NavigationBar.setBackgroundColorAsync(
      themeMode ? theme.light.background : theme.dark.background
    );
    await NavigationBar.setButtonStyleAsync(
      themeMode ? theme.light.bar : theme.dark.bar
    );
  };

  useEffect(() => {
    const eventListener = EventRegister.on("changeTheme", (mode) => {
      setThemeMode(mode);
      setNavBar();
    });

    return () => {
      EventRegister.removeEventListener(eventListener);
    };
  });

  useEffect(() => {
    async function prepareSettings() {
      const settingsStr = await AsyncStorageLib.getItem("settings");
      if (settingsStr) {
        const settingsData = JSON.parse(settingsStr);
        const isDarkMode = settingsData[1].data[0].default;
        setThemeMode(isDarkMode);

        await NavigationBar.setButtonStyleAsync(
          !isDarkMode ? theme.light.bar : theme.dark.bar
        );
        await NavigationBar.setBackgroundColorAsync(
          !isDarkMode ? theme.light.background : theme.dark.background
        );
      }
    }
    prepareSettings();
  }, []);

  return (
    <NavigationContainer theme={themeMode ? darkTheme : lightTheme}>
      {token ? <HomeNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default function MainComponent() {
  const [themeMode, setThemeMode] = useState(false);

  useEffect(() => {
    const eventListener = EventRegister.on("changeTheme", (mode) => {
      setThemeMode(mode);
    });

    return () => {
      EventRegister.removeEventListener(eventListener);
    };
  });

  useEffect(() => {
    async function prepareSettings() {
      const settingsStr = await AsyncStorageLib.getItem("settings");
      if (settingsStr) {
        const settingsData = JSON.parse(settingsStr);
        setThemeMode(settingsData[1].data[0].default);
      }
    }
    prepareSettings();
  }, []);

  return (
    <FeedProvider>
      <AccountProvider>
        <CharProvider>
          <AuthProvider>
            <ChallContext>
              <ThemeContext.Provider
                value={themeMode === true ? theme.dark : theme.light}
              >
                <Main />
              </ThemeContext.Provider>
            </ChallContext>
          </AuthProvider>
        </CharProvider>
      </AccountProvider>
    </FeedProvider>
  );
}
