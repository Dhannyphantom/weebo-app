import React, { useContext, useEffect, useState } from "react";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { EventRegister } from "react-native-event-listeners";
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

const Otaku = () => {
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

  useEffect(() => {
    const eventListener = EventRegister.on("changeTheme", (mode) => {
      setThemeMode(mode);
    });

    return () => {
      EventRegister.removeEventListener(eventListener);
    };
  });

  useEffect(async () => {
    const settingsStr = await AsyncStorageLib.getItem("settings");
    if (settingsStr) {
      const settingsData = JSON.parse(settingsStr);
      setThemeMode(settingsData[1].data[0].default);
    }
  }, []);

  return (
    <NavigationContainer theme={themeMode ? darkTheme : lightTheme}>
      {token ? <HomeNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default function Providers() {
  const [themeMode, setThemeMode] = useState(false);

  useEffect(() => {
    const eventListener = EventRegister.on("changeTheme", (mode) => {
      setThemeMode(mode);
    });

    return () => {
      EventRegister.removeEventListener(eventListener);
    };
  });

  useEffect(async () => {
    const settingsStr = await AsyncStorageLib.getItem("settings");
    if (settingsStr) {
      const settingsData = JSON.parse(settingsStr);
      setThemeMode(settingsData[1].data[0].default);
    }
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
                <Otaku />
              </ThemeContext.Provider>
            </ChallContext>
          </AuthProvider>
        </CharProvider>
      </AccountProvider>
    </FeedProvider>
  );
}
