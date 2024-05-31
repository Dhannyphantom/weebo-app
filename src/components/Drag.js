import React from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import colors from "../constants/colors";

const { width } = Dimensions.get("window");

const Drag = ({ style, panHandlers, onPress }) => {
  return (
    <View style={[styles.container, style]} onPress={onPress} {...panHandlers}>
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
    paddingBottom: 4,
    paddingTop: 8,
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
