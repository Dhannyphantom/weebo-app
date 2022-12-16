import React from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppText from "./AppText";
import colors from "../constants/colors";
import ActivityIndicator from "./ActivityIndicator";

const screen = Dimensions.get("window");

const AppButton = ({
  sec,
  loading,
  RIcon,
  LIcon,
  style,
  title,
  bare,
  disabled,
  bareWhite,
  bareRed,
  naked,
  onPress,
}) => {
  const noDefault = !sec && !bare && !naked && !bareRed;
  return (
    <>
      {noDefault && (
        <TouchableOpacity
          disabled={disabled}
          activeOpacity={0.85}
          onPress={onPress}
        >
          <View style={[styles.button, style]}>
            {LIcon && (
              <MaterialCommunityIcons
                name={LIcon}
                size={15}
                color={colors.primary}
              />
            )}
            <AppText style={styles.btnText} bold>
              {title}
            </AppText>
            {RIcon && (
              <MaterialCommunityIcons
                name={RIcon}
                size={15}
                color={colors.primary}
              />
            )}
          </View>
          <ActivityIndicator
            style={styles.loader}
            visible={loading}
            size={0.2}
          />
        </TouchableOpacity>
      )}
      {sec && (
        <TouchableOpacity
          disabled={disabled}
          activeOpacity={0.7}
          onPress={onPress}
        >
          <View style={[styles.accent, style]}>
            {LIcon && (
              <MaterialCommunityIcons
                name={LIcon}
                size={15}
                color={colors.primary}
              />
            )}
            <AppText style={styles.btnText} bold>
              {" "}
              {title}{" "}
            </AppText>
            {RIcon && (
              <MaterialCommunityIcons
                name={RIcon}
                size={15}
                color={colors.primary}
              />
            )}
          </View>
        </TouchableOpacity>
      )}
      {bare && (
        <TouchableOpacity
          activeOpacity={bareWhite ? 0.85 : 0.4}
          onPress={onPress}
          disabled={disabled}
        >
          <View
            style={[
              styles.bare,
              {
                backgroundColor: bareWhite ? "white" : "transparent",
                borderWidth: bareWhite ? 0 : 1,
                borderColor: bareRed ? colors.heart : colors.primary,
              },
              style,
            ]}
          >
            {LIcon && (
              <MaterialCommunityIcons
                name={LIcon}
                size={15}
                color={bareRed ? colors.heart : colors.primary}
              />
            )}
            <AppText
              style={{
                ...styles.bareText,
                color: bareRed ? colors.heart : colors.primary,
              }}
              bold
            >
              {" "}
              {title}{" "}
            </AppText>
            {RIcon && (
              <MaterialCommunityIcons
                name={RIcon}
                size={15}
                color={bareRed ? colors.heart : colors.primary}
              />
            )}
          </View>
        </TouchableOpacity>
      )}
      {naked && (
        <TouchableOpacity
          disabled={disabled}
          activeOpacity={0.4}
          onPress={onPress}
        >
          <View style={[styles.naked, style]}>
            {LIcon && (
              <MaterialCommunityIcons
                name={LIcon}
                size={15}
                color={colors.primary}
              />
            )}
            <AppText style={styles.nakedText} bold>
              {" "}
              {title}{" "}
            </AppText>
            {RIcon && (
              <MaterialCommunityIcons
                name={RIcon}
                size={15}
                color={colors.primary}
              />
            )}
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: screen.width * 0.03,
    // padding: 12,
    paddingHorizontal: 30,
    paddingVertical: 16,
    elevation: 2,
    shadowRadius: 6,
    shadowColor: "black",
    shadowOpacity: 0.15,
    shadowOffset: {
      width: 1.5,
      height: 3,
    },
  },
  accent: {
    backgroundColor: colors.accent,
    borderRadius: screen.width * 0.03,
    paddingHorizontal: 30,
    paddingVertical: 16,
  },
  btnText: {
    textTransform: "uppercase",
    color: colors.white,
    letterSpacing: 1,
    textAlign: "center",
  },
  bare: {
    borderWidth: 5,
    borderColor: colors.primary,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 30,
    paddingVertical: 14,
  },
  bareText: {
    color: colors.primary,
  },
  loader: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  naked: {
    // padding: 8,
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "pink",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  nakedText: {
    textTransform: "uppercase",
    color: colors.primary,
  },
});
export default AppButton;
