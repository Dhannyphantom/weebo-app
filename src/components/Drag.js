import React, { useContext } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import ThemeContext from "../config/themeContext";
import colors from "../constants/colors";

const { width } = Dimensions.get("window");

const Drag = ({ style, panHandlers, onPress }) => {
  const theme = useContext(ThemeContext);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.extralight }, style]}
      onPress={onPress}
      {...panHandlers}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        style={styles.content}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingBottom: 15,
    paddingTop: 10,
    borderTopStartRadius: width * 0.03,
    borderTopEndRadius: width * 0.03,
  },
  content: {
    width: width * 0.1,
    height: width * 0.01,
    alignSelf: "center",
    marginTop: 8,
    borderRadius: 100,
    backgroundColor: colors.light,
  },
});
export default Drag;
