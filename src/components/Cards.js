import React from "react";
import { View, StyleSheet } from "react-native";

import colors from "../constants/colors";

const Cards = ({ children, elevation = true, style }) => {
  return (
    <View
      style={{ ...styles.container, elevation: elevation ? 5 : 0, ...style }}
    >
      {children}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    shadowRadius: 6,
    shadowColor: "black",
    shadowOpacity: 0.15,
    shadowOffset: {
      width: 0,
      height: 1.8,
    },
  },
});
export default Cards;
