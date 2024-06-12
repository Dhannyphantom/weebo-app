import React, { useContext } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import {
  MaterialCommunityIcons,
  Fontisto,
  Feather,
  Ionicons,
  AntDesign,
} from "@expo/vector-icons";
import AppText from "./AppText";
import colors from "../constants/colors";
import ThemeContext from "../config/ThemeContext";

const Icon = ({
  size = 40,
  name,
  text,
  color = "#000",
  bgColor,
  topText,
  style,
  pack = "a",
  disablePress,
  subText,
  textSize,
  activeOpacity = 0.7,
  curve,
  iconSize = size / 2.5,
  onPress,
}) => {
  let borRadius;
  curve ? (borRadius = 5) : (borRadius = 2);
  const theme = useContext(ThemeContext);
  return (
    <TouchableOpacity
      activeOpacity={disablePress ? 1 : activeOpacity}
      onPress={disablePress ? null : onPress}
    >
      <View
        style={[
          styles.container,
          {
            width: size,
            height: size,
            backgroundColor: bgColor ?? theme.background,
            borderRadius: size / borRadius,
          },
          style,
        ]}
      >
        {name && pack === "a" && !text && (
          <MaterialCommunityIcons name={name} size={iconSize} color={color} />
        )}
        {name && pack === "F" && !text && (
          <Feather name={name} size={iconSize} color={color} />
        )}
        {name && pack === "A" && !text && (
          <AntDesign name={name} size={iconSize} color={color} />
        )}
        {name && pack === "I" && !text && (
          <Ionicons name={name} size={iconSize} color={color} />
        )}
        {name && pack === "b" && !text && (
          <Fontisto name={name} size={iconSize} color={color} />
        )}

        {text && (
          <View style={styles.textCont}>
            {topText && (
              <AppText style={styles.topText} bold>
                {topText}
              </AppText>
            )}
            {name && pack === "a" && (
              <MaterialCommunityIcons
                name={name}
                size={iconSize}
                color={color}
              />
            )}
            {name && pack === "b" && (
              <Fontisto name={name} size={iconSize} color={color} />
            )}
            <AppText size={textSize} style={styles.text} bold>
              {text}
            </AppText>
            {subText && (
              <AppText style={styles.subText} bold>
                {subText}
              </AppText>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    elevation: 1.8,
    shadowRadius: 6,
    shadowColor: "black",
    shadowOpacity: 0.15,
    shadowOffset: {
      width: 0,
      height: 1.8,
    },
    justifyContent: "center",
    alignItems: "center",
  },
  textCont: {
    flex: 1,
    justifyContent: "space-around",
    marginVertical: 8,
  },
  text: {
    textAlign: "center",
  },
  topText: {
    color: colors.medium,
    textAlign: "center",
  },
  subText: {
    color: colors.medium,
    textAlign: "center",
  },
});
export default Icon;
