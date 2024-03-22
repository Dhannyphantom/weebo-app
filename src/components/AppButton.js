import React, { useContext, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { MaterialCommunityIcons, Feather, Ionicons } from "@expo/vector-icons";

import AppText from "./AppText";
import colors from "../constants/colors";
import ActivityIndicator from "./ActivityIndicator";
import ThemeContext from "../config/ThemeContext";

const screen = Dimensions.get("window");

const AppButton = ({
  sec,
  loading,
  RIcon,
  RIconPack = "MCI",
  LIconPack = "MCI",
  LIcon,
  style,
  title,
  bare,
  btnColor = colors.primary,
  disabled,
  btnTextSize,
  bareWhite,
  bareRed,
  naked,
  onPress,
}) => {
  const noDefault = !sec && !bare && !naked && !bareRed;
  const scaler = useRef(new Animated.Value(1)).current;
  const theme = useContext(ThemeContext);

  const handleAnimation = (type) => {
    switch (type) {
      case "in":
        Animated.timing(scaler, {
          toValue: 1.1,
          duration: 80,
          useNativeDriver: true,
        }).start();

        break;
      case "out":
        Animated.spring(scaler, {
          toValue: 1,
          bounciness: 60,
          useNativeDriver: true,
        }).start();

        break;
    }
  };

  let LIconComp = MaterialCommunityIcons;
  let RIconComp = MaterialCommunityIcons;

  switch (LIconPack) {
    case "F":
      LIconComp = Feather;
      break;

    case "I":
      LIconComp = Ionicons;
      break;

    default:
      LIconComp = MaterialCommunityIcons;
      break;
  }
  switch (RIconPack) {
    case "F":
      RIconComp = Feather;
      break;

    case "I":
      RIconComp = Ionicons;
      break;

    default:
      RIconComp = MaterialCommunityIcons;
      break;
  }

  return (
    <>
      <Animated.View
        style={{
          transform: [{ scale: scaler }],
        }}
      >
        {noDefault && (
          <TouchableOpacity
            disabled={disabled}
            activeOpacity={0.85}
            onPressIn={() => handleAnimation("in")}
            onPressOut={() => handleAnimation("out")}
            onPress={onPress}
          >
            <View style={[styles.button, style]}>
              {LIcon && (
                <LIconComp name={LIcon} size={15} color={colors.primary} />
              )}
              <AppText
                style={styles.btnText}
                size={btnTextSize}
                textStyle="black"
              >
                {title}
              </AppText>
              {RIcon && (
                <RIconComp name={RIcon} size={15} color={colors.primary} />
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
            onPressIn={() => handleAnimation("in")}
            onPressOut={() => handleAnimation("out")}
            onPress={onPress}
          >
            <View style={[styles.accent, style]}>
              {LIcon && (
                <LIconComp name={LIcon} size={15} color={colors.primary} />
              )}
              <AppText
                size={btnTextSize}
                style={styles.btnText}
                textStyle="black"
              >
                {title}
              </AppText>
              {RIcon && (
                <RIconComp name={RIcon} size={15} color={colors.primary} />
              )}
            </View>
          </TouchableOpacity>
        )}
        {bare && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPressIn={() => handleAnimation("in")}
            onPressOut={() => handleAnimation("out")}
            onPress={onPress}
            disabled={disabled}
          >
            <View
              style={[
                styles.bare,
                {
                  backgroundColor: bareWhite
                    ? theme.unchange
                    : bareRed
                    ? colors.heartLighter
                    : theme.extralight,
                  borderWidth: bareWhite ? 0 : 1,
                  borderColor: bareRed ? colors.heart : colors.primary,
                },
                style,
              ]}
            >
              {LIcon && (
                <LIconComp
                  name={LIcon}
                  size={15}
                  color={bareRed ? colors.heart : colors.primary}
                />
              )}
              <AppText
                style={{
                  ...styles.bareText,
                  color: bareRed
                    ? colors.heart
                    : theme.mode == "light"
                    ? colors.primary
                    : colors.light,
                }}
                size={btnTextSize}
                textStyle="black"
              >
                {title}
              </AppText>
              {RIcon && (
                <RIconComp
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
            onPressIn={() => handleAnimation("in")}
            onPressOut={() => handleAnimation("out")}
            onPress={onPress}
          >
            <View style={[styles.naked, style]}>
              {LIcon && (
                <LIconComp name={LIcon} size={15} color={colors.primary} />
              )}
              <AppText
                size={btnTextSize}
                style={styles.nakedText}
                textStyle="black"
              >
                {title}
              </AppText>
              {RIcon && (
                <RIconComp name={RIcon} size={15} color={colors.primary} />
              )}
            </View>
          </TouchableOpacity>
        )}
      </Animated.View>
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
    elevation: 1,
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
