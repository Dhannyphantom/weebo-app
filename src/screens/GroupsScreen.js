import React, { useContext, useState } from "react";
import { View, StyleSheet } from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import ShowGroup from "../components/ShowGroup";
import { Context as AuthContext } from "../config/AuthContext";

const GroupsScreen = () => {
  const {
    notificationSender,
    state: { userInfo },
  } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);

  const handlePress = () => {
    setLoader(true);
    notificationSender(
      {
        data: {
          to: [userInfo.pushToken],
          title: "Weebo Noti Test",
          body: "This is a test notification",
          data: { hello: "world" },
        },
      },
      (resData) => {
        console.log(resData);
        setLoader(false);
      },
      (errData) => {
        console.log(errData);
        setLoader(false);
      }
    );
  };

  return (
    <View style={styles.container}>
      {/* <ShowGroup screen="group" headerTitle="Groups & organizations" /> */}
      <Screen>
        <AppButton title="Send Noti" onPress={handlePress} />
        <AppText> {`Loading is ${loader}...`} </AppText>
      </Screen>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default GroupsScreen;
