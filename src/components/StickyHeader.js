import { Animated, Dimensions, StyleSheet } from "react-native";
import React, { useContext } from "react";
import AppText from "./AppText";
import colors from "../constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ThemeContext from "../config/ThemeContext";

const { width } = Dimensions.get("window");

export default function StickyHeader({ scrollY, title = "DANNY" }) {
  const safeInsets = useSafeAreaInsets();
  const theme = useContext(ThemeContext);
  const scroller = scrollY?.interpolate({
    inputRange: [0, 100, 200],
    outputRange: [-100, -100, 0],
    extrapolate: "clamp",
  });

  const opaciter = scrollY?.interpolate({
    inputRange: [0, 150, 200],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={{
        transform: [{ translateY: scroller }],
        opacity: opaciter,
        height: safeInsets.top + 20,
        backgroundColor: theme.background,
        ...styles.container,
      }}
    >
      <AppText size="xlarge" bold style={styles.text}>
        {title}
      </AppText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width,
    justifyContent: "flex-end",
  },
  text: {
    color: colors.primary,
    marginLeft: 15,
    marginBottom: 10,
    textTransform: "capitalize",
  },
});
