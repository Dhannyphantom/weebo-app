import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import ThemeContext from "../config/ThemeContext";

const Separator = ({ h = 2, m, style }) => {
  const theme = useContext(ThemeContext);
  return (
    <View
      style={{
        ...styles.container,
        height: h,
        backgroundColor: theme.backgroundLight ?? "#ddd",
        marginVertical: m ? m : 10,
        ...style,
      }}
    ></View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
export default Separator;
