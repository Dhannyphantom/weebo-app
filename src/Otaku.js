import React, { useContext } from "react";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import {
  Provider as AuthProvider,
  Context as AuthContext,
} from "./config/AuthContext";
import { Provider as CharProvider } from "./config/CharContext";
import { Provider as AccountProvider } from "./config/AcctContext";
import { Provider as FeedProvider } from "./config/FeedContext";
import { Provider as ChallContext } from "./config/ChallContext";

import AuthNavigator from "./navigation/AuthNavigator";
import navigationTheme from "./navigation/navigationTheme";
import HomeNavigator from "./navigation/HomeNavigator";

const Otaku = () => {
  const {
    state: { token },
  } = useContext(AuthContext);

  return (
    <NavigationContainer theme={navigationTheme}>
      {token ? <HomeNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default () => {
  return (
    <FeedProvider>
      <AccountProvider>
        <CharProvider>
          <AuthProvider>
            <ChallContext>
              <Otaku />
            </ChallContext>
          </AuthProvider>
        </CharProvider>
      </AccountProvider>
    </FeedProvider>
  );
};
