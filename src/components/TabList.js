import React, { useContext, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Cards from "./Cards";
import ThemeContext from "../config/ThemeContext";
import { FontAwesome5 } from "@expo/vector-icons";
import AppText from "./AppText";
import colors from "../constants/colors";

const { width, scale } = Dimensions.get("screen");
const TAB_WIDTH = width * 0.9;

export default function TabList({ items = [], state, setState, onPress }) {
  // items = [{ tab: "s", name: "Channels" }]
  // state = { s: true, m: false }
  const theme = useContext(ThemeContext);
  const slider = useRef(new Animated.Value(0)).current;

  const handleTabAnimation = (tab, idx) => {
    Animated.timing(slider, {
      toValue: (TAB_WIDTH / items.length) * idx,
      easing: Easing.elastic(1.3),
      useNativeDriver: true,
    }).start();
    if (setState && tab) {
      const finder = Object.entries(state).find(
        ([_key, val]) => val === true
      )[0];
      setState({ ...state, [finder]: false, [tab]: true });
      return;
    }
    // CODE BELOW DEPRECATED
    // PASS SETSTATE ONLY INSTEAD
    tab && onPress && onPress(tab);
  };

  useEffect(() => {
    const tabIndex = items.findIndex(
      (obj) =>
        Object.entries(state).filter(([_key, val]) => val === true)[0][0] ==
        obj.tab
    );
    handleTabAnimation(null, tabIndex);
  }, [state]);

  return (
    <Cards style={{ ...styles.boxCont, backgroundColor: theme.background }}>
      {items.map((obj, idx) => {
        let sColor;
        if (state[obj.tab]) {
          sColor = colors.primary;
        } else {
          sColor = theme.medium;
        }

        return (
          <TouchableOpacity
            key={idx + obj.tab}
            activeOpacity={0.7}
            onPress={() => handleTabAnimation(obj.tab, idx)}
            style={styles.box}
          >
            <FontAwesome5 name="dot-circle" size={14} color={sColor} />
            <AppText
              numberOfLines={1}
              ellipsizeMode="middle"
              bold
              style={styles.boxText}
            >
              {obj.name ? obj.name : obj.tab}
            </AppText>
          </TouchableOpacity>
        );
      })}
      <Animated.View
        style={[
          styles.slider,
          {
            backgroundColor: theme.unchange,
            width: TAB_WIDTH / items.length,
            transform: [{ translateX: slider }],
          },
        ]}
      />
    </Cards>
  );
}

const styles = StyleSheet.create({
  boxCont: {
    flexDirection: "row",
    width: TAB_WIDTH,
    alignSelf: "center",
    marginVertical: 8,
    overflow: "hidden",
    borderRadius: width * 0.02,
  },
  box: {
    paddingVertical: 20,
    flexDirection: "row",
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  boxText: {
    marginLeft: 9,
    textTransform: "capitalize",
    maxWidth: "70%",
  },
  slider: {
    position: "absolute",
    height: "100%",
    width: 50,
    zIndex: -1,
  },
});
