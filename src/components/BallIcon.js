import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../constants/colors";
import AppText from "./AppText";

const BallIcon = ({
  activeOpacity,
  textSize,
  boldText,
  icon,
  size = 36,
  iconSize = 12,
  text,
  style,
  onPress,
}) => {
  return (
    <>
      <TouchableOpacity
        activeOpacity={activeOpacity ? activeOpacity : 0.72}
        onPress={onPress}
        style={{
          ...styles.iconCont,
          width: size,
          height: size,
          ...style,
        }}
      >
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            color={colors.white}
            size={iconSize}
          />
        )}
        {text && (
          <AppText size={textSize} style={styles.text} bold={boldText}>
            {text}
          </AppText>
        )}
      </TouchableOpacity>
    </>
  );
};
const styles = StyleSheet.create({
  iconCont: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: colors.white,
    fontSize: 14,
  },
});
export default BallIcon;
