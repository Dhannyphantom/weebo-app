import React from "react";
import { View, StyleSheet } from "react-native";
import colors from "../constants/colors";

const Separator = ({ h = 2, m, style }) => {
  return (
    <View
      style={{
        ...styles.container,
        height: h,
        marginVertical: m ? m : 10,
        ...style,
      }}
    ></View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light,
    width: "100%",
  },
});
export default Separator;
