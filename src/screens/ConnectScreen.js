import React from "react";
import { View, StyleSheet } from "react-native";
import {} from "expo-location";

import AppText from "../components/AppText";
import ActivityIndicator from "../components/ActivityIndicator";
import useLocation from "../hooks/useLocation";

const ConnectScreen = () => {
  const [location, errLocation] = useLocation();

  console.log(location);

  return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
  activityCont: {
    height: 200,
  },
});
export default ConnectScreen;
