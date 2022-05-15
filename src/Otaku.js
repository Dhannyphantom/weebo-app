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
import navigationTheme from "./navigation/navigationTheme";
import HomeNavigator from "./navigation/HomeNavigator";
import ThemeContext from "./config/themeContext";

const Otaku = () => {
  const {
    state: { token },
  } = useContext(AuthContext);
  const [themeMode, setThemeMode] = useState(false);

  useEffect(() => {
    const eventListener = EventRegister.on("changeTheme", (mode) => {
      setThemeMode(mode);
    });

    return () => {
      EventRegister.removeEventListener(eventListener);
    };
  });

  return (
    <NavigationContainer theme={navigationTheme}>
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
