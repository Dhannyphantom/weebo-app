import {
  Animated,
  Dimensions,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useContext } from "react";
import AppText from "./AppText";
import colors from "../constants/colors";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import ThemeContext from "../config/ThemeContext";

const { width } = Dimensions.get("window");

export default function StickyHeader({ scrollY, title = "DANNY" }) {
  const safeInsets = useSafeAreaInsets();
  const navigation = useNavigation();
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
        height: safeInsets.top + 35,
        backgroundColor: theme.transparentBold,
        ...styles.container,
      }}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => navigation.goBack()}
        style={[styles.icon_container, styles.content]}
      >
        <Feather size={22} color={theme.color} name="chevron-left" />
        <AppText size="xlarge" bold style={styles.text}>
          {title}
        </AppText>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width,
    justifyContent: "flex-end",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    // marginLeft: 15,
    // marginBottom: 10,
  },
  icon_container: {
    padding: 10,
  },
  text: {
    color: colors.primary,
    textTransform: "capitalize",
  },
});
