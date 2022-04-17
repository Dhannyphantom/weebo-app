import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Platform, Dimensions } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

import AppButton from "./AppButton";
import { Context as AuthContext } from "../config/AuthContext";
import ActivityIndicator from "./ActivityIndicator";

const screen = Dimensions.get("window");

const RequestAuth = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const {
    tryLocalSignin,
    setPushToken,
    clearMessage,
    state: { errMsg, userInfo },
  } = useContext(AuthContext);

  const signIN = () => {
    setLoading(true);
    navigation.navigate("Login");
  };

  const registerForPushNotificationsAsync = async () => {
    let token;
    try {
      if (Constants.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          // USE CUSTOM ALERT BOX
          alert("Failed to get push token for push notification!");
          return;
        }

        token = (await Notifications.getExpoPushTokenAsync()).data;
      } else {
        alert("Must use physical device for Push Notifications");
      }

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      return token;
    } catch (err) {
      console.log(err);
    }
  };

  const run = () => {
    clearMessage();
    tryLocalSignin(async () => {
      // const token = await registerForPushNotificationsAsync();
      // if (token) {
      //   setPushToken({ token });
      // }
      // console.log(token);
      navigation.navigate("Welcome");
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      run();
    });

    //remove listener
    return unsubscribe;
  }, []);
  if (errMsg)
    return (
      <View style={styles.container}>
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
