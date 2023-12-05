import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";

import AppButton from "./AppButton";
import { Context as AuthContext } from "../config/AuthContext";
import ActivityIndicator from "./ActivityIndicator";
import ThemeContext from "../config/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screen = Dimensions.get("window");
// THIS IS THE FIRST SCREEN THAT RENDERS

const RequestAuth = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const {
    tryLocalSignin,
    updateToken,
    clearMessage,

    state: { errMsg },
  } = useContext(AuthContext);
  const theme = useContext(ThemeContext);

  const signIN = () => {
    setLoading(true);
    navigation.navigate("Login");
  };

  const run = async () => {
    const token = await AsyncStorage.getItem("token");
    const feeds = await AsyncStorage.getItem("home_feeds");
    const userInfo = await AsyncStorage.getItem("userInfo");
    if (token && feeds && userInfo) {
      // token && feeds
      updateToken({ token, user: JSON.parse(userInfo) });
    } else {
      clearMessage();
      tryLocalSignin(null, (_err) => {
        navigation.navigate("Welcome");
      });
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      run();
    });

    return () => {
      unsubscribe;
    };
  }, []);
  if (errMsg)
    return (
      <View style={styles.container}>
        <StatusBar style={theme.bar} />
        <View style={styles.loader}>
          <ActivityIndicator
            visible={true}
            type="network"
            size={0.4}
            text={errMsg}
          />
        </View>
        {errMsg.match(/sign in/gi) ? (
          <AppButton
            title="Sign in"
            loading={loading}
            style={styles.btn}
            bare
            onPress={signIN}
          />
        ) : (
          <AppButton title="Retry" style={styles.btn} onPress={run} />
        )}
      </View>
    );
  return <ActivityIndicator visible={true} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    marginVertical: 10,
  },
  loader: {
    width: screen.width,
    height: screen.height * 0.5,
  },
});

export default RequestAuth;
