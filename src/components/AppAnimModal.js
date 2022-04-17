import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import colors from "../constants/colors";
import AppText from "./AppText";

const { width, height } = Dimensions.get("window");

const AppAnimModal = () => {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <AppText>Hello</AppText>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  box: {
    width: width * 0.9,
    height: width * 0.4,
    backgroundColor: colors.white,
  },
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
});
export default AppAnimModal;
