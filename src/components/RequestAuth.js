import React, { useContext, useEffect, useRef, useState } from "react";
import { View, StyleSheet, Platform, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
// import * as Notifications from "expo-notifications";

const appConfig = require("../../app.json");

const projectId = appConfig?.expo?.extra?.eas?.projectId;

import AppButton from "./AppButton";
import { Context as AuthContext } from "../config/AuthContext";
import ActivityIndicator from "./ActivityIndicator";
import ThemeContext from "../config/ThemeContext";

const screen = Dimensions.get("window");

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

const RequestAuth = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const {
    tryLocalSignin,
    clearMessage,
    setPushToken: updateUserPushToken,
    state: { errMsg },
  } = useContext(AuthContext);
  const theme = useContext(ThemeContext);

  const notificationListener = useRef();
  const responseListener = useRef();

  const signIN = () => {
    setLoading(true);
    navigation.navigate("Login");
  };

  const run = () => {
    clearMessage();
    tryLocalSignin(
      async () => {
        //
        // await notificationHandler();
      },
      () => {
        navigation.navigate("Welcome");
      }
    );
  };

  // const notificationHandler = async () => {
  //   // MIGHT WANT TO CALL THIS FUNCTION A LOT
  //   try {
  //     const token = await registerForPushNotificationsAsync();
  //     console.log("EXPO_TOKEN:: ", token);
  //     updateUserPushToken({ token, state: "registered" });
  //   } catch (err) {
  //     console.log(err);
  //   }

  //   notificationListener.current =
  //     Notifications.addNotificationReceivedListener((notification) => {
  //       console.log("recieved", notification);
  //     });

  //   responseListener.current =
  //     Notifications.addNotificationResponseReceivedListener((response) => {
  //       console.log("response recieved", response);
  //     });
  // };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      run();
    });

    return () => {
      // Notifications.removeNotificationSubscription(
      //   notificationListener.current
      // );
      // Notifications.removeNotificationSubscription(responseListener.current);
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

// async function registerForPushNotificationsAsync() {
//   let token;
//   const settings = JSON.parse(await AsyncStorage.getItem("settings"));
//   if (settings) {
//     const shouldNotifyUser = settings.find((obj) => obj.title === "General")
//       .data[2].default;
//     if (!shouldNotifyUser) return;
//   }
//   if (Device.isDevice) {
//     const { status: existingStatus } =
//       await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== "granted") {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== "granted") {
//       console.log("Failed to get push token for push notification!");
//       // DISPLAY AN ALERT OR SOMETHING
//       return;
//     }
//     try {
//       token = (
//         await Notifications.getExpoPushTokenAsync({
//           projectId,
//         })
//       ).data;
//     } catch (err) {
//       console.log(err);
//       // YOU'RE PROBABLY OFFLINE OR PROJECT NOT BUILT WITH FCM KEYS.
//     }
//   } else {
//     console.log("Please use a physical device for Push Notifications");
//   }

//   if (Platform.OS === "android") {
//     Notifications.setNotificationChannelAsync("default", {
//       name: "default",
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       enableVibrate: true,
//       lightColor: "#FF231F7C",
//     });
//   }

//   return token;
// }

// async function schedulePushNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "You've got mail! 📬",
//       body: "Here is the notification body",
//       data: { data: "goes here" },
//     },
//     trigger: { seconds: 2 },
//   });
// }

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
